import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAdminSecret } from './utils/admin-auth.js';

const LOCAL_CVS_PATH = path.join(process.cwd(), 'cvs-db.json');

const getLocalCvs = (): any[] => {
  try {
    if (fs.existsSync(LOCAL_CVS_PATH)) {
      const data = fs.readFileSync(LOCAL_CVS_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading local cvs file:', error);
  }
  return [];
};

const saveLocalCvs = (cvs: any[]) => {
  try {
    fs.writeFileSync(LOCAL_CVS_PATH, JSON.stringify(cvs, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local cvs file:', error);
  }
};

const hasPostgres = () => {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Admin-only: this endpoint can set payment status and edit counts directly.
  // Previously it had no protection, so anyone could mark any CV as paid.
  if (!isAdminSecret(req.body?.secret)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { cv } = req.body;
  if (!cv || !cv.id) {
    return res.status(400).json({ error: 'Invalid CV data' });
  }

  try {
    if (hasPostgres()) {
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS cvs (
            id VARCHAR(50) PRIMARY KEY,
            reference_number VARCHAR(100) NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            payment_status VARCHAR(50) NOT NULL,
            download_status VARCHAR(50) NOT NULL,
            edits_used INTEGER DEFAULT 0,
            edits_allowed INTEGER DEFAULT 5,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            cv_data TEXT NOT NULL
          );
        `;

        // Upsert the CV using INSERT ... ON CONFLICT
        await sql`
          INSERT INTO cvs (
            id, reference_number, first_name, last_name, email,
            payment_status, download_status, edits_used, edits_allowed, cv_data, created_at
          ) VALUES (
            ${cv.id}, ${cv.referenceNumber}, ${cv.firstName}, ${cv.lastName}, ${cv.email},
            ${cv.paymentStatus || 'Pending'}, ${cv.downloadStatus || 'LOCKED'}, ${cv.editsUsed || 0}, ${cv.editsAllowed || 5}, ${JSON.stringify(cv)}, ${cv.createdAt || new Date().toISOString()}
          )
          ON CONFLICT (id) DO UPDATE SET
            reference_number = EXCLUDED.reference_number,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            email = EXCLUDED.email,
            payment_status = EXCLUDED.payment_status,
            download_status = EXCLUDED.download_status,
            edits_used = EXCLUDED.edits_used,
            edits_allowed = EXCLUDED.edits_allowed,
            cv_data = EXCLUDED.cv_data;
        `;
      } catch (dbError) {
        console.error('Postgres write failed for save-cv, falling back to local file:', dbError);
        const cvs = getLocalCvs();
        const index = cvs.findIndex((c: any) => c.id === cv.id);
        if (index > -1) {
          cvs[index] = cv;
        } else {
          cvs.push(cv);
        }
        saveLocalCvs(cvs);
      }
    } else {
      const cvs = getLocalCvs();
      const index = cvs.findIndex((c: any) => c.id === cv.id);
      if (index > -1) {
        cvs[index] = cv;
      } else {
        cvs.push(cv);
      }
      saveLocalCvs(cvs);
    }

    return res.status(200).json({ status: 'success', message: 'CV saved successfully' });
  } catch (error: any) {
    console.error('Error saving CV:', error);
    return res.status(500).json({ error: error.message || 'Failed to save CV' });
  }
}
