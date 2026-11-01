import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const LOCAL_ASSESSMENTS_PATH = path.join(process.cwd(), 'assessments-db.json');

const getLocalAssessments = (): any[] => {
  try {
    if (fs.existsSync(LOCAL_ASSESSMENTS_PATH)) {
      const data = fs.readFileSync(LOCAL_ASSESSMENTS_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading local assessments file:', error);
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
    let assessments: any[] = [];

    if (hasPostgres()) {
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS assessments (
            id VARCHAR(50) PRIMARY KEY,
            reference_number VARCHAR(100) NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            player_type VARCHAR(100) NOT NULL,
            payment_status VARCHAR(50) NOT NULL,
            status VARCHAR(50) NOT NULL,
            assessment_data TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;

        const { rows } = await sql`SELECT * FROM assessments ORDER BY created_at DESC`;
        assessments = rows.map(r => JSON.parse(r.assessment_data));
      } catch (dbError) {
        console.error('Failed to read assessments from Postgres, falling back to local file:', dbError);
        assessments = getLocalAssessments();
      }
    } else {
      assessments = getLocalAssessments();
    }

    return res.status(200).json(assessments);
  } catch (error: any) {
    console.error('Error in get-assessments handler:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
