import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from './utils/cv-auth.js';

const LOCAL_CVS_PATH = path.join(process.cwd(), 'cvs-db.json');
const LOCAL_USERS_PATH = path.join(process.cwd(), 'cv-users-db.json');

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
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
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
      await sql`
        CREATE TABLE IF NOT EXISTS cvs (
          id VARCHAR(50) PRIMARY KEY,
          user_id VARCHAR(50) NOT NULL,
          reference_number VARCHAR(100) NOT NULL,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          payment_status VARCHAR(50) NOT NULL,
          download_status VARCHAR(50) NOT NULL,
          edits_used INTEGER DEFAULT 0,
          edits_allowed INTEGER DEFAULT 5,
          identity_locked BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          cv_data TEXT NOT NULL
        );
      `;
      try {
        await sql`ALTER TABLE cvs ADD COLUMN IF NOT EXISTS user_id VARCHAR(50);`;
        await sql`ALTER TABLE cvs ADD COLUMN IF NOT EXISTS edits_used INTEGER DEFAULT 0;`;
        await sql`ALTER TABLE cvs ADD COLUMN IF NOT EXISTS edits_allowed INTEGER DEFAULT 5;`;
        await sql`ALTER TABLE cvs ADD COLUMN IF NOT EXISTS identity_locked BOOLEAN DEFAULT FALSE;`;
      } catch (migErr) {
        console.error("Error migrating cvs columns:", migErr);
      }
      const q = await sql`SELECT * FROM cvs WHERE email = ${decoded.email} LIMIT 1`;
      if (q.rows.length > 0) {
        dbCv = q.rows[0];
      }
    } else {
      const cvs = getLocalCvs();
      dbCv = cvs.find((c: any) => c.userId === decoded.userId);
    }

    let userDetails: any = null;
    if (hasPostgres()) {
      const u = await sql`SELECT * FROM cv_users WHERE id = ${decoded.userId} LIMIT 1`;
      if (u.rows.length > 0) userDetails = u.rows[0];
    } else {
      const users = getLocalUsers();
      userDetails = users.find((u: any) => u.id === decoded.userId);
    }

    if (dbCv) {
      const cvData = hasPostgres() ? JSON.parse(dbCv.cv_data) : dbCv;
      if (userDetails) {
        cvData.firstName = userDetails.first_name || userDetails.firstName || '';
        cvData.lastName = userDetails.last_name || userDetails.lastName || '';
        cvData.email = userDetails.email || decoded.email || '';
        cvData.phone = userDetails.mobile_number || userDetails.mobileNumber || '';
        cvData.countryOfResidence = userDetails.country || '';
        cvData.currentCity = userDetails.state_province || userDetails.stateProvince || '';
        cvData.nationality = userDetails.nationality || '';
        cvData.dateOfBirth = userDetails.date_of_birth || userDetails.dateOfBirth || '';
      }
      return res.status(200).json({ cv: cvData });
    } else {

      const initialCv = {
        id: `cv_${decoded.userId}`, // stable ID (previously changed on every request)
        userId: decoded.userId,
        referenceNumber: `TCA-CV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
        templateId: 'prestige',
        font: 'Inter',
        accentColour: '#0B1A30',
        paymentStatus: 'Pending',
        downloadStatus: 'LOCKED',
        firstName: userDetails ? (userDetails.first_name || userDetails.firstName || '') : '',
        lastName: userDetails ? (userDetails.last_name || userDetails.lastName || '') : '',
        email: decoded.email,
        phone: userDetails ? (userDetails.mobile_number || userDetails.mobileNumber || '') : '',
        countryOfResidence: userDetails ? (userDetails.country || '') : '',
        currentCity: userDetails ? (userDetails.state_province || '') : '',
        nationality: userDetails ? (userDetails.nationality || '') : '',
        dateOfBirth: userDetails ? (userDetails.date_of_birth || userDetails.dateOfBirth || '') : '',
        careerHistory: [],
        statistics: [],
        achievements: [],
        experience: [],
        education: [],
        certifications: [],
        references: [],
        showReferences: 'show',
        declarationAccepted: false,
        editsAllowed: 5,
        editsUsed: 0
      };

      return res.status(200).json({ cv: initialCv });
    }

  } catch (error: any) {
    console.error('Error fetching CV:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch CV' });
  }
}
