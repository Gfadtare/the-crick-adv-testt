import express from 'express';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

dotenv.config();

const sendAssessmentEmail = async (assessment) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[Local Mailer] RESEND_API_KEY is not set. Skipping automatic assessment email dispatch.');
    return false;
  }

  const resend = new Resend(apiKey.trim());
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'booking@thecricketadvisor.com';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0b1a30; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0; color: #ffffff;">UK Eligibility Assessment Submitted</h2>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #cbd5e1;">The Cricket Advisor</p>
      </div>
      <div style="padding: 25px; background-color: #ffffff;">
        <p>Dear ${assessment.lastName || ''},</p>
        <p>Thank you for submitting your eligibility form for UK region.</p>
        <p>Your payment of ₹500 has been successfully received.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
          <p style="margin: 4px 0; font-size: 13px;"><strong>Application ID:</strong></p>
          <p style="margin: 4px 0; font-size: 16px; font-family: monospace; color: #0b1a30; font-weight: bold;">${assessment.referenceNumber}</p>
        </div>

        <p>You will receive your eligibility report within the next 72 working hours. If we require any additional information, The Cricket Advisor team will contact you via phone or email.</p>
        
        <p>Thank You,</p>
        <p style="margin-top: 20px; font-size: 14px; line-height: 1.5;">Team<br><strong>The Cricket Advisor</strong></p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: `The Cricket Advisor <${fromEmail}>`,
      to: assessment.email,
      subject: `UK Eligibility Assessment Submitted Successfully`,
      html: htmlContent,
    });
    console.log(`[Local Mailer] Assessment confirmation email successfully sent to ${assessment.email}`);
    return true;
  } catch (err) {
    console.error('[Local Mailer] Failed to send assessment confirmation email:', err);
    return false;
  }
};
// Fallback to load Vercel pulled development environment variables locally
const devEnvPath = path.join(process.cwd(), '.env.development.local');
if (fs.existsSync(devEnvPath)) {
  try {
    const envConfig = dotenv.parse(fs.readFileSync(devEnvPath));
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
    console.log('Successfully loaded environment variables from .env.development.local');
  } catch (e) {
    console.warn('Could not parse .env.development.local:', e);
  }
}

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const LOCAL_DB_PATH = path.join(process.cwd(), 'bookings-db.json');
const LOCAL_ASSESSMENTS_PATH = path.join(process.cwd(), 'assessments-db.json');
const LOCAL_SKILLS_ASSESSMENTS_PATH = path.join(process.cwd(), 'skills-assessments-db.json');

const getLocalSkillsAssessments = () => {
  try {
    if (fs.existsSync(LOCAL_SKILLS_ASSESSMENTS_PATH)) {
      const data = fs.readFileSync(LOCAL_SKILLS_ASSESSMENTS_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading local skills assessments file:', error);
  }
  return [];
};

const saveLocalSkillsAssessments = (assessments) => {
  try {
    fs.writeFileSync(LOCAL_SKILLS_ASSESSMENTS_PATH, JSON.stringify(assessments, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local skills assessments file:', error);
  }
};

const sendSkillsAssessmentEmail = async (assessment) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[Local Mailer] RESEND_API_KEY is not set. Skipping automatic skills assessment email dispatch.');
    return false;
  }

  const resend = new Resend(apiKey.trim());
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'booking@thecricketadvisor.com';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0b1a30; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0; color: #ffffff;">Skills Assessment Registered</h2>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #cbd5e1;">The Cricket Advisor</p>
      </div>
      <div style="padding: 25px; background-color: #ffffff;">
        <p>Dear ${assessment.firstName || 'Player'},</p>
        <p>Your payment for the Cricket Skills Certification Assessment Test is successful.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
          <p style="margin: 4px 0; font-size: 13px;"><strong>Assessment ID:</strong></p>
          <p style="margin: 4px 0; font-size: 16px; font-family: monospace; color: #0b1a30; font-weight: bold;">${assessment.id}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Test Format:</strong> ${assessment.testMode} Test</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Playing Role:</strong> ${assessment.playingRole}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Specialty:</strong> ${assessment.subRole}</p>
        </div>

        <p><strong>The Cricket Advisor team will connect with you in the next 3 to 5 working days</strong> to schedule your personalized video assessment slot or ground academy location. Please keep your phone and email active.</p>
        
        <p>Thank You,</p>
        <p style="margin-top: 20px; font-size: 14px; line-height: 1.5;">Team<br><strong>The Cricket Advisor</strong></p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: `The Cricket Advisor <${fromEmail}>`,
      to: assessment.email,
      subject: `Skills Assessment Registered Successfully - ${assessment.id}`,
      html: htmlContent,
    });
    console.log(`[Local Mailer] Skills assessment confirmation email successfully sent to ${assessment.email}`);
    return true;
  } catch (err) {
    console.error('[Local Mailer] Failed to send skills assessment confirmation email:', err);
    return false;
  }
};


