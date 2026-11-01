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

const saveLocalCvs = (cvs: any[]) => {
  try {
    fs.writeFileSync(LOCAL_CVS_PATH, JSON.stringify(cvs, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local cvs file:', error);
  }
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

const saveLocalUsers = (users: any[]) => {
  try {
    fs.writeFileSync(LOCAL_USERS_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local users file:', error);
  }
};

const hasPostgres = () => {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  const { cv } = req.body;
  if (!cv) {
    return res.status(400).json({ error: 'Invalid CV data' });
  }

  try {
    // 1. Ensure Table Exists
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
    }

    let existingCv: any = null;
    if (hasPostgres()) {
      const q = await sql`SELECT * FROM cvs WHERE email = ${decoded.email} LIMIT 1`;
      if (q.rows.length > 0) {
        existingCv = q.rows[0];
      }
    } else {
      const cvs = getLocalCvs();
      existingCv = cvs.find((c: any) => c.userId === decoded.userId);
    }

    // Stable ID per player so the browser and server always agree on which CV this is
    const cvId = existingCv ? existingCv.id : `cv_${decoded.userId}`;
    const refNum = existingCv ? existingCv.reference_number : `TCA-CV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    let newEditsUsed = existingCv ? (existingCv.edits_used || 0) : 0;
    const editsAllowed = existingCv ? (existingCv.edits_allowed || 5) : 5;

    // Identity Lock Check & Update Profile Lock on purchase
    // Payment status comes ONLY from the database (set by cv-verify-payment), never from the browser
    const isPaid = existingCv ? (existingCv.payment_status === 'Paid') : false;
    const isLocked = existingCv ? (existingCv.identity_locked || false) : false;
    const isStyleUpdate = req.body.isStyleUpdate === true;

    // Track Edits (Only count edits after CV is paid and it is not a style-only update)
    if (isPaid && existingCv && !isStyleUpdate) {
      if (newEditsUsed >= editsAllowed) {
        return res.status(403).json({
          error: 'edit_limit_reached',
          message: 'You have used all 5 edits for this year. Please contact admin to reset.'
        });
      }
      newEditsUsed += 1;
    }

    const updatedCv = {
      ...cv,
      id: cvId,
      userId: decoded.userId,
      referenceNumber: refNum,
      paymentStatus: isPaid ? 'Paid' : 'Pending',
      downloadStatus: isPaid ? 'UNLOCKED' : 'LOCKED',
      editsUsed: newEditsUsed,
      editsAllowed: editsAllowed,
      identityLocked: isPaid // Lock if paid
    };

    let userDetails: any = null;
    if (hasPostgres()) {
      const u = await sql`SELECT * FROM cv_users WHERE id = ${decoded.userId} LIMIT 1`;
      if (u.rows.length > 0) userDetails = u.rows[0];
    } else {
      const users = getLocalUsers();
      userDetails = users.find((u: any) => u.id === decoded.userId);
    }

    if (userDetails) {
      updatedCv.firstName = userDetails.first_name || userDetails.firstName || '';
      updatedCv.lastName = userDetails.last_name || userDetails.lastName || '';
      updatedCv.email = userDetails.email || decoded.email || '';
      updatedCv.phone = userDetails.mobile_number || userDetails.mobileNumber || '';
      updatedCv.countryOfResidence = userDetails.country || '';
      updatedCv.currentCity = userDetails.state_province || userDetails.stateProvince || '';
      updatedCv.nationality = userDetails.nationality || '';
      updatedCv.dateOfBirth = userDetails.date_of_birth || userDetails.dateOfBirth || '';
    }

    // If identity is locked, keep the original name/DOB/nationality
    if (isLocked && existingCv) {
      const originalData = typeof existingCv.cv_data === 'string' ? JSON.parse(existingCv.cv_data) : existingCv;
      if (originalData.firstName) updatedCv.firstName = originalData.firstName;
      if (originalData.lastName) updatedCv.lastName = originalData.lastName;
      if (originalData.nationality) updatedCv.nationality = originalData.nationality;
      if (originalData.dateOfBirth) updatedCv.dateOfBirth = originalData.dateOfBirth;
    }

    if (hasPostgres()) {
      await sql`
        INSERT INTO cvs (
          id, user_id, reference_number, first_name, last_name, email, payment_status, download_status, edits_used, edits_allowed, identity_locked, cv_data, created_at
        ) VALUES (
          ${cvId}, ${decoded.userId}, ${refNum}, ${updatedCv.firstName || ''}, ${updatedCv.lastName || ''}, ${decoded.email || ''}, ${updatedCv.paymentStatus || 'Pending'}, ${updatedCv.downloadStatus || 'LOCKED'}, ${newEditsUsed}, ${editsAllowed}, ${updatedCv.identityLocked || false}, ${JSON.stringify(updatedCv)}, ${new Date().toISOString()}
        )
        ON CONFLICT (id) DO UPDATE SET
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          payment_status = EXCLUDED.payment_status,
          download_status = EXCLUDED.download_status,
          edits_used = EXCLUDED.edits_used,
          identity_locked = EXCLUDED.identity_locked,
          cv_data = EXCLUDED.cv_data;
      `;
    } else {
      const cvs = getLocalCvs();
      const index = cvs.findIndex((c: any) => c.id === cvId);
      if (index > -1) {
        cvs[index] = updatedCv;
      } else {
        cvs.push(updatedCv);
      }
      saveLocalCvs(cvs);

      // Also lock details inside local user db if paid
      if (updatedCv.paymentStatus === 'Paid') {
        const users = getLocalUsers();
        const uIdx = users.findIndex(u => u.id === decoded.userId);
        if (uIdx > -1) {
          users[uIdx].firstName = updatedCv.firstName;
          users[uIdx].lastName = updatedCv.lastName;
          users[uIdx].identityLocked = true;
          saveLocalUsers(users);
        }
      }
    }

    return res.status(200).json({
      status: 'success',
      message: 'CV saved successfully',
      cv: updatedCv
    });

  } catch (error: any) {
    console.error('Error saving CV:', error);
    return res.status(500).json({ error: error.message || 'Failed to save CV' });
  }
}
