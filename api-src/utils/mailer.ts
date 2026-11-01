import { Resend } from 'resend';

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey.trim());
};

export const sendBookingEmail = async (booking: any): Promise<boolean> => {
  const resend = getResendClient();

  if (!resend) {
    console.warn('[Mailer] RESEND_API_KEY is not configured. Skipping automatic booking email dispatch.');
    return false;
  }

  // Resend requires verified domains to send to any recipient.
  // Defaults to booking@thecricketadvisor.com, but falls back to onboarding@resend.dev if needed for testing.
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
    console.log(`[Resend Mailer] Automatic booking confirmation email successfully sent to ${booking.email}`);
    return true;
  } catch (err) {
    console.error('[Resend Mailer] Failed to send automatic booking confirmation email:', err);
    return false;
  }
};

export const sendAssessmentEmail = async (assessment: any): Promise<boolean> => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[Resend Mailer] RESEND_API_KEY is not set. Skipping automatic assessment email dispatch.');
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
    console.log(`[Resend Mailer] Assessment confirmation email successfully sent to ${assessment.email}`);
    return true;
  } catch (err) {
    console.error('[Resend Mailer] Failed to send assessment confirmation email:', err);
    return false;
  }
};

export const sendSkillsAssessmentEmail = async (assessment: any): Promise<boolean> => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[Resend Mailer] RESEND_API_KEY is not set. Skipping automatic skills assessment email dispatch.');
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
    console.log(`[Resend Mailer] Skills assessment confirmation email successfully sent to ${assessment.email}`);
    return true;
  } catch (err) {
    console.error('[Resend Mailer] Failed to send skills assessment confirmation email:', err);
    return false;
  }
};