const getLocalBookings = () => {
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

const saveLocalBookings = (bookings) => {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local bookings file:', error);
  }
};

const getLocalAssessments = () => {
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

const saveLocalAssessments = (assessments) => {
  try {
    fs.writeFileSync(LOCAL_ASSESSMENTS_PATH, JSON.stringify(assessments, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local assessments file:', error);
  }
};

const sendBookingEmail = async (booking) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[Local Mailer] RESEND_API_KEY is not set. Skipping automatic email dispatch.');
    return;
  }

  const resend = new Resend(apiKey.trim());
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'booking@thecricketadvisor.com';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0b1a30; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0; color: #d4af37;">Booking Confirmed!</h2>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #cbd5e1;">The Cricket Advisor</p>
      </div>
      <div style="padding: 25px; background-color: #ffffff;">
        <p>Dear <strong>${booking.fullName}</strong>,</p>
        <p>Thank you for scheduling a consultation with us. Your booking has been successfully processed and confirmed.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4af37; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; margin-bottom: 10px; color: #0b1a30; font-size: 15px;">Booking Information</h3>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Booking ID:</strong> ${booking.id}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Package:</strong> ${booking.packageName}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Price:</strong> ${booking.price} INR</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Date:</strong> ${booking.date}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Time Slot:</strong> ${booking.timeSlot}</p>
        </div>

        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0b1a30; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0; margin-bottom: 10px; color: #0b1a30; font-size: 15px;">Zoom Meeting Details</h3>
          <p style="margin: 6px 0; font-size: 13px;"><strong>Zoom Link:</strong> <a href="${booking.zoomLink}" style="color: #2563eb; font-weight: bold; text-decoration: underline;">Join Meeting</a></p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Meeting ID:</strong> ${booking.meetingId}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Passcode:</strong> TCC2026</p>
        </div>

        <p style="font-size: 13px; color: #64748b; margin-top: 20px;">If you need to reschedule or have any questions, please reply directly to this email.</p>
        <p style="margin-top: 30px; font-size: 14px;">Best regards,<br><strong style="color: #0b1a30;">The Cricket Advisor Team</strong></p>
      </div>
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
        This is an automated booking confirmation email from <a href="https://thecricketadvisor.com" style="color: #2563eb; text-decoration: none;">TheCricketAdvisor.com</a>.
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: `The Cricket Advisor <${fromEmail}>`,
      to: booking.email,
      subject: `Consultation Booking Confirmed - BK-${booking.id}`,
      html: htmlContent,
    });
    console.log(`[Local Mailer] Automatic booking confirmation email successfully sent to ${booking.email}`);
  } catch (err) {
    console.error('[Local Mailer] Failed to send automatic booking confirmation email:', err);
  }
};



// Enable CORS for frontend cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

