import crypto from 'crypto';
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendEmail, notifyAdmin } from './utils/send-email.js';
import Razorpay from 'razorpay';
import { verifyToken } from './utils/cv-auth.js';

const LOCAL_CVS_PATH = path.join(process.cwd(), 'cvs-db.json');

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

const CV_PRICE_INR = Number(process.env.CV_PRICE_INR || 249);

const safeEqual = (a: string, b: string) => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
};

// Applies a successful payment to a CV object (initial purchase or renewal).
const applyPayment = (cvData: any, invoiceNum: string) => {
  if (!Array.isArray(cvData.purchases)) cvData.purchases = [];
  const isRenewal = cvData.paymentStatus === 'Paid';
  cvData.purchases.push({
    type: isRenewal ? 'renewal' : 'initial',
    amount: CV_PRICE_INR,
    date: new Date().toISOString(),
    invoiceNumber: invoiceNum
  });
  // Every successful payment (first purchase or renewal) gives a fresh set of 5 edits
  cvData.editsUsed = 0;
  cvData.editsAllowed = 5;
  cvData.paymentStatus = 'Paid';
  cvData.downloadStatus = 'UNLOCKED';
  cvData.identityLocked = true;
  cvData.purchaseDate = new Date().toISOString();
  cvData.latestInvoiceNumber = invoiceNum;
  return cvData;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. The player must be logged in. We identify the CV from their session,
  //    not from whatever cvId the browser sends.
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated. Please log in again.' });
  }
  const jwtSecret = process.env.CV_JWT_SECRET || 'tca_cv_default_jwt_secret_key_2026';
  const decoded = verifyToken(authHeader.split(' ')[1], jwtSecret);
  if (!decoded || !decoded.userId) {
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required parameters for verification' });
  }

  const key_id = cleanEnvVar(process.env.RAZORPAY_KEY_ID);
  const key_secret = cleanEnvVar(process.env.RAZORPAY_KEY_SECRET);
  if (!key_secret || !key_id) {
    console.error('Razorpay credentials are not configured.');
    return res.status(500).json({ error: 'Server configuration error: missing Razorpay credentials' });
  }

  try {
    // 2. Verify the Razorpay signature (no test/simulated bypass)
    const generated_signature = crypto
      .createHmac('sha256', key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    if (!safeEqual(generated_signature, String(razorpay_signature))) {
      return res.status(400).json({ status: 'failed', error: 'Signature verification failed' });
    }

    // 3. Confirm with Razorpay that this payment is real, belongs to this order,
    //    and is for the full CV price (the order amount is set by the browser, so we check it here).
    const razorpay = new Razorpay({ key_id, key_secret });
    const payment: any = await razorpay.payments.fetch(razorpay_payment_id);
    if (!payment || payment.order_id !== razorpay_order_id) {
      return res.status(400).json({ error: 'Payment does not match this order' });
    }
    if (!['captured', 'authorized'].includes(payment.status)) {
      return res.status(400).json({ error: `Payment is not complete (status: ${payment.status})` });
    }
    if (Number(payment.amount) < CV_PRICE_INR * 100) {
      return res.status(400).json({ error: 'Payment amount is lower than the CV price' });
    }

    let email = decoded.email || '';
    let firstName = 'Player';
    let invoiceNum = '';
    let finalCv: any = null;

    if (hasPostgres()) {
      // 4. Record the payment once. Reusing the same payment ID (replay) cannot unlock or renew again.
      await sql`
        CREATE TABLE IF NOT EXISTS cv_payments (
          payment_id VARCHAR(100) PRIMARY KEY,
          order_id VARCHAR(100) NOT NULL,
          user_id VARCHAR(50) NOT NULL,
          email VARCHAR(255),
          cv_id VARCHAR(50),
          amount INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      const inserted = await sql`
        INSERT INTO cv_payments (payment_id, order_id, user_id, email, amount)
        VALUES (${razorpay_payment_id}, ${razorpay_order_id}, ${decoded.userId}, ${email}, ${Number(payment.amount)})
        ON CONFLICT (payment_id) DO NOTHING
        RETURNING payment_id
      `;
      const alreadyProcessed = inserted.rows.length === 0;

      // 5. Find this player's CV (same lookup cv-get and cv-save use)
      let cvRes = await sql`SELECT * FROM cvs WHERE email = ${email} LIMIT 1`;

      if (cvRes.rows.length === 0) {
        // The CV was never saved (e.g. save failed before checkout). Don't lose the payment:
        // create the CV record from the player's account so it is marked as paid.
        const u = await sql`SELECT * FROM cv_users WHERE id = ${decoded.userId} LIMIT 1`;
        const user = u.rows[0] || {};
        const newId = `cv_${decoded.userId}`;
        const refNum = `TCA-CV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
        const baseCv = {
          id: newId,
          userId: decoded.userId,
          referenceNumber: refNum,
          templateId: 'prestige',
          font: 'Inter',
          accentColour: '#0B1A30',
          paymentStatus: 'Pending',
          downloadStatus: 'LOCKED',
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email,
          editsAllowed: 5,
          editsUsed: 0
        };
        await sql`
          INSERT INTO cvs (id, user_id, reference_number, first_name, last_name, email, payment_status, download_status, edits_used, edits_allowed, identity_locked, cv_data, created_at)
          VALUES (${newId}, ${decoded.userId}, ${refNum}, ${baseCv.firstName}, ${baseCv.lastName}, ${email}, 'Pending', 'LOCKED', 0, 5, FALSE, ${JSON.stringify(baseCv)}, ${new Date().toISOString()})
          ON CONFLICT (id) DO NOTHING
        `;
        cvRes = await sql`SELECT * FROM cvs WHERE email = ${email} LIMIT 1`;
      }

      if (cvRes.rows.length === 0) {
        console.error(`PAYMENT RECEIVED BUT CV COULD NOT BE CREATED. payment=${razorpay_payment_id} user=${decoded.userId}`);
        return res.status(500).json({ error: `Payment received but your CV could not be updated. Please contact support with payment ID ${razorpay_payment_id}.` });
      }

      const cvRow = cvRes.rows[0];
      const cvData = JSON.parse(cvRow.cv_data);
      firstName = cvRow.first_name || firstName;

      if (alreadyProcessed) {
        // Same payment submitted twice (e.g. page refresh). Return the current state without re-applying.
        return res.status(200).json({ status: 'success', message: 'Payment already verified.', cv: cvData });
      }

      invoiceNum = `INV-${cvRow.reference_number}-${Date.now().toString().slice(-4)}`;
      applyPayment(cvData, invoiceNum);

      const updated = await sql`
        UPDATE cvs
        SET payment_status = 'Paid', download_status = 'UNLOCKED', identity_locked = TRUE,
            edits_used = ${cvData.editsUsed}, edits_allowed = ${cvData.editsAllowed},
            cv_data = ${JSON.stringify(cvData)}
        WHERE id = ${cvRow.id}
      `;
      if (!updated.rowCount) {
        console.error(`PAYMENT RECEIVED BUT CV UPDATE AFFECTED 0 ROWS. payment=${razorpay_payment_id} cv=${cvRow.id}`);
        return res.status(500).json({ error: `Payment received but your CV could not be updated. Please contact support with payment ID ${razorpay_payment_id}.` });
      }
      await sql`UPDATE cv_payments SET cv_id = ${cvRow.id} WHERE payment_id = ${razorpay_payment_id}`;
      finalCv = cvData;
    } else {
      // Local development fallback (JSON file). Not used on Vercel.
      const cvs = getLocalCvs();
      const cvIdx = cvs.findIndex((c: any) => c.userId === decoded.userId);
      if (cvIdx === -1) {
        return res.status(404).json({ error: 'CV not found for this account' });
      }
      const processed: string[] = cvs[cvIdx].processedPayments || [];
      if (processed.includes(razorpay_payment_id)) {
        return res.status(200).json({ status: 'success', message: 'Payment already verified.', cv: cvs[cvIdx] });
      }
      invoiceNum = `INV-${cvs[cvIdx].referenceNumber || 'TCA'}-${Date.now().toString().slice(-4)}`;
      applyPayment(cvs[cvIdx], invoiceNum);
      cvs[cvIdx].processedPayments = [...processed, razorpay_payment_id];
      saveLocalCvs(cvs);
      firstName = cvs[cvIdx].firstName || firstName;
      finalCv = cvs[cvIdx];
    }

    const amountPaid = CV_PRICE_INR;

      // Dispatch Payment Successful Email
      if (email) {
        
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #0b1a30; padding: 25px; text-align: center; color: white;">
              <h2 style="margin: 0; color: #ffffff;">Your Premium CV is Unlocked!</h2>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #cbd5e1;">The Cricket Advisor • Invoice Receipt</p>
            </div>
            <div style="padding: 25px; background-color: #ffffff;">
              <p>Dear ${firstName},</p>
              <p>Thank you for purchasing the Premium Cricket CV Builder. Your payment of ₹${amountPaid} has been successfully verified.</p>
              
              <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin: 20px 0;">
                <div style="background-color: #f8fafc; padding: 12px 15px; border-bottom: 1px solid #e2e8f0;">
                  <span style="font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">INVOICE DETAILS</span>
                </div>
                <div style="padding: 15px; font-size: 13px; line-height: 1.8;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="color: #64748b; padding: 4px 0;">Invoice Number:</td>
                      <td style="text-align: right; font-weight: bold; padding: 4px 0;">${invoiceNum}</td>
                    </tr>
                    <tr>
                      <td style="color: #64748b; padding: 4px 0;">Date:</td>
                      <td style="text-align: right; font-weight: bold; padding: 4px 0;">${new Date().toLocaleDateString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td style="color: #64748b; padding: 4px 0;">Payment Status:</td>
                      <td style="text-align: right; font-weight: bold; color: #10b981; padding: 4px 0;">PAID</td>
                    </tr>
                    <tr style="border-top: 1px solid #f1f5f9;">
                      <td style="color: #0b1a30; font-weight: bold; padding: 10px 0 4px 0;">Amount Paid:</td>
                      <td style="text-align: right; font-weight: bold; color: #D4AF37; font-size: 15px; padding: 10px 0 4px 0;">₹${amountPaid}.00</td>
                    </tr>
                  </table>
                </div>
              </div>

              <h3 style="color: #0b1a30; font-size: 14px; margin-top: 25px; margin-bottom: 10px; text-transform: uppercase;">What's Included:</h3>
              <ul style="padding-left: 20px; margin-top: 0; margin-bottom: 25px; font-size: 13px; color: #555;">
                <li>Unlimited clean A4 PDF downloads without watermarks</li>
                <li>Up to 5 modifications/edits allowed per year to update stats or achievements</li>
                <li>Secure hosting on The Cricket Advisor player database</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://thecricketadvisor.com/#cricket-cv" style="background-color: #0b1a30; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; border: 1px solid #D4AF37;">Go to My CV Dashboard</a>
              </div>

              <p style="margin-top: 30px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px;">
                For any support regarding your profile, feel free to contact us at thecricketadvisor@gmail.com.
              </p>
              <p style="font-size: 12px; color: #64748b; margin-top: 5px;">Regards,<br><strong>Team The Cricket Advisor</strong></p>
            </div>
          </div>
        `;

        await sendEmail({
          to: email,
          subject: 'Premium Cricket CV Ready - The Cricket Advisor',
          html: htmlContent
        });
      }

      await notifyAdmin('Cricket CV: payment received', 'Cricket CV payment received', {
        Name: `${finalCv?.firstName || firstName} ${finalCv?.lastName || ''}`,
        Email: email,
        Amount: `₹${amountPaid}`,
        'Payment ID': razorpay_payment_id,
        Invoice: invoiceNum,
        Type: (finalCv?.purchases?.length || 0) > 1 ? 'Renewal (5 more edits)' : 'First purchase'
      });

      return res.status(200).json({ status: 'success', message: 'Payment verified and CV unlocked successfully.', cv: finalCv });

  } catch (error: any) {
    console.error('CV payment verification error:', error);
    return res.status(500).json({ error: error.message || 'Internal verification error' });
  }
}
