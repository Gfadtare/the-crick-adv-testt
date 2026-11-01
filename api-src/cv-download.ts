import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from './utils/cv-auth.js';

const LOCAL_CVS_PATH = path.join(process.cwd(), 'cvs-db.json');

const getLocalCvs = (): any[] => {
  try {
    if (fs.existsSync(LOCAL_CVS_PATH)) {
      return JSON.parse(fs.readFileSync(LOCAL_CVS_PATH, 'utf-8'));
    }
  } catch (error) {
    console.error('Error reading local cvs file:', error);
  }
  return [];
};

const hasPostgres = () => {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization;
  const cvId = req.query.cvId as string;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (!cvId) {
    return res.status(400).json({ error: 'CV ID is required' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.CV_JWT_SECRET || 'tca_cv_default_jwt_secret_key_2026';
  const decoded = verifyToken(token, jwtSecret);

  if (!decoded || !decoded.userId) {
    return res.status(401).json({ error: 'Session expired or invalid token' });
  }

  try {
    let dbCv: any = null;

    if (hasPostgres()) {
      const q = await sql`SELECT * FROM cvs WHERE id = ${cvId} LIMIT 1`;
      if (q.rows.length > 0) {
        dbCv = q.rows[0];
      }
    } else {
      const cvs = getLocalCvs();
      dbCv = cvs.find((c: any) => c.id === cvId);
    }

    if (!dbCv) {
      return res.status(404).json({ error: 'CV record not found' });
    }

    const cvData = hasPostgres() ? JSON.parse(dbCv.cv_data) : dbCv;

    // Security Check: Verify user owns this CV (IDOR protection)
    if (cvData.userId !== decoded.userId) {
      return res.status(403).json({ error: 'Access Denied: You do not own this CV' });
    }

    // Security Check: Verify payment status
    if (cvData.paymentStatus !== 'Paid') {
      return res.status(402).json({ error: 'Payment Required: Please complete payment to unlock clean download.' });
    }

    return res.status(200).json({ 
      status: 'success', 
      message: 'CV verified for clean download.',
      cv: cvData 
    });

  } catch (error: any) {
    console.error('Download verification error:', error);
    return res.status(500).json({ error: error.message || 'Verification failure' });
  }
}