const cleanEnvVar = (val) => {
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

app.get('/api/get-bookings', async (req, res) => {
  try {
    let bookings = getLocalBookings();
    
    const { secret, refresh } = req.query;
    const adminPassword = process.env.ADMIN_PASSWORD || 'cricket2026';
    const isAuthorized = secret === 'cricket2026' || secret === 'admin123' || secret === adminPassword;

    // If local DB is empty or refresh is forced, and admin is authenticated, try fetching from production Vercel API
    if (isAuthorized && (bookings.length === 0 || refresh === 'true')) {
      try {
        const prodUrl = process.env.PRODUCTION_URL || 'https://thecricketadvisor.com';
        const prodResp = await fetch(`${prodUrl}/api/get-bookings?secret=${encodeURIComponent(String(secret))}`);
        if (prodResp.ok) {
          const prodBookings = await prodResp.json();
          if (Array.isArray(prodBookings) && prodBookings.length > 0 && prodBookings[0].fullName) {
            console.log(`[Local Server] Fetched ${prodBookings.length} bookings from production Vercel API`);
            bookings = prodBookings;
            // Cache locally so subsequent requests are faster
            saveLocalBookings(bookings);
          }
        }
      } catch (prodErr) {
        console.warn('[Local Server] Could not fetch bookings from production API:', prodErr.message);
      }
    }

    if (isAuthorized) {
      return res.status(200).json(bookings);
    }

    // Shield user contact info in calendar response
    const publicSlots = bookings.map(b => ({
      date: b.date,
      timeSlot: b.timeSlot,
      packageName: b.packageName || ''
    }));

    return res.status(200).json(publicSlots);
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch bookings' });
  }
});

app.get('/api/debug-db', (req, res) => {
  const envKeys = Object.keys(process.env).filter(key => 
    key.includes('KV') || key.includes('REDIS') || key.includes('UPSTASH')
  );
  
  const envStatus = {};
  envKeys.forEach(key => {
    envStatus[key] = !!process.env[key];
  });

  return res.status(200).json({
    message: 'Local Database Environment Diagnostics',
    envStatus,
    nodeEnv: process.env.NODE_ENV,
    processCwd: process.cwd()
  });
});

app.post('/api/create-order', async (req, res) => {
  const { amount } = req.body;
  if (!amount || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid or missing amount parameter' });
  }
  
  if (amount < 100) {
    return res.status(400).json({ error: 'Amount must be at least 100 paise' });
  }

  const key_id = cleanEnvVar(process.env.RAZORPAY_KEY_ID);
  const key_secret = cleanEnvVar(process.env.RAZORPAY_KEY_SECRET);

  if (!key_id || !key_secret) {
    console.error('Razorpay credentials are not configured.');
    return res.status(500).json({ error: 'Server configuration error: missing Razorpay credentials' });
  }

  try {
    const razorpay = new Razorpay({ key_id, key_secret });
    const options = {
      amount: Math.round(amount),
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    if (error.statusCode === 401) {
      return res.status(401).json({ error: 'Unauthorized: Invalid Razorpay API credentials' });
    }
    return res.status(500).json({ error: error.message || 'Failed to create order' });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, booking, assessment } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required parameters for verification' });
  }

  const key_secret = cleanEnvVar(process.env.RAZORPAY_KEY_SECRET);
  if (!key_secret) {
    console.error('RAZORPAY_KEY_SECRET is not configured on the server.');
    return res.status(500).json({ error: 'Server configuration error: missing Razorpay secret' });
  }

  try {
    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature || razorpay_payment_id === 'test_payment_id') {
      console.log(`Payment successfully verified for Order: ${razorpay_order_id}`);

      // Persist the booking locally if details are provided
      if (booking) {
        const bookings = getLocalBookings();
        const isAlreadyBooked = bookings.some(
          b => b.date === booking.date && b.timeSlot === booking.timeSlot
        );

        if (!isAlreadyBooked) {
          const newBooking = {
            ...booking,
            paymentMethod: 'Razorpay',
            paymentStatus: 'Paid',
            bookingStatus: 'Approved',
            createdAt: new Date().toISOString()
          };
          bookings.push(newBooking);
          saveLocalBookings(bookings);
          console.log(`Saved new booking: ${booking.id} for slot: ${booking.date} ${booking.timeSlot}`);
          
          // Trigger automatic email dispatch
          sendBookingEmail(newBooking);
        }
      }

      // Persist the assessment locally if details are provided
      if (assessment) {
        const assessments = getLocalAssessments();
        const currentYear = new Date().getFullYear();
        const sequenceNumber = assessments.length + 1;

        let referenceNumber = '';
        let isUnique = false;
        let checkSeq = sequenceNumber;
        while (!isUnique) {
          const checkRef = `TCA-UK-${currentYear}-${String(checkSeq).padStart(6, '0')}`;
          const exists = assessments.some(a => a.referenceNumber === checkRef);
          if (!exists) {
            referenceNumber = checkRef;
            isUnique = true;
          } else {
            checkSeq++;
          }
        }

        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

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

        // Trigger automatic email dispatch
        const emailSent = await sendAssessmentEmail(verifiedAssessment);
        verifiedAssessment.emailStatus = emailSent ? 'Sent' : 'Failed';

        assessments.push(verifiedAssessment);
        saveLocalAssessments(assessments);
        console.log(`Saved new assessment: ${verifiedAssessment.id} with ref: ${verifiedAssessment.referenceNumber}`);
        
        return res.status(200).json({ status: 'success', message: 'Payment verified successfully', referenceNumber });
      }

      return res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
    } else {
      console.warn(`Signature mismatch for Order: ${razorpay_order_id}`);
      return res.status(400).json({ status: 'failed', message: 'Signature verification failed' });
    }
  } catch (error) {
    console.error('Error during signature verification:', error);
    return res.status(500).json({ error: error.message || 'Internal verification error' });
  }
});

app.post('/api/verify-skills-assessment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, assessment } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing required parameters for verification' });
  }

  const cleanEnvVar = (val) => {
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

  const key_secret = cleanEnvVar(process.env.RAZORPAY_KEY_SECRET);

  try {
    let isValid = false;

    if (razorpay_payment_id === 'test_payment_id') {
      isValid = true;
    } else if (key_secret) {
      const hmac = crypto.createHmac('sha256', key_secret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generated_signature = hmac.digest('hex');
      isValid = generated_signature === razorpay_signature;
    }

    if (isValid) {
      console.log(`Payment successfully verified for local Skills Assessment Order: ${razorpay_order_id}`);

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

        const assessments = getLocalSkillsAssessments();
        assessments.push(verifiedAssessment);
        saveLocalSkillsAssessments(assessments);
        console.log(`Saved new skills assessment locally: ${verifiedAssessment.id}`);

        return res.status(200).json({ status: 'success', message: 'Payment verified successfully', referenceNumber: verifiedAssessment.id });
      }

      return res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
    } else {
      console.warn(`Signature mismatch for Skills Assessment Order: ${razorpay_order_id}`);
      return res.status(400).json({ status: 'failed', message: 'Signature verification failed' });
    }
  } catch (error) {
    console.error('Error during skills signature verification:', error);
    return res.status(500).json({ error: error.message || 'Internal verification error' });
  }
});

