import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from './utils/cv-auth.js';

const LOCAL_USERS_PATH = path.join(process.cwd(), 'cv-users-db.json');

const getLocalUsers = (): any[] => {
  try {
    if (fs.existsSync(LOCAL_USERS_PATH)) {
      return JSON.parse(fs.readFileSync(LOCAL_USERS_PATH, 'utf-8'));
    }
  } catch (error) {
    console.error('Error reading local users file:', error);
  }
  return [];
};

const hasPostgres = () => {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.CV_JWT_SECRET || 'tca_cv_default_jwt_secret_key_2026';

  const decoded = verifyToken(token, jwtSecret);

  if (!decoded || !decoded.userId) {
    return res.status(401).json({ error: 'Session expired or invalid token' });
  }

  try {
    let dbUser: any = null;

    if (hasPostgres()) {
      try {
        await sql`ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS nationality VARCHAR(255);`;
        await sql`ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS date_of_birth VARCHAR(255);`;
        await sql`ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS country VARCHAR(255);`;
        await sql`ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS state_province VARCHAR(255);`;
        await sql`ALTER TABLE cv_users ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(255);`;
      } catch (colErr) {
        console.error("Error migrating cv_users table schema:", colErr);
      }
      const userRes = await sql`SELECT * FROM cv_users WHERE id = ${decoded.userId} LIMIT 1`;
      if (userRes.rows.length > 0) {
        dbUser = userRes.rows[0];
        // (Removed: 'legacy patch' that overwrote blank profile fields with placeholder values.)
      }
    } else {
      const users = getLocalUsers();
      dbUser = users.find((u: any) => u.id === decoded.userId);
    }

    if (!dbUser) {
      return res.status(404).json({ error: 'User account not found' });
    }

    return res.status(200).json({
      user: {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.first_name || dbUser.firstName,
        lastName: dbUser.last_name || dbUser.lastName,
        country: dbUser.country || '',
        stateProvince: dbUser.state_province || dbUser.stateProvince || '',
        mobileNumber: dbUser.mobile_number || dbUser.mobileNumber || '',
        nationality: dbUser.nationality || '',
        dateOfBirth: dbUser.date_of_birth || dbUser.dateOfBirth || ''
      }
    });

  } catch (error: any) {
    console.error('Session check error:', error);
    return res.status(500).json({ error: error.message || 'Session verification error' });
  }
}
