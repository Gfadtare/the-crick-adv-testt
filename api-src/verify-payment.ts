import crypto from 'crypto';
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendBookingEmail, sendAssessmentEmail } from './utils/mailer.js';

const LOCAL_DB_PATH = path.join(process.cwd(), 'bookings-db.json');
const LOCAL_ASSESSMENTS_PATH = path.join(process.cwd(), 'assessments-db.json');

const getLocalBookings = (): any[] => {
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading local bookings file:', error);
  }
  return [];
};

const saveLocalBookings = (bookings: any[]) => {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local bookings file:', error);
  }
};

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

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking, assessment } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required parameters for verification' });
  }

  const key_secret = cleanEnvVar(process.env.RAZORPAY_KEY_SECRET);
  if (!key_secret) {
    console.error('RAZORPAY_KEY_SECRET is not configured.');
    return res.status(500).json({ error: 'Server configuration error: missing Razorpay secret' });
  }

  try {
    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      if (booking) {
        const verifiedBooking = {
          ...booking,
          paymentMethod: 'Razorpay',
          paymentStatus: 'Paid',
          bookingStatus: 'Approved',
          createdAt: new Date().toISOString()
        };

        if (hasPostgres()) {
          try {
            // Check if already booked
            const { rows } = await sql`
              SELECT id FROM bookings 
              WHERE booking_date = ${verifiedBooking.date} AND time_slot = ${verifiedBooking.timeSlot}
              LIMIT 1
            `;

            if (rows.length === 0) {
              await sql`
                INSERT INTO bookings (
                  id, full_name, email, whatsapp, country, playing_level,
                  package_id, package_name, price, booking_date, time_slot,
                  purpose, payment_method, payment_status, booking_status,
                  zoom_link, meeting_id, created_at
                ) VALUES (
                  ${verifiedBooking.id}, ${verifiedBooking.fullName}, ${verifiedBooking.email}, ${verifiedBooking.whatsApp}, ${verifiedBooking.country}, ${verifiedBooking.playingLevel},
                  ${verifiedBooking.packageId}, ${verifiedBooking.packageName}, ${verifiedBooking.price}, ${verifiedBooking.date}, ${verifiedBooking.timeSlot},
                  ${verifiedBooking.purpose || ''}, ${verifiedBooking.paymentMethod}, ${verifiedBooking.paymentStatus}, ${verifiedBooking.bookingStatus},
                  ${verifiedBooking.zoomLink || ''}, ${verifiedBooking.meetingId || ''}, ${verifiedBooking.createdAt}
                )
              `;
            }
          } catch (dbError) {
            console.error('Postgres write failed in verify-payment, falling back to local file:', dbError);
            const bookings = getLocalBookings();
            const isAlreadyBooked = bookings.some(
              b => b.date === verifiedBooking.date && b.timeSlot === verifiedBooking.timeSlot
            );
            if (!isAlreadyBooked) {
              bookings.push(verifiedBooking);
              saveLocalBookings(bookings);
            }
          }
        } else {
          const bookings = getLocalBookings();
          const isAlreadyBooked = bookings.some(
            b => b.date === verifiedBooking.date && b.timeSlot === verifiedBooking.timeSlot
          );
          if (!isAlreadyBooked) {
            bookings.push(verifiedBooking);
            saveLocalBookings(bookings);
          }
        }

        // Send automatic booking confirmation email via Gmail SMTP
        await sendBookingEmail(verifiedBooking);
      }

      if (assessment) {
        // Generate unique sequential Application ID
        const currentYear = new Date().getFullYear();
        let sequenceNumber = 1;
        if (hasPostgres()) {
          try {
            const countRes = await sql`SELECT count(*) FROM assessments`;
            sequenceNumber = parseInt(countRes.rows[0].count, 10) + 1;
          } catch (err) {
            sequenceNumber = getLocalAssessments().length + 1;
          }
        } else {
          sequenceNumber = getLocalAssessments().length + 1;
        }

        let referenceNumber = '';
        let isUnique = false;
        let checkSeq = sequenceNumber;
        while (!isUnique) {
          const checkRef = `TCA-UK-${currentYear}-${String(checkSeq).padStart(6, '0')}`;
          let exists = false;
          if (hasPostgres()) {
            try {
              const { rows } = await sql`SELECT id FROM assessments WHERE reference_number = ${checkRef} LIMIT 1`;
              exists = rows.length > 0;
            } catch {
              exists = getLocalAssessments().some(a => a.referenceNumber === checkRef);
            }
          } else {
            exists = getLocalAssessments().some(a => a.referenceNumber === checkRef);
          }
          if (!exists) {
            referenceNumber = checkRef;
            isUnique = true;
          } else {
            checkSeq++;
          }
        }

        const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';

        const verifiedAssessment = {
          ...assessment,
          referenceNumber, // assign the auto-generated unique reference number
          paymentMethod: 'Razorpay',
          paymentStatus: 'Paid',
          status: 'UNDER REVIEW',
          createdAt: new Date().toISOString(),
          ipAddress,
          emailStatus: 'Pending'
        };

        // Send email
        const emailSent = await sendAssessmentEmail(verifiedAssessment);
        verifiedAssessment.emailStatus = emailSent ? 'Sent' : 'Failed';

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

            await sql`
              INSERT INTO assessments (
                id, reference_number, first_name, last_name, email,
                player_type, payment_status, status, assessment_data, created_at
              ) VALUES (
                ${verifiedAssessment.id}, ${verifiedAssessment.referenceNumber}, ${verifiedAssessment.firstName}, ${verifiedAssessment.lastName}, ${verifiedAssessment.email},
                ${verifiedAssessment.playerType || ''}, ${verifiedAssessment.paymentStatus}, ${verifiedAssessment.status}, ${JSON.stringify(verifiedAssessment)}, ${verifiedAssessment.createdAt}
              )
            `;
          } catch (dbError) {
            console.error('Postgres write failed for assessment, falling back to local file:', dbError);
            const assessments = getLocalAssessments();
            assessments.push(verifiedAssessment);
            saveLocalAssessments(assessments);
          }
        } else {
          const assessments = getLocalAssessments();
          assessments.push(verifiedAssessment);
          saveLocalAssessments(assessments);
        }

        return res.status(200).json({ status: 'success', message: 'Payment verified successfully', referenceNumber });
      }

      return res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ status: 'failed', message: 'Signature verification failed' });
    }
  } catch (error: any) {
    console.error('Error during signature verification:', error);
    return res.status(500).json({ error: error.message || 'Internal verification error' });
  }
}