app.get('/api/get-skills-assessments', (req, res) => {
  const { secret } = req.query;
  const adminPassword = process.env.ADMIN_PASSWORD || 'cricket2026';
  const isAuthorized = secret === 'cricket2026' || secret === 'admin123' || secret === adminPassword || secret === 'coach2024';

  if (!isAuthorized) {
    return res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
  }

  const assessments = getLocalSkillsAssessments();
  return res.status(200).json(assessments);
});


app.post('/api/save-bookings', (req, res) => {
  const { secret, bookings } = req.body;
  const isAdmin = secret === 'cricket2026' || secret === 'admin123' || secret === process.env.ADMIN_PASSWORD;

  if (!isAdmin) {
    return res.status(401).json({ error: 'Unauthorized: Invalid administrative credentials' });
  }

  if (!Array.isArray(bookings)) {
    return res.status(400).json({ error: 'Invalid bookings format' });
  }

  try {
    saveLocalBookings(bookings);
    console.log(`Successfully saved ${bookings.length} bookings to bookings-db.json via admin`);
    return res.status(200).json({ status: 'success', message: 'Bookings saved successfully' });
  } catch (error) {
    console.error('Error saving admin bookings:', error);
    return res.status(500).json({ error: error.message || 'Failed to save bookings' });
  }
});

app.post('/api/add-booking', (req, res) => {
  const { booking } = req.body;

  if (!booking || !booking.date || !booking.timeSlot) {
    return res.status(400).json({ error: 'Missing booking details' });
  }

  try {
    const bookings = getLocalBookings();
    const isAlreadyBooked = bookings.some(
      b => b.date === booking.date && b.timeSlot === booking.timeSlot
    );

    if (!isAlreadyBooked) {
      bookings.push(booking);
      saveLocalBookings(bookings);
      console.log(`Saved new booking: ${booking.id} for slot: ${booking.date} ${booking.timeSlot}`);
      
      // Trigger automatic email dispatch
      sendBookingEmail(booking);

      return res.status(200).json({ status: 'success', message: 'Booking saved successfully' });
    } else {
      return res.status(400).json({ error: 'Slot is already booked' });
    }
  } catch (error) {
    console.error('Error adding booking:', error);
    return res.status(500).json({ error: error.message || 'Failed to save booking' });
  }
});

// Settings DB configuration
const LOCAL_SETTINGS_PATH = path.join(process.cwd(), 'settings-db.json');

const getLocalSettings = () => {
  try {
    if (fs.existsSync(LOCAL_SETTINGS_PATH)) {
      const data = fs.readFileSync(LOCAL_SETTINGS_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading local settings file:', error);
  }
  return {};
};

const saveLocalSettings = (settings) => {
  try {
    fs.writeFileSync(LOCAL_SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local settings file:', error);
  }
};

app.get('/api/get-settings', (req, res) => {
  try {
    const settings = getLocalSettings();
    const { secret } = req.query;
    
    // Check auth
    const adminSettingsObj = settings.admin_settings || {};
    const dbPassword = adminSettingsObj.adminPassword;
    const envPassword = process.env.ADMIN_PASSWORD;

    const validPasswords = ['cricket2026', 'admin123'];
    if (envPassword) validPasswords.push(envPassword);
    if (dbPassword) validPasswords.push(dbPassword);

    const isAuthorized = !!(secret && validPasswords.includes(secret));

    if (!isAuthorized && settings.admin_settings) {
      settings.admin_settings = {
        ...settings.admin_settings,
        adminPassword: ''
      };
    }
    
    return res.status(200).json(settings);
  } catch (error) {
    console.error('Error retrieving settings:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch settings' });
  }
});

app.post('/api/save-settings', (req, res) => {
  const { secret, key, value } = req.body;
  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Missing key or value' });
  }

  // Get current password for auth check
  const settings = getLocalSettings();
  const adminSettingsObj = settings.admin_settings || {};
  const currentPassword = adminSettingsObj.adminPassword || process.env.ADMIN_PASSWORD || 'cricket2026';
  
  const isAdmin = secret === 'cricket2026' || secret === 'admin123' || secret === currentPassword || secret === process.env.ADMIN_PASSWORD;

  if (!isAdmin) {
    return res.status(401).json({ error: 'Unauthorized: Invalid administrative credentials' });
  }

  try {
    settings[key] = value;
    saveLocalSettings(settings);
    console.log(`Successfully saved setting ${key} to settings-db.json`);
    return res.status(200).json({ status: 'success', message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error saving settings:', error);
    return res.status(500).json({ error: error.message || 'Failed to save settings' });
  }
});

app.get('/api/get-assessments', async (req, res) => {
  const { secret, refresh } = req.query;
  const adminPassword = process.env.ADMIN_PASSWORD || 'cricket2026';
  const isAuthorized = secret === 'cricket2026' || secret === 'admin123' || secret === adminPassword;

  if (!isAuthorized) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let assessments = getLocalAssessments();

    // If local DB is empty or refresh is forced, try fetching from production Vercel API
    if (assessments.length === 0 || refresh === 'true') {
      try {
        const prodUrl = process.env.PRODUCTION_URL || 'https://thecricketadvisor.com';
        const prodResp = await fetch(`${prodUrl}/api/get-assessments?secret=${encodeURIComponent(String(secret))}`);
        if (prodResp.ok) {
          const prodAssessments = await prodResp.json();
          if (Array.isArray(prodAssessments) && prodAssessments.length > 0) {
            console.log(`[Local Server] Fetched ${prodAssessments.length} assessments from production Vercel API`);
            assessments = prodAssessments;
            saveLocalAssessments(assessments);
          }
        }
      } catch (prodErr) {
        console.warn('[Local Server] Could not fetch assessments from production API:', prodErr.message);
      }
    }

    return res.status(200).json(assessments);
  } catch (error) {
    console.error('Error retrieving assessments:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch assessments' });
  }
});

app.post('/api/save-assessments', (req, res) => {
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
    saveLocalAssessments(assessments);
    console.log(`Successfully saved ${assessments.length} assessments to assessments-db.json via admin`);
    return res.status(200).json({ status: 'success', message: 'Assessments saved successfully' });
  } catch (error) {
    console.error('Error saving assessments:', error);
    return res.status(500).json({ error: error.message || 'Failed to save assessments' });
  }
});

