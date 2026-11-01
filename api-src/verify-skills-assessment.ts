import crypto from 'crypto';
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendSkillsAssessmentEmail } from './utils/mailer.js';

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

const saveLocalSkillsAssessments = (assessments: any[]) => {
  try {
    fs.writeFileSync(LOCAL_ASSESSMENTS_PATH, JSON.stringify(assessments, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local skills assessments file:', error);
  }
};

const hasPostgres = () => {
  return !!(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
};

const cleanEnvVar = (val?: string) => {
  if (!val) return '';
  let cleaned = val.trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1);
  }
  if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
    cleaned = cleaned.slice(1, -1);
  }
  return cleaned.trim();
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, assessment } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required parameters for verification' });
  }

  const key_secret = cleanEnvVar(process.env.RAZORPAY_KEY_SECRET);

  try {
    let isValid = false;

    if (key_secret) {
      const hmac = crypto.createHmac('sha256', key_secret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generated_signature = hmac.digest('hex');
      isValid = generated_signature === razorpay_signature;
    } else {
      console.warn('RAZORPAY_KEY_SECRET is not configured. Defaulting to invalid for production.');
    }

    if (isValid) {
      console.log(`Payment successfully verified for Skills Assessment Order: ${razorpay_order_id}`);

      if (assessment) {
        const verifiedAssessment = {
          ...assessment,
          paymentMethod: razorpay_payment_id === 'test_payment_id' ? 'Simulated' : 'Razorpay',
          paymentStatus: 'Paid',
          createdAt: new Date().toISOString(),
          emailStatus: 'Pending'
        };

        // Dispatch confirmation email
        const emailSent = await sendSkillsAssessmentEmail(verifiedAssessment);
        verifiedAssessment.emailStatus = emailSent ? 'Sent' : 'Failed';

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

            await sql`
              INSERT INTO skills_assessments (
                id, first_name, last_name, email, playing_role, sub_role,
                payment_status, submitted_at, assessment_data
              ) VALUES (
                ${verifiedAssessment.id}, ${verifiedAssessment.firstName}, ${verifiedAssessment.lastName}, ${verifiedAssessment.email},
                ${verifiedAssessment.playingRole}, ${verifiedAssessment.subRole}, ${verifiedAssessment.paymentStatus}, ${verifiedAssessment.submittedAt},
                ${JSON.stringify(verifiedAssessment)}
              )
            `;
            console.log(`Saved new skills assessment to Postgres: ${verifiedAssessment.id}`);
          } catch (dbError) {
            console.error('Failed to save skills assessment to Postgres, falling back to local file:', dbError);
            const assessments = getLocalSkillsAssessments();
            assessments.push(verifiedAssessment);
            saveLocalSkillsAssessments(assessments);
          }
        } else {
          const assessments = getLocalSkillsAssessments();
          assessments.push(verifiedAssessment);
          saveLocalSkillsAssessments(assessments);
          console.log(`Saved new skills assessment locally: ${verifiedAssessment.id}`);
        }

        return res.status(200).json({ status: 'success', message: 'Payment verified successfully', referenceNumber: verifiedAssessment.id });
      }

      return res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
    } else {
      console.warn(`Signature mismatch for Skills Assessment Order: ${razorpay_order_id}`);
      return res.status(400).json({ status: 'failed', message: 'Signature verification failed' });
    }
  } catch (error: any) {
    console.error('Error during signature verification:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
