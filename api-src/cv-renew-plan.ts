import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from './utils/cv-auth.js';
import { isAdminSecret } from './utils/admin-auth.js';

const LOCAL_CVS_PATH = path.join(process.cwd(), 'cvs-db.json');

const getLocalCvs = (): any[] => {
  try {
    if (fs.existsSync(LOCAL_CVS_PATH)) {
      return JSON.parse(fs.readFileSync(LOCAL_CVS_PATH, 'utf-8'));
    }
  } catch (error) {
    console.error('Error reading local CVs file:', error);
  }
  return [];
};

const saveLocalCvs = (cvs: any[]) => {
  try {
    fs.writeFileSync(LOCAL_CVS_PATH, JSON.stringify(cvs, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local CVs db:', error);
  }
};

const hasPostgres = () => {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Previously any logged-in player could call this to reset their edits for free.
  // Renewals must go through Razorpay (cv-verify-payment). Kept only as an admin tool.
  if (!isAdminSecret(req.body?.secret)) {
    return res.status(403).json({ error: 'Renewal requires payment' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.CV_JWT_SECRET || 'tca_cv_default_jwt_secret_key_2026';
  const decoded = verifyToken(token, jwtSecret);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    if (hasPostgres()) {
      const q = await sql`SELECT * FROM cvs WHERE email = ${decoded.email} LIMIT 1`;
      if (q.rows.length === 0) {
        return res.status(404).json({ error: 'CV not found' });
      }
      const existingCv = q.rows[0];
      const cvData = JSON.parse(existingCv.cv_data);

      cvData.editsUsed = 0;
      cvData.editsAllowed = 5;

      await sql`
        UPDATE cvs SET
          edits_used = 0,
          edits_allowed = 5,
          cv_data = ${JSON.stringify(cvData)}
        WHERE email = ${decoded.email}
      `;
      return res.status(200).json({ status: 'success', cv: cvData });
    } else {
      const cvs = getLocalCvs();
      const idx = cvs.findIndex((c: any) => c.userId === decoded.userId);
      if (idx > -1) {
        cvs[idx].editsUsed = 0;
        cvs[idx].editsAllowed = 5;
        saveLocalCvs(cvs);
        return res.status(200).json({ status: 'success', cv: cvs[idx] });
      }
      return res.status(404).json({ error: 'CV not found' });
    }
  } catch (error: any) {
    console.error('Error renewing plan:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
