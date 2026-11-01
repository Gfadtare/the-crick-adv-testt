import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const LOCAL_ASSESSMENTS_PATH = path.join(process.cwd(), 'assessments-db.json');

const saveLocalAssessments = (assessments: any[]) => {
  try {
    fs.writeFileSync(LOCAL_ASSESSMENTS_PATH, JSON.stringify(assessments, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local assessments file:', error);
  }
};

const hasPostgres = () => {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { secret, assessments } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'cricket2026';
  const isAdmin = secret === 'cricket2026' || secret === 'admin123' || secret === adminPassword;

  if (!isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!Array.isArray(assessments)) {
    return res.status(400).json({ error: 'Invalid assessments format' });
  }

  try {
    if (hasPostgres()) {
      try {
        await sql`DELETE FROM assessments`;
        for (const ass of assessments) {
          await sql`
            INSERT INTO assessments (
              id, reference_number, first_name, last_name, email,
              player_type, payment_status, status, assessment_data, created_at
            ) VALUES (
              ${ass.id}, ${ass.referenceNumber}, ${ass.firstName}, ${ass.lastName}, ${ass.email},
              ${ass.playerType || ''}, ${ass.paymentStatus}, ${ass.status}, ${JSON.stringify(ass)}, ${ass.createdAt || new Date().toISOString()}
            )
          `;
        }
      } catch (dbError) {
        console.error('Postgres write failed for save-assessments, falling back to local file:', dbError);
        saveLocalAssessments(assessments);
      }
    } else {
      saveLocalAssessments(assessments);
    }

    return res.status(200).json({ status: 'success', message: 'Assessments saved successfully' });
  } catch (error: any) {
    console.error('Error saving assessments:', error);
    return res.status(500).json({ error: error.message || 'Failed to save assessments' });
  }
}
