import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import all endpoint handlers
import addBooking from '../api-src/add-booking.js';
import createOrder from '../api-src/create-order.js';
import cvAuthCheck from '../api-src/cv-auth-check.js';
import cvDownload from '../api-src/cv-download.js';
import cvForgotPassword from '../api-src/cv-forgot-password.js';
import cvGet from '../api-src/cv-get.js';
import cvLogin from '../api-src/cv-login.js';
import cvRegister from '../api-src/cv-register.js';
import cvRenewPlan from '../api-src/cv-renew-plan.js';
import cvResetPassword from '../api-src/cv-reset-password.js';
import cvSave from '../api-src/cv-save.js';
import cvVerifyEmail from '../api-src/cv-verify-email.js';
import cvVerifyPayment from '../api-src/cv-verify-payment.js';
import debugDb from '../api-src/debug-db.js';
import emailCv from '../api-src/email-cv.js';
import getAssessments from '../api-src/get-assessments.js';
import getBookings from '../api-src/get-bookings.js';
import getCvs from '../api-src/get-cvs.js';
import getCvUsers from '../api-src/get-cv-users.js';
import getSettings from '../api-src/get-settings.js';
import saveAssessments from '../api-src/save-assessments.js';
import saveBookings from '../api-src/save-bookings.js';
import saveCv from '../api-src/save-cv.js';
import saveSettings from '../api-src/save-settings.js';
import verifyPayment from '../api-src/verify-payment.js';
import verifySkillsAssessment from '../api-src/verify-skills-assessment.js';
import getSkillsAssessments from '../api-src/get-skills-assessments.js';


const routes: Record<string, (req: VercelRequest, res: VercelResponse) => Promise<any> | any> = {
  'add-booking': addBooking,
  'create-order': createOrder,
  'cv-auth-check': cvAuthCheck,
  'cv-download': cvDownload,
  'cv-forgot-password': cvForgotPassword,
  'cv-get': cvGet,
  'cv-login': cvLogin,
  'cv-register': cvRegister,
  'cv-renew-plan': cvRenewPlan,
  'cv-reset-password': cvResetPassword,
  'cv-save': cvSave,
  'cv-verify-email': cvVerifyEmail,
  'cv-verify-payment': cvVerifyPayment,
  'debug-db': debugDb,
  'email-cv': emailCv,
  'get-assessments': getAssessments,
  'get-bookings': getBookings,
  'get-cvs': getCvs,
  'get-cv-users': getCvUsers,
  'get-settings': getSettings,
  'save-assessments': saveAssessments,
  'save-bookings': saveBookings,
  'save-cv': saveCv,
  'save-settings': saveSettings,
  'verify-payment': verifyPayment,
  'verify-skills-assessment': verifySkillsAssessment,
  'get-skills-assessments': getSkillsAssessments,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Extract path parameter from the query
  const pathParam = req.query.path;
  
  if (!pathParam || typeof pathParam !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid path parameter' });
  }

  const routeHandler = routes[pathParam];
  if (routeHandler) {
    try {
      // Remove path from query so the handlers don't see the internal routing query parameter
      delete req.query.path;
      return await routeHandler(req, res);
    } catch (err: any) {
      console.error(`Error in route ${pathParam}:`, err);
      return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  }

  return res.status(404).json({ error: `Route not found: ${pathParam}` });
}
