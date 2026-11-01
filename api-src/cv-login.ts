import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { hashPassword, signToken } from './utils/cv-auth.js';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sanitizedEmail = email.toLowerCase().trim();

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
      const userRes = await sql`SELECT * FROM cv_users WHERE email = ${sanitizedEmail} LIMIT 1`;
      if (userRes.rows.length > 0) {
        dbUser = userRes.rows[0];
      }
    } else {
      const users = getLocalUsers();
      dbUser = users.find((u: any) => u.email === sanitizedEmail);
    }

    if (!dbUser) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify Password
    const computedHash = hashPassword(password, dbUser.password_salt || dbUser.password_salt);
    if (computedHash !== dbUser.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Verify Email is Verified
    if (!dbUser.email_verified) {
      return res.status(403).json({ 
        error: 'email_unverified',
        message: 'Please verify your email address before logging in.' 
      });
    }

    // (Removed: a 'legacy patch' here overwrote blank profile fields with placeholder
    //  values such as a fixed mobile number and date of birth '28' on every login.)

    // Generate JWT Token
    const jwtSecret = process.env.CV_JWT_SECRET || 'tca_cv_default_jwt_secret_key_2026';
    const payload = {
      userId: dbUser.id,
      email: dbUser.email,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days expiry
    };
    const token = signToken(payload, jwtSecret);

    return res.status(200).json({
      token,
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
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message || 'Authentication error' });
  }
}
