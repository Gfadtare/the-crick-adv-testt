import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';

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

const hasPostgres = () => {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { secret } = req.query;
  const adminPassword = process.env.ADMIN_PASSWORD || 'cricket2026';
  const isAuthorized = secret === 'cricket2026' || secret === 'admin123' || secret === adminPassword;

  if (!isAuthorized) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let cvs: any[] = [];

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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            cv_data TEXT NOT NULL
          );
        `;

        const { rows } = await sql`SELECT * FROM cvs ORDER BY created_at DESC`;
        cvs = rows.map(r => JSON.parse(r.cv_data));
      } catch (dbError) {
        console.error('Failed to read cvs from Postgres, falling back to local file:', dbError);
        cvs = getLocalCvs();
      }
    } else {
      cvs = getLocalCvs();
    }

    return res.status(200).json(cvs);
  } catch (error: any) {
    console.error('Error in get-cvs handler:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
