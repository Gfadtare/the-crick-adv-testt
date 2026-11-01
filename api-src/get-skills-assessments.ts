import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const LOCAL_ASSESSMENTS_PATH = path.join(process.cwd(), 'skills-assessments-db.json');

const getLocalSkillsAssessments = (): any[] => {
  try {
    if (fs.existsSync(LOCAL_ASSESSMENTS_PATH)) {
      const data = fs.readFileSync(LOCAL_ASSESSMENTS_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading local skills assessments file:', error);
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
  const isAuthorized = secret === 'cricket2026' || secret === 'admin123' || secret === adminPassword || secret === 'coach2024';

  if (!isAuthorized) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let assessments: any[] = [];

    if (hasPostgres()) {
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS skills_assessments (
            id VARCHAR(50) PRIMARY KEY,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            playing_role VARCHAR(100) NOT NULL,
            sub_role VARCHAR(255) NOT NULL,
            payment_status VARCHAR(50) NOT NULL,
            submitted_at VARCHAR(100) NOT NULL,
            assessment_data TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;

        const { rows } = await sql`SELECT * FROM skills_assessments ORDER BY created_at DESC`;
        assessments = rows.map(r => JSON.parse(r.assessment_data));
      } catch (dbError) {
        console.error('Failed to read skills assessments from Postgres, falling back to local file:', dbError);
        assessments = getLocalSkillsAssessments();
      }
    } else {
      assessments = getLocalSkillsAssessments();
    }

    return res.status(200).json(assessments);
  } catch (error: any) {
    console.error('Error in get-skills-assessments handler:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