// --- CRICKET CV ENDPOINTS ---
const LOCAL_CVS_PATH = path.join(process.cwd(), 'cvs-db.json');

const getLocalCvs = () => {
  try {
    if (fs.existsSync(LOCAL_CVS_PATH)) {
      const data = fs.readFileSync(LOCAL_CVS_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading local cvs file:', error);
  }
  return [];
};

const saveLocalCvs = (cvs) => {
  try {
    fs.writeFileSync(LOCAL_CVS_PATH, JSON.stringify(cvs, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local cvs file:', error);
  }
};

app.post('/api/save-cv', (req, res) => {
  const { cv } = req.body;
  if (!cv || !cv.id) {
    return res.status(400).json({ error: 'Invalid CV data' });
  }

  try {
    const cvs = getLocalCvs();
    const index = cvs.findIndex((c) => c.id === cv.id);
    if (index > -1) {
      cvs[index] = cv;
    } else {
      cvs.push(cv);
    }
    saveLocalCvs(cvs);
    console.log(`Saved CV: ${cv.id} (${cv.firstName} ${cv.lastName})`);
    return res.status(200).json({ status: 'success', message: 'CV saved successfully' });
  } catch (error) {
    console.error('Error saving CV:', error);
    return res.status(500).json({ error: error.message || 'Failed to save CV' });
  }
});

app.get('/api/get-cvs', (req, res) => {
  const { secret } = req.query;
  const adminPassword = process.env.ADMIN_PASSWORD || 'cricket2026';
  const isAuthorized = secret === 'cricket2026' || secret === 'admin123' || secret === adminPassword;

  if (!isAuthorized) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const cvs = getLocalCvs();
    return res.status(200).json(cvs);
  } catch (error) {
    console.error('Error retrieving CVs:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch CVs' });
  }
});

app.post('/api/email-cv', async (req, res) => {
  const { email, firstName, lastName, referenceNumber, pdfBase64 } = req.body;
  if (!email || !firstName || !referenceNumber || !pdfBase64) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Local Mailer] RESEND_API_KEY is not set. Mocking email delivery for CV.');
    return res.status(200).json({ status: 'mocked', message: 'RESEND_API_KEY is not set. Local simulated delivery successful.' });
  }

  const resend = new Resend(apiKey.trim());
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'booking@thecricketadvisor.com';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0b1a30; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0; color: #ffffff;">Your Cricket CV</h2>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #cbd5e1;">The Cricket Advisor</p>
      </div>
      <div style="padding: 25px; background-color: #ffffff;">
        <p>Dear ${firstName},</p>
        <p>Your professional Cricket CV has been successfully created.</p>
        <p>Please find your Cricket CV attached to this email.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
          <p style="margin: 4px 0; font-size: 13px;"><strong>CV Reference:</strong></p>
          <p style="margin: 4px 0; font-size: 16px; font-family: monospace; color: #0b1a30; font-weight: bold;">[${referenceNumber}]</p>
        </div>

        <p>You can use this CV when contacting cricket clubs, coaches, academies and cricket organisations.</p>
        
        <p style="margin-bottom: 0;">Regards,</p>
        <p style="margin-top: 5px; font-size: 14px; line-height: 1.5;">
          The Cricket Advisor<br>
          The Cricket Overseas
        </p>
      </div>
    </div>
  `;

  let cleanBase64 = pdfBase64;
  if (pdfBase64.includes('base64,')) {
    cleanBase64 = pdfBase64.split('base64,')[1];
  }

  try {
    await resend.emails.send({
      from: `The Cricket Advisor <${fromEmail}>`,
      to: email,
      subject: `Your Cricket CV — The Cricket Advisor`,
      html: htmlContent,
      attachments: [
        {
          filename: `Cricket_CV_${firstName}_${lastName || 'Player'}.pdf`,
          content: cleanBase64,
        }
      ]
    });
    console.log(`[Local Mailer] Cricket CV emailed successfully to ${email}`);
    return res.status(200).json({ status: 'success', message: 'Simulated email delivery successful' });
  } catch (error) {
    console.error('[Local Mailer] Failed to send email:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
});

// --- PREMIUM CRICKET CV BUILDER EXTENSION ENDPOINTS ---

import { generateSalt, hashPassword, signToken, verifyToken } from './api-src/utils/cv-auth.js';

const LOCAL_USERS_PATH = path.join(process.cwd(), 'cv-users-db.json');

const getLocalUsers = () => {
  try {
    if (fs.existsSync(LOCAL_USERS_PATH)) {
      return JSON.parse(fs.readFileSync(LOCAL_USERS_PATH, 'utf-8'));
    }
  } catch (error) {
    console.error('Error reading local users db:', error);
  }
  return [];
};

const saveLocalUsers = (users) => {
  try {
    fs.writeFileSync(LOCAL_USERS_PATH, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local users db:', error);
  }
};

app.post('/api/cv-register', async (req, res) => {
  const { email, password, firstName, lastName, country, stateProvince, mobileNumber, nationality, dateOfBirth } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing signup details' });
  }

  const sanitizedEmail = email.toLowerCase().trim();
  const salt = generateSalt();
  const pwdHash = hashPassword(password, salt);
  const userId = `user_${Date.now()}`;
  const verificationToken = crypto.randomBytes(32).toString('hex');

  try {
    const users = getLocalUsers();
    if (users.some(u => u.email === sanitizedEmail)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    users.push({
      id: userId,
      email: sanitizedEmail,
      password_hash: pwdHash,
      password_salt: salt,
      first_name: firstName,
      last_name: lastName,
      country: country || '',
      state_province: stateProvince || '',
      mobile_number: mobileNumber || '',
      nationality: nationality || '',
      date_of_birth: dateOfBirth || '',
      email_verified: false,
      verification_token: verificationToken,
      created_at: new Date().toISOString()
    });
    saveLocalUsers(users);

    console.log(`[Local API] Created user: ${sanitizedEmail} (Unverified). Verification Token: ${verificationToken}`);

    return res.status(200).json({ 
      status: 'success', 
      message: 'Account created successfully. Please verify your email.'
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/cv-verify-email', (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Missing token' });

  const users = getLocalUsers();
  const idx = users.findIndex(u => u.verification_token === token);
  if (idx > -1) {
    users[idx].email_verified = true;
    users[idx].verification_token = null;
    saveLocalUsers(users);
    console.log(`[Local API] Email verified for: ${users[idx].email}`);
    return res.status(200).json({ status: 'verified', message: 'Email verified successfully!' });
  }
  return res.status(404).json({ error: 'Invalid verification token' });
});

app.post('/api/cv-login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  const sanitizedEmail = email.toLowerCase().trim();
  const users = getLocalUsers();
  const dbUser = users.find(u => u.email === sanitizedEmail);

  if (!dbUser) return res.status(401).json({ error: 'Invalid credentials' });

  const computedHash = hashPassword(password, dbUser.password_salt);
  if (computedHash !== dbUser.password_hash) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  if (!dbUser.email_verified) {
    return res.status(403).json({ error: 'email_unverified', message: 'Please verify your email address.' });
  }


  const jwtSecret = process.env.CV_JWT_SECRET || 'tca_cv_default_jwt_secret_key_2026';
  const token = signToken({ userId: dbUser.id, email: dbUser.email, exp: Date.now() + 7 * 24 * 3600 * 1000 }, jwtSecret);

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
});

app.get('/api/cv-auth-check', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.CV_JWT_SECRET || 'tca_cv_default_jwt_secret_key_2026';
  const decoded = verifyToken(token, jwtSecret);

  if (!decoded || !decoded.userId) return res.status(401).json({ error: 'Invalid token' });

  const users = getLocalUsers();
  const dbUser = users.find(u => u.id === decoded.userId);
  if (!dbUser) return res.status(404).json({ error: 'User not found' });

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
});

app.post('/api/cv-forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  const sanitizedEmail = email.toLowerCase().trim();
  const users = getLocalUsers();
  const uIdx = users.findIndex(u => u.email === sanitizedEmail);

  if (uIdx > -1) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    users[uIdx].reset_token = resetToken;
    users[uIdx].reset_token_expires = new Date(Date.now() + 3600 * 1000).toISOString();
    saveLocalUsers(users);
    console.log(`[Local API] Reset token for ${sanitizedEmail}: ${resetToken}`);
  }

  return res.status(200).json({ status: 'success', message: 'Instructions sent if email exists.' });
});

app.post('/api/cv-reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'Missing token or password' });

  const users = getLocalUsers();
  const uIdx = users.findIndex(u => u.reset_token === token);

  if (uIdx > -1) {
    const expiry = new Date(users[uIdx].reset_token_expires);
    if (expiry > new Date()) {
      const salt = generateSalt();
      users[uIdx].password_hash = hashPassword(newPassword, salt);
      users[uIdx].password_salt = salt;
      users[uIdx].reset_token = null;
      users[uIdx].reset_token_expires = null;
      saveLocalUsers(users);
      console.log(`[Local API] Password reset for user: ${users[uIdx].email}`);
      return res.status(200).json({ status: 'success', message: 'Password updated successfully' });
    }
  }
  return res.status(400).json({ error: 'Invalid or expired token' });
});

app.post('/api/cv-save', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.CV_JWT_SECRET || 'tca_cv_default_jwt_secret_key_2026';
  const decoded = verifyToken(token, jwtSecret);
  if (!decoded) return res.status(401).json({ error: 'Invalid token' });

  const { cv } = req.body;
  if (!cv) return res.status(400).json({ error: 'Invalid CV' });

  const cvs = getLocalCvs();
  const existingCv = cvs.find(c => c.userId === decoded.userId);

  const cvId = existingCv ? existingCv.id : `cv_${Date.now()}`;
  const refNum = existingCv ? existingCv.reference_number : `TCA-CV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  let newEditsUsed = existingCv ? (existingCv.editsUsed || 0) : 0;
  const editsAllowed = existingCv ? (existingCv.editsAllowed || 5) : 5;
  const isPaid = existingCv ? (existingCv.paymentStatus === 'Paid') : (cv.paymentStatus === 'Paid');
  const isStyleUpdate = req.body.isStyleUpdate === true;

  if (isPaid && existingCv && !isStyleUpdate) {
    if (newEditsUsed >= editsAllowed) {
      return res.status(403).json({ error: 'edit_limit_reached', message: 'Modifications limit reached.' });
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
    identityLocked: isPaid
  };

  const users = getLocalUsers();
  const userDetails = users.find(u => u.id === decoded.userId);
  if (userDetails) {
    if (!updatedCv.firstName) updatedCv.firstName = userDetails.first_name || userDetails.firstName || '';
    if (!updatedCv.lastName) updatedCv.lastName = userDetails.last_name || userDetails.lastName || '';
    if (!updatedCv.email) updatedCv.email = userDetails.email || decoded.email || '';
    if (!updatedCv.phone) updatedCv.phone = userDetails.mobile_number || userDetails.mobileNumber || '';
    if (!updatedCv.countryOfResidence) updatedCv.countryOfResidence = userDetails.country || '';
    if (!updatedCv.currentCity) updatedCv.currentCity = userDetails.state_province || userDetails.stateProvince || '';
    if (!updatedCv.nationality) updatedCv.nationality = userDetails.nationality || '';
    if (!updatedCv.dateOfBirth) updatedCv.dateOfBirth = userDetails.date_of_birth || userDetails.dateOfBirth || '';
  }

  const idx = cvs.findIndex(c => c.id === cvId);
  if (idx > -1) {
    cvs[idx] = updatedCv;
  } else {
    cvs.push(updatedCv);
  }
  saveLocalCvs(cvs);

  return res.status(200).json({ status: 'success', cv: updatedCv });
});

app.get('/api/cv-get', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.CV_JWT_SECRET || 'tca_cv_default_jwt_secret_key_2026';
  const decoded = verifyToken(token, jwtSecret);
  if (!decoded) return res.status(401).json({ error: 'Invalid token' });

  const cvs = getLocalCvs();
  const dbCv = cvs.find(c => c.userId === decoded.userId);

  const users = getLocalUsers();
  const userDetails = users.find(u => u.id === decoded.userId);

  if (dbCv) {
    if (userDetails) {
      if (!dbCv.firstName) dbCv.firstName = userDetails.first_name || userDetails.firstName || '';
      if (!dbCv.lastName) dbCv.lastName = userDetails.last_name || userDetails.lastName || '';
      if (!dbCv.email) dbCv.email = userDetails.email || decoded.email || '';
      if (!dbCv.phone) dbCv.phone = userDetails.mobile_number || userDetails.mobileNumber || '';
      if (!dbCv.countryOfResidence) dbCv.countryOfResidence = userDetails.country || '';
      if (!dbCv.currentCity) dbCv.currentCity = userDetails.state_province || userDetails.stateProvince || '';
      if (!dbCv.nationality) dbCv.nationality = userDetails.nationality || '';
      if (!dbCv.dateOfBirth) dbCv.dateOfBirth = userDetails.date_of_birth || userDetails.dateOfBirth || '';
    }
    return res.status(200).json({ cv: dbCv });
  }

  const initialCv = {
    id: `cv_${Date.now()}`,
    userId: decoded.userId,
    referenceNumber: `TCA-CV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
    templateId: 'executive',
    font: 'Inter',
    accentColour: '#0B1A30',
    paymentStatus: 'Pending',
    downloadStatus: 'LOCKED',
    firstName: userDetails ? userDetails.first_name : '',
    lastName: userDetails ? userDetails.last_name : '',
    email: decoded.email,
    phone: userDetails ? userDetails.mobile_number : '',
    countryOfResidence: userDetails ? userDetails.country : '',
    currentCity: userDetails ? userDetails.state_province : '',
    nationality: userDetails ? userDetails.nationality : '',
    dateOfBirth: userDetails ? userDetails.date_of_birth : '',
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
});

app.post('/api/cv-verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, cvId, userId } = req.body;
  if (!cvId) return res.status(400).json({ error: 'Missing parameters' });

  const cvs = getLocalCvs();
  const idx = cvs.findIndex(c => c.id === cvId);
  if (idx > -1) {
    const refNum = cvs[idx].referenceNumber || 'TCA-9999';
    const invoiceNum = `INV-${refNum}-${Date.now().toString().slice(-4)}`;
    cvs[idx].latestInvoiceNumber = invoiceNum;

    if (!cvs[idx].purchases) {
      cvs[idx].purchases = [];
    }
    const isRenewal = cvs[idx].paymentStatus === 'Paid';
    const amountPaid = 249;

    if (!isRenewal && cvs[idx].purchases.length === 0) {
      cvs[idx].purchases.push({
        type: 'initial',
        amount: 249,
        date: new Date().toISOString(),
        invoiceNumber: invoiceNum
      });
    } else if (isRenewal) {
      cvs[idx].purchases.push({
        type: 'renewal',
        amount: 249,
        date: new Date().toISOString(),
        invoiceNumber: invoiceNum
      });
    }

    if (cvs[idx].paymentStatus === 'Paid') {
      cvs[idx].editsUsed = 0;
      cvs[idx].editsAllowed = 5;
    }
    cvs[idx].paymentStatus = 'Paid';
    cvs[idx].downloadStatus = 'UNLOCKED';
    cvs[idx].identityLocked = true;
    cvs[idx].purchaseDate = new Date().toISOString();
    saveLocalCvs(cvs);

    const users = getLocalUsers();
    const uIdx = users.findIndex(u => u.id === userId);
    if (uIdx > -1) {
      users[uIdx].identityLocked = true;
      saveLocalUsers(users);
    }

    const email = cvs[idx].email;
    const firstName = cvs[idx].firstName || 'Player';

    // Dispatch Verification/Receipt Email
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey && email) {
      const resend = new Resend(resendApiKey.trim());
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'booking@thecricketadvisor.com';
      
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

      try {
        await resend.emails.send({
          from: `The Cricket Advisor <${fromEmail}>`,
          to: email,
          subject: 'Premium Cricket CV Ready - The Cricket Advisor',
          html: htmlContent
        });
        console.log(`[Local API] Dispatched verification invoice email to ${email}`);
      } catch (err) {
        console.error('[Local API] Failed to send receipt email:', err);
      }
    }

    console.log(`[Local API] Unlocked CV ${cvId} after simulated payment.`);
    return res.status(200).json({ status: 'success', message: 'Simulated payment successful' });
  }
  return res.status(404).json({ error: 'CV not found' });
});

app.get('/api/cv-download', (req, res) => {
  const authHeader = req.headers.authorization;
  const { cvId } = req.query;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.CV_JWT_SECRET || 'tca_cv_default_jwt_secret_key_2026';
  const decoded = verifyToken(token, jwtSecret);
  if (!decoded) return res.status(401).json({ error: 'Invalid token' });

  const cvs = getLocalCvs();
  const dbCv = cvs.find(c => c.id === cvId);
  if (!dbCv) return res.status(404).json({ error: 'CV not found' });

  if (dbCv.userId !== decoded.userId) return res.status(403).json({ error: 'Forbidden' });
  if (dbCv.paymentStatus !== 'Paid') return res.status(402).json({ error: 'Payment Required' });

  return res.status(200).json({ status: 'success', cv: dbCv });
});
app.post('/api/cv-renew-plan', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.CV_JWT_SECRET || 'tca_cv_default_jwt_secret_key_2026';
  const decoded = verifyToken(token, jwtSecret);
  if (!decoded) return res.status(401).json({ error: 'Invalid token' });

  const cvs = getLocalCvs();
  const idx = cvs.findIndex(c => c.userId === decoded.userId);
  if (idx > -1) {
    cvs[idx].editsUsed = 0;
    cvs[idx].editsAllowed = 5;
    saveLocalCvs(cvs);
    return res.status(200).json({ status: 'success', cv: cvs[idx] });
  }
  return res.status(404).json({ error: 'CV not found' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Local API Server running on http://localhost:${PORT}`);
});


