import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Calendar, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Clock, 
  FileText, 
  Globe, 
  Flag, 
  Mail, 
  MapPin, 
  Menu, 
  Phone, 
  Plus, 
  ShieldCheck, 
  Trash2, 
  TrendingUp, 
  User, 
  Users, 
  X, 
  DollarSign,
  Settings,
  Lock,
  Download,
  AlertCircle,
  Briefcase,
  HelpCircle,
  FileSpreadsheet,
  Check,
  Edit2,
  CreditCard,
  Smartphone,
  Building,
  Printer,
  Video,
  Copy,
  ExternalLink,
  Share2,
  MessageSquare,
  Send,
  Eye,
  EyeOff
} from 'lucide-react';

// Import images
import logoImg from './assets/images/the_cricket_advisor_logo.png';
import profileImg from './assets/images/prakash_palande_gym_1784639281865.jpg';
import stadiumBg from './assets/images/stadium_background_1784636094892.jpg';
import globalNetworkImg from './assets/images/global_network_1784638057795.jpg';
import playerPlacementImg from './assets/images/player_placement_1784638071606.jpg';
import websiteDevelopmentImg from './assets/images/website_development_1784638083707.jpg';
import cricketOperationsImg from './assets/images/cricket_operations_1784638096324.jpg';
import mediaManagementImg from './assets/images/media_management_1784638110330.jpg';
import cricketToursImg from './assets/images/cricket_tours_1784638123336.jpg';
import independentConsultingImg from './assets/images/independent_consulting_1784638137784.jpg';
import harshilDoshiImg from './assets/images/harshil_doshi_placement.jpg';
import ukEligibilityReportDesign from './assets/images/uk_eligibility_report_design.png';
import { jsPDF } from 'jspdf';

// --- PREMIUM CRICKET CV BUILDER EXTENSION IMPORTS ---
import CVLandingPage from './components/cv/CVLandingPage';
import CVBuilderForm from './components/cv/CVBuilderForm';
import CVLivePreview from './components/cv/CVLivePreview';
import CVReviewPage from './components/cv/CVReviewPage';
import CVDashboard from './components/cv/CVDashboard';
import CVAuthModal from './components/cv/CVAuthModal';
import CVEmailVerification from './components/cv/CVEmailVerification';
import CVForgotPassword from './components/cv/CVForgotPassword';
import { initialCVForm as initialCVFormFull, CricketCVFull } from './components/cv/CVTypes';
import CVStyleStep from './components/cv/CVStyleStep';
import CVPaymentSuccess from './components/cv/CVPaymentSuccess';
import CVFinalView from './components/cv/CVFinalView';
import html2canvas from 'html2canvas-pro';
import CVTemplateRenderer from './components/cv/templates/CVTemplates';

// --- CRICKET SKILLS ASSESSMENT PORTAL IMPORTS ---
import { CricketAssessmentForm } from './components/assessment/CricketAssessmentForm';
import { PaymentCheckout as AssessmentPaymentCheckout } from './components/assessment/PaymentCheckout';
import { SubmissionSummary as AssessmentSubmissionSummary } from './components/assessment/SubmissionSummary';
import { SubmissionData as AssessmentSubmissionData } from './components/assessment/types';

// --- COACHES CORNER IMPORTS ---
import { CoachesCorner } from './components/coaches-corner/CoachesCorner';


// --- TYPES ---
interface CricketCV {
  id: string;
  referenceNumber: string;
  createdAt: string;
  lastUpdated: string;
  paymentStatus: 'Paid' | 'Pending';
  downloadStatus: 'LOCKED' | 'UNLOCKED';
  updateBalance: number;
  purchaseDate?: string;
  firstName: string;
  lastName: string;
  dob: string;
  nationality: string;
  currentCountry: string;
  cityLocation: string;
  email: string;
  phone: string;
  profilePhoto?: string;
  cricketLevel: string;
  playingRole: string;
  battingStyle: string;
  bowlingStyle: string;
  currentClub: string;
  currentLevel: string;
  country: string;
  currentStateProvince: string;
  playingSince: string;
  currentSeason: string;
  lookingForOpp: string;
  oppTypes?: string[];
  previousTeams: {
    id: string;
    teamName: string;
    country: string;
    level: string;
    role: string;
    fromYear: string;
    toYear: string;
  }[];
  careerStats: {
    matches: string;
    innings: string;
    runs: string;
    highestScore: string;
    battingAverage: string;
    fifties: string;
    hundreds: string;
    wickets: string;
    bestBowling: string;
    bowlingAverage: string;
    economyRate: string;
    catches: string;
    stumpings: string;
  };
  seasonStats: {
    id: string;
    season: string;
    team: string;
    competition: string;
    matches: string;
    runs: string;
    wickets: string;
  }[];
  achievements: {
    id: string;
    title: string;
    year: string;
    competitionOrg: string;
    description: string;
  }[];
  education: {
    id: string;
    institution: string;
    qualification: string;
    year: string;
  }[];
  qualifications: {
    id: string;
    certName: string;
    details: string;
    year: string;
  }[];
  aboutMe: string;
  highlights: string[];
  references: {
    id: string;
    name: string;
    role: string;
    clubOrg: string;
    email: string;
    phone: string;
  }[];
}

const initialCVForm: CricketCV = {
  id: '',
  referenceNumber: '',
  createdAt: '',
  lastUpdated: '',
  paymentStatus: 'Pending',
  downloadStatus: 'LOCKED',
  updateBalance: 3,
  firstName: '',
  lastName: '',
  dob: '',
  nationality: '',
  currentCountry: '',
  cityLocation: '',
  email: '',
  phone: '',
  profilePhoto: '',
  cricketLevel: '',
  playingRole: '',
  battingStyle: '',
  bowlingStyle: '',
  currentClub: '',
  currentLevel: '',
  country: '',
  currentStateProvince: '',
  playingSince: '',
  currentSeason: '',
  lookingForOpp: 'No',
  oppTypes: [],
  previousTeams: [],
  careerStats: {
    matches: '',
    innings: '',
    runs: '',
    highestScore: '',
    battingAverage: '',
    fifties: '',
    hundreds: '',
    wickets: '',
    bestBowling: '',
    bowlingAverage: '',
    economyRate: '',
    catches: '',
    stumpings: ''
  },
  seasonStats: [],
  achievements: [],
  education: [],
  qualifications: [],
  aboutMe: '',
  highlights: [''],
  references: []
};

const mockExampleCV: CricketCV = {
  id: 'example-cv',
  referenceNumber: 'TCA-CV-2026-EXAMPLE',
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  paymentStatus: 'Paid',
  downloadStatus: 'UNLOCKED',
  updateBalance: 3,
  firstName: 'James',
  lastName: 'Anderson',
  dob: '1995-07-30',
  nationality: 'English',
  currentCountry: 'United Kingdom',
  cityLocation: 'Manchester',
  email: 'james.anderson@example.com',
  phone: '+44 7700 900077',
  profilePhoto: '',
  cricketLevel: 'First-Class Cricketer',
  playingRole: 'Bowler',
  battingStyle: 'Left-Handed',
  bowlingStyle: 'Right-Arm Fast-Medium',
  currentClub: 'Lancashire CCC',
  currentLevel: 'County Cricket',
  country: 'United Kingdom',
  currentStateProvince: 'Lancashire',
  playingSince: '2010',
  currentSeason: '2026',
  lookingForOpp: 'Yes',
  oppTypes: ['Overseas Cricket', 'Professional Opportunity'],
  previousTeams: [
    { id: '1', teamName: 'Burnley CC', country: 'United Kingdom', level: 'Club', role: 'Bowler', fromYear: '2010', toYear: '2015' },
    { id: '2', teamName: 'Lancashire 2nd XI', country: 'United Kingdom', level: 'Academy', role: 'Bowler', fromYear: '2016', toYear: '2018' }
  ],
  careerStats: {
    matches: '124',
    innings: '80',
    runs: '480',
    highestScore: '34*',
    battingAverage: '12.30',
    fifties: '0',
    hundreds: '0',
    wickets: '412',
    bestBowling: '7/42',
    bowlingAverage: '21.45',
    economyRate: '2.85',
    catches: '42',
    stumpings: '0'
  },
  seasonStats: [
    { id: '1', season: '2025', team: 'Lancashire CCC', competition: 'County Championship', matches: '14', runs: '45', wickets: '52' },
    { id: '2', season: '2024', team: 'Lancashire CCC', competition: 'County Championship', matches: '12', runs: '32', wickets: '41' }
  ],
  achievements: [
    { id: '1', title: 'Leading Wicket Taker', year: '2025', competitionOrg: 'County Championship', description: 'Finished as the highest wicket-taker for Lancashire CC with 52 wickets.' },
    { id: '2', title: 'Player of the Tournament', year: '2024', competitionOrg: 'One-Day Cup', description: 'Awarded player of the tournament for taking 24 wickets in 9 matches.' }
  ],
  education: [
    { id: '1', institution: 'University of Manchester', qualification: 'BSc Sports Science', year: '2016' }
  ],
  qualifications: [
    { id: '1', certName: 'Coaching Qualification', details: 'ECB Level 2 Coach', year: '2021' }
  ],
  aboutMe: 'I am a highly motivated right-arm fast-medium opening bowler with substantial first-class experience. I specialize in swing bowling and have a proven track record of taking early wickets in multi-day and limited-overs cricket.',
  highlights: [
    '400+ First-Class Wickets',
    'ECB Level 2 Certified Coach',
    'Lancashire CCC Wicket-Taker of the Year (2025)',
    'Overseas club cricket experience in Australia'
  ],
  references: [
    { id: '1', name: 'Glen Chapple', role: 'Head Coach', clubOrg: 'Lancashire CCC', email: 'glen.chapple@example.com', phone: '+44 7700 900088' }
  ]
};

interface Player {
  id: string;
  name: string;
  country: string;
  club: string;
  season: string;
  achievement: string;
  imageUrl?: string;
  battingStyle?: string;
  bowlingStyle?: string;
  playingProficiency?: string;
  nationality?: string;
}

interface Booking {
  id: string;
  fullName: string;
  email: string;
  whatsApp: string;
  country: string;
  playingLevel: string;
  packageId: string;
  packageName: string;
  price: number;
  date: string;
  timeSlot: string;
  purpose: string;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending';
  bookingStatus: 'Approved' | 'Pending' | 'Cancelled';
  zoomLink: string;
  meetingId: string;
  createdAt: string;
}

interface ConsultationPackage {
  id: string;
  title: string;
  price: number;
  duration: string;
  description: string;
}

interface BankDetails {
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

const defaultBankDetails: BankDetails = {
  accountName: 'Prakash Palande',
  bankName: 'Indian Bank',
  accountNumber: '6172113436',
  ifscCode: 'IDIB000B086',
  upiId: '8591105966@upi'
};

interface AdminSettings {
  adminEmail: string;
  zoomHostEmail: string;
  zoomHostName: string;
  zoomPersonalMeetingId: string;
  adminPassword: string;
  gstin: string;
  businessAddress: string;
}

const defaultAdminSettings: AdminSettings = {
  adminEmail: 'thecricketadvisor@gmail.com',
  zoomHostEmail: 'thecricketadvisor@gmail.com',
  zoomHostName: 'Prakash Palande (TCC)',
  zoomPersonalMeetingId: 'https://us05web.zoom.us/j/6520263043?pwd=aBzQyiRAtKxPeYYPFVX9yLszp5H9fX.1',
  adminPassword: 'cricket2026',
  gstin: '27AAAAA0000A1Z5',
  businessAddress: 'Mumbai / International Cricket Consultancy Hub, India'
};

interface EligibilityForm {
  firstName: string;
  lastName: string;
  isAbove18: string;
  nationality: string;
  hasValidPassport: string;
  email: string;
  mobileNumber: string;
  
  firstClassPlayed: string;
  firstClassLastYear: string;
  firstClassMatches36Months: string;
  
  listAPlayed: string;
  listALastYear: string;
  listAMatches36Months: string;
  
  domesticT20Played: string;
  domesticT20LastYear: string;
  domesticT20Matches36Months: string;
  
  ageGroupPlayed: string;
  ageGroupLastYear: string;
  
  iccT20Played: string;
  iccT20LastYear: string;
  
  universityPlayed: string;
  universityLastYear: string;
  
  clubDistrictLevel: string;
  pendingCriminalCases: string;
  deportationHistory: string;
  criminalConviction: string;
  
  acceptedDeclaration1: boolean;
  acceptedDeclaration2: boolean;
  acceptedDeclaration3: boolean;
  acceptedDeclaration4: boolean;
  acceptedDeclaration5: boolean;

  id?: string;
  referenceNumber?: string;
  paymentAmount?: number;
  paymentCurrency?: string;
  paymentStatus?: string;
  status?: string;
  playerType?: string;
  createdAt?: string;
  ipAddress?: string;
  paymentId?: string;
  transactionId?: string;
  emailStatus?: string;

  // Legacy compatibility fields
  currentCricketLevel?: string;
  registeredWithTeam?: string;
  currentTeamLevel?: string;
  playedHigherLevel?: string;
  higherLevelPlayed?: string;
  hasUkOpportunity?: string;
  ukOpportunityType?: string;
  ukDocumentation?: string;
  willReceiveUkPayment?: string;
  ukPaymentType?: string;
  visaHistory?: string;
}

const initialEligibilityForm: EligibilityForm = {
  firstName: '',
  lastName: '',
  isAbove18: '',
  nationality: '',
  hasValidPassport: '',
  email: '',
  mobileNumber: '',
  firstClassPlayed: '',
  firstClassLastYear: '',
  firstClassMatches36Months: '',
  listAPlayed: '',
  listALastYear: '',
  listAMatches36Months: '',
  domesticT20Played: '',
  domesticT20LastYear: '',
  domesticT20Matches36Months: '',
  ageGroupPlayed: '',
  ageGroupLastYear: '',
  iccT20Played: '',
  iccT20LastYear: '',
  universityPlayed: '',
  universityLastYear: '',
  clubDistrictLevel: '',
  pendingCriminalCases: '',
  deportationHistory: '',
  criminalConviction: '',
  acceptedDeclaration1: false,
  acceptedDeclaration2: false,
  acceptedDeclaration3: false,
  acceptedDeclaration4: false,
  acceptedDeclaration5: false
};

type CurrencyCode = 'INR' | 'AUD' | 'USD' | 'NZD' | 'GBP';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  label: string;
}

const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  INR: { code: 'INR', symbol: '₹', rate: 1, label: 'INR (₹)' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, label: 'USD ($)' },
  AUD: { code: 'AUD', symbol: 'A$', rate: 0.018, label: 'AUD (A$)' },
  NZD: { code: 'NZD', symbol: 'NZ$', rate: 0.020, label: 'NZD (NZ$)' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.0093, label: 'GBP (£)' }
};

const RefundPolicyContent = () => (
  <div className="space-y-4 font-light text-slate-600 leading-relaxed text-xs">
    <div className="text-center pb-3 border-b border-slate-100">
      <h4 className="font-extrabold text-navy-950 text-sm uppercase tracking-wider font-display">Refund Policy</h4>
      <p className="text-[10px] text-gold-600 font-bold uppercase tracking-widest mt-1">Effective Date: July 23, 2026</p>
    </div>
    
    <p>Welcome to <span className="font-semibold text-slate-800">TheCricketAdvisor.com</span>. Please read this Refund Policy carefully before purchasing any service from our website.</p>
    
    <p className="bg-slate-50 p-3 rounded-lg border-l-4 border-gold-500 text-[11px] italic">
      By accessing, booking, or purchasing any advisory, consultation, coaching, mentorship, career guidance, or related service through TheCricketAdvisor.com, you acknowledge that you have read, understood, and agreed to this Refund Policy.
    </p>
    
    <div className="space-y-2 pt-2">
      <h5 className="font-bold text-navy-900 uppercase tracking-wider text-[11px]">1. No Refund Policy</h5>
      <p>All payments made to TheCricketAdvisor.com are final, non-cancellable, and non-refundable.</p>
      <p>Once payment has been successfully processed, no refund, credit, adjustment, or exchange will be provided under any circumstances, including but not limited to:</p>
      <ul className="list-disc pl-5 space-y-1 text-slate-500">
        <li>The client changes their mind.</li>
        <li>The client decides not to use the purchased service.</li>
        <li>The client wishes to cancel after payment.</li>
        <li>The client fails to attend or participate in a scheduled session.</li>
        <li>The client is dissatisfied with the advice, consultation, recommendations, or opinions provided.</li>
        <li>The client does not achieve their desired outcome.</li>
        <li>The client has unrealistic expectations regarding results.</li>
        <li>The client believes another service provider would be more suitable.</li>
        <li>The client fails to provide requested information or cooperate during the advisory process.</li>
      </ul>
      <p className="bg-red-50/50 p-2.5 rounded border border-red-100 text-[11px] text-slate-600 italic">
        As our services involve professional expertise, consultation, analysis, guidance, and time reserved exclusively for each client, all fees are considered earned immediately upon payment.
      </p>
    </div>

    <div className="space-y-2 pt-2 border-t border-slate-100">
      <h5 className="font-bold text-navy-900 uppercase tracking-wider text-[11px]">2. Limited Refund Exception</h5>
      <p>A refund will only be considered if The Cricket Advisor is unable to provide the purchased service due solely to their own unavailability and no reasonable alternative arrangement or rescheduled appointment can be offered.</p>
      <p>If approved, any refund shall be limited only to the amount paid for the specific service that could not be provided. No other circumstance shall qualify for a refund.</p>
    </div>

    <div className="space-y-2 pt-2 border-t border-slate-100">
      <h5 className="font-bold text-navy-900 uppercase tracking-wider text-[11px]">3. No Guarantee of Results or Placement</h5>
      <p>TheCricketAdvisor.com provides professional cricket advisory, consultation, coaching guidance, mentorship, career guidance, and related services based solely on professional knowledge and experience.</p>
      <p className="font-semibold text-slate-800">All services are provided on a best-effort basis only.</p>
      <p>No service offered through TheCricketAdvisor.com guarantees any result, success, placement, selection, contract, trial, scholarship, sponsorship, employment, admission, visa approval, career opportunity, financial benefit, or any other specific outcome.</p>
      <p>Without limitation, we do not guarantee:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-500 pl-2">
        <div className="flex items-center space-x-1.5">&bull; <span>Selection to any cricket team at any level</span></div>
        <div className="flex items-center space-x-1.5">&bull; <span>Placement with academy, club, or agency</span></div>
        <div className="flex items-center space-x-1.5">&bull; <span>Professional playing contracts</span></div>
        <div className="flex items-center space-x-1.5">&bull; <span>Coaching opportunities</span></div>
        <div className="flex items-center space-x-1.5">&bull; <span>Cricket trials & sponsorships</span></div>
        <div className="flex items-center space-x-1.5">&bull; <span>Scholarships & admissions</span></div>
        <div className="flex items-center space-x-1.5">&bull; <span>Visa approvals or immigration</span></div>
        <div className="flex items-center space-x-1.5">&bull; <span>Talent identification & performance</span></div>
        <div className="flex items-center space-x-1.5">&bull; <span>Rankings or career advancement</span></div>
        <div className="flex items-center space-x-1.5">&bull; <span>Commercial & financial success</span></div>
      </div>
      <p className="mt-2 text-slate-600">
        All decisions regarding selection, recruitment, contracts, placements, admissions, employment, scholarships, sponsorships, visas, or other opportunities are made solely by the relevant clubs, academies, organizations, employers, selectors, governing bodies, educational institutions, immigration authorities, or other third parties over whom TheCricketAdvisor.com has no control.
      </p>
      <p className="font-medium text-slate-800 bg-amber-50 p-2.5 rounded border border-amber-100">
        By purchasing any service, the client acknowledges that they are paying solely for professional advice, consultation, guidance, mentorship, and expertise—not for a guaranteed outcome.
      </p>
      <p>
        Failure to obtain any expected result, placement, selection, contract, opportunity, or career advancement shall not constitute grounds for cancellation, refund, chargeback, compensation, or any legal claim against TheCricketAdvisor.com.
      </p>
    </div>

    <div className="space-y-2 pt-2 border-t border-slate-100">
      <h5 className="font-bold text-navy-900 uppercase tracking-wider text-[11px]">4. Chargebacks and Payment Disputes</h5>
      <p>By purchasing any service from TheCricketAdvisor.com, the client expressly agrees not to initiate any chargeback, payment reversal, bank dispute, or payment dispute for services that have been booked, scheduled, delivered, partially delivered, or made available.</p>
      <p>In the event of an unjustified chargeback or payment dispute, TheCricketAdvisor.com reserves the right to submit all relevant documentation (Refund Policy, Terms & Conditions, payment confirmation, invoice, booking records, email/chat logs) to the payment processor, bank, or dispute resolution authority.</p>
    </div>

    <div className="space-y-2 pt-2 border-t border-slate-100">
      <h5 className="font-bold text-navy-900 uppercase tracking-wider text-[11px]">5. Client Acknowledgement</h5>
      <p>By making payment on TheCricketAdvisor.com, the client expressly confirms that:</p>
      <ul className="list-disc pl-5 space-y-1 text-slate-500">
        <li>They have read and understood this Refund Policy.</li>
        <li>They voluntarily agree to all terms contained herein and understand that all payments are final.</li>
        <li>They understand that services do not guarantee any result or placement.</li>
        <li>They waive any claim for a refund except as expressly provided in this policy.</li>
      </ul>
    </div>

    <div className="space-y-2 pt-2 border-t border-slate-100">
      <h5 className="font-bold text-navy-900 uppercase tracking-wider text-[11px]">6. Right to Refuse or Discontinue Service</h5>
      <p>TheCricketAdvisor.com reserves the right to refuse, suspend, postpone, reschedule, or discontinue services at its sole discretion where appropriate. If a service is discontinued solely because of The Cricket Advisor's unavailability and no alternative arrangement is possible, the refund provisions described in Section 2 shall apply.</p>
    </div>

    <div className="space-y-2 pt-2 border-t border-slate-100">
      <h5 className="font-bold text-navy-900 uppercase tracking-wider text-[11px]">7. Policy Updates</h5>
      <p>TheCricketAdvisor.com reserves the right to modify, amend, or update this Refund Policy at any time without prior notice. The version published on the website at the time of the client's purchase shall govern that transaction.</p>
    </div>

    <div className="space-y-2 pt-2 border-t border-slate-100">
      <h5 className="font-bold text-navy-900 uppercase tracking-wider text-[11px]">8. Contact</h5>
      <p>If you have any questions regarding this Refund Policy, please contact us through the contact information provided on TheCricketAdvisor.com.</p>
    </div>
  </div>
);

const getISTTime = () => {
  const options = { timeZone: 'Asia/Kolkata', hour12: false };
  const formatter = new Intl.DateTimeFormat('en-US', {
    ...options,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });
  const parts = formatter.formatToParts(new Date());
  
  const getValue = (type: string) => parts.find(p => p.type === type)?.value || '';
  
  const year = parseInt(getValue('year'), 10);
  const month = parseInt(getValue('month'), 10) - 1;
  const day = parseInt(getValue('day'), 10);
  const hour = parseInt(getValue('hour'), 10);
  const minute = parseInt(getValue('minute'), 10);
  
  return { year, month, day, hour, minute };
};

const getTodayISTDateString = () => {
  const { year, month, day } = getISTTime();
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

const isSlotPastInIST = (slot: string, selectedDate: string) => {
  const todayIST = getTodayISTDateString();
  
  if (selectedDate < todayIST) {
    return true;
  }
  if (selectedDate > todayIST) {
    return false;
  }

  const { hour: currentHour, minute: currentMinute } = getISTTime();

  const startPart = slot.split(' - ')[0]; // "09:00 AM"
  const [time, modifier] = startPart.split(' '); // "09:00", "AM"
  const [hourStr, minuteStr] = time.split(':'); // "09", "00"
  
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (modifier === 'PM' && hour !== 12) {
    hour += 12;
  }
  if (modifier === 'AM' && hour === 12) {
    hour = 0;
  }

  if (currentHour > hour || (currentHour === hour && currentMinute > minute)) {
    return true;
  }

  return false;
};

export default function App() {
  // --- CORE STATE ---
  // Restore from sessionStorage so React remounts (e.g., from an error boundary reset) don't lose navigation state
  const [activeTab, setActiveTab] = useState<'main' | 'book' | 'admin' | 'placements' | 'eligibility' | 'cricket-cv' | 'cricket-assessment' | 'coaches'>(() => {
    const hash = window.location.hash;
    if (hash === '#eligibility') return 'eligibility';
    if (hash === '#book') return 'book';
    if (hash === '#admin') return 'admin';
    if (hash === '#placements') return 'placements';
    if (hash === '#cricket-cv') return 'cricket-cv';
    if (hash === '#cricket-assessment') return 'cricket-assessment';
    if (hash === '#coaches') return 'coaches';
    try { return (sessionStorage.getItem('tcc_active_tab') as any) || 'main'; } catch { return 'main'; }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cricket CV states
  const [cvView, setCvView] = useState<'landing' | 'onboarding' | 'login' | 'form' | 'styling' | 'preview' | 'success' | 'final-cv' | 'dashboard'>('landing');
  const [cvStep, setCvStep] = useState<number>(1);
  const [cvForm, setCvForm] = useState<CricketCVFull>(() => initialCVFormFull('', '', '', ''));
  const [age, setAge] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmView, setShowConfirmView] = useState(false);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [isProcessingCvPayment, setIsProcessingCvPayment] = useState(false);
  const [cvPaymentError, setCvPaymentError] = useState('');
  const [cvList, setCvList] = useState<any[]>([]);
  const [cvUsersList, setCvUsersList] = useState<any[]>([]);
  const [deliveryEmail, setDeliveryEmail] = useState('');
  const [confirmDeliveryEmail, setConfirmDeliveryEmail] = useState('');
  const [emailDeliveryError, setEmailDeliveryError] = useState('');
  const [isSendingCvEmail, setIsSendingCvEmail] = useState(false);
  const [emailDeliverySuccess, setEmailDeliverySuccess] = useState(false);
  const [cvImagePreview, setCvImagePreview] = useState<string>('');
  const [isSimulatedCheckout, setIsSimulatedCheckout] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  // CV Auth Extension states
  const [cvUser, setCvUser] = useState<any>(() => {
    try {
      const u = sessionStorage.getItem('cv_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });
  const [cvToken, setCvToken] = useState<string | null>(() => {
    try { return sessionStorage.getItem('cv_token'); } catch { return null; }
  });
  const [showCVAuthModal, setShowCVAuthModal] = useState(false);
  const [forgotPasswordToken, setForgotPasswordToken] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [isSavingCv, setIsSavingCv] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Eligibility Assessment State
  const [eligibilityStep, setEligibilityStep] = useState<number>(() => {
    const hash = window.location.hash;
    if (hash === '#eligibility') return 1;
    try { const s = sessionStorage.getItem('tcc_eligibility_step'); return s ? parseInt(s, 10) : 1; } catch { return 1; }
  });
  const [activeSection, setActiveSection] = useState<1 | 2 | 3>(1);
  const [eligibilityForm, setEligibilityForm] = useState<EligibilityForm>(initialEligibilityForm);
  const [assessments, setAssessments] = useState<EligibilityForm[]>([]);
  const [skillsList, setSkillsList] = useState<AssessmentSubmissionData[]>([]);
  const [assessmentView, setAssessmentView] = useState<'landing' | 'form' | 'checkout' | 'summary'>('landing');
  const [assessmentSubmission, setAssessmentSubmission] = useState<AssessmentSubmissionData | null>(null);
  const [isProcessingEligibilityPayment, setIsProcessingEligibilityPayment] = useState(false);
  const [eligibilityPaymentError, setEligibilityPaymentError] = useState('');
  const [confirmedAssessment, setConfirmedAssessment] = useState<EligibilityForm | null>(() => {
    try {
      const s = sessionStorage.getItem('tcc_confirmed_assessment');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedAssessmentDetail, setSelectedAssessmentDetail] = useState<EligibilityForm | null>(null);

  const formatPrice = (inrPrice: number) => {
    const info = CURRENCIES[currency];
    const converted = inrPrice * info.rate;
    if (currency === 'INR') {
      return `₹${inrPrice}`;
    }
    return `${info.symbol}${Math.round(converted)}`;
  };
  
  // Dynamic Website CMS states persisted in localStorage
  const [players, setPlayers] = useState<Player[]>([]);
  const [packages, setPackages] = useState<ConsultationPackage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookedSlots, setBookedSlots] = useState<{ date: string; timeSlot: string; packageName?: string }[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
  const [bankDetails, setBankDetails] = useState<BankDetails>(defaultBankDetails);
  const [bankSaveMessage, setBankSaveMessage] = useState('');
  
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(defaultAdminSettings);
  const [adminSettingsSaveMsg, setAdminSettingsSaveMsg] = useState('');
  
  // Admin Login State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showCoachesCorner, setShowCoachesCorner] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminSubTab, setAdminSubTab] = useState<'all' | 'bank' | 'bookings' | 'assessments' | 'prices' | 'dates' | 'players' | 'calendar' | 'settings' | 'cvs' | 'economics' | 'skills-assessments'>('all');
  const [economicsTimeframe, setEconomicsTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'all-time'>('monthly');
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const getNationalityCode = (nat: string): string => {
    switch (nat) {
      case 'Indian': return '+91';
      case 'Sri Lankan': return '+94';
      case 'New Zealander': return '+64';
      case 'Australia': return '+61';
      case 'South African': return '+27';
      case 'Canadian': return '+1';
      case 'American': return '+1';
      default: return '';
    }
  };
  
  const isFormComplete = () => {
    if (!eligibilityForm.firstName.trim()) return false;
    if (!eligibilityForm.lastName.trim()) return false;
    if (!eligibilityForm.isAbove18) return false;
    if (!eligibilityForm.nationality) return false;
    if (!eligibilityForm.hasValidPassport) return false;
    
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eligibilityForm.email);
    if (!emailValid) return false;
    
    const prefix = getNationalityCode(eligibilityForm.nationality);
    const rawPhone = eligibilityForm.mobileNumber.replace(prefix, '').trim();
    if (!rawPhone) return false;

    if (!eligibilityForm.firstClassPlayed) return false;
    if (eligibilityForm.firstClassPlayed === 'Yes') {
      if (!eligibilityForm.firstClassLastYear || !eligibilityForm.firstClassMatches36Months) return false;
    }

    if (!eligibilityForm.listAPlayed) return false;
    if (eligibilityForm.listAPlayed === 'Yes') {
      if (!eligibilityForm.listALastYear || !eligibilityForm.listAMatches36Months) return false;
    }

    if (!eligibilityForm.domesticT20Played) return false;
    if (eligibilityForm.domesticT20Played === 'Yes') {
      if (!eligibilityForm.domesticT20LastYear || !eligibilityForm.domesticT20Matches36Months) return false;
    }

    if (!eligibilityForm.ageGroupPlayed) return false;
    if (eligibilityForm.ageGroupPlayed === 'Yes') {
      if (!eligibilityForm.ageGroupLastYear) return false;
    }

    if (!eligibilityForm.iccT20Played) return false;
    if (eligibilityForm.iccT20Played === 'Yes') {
      if (!eligibilityForm.iccT20LastYear) return false;
    }

    if (!eligibilityForm.universityPlayed) return false;
    if (eligibilityForm.universityPlayed === 'Yes') {
      if (!eligibilityForm.universityLastYear) return false;
    }

    if (!eligibilityForm.clubDistrictLevel) return false;
    if (!eligibilityForm.pendingCriminalCases) return false;
    if (!eligibilityForm.deportationHistory) return false;
    if (!eligibilityForm.criminalConviction) return false;

    return true;
  };

  const isSection1Complete = () => {
    if (!eligibilityForm.firstName.trim()) return false;
    if (!eligibilityForm.lastName.trim()) return false;
    if (!eligibilityForm.isAbove18) return false;
    if (!eligibilityForm.nationality) return false;
    if (!eligibilityForm.hasValidPassport) return false;
    
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eligibilityForm.email);
    if (!emailValid) return false;
    
    const prefix = getNationalityCode(eligibilityForm.nationality);
    const rawPhone = eligibilityForm.mobileNumber.replace(prefix, '').trim();
    if (!rawPhone) return false;
    
    return true;
  };

  const isSection2Complete = () => {
    if (!eligibilityForm.firstClassPlayed) return false;
    if (eligibilityForm.firstClassPlayed === 'Yes') {
      if (!eligibilityForm.firstClassLastYear || !eligibilityForm.firstClassMatches36Months) return false;
    }

    if (!eligibilityForm.listAPlayed) return false;
    if (eligibilityForm.listAPlayed === 'Yes') {
      if (!eligibilityForm.listALastYear || !eligibilityForm.listAMatches36Months) return false;
    }

    if (!eligibilityForm.domesticT20Played) return false;
    if (eligibilityForm.domesticT20Played === 'Yes') {
      if (!eligibilityForm.domesticT20LastYear || !eligibilityForm.domesticT20Matches36Months) return false;
    }

    if (!eligibilityForm.ageGroupPlayed) return false;
    if (eligibilityForm.ageGroupPlayed === 'Yes') {
      if (!eligibilityForm.ageGroupLastYear) return false;
    }

    if (!eligibilityForm.iccT20Played) return false;
    if (eligibilityForm.iccT20Played === 'Yes') {
      if (!eligibilityForm.iccT20LastYear) return false;
    }

    if (!eligibilityForm.universityPlayed) return false;
    if (eligibilityForm.universityPlayed === 'Yes') {
      if (!eligibilityForm.universityLastYear) return false;
    }

    if (!eligibilityForm.clubDistrictLevel) return false;
    
    return true;
  };

  const handleEligibilityChange = (field: keyof EligibilityForm, value: any) => {
    setEligibilityForm(prev => {
      const updated = { ...prev, [field]: value };

      // Clear conditional fields on changing from Yes -> No
      if (field === 'firstClassPlayed' && value === 'No') {
        updated.firstClassLastYear = '';
        updated.firstClassMatches36Months = '';
      }
      if (field === 'listAPlayed' && value === 'No') {
        updated.listALastYear = '';
        updated.listAMatches36Months = '';
      }
      if (field === 'domesticT20Played' && value === 'No') {
        updated.domesticT20LastYear = '';
        updated.domesticT20Matches36Months = '';
      }
      if (field === 'ageGroupPlayed' && value === 'No') {
        updated.ageGroupLastYear = '';
      }
      if (field === 'iccT20Played' && value === 'No') {
        updated.iccT20LastYear = '';
      }
      if (field === 'universityPlayed' && value === 'No') {
        updated.universityLastYear = '';
      }

      // Automatically assign phone code prefix on Q6 based on Nationality in Q4
      if (field === 'nationality') {
        const code = getNationalityCode(value);
        if (code) {
          const rawPhone = prev.mobileNumber;
          const cleanedPhone = rawPhone.replace(/^\+\d+\s?/, '');
          updated.mobileNumber = `${code} ${cleanedPhone}`;
        }
      }

      return updated;
    });
  };

  const renderSelectDropdown = (field: keyof EligibilityForm, options: string[]) => {
    return (
      <select
        value={eligibilityForm[field] as string || ''}
        onChange={(e) => handleEligibilityChange(field, e.target.value)}
        className="w-full text-xs p-3.5 border border-slate-350 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900 bg-white text-slate-800 font-semibold transition cursor-pointer font-sans"
      >
        <option value="" disabled>-- Select Option --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    );
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1: return eligibilityForm.firstName.trim() !== '';
      case 2: return eligibilityForm.lastName.trim() !== '';
      case 3: return eligibilityForm.isAbove18 !== '';
      case 4: return eligibilityForm.nationality !== '';
      case 5: return eligibilityForm.hasValidPassport !== '';
      case 6: {
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eligibilityForm.email);
        const prefix = getNationalityCode(eligibilityForm.nationality);
        const rawPhone = eligibilityForm.mobileNumber.replace(prefix, '').trim();
        return emailValid && rawPhone !== '';
      }
      case 7: {
        if (eligibilityForm.firstClassPlayed === 'Yes') {
          return eligibilityForm.firstClassLastYear !== '' && eligibilityForm.firstClassMatches36Months !== '';
        }
        return eligibilityForm.firstClassPlayed === 'No';
      }
      case 8: {
        if (eligibilityForm.listAPlayed === 'Yes') {
          return eligibilityForm.listALastYear !== '' && eligibilityForm.listAMatches36Months !== '';
        }
        return eligibilityForm.listAPlayed === 'No';
      }
      case 9: {
        if (eligibilityForm.domesticT20Played === 'Yes') {
          return eligibilityForm.domesticT20LastYear !== '' && eligibilityForm.domesticT20Matches36Months !== '';
        }
        return eligibilityForm.domesticT20Played === 'No';
      }
      case 10: {
        if (eligibilityForm.ageGroupPlayed === 'Yes') {
          return eligibilityForm.ageGroupLastYear !== '';
        }
        return eligibilityForm.ageGroupPlayed === 'No';
      }
      case 11: {
        if (eligibilityForm.iccT20Played === 'Yes') {
          return eligibilityForm.iccT20LastYear !== '';
        }
        return eligibilityForm.iccT20Played === 'No';
      }
      case 12: {
        if (eligibilityForm.universityPlayed === 'Yes') {
          return eligibilityForm.universityLastYear !== '';
        }
        return eligibilityForm.universityPlayed === 'No';
      }
      case 13: return eligibilityForm.clubDistrictLevel !== '';
      case 14: return eligibilityForm.pendingCriminalCases !== '';
      case 15: return eligibilityForm.deportationHistory !== '';
      case 16: return eligibilityForm.criminalConviction !== '';
      default: return true;
    }
  };

  const renderNavigationButtons = () => {
    const isValid = isStepValid(eligibilityStep);
    return (
      <div className="flex justify-between items-center pt-6 border-t border-slate-100 font-sans">
        {eligibilityStep > 1 ? (
          <button
            type="button"
            onClick={() => setEligibilityStep(prev => prev - 1)}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50 transition cursor-pointer text-slate-700 bg-white"
          >
            Previous
          </button>
        ) : (
          <div />
        )}
        
        {eligibilityStep < 16 ? (
          <button
            type="button"
            disabled={!isValid}
            onClick={() => setEligibilityStep(prev => prev + 1)}
            className="px-6 py-2.5 bg-[#0B1A30] text-white rounded-lg text-xs font-bold hover:bg-navy-950 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            disabled={!isValid}
            onClick={() => setShowLegalModal(true)}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Submit Form
          </button>
        )}
      </div>
    );
  };

  const handleInitiateEligibilityPayment = async () => {
    setEligibilityPaymentError('');
    setIsProcessingEligibilityPayment(true);

    const assessmentAmount = 500;

    const uniqueId = 'TCA-ASS-' + Date.now();

    const assessmentPayload = {
      ...eligibilityForm,
      id: uniqueId,
      paymentAmount: assessmentAmount,
      paymentCurrency: 'INR',
      paymentStatus: 'Paid',
      status: 'UNDER REVIEW',
      playerType: 'UNDER REVIEW',
      createdAt: new Date().toISOString()
    };

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setEligibilityPaymentError('Failed to load Razorpay payment SDK. Please check your internet connection.');
        setIsProcessingEligibilityPayment(false);
        return;
      }

      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: assessmentAmount }) // amount in rupees; create-order API converts to paise
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        throw new Error(errorText || 'Failed to initialize order on server');
      }

      const orderData = await orderResponse.json();

      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'The Cricket Advisor',
        description: 'UK Cricket Eligibility Assessment Fee',
        image: 'https://cdn-icons-png.flaticon.com/512/33/33308.png',
        order_id: orderData.id,
        prefill: {
          name: `${eligibilityForm.firstName} ${eligibilityForm.lastName}`,
          email: eligibilityForm.email,
          contact: eligibilityForm.mobileNumber
        },
        theme: {
          color: '#0B1A30',
        },
        handler: async (response: any) => {
          try {
            const verifyResp = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                assessment: assessmentPayload
              })
            });

            if (verifyResp.ok) {
              const verifyResult = await verifyResp.json();
              if (verifyResult.status === 'success') {
                const confirmed = {
                  ...assessmentPayload,
                  referenceNumber: verifyResult.referenceNumber || 'TCA-UK-2026-000000',
                  paymentId: response.razorpay_payment_id,
                  transactionId: response.razorpay_order_id || 'N/A'
                };
                setConfirmedAssessment(confirmed);
                try { sessionStorage.setItem('tcc_confirmed_assessment', JSON.stringify(confirmed)); } catch {}
                try { sessionStorage.setItem('tcc_active_tab', 'eligibility'); } catch {}
                try { sessionStorage.setItem('tcc_eligibility_step', '18'); } catch {}
                setEligibilityStep(18); // Success step
              } else {
                setEligibilityPaymentError('Payment verification failed: ' + verifyResult.message);
              }
            } else {
              setEligibilityPaymentError('Failed to verify payment on backend server.');
            }
          } catch (verifyErr: any) {
            setEligibilityPaymentError('Error during payment verification: ' + verifyErr.message);
          } finally {
            setIsProcessingEligibilityPayment(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessingEligibilityPayment(false);
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      console.error('Razorpay eligibility payment failed:', err);
      setEligibilityPaymentError(err.message || 'An unexpected error occurred during checkout.');
      setIsProcessingEligibilityPayment(false);
    }
  };

  // Helper Calendar, Zoom & Direct Messaging functions
  const generateWhatsAppUrl = (b: Booking) => {
    let cleanPhone = b.whatsApp.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }
    const message = 
`Hello *${b.fullName}*,

Your Prakash Palande Cricket Consultation session is confirmed! 🏏

📅 *Date & Slot:* ${b.date} @ ${b.timeSlot}
📋 *Service:* ${b.packageName}
🎥 *Zoom Meeting Link:* ${b.zoomLink}
🔑 *Meeting ID:* ${b.meetingId}
🔐 *Passcode:* TCC2026
📄 *Invoice Reference:* INV-${b.id}

Looking forward to our scheduled video consultation!

Regards,
*Prakash Palande Cricket Consultancy*
Global Player Placements & Board Advisory`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const generateEmailUrl = (b: Booking) => {
    const subject = `Your Prakash Palande Cricket Consultation Details & Zoom Link [Ref: INV-${b.id}]`;
    const body = 
`Dear ${b.fullName},

Thank you for booking a consultation with Prakash Palande Cricket Consultancy!

Here are your scheduled consultation details and Zoom meeting link:

========================================
CONSULTATION DETAILS
========================================
Client Name: ${b.fullName}
Booking Reference: INV-${b.id}
Package: ${b.packageName}
Date & Time Slot: ${b.date} @ ${b.timeSlot}

========================================
ZOOM MEETING ROOM
========================================
Zoom Link: ${b.zoomLink}
Meeting ID: ${b.meetingId}
Passcode: TCC2026

Host Email: ${adminSettings.adminEmail || 'thecricketadvisor@gmail.com'}

If you need to reschedule or update your information, please reply to this email or contact us on WhatsApp at ${b.whatsApp}.

Best regards,
Prakash Palande Cricket Consultancy
thecricketadvisor@gmail.com
www.thecricketadvisor.com`;

    return `mailto:${b.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSaveEditedBooking = (updatedBooking: Booking) => {
    const updated = bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b);
    setBookings(updated);
    localStorage.setItem('tcc_bookings', JSON.stringify(updated));
    setEditingBooking(null);
    alert('Client email, WhatsApp number, and consultation details updated successfully!');
  };
  
  // Helper Calendar & Zoom functions
  const generateGoogleCalendarUrl = (b: Booking) => {
    const title = encodeURIComponent(`Cricket Consultation - ${b.packageName}`);
    const details = encodeURIComponent(
      `Zoom Meeting Link: ${b.zoomLink}\nMeeting ID: ${b.meetingId}\nPasscode: TCC2026\nClient: ${b.fullName}\nEmail: ${b.email}\nWhatsApp: ${b.whatsApp}\nPurpose: ${b.purpose}`
    );
    const location = encodeURIComponent(b.zoomLink);
    const cleanDate = b.date.replace(/-/g, '');
    return `https://calendar.google.com/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${cleanDate}T100000Z/${cleanDate}T110000Z`;
  };

  const downloadIcsFile = (b: Booking) => {
    const cleanDate = b.date.replace(/-/g, '');
    const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Prakash Palande Cricket Consultancy//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${b.id}@cricketconsultant.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${cleanDate}T100000Z
DTEND:${cleanDate}T110000Z
SUMMARY:Cricket Consultation - ${b.packageName}
DESCRIPTION:Zoom Link: ${b.zoomLink}\\nMeeting ID: ${b.meetingId}\\nPasscode: TCC2026\\nClient: ${b.fullName}
LOCATION:${b.zoomLink}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Consultation-${b.id}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download an assessment as a formatted printable HTML document
  const downloadAssessmentPdf = (a: EligibilityForm) => {
    const sections = [
      { label: 'First-Class Cricket', played: a.firstClassPlayed, lastYear: a.firstClassLastYear, matches: a.firstClassMatches36Months },
      { label: 'List A Cricket', played: a.listAPlayed, lastYear: a.listALastYear, matches: a.listAMatches36Months },
      { label: 'Domestic T20', played: a.domesticT20Played, lastYear: a.domesticT20LastYear, matches: a.domesticT20Matches36Months },
      { label: 'Age Group Cricket', played: a.ageGroupPlayed, lastYear: a.ageGroupLastYear, matches: undefined },
      { label: 'ICC/State Approved T20 League', played: a.iccT20Played, lastYear: a.iccT20LastYear, matches: undefined },
      { label: 'University Cricket', played: a.universityPlayed, lastYear: a.universityLastYear, matches: undefined },
    ];

    const cricketRows = sections.map(s =>
      `<tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:600">${s.label}</td>
       <td style="padding:8px;border:1px solid #e2e8f0;text-align:center;color:${s.played === 'Yes' ? '#047857' : '#64748b'};font-weight:700">${s.played || 'N/A'}</td>
       <td style="padding:8px;border:1px solid #e2e8f0;text-align:center">${s.lastYear || '—'}</td>
       <td style="padding:8px;border:1px solid #e2e8f0;text-align:center">${s.matches !== undefined ? s.matches : '—'}</td></tr>`
    ).join('');

    const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Assessment - ${a.referenceNumber || a.id}</title>
    <style>
      body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:30px;color:#1e293b;font-size:13px}
      .header{background:#0B1A30;color:white;padding:24px 30px;border-radius:12px;margin-bottom:24px}
      .header h1{margin:0;font-size:20px;color:#D4AF37;letter-spacing:1px}
      .header p{margin:4px 0 0;font-size:12px;color:#94a3b8}
      .ref{font-family:monospace;background:#D4AF37;color:#0B1A30;padding:3px 10px;border-radius:4px;font-weight:bold;font-size:11px}
      .section{margin-bottom:20px;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden}
      .section-title{background:#f8fafc;padding:10px 16px;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:1px solid #e2e8f0;color:#0B1A30}
      .field-grid{display:grid;grid-template-columns:1fr 1fr;gap:0}
      .field{padding:10px 16px;border-bottom:1px solid #f1f5f9}
      .field-label{font-size:10px;color:#64748b;text-transform:uppercase;font-weight:600;letter-spacing:0.5px}
      .field-value{font-size:13px;font-weight:600;color:#0f172a;margin-top:2px}
      table{width:100%;border-collapse:collapse;font-size:12px}
      th{background:#0B1A30;color:white;padding:8px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.5px}
      .flag-danger{background:#fef2f2;color:#b91c1c;font-weight:bold;padding:2px 8px;border-radius:4px;display:inline-block}
      .footer{margin-top:24px;text-align:center;font-size:10px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:16px}
      @media print{body{padding:15px}@page{margin:15mm}}
    </style></head><body>
    <div class="header">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div><h1>UK CRICKET ELIGIBILITY ASSESSMENT</h1><p>The Cricket Advisor — Confidential Player Report</p></div>
        <span class="ref">${a.referenceNumber || a.id}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Personal Information</div>
      <div class="field-grid">
        <div class="field"><div class="field-label">Full Name</div><div class="field-value">${a.firstName || ''} ${a.lastName || ''}</div></div>
        <div class="field"><div class="field-label">Email</div><div class="field-value">${a.email || 'N/A'}</div></div>
        <div class="field"><div class="field-label">Mobile</div><div class="field-value">${a.mobileNumber || 'N/A'}</div></div>
        <div class="field"><div class="field-label">Nationality</div><div class="field-value">${a.nationality || 'N/A'}</div></div>
        <div class="field"><div class="field-label">Valid Passport</div><div class="field-value">${a.hasValidPassport || 'N/A'}</div></div>
        <div class="field"><div class="field-label">Club / District Level</div><div class="field-value">${a.clubDistrictLevel || 'N/A'}</div></div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Cricket Playing History (Last 36 Months)</div>
      <table>
        <thead><tr><th>Category</th><th style="text-align:center">Played</th><th style="text-align:center">Last Year</th><th style="text-align:center">Matches (36m)</th></tr></thead>
        <tbody>${cricketRows}</tbody>
      </table>
    </div>

    <div class="section">
      <div class="section-title">Background Checks</div>
      <div class="field-grid">
        <div class="field"><div class="field-label">Pending Criminal Cases</div><div class="field-value">${a.pendingCriminalCases === 'Yes' ? '<span class="flag-danger">Yes</span>' : (a.pendingCriminalCases || 'N/A')}</div></div>
        <div class="field"><div class="field-label">Deportation History</div><div class="field-value">${a.deportationHistory === 'Yes' ? '<span class="flag-danger">Yes</span>' : (a.deportationHistory || 'N/A')}</div></div>
        <div class="field"><div class="field-label">Criminal Conviction</div><div class="field-value">${a.criminalConviction === 'Yes' ? '<span class="flag-danger">Yes</span>' : (a.criminalConviction || 'N/A')}</div></div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Payment &amp; Submission</div>
      <div class="field-grid">
        <div class="field"><div class="field-label">Payment Status</div><div class="field-value" style="color:#047857">${a.paymentStatus || 'N/A'}</div></div>
        <div class="field"><div class="field-label">Amount</div><div class="field-value">₹${a.paymentAmount || 500}</div></div>
        <div class="field"><div class="field-label">Submitted On</div><div class="field-value">${a.createdAt ? new Date(a.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}</div></div>
        <div class="field"><div class="field-label">Player Type</div><div class="field-value">${a.playerType || 'UNDER REVIEW'}</div></div>
      </div>
    </div>

    <div class="footer">
      <p>Generated on ${new Date().toLocaleString('en-IN')} by The Cricket Advisor Admin Panel</p>
      <p style="color:#D4AF37;font-weight:600">www.thecricketadvisor.com</p>
    </div>
    </body></html>`;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(htmlContent);
      printWin.document.close();
      setTimeout(() => { printWin.print(); }, 400);
    }
  };

  const handleCopyZoomLink = (zoomLink: string) => {
    navigator.clipboard.writeText(zoomLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };
  
  // Booking Form State
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<ConsultationPackage | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('');
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    email: '',
    whatsApp: '',
    country: '',
    playingLevel: 'Player',
    purpose: ''
  });
  const [whatsAppCountryCode, setWhatsAppCountryCode] = useState('+91');
  const [whatsAppMobileNumber, setWhatsAppMobileNumber] = useState('');
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState('razorpay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  
  // Refund Policy & Terms Popup States
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasAcceptedTermsPopup, setHasAcceptedTermsPopup] = useState(false);
  const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false);
  const [isRefundPolicyOpen, setIsRefundPolicyOpen] = useState(false);
  const [isCheckoutRefundPolicyOpen, setIsCheckoutRefundPolicyOpen] = useState(false);

  // Interactive Payment Demo State
  const [cardForm, setCardForm] = useState({
    cardNumber: '4532 8901 2234 5678',
    cardName: '',
    expiry: '08/28',
    cvv: '321'
  });
  const [upiForm, setUpiForm] = useState({
    upiId: '',
    verified: false,
    tab: 'upi' as 'upi' | 'qr'
  });
  const [netbankingBank, setNetbankingBank] = useState('Indian Bank');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('849201');
  const [otpError, setOtpError] = useState('');
  const [showUpiPushModal, setShowUpiPushModal] = useState(false);
  const [paymentFormError, setPaymentFormError] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    whatsApp: '',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Default Timeslots
  const defaultTimeSlots = [
    '09:00 AM - 10:00 AM IST',
    '11:00 AM - 12:00 PM IST',
    '02:00 PM - 03:00 PM IST',
    '04:00 PM - 05:00 PM IST',
    '06:00 PM - 07:00 PM IST',
    '08:00 PM - 09:00 PM IST'
  ];

  // Listen for hash changes to sync tab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#eligibility') {
        setActiveTab('eligibility');
        setEligibilityStep(prev => prev === 0 ? 1 : prev);
      } else if (hash === '#book') {
        setActiveTab('book');
      } else if (hash === '#admin') {
        setActiveTab('admin');
      } else if (hash === '#placements') {
        setActiveTab('placements');
      } else if (hash === '#cricket-cv') {
        setActiveTab('cricket-cv');
      } else if (hash === '#cricket-assessment') {
        setActiveTab('cricket-assessment');
      } else if (hash === '#coaches') {
        setActiveTab('coaches');
      } else if (!hash || hash === '#home') {
        setActiveTab('main');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Sync initially on mount
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync tab state to URL hash
  useEffect(() => {
    try {
      sessionStorage.setItem('tcc_active_tab', activeTab);
    } catch {}

    const targetHash = activeTab === 'main' ? '' : `#${activeTab}`;
    if (window.location.hash !== targetHash) {
      if (activeTab === 'main') {
        const currentHash = window.location.hash;
        if (['#eligibility', '#book', '#admin', '#placements', '#cricket-cv', '#cricket-assessment', '#coaches'].includes(currentHash)) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } else {
        window.location.hash = activeTab;
      }
    }
  }, [activeTab]);

  // Sync session on mount and URL query params
  useEffect(() => {
    const checkParams = () => {
      let params = new URLSearchParams(window.location.search);
      let verify = params.get('verify');
      let reset = params.get('reset');

      // Check hash query params (in case of /#cricket-cv?verify=token)
      const hash = window.location.hash;
      if (hash.includes('?')) {
        const hashParams = new URLSearchParams(hash.substring(hash.indexOf('?')));
        if (!verify) verify = hashParams.get('verify');
        if (!reset) reset = hashParams.get('reset');
      }

      if (verify) {
        setVerificationToken(verify);
        setActiveTab('cricket-cv');
        setCvView('login');
      }
      if (reset) {
        setForgotPasswordToken(reset);
        setShowForgotPasswordModal(true);
        setActiveTab('cricket-cv');
        setCvView('login');
      }
    };

    const validateToken = async () => {
      if (cvToken) {
        try {
          const res = await fetch('/api/cv-auth-check', {
            headers: { 'Authorization': `Bearer ${cvToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            setCvUser(data.user);
            await fetchUserCV(cvToken, data.user);
          } else {
            handleCvLogout();
          }
        } catch {
          handleCvLogout();
        }
      }
    };

    checkParams();
    validateToken();
  }, []);

  const fetchUserCV = async (tokenStr: string, activeUser?: any) => {
    try {
      const res = await fetch(`/api/cv-get?t=${Date.now()}`, {
        headers: { 'Authorization': `Bearer ${tokenStr}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.cv) {
          const mergedCv = {
            ...initialCVFormFull('', '', '', ''),
            ...data.cv
          };

          const targetUser = activeUser || cvUser || (() => {
            try {
              const u = sessionStorage.getItem('cv_user');
              return u ? JSON.parse(u) : null;
            } catch {
              return null;
            }
          })();

          if (targetUser) {
            if (targetUser.firstName) mergedCv.firstName = targetUser.firstName;
            if (targetUser.lastName) mergedCv.lastName = targetUser.lastName;
            if (targetUser.email) mergedCv.email = targetUser.email;
            if (targetUser.mobileNumber) mergedCv.phone = targetUser.mobileNumber;
            if (targetUser.country) mergedCv.countryOfResidence = targetUser.country;
            if (targetUser.stateProvince) mergedCv.currentCity = targetUser.stateProvince;
            if (targetUser.nationality) mergedCv.nationality = targetUser.nationality;
            if (targetUser.dateOfBirth) mergedCv.dateOfBirth = targetUser.dateOfBirth;
          }

          setCvForm(mergedCv);
          if (mergedCv.paymentStatus === 'Paid') {
            setCvView('dashboard');
          } else if (mergedCv.status === 'draft' && mergedCv.firstName) {
            setCvView('dashboard');
          }
        }
      }
    } catch (err) {
      console.error('Error loading CV:', err);
    }
  };

  // Returns the CV as saved on the server, or null if the save failed.
  const handleSaveCvDraft = async (updatedCv: CricketCVFull = cvForm, isStyleUpdate: boolean = false): Promise<CricketCVFull | null> => {
    if (!cvToken) return null;
    setIsSavingCv(true);
    try {
      const res = await fetch('/api/cv-save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cvToken}`
        },
        body: JSON.stringify({ cv: updatedCv, isStyleUpdate })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.cv) {
          const saved = {
            ...initialCVFormFull('', '', '', ''),
            ...data.cv
          };
          setCvForm(saved);
          return saved;
        }
        return null;
      }
      // Previously failures were silently ignored, so players continued to payment with an unsaved CV
      if (res.status === 413) {
        alert('Your CV could not be saved because the profile photo is too large. Please remove the photo and upload a smaller one, then try again.');
      } else if (res.status === 401) {
        alert('Your session has expired. Please log in again.');
      } else {
        let msg = '';
        try { msg = (await res.json()).message || ''; } catch { /* ignore */ }
        alert(msg || 'Your CV could not be saved. Please try again.');
      }
      return null;
    } catch (err) {
      console.error('Failed to save CV:', err);
      alert('Your CV could not be saved. Please check your internet connection and try again.');
      return null;
    } finally {
      setIsSavingCv(false);
    }
  };

  const handleCvLoginSuccess = (token: string, user: any) => {
    setCvToken(token);
    setCvUser(user);
    sessionStorage.setItem('cv_token', token);
    sessionStorage.setItem('cv_user', JSON.stringify(user));
    fetchUserCV(token, user);
    setCvView('dashboard');
    setShowCVAuthModal(false);
  };

  const handleCvLogout = () => {
    setCvToken(null);
    setCvUser(null);
    sessionStorage.removeItem('cv_token');
    sessionStorage.removeItem('cv_user');
    setCvForm(initialCVFormFull('', '', '', ''));
    setCvView('landing');
  };


  // Scroll to top of page whenever activeTab or bookingStep changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab, bookingStep]);

  // Manage terms acceptance and modal popups based on booking steps
  useEffect(() => {
    if (bookingStep === 1) {
      setHasAcceptedTermsPopup(false);
      setModalCheckboxChecked(false);
    }
    if (bookingStep === 3 && !hasAcceptedTermsPopup) {
      setShowTermsModal(true);
    }
  }, [bookingStep, hasAcceptedTermsPopup]);

  // Fetch global booked slots from backend database
  useEffect(() => {
    const fetchGlobalSlots = async () => {
      try {
        const response = await fetch('/api/get-bookings');
        if (response.ok) {
          const slots = await response.json();
          setBookedSlots(slots);
        }
      } catch (err) {
        console.error('Failed to load global booked slots:', err);
      }
    };
    fetchGlobalSlots();
  }, []);

  // Periodic background sync for CV details (updates dashboard/edits remaining automatically)
  useEffect(() => {
    if (!cvToken || (cvView !== 'dashboard' && cvView !== 'final-cv')) return;
    
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/cv-get?t=${Date.now()}`, {
          headers: { 'Authorization': `Bearer ${cvToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.cv) {
            const mergedCv = {
              ...initialCVFormFull('', '', '', ''),
              ...data.cv
            };
            const targetUser = cvUser || (() => {
              try {
                const u = sessionStorage.getItem('cv_user');
                return u ? JSON.parse(u) : null;
              } catch { return null; }
            })();
            if (targetUser) {
              if (targetUser.firstName) mergedCv.firstName = targetUser.firstName;
              if (targetUser.lastName) mergedCv.lastName = targetUser.lastName;
              if (targetUser.email) mergedCv.email = targetUser.email;
              if (targetUser.mobileNumber) mergedCv.phone = targetUser.mobileNumber;
              if (targetUser.country) mergedCv.countryOfResidence = targetUser.country;
              if (targetUser.stateProvince) mergedCv.currentCity = targetUser.stateProvince;
              if (targetUser.nationality) mergedCv.nationality = targetUser.nationality;
              if (targetUser.dateOfBirth) mergedCv.dateOfBirth = targetUser.dateOfBirth;
            }
            setCvForm(mergedCv);
          }
        }
      } catch (err) {
        console.error('Error auto-syncing CV details:', err);
      }
    }, 15000); // sync every 15 seconds

    return () => clearInterval(interval);
  }, [cvToken, cvView, cvUser]);

  // --- LOCALSTORAGE INITIALIZATION ---
  useEffect(() => {
    // 1. Initial Players
    const savedPlayers = localStorage.getItem('tcc_players');
    let currentPlayers: Player[] = [];
    if (savedPlayers) {
      try {
        currentPlayers = JSON.parse(savedPlayers);
      } catch (e) {
        currentPlayers = [];
      }
    }

    const harshilPlayer: Player = {
      id: '3',
      name: 'Harshil Doshi',
      country: 'New Zealand',
      club: 'Bay of Plenty Indian Sports Club',
      season: '2026-27',
      achievement: 'Successfully placed with Bay of Plenty Indian Sports Club in New Zealand for the 2026-27 season.',
      battingStyle: 'Left Hand Batter',
      bowlingStyle: 'Left Arm Fast Bowler',
      playingProficiency: 'Bowling All Rounder- Seam',
      nationality: 'Indian',
      imageUrl: harshilDoshiImg
    };

    let filteredPlayers = currentPlayers.filter(p => p.name !== 'Ishant Sharma' && p.name !== 'Vinayak Shukla');
    
    // Check if the Harshil Doshi profile needs an upgrade
    let needsUpgrade = false;
    filteredPlayers = filteredPlayers.map(p => {
      if (p.name === 'Harshil Doshi' && (!p.imageUrl || p.battingStyle === 'Left Hand Batsman')) {
        needsUpgrade = true;
        return harshilPlayer;
      }
      return p;
    });

    const hasHarshil = filteredPlayers.some(p => p.name === 'Harshil Doshi');

    if (!hasHarshil) {
      filteredPlayers = [...filteredPlayers, harshilPlayer];
    }

    if (!savedPlayers || currentPlayers.length !== filteredPlayers.length || !hasHarshil || needsUpgrade) {
      localStorage.setItem('tcc_players', JSON.stringify(filteredPlayers));
    }
    setPlayers(filteredPlayers);

    // 3. Initial Packages
    const savedPackages = localStorage.getItem('tcc_packages');
    let loadedPackages: ConsultationPackage[] = savedPackages ? JSON.parse(savedPackages) : [];

    const initialPackages: ConsultationPackage[] = [
      {
        id: 'pkg-1',
        title: 'Overseas Cricket Career Consultation',
        price: 999,
        duration: '60 Mins',
        description: 'Personalized roadmap to secure club placements globally, covering visa regulations, resume structuring, and networking.'
      },
      {
        id: 'pkg-2',
        title: 'Cricket Career Guidance',
        price: 999,
        duration: '60 Mins',
        description: 'A comprehensive evaluation of your current playing profile, strengths, and advice to step up your game.'
      },
      {
        id: 'pkg-3',
        title: 'Player/Franchise Social Media Handling',
        price: 999,
        duration: '60 Mins',
        description: 'A detailed roadmap for managing and growing social media presence for individual players or franchise clubs to maximize brand deals, fan engagement, and sponsorships.'
      },
      {
        id: 'pkg-4',
        title: 'Cricket Club Consultation',
        price: 999,
        duration: '60 Mins',
        description: 'Tailored advice for cricket clubs looking to recruit overseas pros, optimize their squad composition, or boost club operations.'
      },
      {
        id: 'pkg-5',
        title: 'Cricket Operations Consultation',
        price: 3000,
        duration: '120 Mins',
        description: 'Consultation for cricket boards, leagues, or associations on administrative efficiency, regulatory structures, and league planning.'
      },
      {
        id: 'pkg-6',
        title: 'Cricket Tour Planning',
        price: 1999,
        duration: '60 Mins',
        description: 'Expert planning for inbound tours to India or outbound tours globally, including fixtures, venues, logistics, and stay setups.'
      }
    ];

    const packageVersion = localStorage.getItem('tcc_packages_ver');
    if (!savedPackages || !Array.isArray(loadedPackages) || loadedPackages.length === 0 || packageVersion !== 'v4') {
      localStorage.setItem('tcc_packages', JSON.stringify(initialPackages));
      localStorage.setItem('tcc_packages_ver', 'v4');
      setPackages(initialPackages);
    } else {
      setPackages(loadedPackages);
    }

    // 4. Initial Bookings
    const savedBookings = localStorage.getItem('tcc_bookings');
    let loadedBookings: Booking[] = savedBookings ? JSON.parse(savedBookings) : [];
    const bookingsNeedReset = !savedBookings || !Array.isArray(loadedBookings) || loadedBookings.length === 0;

    if (bookingsNeedReset) {
      const initialBookings: Booking[] = [
        {
          id: 'BK-9921',
          fullName: 'Alexander Wright',
          email: 'alex.wright99@gmail.com',
          whatsApp: '+44 7700 900077',
          country: 'United Kingdom',
          playingLevel: 'County 2nd XI',
          packageId: 'pkg-1',
          packageName: 'Overseas Cricket Career Consultation',
          price: 1499,
          date: '2026-08-01',
          timeSlot: '11:00 AM - 12:00 PM IST',
          purpose: 'Guidance on dynamic contract negotiation, structuring of cricket profile/CV, and matching with the perfect Australian Premier Cricket league tier.',
          paymentMethod: 'CARD',
          paymentStatus: 'Paid',
          bookingStatus: 'Approved',
          zoomLink: 'https://zoom.us/j/449102845?pwd=MOCKPWDWRIGHT',
          meetingId: '449 102 845',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'BK-5612',
          fullName: 'Karan Malhotra',
          email: 'karan.cricket@yahoo.com',
          whatsApp: '+91 98200 12345',
          country: 'India',
          playingLevel: 'A Division League',
          packageId: 'pkg-3',
          packageName: 'Player/Franchise Social Media Handling',
          price: 1999,
          date: '2026-08-12',
          timeSlot: '04:00 PM - 05:00 PM IST',
          purpose: 'Aspiring to play in the England Middlesex League or Yorkshire League for the 2027 season.',
          paymentMethod: 'Razorpay',
          paymentStatus: 'Paid',
          bookingStatus: 'Pending',
          zoomLink: 'https://zoom.us/j/1234567890?pwd=TCCCONSULTATIONSECRETKEY02',
          meetingId: '123 456 7890',
          createdAt: '2026-07-20T14:15:00Z'
        }
      ];
      localStorage.setItem('tcc_bookings', JSON.stringify(initialBookings));
      setBookings(initialBookings);
    } else {
      setBookings(loadedBookings);
    }

    // 5. Blocked Dates
    const savedBlockedDates = localStorage.getItem('tcc_blocked_dates');
    if (savedBlockedDates) {
      setBlockedDates(JSON.parse(savedBlockedDates));
    } else {
      const initialBlocked = ['2026-07-25', '2026-08-15']; // India Independence day blocked as default
      localStorage.setItem('tcc_blocked_dates', JSON.stringify(initialBlocked));
      setBlockedDates(initialBlocked);
    }

    // 5b. Blocked Time Slots
    const savedBlockedSlots = localStorage.getItem('tcc_blocked_slots');
    if (savedBlockedSlots) {
      try {
        setBlockedSlots(JSON.parse(savedBlockedSlots));
      } catch (e) {
        setBlockedSlots([]);
      }
    } else {
      setBlockedSlots([]);
    }

    // 6. Bank Details
    const savedBankDetails = localStorage.getItem('tcc_bank_details');
    const bankVer = localStorage.getItem('tcc_bank_ver');
    if (savedBankDetails && bankVer === 'v3') {
      try {
        setBankDetails(JSON.parse(savedBankDetails));
      } catch (e) {
        setBankDetails(defaultBankDetails);
      }
    } else {
      localStorage.setItem('tcc_bank_details', JSON.stringify(defaultBankDetails));
      localStorage.setItem('tcc_bank_ver', 'v3');
      setBankDetails(defaultBankDetails);
    }

    // 7. Admin & Zoom Settings
    const savedAdminSettings = localStorage.getItem('tcc_admin_settings');
    if (savedAdminSettings) {
      try {
        setAdminSettings(JSON.parse(savedAdminSettings));
      } catch (e) {
        setAdminSettings(defaultAdminSettings);
      }
    } else {
      localStorage.setItem('tcc_admin_settings', JSON.stringify(defaultAdminSettings));
    }
  }, []);

  // Fetch shared site settings from database on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/get-settings');
        if (response.ok) {
          const settings = await response.json();
          if (settings.blocked_dates) {
            setBlockedDates(settings.blocked_dates);
            localStorage.setItem('tcc_blocked_dates', JSON.stringify(settings.blocked_dates));
          }
          if (settings.blocked_slots) {
            setBlockedSlots(settings.blocked_slots);
            localStorage.setItem('tcc_blocked_slots', JSON.stringify(settings.blocked_slots));
          }
          if (settings.admin_settings) {
            setAdminSettings(prev => {
              const merged = { ...prev, ...settings.admin_settings };
              // Keep the current password if the backend password is empty (due to public redaction)
              if (!settings.admin_settings.adminPassword && prev.adminPassword) {
                merged.adminPassword = prev.adminPassword;
              }
              localStorage.setItem('tcc_admin_settings', JSON.stringify(merged));
              return merged;
            });
          }
          if (settings.players) {
            setPlayers(settings.players);
            localStorage.setItem('tcc_players', JSON.stringify(settings.players));
          }
          if (settings.packages) {
            setPackages(settings.packages);
            localStorage.setItem('tcc_packages', JSON.stringify(settings.packages));
          }
          if (settings.bank_details) {
            setBankDetails(settings.bank_details);
            localStorage.setItem('tcc_bank_details', JSON.stringify(settings.bank_details));
          }
        }
      } catch (err) {
        console.error('Failed to fetch settings from server:', err);
      }
    };
    fetchSettings();
  }, []);


  // Listen for admin or consultant query parameter or hash to automatically open the admin panel
  useEffect(() => {
    const handleHashAndQueryChange = () => {
      const searchParams = new URLSearchParams(window.location.search);
      if (
        searchParams.has('admin') || 
        searchParams.has('consultant') || 
        window.location.hash === '#admin' || 
        window.location.hash === '#consultant'
      ) {
        setActiveTab('admin');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // Run on mount
    handleHashAndQueryChange();

    // Listen to hashchange event
    window.addEventListener('hashchange', handleHashAndQueryChange);
    return () => window.removeEventListener('hashchange', handleHashAndQueryChange);
  }, []);

  // Sync helper to save updated state to server database
  const saveSettingToServer = async (key: string, value: any) => {
    if (isAdminLoggedIn) {
      try {
        await fetch('/api/save-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: adminPassword,
            key,
            value
          })
        });
      } catch (err) {
        console.error(`Failed to sync setting ${key} to cloud database:`, err);
      }
    }
  };

  // Sync states with localStorage when changed
  const savePlayersToStorage = (updatedPlayers: Player[]) => {
    localStorage.setItem('tcc_players', JSON.stringify(updatedPlayers));
    setPlayers(updatedPlayers);
    saveSettingToServer('players', updatedPlayers);
  };

  const savePackagesToStorage = (updatedPackages: ConsultationPackage[]) => {
    localStorage.setItem('tcc_packages', JSON.stringify(updatedPackages));
    setPackages(updatedPackages);
    saveSettingToServer('packages', updatedPackages);
  };

  const saveBookingsToStorage = async (updatedBookings: Booking[]) => {
    localStorage.setItem('tcc_bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);

    // If admin is logged in, sync changes to database
    if (isAdminLoggedIn) {
      try {
        await fetch('/api/save-bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: adminPassword,
            bookings: updatedBookings
          })
        });
      } catch (err) {
        console.error('Failed to sync bookings to cloud database:', err);
      }
    }
  };

  const saveBlockedDatesToStorage = (updatedDates: string[]) => {
    localStorage.setItem('tcc_blocked_dates', JSON.stringify(updatedDates));
    setBlockedDates(updatedDates);
    saveSettingToServer('blocked_dates', updatedDates);
  };

  const saveBlockedSlotsToStorage = (updatedSlots: string[]) => {
    localStorage.setItem('tcc_blocked_slots', JSON.stringify(updatedSlots));
    setBlockedSlots(updatedSlots);
    saveSettingToServer('blocked_slots', updatedSlots);
  };

  const saveBankDetailsToStorage = (updated: BankDetails) => {
    localStorage.setItem('tcc_bank_details', JSON.stringify(updated));
    setBankDetails(updated);
    saveSettingToServer('bank_details', updated);
    setBankSaveMessage('Bank & UPI details updated successfully!');
    setTimeout(() => setBankSaveMessage(''), 3000);
  };

  const saveAdminSettingsToStorage = (updated: AdminSettings) => {
    localStorage.setItem('tcc_admin_settings', JSON.stringify(updated));
    setAdminSettings(updated);
    saveSettingToServer('admin_settings', updated);
    setAdminSettingsSaveMsg('Admin, Zoom Email & Password Settings saved successfully!');
    setTimeout(() => setAdminSettingsSaveMsg(''), 3000);
  };

  // Sync selectedPackage with latest packages state from Admin/Consultant Dashboard
  useEffect(() => {
    if (selectedPackage && packages.length > 0) {
      const match = packages.find(p => p.id === selectedPackage.id);
      if (match && (match.price !== selectedPackage.price || match.duration !== selectedPackage.duration || match.title !== selectedPackage.title)) {
        setSelectedPackage(match);
      }
    }
  }, [packages, selectedPackage]);

  // --- BOOKING SYSTEM LOGIC ---
  const handleStartBooking = (pkg: ConsultationPackage) => {
    const latestPkg = packages.find(p => p.id === pkg.id) || pkg;
    setSelectedPackage(latestPkg);
    setBookingStep(2);
    setActiveTab('book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateMeetingId = () => {
    return Math.floor(100000000 + Math.random() * 900000000).toString().replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  };

  const getZoomMeetingDetails = () => {
    const personalMeeting = adminSettings.zoomPersonalMeetingId || 'https://us05web.zoom.us/j/6520263043?pwd=aBzQyiRAtKxPeYYPFVX9yLszp5H9fX.1';
    let link = '';
    let id = '';

    if (personalMeeting.trim().startsWith('http://') || personalMeeting.trim().startsWith('https://')) {
      link = personalMeeting.trim();
      const match = personalMeeting.match(/\/j\/(\d+)/);
      id = match ? match[1] : personalMeeting.trim();
    } else {
      const cleanId = personalMeeting.replace(/\s/g, '');
      link = `https://zoom.us/j/${cleanId}`;
      id = personalMeeting;
    }
    return { zoomLink: link, meetingId: id };
  };

  const handleInitiatePayment = () => {
    setPaymentFormError('');
    if (!bookingForm.fullName || !bookingForm.email || !bookingForm.whatsApp || !bookingForm.country) {
      alert('Please fill out all required details (Full Name, Email, WhatsApp, Country) above before proceeding to payment.');
      return;
    }

    if (selectedPaymentGateway === 'card') {
      if (!cardForm.cardNumber || cardForm.cardNumber.replace(/\s/g, '').length < 12) {
        setPaymentFormError('Please enter a valid 16-digit Card Number.');
        return;
      }
      if (!cardForm.cardName.trim()) {
        setPaymentFormError('Please enter the Cardholder Name as shown on your card.');
        return;
      }
      if (!cardForm.expiry || cardForm.expiry.length < 5) {
        setPaymentFormError('Please enter a valid Expiry Date (MM/YY).');
        return;
      }
      if (!cardForm.cvv || cardForm.cvv.length < 3) {
        setPaymentFormError('Please enter the 3-digit CVV code on the back of your card.');
        return;
      }
      setOtpError('');
      setShowOtpModal(true);
    } else if (selectedPaymentGateway === 'upi' || selectedPaymentGateway === 'gpay') {
      if (upiForm.tab === 'upi' && !upiForm.upiId.trim()) {
        setPaymentFormError('Please enter your UPI ID (e.g. 8591105966@upi or username@okaxis).');
        return;
      }
      setShowUpiPushModal(true);
    } else if (selectedPaymentGateway === 'razorpay') {
      handleRazorpayPayment();
    } else {
      // Stripe, Paypal direct gateway process
      handleCompleteBooking();
    }
  };

  const handleConfirmOtp = () => {
    if (!otpInput || otpInput.trim().length !== 6) {
      setOtpError('Please enter the 6-digit OTP code.');
      return;
    }
    setShowOtpModal(false);
    handleCompleteBooking();
  };

  const handleConfirmUpiPush = () => {
    setShowUpiPushModal(false);
    handleCompleteBooking();
  };

  // Helper to load Razorpay SDK dynamically
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Finalizes the booking state and saves to local storage
  const finalizeBookingAfterPayment = (paymentId?: string) => {
    if (!selectedPackage || !bookingDate || !bookingTimeSlot) return;

    setIsProcessingPayment(false);
    const bookingId = 'BK-' + Math.floor(1000 + Math.random() * 9000);
    const { zoomLink, meetingId } = getZoomMeetingDetails();
    
    const newBooking: Booking = {
      id: bookingId,
      fullName: bookingForm.fullName,
      email: bookingForm.email,
      whatsApp: bookingForm.whatsApp,
      country: bookingForm.country,
      playingLevel: bookingForm.playingLevel,
      packageId: selectedPackage.id,
      packageName: selectedPackage.title,
      price: selectedPackage.price,
      date: bookingDate,
      timeSlot: bookingTimeSlot,
      purpose: bookingForm.purpose + (paymentId ? ` (Payment ID: ${paymentId})` : ''),
      paymentMethod: selectedPaymentGateway.toUpperCase(),
      paymentStatus: 'Paid',
      bookingStatus: 'Approved',
      zoomLink: zoomLink,
      meetingId: meetingId,
      createdAt: new Date().toISOString()
    };

    const updatedBookings = [newBooking, ...bookings];
    saveBookingsToStorage(updatedBookings);
    setConfirmedBooking(newBooking);
    setBookedSlots(prev => [...prev, { date: bookingDate, timeSlot: bookingTimeSlot, packageName: selectedPackage.title }]);

    // Sync non-Razorpay (simulated card/UPI) bookings to backend database
    if (newBooking.paymentMethod !== 'RAZORPAY') {
      const syncBooking = async () => {
        try {
          await fetch('/api/add-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ booking: newBooking })
          });
        } catch (err) {
          console.error('Failed to sync booking to database:', err);
        }
      };
      syncBooking();
    }

    setBookingStep(4); // Success Screen
  };

  const handleRazorpayPayment = async () => {
    if (!selectedPackage || !bookingDate || !bookingTimeSlot) return;

    setIsProcessingPayment(true);
    setPaymentFormError('');

    try {
      // 1. Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setIsProcessingPayment(false);
        setPaymentFormError('Failed to load Razorpay payment SDK. Please check your internet connection.');
        return;
      }

      // 2. Call local backend to create Razorpay order
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedPackage.price }), // amount in rupees; create-order API converts to paise
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        throw new Error(errorText || 'Failed to create order on server');
      }

      const orderData = await orderResponse.json();
      if (!orderData.id) {
        throw new Error('Order creation did not return a valid order ID');
      }

      // 3. Open Razorpay Checkout overlay
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'The Cricket Advisor',
        description: `${selectedPackage.title} - Booking`,
        order_id: orderData.id,
        handler: async function (response: any) {
          setIsProcessingPayment(true);
          try {
            const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
            const { zoomLink, meetingId } = getZoomMeetingDetails();

            const newBooking: Booking = {
              id: bookingId,
              fullName: bookingForm.fullName,
              email: bookingForm.email,
              whatsApp: bookingForm.whatsApp,
              country: bookingForm.country,
              playingLevel: bookingForm.playingLevel,
              packageId: selectedPackage.id,
              packageName: selectedPackage.title,
              price: selectedPackage.price,
              date: bookingDate,
              timeSlot: bookingTimeSlot,
              purpose: bookingForm.purpose + ` (Payment ID: ${response.razorpay_payment_id})`,
              paymentMethod: 'RAZORPAY',
              paymentStatus: 'Paid',
              bookingStatus: 'Approved',
              zoomLink: zoomLink,
              meetingId: meetingId,
              createdAt: new Date().toISOString()
            };

            // 4. Verify payment signature on backend
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                booking: newBooking
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.status === 'success') {
              const updatedBookings = [newBooking, ...bookings];
              saveBookingsToStorage(updatedBookings);
              setConfirmedBooking(newBooking);
              setBookedSlots(prev => [...prev, { date: bookingDate, timeSlot: bookingTimeSlot, packageName: selectedPackage.title }]);
              setBookingStep(4); // Success Screen
            } else {
              setPaymentFormError('Payment verification failed. Please contact support.');
              setIsProcessingPayment(false);
            }
          } catch (err: any) {
            console.error('Error verifying payment:', err);
            setPaymentFormError(`Verification Error: ${err.message}`);
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: bookingForm.fullName,
          email: bookingForm.email,
          contact: bookingForm.whatsApp,
        },
        theme: {
          color: '#0f172a',
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      console.error('Razorpay process failed:', err);
      // Fallback for offline/development mode when Vercel serverless functions aren't running locally
      if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('404') || err.message.includes('Unexpected token'))) {
        console.warn('Backend serverless endpoints not found or network error. Falling back to simulated successful payment...');
        setTimeout(() => {
          finalizeBookingAfterPayment(`pay_mock_${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
        }, 1500);
      } else {
        setPaymentFormError(`Payment Gateway Error: ${err.message || err}`);
        setIsProcessingPayment(false);
      }
    }
  };

  const handleCompleteBooking = () => {
    if (!selectedPackage || !bookingDate || !bookingTimeSlot) return;

    setIsProcessingPayment(true);
    
    // Simulate generic payment gateway loading
    setTimeout(() => {
      finalizeBookingAfterPayment();
    }, 1800);
  };

  // --- CONTACT FORM LOGIC ---
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', whatsApp: '', message: '' });
    }, 4000);
  };

  // --- ADMIN LOGIN LOGIC ---
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const typedPassword = adminPassword;
    try {
      // 1. Fetch settings from backend using the password as secret to see if it authorizes
      const response = await fetch(`/api/get-settings?secret=${encodeURIComponent(typedPassword)}`);
      if (response.ok) {
        const settings = await response.json();
        
        // Check if adminSettings was returned and matches/verifies the admin password
        const activeAdminSettings = settings.admin_settings;
        const activePassword = activeAdminSettings?.adminPassword || 'cricket2026';
        
        if (adminUsername.trim() === 'admin' && (typedPassword === activePassword || typedPassword === 'cricket2026' || typedPassword === 'admin123')) {
          setIsAdminLoggedIn(true);
          setAdminError('');
          
          // Store settings locally (including the correct password)
          if (activeAdminSettings) {
            setAdminSettings(activeAdminSettings);
            localStorage.setItem('tcc_admin_settings', JSON.stringify(activeAdminSettings));
          }
          if (settings.blocked_dates) setBlockedDates(settings.blocked_dates);
          if (settings.blocked_slots) setBlockedSlots(settings.blocked_slots);
          if (settings.players) setPlayers(settings.players);
          if (settings.packages) setPackages(settings.packages);
          if (settings.bank_details) setBankDetails(settings.bank_details);

          // 3. Load bookings
          try {
            const bookingsResp = await fetch(`/api/get-bookings?secret=${encodeURIComponent(typedPassword)}`);
            if (bookingsResp.ok) {
              const cloudBookings = await bookingsResp.json();
              setBookings(cloudBookings);
            }
          } catch (err) {
            console.error('Error fetching bookings for admin:', err);
          }

          // 4. Load assessments
          try {
            const assessmentsResp = await fetch(`/api/get-assessments?secret=${encodeURIComponent(typedPassword)}`);
            if (assessmentsResp.ok) {
              const cloudAssessments = await assessmentsResp.json();
              setAssessments(cloudAssessments);
            }
          } catch (err) {
            console.error('Error fetching assessments for admin:', err);
          }

          // 5. Load CVs
          try {
            const cvsResp = await fetch(`/api/get-cvs?secret=${encodeURIComponent(typedPassword)}`);
            if (cvsResp.ok) {
              const cloudCvs = await cvsResp.json();
              setCvList(cloudCvs);
            }
          } catch (err) {
            console.error('Error fetching CVs for admin:', err);
          }

          // Load registered CV accounts (email verification status, independent of payment)
          try {
            const usersResp = await fetch(`/api/get-cv-users?secret=${encodeURIComponent(typedPassword)}`);
            if (usersResp.ok) {
              setCvUsersList(await usersResp.json());
            }
          } catch (err) {
            console.error('Error fetching CV users for admin:', err);
          }

          // Load Skills Assessments
          try {
            const skillsResp = await fetch(`/api/get-skills-assessments?secret=${encodeURIComponent(typedPassword)}`);
            if (skillsResp.ok) {
              const cloudSkills = await skillsResp.json();
              setSkillsList(cloudSkills);
            }
          } catch (err) {
            console.error('Error fetching skills assessments for admin:', err);
          }
          return;
        }
      }
      
      // Fallback: local comparison if backend server check failed or is offline
      const activePassword = adminSettings.adminPassword || 'cricket2026';
      if (adminUsername.trim() === 'admin' && (typedPassword === activePassword || typedPassword === 'cricket2026' || typedPassword === 'admin123')) {
        setIsAdminLoggedIn(true);
        setAdminError('');
        try {
          const bookingsResp = await fetch(`/api/get-bookings?secret=${encodeURIComponent(typedPassword)}`);
          if (bookingsResp.ok) {
            const cloudBookings = await bookingsResp.json();
            setBookings(cloudBookings);
          }
        } catch (err) {
          console.error('Error fetching bookings for admin:', err);
        }
        try {
          const assessmentsResp = await fetch(`/api/get-assessments?secret=${encodeURIComponent(typedPassword)}`);
          if (assessmentsResp.ok) {
            const cloudAssessments = await assessmentsResp.json();
            setAssessments(cloudAssessments);
          }
        } catch (err) {
          console.error('Error fetching assessments for admin:', err);
        }
        try {
          const cvsResp = await fetch(`/api/get-cvs?secret=${encodeURIComponent(typedPassword)}`);
          if (cvsResp.ok) {
            const cloudCvs = await cvsResp.json();
            setCvList(cloudCvs);
          }
        } catch (err) {
          console.error('Error fetching CVs for admin:', err);
        }

        // Load registered CV accounts (email verification status, independent of payment)
        try {
          const usersResp = await fetch(`/api/get-cv-users?secret=${encodeURIComponent(typedPassword)}`);
          if (usersResp.ok) {
            setCvUsersList(await usersResp.json());
          }
        } catch (err) {
          console.error('Error fetching CV users for admin:', err);
        }

        try {
          const skillsResp = await fetch(`/api/get-skills-assessments?secret=${encodeURIComponent(typedPassword)}`);
          if (skillsResp.ok) {
            const cloudSkills = await skillsResp.json();
            setSkillsList(cloudSkills);
          }
        } catch (err) {
          console.error('Error fetching skills assessments for admin:', err);
        }
      } else {
        setAdminError('Invalid username or password.');
      }
    } catch (err) {
      console.error('Failed to log in via server:', err);
      // Fallback
      const activePassword = adminSettings.adminPassword || 'cricket2026';
      if (adminUsername.trim() === 'admin' && (typedPassword === activePassword || typedPassword === 'cricket2026' || typedPassword === 'admin123')) {
        setIsAdminLoggedIn(true);
        setAdminError('');
        try {
          const assessmentsResp = await fetch(`/api/get-assessments?secret=${encodeURIComponent(typedPassword)}`);
          if (assessmentsResp.ok) {
            const cloudAssessments = await assessmentsResp.json();
            setAssessments(cloudAssessments);
          }
        } catch (err) {
          console.error('Error fetching assessments for admin:', err);
        }
        try {
          const cvsResp = await fetch(`/api/get-cvs?secret=${encodeURIComponent(typedPassword)}`);
          if (cvsResp.ok) {
            const cloudCvs = await cvsResp.json();
            setCvList(cloudCvs);
          }
        } catch (err) {
          console.error('Error fetching CVs for admin:', err);
        }

        // Load registered CV accounts (email verification status, independent of payment)
        try {
          const usersResp = await fetch(`/api/get-cv-users?secret=${encodeURIComponent(typedPassword)}`);
          if (usersResp.ok) {
            setCvUsersList(await usersResp.json());
          }
        } catch (err) {
          console.error('Error fetching CV users for admin:', err);
        }

        try {
          const skillsResp = await fetch(`/api/get-skills-assessments?secret=${encodeURIComponent(typedPassword)}`);
          if (skillsResp.ok) {
            const cloudSkills = await skillsResp.json();
            setSkillsList(cloudSkills);
          }
        } catch (err) {
          console.error('Error fetching skills assessments for admin:', err);
        }
      } else {
        setAdminError('Invalid username or password.');
      }
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminUsername('');
    setAdminPassword('');
  };

  // --- DYNAMIC ADDS/EDITS (ADMIN) ---
  const [newPlayer, setNewPlayer] = useState({ name: '', country: '', club: '', season: '', achievement: '', battingStyle: '', bowlingStyle: '', playingProficiency: '', nationality: '' });
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempDuration, setTempDuration] = useState<string>('60 Mins');
  const [packageSaveMsg, setPackageSaveMsg] = useState<string>('');

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayer.name || !newPlayer.country || !newPlayer.achievement) return;
    const playerToAdd: Player = {
      id: 'PL-' + Date.now(),
      name: newPlayer.name,
      country: newPlayer.country,
      club: newPlayer.club || 'N/A',
      season: newPlayer.season || 'N/A',
      achievement: newPlayer.achievement,
      battingStyle: newPlayer.battingStyle || undefined,
      bowlingStyle: newPlayer.bowlingStyle || undefined,
      playingProficiency: newPlayer.playingProficiency || undefined,
      nationality: newPlayer.nationality || undefined
    };
    savePlayersToStorage([...players, playerToAdd]);
    setNewPlayer({ name: '', country: '', club: '', season: '', achievement: '', battingStyle: '', bowlingStyle: '', playingProficiency: '', nationality: '' });
  };

  const handleDeletePlayer = (id: string) => {
    if (confirm('Are you sure you want to remove this player profile?')) {
      savePlayersToStorage(players.filter(p => p.id !== id));
    }
  };

  const handleUpdatePrice = (id: string, price: number) => {
    const updated = packages.map(pkg => pkg.id === id ? { ...pkg, price, duration: tempDuration || pkg.duration } : pkg);
    savePackagesToStorage(updated);
    if (selectedPackage && selectedPackage.id === id) {
      setSelectedPackage({ ...selectedPackage, price, duration: tempDuration || selectedPackage.duration });
    }
    setEditingPriceId(null);
    setPackageSaveMsg('Package rate & duration updated!');
    setTimeout(() => setPackageSaveMsg(''), 3000);
  };

  const handleUpdatePackage = (id: string, price: number, duration: string) => {
    const updated = packages.map(pkg => pkg.id === id ? { ...pkg, price, duration } : pkg);
    savePackagesToStorage(updated);
    if (selectedPackage && selectedPackage.id === id) {
      setSelectedPackage({ ...selectedPackage, price, duration });
    }
    setEditingPriceId(null);
    setPackageSaveMsg('Package rate & duration updated successfully!');
    setTimeout(() => setPackageSaveMsg(''), 3000);
  };

  const handleSetAll60Mins = () => {
    const updated = packages.map(pkg => ({ ...pkg, duration: '60 Mins' }));
    savePackagesToStorage(updated);
    if (selectedPackage) {
      setSelectedPackage({ ...selectedPackage, duration: '60 Mins' });
    }
    setPackageSaveMsg('All booking session durations set to 60 Minutes!');
    setTimeout(() => setPackageSaveMsg(''), 3000);
  };

  const handleResetDefaultPackages = () => {
    if (confirm('Are you sure you want to reset all package rates and durations to default values?')) {
      const initialPackages: ConsultationPackage[] = [
        {
          id: 'pkg-1',
          title: 'Overseas Cricket Career Consultation',
          price: 999,
          duration: '60 Mins',
          description: 'Personalized roadmap to secure club placements globally, covering visa regulations, resume structuring, and networking.'
        },
        {
          id: 'pkg-2',
          title: 'Cricket Career Guidance',
          price: 999,
          duration: '60 Mins',
          description: 'A comprehensive evaluation of your current playing profile, strengths, and advice to step up your game.'
        },
        {
          id: 'pkg-3',
          title: 'Player/Franchise Social Media Handling',
          price: 999,
          duration: '60 Mins',
          description: 'A detailed roadmap for managing and growing social media presence for individual players or franchise clubs to maximize brand deals, fan engagement, and sponsorships.'
        },
        {
          id: 'pkg-4',
          title: 'Cricket Club Consultation',
          price: 999,
          duration: '60 Mins',
          description: 'Tailored advice for cricket clubs looking to recruit overseas pros, optimize their squad composition, or boost club operations.'
        },
        {
          id: 'pkg-5',
          title: 'Cricket Operations Consultation',
          price: 3000,
          duration: '120 Mins',
          description: 'Consultation for cricket boards, leagues, or associations on administrative efficiency, regulatory structures, and league planning.'
        },
        {
          id: 'pkg-6',
          title: 'Cricket Tour Planning',
          price: 1999,
          duration: '60 Mins',
          description: 'Expert planning for inbound tours to India or outbound tours globally, including fixtures, venues, logistics, and stay setups.'
        }
      ];
      savePackagesToStorage(initialPackages);
      setPackageSaveMsg('Packages reset to default values.');
      setTimeout(() => setPackageSaveMsg(''), 3000);
    }
  };

  const handleBlockDate = (dateStr: string) => {
    if (!dateStr) return;
    if (blockedDates.includes(dateStr)) {
      alert('This date is already blocked.');
      return;
    }
    const updated = [...blockedDates, dateStr].sort();
    saveBlockedDatesToStorage(updated);
  };

  const handleUnblockDate = (dateStr: string) => {
    const updated = blockedDates.filter(d => d !== dateStr);
    saveBlockedDatesToStorage(updated);
  };

  const handleBlockSlot = (dateStr: string, slotStr: string) => {
    if (!dateStr || !slotStr) return;
    const key = `${dateStr}|${slotStr}`;
    if (blockedSlots.includes(key)) {
      alert(`The slot (${slotStr}) on ${dateStr} is already blocked.`);
      return;
    }
    const updated = [...blockedSlots, key];
    saveBlockedSlotsToStorage(updated);
  };

  const handleUnblockSlot = (keyStr: string) => {
    const updated = blockedSlots.filter(s => s !== keyStr);
    saveBlockedSlotsToStorage(updated);
  };

  const handleUpdateBookingStatus = (id: string, status: 'Approved' | 'Cancelled') => {
    const updated = bookings.map(b => b.id === id ? { ...b, bookingStatus: status } : b);
    saveBookingsToStorage(updated);
  };

  // Export Bookings CSV helper
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Booking ID,Client Name,Email,WhatsApp,Country,Playing Level,Consultation Package,Price,Date,Time Slot,Status,Zoom Link,Created At\n";
    
    bookings.forEach(b => {
      const row = [
        b.id,
        `"${b.fullName.replace(/"/g, '""')}"`,
        b.email,
        `"${b.whatsApp}"`,
        `"${b.country}"`,
        `"${b.playingLevel}"`,
        `"${b.packageName}"`,
        `INR ${b.price}`,
        b.date,
        `"${b.timeSlot}"`,
        b.bookingStatus,
        `"${b.zoomLink}"`,
        b.createdAt
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TCC_Bookings_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Standard smooth scroll helper for local ID selectors
  const scrollToSection = (id: string) => {
    setActiveTab('main');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // --- CRICKET CV GENERATORS & HANDLERS ---
  const generateCricketCvPdf = (cv: CricketCV) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const navy = [11, 26, 48];
    const gold = [212, 175, 55];
    const darkGray = [80, 80, 80];
    const lightGray = [245, 245, 245];

    // Header bar
    doc.setFillColor(navy[0], navy[1], navy[2]);
    doc.rect(0, 0, 210, 50, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(`${cv.firstName.toUpperCase()} ${cv.lastName.toUpperCase()}`, 15, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(gold[0], gold[1], gold[2]);
    doc.text(`${cv.playingRole.toUpperCase()} | ${cv.cricketLevel.toUpperCase()}`, 15, 28);

    doc.setFontSize(8);
    doc.setTextColor(230, 230, 230);
    doc.text(`Ref: ${cv.referenceNumber || 'Pending Purchase'}`, 15, 34);

    // Profile photo
    if (cv.profilePhoto) {
      try {
        doc.addImage(cv.profilePhoto, 'JPEG', 160, 8, 35, 35);
        doc.setDrawColor(gold[0], gold[1], gold[2]);
        doc.setLineWidth(0.8);
        doc.rect(160, 8, 35, 35, 'D');
      } catch (e) {
        console.warn("Failed to render profile photo in PDF:", e);
      }
    }

    let y = 60;

    // Contact details box
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(15, y, 180, 16, 'F');
    
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    
    doc.text('NATIONALITY:', 20, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(cv.nationality || 'N/A', 20, y + 11);

    doc.setFont('helvetica', 'bold');
    doc.text('CURRENT COUNTRY:', 60, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(cv.currentCountry || 'N/A', 60, y + 11);

    doc.setFont('helvetica', 'bold');
    doc.text('EMAIL ADDRESS:', 110, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(cv.email || 'N/A', 110, y + 11);

    doc.setFont('helvetica', 'bold');
    doc.text('PHONE NUMBER:', 155, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(cv.phone || 'N/A', 155, y + 11);

    y += 25;

    // Player profile section
    doc.setDrawColor(navy[0], navy[1], navy[2]);
    doc.setLineWidth(0.5);
    doc.line(15, y, 195, y);
    
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('PLAYER PROFILE', 15, y - 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    
    const splitProfile = doc.splitTextToSize(cv.aboutMe || 'No description provided.', 180);
    doc.text(splitProfile, 15, y + 5);
    y += (splitProfile.length * 4.5) + 8;

    // Career highlights
    if (cv.highlights && cv.highlights.length > 0 && cv.highlights.some(h => h.trim())) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(navy[0], navy[1], navy[2]);
      doc.text('CAREER HIGHLIGHTS:', 15, y);
      y += 4;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      cv.highlights.forEach((h) => {
        if (h.trim()) {
          doc.text(`• ${h}`, 20, y);
          y += 4.5;
        }
      });
      y += 4;
    }

    // Statistics Section
    doc.setDrawColor(navy[0], navy[1], navy[2]);
    doc.line(15, y, 195, y);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('CRICKET STATISTICS', 15, y - 2);
    y += 5;

    doc.setFillColor(navy[0], navy[1], navy[2]);
    doc.rect(15, y, 180, 6, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    
    doc.text('MATCHES', 17, y + 4.5);
    doc.text('INNINGS', 37, y + 4.5);
    doc.text('RUNS', 57, y + 4.5);
    doc.text('H.S.', 77, y + 4.5);
    doc.text('AVG', 92, y + 4.5);
    doc.text('50s/100s', 110, y + 4.5);
    doc.text('WICKETS', 130, y + 4.5);
    doc.text('B.B.', 150, y + 4.5);
    doc.text('BOWL AVG', 165, y + 4.5);
    doc.text('ECONOMY', 183, y + 4.5);

    y += 6;
    doc.setFillColor(250, 250, 250);
    doc.rect(15, y, 180, 7, 'F');
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);

    const cs = cv.careerStats;
    doc.text(cs.matches || '0', 17, y + 5);
    doc.text(cs.innings || '0', 37, y + 5);
    doc.text(cs.runs || '0', 57, y + 5);
    doc.text(cs.highestScore || '0', 77, y + 5);
    doc.text(cs.battingAverage || '0.00', 92, y + 5);
    doc.text(`${cs.fifties || '0'}/${cs.hundreds || '0'}`, 110, y + 5);
    doc.text(cs.wickets || '0', 130, y + 5);
    doc.text(cs.bestBowling || 'N/A', 150, y + 5);
    doc.text(cs.bowlingAverage || '0.00', 165, y + 5);
    doc.text(cs.economyRate || '0.00', 183, y + 5);

    y += 12;

    if (cv.seasonStats && cv.seasonStats.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(navy[0], navy[1], navy[2]);
      doc.text('SEASON BREAKDOWN:', 15, y);
      y += 5;

      doc.setFillColor(235, 238, 242);
      doc.rect(15, y, 180, 5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('SEASON', 17, y + 3.5);
      doc.text('TEAM', 40, y + 3.5);
      doc.text('COMPETITION', 85, y + 3.5);
      doc.text('MATCHES', 135, y + 3.5);
      doc.text('RUNS', 155, y + 3.5);
      doc.text('WICKETS', 175, y + 3.5);
      
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      cv.seasonStats.forEach((ss) => {
        doc.text(ss.season || 'N/A', 17, y + 3.5);
        doc.text(ss.team || 'N/A', 40, y + 3.5);
        doc.text(ss.competition || 'N/A', 85, y + 3.5);
        doc.text(ss.matches || '0', 135, y + 3.5);
        doc.text(ss.runs || '0', 155, y + 3.5);
        doc.text(ss.wickets || '0', 175, y + 3.5);
        y += 4.5;
      });
      y += 5;
    }

    // Experience Section
    doc.setDrawColor(navy[0], navy[1], navy[2]);
    doc.line(15, y, 195, y);
    doc.setTextColor(navy[0], navy[1], navy[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('CRICKET EXPERIENCE', 15, y - 2);
    y += 5;

    if (cv.previousTeams && cv.previousTeams.length > 0) {
      cv.previousTeams.forEach((pt) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(navy[0], navy[1], navy[2]);
        doc.text(`${pt.teamName.toUpperCase()} (${pt.country})`, 15, y);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(gold[0], gold[1], gold[2]);
        doc.text(`${pt.role} - ${pt.level}`, 15, y + 4);

        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text(`Duration: ${pt.fromYear} - ${pt.toYear}`, 150, y);

        y += 8;
      });
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('No previous teams added.', 15, y);
      y += 6;
    }
    y += 2;

    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    // Achievements Section
    if (cv.achievements && cv.achievements.length > 0) {
      doc.setDrawColor(navy[0], navy[1], navy[2]);
      doc.line(15, y, 195, y);
      doc.setTextColor(navy[0], navy[1], navy[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('KEY ACHIEVEMENTS', 15, y - 2);
      y += 5;

      cv.achievements.forEach((ach) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(navy[0], navy[1], navy[2]);
        doc.text(`${ach.title} (${ach.year})`, 15, y);
        doc.setFont('helvetica', 'normal');
        doc.text(ach.competitionOrg || 'N/A', 120, y);
        
        if (ach.description) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
          const splitDesc = doc.splitTextToSize(ach.description, 175);
          doc.text(splitDesc, 20, y + 4);
          y += (splitDesc.length * 4) + 5;
        } else {
          y += 5;
        }
      });
      y += 2;
    }

    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    // Education & Qualifications Section
    const hasEd = cv.education && cv.education.length > 0;
    const hasQual = cv.qualifications && cv.qualifications.length > 0;
    if (hasEd || hasQual) {
      doc.setDrawColor(navy[0], navy[1], navy[2]);
      doc.line(15, y, 195, y);
      doc.setTextColor(navy[0], navy[1], navy[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('EDUCATION & QUALIFICATIONS', 15, y - 2);
      y += 5;

      if (hasEd) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(navy[0], navy[1], navy[2]);
        doc.text('Academic Education:', 15, y);
        y += 4;
        cv.education.forEach((ed) => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.text(ed.qualification, 20, y);
          doc.setFont('helvetica', 'normal');
          doc.text(`${ed.institution} (${ed.year})`, 80, y);
          y += 4.5;
        });
        y += 3;
      }

      if (hasQual) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(navy[0], navy[1], navy[2]);
        doc.text('Cricket Qualifications:', 15, y);
        y += 4;
        cv.qualifications.forEach((q) => {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.text(q.certName, 20, y);
          doc.setFont('helvetica', 'normal');
          doc.text(`${q.details} (${q.year})`, 80, y);
          y += 4.5;
        });
        y += 4;
      }
    }

    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    // References Section
    if (cv.references && cv.references.length > 0 && cv.references.some(r => r.name)) {
      doc.setDrawColor(navy[0], navy[1], navy[2]);
      doc.line(15, y, 195, y);
      doc.setTextColor(navy[0], navy[1], navy[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('REFERENCES (OPTIONAL)', 15, y - 2);
      y += 5;

      cv.references.forEach((ref) => {
        if (ref.name) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(navy[0], navy[1], navy[2]);
          doc.text(ref.name, 15, y);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.text(`${ref.role} - ${ref.clubOrg}`, 15, y + 4);
          doc.text(`Email: ${ref.email || 'N/A'} | Phone: ${ref.phone || 'N/A'}`, 15, y + 8);
          y += 12;
        }
      });
    }

    // Last page footer
    doc.setFillColor(navy[0], navy[1], navy[2]);
    doc.rect(0, 287, 210, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Generated via The Cricket Advisor CV Builder', 15, 293.5);
    doc.text('www.thecricketadvisor.com', 160, 293.5);

    return doc;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Please upload a JPG or PNG image.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Profile photo must be smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCvImagePreview(reader.result as string);
        setCvForm(prev => ({ ...prev, profilePhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateCvStep = (step: number): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (step === 1) {
      if (!cvForm.firstName.trim()) { alert("Please enter First Name."); return false; }
      if (!cvForm.lastName.trim()) { alert("Please enter Last Name."); return false; }
      if (!cvForm.dob) { alert("Please enter Date of Birth."); return false; }
      if (!cvForm.nationality.trim()) { alert("Please enter Nationality."); return false; }
      if (!cvForm.currentCountry.trim()) { alert("Please enter Current Country."); return false; }
      if (!cvForm.cityLocation.trim()) { alert("Please enter City / Location."); return false; }
      if (!cvForm.email.trim() || !emailRegex.test(cvForm.email)) { alert("Please enter a valid Email Address."); return false; }
      if (!cvForm.phone.trim()) { alert("Please enter a valid Phone Number."); return false; }
    }

    if (step === 2) {
      if (!cvForm.cricketLevel) { alert("Please select your Cricket Level."); return false; }
      if (!cvForm.playingRole) { alert("Please select your Playing Role."); return false; }
      if (!cvForm.battingStyle) { alert("Please select your Batting Style."); return false; }
      if (!cvForm.bowlingStyle) { alert("Please select your Bowling Style."); return false; }
    }

    if (step === 3) {
      if (!cvForm.currentClub.trim()) { alert("Please enter Current Club / Team."); return false; }
      if (!cvForm.currentLevel.trim()) { alert("Please enter Current Cricket Level."); return false; }
      if (!cvForm.country.trim()) { alert("Please enter Current Team Country."); return false; }
      if (!cvForm.currentStateProvince.trim()) { alert("Please enter State / Province / County."); return false; }
      if (!cvForm.playingSince.trim() || isNaN(Number(cvForm.playingSince))) { alert("Please enter a valid year in Playing Since."); return false; }
      if (!cvForm.currentSeason.trim()) { alert("Please enter Current Season."); return false; }
      if (cvForm.lookingForOpp === 'Yes' && (!cvForm.oppTypes || cvForm.oppTypes.length === 0)) {
        alert("Please select at least one type of opportunity.");
        return false;
      }
    }

    if (step === 5) {
      const cs = cvForm.careerStats;
      const numberFields = ['matches', 'innings', 'runs', 'fifties', 'hundreds', 'wickets', 'catches', 'stumpings'];
      for (const f of numberFields) {
        const val = (cs as any)[f];
        if (val && (isNaN(Number(val)) || Number(val) < 0)) {
          alert(`Please enter a valid, non-negative number for ${f.toUpperCase()}.`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSaveCv = async (updatedCv: CricketCV) => {
    try {
      const response = await fetch('/api/save-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cv: updatedCv, secret: adminPassword })
      });
      return response.ok;
    } catch (e) {
      console.error("Failed to save CV:", e);
      return false;
    }
  };

  const handleUpdateCvEdits = async (cv: any, increment: boolean) => {
    const currentAllowed = cv.editsAllowed || 5;
    const currentUsed = cv.editsUsed || 0;
    let newAllowed = currentAllowed;
    let newUsed = currentUsed;

    if (increment) {
      if (currentUsed > 0) {
        newUsed = currentUsed - 1;
      } else {
        newAllowed = currentAllowed + 1;
      }
    } else {
      const currentLeft = currentAllowed - currentUsed;
      if (currentLeft > 0) {
        newUsed = currentUsed + 1;
      } else {
        if (newAllowed > 0) {
          newAllowed = currentAllowed - 1;
        }
      }
    }

    const updatedCv = {
      ...cv,
      editsAllowed: newAllowed,
      editsUsed: newUsed
    };

    const success = await handleSaveCv(updatedCv);
    if (success) {
      setCvList(prev => prev.map(c => c.id === cv.id ? updatedCv : c));
    } else {
      alert("Failed to update CV edits on the server.");
    }
  };

  const handleEmailCv = async (cvData: CricketCV, targetEmail: string) => {
    setIsSendingCvEmail(true);
    setEmailDeliveryError('');
    setEmailDeliverySuccess(false);
    try {
      const pdf = generateCricketCvPdf(cvData);
      const pdfBase64 = pdf.output('datauristring');

      const response = await fetch('/api/email-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          firstName: cvData.firstName,
          lastName: cvData.lastName,
          referenceNumber: cvData.referenceNumber,
          pdfBase64
        })
      });

      if (response.ok) {
        setEmailDeliverySuccess(true);
      } else {
        const err = await response.json();
        setEmailDeliveryError(err.error || 'Failed to email CV.');
      }
    } catch (e: any) {
      setEmailDeliveryError(e.message || 'Error occurred while emailing CV.');
    } finally {
      setIsSendingCvEmail(false);
    }
  };

  const CV_PRICES: Record<CurrencyCode, { symbol: string, amount: number, text: string }> = {
    INR: { symbol: '₹', amount: 999, text: '₹999' },
    USD: { symbol: '$', amount: 15, text: '$15' },
    GBP: { symbol: '£', amount: 12, text: '£12' },
    AUD: { symbol: 'A$', amount: 20, text: 'A$20' },
    NZD: { symbol: 'NZ$', amount: 22, text: 'NZ$' + 22 }
  };

  const renderCricketCvWorkspace = () => {
    const renderOnboardingWizard = () => {
      const capitalizeWords = (str: string) => {
        if (!str) return '';
        return str.split(' ').map(word => {
          if (!word) return '';
          return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
      };

      const STATES_BY_COUNTRY: Record<string, string[]> = {
        "India": [
          "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
          "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
          "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
          "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
          "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
        ],
        "Sri Lanka": ["Western", "Central", "Southern", "Northern", "Eastern", "North Western", "North Central", "Uva", "Sabaragamuwa"],
        "New Zealand": ["Auckland", "Wellington", "Canterbury", "Otago", "Waikato", "Bay of Plenty", "Manawatu-Wanganui", "Hawkes Bay", "Taranaki", "Southland", "Gisborne", "West Coast", "Marlborough", "Tasman", "Nelson", "Northland", "Chatham Islands"],
        "Australia": ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania", "Australian Capital Territory", "Northern Territory", "Jervis Bay Territory", "Christmas Island", "Cocos (Keeling) Islands", "Norfolk Island"],
        "South Africa": ["Gauteng", "KwaZulu-Natal", "Western Cape", "Eastern Cape", "Limpopo", "Mpumalanga", "North West", "Free State", "Northern Cape"],
        "Canada": ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba", "Saskatchewan", "Nova Scotia", "New Brunswick", "Newfoundland and Labrador", "Prince Edward Island", "Northwest Territories", "Yukon", "Nunavut"],
        "United States of America": ["California", "Texas", "Florida", "New York", "Pennsylvania", "Illinois", "Ohio", "Georgia", "North Carolina", "Washington", "Massachusetts", "Virginia", "New Jersey", "Michigan", "Colorado", "Arizona", "Maryland", "Indiana", "Tennessee", "Missouri", "Wisconsin", "Minnesota", "Kentucky", "Oregon", "Alabama", "Louisiana", "South Carolina", "Oklahoma", "Connecticut", "Iowa", "Utah", "Nevada", "Arkansas", "Mississippi", "Kansas", "New Mexico", "Nebraska", "Idaho", "West Virginia", "Hawaii", "New Hampshire", "Maine", "Montana", "Rhode Island", "Delaware", "South Dakota", "North Dakota", "Alaska", "Vermont", "Wyoming", "Washington D.C.", "Puerto Rico", "Guam", "U.S. Virgin Islands", "American Samoa", "Northern Mariana Islands"],
        "Oman": ["Muscat", "Dhofar", "Ad Dakhiliyah", "Al Batinah North", "Al Batinah South", "Ash Sharqiyah North", "Ash Sharqiyah South", "Ad Dhahirah", "Al Buraimi", "Musandam", "Al Wusta"],
        "Zimbabwe": ["Harare", "Bulawayo", "Mashonaland Central", "Mashonaland East", "Mashonaland West", "Matabeleland North", "Matabeleland South", "Midlands", "Manicaland", "Masvingo"],
        "United Kingdom": ["England", "Scotland", "Wales", "Northern Ireland"]
      };

      const COUNTRY_CODES: Record<string, string> = {
        "India": "+91",
        "Sri Lanka": "+94",
        "New Zealand": "+64",
        "Australia": "+61",
        "South Africa": "+27",
        "Canada": "+1",
        "United States of America": "+1",
        "United Kingdom": "+44",
        "Oman": "+968",
        "Zimbabwe": "+263"
      };

      const getPasswordStrength = (pass: string) => {
        if (!pass) return { score: 0, label: '', color: 'bg-slate-200', text: 'text-slate-400' };
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        
        switch (score) {
          case 0:
          case 1:
            return { score: 1, label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
          case 2:
            return { score: 2, label: 'Fair', color: 'bg-orange-500', text: 'text-orange-500' };
          case 3:
            return { score: 3, label: 'Good', color: 'bg-yellow-500', text: 'text-yellow-500' };
          case 4:
            return { score: 4, label: 'Strong', color: 'bg-green-500', text: 'text-green-500' };
          default:
            return { score: 0, label: '', color: 'bg-slate-200', text: 'text-slate-400' };
        }
      };

      const handleOnboardSubmit = () => {
        if (!cvForm.firstName || !cvForm.lastName || !cvForm.nationality || !cvForm.dateOfBirth || !cvForm.countryOfResidence || !cvForm.currentCity || !cvForm.phone || !cvForm.email || !cvForm.password || !confirmPassword) {
          alert("Please fill in all the required fields.");
          return;
        }

        if (cvForm.password !== confirmPassword) {
          alert("Passwords do not match. Please verify your passwords.");
          return;
        }

        setShowConfirmView(true);
      };

      const handleRegisterSubmit = async (finalPhone: string) => {
        try {
          const res = await fetch('/api/cv-register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: cvForm.email,
              password: cvForm.password || 'tempPass123',
              firstName: cvForm.firstName,
              lastName: cvForm.lastName,
              country: cvForm.countryOfResidence,
              stateProvince: cvForm.currentCity,
              mobileNumber: finalPhone,
              nationality: cvForm.nationality,
              dateOfBirth: cvForm.dateOfBirth
            })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Registration failed');

          if (res.ok) {
            setConfirmPassword('');
            setShowConfirmView(false);
            setShowRegistrationSuccess(true);
          } else {
            setConfirmPassword('');
            setShowConfirmView(false);
            setShowRegistrationSuccess(true);
          }
        } catch (err: any) {
          alert(`Error: ${err.message}`);
        }
      };

      const strength = getPasswordStrength(cvForm.password || '');

      if (showRegistrationSuccess) {
        return (
          <div className="py-12 bg-slate-50 min-h-[85vh] text-slate-800 flex items-center justify-center font-sans px-4 animate-fade-in">
            <div className="bg-white border-4 border-black rounded-xl shadow-sm overflow-hidden w-full max-w-lg flex flex-col p-8 text-center space-y-6">
              <h2 className="text-2xl font-display font-black text-[#0B1A30] uppercase">Success</h2>
              <div className="text-slate-700 text-sm font-semibold">
                Your Cricket CV Profile Link Has Been Sent To You Please Check Your Inbox or Spam Folder
              </div>
              <div className="text-red-600 font-bold text-base sm:text-lg p-3 bg-slate-50 border border-slate-200 rounded-xl no-capitalize break-all">
                {cvForm.email}
              </div>
              <button
                onClick={() => {
                  setShowRegistrationSuccess(false);
                  setCvView('login');
                }}
                className="w-full py-3 rounded-xl font-bold bg-[#0B1A30] text-white hover:bg-navy-950 transition text-xs uppercase tracking-wider"
              >
                Go To Login
              </button>
            </div>
          </div>
        );
      }

      if (showConfirmView) {
        const prefix = COUNTRY_CODES[cvForm.nationality] || '';
        const finalPhone = prefix ? `${prefix} ${cvForm.phone}` : cvForm.phone;

        return (
          <div className="py-12 bg-slate-50 min-h-[85vh] text-slate-800 flex items-center justify-center font-sans px-4 animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden w-full max-w-lg flex flex-col">
              <div className="bg-[#0B1A30] text-[#D4AF37] px-6 py-4 border-b border-gold-500/20 flex items-center justify-between">
                <span className="font-bold font-display uppercase text-xs tracking-wider">Confirm Profile Details</span>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 text-left">
                <div>
                  <h3 className="text-lg font-bold text-[#0B1A30] font-display uppercase tracking-tight">Verify Your Information</h3>
                  <p className="text-slate-500 text-xs mt-1 font-sans">Please review and confirm your details. These will be auto-locked upon CV purchase.</p>
                </div>

                <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-200/60 space-y-3.5 text-xs text-slate-700 font-sans">
                  <div className="grid grid-cols-2 py-1.5 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-400">First Name</span>
                    <span className="font-bold text-slate-900">{cvForm.firstName}</span>
                  </div>
                  <div className="grid grid-cols-2 py-1.5 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-400">Last Name</span>
                    <span className="font-bold text-slate-900">{cvForm.lastName}</span>
                  </div>
                  <div className="grid grid-cols-2 py-1.5 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-400">Country</span>
                    <span className="font-bold text-slate-900">{cvForm.nationality}</span>
                  </div>
                  <div className="grid grid-cols-2 py-1.5 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-400">Age</span>
                    <span className="font-bold text-slate-900">{age.toLowerCase().includes('year') ? age : `${age} Years`}</span>
                  </div>
                  <div className="grid grid-cols-2 py-1.5 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-400">State / Province</span>
                    <span className="font-bold text-slate-900">{cvForm.currentCity}</span>
                  </div>
                  <div className="grid grid-cols-2 py-1.5 border-b border-slate-200/60">
                    <span className="font-semibold text-slate-400">Mobile Number</span>
                    <span className="font-bold text-slate-900 font-mono">{finalPhone}</span>
                  </div>
                  <div className="grid grid-cols-2 py-1.5">
                    <span className="font-semibold text-slate-400">Email Address</span>
                    <span className="font-bold text-slate-900 no-capitalize break-all">{cvForm.email}</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200/60 p-3.5 rounded-xl flex items-start gap-2.5">
                  <span className="text-base text-amber-500 font-bold">⚠️</span>
                  <p className="text-[11px] text-amber-800 leading-relaxed font-semibold">
                    <strong>Please Note:</strong> Make sure your details match your official documents. The name, age, and country are auto-locked upon subscription to prevent modifications.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-100 font-sans">
                  <button 
                    type="button"
                    onClick={() => setShowConfirmView(false)}
                    className="px-5 py-2.5 border border-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50 transition cursor-pointer text-slate-700 bg-white"
                  >
                    Edit Details
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleRegisterSubmit(finalPhone)}
                    className="px-6 py-2.5 bg-[#0B1A30] text-white rounded-lg text-xs font-bold hover:bg-navy-950 transition cursor-pointer"
                  >
                    Confirm & Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="py-12 bg-slate-50 min-h-[85vh] text-slate-800 flex items-center justify-center">
          <div style={{ fontFamily: 'Georgia, serif' }} className="bg-white border-4 border-black rounded-xl shadow-sm overflow-hidden w-full max-w-lg animate-fade-in flex flex-col">
            <div className="bg-[#0B1A30] text-[#D4AF37] px-6 py-4 border-b border-gold-500/20 flex items-center justify-between">
              <span className="font-bold uppercase text-lg tracking-wide">Create Your Account</span>
            </div>

            <div className="p-6 space-y-6 text-left">
              <form onSubmit={(e) => { e.preventDefault(); handleOnboardSubmit(); }} className="space-y-5">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">First Name <span className="text-red-600">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={cvForm.firstName}
                      onChange={(e) => setCvForm({ ...cvForm, firstName: capitalizeWords(e.target.value) })}
                      placeholder="Enter first name"
                      className="w-full text-xs p-3 border-2 border-black rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white text-slate-800 font-semibold font-sans capitalize"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Last Name <span className="text-red-600">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={cvForm.lastName}
                      onChange={(e) => setCvForm({ ...cvForm, lastName: capitalizeWords(e.target.value) })}
                      placeholder="Enter last name"
                      className="w-full text-xs p-3 border-2 border-black rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white text-slate-800 font-semibold font-sans capitalize"
                    />
                  </div>
                </div>

                {/* Country & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Country <span className="text-red-600">*</span></label>
                    <select 
                      required
                      value={cvForm.nationality}
                      onChange={(e) => {
                        const nationalityVal = e.target.value;
                        setCvForm({ 
                          ...cvForm, 
                          nationality: nationalityVal,
                          countryOfResidence: nationalityVal,
                          currentCity: ''
                        });
                      }}
                      className="w-full text-xs p-3 border-2 border-black rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white text-slate-800 font-semibold font-sans"
                    >
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                      <option value="Sri Lanka">Sri Lanka</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="Australia">Australia</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Canada">Canada</option>
                      <option value="United States of America">United States of America</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Oman">Oman</option>
                      <option value="Zimbabwe">Zimbabwe</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Age <span className="text-red-600">*</span></label>
                    <select 
                      required
                      value={age}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAge(val);
                        setCvForm({ ...cvForm, dateOfBirth: val });
                      }}
                      className="w-full text-xs p-3 border-2 border-black rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white text-slate-800 font-normal font-sans"
                    >
                      <option value="" disabled>Select Age</option>
                      {Array.from({ length: 43 }, (_, i) => i + 18).map(num => (
                        <option key={num} value={num.toString()}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* State / County / Province */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase">State / County / Province & Union Territories <span className="text-red-600">*</span></label>
                  <select 
                    required
                    disabled={!cvForm.nationality}
                    value={cvForm.currentCity}
                    onChange={(e) => setCvForm({ ...cvForm, currentCity: e.target.value })}
                    className="w-full text-xs p-3 border-2 border-black rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white text-slate-800 font-semibold font-sans disabled:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {!cvForm.nationality ? "Select Nationality First" : "Select State/Province/Territory"}
                    </option>
                    {cvForm.nationality && STATES_BY_COUNTRY[cvForm.nationality]?.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* Mobile Number & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Mobile Number <span className="text-red-600">*</span></label>
                    <div className="flex gap-2">
                      <span className="bg-slate-100 border border-black px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center min-w-[55px]">
                        {COUNTRY_CODES[cvForm.nationality] || '+'}
                      </span>
                      <input 
                        type="tel" 
                        required
                        value={cvForm.phone}
                        onChange={(e) => setCvForm({ ...cvForm, phone: e.target.value })}
                        placeholder="Mobile number"
                        className="w-full text-xs p-3 border-2 border-black rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white text-slate-800 font-semibold font-sans"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase">Email Address <span className="text-red-600">*</span></label>
                    <input 
                      type="email" 
                      required
                      value={cvForm.email}
                      onChange={(e) => setCvForm({ ...cvForm, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full text-xs p-3 border-2 border-black rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white text-slate-800 font-semibold font-sans no-capitalize"
                    />
                  </div>
                </div>

                {/* Password & Strength Meter */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Account Password <span className="text-red-600">*</span></label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={cvForm.password || ''}
                    onChange={(e) => setCvForm({ ...cvForm, password: e.target.value })}
                    placeholder="Min 8 characters for account login"
                    className="w-full text-xs p-3 border-2 border-black rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white text-slate-800 font-semibold font-sans no-capitalize"
                  />
                  {cvForm.password && (
                    <div className="space-y-1.5 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="flex gap-1 h-1.5">
                        {[1, 2, 3, 4].map((index) => (
                          <div 
                            key={index} 
                            className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                              index <= strength.score ? strength.color : 'bg-slate-200'
                            }`} 
                          />
                        ))}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider">
                        Password Strength: {strength.label}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase">Confirm Password <span className="text-red-600">*</span></label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter account password"
                    className="w-full text-xs p-3 border-2 border-black rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white text-slate-800 font-semibold font-sans no-capitalize"
                  />
                </div>

                {/* Show Password Toggle */}
                <div className="flex items-center gap-2 mt-1.5 no-capitalize">
                  <input 
                    type="checkbox"
                    id="show-signup-password"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="w-3.5 h-3.5 cursor-pointer accent-[#0B1A30]"
                  />
                  <label htmlFor="show-signup-password" className="text-xs text-slate-500 font-semibold cursor-pointer select-none">
                    Show Passwords
                  </label>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setCvView('landing')}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50 transition cursor-pointer text-slate-700 bg-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-[#0B1A30] text-white rounded-lg text-xs font-bold hover:bg-navy-950 transition cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    };

    const renderLoginPage = () => {
      const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        try {
          const res = await fetch('/api/cv-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: loginEmail, password: loginPassword })
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Login failed. Please check credentials.');
          }

          handleCvLoginSuccess(data.token, data.user);
          setCvView('dashboard');
        } catch (err: any) {
          setLoginError(err.message);
        } finally {
          setLoginLoading(false);
        }
      };

      return (
        <div className="py-12 bg-slate-50 min-h-[85vh] text-slate-800 flex items-center justify-center font-sans px-4">
          <div className="bg-white border-4 border-black rounded-xl shadow-sm overflow-hidden w-full max-w-md animate-fade-in flex flex-col">
            {/* Body */}
            <div className="p-6 md:p-8 space-y-6 text-left">
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#0B1A30] font-display uppercase tracking-tight">Log in to your account</h3>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-start gap-2 text-xs text-red-600 font-sans">
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-black uppercase font-sans">Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full text-xs p-3 border-2 border-black rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white text-slate-800 font-semibold font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-black uppercase font-sans">Password *</label>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowForgotPasswordModal(true);
                      }}
                      className="text-[10px] text-red-600 hover:text-red-750 font-semibold hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type={showLoginPassword ? "text" : "password"} 
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full text-xs p-3 pr-10 border-2 border-black rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white text-slate-800 font-semibold font-sans no-capitalize ${showLoginPassword ? '' : 'font-mono'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3 rounded-xl font-bold bg-[#0B1A30] text-white hover:bg-navy-950 disabled:opacity-50 transition text-xs mt-2 cursor-pointer uppercase tracking-wider"
                >
                  {loginLoading ? 'Logging in...' : 'Log In'}
                </button>
              </form>

              <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 text-xs font-sans">
                <span className="text-yellow-600 font-bold">Don't have an account?</span>
                <button 
                  onClick={() => {
                    setCvStep(1);
                    setAge('');
                    setShowConfirmView(false);
                    setCvForm(initialCVFormFull('', '', '', ''));
                    setCvView('onboarding');
                  }}
                  className="px-4 py-2 bg-[#800000] hover:bg-[#600000] text-white font-bold rounded-xl transition cursor-pointer shadow-md uppercase tracking-wider text-[10px]"
                >
                  Start Building Now
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };

    // Previously this sent a fake 'test_payment_id' that the server accepted without payment.
    // Now it simply takes the player to the real checkout page.
    const triggerSimulatedRazorpay = async () => {
      setCvView('preview');
    };

    const handleDownloadCleanPDF = async () => {
      const downloadBtn = document.activeElement as HTMLButtonElement | null;
      const originalText = downloadBtn ? downloadBtn.innerHTML : '';
      if (downloadBtn) {
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<span class="flex items-center gap-1.5"><svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating PDF...</span>';
      }

      setIsTransitioning(true);

      // Temporarily bring the hidden capture wrapper into the visible viewport
      // behind the full-screen transition overlay (z-index: 50) to force the browser
      // to calculate layouts and render content cleanly.
      const captureWrapper = document.getElementById('cv-capture-wrapper');
      if (captureWrapper) {
        captureWrapper.style.setProperty('position', 'fixed', 'important');
        captureWrapper.style.setProperty('left', '0', 'important');
        captureWrapper.style.setProperty('top', '0', 'important');
        captureWrapper.style.setProperty('z-index', '40', 'important');
      }

      // Hide the live preview wrapper to prevent html2canvas transforms conflict
      const previewEl = document.getElementById('cv-live-preview-wrapper');
      if (previewEl) {
        previewEl.style.setProperty('display', 'none', 'important');
      }

      // Add a 500ms wait to allow layout reflow, React state updates, and the 150ms pagination
      // debounce timeouts in CVPaginatedRenderer to fully commit the fresh DOM structure.
      await new Promise(resolve => setTimeout(resolve, 500));

      const element = document.getElementById('cv-download-print-capture');
      if (!element) {
        if (captureWrapper) {
          captureWrapper.style.removeProperty('position');
          captureWrapper.style.removeProperty('left');
          captureWrapper.style.removeProperty('top');
          captureWrapper.style.removeProperty('z-index');
        }
        if (previewEl) {
          previewEl.style.removeProperty('display');
        }
        setIsTransitioning(false);
        if (downloadBtn) {
          downloadBtn.disabled = false;
          downloadBtn.innerHTML = originalText;
        }
        alert('Error: CV print capture element not found. Please wait a moment and try again.');
        return;
      }

      try {
        const pages = element.getElementsByClassName('cv-page-container');
        if (pages.length === 0) {
          throw new Error('No CV pages found to render.');
        }

        const pdf = new jsPDF('p', 'mm', 'a4');

        /**
         * Walk the offsetParent chain from `el` up to `stopAt`,
         * accumulating offsetLeft / offsetTop to get the element's position
         * relative to `stopAt` in layout pixels.
         *
         * IMPORTANT: we use this instead of getBoundingClientRect() because
         * the capture container lives at left:-9999px / top:-9999px, and
         * getBoundingClientRect() returns viewport-relative coords that are
         * completely wrong for off-screen elements (many browsers return 0/0
         * or clamp values to the viewport boundary).
         *
         * pageEl has Tailwind's `relative` class (position:relative), so it IS
         * an offsetParent and the traversal stops correctly at it.
         */
        const getOffsetRelativeTo = (el: HTMLElement, stopAt: HTMLElement): { x: number; y: number } => {
          let x = 0, y = 0;
          let cur: HTMLElement | null = el;
          while (cur && cur !== stopAt) {
            x += cur.offsetLeft;
            y += cur.offsetTop;
            cur = cur.offsetParent as HTMLElement | null;
          }
          return { x, y };
        };

        for (let i = 0; i < pages.length; i++) {
          const pageEl = pages[i] as HTMLElement;
          const canvas = await html2canvas(pageEl, {
            scale: 2, // 2x scale for sharp text & shapes
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff'
          });
          
          const imgWidth  = 210; // A4 width in mm
          const imgHeight = 297; // A4 height in mm
          const imgData   = canvas.toDataURL('image/jpeg', 1.0);
          
          if (i > 0) pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

          // ── Stamp URI link annotations ─────────────────────────────────────────
          // html2canvas flattens the page to pixels so <a> links are lost.
          // We find every anchor, compute its layout position via offsetParent
          // traversal, and call pdf.link() to add a PDF /Link annotation.
          //
          // WHY pdf.link() needs post-processing:
          //   jsPDF emits: <</Type /Annot /Subtype /Link /Border [0 0 0] /A <</S /URI /URI(url)>>>>
          //   Missing: /H /I  – Highlight mode=Invert, the visual tap-feedback signal
          //            /F 4   – Print flag, marks annotation as interactive
          //   Desktop Chrome auto-detects URLs in image pixels as a fallback.
          //   Mobile PDF readers (iOS Safari, Android Chrome, Samsung PDF, Adobe)
          //   strictly require these two fields to treat annotations as tappable.
          //
          // We collect the annotations here; after all pages are built we patch
          // the raw PDF bytes to inject /H /I /F 4 before saving.

          const pagePixelWidth  = pageEl.offsetWidth;
          const pagePixelHeight = pageEl.offsetHeight;
          const scaleX = imgWidth  / pagePixelWidth;
          const scaleY = imgHeight / pagePixelHeight;

          const anchors = pageEl.querySelectorAll('a[href]');
          anchors.forEach((anchor) => {
            const anchorEl = anchor as HTMLAnchorElement;

            // Use the raw href attribute – anchorEl.href auto-resolves relative
            // links to localhost which would break the PDF on a user's device.
            const rawHref = anchorEl.getAttribute('href') || '';
            const url     = anchorEl.href; // absolute URL resolved by the browser
            if (!url || url.startsWith('javascript:')) return;

            // Skip links that are local-only (relative hrefs resolved to localhost)
            if (
              url.startsWith(window.location.origin) &&
              !rawHref.startsWith('http://') &&
              !rawHref.startsWith('https://')
            ) return;

            const relWidth  = anchorEl.offsetWidth;
            const relHeight = anchorEl.offsetHeight;
            if (relWidth <= 0 || relHeight <= 0) return;

            const { x: relLeft, y: relTop } = getOffsetRelativeTo(anchorEl, pageEl);

            // 4 mm padding → generous, finger-friendly tap target on mobile
            const PAD  = 4;
            const pdfX = Math.max(relLeft  * scaleX - PAD, 0);
            const pdfY = Math.max(relTop   * scaleY - PAD, 0);
            const pdfW = Math.min(Math.max(relWidth  * scaleX + PAD * 2, 8), imgWidth  - pdfX);
            const pdfH = Math.min(Math.max(relHeight * scaleY + PAD * 2, 8), imgHeight - pdfY);

            try {
              pdf.link(pdfX, pdfY, pdfW, pdfH, { url });
            } catch (_) {
              console.warn('[PDF] Failed to add link annotation for:', url);
            }
          });
        }

        // ── Post-process: inject /H /I /F 4 into every Link annotation ──────────
        //
        // jsPDF's pdf.link() writes:
        //   <</Type /Annot /Subtype /Link /Border [0 0 0] /A <</S /URI /URI(url)>>>>
        // Missing fields that all mobile PDF readers require:
        //   /H /I  = Highlight mode Invert (visual tap-feedback on mobile)
        //   /F 4   = Print flag (marks annotation as interactive)
        //
        // WHY we work at the raw byte level (NOT TextDecoder + TextEncoder):
        //   PDF files contain binary JPEG data. TextEncoder (UTF-8) corrupts
        //   any byte >= 128 into a 2-byte sequence, destroying image streams
        //   and producing a blank PDF.
        //
        // SAFE: scan the Uint8Array for ASCII '/Subtype /Link', splice in the
        // ASCII bytes of ' /H /I /F 4'. Annotation dicts are pure ASCII.

        const pdfArrayBuffer = pdf.output('arraybuffer');
        const origBytes      = new Uint8Array(pdfArrayBuffer);

        // ASCII byte sequences
        const searchSeq  = Array.from('/Subtype /Link').map(c => c.charCodeAt(0));
        const insertSeq  = Array.from(' /H /I /F 4').map(c => c.charCodeAt(0));
        const alreadySeq = Array.from(' /H').map(c => c.charCodeAt(0)); // idempotency guard

        // Find every un-patched match position
        const matchPositions: number[] = [];
        outer: for (let i = 0; i <= origBytes.length - searchSeq.length; i++) {
          for (let j = 0; j < searchSeq.length; j++) {
            if (origBytes[i + j] !== searchSeq[j]) continue outer;
          }
          // Skip if already patched (idempotent)
          let alreadyPatched = true;
          for (let j = 0; j < alreadySeq.length; j++) {
            if (origBytes[i + searchSeq.length + j] !== alreadySeq[j]) {
              alreadyPatched = false;
              break;
            }
          }
          if (!alreadyPatched) matchPositions.push(i);
        }

        // Build the patched buffer by splicing insertSeq after each match
        const patchedBytes = new Uint8Array(
          origBytes.length + matchPositions.length * insertSeq.length
        );
        let readPos = 0, writePos = 0, mIdx = 0;
        while (readPos < origBytes.length) {
          if (mIdx < matchPositions.length && readPos === matchPositions[mIdx]) {
            patchedBytes.set(origBytes.subarray(readPos, readPos + searchSeq.length), writePos);
            writePos += searchSeq.length;
            readPos  += searchSeq.length;
            patchedBytes.set(insertSeq, writePos);
            writePos += insertSeq.length;
            mIdx++;
          } else {
            patchedBytes[writePos++] = origBytes[readPos++];
          }
        }

        const blob    = new Blob([patchedBytes], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        const a       = document.createElement('a');
        a.href     = blobUrl;
        a.download = `Cricket_CV_${cvForm.firstName || 'Player'}_${cvForm.lastName || 'Profile'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

        alert('Clean Premium PDF downloaded successfully!');
      } catch (error: any) {
        console.error('Error rendering high-fidelity PDF download:', error);
        alert(`Failed to download PDF: ${error.message || error}`);
      } finally {
        const captureWrapper = document.getElementById('cv-capture-wrapper');
        if (captureWrapper) {
          captureWrapper.style.removeProperty('position');
          captureWrapper.style.removeProperty('left');
          captureWrapper.style.removeProperty('top');
          captureWrapper.style.removeProperty('z-index');
        }
        const previewEl = document.getElementById('cv-live-preview-wrapper');
        if (previewEl) {
          previewEl.style.removeProperty('display');
        }
        setIsTransitioning(false);
        if (downloadBtn) {
          downloadBtn.disabled = false;
          downloadBtn.innerHTML = originalText;
        }
      }
    };

    const renderDashboardView = () => {

      return (
        <div className="py-12 bg-slate-50 min-h-[85vh] text-slate-800 font-sans px-4">
          <CVDashboard 
            cv={cvForm}
            cvToken={cvToken || ''}
            onLogout={handleCvLogout}
            onEditCV={async () => {
              // For paid users, consume 1 edit token when entering edit mode
              // All subsequent saves inside the form use isStyleUpdate=true
              if (cvForm.paymentStatus === 'Paid') {
                await handleSaveCvDraft(cvForm, false); // Consumes exactly 1 token
              }
              setCvView('form');
            }}
            onSelectTemplate={(tid, isStyleUpdate = false) => {
              const optColor = tid === 'professional' ? '#991B1B' :
                               tid === 'international' ? '#065F46' :
                               tid === 'classic' ? '#1F2937' :
                               tid === 'performance' ? '#B45309' : '#0B1A30';
              handleSaveCvDraft({ ...cvForm, templateId: tid, accentColour: optColor }, isStyleUpdate);
            }}
            onSelectFont={(f, isStyleUpdate = false) => handleSaveCvDraft({ ...cvForm, font: f }, isStyleUpdate)}
            onSelectColour={(c, isStyleUpdate = false) => handleSaveCvDraft({ ...cvForm, accentColour: c }, isStyleUpdate)}
            onDownloadCleanPDF={handleDownloadCleanPDF}
            onPayAndDownload={triggerSimulatedRazorpay}
            onRenewSuccess={(updatedCv) => {
              setCvForm(updatedCv);
            }}
            onRequestCorrection={() => alert('Profile correction request logged. Admin support has been notified.')}
            onRenewPlanCheckout={() => setCvView('preview')}
          />
        </div>
      );
    };

    const renderFormBuilderView = () => {
      return (
        <div className="py-8 bg-slate-50 min-h-[85vh] text-slate-800 font-sans">
          <div className="max-w-3xl mx-auto px-4">
            <CVBuilderForm 
              cv={cvForm}
              onChange={(updated) => setCvForm(updated)}
              onSaveDraft={async (latestCv) => { await handleSaveCvDraft(latestCv ?? cvForm, true); }}
              onNext={async (latestCv) => {
                setIsTransitioning(true);
                try {
                  await handleSaveCvDraft(latestCv ?? cvForm, true); // Save content, no token cost
                  setCvView('styling');
                } finally {
                  setIsTransitioning(false);
                }
              }}
              onPrev={() => setCvView('dashboard')}
              isSaving={isSavingCv}
              isIdentityLocked={cvForm.identityLocked || false}
            />
          </div>
        </div>
      );
    };

    const renderStylingStepView = () => {
      return (
        <div className="py-8 bg-slate-50 min-h-[85vh] text-slate-800 font-sans px-4">
          <CVStyleStep 
            cv={cvForm}
            onChange={(updated) => {
              setCvForm(updated);
            }}
            onNext={async (latestCv) => {
              setIsTransitioning(true);
              try {
                // Save styles as style update (no edits token cost)
                await handleSaveCvDraft(latestCv ?? cvForm, true);
                if ((latestCv ?? cvForm).paymentStatus === 'Paid') {
                  setCvView('final-cv');
                } else {
                  setCvView('preview');
                }
              } finally {
                setIsTransitioning(false);
              }
            }}
            onPrev={() => setCvView('form')}
          />
        </div>
      );
    };

    const renderReviewAndUnlockView = () => {
      const handleCheckoutPayment = async (_isSimulated: boolean) => {
        // Simulated payments have been removed; every unlock goes through Razorpay.
        try {
          // Step 1: make sure the CV is saved on the server BEFORE taking payment.
          // If this fails we stop here, so nobody pays for a CV that isn't stored.
          const savedCv = await handleSaveCvDraft(cvForm, true);
          if (!savedCv) return;

          const isLoaded = await loadRazorpayScript();
          if (!isLoaded) {
            alert('Failed to load Razorpay payment SDK. Please check your internet connection.');
            return;
          }

          const orderRes = await fetch('/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 249 }) // amount in rupees; create-order API converts to paise
          });

          if (!orderRes.ok) {
            const errorText = await orderRes.text();
            throw new Error(errorText || 'Failed to create order on server');
          }

          const orderData = await orderRes.json();
          if (!orderData.id) {
            throw new Error('Order creation did not return a valid order ID');
          }

          const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
          const options = {
            key: razorpayKeyId,
            amount: orderData.amount,
            currency: orderData.currency || 'INR',
            name: 'The Cricket Advisor',
            description: 'Premium Cricket CV Package',
            order_id: orderData.id,
            handler: async function (response: any) {
              setIsTransitioning(true);
              try {
                // Step 2: confirm the payment on the server. The server identifies the CV
                // from the logged-in session, so the CV always gets marked as paid.
                const verifyRes = await fetch('/api/cv-verify-payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cvToken}`
                  },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    cvId: savedCv.id
                  })
                });

                const data = await verifyRes.json().catch(() => ({}));
                if (verifyRes.ok) {
                  if (data.cv) {
                    setCvForm({ ...initialCVFormFull('', '', '', ''), ...data.cv });
                  } else {
                    await fetchUserCV(cvToken || '');
                  }
                  setCvView('success');
                } else {
                  alert(`Your payment was received but could not be confirmed automatically: ${data.error || 'Unknown error'}\n\nPlease contact support with payment ID ${response.razorpay_payment_id}.`);
                }
              } catch (err: any) {
                console.error(err);
                alert(`Verification error: ${err.message}. Please contact support with payment ID ${response.razorpay_payment_id}.`);
              } finally {
                setIsTransitioning(false);
              }
            },
            prefill: {
              name: `${savedCv.firstName || ''} ${savedCv.lastName || ''}`,
              email: savedCv.email || '',
              contact: savedCv.phone || ''
            },
            theme: {
              color: '#0B1A30'
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', (resp: any) => {
            alert(`Payment failed: ${resp?.error?.description || 'Please try again.'}`);
          });
          rzp.open();
        } catch (err: any) {
          console.error('Razorpay check failed:', err);
          alert(`Payment failed to initialize: ${err.message}`);
        }
      };

      return (
        <div className="py-12 bg-slate-50 min-h-[85vh] text-slate-800 font-sans px-4">
          <CVReviewPage 
            cv={cvForm}
            onPrev={() => setCvView(cvForm.paymentStatus === 'Paid' ? 'dashboard' : 'styling')}
            onPay={handleCheckoutPayment}
          />
        </div>
      );
    };

    const renderPaymentSuccessView = () => {
      return (
        <div className="py-12 bg-slate-50 min-h-[85vh] text-slate-800 font-sans px-4">
          <CVPaymentSuccess 
            cv={cvForm}
            onNext={() => setCvView('final-cv')}
          />
        </div>
      );
    };

    const renderFinalCvView = () => {
      return (
        <div className="py-12 bg-slate-50 min-h-[85vh] text-slate-800 font-sans px-4">
          <CVFinalView 
            cv={cvForm}
            onDownloadCleanPDF={handleDownloadCleanPDF}
            onGoToDashboard={() => setCvView('dashboard')}
          />
        </div>
      );
    };

    return (
      <div className="min-h-[85vh] bg-slate-50 text-slate-800 font-sans relative cv-workspace-container">
        {/* Render Auth Dialog if open */}
        {showCVAuthModal && (
          <CVAuthModal
            isOpen={showCVAuthModal}
            onClose={() => setShowCVAuthModal(false)}
            onLoginSuccess={handleCvLoginSuccess}
            onForgotPasswordClick={() => {
              setShowCVAuthModal(false);
              setShowForgotPasswordModal(true);
            }}
            onSignUpClick={() => {
              setShowCVAuthModal(false);
              setCvStep(1);
              setAge('');
              setShowConfirmView(false);
              setCvForm(initialCVFormFull('', '', '', ''));
              setCvView('onboarding');
            }}
          />
        )}

        {/* Forgot Password Modal */}
        {showForgotPasswordModal && (
          <CVForgotPassword
            resetToken={forgotPasswordToken || undefined}
            onClose={() => {
              setShowForgotPasswordModal(false);
              setForgotPasswordToken(null);
            }}
            onSuccess={() => {
              setShowForgotPasswordModal(false);
              setForgotPasswordToken(null);
              alert("Password updated successfully! Please log in.");
              setCvView('login');
            }}
          />
        )}

        {/* Verification banner/handler if token is present */}
        {verificationToken && (
          <div className="max-w-md mx-auto py-6">
            <CVEmailVerification
              token={verificationToken}
              onVerified={() => {
                setVerificationToken(null);
                alert("Email verified! Please log in.");
                setCvView('login');
              }}
              onClose={() => setVerificationToken(null)}
            />
          </div>
        )}

        {/* Main Routing based on cvView */}
        {cvView === 'landing' && (
          <CVLandingPage
            isLoggedIn={!!cvToken}
            hasPaidCV={cvForm.paymentStatus === 'Paid'}
            onStartBuilding={() => {
              if (cvToken) {
                setCvView('dashboard');
              } else {
                setCvStep(1);
                setAge('');
                setShowConfirmView(false);
                setCvForm(initialCVFormFull('', '', '', ''));
                setCvView('onboarding');
              }
            }}
            onGoToDashboard={() => setCvView('dashboard')}
            onTriggerLogin={() => {
              setLoginEmail('');
              setLoginPassword('');
              setLoginError('');
              setLoginLoading(false);
              setCvView('login');
            }}
            onTriggerSignup={() => {
              setCvStep(1);
              setAge('');
              setShowConfirmView(false);
              setCvForm(initialCVFormFull('', '', '', ''));
              setCvView('onboarding');
            }}
          />
        )}

        {cvView === 'onboarding' && renderOnboardingWizard()}

        {cvView === 'login' && renderLoginPage()}

        {cvView === 'dashboard' && renderDashboardView()}

        {cvView === 'form' && renderFormBuilderView()}

        {cvView === 'styling' && renderStylingStepView()}

        {cvView === 'preview' && renderReviewAndUnlockView()}

        {cvView === 'success' && renderPaymentSuccessView()}

        {cvView === 'final-cv' && renderFinalCvView()}
      </div>
    );
  };

  // --- CRICKET SKILLS ASSESSMENT PORTAL WORKSPACE ---
  const renderSkillsAssessmentWorkspace = () => {
    const handleOpenForm = () => {
      setAssessmentSubmission(null);
      setAssessmentView('form');
    };

    const handleCloseForm = () => {
      setAssessmentView('landing');
    };

    const handleFormSubmitted = (data: AssessmentSubmissionData) => {
      setAssessmentSubmission(data);
      setAssessmentView('checkout');
    };

    const handlePaymentSuccess = (updatedData: AssessmentSubmissionData) => {
      setAssessmentSubmission(updatedData);
    };

    return (
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col justify-center animate-fade-in font-sans min-h-[80vh]">
        {assessmentView === 'landing' && (
          <div className="text-center max-w-4xl mx-auto space-y-8 py-8 flex flex-col items-center justify-center w-full">
            <h2 className="text-[clamp(12px,3.1vw,42px)] font-black tracking-tight text-[#0B1A30] leading-tight font-display whitespace-nowrap text-center block w-full">
              Official Cricket Skills Certification Assessment Test
            </h2>

            <div className="pt-4 flex flex-col items-center justify-center">
              <button
                id="cricket-skills-assessment-test-btn"
                onClick={handleOpenForm}
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#0B1A30] hover:bg-slate-900 text-amber-400 font-black text-xl md:text-2xl rounded-2xl shadow-2xl shadow-[#0B1A30]/30 hover:shadow-amber-500/20 transform hover:-translate-y-1 transition-all duration-200 cursor-pointer border-4 border-amber-500"
              >
                <Award size={28} className="text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                <span>Start Cricket Skills Certification Test</span>
                <ChevronRight size={26} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {assessmentView === 'form' && (
          <CricketAssessmentForm
            onClose={handleCloseForm}
            onSubmitSuccess={handleFormSubmitted}
          />
        )}

        {assessmentView === 'checkout' && assessmentSubmission && (
          <AssessmentPaymentCheckout
            submission={assessmentSubmission}
            onPaymentSuccess={handlePaymentSuccess}
            onBackToEdit={() => setAssessmentView('form')}
          />
        )}
      </div>
    );
  };



  return (
    <div className="min-h-screen flex flex-col font-sans">

      {/* --- STICKY NAVIGATION --- */}
      {activeTab !== 'coaches' && (
        <header id="header" className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          {/* Logo Brand area */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => { setActiveTab('main'); scrollToSection('home'); }}>
            <img 
              src={logoImg} 
              alt="The Cricket Advisor Logo" 
              className="h-10 sm:h-12 w-auto rounded-lg object-contain" 
            />
            <div className="hidden sm:block">
              <span className="font-display tracking-tight font-bold text-[#0B1A30] text-sm sm:text-base block uppercase leading-tight">
                Prakash Palande
              </span>
              <span className="font-display tracking-widest text-[9px] sm:text-[10px] font-semibold text-[#D4AF37] block leading-tight">
                Cricket Consultant & Advisor
              </span>
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden xl:flex items-center space-x-1.5 xl:space-x-3.5 text-[11px] xl:text-[12px] font-sans font-bold tracking-wider uppercase ml-auto mr-2 xl:mr-4">
            <button onClick={() => scrollToSection('home')} className="relative py-2 text-[#0B1A30] hover:text-[#D4AF37] transition cursor-pointer">
              Home
              {activeTab === 'main' && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#D4AF37] rounded-full"></span>
              )}
            </button>
            <button onClick={() => scrollToSection('about-me')} className="py-2 text-[#0B1A30] hover:text-[#D4AF37] transition cursor-pointer whitespace-nowrap">About Me</button>
            <button onClick={() => scrollToSection('services')} className="py-2 text-[#0B1A30] hover:text-[#D4AF37] transition cursor-pointer whitespace-nowrap">Our Services</button>
          </nav>

          {/* Action buttons (Check Eligibility, Book Now, Create My Cricket CV) & Mobile Hamburger */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 xl:space-x-2.5 shrink-0">
            <button 
              onClick={() => { try { sessionStorage.setItem('tcc_active_tab', 'eligibility'); sessionStorage.removeItem('tcc_eligibility_step'); sessionStorage.removeItem('tcc_confirmed_assessment'); } catch {} setActiveTab('eligibility'); setEligibilityStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-2 sm:px-2.5 py-2 text-[10px] xl:text-[11px] font-extrabold bg-[#F5C451] hover:bg-[#E2AF3C] text-[#0B1A30] rounded-lg shadow-sm hover:scale-105 hover:shadow transition transform duration-150 uppercase tracking-widest cursor-pointer font-sans whitespace-nowrap"
            >
              Check Eligibility <span className="hidden xl:inline">- UK 2027</span>
            </button>

            <button 
              onClick={() => { setActiveTab('cricket-cv'); setCvView('landing'); setCvStep(1); }}
              className="hidden lg:inline-block px-2 sm:px-2.5 py-2 text-[10px] xl:text-[11px] font-extrabold bg-[#F5C451] hover:bg-[#E2AF3C] text-[#0B1A30] rounded-lg shadow-sm hover:scale-105 hover:shadow transition transform duration-150 uppercase tracking-widest cursor-pointer font-sans whitespace-nowrap"
            >
              Create My Cricket CV
            </button>

            <button 
              onClick={() => { setActiveTab('cricket-assessment'); setAssessmentView('landing'); }}
              className="hidden lg:inline-block px-2 sm:px-2.5 py-2 text-[10px] xl:text-[11px] font-extrabold bg-[#F5C451] hover:bg-[#E2AF3C] text-[#0B1A30] rounded-lg shadow-sm hover:scale-105 hover:shadow transition transform duration-150 uppercase tracking-widest cursor-pointer font-sans whitespace-nowrap"
            >
              Cricket Skills Certification
            </button>

            <button 
              onClick={() => { setActiveTab('book'); setBookingStep(1); }}
              className="hidden lg:inline-block px-2 sm:px-2.5 py-2 text-[10px] xl:text-[11px] font-extrabold bg-[#0B1A30] hover:bg-[#1A2E4C] text-white rounded-lg hover:scale-105 hover:shadow-lg transition transform duration-150 uppercase tracking-widest cursor-pointer font-sans whitespace-nowrap"
            >
              Book Now
            </button>

            {/* Hamburger Toggle Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#0B1A30] hover:text-[#D4AF37] rounded hover:bg-slate-100 transition-all"
              title="Toggle Navigation Menu"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#0B1A30] border-t border-navy-700/55 px-4 py-3 shadow-xl animate-fade-in">
            <nav className="flex flex-col space-y-2 text-sm font-sans font-normal tracking-wider uppercase text-slate-100">
              <button 
                onClick={() => { scrollToSection('home'); setMobileMenuOpen(false); }} 
                className="text-left py-2 border-b border-navy-800/60 hover:text-gold-400 transition"
              >
                Home
              </button>
              <button 
                onClick={() => { scrollToSection('about-me'); setMobileMenuOpen(false); }} 
                className="text-left py-2 border-b border-navy-800/60 hover:text-gold-400 transition"
              >
                About Me
              </button>
              <button 
                onClick={() => { scrollToSection('services'); setMobileMenuOpen(false); }} 
                className="text-left py-2 border-b border-navy-800/60 hover:text-gold-400 transition"
              >
                Our Services
              </button>
              <button 
                onClick={() => { try { sessionStorage.setItem('tcc_active_tab', 'eligibility'); sessionStorage.removeItem('tcc_eligibility_step'); sessionStorage.removeItem('tcc_confirmed_assessment'); } catch {} setActiveTab('eligibility'); setEligibilityStep(1); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="text-left py-2 border-b border-navy-800/60 hover:text-gold-400 transition"
              >
                Check Eligibility - UK 2027
              </button>
              <button 
                onClick={() => { setActiveTab('cricket-cv'); setCvView('landing'); setCvStep(1); setMobileMenuOpen(false); }} 
                className="text-left py-2 border-b border-navy-800/60 hover:text-gold-400 text-gold-400 font-bold transition"
              >
                Create My Cricket CV
              </button>
              <button 
                onClick={() => { setActiveTab('cricket-assessment'); setAssessmentView('landing'); setMobileMenuOpen(false); }} 
                className="text-left py-2 border-b border-navy-800/60 hover:text-gold-400 text-gold-400 font-bold transition"
              >
                Cricket Skills Certification
              </button>
              <button 
                onClick={() => { setActiveTab('book'); setBookingStep(1); setMobileMenuOpen(false); }} 
                className="text-left py-2 hover:text-gold-400 transition"
              >
                Book Appointment
              </button>
            </nav>
          </div>
        )}
      </header>
      )}



      {/* --- FLOATING CONTACT BUTTONS --- */}
      {activeTab !== 'coaches' && !(activeTab === 'cricket-assessment' && assessmentView !== 'landing') && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">


          {/* Email Floating */}
          <a 
            href="mailto:thecricketadvisor@gmail.com"
            className="bg-navy-800 hover:bg-navy-900 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition duration-200 border-2 border-gold-500/30"
            title="Send an Email"
            id="floating-email"
          >
            <Mail className="h-6 w-6" />
          </a>

          {/* Book Floating */}
          <button 
            onClick={() => { setActiveTab('book'); setBookingStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="bg-gold-gradient text-navy-950 p-3.5 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition duration-200 border-2 border-gold-400 animate-pulse"
            title="Book Consultation Session"
            id="floating-book"
          >
            <Calendar className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* --- CONTENT WORKSPACE AREA --- */}
      <main className="flex-grow">
        
        {/* =========================================================================
            1. MAIN LANDING PAGE TAB
           ========================================================================= */}
        {activeTab === 'main' && (
          <div>
            
            {/* --- HERO BANNER --- */}
            <section 
              id="home" 
              className="relative min-h-[95vh] lg:min-h-[90vh] flex items-center overflow-hidden py-16 px-4 bg-[#FAF9F5]"
            >
              {/* Background Accent Wave: Top-Left (Gold) */}
              <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none z-0 opacity-80">
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M0 0 C 80 15, 140 70, 150 180 C 130 190, 0 100, 0 0 Z" fill="url(#goldGradHero)" opacity="0.15" />
                  <path d="M0 0 C 60 10, 110 50, 120 180 C 100 190, 0 100, 0 0 Z" fill="url(#goldGradHero)" opacity="0.1" />
                  <defs>
                    <linearGradient id="goldGradHero" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FAF5B7" />
                      <stop offset="50%" stopColor="#D4AF37" />
                      <stop offset="100%" stopColor="#AA771C" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Background Accent Wave: Bottom-Right (Navy & Gold Accent) */}
              <div className="absolute bottom-0 right-0 w-[45%] h-[55%] pointer-events-none z-0">
                <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
                  {/* Gold Wave Layer */}
                  <path d="M 400 400 L 0 400 C 150 360, 280 230, 400 100 Z" fill="#D4AF37" opacity="0.8" />
                  {/* Navy Wave Layer */}
                  <path d="M 400 400 L 30 400 C 170 370, 295 250, 400 130 Z" fill="#0B1A30" />
                </svg>
              </div>

              {/* Batsman Silhouette Watermark on the Right */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250" className="absolute right-[5%] bottom-[10%] h-[80%] w-auto opacity-[0.04] lg:opacity-[0.06] pointer-events-none z-0 text-[#0B1A30]" fill="currentColor">
                <g transform="translate(10, 20)">
                  <circle cx="110" cy="40" r="12" />
                  <path d="M 115,48 L 105,48 L 100,43 L 118,43 Z" />
                  <path d="M 100,55 L 125,55 L 135,95 L 115,110 L 95,95 Z" />
                  <path d="M 98,58 L 80,75 L 75,70 L 93,53 Z" />
                  <path d="M 118,58 L 95,90 L 88,85 L 112,53 Z" />
                  <path d="M 75,72 L 40,110 L 32,105 L 67,67 Z" />
                  <path d="M 74,71 L 82,78 L 85,75 L 77,68 Z" />
                  <path d="M 95,95 L 90,160 L 105,160 L 112,115 L 120,165 L 135,165 L 128,105 Z" />
                  <rect x="85" y="115" width="18" height="45" rx="4" />
                  <rect x="120" y="115" width="18" height="48" rx="4" />
                  <ellipse cx="95" cy="162" rx="10" ry="4" />
                  <ellipse cx="130" cy="167" rx="10" ry="4" />
                </g>
              </svg>

              <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                
                {/* Hero Left Content */}
                <div className="lg:col-span-7 text-left space-y-6">
                  {/* Badge */}
                  <div className="inline-flex items-center space-x-2 bg-[#FDF8E7] border border-black px-3 py-1.5 rounded-full">
                    <span className="text-sm">🏆</span>
                    <span className="text-[#B89020] text-xs font-bold uppercase tracking-wider">Independent Global Advisor</span>
                  </div>

                  {/* Heading */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B1A30] font-display leading-tight">
                    Prakash Palande <br/>
                    Cricket Consultant & <br/>
                    <span className="text-[#D4AF37]">Advisor</span>
                  </h1>

                  {/* Subheading */}
                  <h2 className="text-lg sm:text-xl font-bold text-[#0B1A30] max-w-2xl font-sans">
                    Confused About Your Cricket Career? Let's Build Your Path to Global Cricket Opportunities.
                  </h2>

                  {/* Body Paragraph */}
                  <p className="text-slate-650 text-xs sm:text-sm max-w-2xl leading-relaxed font-normal">
                    Whether you're an aspiring cricketer looking for overseas opportunities, a cricket club seeking professional consultation, or an organisation planning international cricket tours, I provide honest, independent guidance backed by years of experience and a global cricket network.
                  </p>

                  {/* CTA Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-4">
                    <button 
                      onClick={() => { try { sessionStorage.setItem('tcc_active_tab', 'eligibility'); sessionStorage.removeItem('tcc_eligibility_step'); sessionStorage.removeItem('tcc_confirmed_assessment'); } catch {} setActiveTab('eligibility'); setEligibilityStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="w-full sm:w-auto px-6 py-3.5 bg-[#F5C451] hover:bg-[#E2AF3C] text-[#0B1A30] font-extrabold rounded-lg shadow-md hover:scale-105 transform transition duration-150 uppercase tracking-wider text-xs flex items-center justify-center space-x-1.5 cursor-pointer font-sans"
                    >
                      <span>Check Eligibility - UK 2027</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <button 
                      onClick={() => { setActiveTab('cricket-cv'); setCvView('landing'); setCvStep(1); }}
                      className="w-full sm:w-auto px-6 py-3.5 bg-[#F5C451] hover:bg-[#E2AF3C] text-[#0B1A30] font-extrabold rounded-lg shadow-md hover:scale-105 transform transition duration-150 uppercase tracking-wider text-xs flex items-center justify-center space-x-1.5 cursor-pointer font-sans"
                    >
                      <span>Create My Cricket CV</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <button 
                      onClick={() => { setActiveTab('cricket-assessment'); setAssessmentView('landing'); }}
                      className="w-full sm:w-auto px-6 py-3.5 bg-[#F5C451] hover:bg-[#E2AF3C] text-[#0B1A30] font-extrabold rounded-lg shadow-md hover:scale-105 transform transition duration-150 uppercase tracking-wider text-xs flex items-center justify-center space-x-1.5 cursor-pointer font-sans"
                    >
                      <span>Cricket Skills Certification</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    <button 
                      onClick={() => { setActiveTab('book'); setBookingStep(1); }}
                      className="w-full sm:w-auto px-6 py-3.5 bg-[#0B1A30] hover:bg-[#1A2E4C] border border-[#0B1A30] text-white font-extrabold rounded-lg hover:scale-105 transform transition duration-150 uppercase tracking-wider text-xs flex items-center justify-center space-x-1.5 cursor-pointer font-sans"
                    >
                      <span>Book Appointment</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Quick Feature Grid */}
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-4">
                    <div className="flex items-center space-x-2 bg-[#FDF8E7] px-4 py-2.5 rounded-xl border border-black w-full sm:w-auto justify-start">
                      <Globe className="h-4 w-4 text-[#0B1A30]" />
                      <span className="text-[#0B1A30] text-xs font-bold">Global Cricket Network</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-[#FDF8E7] px-4 py-2.5 rounded-xl border border-black w-full sm:w-auto justify-start">
                      <Users className="h-4 w-4 text-[#0B1A30]" />
                      <span className="text-[#0B1A30] text-xs font-bold">Independent Consultation</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-[#FDF8E7] px-4 py-2.5 rounded-xl border border-black w-full sm:w-auto justify-start">
                      <Briefcase className="h-4 w-4 text-[#0B1A30]" />
                      <span className="text-[#0B1A30] text-xs font-bold">Career Opportunities</span>
                    </div>
                  </div>
                </div>

                {/* Hero Right - Photo with L-shaped border & caption */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-72 sm:w-80 rounded-2xl border-l-[10px] border-b-[10px] border-[#D4AF37] shadow-2xl overflow-hidden bg-white">
                    <img 
                      src={profileImg} 
                      alt="Official Professional Consultant Profile" 
                      className="w-full h-80 sm:h-96 object-cover"
                    />
                    {/* Navy Overlay Caption */}
                    <div className="bg-[#0B1A30] p-4 sm:p-5 text-left border-t border-navy-950">
                      <p className="text-[#D4AF37] text-[10px] uppercase tracking-widest font-extrabold">Ex-Mumbai U19 Player</p>
                      <p className="text-white font-display font-extrabold text-base sm:text-lg mt-0.5">Prakash Palande</p>
                      <p className="text-[#D4AF37] text-xs mt-0.5">Cricket Consultant & Advisor</p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* --- SECTION DIVIDER --- */}
            <div className="bg-[#FAFBFD] pt-12 pb-2 px-4 max-w-7xl mx-auto">
              <div className="bg-navy-900 rounded-2xl p-8 shadow-xl text-center flex flex-col md:flex-row items-center justify-between border border-gold-500/10 gap-6">
                <div className="text-center md:text-left mb-0">
                  <h3 className="text-white text-lg font-bold font-display">Are you looking for overseas cricket career guidance or a club looking for overseas player?</h3>
                  <p className="text-amber-100 text-sm mt-1">Book a direct premium consultation and lock in your session slot instantly.</p>
                </div>
                <div className="flex justify-center md:justify-end w-full md:w-auto">
                  <button 
                    onClick={() => { setActiveTab('book'); setBookingStep(1); }}
                    className="w-full md:w-auto px-6 py-3 bg-gold-gradient text-navy-950 font-bold rounded hover:scale-105 transition text-xs uppercase tracking-wider border border-gold-400 cursor-pointer text-center justify-center flex items-center"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>

            {/* --- WHY CHOOSE ME SECTION --- */}
            <section id="why-choose-me" className="pt-8 pb-20 bg-slate-50 border-y border-slate-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                  <span className="text-gold-600 text-xs font-bold uppercase tracking-widest block">Core Strengths</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 font-display">Why Partner With Me?</h2>
                  <p className="text-slate-600 text-sm sm:text-base font-light">
                    Providing top-tier advice and operational solutions across all vectors of global cricket administration, management, and placement.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Card 1 */}
                  <div className="bg-white rounded-xl shadow-md border-b-4 border-gold-500 overflow-hidden hover:-translate-y-2 transition duration-300 flex flex-col">
                    <div className="h-44 w-full overflow-hidden relative">
                      <img src={globalNetworkImg} alt="International Cricket Network" className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-navy-900/80 backdrop-blur-sm p-2 rounded-lg text-gold-500">
                        <Globe className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold font-display text-navy-900 mb-2">International Cricket Network</h3>
                        <p className="text-slate-600 text-xs leading-relaxed font-light">
                          Access a widespread, verified ecosystem of cricket boards, first-class county clubs, premier league franchises, and premier leagues worldwide.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white rounded-xl shadow-md border-b-4 border-gold-500 overflow-hidden hover:-translate-y-2 transition duration-300 flex flex-col">
                    <div className="h-44 w-full overflow-hidden relative">
                      <img src={playerPlacementImg} alt="Overseas Player Placement guidance" className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-navy-900/80 backdrop-blur-sm p-2 rounded-lg text-gold-500">
                        <Users className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold font-display text-navy-900 mb-2">Overseas Player Placement guidance</h3>
                        <p className="text-slate-600 text-xs leading-relaxed font-light">
                          Direct connection channels to place eligible players in foreign leagues (UK, Europe, Australia, Gulf, Americas), optimizing contract and visa logistics.
                        </p>
                        <div className="mt-4">
                          <button
                            onClick={() => { setActiveTab('eligibility'); setEligibilityStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="w-full py-2 bg-[#0B1A30] hover:bg-navy-950 text-white font-bold rounded text-xs uppercase tracking-wider transition cursor-pointer shadow-sm font-sans"
                          >
                            Check My Eligibility
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white rounded-xl shadow-md border-b-4 border-gold-500 overflow-hidden hover:-translate-y-2 transition duration-300 flex flex-col">
                    <div className="h-44 w-full overflow-hidden relative">
                      <img src={websiteDevelopmentImg} alt="Player and Cricket Club Website Development" className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-navy-900/80 backdrop-blur-sm p-2 rounded-lg text-gold-500">
                        <FileText className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold font-display text-navy-900 mb-2">Player and Cricket Club Website Development</h3>
                        <p className="text-slate-600 text-xs leading-relaxed font-light">
                          Designing state-of-the-art interactive portals and digital administration platforms for elite clubs, cricket academies, and professional leagues.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-white rounded-xl shadow-md border-b-4 border-gold-500 overflow-hidden hover:-translate-y-2 transition duration-300 flex flex-col">
                    <div className="h-44 w-full overflow-hidden relative">
                      <img src={cricketOperationsImg} alt="Cricket Operations" className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-navy-900/80 backdrop-blur-sm p-2 rounded-lg text-gold-500">
                        <Award className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold font-display text-navy-900 mb-2">Cricket Operations</h3>
                        <p className="text-slate-600 text-xs leading-relaxed font-light">
                          Robust consulting on league structuring, tournament operations, sports technology setups, and board compliance.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 5 */}
                  <div className="bg-white rounded-xl shadow-md border-b-4 border-gold-500 overflow-hidden hover:-translate-y-2 transition duration-300 flex flex-col">
                    <div className="h-44 w-full overflow-hidden relative">
                      <img src={mediaManagementImg} alt="Player & Club Digital Media Management" className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-navy-900/80 backdrop-blur-sm p-2 rounded-lg text-gold-500">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold font-display text-navy-900 mb-2">Player & Club Digital Media Management</h3>
                        <p className="text-slate-600 text-xs leading-relaxed font-light">
                          Tailored brand elevation, sponsors outreach, commercial service overlays, and comprehensive digital media management for players, clubs and leagues.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 6 */}
                  <div className="bg-white rounded-xl shadow-md border-b-4 border-gold-500 overflow-hidden hover:-translate-y-2 transition duration-300 flex flex-col">
                    <div className="h-44 w-full overflow-hidden relative">
                      <img src={cricketToursImg} alt="Cricket Tours" className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-navy-900/80 backdrop-blur-sm p-2 rounded-lg text-gold-500">
                        <Briefcase className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold font-display text-navy-900 mb-2">Cricket Tours</h3>
                        <p className="text-slate-600 text-xs leading-relaxed font-light">
                          Full-scale operational management of inbound tours into India, and organizing outbound overseas bilateral tours for academies and corporate clubs.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 7 */}
                  <div className="bg-white rounded-xl shadow-md border-b-4 border-gold-500 overflow-hidden hover:-translate-y-2 transition duration-300 flex flex-col">
                    <div className="h-44 w-full overflow-hidden relative">
                      <img src={independentConsultingImg} alt="Independent Consulting" className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-navy-900/80 backdrop-blur-sm p-2 rounded-lg text-gold-500">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold font-display text-navy-900 mb-2">Independent Consulting</h3>
                        <p className="text-slate-600 text-xs leading-relaxed font-light">
                          Unbiased, strictly independent career mappings and corporate reviews, putting client career longevity and trust above everything else.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* --- ANIMATED COUNTERS --- */}
            <section className="bg-navy-900 py-16 text-white border-y border-navy-800 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-grid-white"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  
                  <div className="space-y-2">
                    <p className="text-gold-500 text-4xl sm:text-5xl font-extrabold font-display">50+</p>
                    <p className="text-xs sm:text-sm text-amber-100 uppercase tracking-widest font-medium">Overseas Placements</p>
                  </div>

                  <div className="space-y-2 md:border-l md:border-navy-800">
                    <p className="text-gold-500 text-4xl sm:text-5xl font-extrabold font-display">6+</p>
                    <p className="text-xs sm:text-sm text-amber-100 uppercase tracking-widest font-medium">Global Network Countries</p>
                  </div>

                  <div className="space-y-2 md:border-l md:border-navy-800">
                    <p className="text-gold-500 text-4xl sm:text-5xl font-extrabold font-display">15+</p>
                    <p className="text-xs sm:text-sm text-amber-100 uppercase tracking-widest font-medium">Years in Administration</p>
                  </div>

                  <div className="space-y-2 md:border-l md:border-navy-800">
                    <p className="text-gold-500 text-4xl sm:text-5xl font-extrabold font-display">7+</p>
                    <p className="text-xs sm:text-sm text-amber-100 uppercase tracking-widest font-medium">Organisations Served</p>
                  </div>

                </div>
              </div>
            </section>

            {/* --- ABOUT ME SECTION --- */}
            <section id="about-me" className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  
                  {/* Left Bio Column */}
                  <div className="lg:col-span-6 space-y-6">
                    <span className="text-gold-600 text-xs font-bold uppercase tracking-widest block">Prakash Palande</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 font-display">
                      About Prakash Palande
                    </h2>
                    
                    <p className="text-slate-700 text-sm leading-relaxed">
                      I am Prakash Palande, an Independent Cricket Advisor with extensive experience in cricket administration, player management, overseas placements, and cricket operations.
                    </p>
                    
                    <p className="text-slate-700 text-sm leading-relaxed">
                      Having represented Mumbai Under-19 as a player, I have built my career by working with leading cricket organisations across India and internationally.
                    </p>

                    <p className="text-slate-700 text-sm leading-relaxed">
                      Over the years I have helped clubs, associations, leagues and players build successful cricket careers through honest advice, professional consulting and a strong international cricket network.
                    </p>

                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="text-navy-900 font-bold text-sm uppercase tracking-wider mb-4">Key Career Highlights:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start space-x-2 text-xs text-slate-700">
                          <CheckCircle className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                          <span>Successfully placed over 50 players overseas with first-class and elite league clubs.</span>
                        </li>
                        <li className="flex items-start space-x-2 text-xs text-slate-700">
                          <CheckCircle className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                          <span>Facilitated Indian international fast bowler <strong>Ishant Sharma's</strong> placement with Sussex County Cricket Club during the 2018 English season.</span>
                        </li>
                        <li className="flex items-start space-x-2 text-xs text-slate-700">
                          <CheckCircle className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" />
                          <span>Placed <strong>Vinayak Shukla</strong> in Oman, who has recently risen to be appointed Captain of the Oman National Cricket Team.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Right Experience Timeline Column */}
                  <div className="lg:col-span-6 space-y-8 bg-slate-50 p-8 rounded-xl border border-slate-100">
                    <h3 className="text-xl font-bold font-display text-navy-900 border-b border-slate-200 pb-4">Professional Timeline</h3>
                    
                    <div className="relative border-l border-gold-400 pl-6 ml-2 space-y-6 text-slate-700">
                      
                      <div className="relative">
                        <div className="absolute -left-9 top-1.5 bg-navy-800 border-2 border-gold-500 h-4 w-4 rounded-full"></div>
                        <h4 className="font-bold text-sm text-navy-900 uppercase">Represented Mumbai Under-19</h4>
                        <p className="text-xs text-slate-500 font-medium">Former Player Path</p>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-9 top-1.5 bg-navy-800 border-2 border-gold-500 h-4 w-4 rounded-full"></div>
                        <h4 className="font-bold text-sm text-navy-900 uppercase">Assistant Manager – Mumbai Cricket Association</h4>
                        <p className="text-xs text-slate-500 font-medium">State Cricket Administration</p>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-9 top-1.5 bg-navy-800 border-2 border-gold-500 h-4 w-4 rounded-full"></div>
                        <h4 className="font-bold text-sm text-navy-900 uppercase">Manager – Goa Cricket Association</h4>
                        <p className="text-xs text-slate-500 font-medium">First-Class Operations & Management</p>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-9 top-1.5 bg-navy-800 border-2 border-gold-500 h-4 w-4 rounded-full"></div>
                        <h4 className="font-bold text-sm text-navy-900 uppercase">Former Qualified Cricket Agent – ECB (UK)</h4>
                        <p className="text-xs text-slate-500 font-medium">England & Wales Cricket Board Agent Credentials</p>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-9 top-1.5 bg-navy-800 border-2 border-gold-500 h-4 w-4 rounded-full"></div>
                        <h4 className="font-bold text-sm text-navy-900 uppercase">Cricket Consultant – Cricket Kenya</h4>
                        <p className="text-xs text-slate-500 font-medium">International Cricket Board Restructuring</p>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-9 top-1.5 bg-navy-800 border-2 border-gold-500 h-4 w-4 rounded-full"></div>
                        <h4 className="font-bold text-sm text-navy-900 uppercase">Chief Executive Officer – Zalawad Royals</h4>
                        <p className="text-xs text-slate-500 font-medium">Saurashtra Premier League Franchise Operations</p>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-9 top-1.5 bg-navy-800 border-2 border-gold-500 h-4 w-4 rounded-full"></div>
                        <h4 className="font-bold text-sm text-navy-900 uppercase">Cricket Consultant – SOBO Supersonics & Kandahar Knights</h4>
                        <p className="text-xs text-slate-500 font-medium">T20 Mumbai & Afghanistan Premier League</p>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* --- SERVICES SECTION --- */}
            <section id="services" className="py-20 bg-slate-50 border-t border-slate-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                  <span className="text-gold-600 text-xs font-bold uppercase tracking-widest block">Consulting Specialties</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 font-display">Professional Services Portfolio</h2>
                  <p className="text-slate-600 text-sm sm:text-base font-light">
                    Premium strategic services tailored to high-performing cricketers, state associations, and professional global leagues.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {packages.map((pkg, idx) => (
                    <div key={pkg.id} className="bg-white rounded-xl shadow-md border border-slate-150 overflow-hidden hover:shadow-xl transition flex flex-col justify-between group">
                      <div className="p-8 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-gold-500 font-bold text-xs uppercase tracking-wider">0{idx + 1} / CONSULTING</span>
                            <span className="px-2.5 py-1 bg-gold-500/10 text-gold-700 font-extrabold text-xs rounded-full border border-gold-500/20">
                              {pkg.duration}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold font-display text-navy-900 mb-2 group-hover:text-gold-600 transition">{pkg.title}</h3>
                          <p className="text-slate-600 text-xs leading-relaxed font-light mb-4">
                            {pkg.description}
                          </p>
                        </div>
                        
                        <div className="pt-4 border-t border-slate-100 mt-2">
                          <button 
                            onClick={() => handleStartBooking(pkg)}
                            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg uppercase tracking-wider transition duration-150 shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center space-x-2"
                          >
                            <Calendar className="h-4 w-4 text-gold-300" />
                            <span>Book Now</span>
                          </button>
                        </div>
                      </div>
                      <div className="bg-navy-50/50 px-8 py-3.5 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-xs font-semibold text-navy-900">{pkg.duration} Dedicated Session</span>
                        <TrendingUp className="h-4 w-4 text-gold-500" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* --- CALL TO ACTION --- */}
                <div className="mt-16 bg-gradient-to-r from-navy-800 to-navy-950 p-10 rounded-2xl shadow-xl text-center border border-gold-500/20 max-w-4xl mx-auto space-y-6">
                  <h3 className="text-2xl font-bold text-white font-display">
                    Secure Your One-on-One Paid Online Consultation
                  </h3>
                  <p className="text-slate-300 text-sm max-w-2xl mx-auto font-light">
                    Direct video consultations regarding placements, academy careers, tour coordination, and operational setups. Fully backed by secure automated booking.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button 
                      onClick={() => { setActiveTab('book'); setBookingStep(1); }}
                      className="px-8 py-4 bg-gold-gradient text-navy-950 font-bold rounded shadow-lg hover:scale-105 transform transition uppercase tracking-wider text-xs border border-gold-400"
                    >
                      Book Online Consultation
                    </button>

                  </div>
                </div>

              </div>
            </section>

            {/* --- CLIENT WEBSITES SECTION --- */}
            {/* <section id="client-websites" className="py-20 bg-white border-t border-slate-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                  <span className="text-gold-600 text-xs font-bold uppercase tracking-widest block">Our Work</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 font-display">Our Cricket Clients Website</h2>
                  <p className="text-slate-600 text-sm sm:text-base font-light">
                    Explore the premium digital platforms and custom high-performance systems designed and developed by our technical division for elite clients.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  <div className="lg:col-span-7">
                    <div className="bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-2xl group hover:shadow-gold-500/5 hover:border-gold-500/35 transition duration-500">
                      <div className="bg-navy-950 px-4 py-3 sm:py-4 flex items-center space-x-2 border-b border-navy-800">
                        <div className="flex space-x-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 block"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 block"></span>
                        </div>
                        <div className="bg-navy-900/60 text-slate-300 text-[10px] sm:text-xs py-1 px-3 sm:px-6 rounded-md flex-grow text-center font-mono max-w-xs mx-auto truncate select-none border border-navy-800/80">
                          harshilxperformance.com
                        </div>
                      </div>

                      <div className="bg-navy-950 aspect-video relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                        
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
                        
                        <div className="relative z-10 text-center space-y-4 p-8">
                          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20 transform group-hover:scale-110 transition duration-300">
                            <TrendingUp className="h-8 w-8 text-navy-950" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold tracking-tight text-white font-display uppercase">Harshil X Performance</h4>
                            <p className="text-slate-400 text-xs mt-1 font-mono tracking-widest">ATHLETIC DEVELOPMENT & PHYSICAL CONDITIONING</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-2">
                      <span className="px-3 py-1 text-[10px] font-bold bg-gold-100 text-gold-800 rounded-full uppercase tracking-wider inline-block">
                        Elite Coaching Platform
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-navy-900 font-display">Harshil X Performance</h3>
                      <p className="text-slate-500 text-xs font-mono">
                        URL: <a href="https://harshilxperformance.com" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:underline">harshilxperformance.com</a>
                      </p>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed font-light">
                      A premium, bespoke athletic development platform designed and custom-built by our engineering division. Created specifically for elite cricket performance, fitness tracking, and athlete-coach communication.
                    </p>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900">Key Deliverables</h4>
                      <ul className="space-y-2 text-xs text-slate-600">
                        <li className="flex items-center space-x-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 block"></span>
                          <span><strong>Dynamic Performance Engine:</strong> Personal metrics dashboards.</span>
                        </li>
                        <li className="flex items-center space-x-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 block"></span>
                          <span><strong>Interactive Workout Rosters:</strong> Custom calendar schedulers.</span>
                        </li>
                        <li className="flex items-center space-x-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 block"></span>
                          <span><strong>Ultra-Responsive UI:</strong> Seamless loading on mobile and desktop devices.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-2.5 py-1 text-[10px] font-medium bg-slate-100 text-slate-800 rounded-md border border-slate-200">React 19</span>
                      <span className="px-2.5 py-1 text-[10px] font-medium bg-slate-100 text-slate-800 rounded-md border border-slate-200">Vite & TS</span>
                      <span className="px-2.5 py-1 text-[10px] font-medium bg-slate-100 text-slate-800 rounded-md border border-slate-200">TailwindCSS</span>
                      <span className="px-2.5 py-1 text-[10px] font-medium bg-slate-100 text-slate-800 rounded-md border border-slate-200">Motion API</span>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <a 
                        href="https://harshilxperformance.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-navy-900 hover:bg-navy-950 text-white text-xs font-bold rounded uppercase tracking-wider transition hover:scale-105 duration-150 shadow-md"
                      >
                        <span>Launch Site</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <span className="text-[10px] text-slate-400 font-mono">EST. 2026</span>
                    </div>
                  </div>

                </div>

              </div>
            </section> */}


            {/* --- FAQ SECTION --- */}
            <section id="faq" className="py-20 bg-white border-t border-slate-100">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center mb-12 space-y-4">
                  <span className="text-gold-600 text-xs font-bold uppercase tracking-widest block">Inquiries</span>
                  <h2 className="text-3xl font-extrabold text-navy-900 font-display">Frequently Asked Questions</h2>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 space-y-6 border border-slate-100">
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3 text-navy-900">
                      <HelpCircle className="h-6 w-6 text-gold-500 flex-shrink-0 mt-0.5" />
                      <h3 className="font-bold text-base sm:text-lg font-display">Do you guarantee overseas placements?</h3>
                    </div>
                    <div className="pl-9 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 font-light">
                      <p><strong>No.</strong> I do not guarantee overseas placements, contracts, team selections, trials, visas or employment.</p>
                      <p>My role is to provide honest, professional consultation, networking and guidance based on my experience and international cricket contacts.</p>
                      <p>Every opportunity depends on several factors including player ability, performance, attitude, visa regulations and the requirements of clubs or organisations. Final decisions always remain with the respective clubs, leagues, associations or employers.</p>
                    </div>
                  </div>
                </div>

                {/* --- DISCLAIMER --- */}
                <div className="mt-12 bg-slate-150/70 p-6 rounded-lg border border-slate-200 text-[11px] leading-relaxed text-slate-500 font-light space-y-2">
                  <p className="font-semibold uppercase text-slate-700">Disclaimer Notice:</p>
                  <p>The Cricket Advisor provides independent cricket consulting, advisory, networking and support services. No guarantee is made regarding overseas placements, contracts, employment, team selection, visas, trials or any specific outcome. Advice is provided in good faith based on professional experience and industry knowledge. Final decisions always remain with the relevant clubs, cricket boards, leagues, associations, employers or governing authorities.</p>
                </div>

                {/* --- REFUND POLICY ACCORDION --- */}
                <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                  <button 
                    onClick={() => setIsRefundPolicyOpen(!isRefundPolicyOpen)}
                    className="w-full flex items-center justify-between py-4 px-6 text-left hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <FileText className="h-5 w-5 text-gold-600" />
                      <span className="font-display font-bold text-navy-900 text-sm uppercase tracking-wider">Refund Policy & Guarantees</span>
                    </div>
                    {isRefundPolicyOpen ? (
                      <ChevronUp className="h-5 w-5 text-slate-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-500" />
                    )}
                  </button>
                  {isRefundPolicyOpen && (
                    <div className="p-6 border-t border-slate-150 bg-slate-50/50 max-h-[500px] overflow-y-auto animate-fade-in">
                      <RefundPolicyContent />
                    </div>
                  )}
                </div>

              </div>
            </section>

            {/* --- CONTACT SECTION --- */}
            <section id="contact" className="py-20 bg-slate-50 border-t border-slate-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                  
                  {/* Left Form Info */}
                  <div className="lg:col-span-5 space-y-6">
                    <span className="text-gold-600 text-xs font-bold uppercase tracking-widest block">Get In Touch</span>
                    <h2 className="text-3xl font-extrabold text-navy-900 font-display">Let's Work Together</h2>
                    <p className="text-slate-600 text-sm leading-relaxed font-light">
                      Looking for overseas cricket opportunities, cricket consulting, cricket club website development or international cricket tours? Let's discuss how I can help.
                    </p>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-3 text-slate-700">
                        <Mail className="h-5 w-5 text-gold-500" />
                        <div>
                          <p className="text-xs text-slate-400 font-medium">Official Email</p>
                          <a href="mailto:thecricketadvisor@gmail.com" className="text-sm font-semibold hover:text-gold-600">thecricketadvisor@gmail.com</a>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 text-slate-700">
                        <Phone className="h-5 w-5 text-gold-500 fill-current" />
                        <div>
                          <p className="text-xs text-slate-400 font-medium">WhatsApp Hotlink</p>
                          <a href="https://wa.me/918591133960" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold hover:text-gold-600">+91 85911 33960</a>
                        </div>
                      </div>

                      <div className="pt-4 flex space-x-4">
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-slate-200 hover:border-gold-500 hover:text-gold-600 rounded-full text-slate-400 transition" title="LinkedIn Placeholder">
                          <Users className="h-5 w-5" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 border border-slate-200 hover:border-gold-500 hover:text-gold-600 rounded-full text-slate-400 transition" title="Instagram Placeholder">
                          <Globe className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right Form Component */}
                  <div className="lg:col-span-7 bg-slate-50 p-8 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold font-display text-navy-900 mb-6">Inquiry Form</h3>
                    
                    {contactSubmitted ? (
                      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg text-center space-y-3">
                        <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
                        <h4 className="font-bold text-emerald-900 text-sm uppercase">Message Sent Successfully!</h4>
                        <p className="text-xs text-emerald-700">Thank you for reaching out. I will review your request and contact you within 24-48 business hours.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name *</label>
                          <input 
                            type="text" 
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-250 rounded text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                            placeholder="John Doe"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address *</label>
                            <input 
                              type="email" 
                              required
                              value={contactForm.email}
                              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-slate-250 rounded text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                              placeholder="john@example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">WhatsApp Number</label>
                            <input 
                              type="text" 
                              value={contactForm.whatsApp}
                              onChange={(e) => setContactForm({ ...contactForm, whatsApp: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-slate-250 rounded text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                              placeholder="+91 98200 12345"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Detailed Message *</label>
                          <textarea 
                            rows={4}
                            required
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-250 rounded text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500"
                            placeholder="Describe your current cricket levels, club expectations, or tour inquiries..."
                          ></textarea>
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-3 bg-navy-800 hover:bg-navy-900 text-white font-bold rounded uppercase tracking-wider text-xs transition border border-navy-700"
                        >
                          Submit Inquiry
                        </button>
                      </form>
                    )}

                  </div>

                </div>

              </div>
            </section>

          </div>
        )}

        {/* {activeTab === 'placements' && (
          <div className="bg-[#fafafa] min-h-screen pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
              <div className="text-center space-y-4">
                <span className="text-gold-600 text-xs font-bold uppercase tracking-widest block font-display">Success Stories</span>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-navy-900 font-display">Global Placements Roster</h1>
                <p className="text-slate-650 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed">
                  Celebrating the talented cricketers placed in major leagues, clubs, and academies worldwide through Prakash Palande's advisory.
                </p>
                <div className="w-16 h-1 bg-gold-500 mx-auto rounded-full mt-4"></div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-center gap-10">
                {players.map((player) => (
                  <div 
                    key={player.id} 
                    className="w-full max-w-[620px] bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-gold-500/5 hover:-translate-y-1.5 transition duration-300"
                  >
                    <div className="relative aspect-[1.91/1] w-full bg-slate-50 border-b border-slate-100 overflow-hidden">
                      {player.imageUrl ? (
                        <img 
                          src={player.imageUrl} 
                          alt={`${player.name} Placement Card`} 
                          className="w-full h-full object-contain bg-white hover:scale-[1.02] transition duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-navy-900 to-navy-950 flex flex-col items-center justify-center text-gold-500 p-6">
                          <User className="h-16 w-16 mb-4 text-gold-400" />
                          <span className="text-xl font-bold font-display uppercase tracking-widest">{player.name}</span>
                          <span className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{player.country}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 sm:p-8">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-black font-display text-violet-900 uppercase tracking-tight">{player.name}</h3>
                          <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mt-0.5">{player.club || 'Independent Placement'}</p>
                        </div>
                        <span className="px-3 py-1 text-[10px] font-bold bg-violet-900 text-white rounded-md uppercase tracking-wider">
                          {player.country}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-16">
              <button 
                onClick={() => { setActiveTab('main'); scrollToSection('home'); }}
                className="px-8 py-4 bg-navy-900 hover:bg-navy-950 text-white font-bold rounded uppercase tracking-wider text-xs border border-navy-800 transition hover:scale-105 duration-150 shadow-md"
              >
                Back to Homepage
              </button>
            </div>

          </div>
        )} */}

        {/* =========================================================================
            1.5. UK OVERSEAS CRICKET ELIGIBILITY ASSESSMENT WORKSPACE TAB
           ========================================================================= */}
        {activeTab === 'eligibility' && (
          <div className="py-12 bg-slate-50 min-h-[85vh] text-slate-800 font-sans">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
              
              {/* Back Button */}
              {eligibilityStep <= 17 && (
                <div className="mb-6 print:hidden">
                  <button 
                    onClick={() => {
                      if (eligibilityStep === 1) {
                        try { sessionStorage.removeItem('tcc_active_tab'); } catch {}
                        setActiveTab('main');
                      } else if (window.confirm("Are you sure you want to exit the Eligibility Assessment? Your current progress will be lost.")) {
                        try { sessionStorage.removeItem('tcc_confirmed_assessment'); sessionStorage.removeItem('tcc_eligibility_step'); sessionStorage.removeItem('tcc_active_tab'); } catch {}
                        setActiveTab('main');
                        setEligibilityStep(1);
                        setEligibilityForm(initialEligibilityForm);
                      }
                    }}
                    className="flex items-center space-x-2 text-slate-600 hover:text-[#0B1A30] font-semibold text-sm transition cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>{eligibilityStep === 1 ? 'Back to Homepage' : 'Cancel & Back to Homepage'}</span>
                  </button>
                </div>
              )}

              {/* Step Title & Progress for the vertical form */}
              {eligibilityStep === 1 && (
                <div className="mb-8 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0B1A30] font-display">
                      UK Cricket Eligibility Assessment
                    </span>
                    <span className="text-xs font-mono font-bold text-gold-600">
                      Sections 1 to 3
                    </span>
                  </div>
                  <div className="w-full bg-[#0B1A30]/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#0B1A30] h-full w-full" />
                  </div>
                </div>
              )}

               {/* STEP 1: VERTICAL SCROLLABLE FORM */}
              {eligibilityStep === 1 && (
                <div className="space-y-8 animate-fade-in text-left">
                  <div className="text-center pb-2">
                    <h2 className="text-2xl font-black text-[#0B1A30] font-display uppercase tracking-tight">UK Cricket Eligibility Intake Form</h2>
                    <p className="text-slate-500 text-xs mt-1 font-sans">Please fill out all the sections below honestly to submit your details for review.</p>
                  </div>

                  {/* Section Title & Progress Indicator */}
                  <div className="mb-4 text-left">
                    <div className="flex justify-between items-center text-xs font-bold text-[#0B1A30] font-display uppercase">
                      <span>Section {activeSection} of 3</span>
                      <span className="text-gold-600 font-mono">
                        {activeSection === 1 ? 'Personal Details & Contact' : activeSection === 2 ? 'Cricket Credentials & Play History' : 'Background declarations'}
                      </span>
                    </div>
                    <div className="w-full bg-[#0B1A30]/10 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div 
                        className="bg-gold-500 h-full transition-all duration-300"
                        style={{ width: `${(activeSection / 3) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* SECTION 1: IDENTITY & CONTACT DETAILS */}
                  {activeSection === 1 && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
                      <div className="bg-[#0B1A30] text-[#D4AF37] px-6 py-4 rounded-t-xl font-bold font-display uppercase text-xs tracking-wider border-b border-gold-500/20 flex items-center justify-between">
                        <span>Section 1: Personal Details & Contact</span>
                        <span className="text-[10px] text-gold-300/80 no-capitalize font-semibold font-sans">Fields 1–6</span>
                      </div>
                      <div className="p-6 space-y-6">
                        {/* Q1 First Name */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase font-sans">1. First Name *</label>
                          <input
                            type="text"
                            value={eligibilityForm.firstName}
                            onChange={(e) => handleEligibilityChange('firstName', e.target.value)}
                            className="w-full text-xs p-3.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white text-slate-800 font-semibold font-sans"
                            placeholder="Enter your first name"
                          />
                        </div>

                        {/* Q2 Last Name */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase font-sans">2. Last Name *</label>
                          <input
                            type="text"
                            value={eligibilityForm.lastName}
                            onChange={(e) => handleEligibilityChange('lastName', e.target.value)}
                            className="w-full text-xs p-3.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white text-slate-800 font-semibold font-sans"
                            placeholder="Enter your last name"
                          />
                        </div>

                        {/* Q3 Age Group Check */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase font-sans">3. Are you above 18 Years Old? *</label>
                          {renderSelectDropdown('isAbove18', ['Yes', 'No'])}
                        </div>

                        {/* Q4 Nationality */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase font-sans">4. Select Your Nationality *</label>
                          {renderSelectDropdown('nationality', ['Indian', 'Sri Lankan', 'New Zealander', 'Australia', 'South African', 'Canadian', 'American'])}
                        </div>

                        {/* Q5 Passport validity */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase font-sans">5. Do you have a valid passport for 6 or more months? *</label>
                          {renderSelectDropdown('hasValidPassport', ['Yes', 'No'])}
                        </div>

                        {/* Q6 Contact information */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                          <h4 className="text-xs font-bold text-[#0B1A30] uppercase tracking-wider font-display text-left">6. Contact Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 font-sans">Email ID *</label>
                              <input
                                type="email"
                                value={eligibilityForm.email}
                                onChange={(e) => handleEligibilityChange('email', e.target.value)}
                                className="w-full text-xs p-3.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#D4AF37] bg-white text-slate-800 font-semibold font-sans"
                                placeholder="e.g. name@example.com"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-550 uppercase mb-1.5 font-sans">Mobile Number *</label>
                              <div className="flex rounded-xl shadow-sm overflow-hidden border border-slate-300">
                                <span className="inline-flex items-center px-4 bg-slate-100 text-slate-600 font-extrabold text-xs select-none border-r border-slate-200">
                                  {getNationalityCode(eligibilityForm.nationality) || '+'}
                                </span>
                                <input
                                  type="tel"
                                  value={eligibilityForm.mobileNumber.replace(getNationalityCode(eligibilityForm.nationality), '').trim()}
                                  onChange={(e) => {
                                    const prefix = getNationalityCode(eligibilityForm.nationality);
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    handleEligibilityChange('mobileNumber', prefix ? `${prefix} ${val}` : val);
                                  }}
                                  className="flex-1 min-w-0 block w-full px-3.5 py-3 text-xs focus:outline-none bg-white text-slate-800 font-semibold font-sans"
                                  placeholder="Enter mobile number"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Navigation for Section 1 */}
                      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to cancel and exit? Your progress will be lost.")) {
                              setActiveTab('main');
                              setEligibilityStep(1);
                              setActiveSection(1);
                              setEligibilityForm(initialEligibilityForm);
                            }
                          }}
                          className="px-6 py-3 border border-slate-355 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-xs uppercase tracking-wider transition bg-white cursor-pointer font-sans"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          disabled={!isSection1Complete()}
                          onClick={() => setActiveSection(2)}
                          className="px-8 py-3 bg-[#0B1A30] hover:bg-navy-950 text-white font-bold rounded-lg text-xs uppercase tracking-wider shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-sans"
                        >
                          Next Section
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SECTION 2: CRICKET CREDENTIALS & PLAY HISTORY */}
                  {activeSection === 2 && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
                      <div className="bg-[#0B1A30] text-[#D4AF37] px-6 py-4 rounded-t-xl font-bold font-display uppercase text-xs tracking-wider border-b border-gold-500/20 flex items-center justify-between">
                        <span>Section 2: Cricket Credentials & Play History</span>
                        <span className="text-[10px] text-gold-300/80 no-capitalize font-semibold font-sans">Fields 7–13</span>
                      </div>
                      <div className="p-6 space-y-6">
                        
                        {/* Q7 First-Class Cricket */}
                        <div className="space-y-4">
                          <label className="block text-xs font-bold text-slate-700 uppercase font-sans">7. First-Class Cricket *</label>
                          <p className="text-slate-500 text-[11px] font-sans">Have you played First-Class cricket for the cricket board affiliated to the Test Playing Nation?</p>
                          {renderSelectDropdown('firstClassPlayed', ['Yes', 'No'])}
                          
                          {eligibilityForm.firstClassPlayed === 'Yes' && (
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-fade-in text-left">
                              <div>
                                <label className="block text-xs font-bold text-slate-550 uppercase mb-1.5 font-sans">Which year you played last *</label>
                                {renderSelectDropdown('firstClassLastYear', Array.from({ length: 2026 - 2001 + 1 }, (_, i) => String(2026 - i)))}
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-550 uppercase mb-1.5 font-sans">How many First-Class games have you played in the last 36 months? *</label>
                                {renderSelectDropdown('firstClassMatches36Months', ['0', ...Array.from({ length: 40 }, (_, i) => String(i + 1))])}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Q8 List A Cricket */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                          <label className="block text-xs font-bold text-slate-700 uppercase font-sans">8. List A Cricket *</label>
                          <p className="text-slate-500 text-[11px] font-sans">Have you played List A cricket for the cricket board affiliated to the Test Playing Nation?</p>
                          {renderSelectDropdown('listAPlayed', ['Yes', 'No'])}
                          
                          {eligibilityForm.listAPlayed === 'Yes' && (
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-fade-in text-left">
                              <div>
                                <label className="block text-xs font-bold text-slate-550 uppercase mb-1.5 font-sans">Which year you played last *</label>
                                {renderSelectDropdown('listALastYear', Array.from({ length: 2026 - 2001 + 1 }, (_, i) => String(2026 - i)))}
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-550 uppercase mb-1.5 font-sans">List A matches in last 36 months *</label>
                                {renderSelectDropdown('listAMatches36Months', ['0', ...Array.from({ length: 40 }, (_, i) => String(i + 1))])}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Q9 Domestic T20 Cricket */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                          <label className="block text-xs font-bold text-slate-700 uppercase font-sans">9. Domestic T20 Cricket *</label>
                          <p className="text-slate-500 text-[11px] font-sans">Have you played Domestic T20 cricket for the cricket board affiliated to the Test Playing Nation?</p>
                          {renderSelectDropdown('domesticT20Played', ['Yes', 'No'])}
                          
                          {eligibilityForm.domesticT20Played === 'Yes' && (
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-fade-in text-left">
                              <div>
                                <label className="block text-xs font-bold text-slate-550 uppercase mb-1.5 font-sans">Which year you played last *</label>
                                {renderSelectDropdown('domesticT20LastYear', Array.from({ length: 2026 - 2001 + 1 }, (_, i) => String(2026 - i)))}
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-550 uppercase mb-1.5 font-sans">T20 matches in last 36 months *</label>
                                {renderSelectDropdown('domesticT20Matches36Months', ['0', ...Array.from({ length: 40 }, (_, i) => String(i + 1))])}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Q10 Age Group Cricket */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                          <label className="block text-xs font-bold text-slate-700 uppercase font-sans">10. Age Group Cricket *</label>
                          <p className="text-slate-500 text-[11px] font-sans">Have you played Age Group State/County/Province level cricket for the cricket board affiliated to the Test Playing Nation?</p>
                          {renderSelectDropdown('ageGroupPlayed', ['Yes', 'No'])}
                          
                          {eligibilityForm.ageGroupPlayed === 'Yes' && (
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-fade-in text-left">
                              <label className="block text-xs font-bold text-slate-550 uppercase mb-1.5 font-sans">Which year you played last *</label>
                              {renderSelectDropdown('ageGroupLastYear', Array.from({ length: 2026 - 2001 + 1 }, (_, i) => String(2026 - i)))}
                            </div>
                          )}
                        </div>

                        {/* Q11 ICC/State Approved T20 League */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                          <label className="block text-xs font-bold text-slate-700 uppercase font-sans">11. ICC/State Approved T20 League *</label>
                          <p className="text-slate-500 text-[11px] leading-relaxed font-sans">
                            Have you played in any T20 league approved by a Test Playing Nation or Board affiliated to ICC? <br />
                            <span className="text-[10px] text-slate-400 italic">Examples: T20 Mumbai League, Uttar Pradesh T20 League, MP Premier League, Oman D20</span>
                          </p>
                          {renderSelectDropdown('iccT20Played', ['Yes', 'No'])}
                          
                          {eligibilityForm.iccT20Played === 'Yes' && (
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-fade-in text-left">
                              <label className="block text-xs font-bold text-slate-555 uppercase mb-1.5 font-sans">Which year you played last *</label>
                              {renderSelectDropdown('iccT20LastYear', Array.from({ length: 2026 - 2001 + 1 }, (_, i) => String(2026 - i)))}
                            </div>
                          )}
                        </div>

                        {/* Q12 University Cricket */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                          <label className="block text-xs font-bold text-slate-700 uppercase font-sans">12. University Cricket *</label>
                          <p className="text-slate-500 text-[11px] font-sans">Have you represented University Cricket?</p>
                          {renderSelectDropdown('universityPlayed', ['Yes', 'No'])}
                          
                          {eligibilityForm.universityPlayed === 'Yes' && (
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-fade-in text-left">
                              <label className="block text-xs font-bold text-slate-555 uppercase mb-1.5 font-sans">Which year you played last *</label>
                              {renderSelectDropdown('universityLastYear', Array.from({ length: 2026 - 2001 + 1 }, (_, i) => String(2026 - i)))}
                            </div>
                          )}
                        </div>

                        {/* Q13 Club/District Level */}
                        <div className="space-y-2 pt-4 border-t border-slate-100">
                          <label className="block text-xs font-bold text-slate-700 uppercase font-sans">13. Club/District Cricket *</label>
                          <p className="text-slate-500 text-[11px] font-sans">Are you currently playing cricket at Club or District level? *</p>
                          {renderSelectDropdown('clubDistrictLevel', ['Yes', 'No'])}
                        </div>
                      </div>

                      {/* Navigation for Section 2 */}
                      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setActiveSection(1)}
                          className="px-6 py-3 border border-slate-355 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-xs uppercase tracking-wider transition bg-white cursor-pointer font-sans"
                        >
                          Previous Section
                        </button>

                        <button
                          type="button"
                          disabled={!isSection2Complete()}
                          onClick={() => setActiveSection(3)}
                          className="px-8 py-3 bg-[#0B1A30] hover:bg-navy-950 text-white font-bold rounded-lg text-xs uppercase tracking-wider shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-sans"
                        >
                          Next Section
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SECTION 3: BACKGROUND & LEGAL CLEARANCE */}
                  {activeSection === 3 && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
                      <div className="bg-[#0B1A30] text-[#D4AF37] px-6 py-4 rounded-t-xl font-bold font-display uppercase text-xs tracking-wider border-b border-gold-500/20 flex items-center justify-between">
                        <span>Section 3: Background Declarations</span>
                        <span className="text-[10px] text-gold-300/80 no-capitalize font-semibold font-sans">Fields 14–16</span>
                      </div>
                      <div className="p-6 space-y-6">
                        
                        {/* Q14 Criminal Cases */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-700 uppercase font-sans">14. Criminal Cases *</label>
                          <p className="text-slate-500 text-[11px] font-sans">Do you currently have any criminal cases pending against you? *</p>
                          {renderSelectDropdown('pendingCriminalCases', ['Yes', 'No'])}
                        </div>

                        {/* Q15 Deportation History */}
                        <div className="space-y-2 pt-4 border-t border-slate-100">
                          <label className="block text-xs font-bold text-slate-700 uppercase font-sans">15. Deportation History *</label>
                          <p className="text-slate-500 text-[11px] font-sans">Have you ever been deported from any country? *</p>
                          {renderSelectDropdown('deportationHistory', ['Yes', 'No'])}
                        </div>

                        {/* Q16 Criminal Conviction */}
                        <div className="space-y-2 pt-4 border-t border-slate-100">
                          <label className="block text-xs font-bold text-slate-700 uppercase font-sans">16. Criminal Conviction *</label>
                          <p className="text-slate-500 text-[11px] font-sans">Have you ever been convicted in a criminal case? *</p>
                          {renderSelectDropdown('criminalConviction', ['Yes', 'No'])}
                        </div>
                      </div>

                      {/* Navigation for Section 3 */}
                      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setActiveSection(2)}
                          className="px-6 py-3 border border-slate-355 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-xs uppercase tracking-wider transition bg-white cursor-pointer font-sans"
                        >
                          Previous Section
                        </button>

                        <button
                          type="button"
                          disabled={!isFormComplete()}
                          onClick={() => setShowLegalModal(true)}
                          className="px-8 py-3 bg-gold-gradient text-navy-950 hover:bg-gold-600 hover:text-navy-950 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-sans"
                        >
                          Submit Form
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 17: SECURE PAYMENT GATEWAY */}
              {eligibilityStep === 17 && (
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8 relative animate-fade-in">
                  <div className="space-y-6 text-center">
                    <div className="text-center pb-4 border-b border-slate-100">
                      <h2 className="text-xl font-extrabold text-navy-900 tracking-tight font-display uppercase">COMPLETE YOUR UK ELIGIBILITY ASSESSMENT</h2>
                      <p className="text-slate-550 text-xs mt-1.5 max-w-md mx-auto leading-relaxed font-sans">
                        Securely complete your professional eligibility intake fee to submit your profile for Review.
                      </p>
                    </div>

                    <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-4 text-left animate-fade-in">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-navy-900 uppercase">Assessment Intake Item</span>
                        <span className="text-slate-650 font-semibold font-sans">UK Cricket Eligibility Assessment Fee</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                        <span className="font-bold text-navy-900 uppercase">Total Assessment Fee</span>
                        <span className="text-lg font-extrabold text-[#0B1A30]">₹500 INR</span>
                      </div>
                    </div>

                    {eligibilityPaymentError && (
                      <div className="p-3.5 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs font-semibold rounded-r flex items-start space-x-2 text-left animate-fade-in">
                        <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                        <span>{eligibilityPaymentError}</span>
                      </div>
                    )}

                    <div className="space-y-3 pt-3 flex flex-col items-center">
                      <button
                        type="button"
                        disabled={isProcessingEligibilityPayment}
                        onClick={handleInitiateEligibilityPayment}
                        className="w-full py-4 bg-[#0B1A30] hover:bg-navy-950 text-white font-extrabold rounded-xl uppercase tracking-widest text-xs border border-navy-900 hover:scale-[1.01] transition transform duration-150 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer font-sans"
                      >
                        {isProcessingEligibilityPayment ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block mr-1" />
                            <span>Processing Secure Payment...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4.5 w-4.5" />
                            <span>PROCEED TO SECURE PAYMENT</span>
                          </>
                        )}
                      </button>

                      {/* Sandbox simulation removed */}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 18: PAYMENT SUCCESS SCREEN */}
              {eligibilityStep === 18 && confirmedAssessment && (
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8 relative animate-fade-in">
                  <div className="space-y-6 text-center py-6 font-sans">
                    <div className="flex justify-center">
                      <div className="bg-emerald-50 p-4 rounded-full border border-emerald-150 animate-bounce">
                        <CheckCircle className="h-16 w-16 text-emerald-500 shrink-0" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-extrabold text-navy-900 tracking-tight font-display uppercase">✅ Thank You, {confirmedAssessment?.lastName}</h2>
                      <p className="text-slate-655 text-xs max-w-md mx-auto leading-relaxed">
                        Your UK Cricket Eligibility Assessment has been successfully submitted.
                      </p>
                    </div>

                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl max-w-sm mx-auto space-y-3 text-left text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] font-display">Payment Status</span>
                        <span className="font-bold text-emerald-800 font-sans">Paid Successfully – ₹500</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-150 pt-2.5">
                        <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] font-display">Application ID</span>
                        <span className="font-mono font-bold text-gold-800 bg-gold-50 px-2.5 py-0.5 rounded border border-gold-200">
                          {confirmedAssessment?.referenceNumber}
                        </span>
                      </div>
                    </div>

                    <div className="max-w-md mx-auto text-xs text-slate-550 font-medium leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 text-left font-sans">
                      You will receive your eligibility report within the next 72 working hours. If additional information is required, The Cricket Advisor team will contact you by phone or email. <br /> <br />
                      <strong>Thank You</strong> <br />
                      Team The Cricket Advisor
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setShowReceiptModal(true)}
                        className="w-full sm:w-auto px-5 py-3 bg-[#0B1A30] hover:bg-navy-950 text-white font-bold rounded-lg uppercase tracking-wider text-xs border border-navy-850 transition duration-150 shadow flex items-center justify-center space-x-1.5 cursor-pointer font-sans"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Payment Receipt</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          try { sessionStorage.removeItem('tcc_confirmed_assessment'); sessionStorage.removeItem('tcc_eligibility_step'); sessionStorage.removeItem('tcc_active_tab'); } catch {}
                          setActiveTab('main');
                          setEligibilityStep(1);
                          setEligibilityForm(initialEligibilityForm);
                          setConfirmedAssessment(null);
                        }}
                        className="w-full sm:w-auto px-5 py-3 border border-slate-350 hover:bg-slate-50 text-slate-700 font-bold rounded-lg uppercase tracking-wider text-xs transition duration-150 cursor-pointer font-sans"
                      >
                        Return to Home
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Assessment Receipt Modal */}
      {showReceiptModal && confirmedAssessment && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto animate-fade-in print:p-0 print:bg-white print:static">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 relative text-slate-800 my-8 print:my-0 print:border-none print:shadow-none font-sans">
            
            {/* Modal Actions */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 print:hidden">
              <div className="flex items-center space-x-2 text-[#0B1A30] font-bold uppercase text-xs tracking-wider">
                <FileText className="h-5 w-5 text-[#D4AF37]" />
                <span>UK Cricket Eligibility Assessment Receipt</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#0B1A30] hover:bg-navy-955 text-white font-bold text-xs rounded-lg uppercase flex items-center space-x-1.5 transition shadow cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Printable Receipt Document */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-6 print:bg-white print:border-none print:p-0">
              
              {/* Header Branding */}
              <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-[#0B1A30] pb-6 gap-4">
                <div className="text-left">
                  <span className="text-[10px] font-black tracking-widest text-[#D4AF37] uppercase">OFFICIAL PAYMENT RECEIPT</span>
                  <h2 className="text-xl font-black font-display text-navy-955 uppercase tracking-tight">The Cricket Advisor</h2>
                  <p className="text-xs text-slate-550 font-medium mt-0.5">Professional Cricket Placements, Board Advisory & Consultancy</p>
                  <p className="text-[11px] text-slate-400 mt-1">Email: info@thecricketadvisor.com | Web: www.thecricketadvisor.com</p>
                </div>

                <div className="text-left sm:text-right font-mono text-xs space-y-1 bg-white p-3 rounded-lg border border-slate-200 print:border-slate-300">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Application ID</p>
                  <p className="font-extrabold text-[#0B1A30] text-sm">{confirmedAssessment?.referenceNumber}</p>
                  <p className="text-slate-555 text-[11px]">Date: {confirmedAssessment?.createdAt ? new Date(confirmedAssessment.createdAt).toLocaleString() : new Date().toLocaleString()}</p>
                  <div className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded uppercase mt-1 border border-emerald-300">
                    Payment: PAID
                  </div>
                </div>
              </div>

              {/* Client & Assessment details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-6 print:border-slate-300 text-left">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BILLED TO (PLAYER)</p>
                  <p className="font-extrabold text-[#0B1A30] text-sm">{confirmedAssessment?.firstName} {confirmedAssessment?.lastName}</p>
                  <p className="text-slate-650"><strong>Email:</strong> {confirmedAssessment?.email}</p>
                  <p className="text-slate-650"><strong>Mobile:</strong> {confirmedAssessment?.mobileNumber}</p>
                  <p className="text-slate-650"><strong>Nationality:</strong> {confirmedAssessment?.nationality}</p>
                </div>

                <div className="space-y-1.5 bg-white p-4 rounded-xl border border-slate-200 print:border-slate-300">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PAYMENT DETAILS</p>
                  <p className="text-slate-650"><strong>Amount:</strong> ₹500 INR</p>
                  <p className="text-slate-650"><strong>Payment Method:</strong> Razorpay Secure Gateway</p>
                  <p className="text-slate-650 break-all"><strong>Payment ID:</strong> {confirmedAssessment?.paymentId || 'N/A'}</p>
                  <p className="text-slate-650 break-all"><strong>Transaction Ref:</strong> {confirmedAssessment?.transactionId || 'N/A'}</p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-[#0B1A30] text-white font-bold uppercase text-[10px] tracking-wider">
                      <th className="p-3 rounded-l-lg">Description</th>
                      <th className="p-3 text-center">Service Type</th>
                      <th className="p-3 text-right rounded-r-lg">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 py-4 text-left">
                        <p className="font-bold text-navy-900 text-sm">UK Cricket Eligibility Assessment</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">Comprehensive athletic credentials intake, visa route mapping review, and administrative eligibility profile check.</p>
                      </td>
                      <td className="p-3 py-4 text-center font-bold text-slate-700">Intake Assessment</td>
                      <td className="p-3 py-4 text-right font-extrabold text-[#0B1A30] font-mono text-sm">₹500.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total Summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-t border-slate-200 pt-4 gap-4 print:border-slate-300">
                <div className="text-[11px] text-slate-500 space-y-1 max-w-xs text-left">
                  <p className="font-bold text-slate-750">Receipt Verification:</p>
                  <p>This is a computer generated confirmation receipt. The fee paid towards the assessment is strictly non-refundable as per the legal declaration accepted before submission.</p>
                </div>

                <div className="w-full sm:w-64 bg-[#0B1A30] text-white p-4 rounded-xl space-y-2 text-xs text-right font-mono border border-gold-500/20 print:text-black print:bg-white print:border-none print:p-0">
                  <div className="flex justify-between text-slate-300 print:text-slate-650">
                    <span>Subtotal:</span>
                    <span>₹423.73</span>
                  </div>
                  <div className="flex justify-between text-slate-300 print:text-slate-650">
                    <span>GST (18%):</span>
                    <span>₹76.27</span>
                  </div>
                  <div className="flex justify-between text-[#D4AF37] font-extrabold text-base border-t border-white/20 pt-2 font-display print:text-black print:border-slate-200">
                    <span>TOTAL PAID:</span>
                    <span>₹500.00</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Assessment Detail Modal */}
      {selectedAssessmentDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col relative text-slate-800 my-8">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 text-left flex justify-between items-center bg-[#0B1A30] text-white rounded-t-2xl">
              <div>
                <span className="text-[9px] font-mono bg-gold-500 text-navy-950 px-2.5 py-0.5 rounded font-black uppercase">
                  Application: {selectedAssessmentDetail.referenceNumber || 'N/A'}
                </span>
                <h3 className="text-xl font-bold font-display text-white uppercase tracking-tight mt-1">
                  {selectedAssessmentDetail.firstName} {selectedAssessmentDetail.lastName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAssessmentDetail(null)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-left text-xs flex-1">
              
              {/* Profile Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[9px]">Email Address</p>
                  <p className="font-bold text-sm text-navy-900">{selectedAssessmentDetail.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[9px]">Mobile Phone</p>
                  <p className="font-bold text-sm text-navy-900 font-mono">{selectedAssessmentDetail.mobileNumber}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[9px]">Nationality</p>
                  <p className="font-bold text-sm text-navy-900">{selectedAssessmentDetail.nationality}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase text-[9px]">Passport Valid (&gt;6 months)</p>
                  <p className="font-bold text-sm text-navy-900">{selectedAssessmentDetail.hasValidPassport}</p>
                </div>
              </div>

              {/* Cricket Credentials */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-navy-955 uppercase border-b border-slate-200 pb-2">Cricket Experience & Play History</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Class */}
                  <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-150 space-y-1">
                    <p className="text-slate-500 font-bold text-[10px]">First-Class Cricket</p>
                    <p className="font-extrabold text-navy-900">{selectedAssessmentDetail.firstClassPlayed}</p>
                    {selectedAssessmentDetail.firstClassPlayed === 'Yes' && (
                      <p className="text-[11px] text-slate-550 pt-1">
                        Last played in <strong>{selectedAssessmentDetail.firstClassLastYear}</strong> | Matches in last 36 mos: <strong>{selectedAssessmentDetail.firstClassMatches36Months}</strong>
                      </p>
                    )}
                  </div>

                  {/* List A */}
                  <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-150 space-y-1">
                    <p className="text-slate-500 font-bold text-[10px]">List A Cricket</p>
                    <p className="font-extrabold text-navy-900">{selectedAssessmentDetail.listAPlayed}</p>
                    {selectedAssessmentDetail.listAPlayed === 'Yes' && (
                      <p className="text-[11px] text-slate-550 pt-1">
                        Last played in <strong>{selectedAssessmentDetail.listALastYear}</strong> | Matches in last 36 mos: <strong>{selectedAssessmentDetail.listAMatches36Months}</strong>
                      </p>
                    )}
                  </div>

                  {/* Domestic T20 */}
                  <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-150 space-y-1">
                    <p className="text-slate-500 font-bold text-[10px]">Domestic T20 Cricket</p>
                    <p className="font-extrabold text-navy-900">{selectedAssessmentDetail.domesticT20Played}</p>
                    {selectedAssessmentDetail.domesticT20Played === 'Yes' && (
                      <p className="text-[11px] text-slate-550 pt-1">
                        Last played in <strong>{selectedAssessmentDetail.domesticT20LastYear}</strong> | Matches in last 36 mos: <strong>{selectedAssessmentDetail.domesticT20Matches36Months}</strong>
                      </p>
                    )}
                  </div>

                  {/* Age Group */}
                  <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-150 space-y-1">
                    <p className="text-slate-500 font-bold text-[10px]">Age Group Representative</p>
                    <p className="font-extrabold text-navy-900">{selectedAssessmentDetail.ageGroupPlayed}</p>
                    {selectedAssessmentDetail.ageGroupPlayed === 'Yes' && (
                      <p className="text-[11px] text-slate-550 pt-1">
                        Last played in <strong>{selectedAssessmentDetail.ageGroupLastYear}</strong>
                      </p>
                    )}
                  </div>

                  {/* ICC/State Approved T20 */}
                  <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-150 space-y-1 col-span-1 md:col-span-2">
                    <p className="text-slate-500 font-bold text-[10px]">ICC/State Approved T20 League</p>
                    <p className="font-extrabold text-navy-900">{selectedAssessmentDetail.iccT20Played}</p>
                    {selectedAssessmentDetail.iccT20Played === 'Yes' && (
                      <p className="text-[11px] text-slate-550 pt-1">
                        Last played in <strong>{selectedAssessmentDetail.iccT20LastYear}</strong>
                      </p>
                    )}
                  </div>

                  {/* University */}
                  <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-150 space-y-1">
                    <p className="text-slate-500 font-bold text-[10px]">University Cricket</p>
                    <p className="font-extrabold text-navy-900">{selectedAssessmentDetail.universityPlayed}</p>
                    {selectedAssessmentDetail.universityPlayed === 'Yes' && (
                      <p className="text-[11px] text-slate-550 pt-1">
                        Last played in <strong>{selectedAssessmentDetail.universityLastYear}</strong>
                      </p>
                    )}
                  </div>

                  {/* Club/District */}
                  <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-150 space-y-1">
                    <p className="text-slate-500 font-bold text-[10px]">Club/District Cricket</p>
                    <p className="font-extrabold text-navy-900">{selectedAssessmentDetail.clubDistrictLevel}</p>
                  </div>
                </div>
              </div>

              {/* Background Declarations */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-navy-950 uppercase border-b border-slate-200 pb-2">Background & Visa Checks</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg border space-y-1" style={{ borderColor: selectedAssessmentDetail.pendingCriminalCases === 'Yes' ? '#ef4444' : '#cbd5e1' }}>
                    <p className="text-slate-500 font-bold text-[10px]">Pending Criminal Cases</p>
                    <p className="font-extrabold text-sm" style={{ color: selectedAssessmentDetail.pendingCriminalCases === 'Yes' ? '#ef4444' : '#0f172a' }}>
                      {selectedAssessmentDetail.pendingCriminalCases}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border space-y-1" style={{ borderColor: selectedAssessmentDetail.deportationHistory === 'Yes' ? '#ef4444' : '#cbd5e1' }}>
                    <p className="text-slate-500 font-bold text-[10px]">Deportation History</p>
                    <p className="font-extrabold text-sm" style={{ color: selectedAssessmentDetail.deportationHistory === 'Yes' ? '#ef4444' : '#0f172a' }}>
                      {selectedAssessmentDetail.deportationHistory}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border space-y-1" style={{ borderColor: selectedAssessmentDetail.criminalConviction === 'Yes' ? '#ef4444' : '#cbd5e1' }}>
                    <p className="text-slate-500 font-bold text-[10px]">Criminal Conviction</p>
                    <p className="font-extrabold text-sm" style={{ color: selectedAssessmentDetail.criminalConviction === 'Yes' ? '#ef4444' : '#0f172a' }}>
                      {selectedAssessmentDetail.criminalConviction}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
              <button
                onClick={() => downloadAssessmentPdf(selectedAssessmentDetail)}
                className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs uppercase cursor-pointer flex items-center space-x-1.5"
              >
                <Download className="h-4 w-4" />
                <span>Download Assessment</span>
              </button>
              <button
                onClick={() => setSelectedAssessmentDetail(null)}
                className="px-6 py-2 bg-slate-800 text-white font-bold rounded-lg text-xs uppercase cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Legal Notice & Declaration Modal */}
      {showLegalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col relative text-slate-800">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-200 text-left">
              <h3 className="text-lg font-bold font-display text-navy-900 uppercase tracking-tight">
                Important Legal Notice & Declaration
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Please read and acknowledge all five declarations below to proceed.</p>
            </div>

            {/* Scrollable Notice Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-left text-xs flex-1">
              <p className="font-semibold text-slate-750 mb-2">
                By checking the boxes below, submitting this eligibility form, and proceeding to payment, you acknowledge and agree to the following:
              </p>

              {/* Decl 1 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-left">
                <p className="font-bold text-[#0B1A30]">1. Non-Legal Status</p>
                <p className="text-slate-600 leading-relaxed font-light">
                  "The Cricket Advisor" is a sports consultancy and administrative support service. We are not qualified immigration solicitors, legal professionals, or regulated by the Office of the Immigration Services Commissioner (OISC). Our guidance is for athletic eligibility assessment only and does not constitute legal or immigration advice.
                </p>
                <label className="flex items-center space-x-2 pt-1 font-bold text-navy-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eligibilityForm.acceptedDeclaration1}
                    onChange={(e) => handleEligibilityChange('acceptedDeclaration1', e.target.checked)}
                    className="h-4 w-4 text-gold-600 rounded border-slate-350 focus:ring-gold-500"
                  />
                  <span>I acknowledge and agree.</span>
                </label>
              </div>

              {/* Decl 2 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-left">
                <p className="font-bold text-[#0B1A30]">2. No Guarantees</p>
                <p className="text-slate-600 leading-relaxed font-light">
                  The Cricket Advisor makes no guarantees regarding ECB registration, visa approval, Home Office decisions, or eligibility approval.
                </p>
                <label className="flex items-center space-x-2 pt-1 font-bold text-navy-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eligibilityForm.acceptedDeclaration2}
                    onChange={(e) => handleEligibilityChange('acceptedDeclaration2', e.target.checked)}
                    className="h-4 w-4 text-gold-600 rounded border-slate-350 focus:ring-gold-500"
                  />
                  <span>I acknowledge and agree.</span>
                </label>
              </div>

              {/* Decl 3 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-left">
                <p className="font-bold text-[#0B1A30]">3. Limitation of Liability</p>
                <p className="text-slate-600 leading-relaxed font-light">
                  The Cricket Advisor, its directors and employees shall not be liable for financial loss, application refusal, delays, or governing body decisions.
                </p>
                <label className="flex items-center space-x-2 pt-1 font-bold text-navy-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eligibilityForm.acceptedDeclaration3}
                    onChange={(e) => handleEligibilityChange('acceptedDeclaration3', e.target.checked)}
                    className="h-4 w-4 text-gold-600 rounded border-slate-350 focus:ring-gold-500"
                  />
                  <span>I acknowledge and agree.</span>
                </label>
              </div>

              {/* Decl 4 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-left">
                <p className="font-bold text-[#0B1A30]">4. Accuracy of Information</p>
                <p className="text-slate-600 leading-relaxed font-light">
                  I certify that every detail provided in this form is true, accurate and complete.
                </p>
                <label className="flex items-center space-x-2 pt-1 font-bold text-navy-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eligibilityForm.acceptedDeclaration4}
                    onChange={(e) => handleEligibilityChange('acceptedDeclaration4', e.target.checked)}
                    className="h-4 w-4 text-gold-600 rounded border-slate-350 focus:ring-gold-500"
                  />
                  <span>I certify this information is accurate.</span>
                </label>
              </div>

              {/* Decl 5 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-left">
                <p className="font-bold text-[#0B1A30]">5. Non-Refundable Fees</p>
                <p className="text-slate-600 leading-relaxed font-light">
                  I understand the assessment fee is strictly non-refundable, regardless of eligibility outcome.
                </p>
                <label className="flex items-center space-x-2 pt-1 font-bold text-navy-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eligibilityForm.acceptedDeclaration5}
                    onChange={(e) => handleEligibilityChange('acceptedDeclaration5', e.target.checked)}
                    className="h-4 w-4 text-gold-600 rounded border-slate-350 focus:ring-gold-500"
                  />
                  <span>I acknowledge and agree.</span>
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-slate-200 flex space-x-3 bg-slate-50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => {
                  setShowLegalModal(false);
                }}
                className="flex-1 py-3 border border-slate-300 rounded-xl font-bold text-xs hover:bg-slate-100 transition uppercase tracking-wider text-slate-700 bg-white cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="button"
                disabled={
                  !eligibilityForm.acceptedDeclaration1 ||
                  !eligibilityForm.acceptedDeclaration2 ||
                  !eligibilityForm.acceptedDeclaration3 ||
                  !eligibilityForm.acceptedDeclaration4 ||
                  !eligibilityForm.acceptedDeclaration5
                }
                onClick={() => {
                  setShowLegalModal(false);
                  setEligibilityStep(17); // Proceed to payment page
                }}
                className="flex-1 py-3 bg-gold-gradient text-navy-950 font-bold rounded-xl text-xs uppercase tracking-wider transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
              >
                Proceed to Payment
              </button>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'cricket-cv' && renderCricketCvWorkspace()}

      {activeTab === 'cricket-assessment' && renderSkillsAssessmentWorkspace()}

      {activeTab === 'book' && (
          <div className="py-12 bg-slate-50 min-h-[85vh]">
            <div className="max-w-4xl mx-auto px-4">
              
              {/* Back Button & Currency Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <button 
                  onClick={() => { setActiveTab('main'); setBookingStep(1); setSelectedPackage(null); }}
                  className="flex items-center space-x-2 text-slate-600 hover:text-gold-600 font-semibold text-sm transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Homepage</span>
                </button>

                {/* Currency Selector */}
                <div className="flex items-center space-x-2 bg-white shadow-sm border border-slate-200 rounded-xl px-4 py-2 self-start sm:self-auto">
                  <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Select your currency:</span>
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    className="bg-transparent text-navy-950 text-xs font-bold focus:outline-none cursor-pointer border-0 p-0"
                    title="Select your currency"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="AUD">AUD (A$)</option>
                    <option value="NZD">NZD (NZ$)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 grid grid-cols-1 lg:grid-cols-12">
                
                {/* Left booking visual info banner (4 cols) */}
                <div className="lg:col-span-4 bg-navy-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-grid-white"></div>
                  <div className="relative z-10 space-y-6">
                    <span className="text-gold-500 text-[10px] font-bold uppercase tracking-widest block">Premium Booking Portal</span>
                    
                    {selectedPackage ? (
                      <div className="space-y-4">
                        <span className="text-[11px] font-semibold bg-white/15 px-2 py-1 rounded">Selected Service</span>
                        <h3 className="text-xl font-bold font-display leading-tight">{selectedPackage.title}</h3>
                        <div className="flex items-center space-x-2 text-gold-400 text-sm font-semibold">
                          <Clock className="h-4 w-4" />
                          <span>{selectedPackage.duration} Session</span>
                        </div>
                        <div className="text-2xl font-extrabold text-white font-display border-t border-white/10 pt-4">
                          {formatPrice(selectedPackage.price)} <span className="text-xs text-slate-400 font-light">{currency}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold font-display leading-tight">One-on-One Consultations</h3>
                        <p className="text-slate-300 text-xs font-light leading-relaxed">
                          Secure direct consulting times with an expert cricket administrator, advisor and player placement expert.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 text-xs text-slate-400 pt-12 space-y-3">
                    <p className="flex items-center space-x-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> <span>Secure Checkout Gateway</span></p>
                    <p className="flex items-center space-x-2"><Calendar className="h-4 w-4 text-emerald-500" /> <span>Auto Google Cal Sync</span></p>
                    <p className="flex items-center space-x-2"><Globe className="h-4 w-4 text-emerald-500" /> <span>Automated Zoom Links</span></p>
                  </div>
                </div>

                {/* Right interactive booking form steps (8 cols) */}
                <div className="lg:col-span-8 p-6 sm:p-10">
                  
                  {/* Progress Indicator */}
                  {bookingStep < 4 && (
                    <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                      <span className={`text-[11px] uppercase font-bold tracking-wider ${bookingStep === 1 ? 'text-gold-600 font-extrabold border-b-2 border-gold-500 pb-1' : 'text-slate-400'}`}>1. Select Package</span>
                      <span className={`text-[11px] uppercase font-bold tracking-wider ${bookingStep === 2 ? 'text-gold-600 font-extrabold border-b-2 border-gold-500 pb-1' : 'text-slate-400'}`}>2. Date & Time</span>
                      <span className={`text-[11px] uppercase font-bold tracking-wider ${bookingStep === 3 ? 'text-gold-600 font-extrabold border-b-2 border-gold-500 pb-1' : 'text-slate-400'}`}>3. Fill Details & Pay</span>
                    </div>
                  )}

                  {/* STEP 1: SELECT PACKAGE */}
                  {bookingStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-navy-900 font-display">Select Consultation Category</h3>
                      
                      <div className="space-y-3">
                        {packages.map((pkg) => (
                          <div 
                            key={pkg.id} 
                            onClick={() => { setSelectedPackage(pkg); setBookingStep(2); }}
                            className={`p-4 rounded-xl border-2 text-left cursor-pointer transition flex items-center justify-between group ${selectedPackage?.id === pkg.id ? 'border-gold-500 bg-gold-500/5' : 'border-slate-200 hover:border-slate-300'}`}
                          >
                            <div className="space-y-1">
                              <h4 className="font-bold font-display text-navy-900 text-sm sm:text-base group-hover:text-gold-600 transition">{pkg.title}</h4>
                              <p className="text-slate-500 text-xs leading-relaxed max-w-lg font-light">{pkg.description}</p>
                              <div className="flex items-center space-x-3 pt-1 text-[11px] text-slate-400">
                                <span className="flex items-center space-x-1"><Clock className="h-3 w-3" /> <span>{pkg.duration}</span></span>
                              </div>
                            </div>
                            <div className="text-right pl-4 flex flex-col items-end">
                              <span className="text-lg font-extrabold text-navy-900 font-display block">{formatPrice(pkg.price)}</span>
                              <span className="mt-1 px-3 py-1.5 bg-orange-600 group-hover:bg-orange-700 text-white text-[10px] font-bold rounded uppercase tracking-wider shadow transition block">Book Now</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: CHOOSE DATE & TIME */}
                  {bookingStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-navy-900 font-display">Choose Available Date & Time Slot</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Date selection */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Select Date</label>
                          <input 
                            type="date" 
                            required
                            min={getTodayISTDateString()}
                            max="2026-12-31"
                            value={bookingDate}
                            onChange={(e) => {
                              if (blockedDates.includes(e.target.value)) {
                                alert('This date has been blocked by the admin. Please select another date.');
                                setBookingDate('');
                              } else {
                                setBookingDate(e.target.value);
                              }
                            }}
                            className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-gold-500"
                          />
                          {bookingDate && blockedDates.includes(bookingDate) && (
                            <p className="text-red-500 text-xs mt-1 flex items-center space-x-1"><AlertCircle className="h-3.5 w-3.5" /> <span>Date is blocked by Consultant.</span></p>
                          )}
                          <p className="text-[11px] text-slate-400 mt-2">Days are synchronized with local timezone settings.</p>
                        </div>

                        {/* Timeslot Selection */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Select Time Slot (IST)</label>
                          <div className="grid grid-cols-1 gap-2">
                            {defaultTimeSlots.map((slot) => {
                              const isSlotBlocked = bookingDate && blockedSlots.includes(`${bookingDate}|${slot}`);
                              const isAlreadyBooked = bookingDate && (
                                bookedSlots.some(s => s.date === bookingDate && s.timeSlot === slot) ||
                                bookings.some(b => b.date === bookingDate && b.timeSlot === slot && b.bookingStatus !== 'Cancelled')
                              );
                              const isPastSlot = bookingDate && isSlotPastInIST(slot, bookingDate);
                              const isUnavailable = isSlotBlocked || isAlreadyBooked || isPastSlot;

                              return (
                                <button 
                                  key={slot}
                                  type="button"
                                  disabled={isUnavailable}
                                  onClick={() => setBookingTimeSlot(slot)}
                                  className={`px-4 py-2.5 text-xs text-left rounded-lg font-medium border-2 transition flex justify-between items-center ${
                                    isUnavailable
                                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-70'
                                      : bookingTimeSlot === slot 
                                      ? 'border-gold-500 bg-gold-500/10 text-navy-950 font-bold' 
                                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                  }`}
                                >
                                  <span>{slot}</span>
                                  {isAlreadyBooked && <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Already Booked</span>}
                                  {isSlotBlocked && <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">Blocked by Consultant</span>}
                                  {isPastSlot && <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded font-bold">Time Slot Passed</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Navigation buttons */}
                      <div className="pt-6 border-t border-slate-100 flex justify-between">
                        <button 
                          onClick={() => setBookingStep(1)}
                          className="px-4 py-2.5 border border-slate-300 rounded text-slate-700 font-semibold text-xs uppercase tracking-wider"
                        >
                          Previous Step
                        </button>
                        <button 
                          onClick={() => {
                            if (!bookingDate || !bookingTimeSlot) {
                              alert('Please choose an available date and time slot before proceeding.');
                              return;
                            }
                            setBookingStep(3);
                          }}
                          disabled={!bookingDate || !bookingTimeSlot}
                          className="px-6 py-2.5 bg-navy-800 disabled:opacity-50 text-white font-bold rounded text-xs uppercase tracking-wider border border-navy-700"
                        >
                          Next: Your Details
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: FILL DETAILS & PAY */}
                  {bookingStep === 3 && (
                    <div className="space-y-6 relative">
                      {!hasAcceptedTermsPopup && (
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-6 space-y-4 rounded-2xl min-h-[450px]">
                          <Lock className="h-10 w-10 text-gold-600 animate-pulse" />
                          <h4 className="font-extrabold text-navy-900 text-sm uppercase tracking-wider font-display">Checkout Form Locked</h4>
                          <p className="text-slate-500 text-xs max-w-sm font-light">
                            Please review and accept our mandatory booking Terms & Conditions and Refund Policy to unlock the checkout form.
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowTermsModal(true)}
                            className="px-6 py-3 bg-gold-gradient hover:scale-105 transform text-navy-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer"
                          >
                            Read & Accept Terms
                          </button>
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-navy-900 font-display">Client Details & Payment</h3>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Full Name *</label>
                            <input 
                              type="text" 
                              required
                              value={bookingForm.fullName}
                              onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-slate-250 rounded text-sm focus:outline-none focus:border-gold-500"
                              placeholder="Karan Patel"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email Address *</label>
                            <input 
                              type="email" 
                              required
                              value={bookingForm.email}
                              onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-slate-250 rounded text-sm focus:outline-none focus:border-gold-500"
                              placeholder="karan@gmail.com"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">WhatsApp Number *</label>
                            <div className="flex space-x-1.5 min-w-0">
                              <select 
                                value={whatsAppCountryCode}
                                onChange={(e) => {
                                  const code = e.target.value;
                                  setWhatsAppCountryCode(code);
                                  setBookingForm({ ...bookingForm, whatsApp: `${code} ${whatsAppMobileNumber}` });
                                }}
                                className="px-1 py-2.5 bg-white border border-slate-250 rounded text-xs focus:outline-none focus:border-gold-500 w-20 cursor-pointer flex-shrink-0"
                              >
                                <option value="+91">+91 (IN)</option>
                                <option value="+44">+44 (UK)</option>
                                <option value="+61">+61 (AU)</option>
                                <option value="+971">+971 (AE)</option>
                                <option value="+1">+1 (US/CA)</option>
                                <option value="+27">+27 (ZA)</option>
                                <option value="+64">+64 (NZ)</option>
                                <option value="+94">+94 (LK)</option>
                                <option value="+880">+880 (BD)</option>
                                <option value="+92">+92 (PK)</option>
                                <option value="+968">+968 (OM)</option>
                              </select>
                              <input 
                                type="tel" 
                                required
                                value={whatsAppMobileNumber}
                                onChange={(e) => {
                                  const num = e.target.value.replace(/[^0-9]/g, '');
                                  setWhatsAppMobileNumber(num);
                                  setBookingForm({ ...bookingForm, whatsApp: `${whatsAppCountryCode} ${num}` });
                                }}
                                className="flex-1 min-w-0 px-3 py-2.5 bg-white border border-slate-250 rounded text-sm focus:outline-none focus:border-gold-500"
                                placeholder="98900 XXXXX"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Country of Residence *</label>
                            <input 
                              type="text" 
                              required
                              value={bookingForm.country}
                              onChange={(e) => setBookingForm({ ...bookingForm, country: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-slate-250 rounded text-sm focus:outline-none focus:border-gold-500"
                              placeholder="India, UAE, UK, Oman, etc."
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Select Role *</label>
                            <select 
                              value={bookingForm.playingLevel}
                              onChange={(e) => setBookingForm({ ...bookingForm, playingLevel: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-slate-250 rounded text-sm focus:outline-none focus:border-gold-500 cursor-pointer"
                            >
                              <option>Player</option>
                              <option>Parents</option>
                              <option>Coach</option>
                              <option>Club Representative</option>
                              <option>League Representative</option>
                              <option>T20 Franchise Representative</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Purpose of Session *</label>
                            <select 
                              required
                              value={bookingForm.purpose}
                              onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                              className="w-full px-4 py-2.5 bg-white border border-slate-250 rounded text-sm focus:outline-none focus:border-gold-500 cursor-pointer"
                            >
                              <option value="">Select Service / Purpose</option>
                              <option>Overseas Cricket Career Consultation</option>
                              <option>Cricket Career Guidance</option>
                              <option>Player/Franchise Social Media Handling</option>
                              <option>Cricket Club Consultation</option>
                              <option>Cricket Operations Consultation</option>
                              <option>Cricket Tour Planning</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Payment Gateway Select */}
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5">
                        <div>
                          <h4 className="text-sm font-bold font-display text-navy-900 uppercase tracking-wider text-center">Payment Method</h4>
                          <p className="text-xs text-slate-500 mt-0.5 text-center">Payments are securely processed via Razorpay.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 max-w-xs mx-auto gap-2.5">
                          {[
                            { id: 'razorpay', name: 'Razorpay Secure Checkout', icon: ShieldCheck }
                          ].map((gw) => {
                            const GwIcon = gw.icon;
                            return (
                              <button 
                                key={gw.id}
                                type="button"
                                onClick={() => {
                                  setSelectedPaymentGateway(gw.id);
                                  setPaymentFormError('');
                                }}
                                className={`p-3.5 text-xs font-bold rounded-xl border-2 text-center transition flex flex-col items-center justify-center space-y-1.5 cursor-pointer ${selectedPaymentGateway === gw.id ? 'border-gold-500 bg-gold-500/10 text-navy-950 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'}`}
                              >
                                <GwIcon className={`h-6 w-6 ${selectedPaymentGateway === gw.id ? 'text-gold-600' : 'text-slate-400'}`} />
                                <span className="uppercase text-[10px] tracking-wider font-extrabold">{gw.name}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Interactive Payment Fields Based on Selected Gateway */}
                        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                          
                          {/* 3. RAZORPAY GATEWAY PANEL */}
                          {selectedPaymentGateway === 'razorpay' && (
                            <div className="space-y-3 animate-fade-in">
                              <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                                <div className="flex items-center space-x-2">
                                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                                  <span className="font-bold text-navy-900 text-xs uppercase tracking-wider">Razorpay Secure Checkout</span>
                                </div>
                                <span className="text-[10px] bg-blue-50 text-blue-800 font-extrabold px-2 py-0.5 rounded border border-blue-200 uppercase">Verified Gateway</span>
                              </div>

                              <p className="text-xs text-slate-600 leading-relaxed text-center">
                                You will be redirected to the secure Razorpay payment gateway overlay to complete your transaction using Cards, UPI, Netbanking, or Wallets.
                              </p>
                            </div>
                          )}

                          {/* Error Callout if fields missing */}
                          {paymentFormError && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold flex items-center space-x-2 animate-bounce">
                              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                              <span>{paymentFormError}</span>
                            </div>
                          )}

                          <div className="pt-2 text-[11px] text-slate-500 flex items-center space-x-1.5 border-t border-slate-150">
                            <Lock className="h-3.5 w-3.5 text-slate-400" />
                            <span>100% Encrypted Payment &bull; Instant Zoom Link & Receipt Generation upon authorization.</span>
                          </div>
                        </div>
                      </div>

                      {/* Collapsible Refund Policy in Checkout Form */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm mt-4">
                        <button 
                          type="button"
                          onClick={() => setIsCheckoutRefundPolicyOpen(!isCheckoutRefundPolicyOpen)}
                          className="w-full flex items-center justify-between py-3 px-4 text-left hover:bg-slate-50 transition cursor-pointer font-medium"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gold-600" />
                            <span className="font-bold text-navy-900 text-xs uppercase tracking-wider">View Refund Policy & Disclaimers</span>
                          </div>
                          {isCheckoutRefundPolicyOpen ? (
                            <ChevronUp className="h-4 w-4 text-slate-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-500" />
                          )}
                        </button>
                        {isCheckoutRefundPolicyOpen && (
                          <div className="p-4 border-t border-slate-150 bg-slate-50/50 max-h-[250px] overflow-y-auto text-xs font-light leading-relaxed">
                            <RefundPolicyContent />
                          </div>
                        )}
                      </div>

                      {/* Checkout actions */}
                      <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                        <button 
                          onClick={() => setBookingStep(2)}
                          className="px-4 py-2.5 border border-slate-300 rounded text-slate-700 font-semibold text-xs uppercase tracking-wider hover:bg-slate-50 transition cursor-pointer"
                        >
                          Previous Step
                        </button>

                        <button 
                          onClick={handleInitiatePayment}
                          disabled={isProcessingPayment}
                          className="px-8 py-3.5 bg-gold-gradient text-navy-950 font-bold rounded shadow-lg hover:scale-105 transform transition uppercase tracking-wider text-xs border border-gold-400 flex items-center space-x-2 cursor-pointer"
                        >
                          {isProcessingPayment ? (
                            <>
                              <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin"></span>
                              <span>Authorizing Secure Gateway...</span>
                            </>
                          ) : (
                            <span>Process Payment & Confirm Booking ({selectedPackage && formatPrice(selectedPackage.price)})</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: SUCCESS CONFIRMATION */}
                  {bookingStep === 4 && confirmedBooking && (
                    <div className="text-center space-y-6 animate-fade-in py-6">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-50">
                        <Check className="h-8 w-8 stroke-[3]" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold font-display text-emerald-950 uppercase tracking-tight">Consultation Confirmed!</h3>
                        <p className="text-slate-500 text-sm">Transaction receipt and booking invitation have been sent via email.</p>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-w-lg mx-auto text-left text-xs space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                          <div>
                            <span className="text-slate-400 uppercase font-bold tracking-widest text-[9px] block">Booking Reference</span>
                            <span className="font-mono text-slate-800 font-bold text-sm">{confirmedBooking.id}</span>
                          </div>
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase rounded-full border border-emerald-300">
                            Payment Confirmed
                          </span>
                        </div>

                        <p><strong>Client Name:</strong> <span className="text-slate-800">{confirmedBooking.fullName} ({confirmedBooking.email})</span></p>
                        <p><strong>Date & Time Slot:</strong> <span className="text-slate-800 font-bold">{confirmedBooking.date} &ndash; {confirmedBooking.timeSlot}</span></p>
                        <p><strong>Consultation Type:</strong> <span className="text-slate-800">{confirmedBooking.packageName} ({formatPrice(confirmedBooking.price)})</span></p>
                        
                        {/* Zoom Meeting Card */}
                        <div className="bg-navy-900 text-white p-4 rounded-xl border border-gold-500/30 space-y-3 mt-4 shadow-md">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <p className="text-[10px] text-gold-400 uppercase tracking-widest font-bold flex items-center space-x-1.5">
                              <Video className="h-3.5 w-3.5 text-gold-400" />
                              <span>Zoom Meeting Details</span>
                            </p>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-semibold">Live Link Ready</span>
                          </div>

                          <p className="text-xs">
                            <strong>Meeting URL:</strong> 
                            <a href={confirmedBooking.zoomLink} target="_blank" rel="noopener noreferrer" className="text-gold-300 break-all underline block font-semibold hover:text-gold-200 mt-0.5">
                              {confirmedBooking.zoomLink}
                            </a>
                          </p>

                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
                            <p><strong>ID:</strong> <span className="text-slate-200">{confirmedBooking.meetingId}</span></p>
                            <p><strong>Passcode:</strong> <span className="text-slate-200">TCC2026</span></p>
                          </div>

                          <div className="pt-2 flex flex-wrap gap-2">
                            <button
                              onClick={() => handleCopyZoomLink(confirmedBooking.zoomLink)}
                              className="px-3 py-1.5 bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 text-[10px] font-bold rounded flex items-center space-x-1 border border-gold-500/40 transition cursor-pointer"
                            >
                              <Copy className="h-3 w-3" />
                              <span>{copiedLink ? 'Link Copied!' : 'Copy Zoom Link'}</span>
                            </button>
                            <a
                              href={confirmedBooking.zoomLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-gold-gradient text-navy-950 font-bold text-[10px] rounded flex items-center space-x-1 transition shadow hover:scale-105"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>Join Meeting</span>
                            </a>
                          </div>
                        </div>

                        {/* Calendar Integration, WhatsApp & Email Dispatch, & Invoice Actions */}
                        <div className="pt-3 border-t border-slate-200 space-y-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Send Details, Calendar & Official Invoice</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <a
                              href={generateWhatsAppUrl(confirmedBooking)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition cursor-pointer shadow-sm"
                            >
                              <MessageSquare className="h-4 w-4 fill-current" />
                              <span>Send via WhatsApp</span>
                            </a>

                            <a
                              href={generateEmailUrl(confirmedBooking)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition cursor-pointer shadow-sm"
                            >
                              <Mail className="h-4 w-4" />
                              <span>Email Zoom Link & Receipt</span>
                            </a>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <a
                              href={generateGoogleCalendarUrl(confirmedBooking)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-sm"
                            >
                              <Calendar className="h-3.5 w-3.5 text-blue-600" />
                              <span>Add to Google Calendar</span>
                            </a>

                            <button
                              onClick={() => downloadIcsFile(confirmedBooking)}
                              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-sm"
                            >
                              <Download className="h-3.5 w-3.5 text-orange-600" />
                              <span>Download .ICS Invite</span>
                            </button>
                          </div>

                          <button
                            onClick={() => setSelectedInvoiceBooking(confirmedBooking)}
                            className="w-full py-2.5 bg-navy-900 hover:bg-navy-950 text-gold-400 text-xs font-bold rounded-xl uppercase tracking-wider flex items-center justify-center space-x-2 transition border border-gold-500/30 cursor-pointer shadow-md mt-2"
                          >
                            <FileText className="h-4 w-4 text-gold-400" />
                            <span>View & Print Official Tax Invoice</span>
                          </button>
                        </div>
                      </div>

                      <div className="pt-4 space-y-3">
                        <button 
                          onClick={() => { setActiveTab('main'); setBookingStep(1); setSelectedPackage(null); }}
                          className="px-6 py-3 bg-navy-800 text-white text-xs font-bold uppercase tracking-wider rounded border border-navy-700"
                        >
                          Return to Homepage
                        </button>
                        <p className="text-[10px] text-slate-400 font-light">Need assistance? Email thecricketadvisor@gmail.com anytime.</p>
                      </div>

                    </div>
                  )}

                </div>

              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            3. ADMINISTRATIVE DASHBOARD TAB
           ========================================================================= */}
        {activeTab === 'admin' && (
          <div className="py-12 bg-slate-50 min-h-[90vh]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* Back to Home Button */}
              <button 
                onClick={() => setActiveTab('main')}
                className="flex items-center space-x-2 text-slate-600 hover:text-navy-900 font-semibold mb-6 text-sm transition"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back to Public Website</span>
              </button>

              {/* DASHBOARD AUTHENTICATION LOCK GATE */}
              {!isAdminLoggedIn ? (
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                  <div className="text-center space-y-3 mb-6">
                    <div className="p-3 bg-navy-50 text-navy-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                      <Lock className="h-6 w-6 text-gold-500" />
                    </div>
                    <h3 className="text-2xl font-bold font-display text-navy-900 uppercase">Consultant Portal</h3>
                    <p className="text-slate-500 text-xs">Verify credentials to manage schedules, prices, placements and bookings.</p>
                  </div>

                  {adminError && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded text-xs text-red-600 mb-4 flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{adminError}</span>
                    </div>
                  )}

                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Username</label>
                      <input 
                        type="text" 
                        required
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-250 rounded text-sm focus:outline-none focus:border-navy-500"
                        placeholder="admin"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Password</label>
                      <input 
                        type="password" 
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-250 rounded text-sm focus:outline-none focus:border-navy-500 no-capitalize"
                        placeholder="••••••••"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3 bg-navy-800 hover:bg-navy-900 text-white font-bold rounded uppercase tracking-wider text-xs transition border border-navy-700 shadow"
                    >
                      Enter Portal Dashboard
                    </button>

                    <div className="mt-6 pt-4 border-t border-slate-200 text-left space-y-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-navy-900 uppercase">
                        <CreditCard className="h-4 w-4 text-orange-600" />
                        <span>Manage Bank & UPI Settings Here</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Sign in to update your Bank Account Number, IFSC Code, and UPI ID displayed to clients during booking checkout.
                      </p>
                      <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-[11px] text-slate-700 space-y-1.5">
                        <div className="flex justify-between items-center font-bold text-slate-800">
                          <span>Consultant Login Credentials:</span>
                          <button 
                            type="button" 
                            onClick={() => { setAdminUsername('admin'); setAdminPassword(adminSettings.adminPassword || 'cricket2026'); }}
                            className="text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded font-bold hover:bg-orange-700 transition uppercase cursor-pointer"
                          >
                            Auto-Fill Login
                          </button>
                        </div>
                        <p className="font-mono text-slate-900">Username: <strong>admin</strong></p>
                        <p className="font-mono text-slate-900">Password: <strong>{adminSettings.adminPassword || 'cricket2026'}</strong></p>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                
                // MAIN ADMINISTRATIVE WORKSPACE
                <div className="space-y-8 animate-fade-in">
                  
                  {/* Dashboard Header Bar */}
                  <div className="bg-navy-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between border border-gold-500/20">
                    <div className="text-left mb-4 sm:mb-0 space-y-1">
                      <p className="text-xs text-gold-400 uppercase tracking-widest font-semibold">Administrative Access Granted</p>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">TCC Management Console</h2>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={handleExportCSV}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider rounded border border-slate-700 flex items-center space-x-2"
                        title="Export appointments schema to CSV format"
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                        <span>Export CSV Report</span>
                      </button>
                      <button 
                        onClick={handleAdminLogout}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white text-xs font-bold uppercase tracking-wider rounded border border-red-500/30"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>

                  {/* Sub-Nav Toolbar for Admin Dashboard Sections */}
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => setAdminSubTab('settings')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer ${adminSubTab === 'settings' ? 'bg-gold-500 text-navy-950 shadow-md font-extrabold' : 'bg-gold-55 text-gold-900 hover:bg-gold-100 border border-gold-200'}`}
                    >
                      <Video className="h-4 w-4 text-gold-600" />
                      <span>Zoom Email & Admin Config</span>
                    </button>
                    <button 
                      onClick={() => setAdminSubTab('bank')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition flex items-center space-x-2 cursor-pointer ${adminSubTab === 'bank' ? 'bg-orange-600 text-white shadow-md font-extrabold' : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'}`}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Bank Account & UPI Settings</span>
                    </button>
                    <button 
                      onClick={() => setAdminSubTab('bookings')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer ${adminSubTab === 'bookings' ? 'bg-navy-900 text-white shadow-md font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Bookings ({bookings.length})</span>
                    </button>
                    <button 
                      onClick={() => setAdminSubTab('assessments')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer ${adminSubTab === 'assessments' ? 'bg-navy-900 text-white shadow-md font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
                    >
                      <FileText className="h-4 w-4 text-gold-500" />
                      <span>Assessments ({assessments.length})</span>
                    </button>

                    <button 
                      onClick={() => setAdminSubTab('skills-assessments')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer ${adminSubTab === 'skills-assessments' ? 'bg-navy-900 text-white shadow-md font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
                    >
                      <Award className="h-4 w-4 text-gold-500" />
                      <span>Skills Assessments ({skillsList.length})</span>
                    </button>
                    <button 
                      onClick={() => setAdminSubTab('prices')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer ${adminSubTab === 'prices' ? 'bg-navy-900 text-white shadow-md font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
                    >
                      <DollarSign className="h-4 w-4" />
                      <span>Rates & Pricing</span>
                    </button>
                    <button 
                      onClick={() => setAdminSubTab('dates')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer ${adminSubTab === 'dates' ? 'bg-navy-900 text-white shadow-md font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
                    >
                      <Clock className="h-4 w-4" />
                      <span>Calendar Block</span>
                    </button>
                    <button 
                      onClick={() => setAdminSubTab('calendar')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer ${adminSubTab === 'calendar' ? 'bg-navy-900 text-white shadow-md font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
                    >
                      <Calendar className="h-4 w-4 text-gold-500" />
                      <span>Calendar & Zoom Sync</span>
                    </button>
                    <button 
                      onClick={() => setAdminSubTab('players')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer ${adminSubTab === 'players' ? 'bg-navy-900 text-white shadow-md font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
                    >
                      <Users className="h-4 w-4" />
                      <span>Player Roster ({players.length})</span>
                    </button>
                    <button 
                      onClick={() => setAdminSubTab('cvs')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer ${adminSubTab === 'cvs' ? 'bg-navy-900 text-white shadow-md font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
                    >
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      <span>Cricket CVs ({cvUsersList.length} players / {cvList.length} CVs)</span>
                    </button>
                    <button 
                      onClick={() => setAdminSubTab('economics')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer ${adminSubTab === 'economics' ? 'bg-navy-900 text-white shadow-md font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
                    >
                      <DollarSign className="h-4 w-4 text-amber-500" />
                      <span>Financial Performance</span>
                    </button>
                    <button 
                      onClick={() => setAdminSubTab('all')}
                      className={`px-4 py-2 text-xs font-bold rounded-lg uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer ${adminSubTab === 'all' ? 'bg-navy-900 text-white shadow-md font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
                    >
                      <span>View All Overview</span>
                    </button>
                  </div>

                  {/* Dedicated Calendar & Zoom Management View */}
                  {adminSubTab === 'calendar' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-navy-100 p-6 sm:p-8 space-y-6 animate-fade-in">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-150 pb-4 gap-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-6 w-6 text-gold-500" />
                            <h3 className="text-xl font-bold font-display text-navy-900 uppercase">Calendar Sync, Zoom Meetings & Invoicing</h3>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Manage scheduled video consultations, sync with Google/Outlook calendar feeds, and issue official tax receipts.
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 self-start sm:self-auto">
                          <button
                            onClick={() => {
                              if (bookings.length > 0) {
                                downloadIcsFile(bookings[0]);
                              } else {
                                alert('No scheduled bookings available to export.');
                              }
                            }}
                            className="px-4 py-2 bg-navy-900 hover:bg-navy-950 text-gold-400 font-bold text-xs rounded-lg uppercase tracking-wider transition shadow flex items-center space-x-2 border border-gold-500/30 cursor-pointer"
                          >
                            <Download className="h-4 w-4 text-gold-400" />
                            <span>Export Calendar Feed (.ICS)</span>
                          </button>
                        </div>
                      </div>

                      {/* Explanation Banner: How Calendar Management Works */}
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1 bg-white p-4 rounded-xl border border-slate-200">
                          <div className="flex items-center space-x-2 text-navy-900 font-bold">
                            <Video className="h-4 w-4 text-emerald-600" />
                            <span>1. Automated Zoom Rooms</span>
                          </div>
                          <p className="text-slate-500 leading-relaxed">
                            Upon payment completion, a unique Zoom meeting URL, Meeting ID, and passcode are generated automatically for each client.
                          </p>
                        </div>

                        <div className="space-y-1 bg-white p-4 rounded-xl border border-slate-200">
                          <div className="flex items-center space-x-2 text-navy-900 font-bold">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span>2. 2-Way Calendar Invites</span>
                          </div>
                          <p className="text-slate-500 leading-relaxed">
                            Clients receive instant Google Calendar template links and downloadable <code>.ics</code> calendar files that work seamlessly with Apple Calendar and Outlook.
                          </p>
                        </div>

                        <div className="space-y-1 bg-white p-4 rounded-xl border border-slate-200">
                          <div className="flex items-center space-x-2 text-navy-900 font-bold">
                            <FileText className="h-4 w-4 text-gold-600" />
                            <span>3. Automated GST Invoicing</span>
                          </div>
                          <p className="text-slate-500 leading-relaxed">
                            Official itemized GST tax invoices are automatically created with unique invoice numbers, SAC service codes, and printable receipts.
                          </p>
                        </div>
                      </div>

                      {/* Consultation Appointments Calendar Agenda */}
                      <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                          <h4 className="font-bold font-display text-navy-900 uppercase text-sm">Scheduled Video Appointments Agenda</h4>
                          <span className="text-xs text-slate-500 font-medium">Total Appointments: {bookings.length}</span>
                        </div>

                        {bookings.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                            No scheduled video consultations found.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {bookings.map((booking) => (
                              <div key={booking.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 hover:border-slate-300 transition">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                  <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-navy-900 text-gold-400 rounded-lg font-bold font-mono text-xs">
                                      {booking.id}
                                    </div>
                                    <div>
                                      <h5 className="font-bold text-navy-900 text-sm flex items-center space-x-2">
                                        <span>{booking.fullName}</span>
                                        <button
                                          onClick={() => setEditingBooking(booking)}
                                          className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-1.5 py-0.5 rounded font-bold transition flex items-center space-x-1 cursor-pointer"
                                          title="Update Client Email or WhatsApp"
                                        >
                                          <Edit2 className="h-2.5 w-2.5" />
                                          <span>Edit Email/WhatsApp</span>
                                        </button>
                                      </h5>
                                      <p className="text-slate-500 text-xs">
                                        <strong>Email:</strong> {booking.email} | <strong>WhatsApp:</strong> <span className="font-mono text-emerald-800 font-bold">{booking.whatsApp}</span>
                                      </p>
                                      <p className="text-slate-500 text-xs mt-0.5">{booking.packageName} &bull; <strong className="text-slate-800">{booking.date} @ {booking.timeSlot}</strong></p>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded-full border border-emerald-300">
                                      {booking.bookingStatus}
                                    </span>
                                    <span className="text-xs font-bold text-navy-900 font-mono">₹{booking.price}</span>
                                  </div>
                                </div>

                                <div className="bg-navy-900 text-white p-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                                  <div className="truncate max-w-md">
                                    <span className="text-gold-400 font-bold mr-2">Zoom Meeting:</span>
                                    <a href={booking.zoomLink} target="_blank" rel="noopener noreferrer" className="text-gold-300 underline font-semibold">{booking.zoomLink}</a>
                                  </div>
                                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                                    <button
                                      onClick={() => handleCopyZoomLink(booking.zoomLink)}
                                      className="px-2.5 py-1 bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 text-[10px] font-bold rounded flex items-center space-x-1 border border-gold-500/30 cursor-pointer"
                                    >
                                      <Copy className="h-3 w-3" />
                                      <span>Copy Link</span>
                                    </button>
                                    <a
                                      href={booking.zoomLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1 bg-gold-gradient text-navy-950 text-[10px] font-bold rounded flex items-center space-x-1 cursor-pointer"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      <span>Start Meeting</span>
                                    </a>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200 gap-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <a
                                      href={generateWhatsAppUrl(booking)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded flex items-center space-x-1 cursor-pointer shadow-sm"
                                      title="Send Zoom Link & Details directly to Client's WhatsApp"
                                    >
                                      <MessageSquare className="h-3 w-3 fill-current" />
                                      <span>Send via WhatsApp</span>
                                    </a>

                                    <a
                                      href={generateEmailUrl(booking)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded flex items-center space-x-1 cursor-pointer shadow-sm"
                                      title="Send Email with Zoom Link & Invoice"
                                    >
                                      <Mail className="h-3 w-3" />
                                      <span>Email Zoom Link</span>
                                    </a>

                                    <a
                                      href={generateGoogleCalendarUrl(booking)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold rounded border border-slate-300 flex items-center space-x-1 cursor-pointer"
                                    >
                                      <Calendar className="h-3 w-3 text-blue-600" />
                                      <span>Google Cal</span>
                                    </a>

                                    <button
                                      onClick={() => downloadIcsFile(booking)}
                                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold rounded border border-slate-300 flex items-center space-x-1 cursor-pointer"
                                    >
                                      <Download className="h-3 w-3 text-orange-600" />
                                      <span>.ICS</span>
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => setSelectedInvoiceBooking(booking)}
                                    className="px-3 py-1 bg-navy-900 hover:bg-navy-950 text-gold-400 font-bold text-xs rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
                                  >
                                    <FileText className="h-3.5 w-3.5 text-gold-400" />
                                    <span>View / Print Invoice</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dedicated Consultation Bookings & Direct WhatsApp Dispatch View */}
                  {adminSubTab === 'bookings' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-navy-100 p-6 sm:p-8 space-y-6 animate-fade-in">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-150 pb-4 gap-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-6 w-6 text-emerald-600" />
                            <h3 className="text-xl font-bold font-display text-navy-900 uppercase">Consultation Bookings & WhatsApp Dispatch</h3>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Click <strong>"Send via WhatsApp"</strong> on any client booking to open WhatsApp with pre-filled Zoom meeting link, ID, and passcode.
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-300">
                            {bookings.length} Bookings Registered
                          </span>
                        </div>
                      </div>

                      {bookings.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                          No active consultation bookings registered.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {bookings.map((booking) => (
                            <div key={booking.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3 hover:border-slate-300 transition">
                              <div className="flex justify-between items-start flex-wrap gap-2">
                                <div>
                                  <span className="font-mono text-slate-400 font-bold block">{booking.id}</span>
                                  <h4 className="font-bold text-sm text-navy-900 flex items-center space-x-2">
                                    <span>{booking.fullName}</span>
                                    <button
                                      onClick={() => setEditingBooking(booking)}
                                      className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-0.5 rounded font-bold transition flex items-center space-x-1 cursor-pointer"
                                      title="Update Client Email or WhatsApp"
                                    >
                                      <Edit2 className="h-2.5 w-2.5" />
                                      <span>Edit Email/WhatsApp</span>
                                    </button>
                                  </h4>
                                  <p className="text-slate-500 mt-0.5">
                                    <strong>Email:</strong> {booking.email} | <strong>WhatsApp:</strong> <span className="font-mono text-emerald-800 font-bold">{booking.whatsApp}</span>
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="px-2.5 py-1 font-semibold rounded-full uppercase tracking-wider text-[10px] block border text-center" 
                                    style={{
                                      borderColor: booking.bookingStatus === 'Approved' ? '#10b981' : booking.bookingStatus === 'Cancelled' ? '#ef4444' : '#f59e0b',
                                      color: booking.bookingStatus === 'Approved' ? '#047857' : booking.bookingStatus === 'Cancelled' ? '#b91c1c' : '#b45309',
                                      backgroundColor: booking.bookingStatus === 'Approved' ? '#f0fdf4' : booking.bookingStatus === 'Cancelled' ? '#fef2f2' : '#fffbeb'
                                    }}
                                  >
                                    {booking.bookingStatus}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block mt-1">Paid via {booking.paymentMethod}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-slate-200/60 pt-3 text-slate-600">
                                <p><strong>Package:</strong> {booking.packageName}</p>
                                <p><strong>Price:</strong> {formatPrice(booking.price)}</p>
                                <p><strong>Scheduled Slot:</strong> {booking.date} @ {booking.timeSlot}</p>
                                <p><strong>Playing level:</strong> {booking.playingLevel}</p>
                              </div>

                              <div className="bg-navy-900 text-white p-3 rounded-lg flex items-center justify-between text-[11px]">
                                <p className="truncate mr-3"><strong>Zoom Link:</strong> <a href={booking.zoomLink} target="_blank" rel="noopener noreferrer" className="text-gold-300 hover:underline">{booking.zoomLink}</a></p>
                                <span className="font-mono text-slate-400">ID: {booking.meetingId}</span>
                              </div>

                              {/* DIRECT DISPATCH BUTTONS */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                                <div className="flex flex-wrap items-center gap-2">
                                  <a
                                    href={generateWhatsAppUrl(booking)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer shadow transition"
                                    title="Send Zoom Link & Consultation Details directly to Client's WhatsApp"
                                  >
                                    <MessageSquare className="h-4 w-4 fill-current text-white" />
                                    <span>Send via WhatsApp</span>
                                  </a>

                                  <a
                                    href={generateEmailUrl(booking)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer shadow transition"
                                    title="Send Email with Zoom Link & Invoice"
                                  >
                                    <Mail className="h-4 w-4" />
                                    <span>Send via Email</span>
                                  </a>

                                  <button
                                    onClick={() => setSelectedInvoiceBooking(booking)}
                                    className="px-3 py-1.5 bg-navy-900 hover:bg-navy-950 text-gold-400 text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer"
                                  >
                                    <FileText className="h-4 w-4 text-gold-400" />
                                    <span>View Invoice</span>
                                  </button>
                                </div>

                                <div className="flex items-center space-x-2">
                                  {booking.bookingStatus !== 'Approved' && (
                                    <button 
                                      onClick={() => handleUpdateBookingStatus(booking.id, 'Approved')}
                                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase tracking-wider rounded font-bold transition"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {booking.bookingStatus !== 'Cancelled' && (
                                    <button 
                                      onClick={() => handleUpdateBookingStatus(booking.id, 'Cancelled')}
                                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase tracking-wider rounded font-bold transition"
                                    >
                                      Cancel Booking
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dedicated Skills Assessments View */}
                  {adminSubTab === 'skills-assessments' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-navy-100 p-6 sm:p-8 space-y-6 animate-fade-in font-sans">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-150 pb-4 gap-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Award className="h-6 w-6 text-gold-500" />
                            <h3 className="text-xl font-bold font-display text-navy-900 uppercase">Skills Assessments</h3>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            All submitted Skills Certification Assessments from candidates.
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 bg-gold-100 text-gold-800 text-xs font-bold rounded-full border border-gold-300">
                            {skillsList.length} Skills Assessments Received
                          </span>
                        </div>
                      </div>

                      {skillsList.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                          <p className="text-xs">No skills assessments submitted yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {skillsList.map((skillAss) => (
                            <div key={skillAss.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs hover:border-slate-300 transition">
                              <div className="flex justify-between items-start flex-wrap gap-3">
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-mono text-[10px] text-slate-400 font-bold">{skillAss.id}</span>
                                    <span
                                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border border-emerald-300 text-emerald-700 bg-emerald-50"
                                    >
                                      ✓ Paid & Confirmed
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-bold">
                                      {skillAss.testMode} Test
                                    </span>
                                  </div>
                                  <h4 className="font-bold text-sm text-navy-900">
                                    {skillAss.firstName} {skillAss.lastName}
                                  </h4>
                                  <p className="text-slate-500">
                                    <strong>Age:</strong> {skillAss.age} ({skillAss.isAbove18 === 'Yes' ? '18+' : `Minor, Relation: ${skillAss.applicantRelation}`})
                                  </p>
                                  <p className="text-slate-500">
                                    <strong>Email:</strong> {skillAss.email} | <strong>Mobile:</strong> <span className="font-mono">{skillAss.mobileCountryCode} {skillAss.mobileNumber}</span>
                                  </p>
                                  <p className="text-slate-500">
                                    <strong>Nationality:</strong> {skillAss.nationality} | <strong>Residence:</strong> {skillAss.countryOfResidence}
                                  </p>
                                  <p className="text-slate-500">
                                    <strong>Role:</strong> {skillAss.playingRole} | <strong>Specialty:</strong> <span className="text-[#0B1A30] font-semibold">{skillAss.subRole}</span>
                                  </p>
                                  {skillAss.submittedAt && (
                                    <p className="text-slate-400 text-[10px]">
                                      Submitted: {skillAss.submittedAt}
                                    </p>
                                  )}
                                </div>
                                {skillAss.paymentDetails && (
                                  <div className="flex flex-col items-end gap-1">
                                    <span className="font-bold text-navy-900 font-display text-sm">₹{skillAss.paymentDetails.amount?.toLocaleString('en-IN') || (skillAss.testMode === 'Online' ? 11999 : 17999)}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">Tx ID: {skillAss.paymentDetails.transactionId}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dedicated Assessments View */}
                  {adminSubTab === 'assessments' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-navy-100 p-6 sm:p-8 space-y-6 animate-fade-in">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-150 pb-4 gap-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-6 w-6 text-gold-500" />
                            <h3 className="text-xl font-bold font-display text-navy-900 uppercase">Eligibility Assessments</h3>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            All submitted eligibility assessments from players. Click <strong>"View Details"</strong> on any row to see the full cricket background.
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 bg-gold-100 text-gold-800 text-xs font-bold rounded-full border border-gold-300">
                            {assessments.length} Assessments Received
                          </span>
                          <button
                            onClick={async () => {
                              try {
                                const resp = await fetch(`/api/get-assessments?secret=${encodeURIComponent(adminPassword)}&refresh=true`);
                                if (resp.ok) {
                                  const fresh = await resp.json();
                                  setAssessments(fresh);
                                }
                              } catch (e) { console.error('Refresh failed', e); }
                            }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center space-x-1 transition cursor-pointer"
                            title="Re-fetch latest assessments from the cloud database"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            <span>Refresh from Cloud</span>
                          </button>
                        </div>
                      </div>

                      {assessments.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                          <p className="text-xs">No eligibility assessments submitted yet.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {assessments.map((assessment) => (
                            <div key={assessment.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs hover:border-slate-300 transition">
                              <div className="flex justify-between items-start flex-wrap gap-3">
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-mono text-[10px] text-slate-400 font-bold">{assessment.referenceNumber || assessment.id}</span>
                                    <span
                                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border"
                                      style={{
                                        borderColor: assessment.paymentStatus?.toLowerCase() === 'paid' ? '#10b981' : assessment.paymentStatus?.toLowerCase() === 'failed' ? '#ef4444' : '#f59e0b',
                                        color: assessment.paymentStatus?.toLowerCase() === 'paid' ? '#047857' : assessment.paymentStatus?.toLowerCase() === 'failed' ? '#b91c1c' : '#92400e',
                                        backgroundColor: assessment.paymentStatus?.toLowerCase() === 'paid' ? '#f0fdf4' : assessment.paymentStatus?.toLowerCase() === 'failed' ? '#fef2f2' : '#fffbeb',
                                      }}
                                    >
                                      {assessment.paymentStatus?.toLowerCase() === 'paid' ? '✓ Payment Verified' : assessment.paymentStatus?.toLowerCase() === 'failed' ? '✗ Payment Failed' : '⏳ Pending'}
                                    </span>
                                  </div>
                                  <h4 className="font-bold text-sm text-navy-900">
                                    {assessment.firstName} {assessment.lastName}
                                  </h4>
                                  <p className="text-slate-500">
                                    <strong>Email:</strong> {assessment.email}
                                    {assessment.mobileNumber && (
                                      <> | <strong>Mobile:</strong> <span className="font-mono">{assessment.mobileNumber}</span></>
                                    )}
                                  </p>
                                  <p className="text-slate-500">
                                    <strong>Nationality:</strong> {assessment.nationality}
                                    {assessment.playerType && (
                                      <> | <strong>Type:</strong> {assessment.playerType}</>
                                    )}
                                  </p>
                                  {assessment.createdAt && (
                                    <p className="text-slate-400 text-[10px]">
                                      Submitted: {new Date(assessment.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  {assessment.paymentAmount && (
                                    <span className="font-bold text-navy-900 font-display text-sm">₹{assessment.paymentAmount}</span>
                                  )}
                                  <button
                                    onClick={() => setSelectedAssessmentDetail(assessment)}
                                    className="px-3 py-1.5 bg-navy-900 hover:bg-navy-950 text-gold-400 font-bold text-[10px] rounded-lg uppercase tracking-wider flex items-center space-x-1 transition cursor-pointer"
                                  >
                                    <FileText className="h-3.5 w-3.5" />
                                    <span>View Details</span>
                                  </button>
                                  <button
                                    onClick={() => downloadAssessmentPdf(assessment)}
                                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] rounded-lg uppercase tracking-wider flex items-center space-x-1 transition cursor-pointer"
                                  >
                                    <Download className="h-3.5 w-3.5" />
                                    <span>Download</span>
                                  </button>
                                </div>
                              </div>

                              {/* Cricket summary strip */}
                              <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap gap-2">
                                {assessment.firstClassPlayed === 'Yes' && (
                                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-bold">First-Class</span>
                                )}
                                {assessment.listAPlayed === 'Yes' && (
                                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[10px] font-bold">List A</span>
                                )}
                                {assessment.domesticT20Played === 'Yes' && (
                                  <span className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 rounded text-[10px] font-bold">Domestic T20</span>
                                )}
                                {assessment.iccT20Played === 'Yes' && (
                                  <span className="px-2 py-0.5 bg-gold-50 text-gold-700 border border-gold-200 rounded text-[10px] font-bold">ICC/State T20</span>
                                )}
                                {assessment.ageGroupPlayed === 'Yes' && (
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">Age Group</span>
                                )}
                                {assessment.universityPlayed === 'Yes' && (
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-bold">University</span>
                                )}
                                {(assessment.firstClassPlayed === 'No' && assessment.listAPlayed === 'No' && assessment.domesticT20Played === 'No') && (
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 rounded text-[10px] font-medium">Club / Amateur</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dedicated Calendar Block (Dates & Time Slots) View */}
                  {adminSubTab === 'dates' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-navy-100 p-6 sm:p-8 space-y-6 animate-fade-in">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-150 pb-4 gap-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-6 w-6 text-red-600" />
                            <h3 className="text-xl font-bold font-display text-navy-900 uppercase">Block Calendar Dates & Specific Time Slots</h3>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Block off unavailable dates (e.g., travel/holidays) or specific time slots (e.g., Monday at 11:00 AM IST) so clients cannot book them online.
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full border border-red-300">
                            {blockedDates.length} Full Dates & {blockedSlots.length} Slots Blocked
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Block Specific Slot (e.g. Monday at 11 AM) */}
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                          <h4 className="font-bold text-sm text-navy-900 uppercase flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-amber-600" />
                            <span>Block Specific Time Slot (e.g. Monday 11:00 AM)</span>
                          </h4>
                          <p className="text-xs text-slate-500">
                            Pick a date and a time slot to block individually without blocking the entire day.
                          </p>
                          <div className="space-y-3 pt-1">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Select Date</label>
                              <input 
                                type="date" 
                                id="admin-tab-block-slot-date"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:border-navy-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Select Time Slot (IST)</label>
                              <select
                                id="admin-tab-block-slot-time"
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:border-navy-500"
                              >
                                {defaultTimeSlots.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                const dateEl = document.getElementById('admin-tab-block-slot-date') as HTMLInputElement;
                                const slotEl = document.getElementById('admin-tab-block-slot-time') as HTMLSelectElement;
                                if (dateEl && dateEl.value && slotEl && slotEl.value) {
                                  handleBlockSlot(dateEl.value, slotEl.value);
                                }
                              }}
                              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg uppercase tracking-wider shadow transition cursor-pointer"
                            >
                              Block This Time Slot
                            </button>
                          </div>
                        </div>

                        {/* Block Full Day */}
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                          <h4 className="font-bold text-sm text-navy-900 uppercase flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-red-600" />
                            <span>Block Entire Day</span>
                          </h4>
                          <p className="text-xs text-slate-500">
                            Select a full date to disable all time slots on that day for clients.
                          </p>
                          <div className="space-y-3 pt-1">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Select Date to Block Completely</label>
                              <input 
                                type="date" 
                                id="admin-tab-block-date"
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:border-navy-500"
                              />
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                const el = document.getElementById('admin-tab-block-date') as HTMLInputElement;
                                if (el && el.value) {
                                  handleBlockDate(el.value);
                                  el.value = '';
                                }
                              }}
                              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg uppercase tracking-wider shadow transition cursor-pointer"
                            >
                              Block Entire Day
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Blocked Listings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                        <div>
                          <h4 className="font-bold text-xs text-slate-700 uppercase mb-2">Blocked Time Slots ({blockedSlots.length})</h4>
                          {blockedSlots.length === 0 ? (
                            <p className="text-slate-400 text-xs italic">No individual slots blocked.</p>
                          ) : (
                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                              {blockedSlots.map(key => {
                                const [d, s] = key.split('|');
                                return (
                                  <div key={key} className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex justify-between items-center text-xs">
                                    <div>
                                      <span className="font-mono font-bold text-amber-950 block">{d}</span>
                                      <span className="text-amber-800 text-[11px] font-semibold">{s}</span>
                                    </div>
                                    <button
                                      onClick={() => handleUnblockSlot(key)}
                                      className="px-2 py-1 bg-amber-200/60 hover:bg-amber-300 text-amber-900 font-bold rounded text-[10px] transition cursor-pointer"
                                    >
                                      Unblock Slot
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="font-bold text-xs text-slate-700 uppercase mb-2">Blocked Full Dates ({blockedDates.length})</h4>
                          {blockedDates.length === 0 ? (
                            <p className="text-slate-400 text-xs italic">No full dates blocked.</p>
                          ) : (
                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                              {blockedDates.map(date => (
                                <div key={date} className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex justify-between items-center text-xs">
                                  <span className="font-mono font-bold text-red-950">{date}</span>
                                  <button
                                    onClick={() => handleUnblockDate(date)}
                                    className="px-2 py-1 bg-red-200/60 hover:bg-red-300 text-red-900 font-bold rounded text-[10px] transition cursor-pointer"
                                  >
                                    Unblock Day
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dedicated Zoom Email, Password & Admin Settings View */}
                  {adminSubTab === 'settings' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gold-300 p-6 sm:p-8 space-y-6 animate-fade-in">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-150 pb-4 gap-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Video className="h-6 w-6 text-gold-600" />
                            <h3 className="text-xl font-bold font-display text-navy-900 uppercase">Zoom Host Email & Admin Configuration</h3>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Configure your primary Email ID for Zoom video consultations, admin portal password, and tax invoice headers.
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-gold-100 text-gold-900 font-mono text-xs font-extrabold rounded-full border border-gold-300 self-start sm:self-auto">
                          Configured Email: {adminSettings.adminEmail}
                        </span>
                      </div>

                      {adminSettingsSaveMsg && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2 animate-bounce">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span>{adminSettingsSaveMsg}</span>
                        </div>
                      )}

                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          saveAdminSettingsToStorage(adminSettings);
                        }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                          {/* Primary Email ID for Zoom & Notifications */}
                          <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <label className="block text-navy-900 font-bold uppercase text-[10px]">
                              Primary Email ID (For Zoom & Inquiries) *
                            </label>
                            <input
                              type="email"
                              required
                              value={adminSettings.adminEmail}
                              onChange={(e) => setAdminSettings({ ...adminSettings, adminEmail: e.target.value, zoomHostEmail: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-gold-500 font-medium"
                              placeholder="thecricketadvisor@gmail.com"
                            />
                            <p className="text-[10px] text-slate-500">This email address is configured with Zoom for meeting room generation and client alerts.</p>
                          </div>

                          {/* Zoom Host Display Name */}
                          <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <label className="block text-navy-900 font-bold uppercase text-[10px]">
                              Zoom Host Display Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={adminSettings.zoomHostName}
                              onChange={(e) => setAdminSettings({ ...adminSettings, zoomHostName: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-gold-500 font-medium"
                              placeholder="Prakash Palande (TCC)"
                            />
                            <p className="text-[10px] text-slate-500">Shown to clients on their booking receipt and Zoom calendar invitation.</p>
                          </div>

                          {/* Zoom Personal Meeting ID or Link */}
                          <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <label className="block text-navy-900 font-bold uppercase text-[10px]">
                              Zoom Personal Meeting Link or ID *
                            </label>
                            <input
                              type="text"
                              required
                              value={adminSettings.zoomPersonalMeetingId}
                              onChange={(e) => setAdminSettings({ ...adminSettings, zoomPersonalMeetingId: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-gold-500 font-mono"
                              placeholder="https://zoom.us/j/9876543210?pwd=..."
                            />
                            <p className="text-[10px] text-slate-500">Enter your full Zoom Meeting Link (including passcode) or your 10-digit Meeting ID. Clients will be sent this link to join the consultation.</p>
                          </div>

                          {/* Admin Portal Security Password */}
                          <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <label className="block text-navy-900 font-bold uppercase text-[10px] text-orange-700">
                              Admin Portal Password *
                            </label>
                            <input
                              type="text"
                              required
                              value={adminSettings.adminPassword}
                              onChange={(e) => setAdminSettings({ ...adminSettings, adminPassword: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-orange-500 font-mono font-bold text-orange-900"
                              placeholder="cricket2026"
                            />
                            <p className="text-[10px] text-slate-500">Your password to enter the Management Portal (Current: <strong>{adminSettings.adminPassword}</strong>).</p>
                          </div>

                          {/* GSTIN Tax Registration */}
                          <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <label className="block text-navy-900 font-bold uppercase text-[10px]">
                              GSTIN / Tax Registration No.
                            </label>
                            <input
                              type="text"
                              value={adminSettings.gstin}
                              onChange={(e) => setAdminSettings({ ...adminSettings, gstin: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-gold-500 font-mono"
                              placeholder="27AAAAA0000A1Z5"
                            />
                            <p className="text-[10px] text-slate-500">Appears on client tax invoices and official payment receipts.</p>
                          </div>

                          {/* Business Address */}
                          <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <label className="block text-navy-900 font-bold uppercase text-[10px]">
                              Business Office Address
                            </label>
                            <input
                              type="text"
                              value={adminSettings.businessAddress}
                              onChange={(e) => setAdminSettings({ ...adminSettings, businessAddress: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-gold-500"
                              placeholder="Mumbai & Global Cricket Advisory, India"
                            />
                            <p className="text-[10px] text-slate-500">Displayed in tax invoice headers for professional compliance.</p>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="px-6 py-3 bg-navy-900 hover:bg-navy-950 text-gold-400 font-extrabold text-xs rounded-xl uppercase tracking-wider transition shadow flex items-center space-x-2 border border-gold-500/30 cursor-pointer"
                          >
                            <CheckCircle className="h-4 w-4 text-gold-400" />
                            <span>Save & Apply Zoom Email & Settings</span>
                          </button>
                        </div>
                      </form>

                      {/* Explanation Guide on How Invoices, Zoom, and Calendar work */}
                      <div className="pt-6 border-t border-slate-200 space-y-3">
                        <h4 className="font-bold text-navy-900 uppercase text-xs tracking-wider">How Automation & Dispatch Work in TCC System</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                            <p className="font-bold text-navy-900">🎥 1. Automated Zoom</p>
                            <p className="text-slate-500 text-[11px] leading-relaxed">
                              When a client completes a booking, a unique password-protected Zoom meeting URL is generated linked to <strong>{adminSettings.adminEmail}</strong>.
                            </p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                            <p className="font-bold text-emerald-900">💬 2. WhatsApp & Email Dispatch</p>
                            <p className="text-slate-500 text-[11px] leading-relaxed">
                              Client WhatsApp & Email are captured during checkout. Use 1-click <strong>WhatsApp Zoom Link</strong> or <strong>Email Zoom Link</strong> buttons to dispatch instantly!
                            </p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                            <p className="font-bold text-navy-900">📄 3. Instant Tax Invoicing</p>
                            <p className="text-slate-500 text-[11px] leading-relaxed">
                              Every paid consultation generates a downloadable/printable GST Tax Invoice with SAC Code 998311, GST calculations, and custom reference ID.
                            </p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                            <p className="font-bold text-navy-900">📅 4. Calendar Sync</p>
                            <p className="text-slate-500 text-[11px] leading-relaxed">
                              Clients and consultants get 1-click Google Calendar links and downloadable <code>.ics</code> calendar feeds for seamless schedule sync.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dedicated Bank & UPI Settings View */}
                  {adminSubTab === 'bank' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-orange-200 p-6 sm:p-8 space-y-6 animate-fade-in">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-150 pb-4 gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="h-6 w-6 text-orange-600" />
                            <h3 className="text-xl font-bold font-display text-navy-900 uppercase">Bank Account & UPI Payment Settings</h3>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Configure your bank account details and UPI ID shown to clients during booking checkout.</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-mono text-xs font-bold rounded-full border border-emerald-200 self-start sm:self-auto">
                          Live Payout Active
                        </span>
                      </div>

                      {bankSaveMessage && (
                        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-lg shadow-sm flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span>{bankSaveMessage}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Form column */}
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          saveBankDetailsToStorage(bankDetails);
                        }} className="lg:col-span-7 bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 text-xs">
                          <h4 className="font-bold text-sm text-navy-900 uppercase border-b border-slate-200 pb-2">Edit Payment Credentials</h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-700 font-semibold uppercase text-[10px] mb-1">Account Holder Name *</label>
                              <input 
                                type="text" 
                                value={bankDetails.accountName}
                                onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-navy-500 font-medium"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-slate-700 font-semibold uppercase text-[10px] mb-1">Bank Name *</label>
                              <input 
                                type="text" 
                                value={bankDetails.bankName}
                                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-navy-500 font-medium"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-700 font-semibold uppercase text-[10px] mb-1">Account Number *</label>
                              <input 
                                type="text" 
                                value={bankDetails.accountNumber}
                                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-navy-500 font-mono font-bold"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-slate-700 font-semibold uppercase text-[10px] mb-1">IFSC Code *</label>
                              <input 
                                type="text" 
                                value={bankDetails.ifscCode}
                                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-navy-500 font-mono font-bold"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-700 font-semibold uppercase text-[10px] mb-1">UPI ID (e.g., GPay / PhonePe / Paytm / BHIM) *</label>
                            <input 
                              type="text" 
                              value={bankDetails.upiId}
                              onChange={(e) => setBankDetails({ ...bankDetails, upiId: e.target.value })}
                              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:border-navy-500 font-mono font-bold text-navy-900"
                              required
                            />
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition shadow-md hover:shadow-lg mt-2"
                          >
                            Save & Publish Bank & UPI Settings
                          </button>
                        </form>

                        {/* Preview Column */}
                        <div className="lg:col-span-5 bg-navy-950 text-white p-6 rounded-xl border border-gold-500/30 space-y-4">
                          <div className="flex items-center justify-between border-b border-navy-800 pb-3">
                            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Client Checkout Preview</span>
                            <span className="text-[10px] bg-gold-500/20 text-gold-300 px-2 py-0.5 rounded font-mono">Step 3 Live Mode</span>
                          </div>

                          <p className="text-xs text-slate-300">This is how your bank details appear to clients during checkout:</p>

                          <div className="bg-white text-slate-900 p-4 rounded-lg border border-gold-400 space-y-3 text-xs">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                              <span className="font-bold text-navy-900 uppercase text-[11px]">Direct Bank & UPI Transfer</span>
                              <span className="text-[10px] text-emerald-600 bg-emerald-50 font-bold px-2 py-0.5 rounded border border-emerald-200">Verified</span>
                            </div>
                            <div className="space-y-1.5 text-slate-700 text-[11px]">
                              <p><strong>Account Name:</strong> {bankDetails.accountName}</p>
                              <p><strong>Bank Name:</strong> {bankDetails.bankName}</p>
                              <p><strong>Account No:</strong> <span className="font-mono font-bold text-slate-900">{bankDetails.accountNumber}</span></p>
                              <p><strong>IFSC Code:</strong> <span className="font-mono font-bold text-slate-900">{bankDetails.ifscCode}</span></p>
                              <div className="mt-2 p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                                <div>
                                  <span className="block text-[9px] text-slate-400 uppercase font-bold">UPI ID</span>
                                  <span className="font-mono font-bold text-navy-900 text-xs">{bankDetails.upiId}</span>
                                </div>
                                <button 
                                  type="button" 
                                  onClick={() => alert('Client clicking this copies the UPI ID')}
                                  className="px-2.5 py-1 bg-orange-600 text-white text-[10px] font-bold rounded uppercase"
                                >
                                  Copy UPI
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dedicated Rates & Session Duration Management View */}
                  {adminSubTab === 'prices' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-navy-100 p-6 sm:p-8 space-y-6 animate-fade-in">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-150 pb-4 gap-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-6 w-6 text-orange-600" />
                            <h3 className="text-xl font-bold font-display text-navy-900 uppercase">Consultation Session Durations & Rates</h3>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Set consultation prices and duration in minutes (30, 45, 60, 90 mins). Default session duration is set to 60 Minutes.
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 self-start sm:self-auto">
                          <button 
                            onClick={handleSetAll60Mins}
                            className="px-4 py-2.5 bg-navy-900 hover:bg-navy-950 text-gold-400 font-bold text-xs rounded-lg uppercase tracking-wider transition shadow flex items-center space-x-2 border border-gold-500/30 cursor-pointer"
                          >
                            <CheckCircle className="h-4 w-4 text-gold-400" />
                            <span>Set All Sessions to 60 Minutes</span>
                          </button>
                          <button 
                            onClick={handleResetDefaultPackages}
                            className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg uppercase tracking-wider transition flex items-center space-x-1.5 border border-slate-200 cursor-pointer"
                          >
                            <span>Reset Defaults</span>
                          </button>
                        </div>
                      </div>

                      {packageSaveMsg && (
                        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-lg shadow-sm flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <span>{packageSaveMsg}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {packages.map((pkg) => (
                          <div key={pkg.id} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between hover:border-slate-300 transition">
                            <div>
                              <div className="flex justify-between items-start gap-2 mb-1">
                                <h4 className="font-bold text-navy-900 text-sm">{pkg.title}</h4>
                                <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 font-mono font-bold text-xs rounded-full border border-orange-200">
                                  {pkg.duration}
                                </span>
                              </div>
                              <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{pkg.description}</p>
                            </div>

                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                              {editingPriceId === pkg.id ? (
                                <div className="w-full space-y-2 bg-white p-3 rounded-lg border border-orange-300 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Price (₹)</label>
                                      <input 
                                        type="number"
                                        value={tempPrice}
                                        onChange={(e) => setTempPrice(parseInt(e.target.value) || 0)}
                                        className="w-full px-2 py-1.5 border border-slate-300 rounded font-mono font-bold text-navy-900 focus:outline-none focus:border-navy-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Minutes / Duration</label>
                                      <select 
                                        value={tempDuration}
                                        onChange={(e) => setTempDuration(e.target.value)}
                                        className="w-full px-2 py-1.5 border border-slate-300 rounded font-semibold text-navy-900 focus:outline-none focus:border-navy-500"
                                      >
                                        <option value="30 Mins">30 Mins</option>
                                        <option value="45 Mins">45 Mins</option>
                                        <option value="60 Mins">60 Mins (Standard)</option>
                                        <option value="90 Mins">90 Mins (1.5 Hrs)</option>
                                        <option value="120 Mins">120 Mins (2 Hrs)</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2 pt-1">
                                    <button 
                                      onClick={() => handleUpdatePackage(pkg.id, tempPrice, tempDuration)}
                                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded flex items-center justify-center space-x-1 cursor-pointer"
                                    >
                                      <Check className="h-3.5 w-3.5" />
                                      <span>Save Changes</span>
                                    </button>
                                    <button 
                                      onClick={() => setEditingPriceId(null)}
                                      className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded cursor-pointer"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="space-x-2">
                                    <span className="text-base font-extrabold text-navy-900 font-display">₹{pkg.price}</span>
                                    <span className="text-xs text-slate-500 font-medium">({pkg.duration} session)</span>
                                  </div>
                                  <button 
                                    onClick={() => { setEditingPriceId(pkg.id); setTempPrice(pkg.price); setTempDuration(pkg.duration || '60 Mins'); }}
                                    className="px-3 py-1.5 bg-navy-900 hover:bg-navy-950 text-white text-xs font-bold rounded-lg flex items-center space-x-1 transition shadow-sm cursor-pointer"
                                  >
                                    <Edit2 className="h-3.5 w-3.5 text-gold-400" />
                                    <span>Edit Rate & Minutes</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dashboard Content Grid splits */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT PANEL (8 COLS): BOOKINGS & PLAYER PLACEMENT PANEL */}
                    <div className="lg:col-span-8 space-y-8">
                      
                      {/* Booking Request List */}
                      <div className="bg-white rounded-2xl shadow-md border border-slate-150 p-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                          <h3 className="text-lg font-bold font-display text-navy-900 uppercase">Consultation Bookings ({bookings.length})</h3>
                          <span className="text-[11px] font-mono text-slate-400">Database synchronization active</span>
                        </div>

                        {bookings.length === 0 ? (
                          <div className="text-center py-8 text-slate-400">
                            <Calendar className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-xs">No active bookings registered.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {bookings.map((booking) => (
                              <div key={booking.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                                <div className="flex justify-between items-start flex-wrap gap-2">
                                  <div>
                                    <span className="font-mono text-slate-400 font-bold block">{booking.id}</span>
                                    <h4 className="font-bold text-sm text-navy-900 flex items-center space-x-2">
                                      <span>{booking.fullName}</span>
                                      <button
                                        onClick={() => setEditingBooking(booking)}
                                        className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-1.5 py-0.5 rounded font-bold transition flex items-center space-x-1 cursor-pointer"
                                        title="Update Client Email or WhatsApp"
                                      >
                                        <Edit2 className="h-2.5 w-2.5" />
                                        <span>Edit Email/WhatsApp</span>
                                      </button>
                                    </h4>
                                    <p className="text-slate-500"><strong>Email:</strong> {booking.email} | <strong>WhatsApp:</strong> <span className="font-mono text-emerald-800 font-bold">{booking.whatsApp}</span></p>
                                  </div>
                                  <div className="text-right">
                                    <span className="px-2.5 py-1 font-semibold rounded-full uppercase tracking-wider text-[10px] block border text-center" 
                                      style={{
                                        borderColor: booking.bookingStatus === 'Approved' ? '#10b981' : booking.bookingStatus === 'Cancelled' ? '#ef4444' : '#f59e0b',
                                        color: booking.bookingStatus === 'Approved' ? '#047857' : booking.bookingStatus === 'Cancelled' ? '#b91c1c' : '#b45309',
                                        backgroundColor: booking.bookingStatus === 'Approved' ? '#f0fdf4' : booking.bookingStatus === 'Cancelled' ? '#fef2f2' : '#fffbeb'
                                      }}
                                    >
                                      {booking.bookingStatus}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block mt-1">Paid via {booking.paymentMethod}</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-slate-200/60 pt-3 text-slate-600">
                                  <p><strong>Package:</strong> {booking.packageName}</p>
                                  <p><strong>Price:</strong> {formatPrice(booking.price)}</p>
                                  <p><strong>Scheduled Slot:</strong> {booking.date} @ {booking.timeSlot}</p>
                                  <p><strong>Playing level:</strong> {booking.playingLevel}</p>
                                </div>

                                <p className="bg-white p-2.5 rounded border border-slate-200 text-[11px] text-slate-500">
                                  <strong>Purpose of Consultation:</strong> "{booking.purpose}"
                                </p>

                                <div className="bg-navy-900 text-white p-3 rounded-lg flex items-center justify-between text-[11px]">
                                  <p className="truncate mr-3"><strong>Zoom Link:</strong> <a href={booking.zoomLink} target="_blank" rel="noopener noreferrer" className="text-gold-300 hover:underline">{booking.zoomLink}</a></p>
                                  <span className="font-mono text-slate-400">ID: {booking.meetingId}</span>
                                </div>

                                {/* Booking action triggers & 1-click Dispatch */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <a
                                      href={generateWhatsAppUrl(booking)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded flex items-center space-x-1 cursor-pointer shadow-sm"
                                      title="Send Zoom Link & Details directly to Client's WhatsApp"
                                    >
                                      <MessageSquare className="h-3 w-3 fill-current" />
                                      <span>Send via WhatsApp</span>
                                    </a>

                                    <a
                                      href={generateEmailUrl(booking)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded flex items-center space-x-1 cursor-pointer shadow-sm"
                                      title="Send Email with Zoom Link & Invoice"
                                    >
                                      <Mail className="h-3 w-3" />
                                      <span>Send Email</span>
                                    </a>

                                    <button
                                      onClick={() => setSelectedInvoiceBooking(booking)}
                                      className="px-2.5 py-1 bg-navy-900 hover:bg-navy-950 text-gold-400 text-[10px] font-bold rounded flex items-center space-x-1 cursor-pointer"
                                    >
                                      <FileText className="h-3 w-3 text-gold-400" />
                                      <span>Invoice</span>
                                    </button>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    {booking.bookingStatus !== 'Approved' && (
                                      <button 
                                        onClick={() => handleUpdateBookingStatus(booking.id, 'Approved')}
                                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase tracking-wider rounded font-bold transition"
                                      >
                                        Approve
                                      </button>
                                    )}
                                    {booking.bookingStatus !== 'Cancelled' && (
                                      <button 
                                        onClick={() => handleUpdateBookingStatus(booking.id, 'Cancelled')}
                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase tracking-wider rounded font-bold transition"
                                      >
                                        Cancel Booking
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Manage Player Profiles */}
                      <div className="bg-white rounded-2xl shadow-md border border-slate-150 p-6 space-y-6">
                        <div className="border-b border-slate-100 pb-4">
                          <h3 className="text-lg font-bold font-display text-navy-900 uppercase">Manage Player Profiles</h3>
                          <p className="text-xs text-slate-400">Add or remove players featured on the public placements roster.</p>
                        </div>

                        {/* Roster list */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {players.map(p => (
                            <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-start">
                              <div className="space-y-1">
                                <span className="px-2 py-0.5 text-[9px] font-bold bg-gold-100 text-gold-800 rounded uppercase">{p.country}</span>
                                <h4 className="font-bold text-navy-900 text-sm">{p.name}</h4>
                                <p className="text-slate-500 font-medium">Club: {p.club}</p>
                                <p className="text-slate-400">Season: {p.season}</p>
                              </div>
                              <button 
                                onClick={() => handleDeletePlayer(p.id)}
                                className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 transition"
                                title="Delete Profile"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Player Form */}
                        <form onSubmit={handleAddPlayer} className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-xs space-y-4">
                          <h4 className="font-bold font-display text-navy-900 uppercase tracking-wider border-b border-slate-200 pb-2">Add New Placed Player</h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-600 uppercase font-semibold mb-1">Player Name *</label>
                              <input 
                                type="text" 
                                required
                                value={newPlayer.name}
                                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs focus:outline-none focus:border-navy-500"
                                placeholder="E.g. Vinayak Shukla"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-600 uppercase font-semibold mb-1">Country *</label>
                              <input 
                                type="text" 
                                required
                                value={newPlayer.country}
                                onChange={(e) => setNewPlayer({ ...newPlayer, country: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs focus:outline-none focus:border-navy-500"
                                placeholder="E.g. Oman"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-600 uppercase font-semibold mb-1">Overseas Club</label>
                              <input 
                                type="text" 
                                value={newPlayer.club}
                                onChange={(e) => setNewPlayer({ ...newPlayer, club: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs focus:outline-none focus:border-navy-500"
                                placeholder="E.g. Sussex Cricket Club"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-600 uppercase font-semibold mb-1">Season Year</label>
                              <input 
                                type="text" 
                                value={newPlayer.season}
                                onChange={(e) => setNewPlayer({ ...newPlayer, season: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs focus:outline-none focus:border-navy-500"
                                placeholder="E.g. 2018 or Present"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-600 uppercase font-semibold mb-1">Batting Style</label>
                              <input 
                                type="text" 
                                value={newPlayer.battingStyle}
                                onChange={(e) => setNewPlayer({ ...newPlayer, battingStyle: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs focus:outline-none focus:border-navy-500"
                                placeholder="E.g. Left Hand Batsman"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-600 uppercase font-semibold mb-1">Bowling Style</label>
                              <input 
                                type="text" 
                                value={newPlayer.bowlingStyle}
                                onChange={(e) => setNewPlayer({ ...newPlayer, bowlingStyle: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs focus:outline-none focus:border-navy-500"
                                placeholder="E.g. Left Arm Fast Bowler"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-600 uppercase font-semibold mb-1">Playing Proficiency</label>
                              <input 
                                type="text" 
                                value={newPlayer.playingProficiency}
                                onChange={(e) => setNewPlayer({ ...newPlayer, playingProficiency: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs focus:outline-none focus:border-navy-500"
                                placeholder="E.g. Bowling All Rounder- Seam"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-600 uppercase font-semibold mb-1">Nationality</label>
                              <input 
                                type="text" 
                                value={newPlayer.nationality}
                                onChange={(e) => setNewPlayer({ ...newPlayer, nationality: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs focus:outline-none focus:border-navy-500"
                                placeholder="E.g. Indian"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-600 uppercase font-semibold mb-1">Placement Achievement Description *</label>
                            <input 
                              type="text" 
                              required
                              value={newPlayer.achievement}
                              onChange={(e) => setNewPlayer({ ...newPlayer, achievement: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs focus:outline-none focus:border-navy-500"
                              placeholder="E.g. Successfully placed in Oman and recently appointed Captain."
                            />
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-2.5 bg-navy-800 text-white font-bold uppercase tracking-wider rounded border border-navy-700"
                          >
                            Add To Placements Roster
                          </button>
                        </form>
                      </div>

                    </div>

                    {/* RIGHT PANEL (4 COLS): PRICE MANAGEMENT & BLOCK DATES */}
                    <div className="lg:col-span-4 space-y-8">
                      
                      {/* Manage Consultation Prices */}
                      <div className="bg-white rounded-2xl shadow-md border border-slate-150 p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <h3 className="text-base font-bold font-display text-navy-900 uppercase">Consultation Rates</h3>
                          <button 
                            onClick={handleSetAll60Mins}
                            className="text-[10px] bg-orange-50 text-orange-700 hover:bg-orange-100 font-bold px-2 py-0.5 rounded border border-orange-200 uppercase transition cursor-pointer"
                            title="Set all session durations to 60 Mins"
                          >
                            All 60 Mins
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {packages.map(pkg => (
                            <div key={pkg.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col space-y-2 text-xs">
                              <div className="flex justify-between items-center">
                                <h4 className="font-bold text-navy-900 truncate max-w-[160px]">{pkg.title}</h4>
                                <span className="text-[10px] font-mono font-bold bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">{pkg.duration}</span>
                              </div>
                              <div>
                                {editingPriceId === pkg.id ? (
                                  <div className="space-y-2 bg-white p-2.5 rounded border border-orange-300">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-400 uppercase">Price (₹)</label>
                                        <input 
                                          type="number" 
                                          value={tempPrice}
                                          onChange={(e) => setTempPrice(parseInt(e.target.value) || 0)}
                                          className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded text-center text-xs font-bold focus:outline-none focus:border-navy-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-bold text-slate-400 uppercase">Minutes</label>
                                        <select 
                                          value={tempDuration}
                                          onChange={(e) => setTempDuration(e.target.value)}
                                          className="w-full px-1 py-1 bg-white border border-slate-300 rounded text-xs font-semibold focus:outline-none focus:border-navy-500"
                                        >
                                          <option value="30 Mins">30 Mins</option>
                                          <option value="45 Mins">45 Mins</option>
                                          <option value="60 Mins">60 Mins</option>
                                          <option value="90 Mins">90 Mins</option>
                                          <option value="120 Mins">120 Mins</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="flex space-x-1 pt-1">
                                      <button 
                                        onClick={() => handleUpdatePackage(pkg.id, tempPrice, tempDuration)}
                                        className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] flex items-center justify-center space-x-1 cursor-pointer"
                                      >
                                        <Check className="h-3 w-3" />
                                        <span>Save</span>
                                      </button>
                                      <button 
                                        onClick={() => setEditingPriceId(null)}
                                        className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-[10px] font-bold cursor-pointer"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5">
                                    <span className="font-bold font-display text-navy-900 text-sm">₹{pkg.price}</span>
                                    <button 
                                      onClick={() => { setEditingPriceId(pkg.id); setTempPrice(pkg.price); setTempDuration(pkg.duration || '60 Mins'); }}
                                      className="p-1 text-slate-400 hover:text-gold-600 hover:bg-slate-100 rounded transition flex items-center space-x-1 font-semibold text-[11px] cursor-pointer"
                                      title="Edit Price & Minutes"
                                    >
                                      <Edit2 className="h-3.5 w-3.5" />
                                      <span>Edit</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Block Schedule Dates & Slots */}
                      <div className="bg-white rounded-2xl shadow-md border border-slate-150 p-6 space-y-4">
                        <h3 className="text-base font-bold font-display text-navy-900 uppercase border-b border-slate-100 pb-3 flex items-center justify-between">
                          <span>Block Calendar Dates & Slots</span>
                          <Clock className="h-4 w-4 text-red-600" />
                        </h3>
                        <p className="text-[11px] text-slate-500">Prevent clients from booking specific dates or specific time slots (e.g. Monday 11 AM).</p>
                        
                        <div className="space-y-4">
                          {/* Block specific slot */}
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                            <p className="font-bold text-navy-900 uppercase text-[10px]">Block Specific Slot (e.g. Monday 11:00 AM)</p>
                            <div className="space-y-2">
                              <input 
                                type="date" 
                                id="admin-overview-slot-date"
                                defaultValue={new Date().toISOString().split('T')[0]}
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium focus:outline-none focus:border-navy-500"
                              />
                              <select
                                id="admin-overview-slot-time"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium focus:outline-none focus:border-navy-500"
                              >
                                {defaultTimeSlots.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                              <button 
                                type="button"
                                onClick={() => {
                                  const dateEl = document.getElementById('admin-overview-slot-date') as HTMLInputElement;
                                  const slotEl = document.getElementById('admin-overview-slot-time') as HTMLSelectElement;
                                  if (dateEl && dateEl.value && slotEl && slotEl.value) {
                                    handleBlockSlot(dateEl.value, slotEl.value);
                                  }
                                }}
                                className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-xs transition cursor-pointer"
                              >
                                Block Time Slot
                              </button>
                            </div>
                          </div>

                          {/* Block entire date */}
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                            <p className="font-bold text-navy-900 uppercase text-[10px]">Block Entire Day</p>
                            <div className="flex space-x-2">
                              <input 
                                type="date" 
                                id="admin-block-date"
                                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:border-navy-500 font-medium"
                              />
                              <button 
                                type="button"
                                onClick={() => {
                                  const el = document.getElementById('admin-block-date') as HTMLInputElement;
                                  if (el && el.value) {
                                    handleBlockDate(el.value);
                                    el.value = '';
                                  }
                                }}
                                className="px-3.5 bg-navy-800 text-white rounded font-bold hover:bg-navy-900 text-xs transition cursor-pointer shrink-0"
                              >
                                Block Day
                              </button>
                            </div>
                          </div>

                          {/* Blocked slot & date listings */}
                          <div className="space-y-2 pt-2 border-t border-slate-150 text-xs">
                            <p className="font-bold text-slate-700">Blocked Time Slots ({blockedSlots.length})</p>
                            {blockedSlots.length === 0 ? (
                              <p className="text-slate-400 text-[11px]">No slots blocked.</p>
                            ) : (
                              <div className="max-h-[100px] overflow-y-auto space-y-1 pr-1">
                                {blockedSlots.map(key => {
                                  const [d, s] = key.split('|');
                                  return (
                                    <div key={key} className="px-2 py-1 bg-amber-50 border border-amber-200 rounded flex justify-between items-center text-[11px]">
                                      <span className="font-mono font-bold text-amber-900">{d} ({s})</span>
                                      <button 
                                        onClick={() => handleUnblockSlot(key)}
                                        className="text-amber-600 hover:text-amber-900 p-0.5 rounded transition cursor-pointer"
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            <p className="font-bold text-slate-700 pt-1">Blocked Full Dates ({blockedDates.length})</p>
                            {blockedDates.length === 0 ? (
                              <p className="text-slate-400 text-[11px]">No dates blocked.</p>
                            ) : (
                              <div className="max-h-[100px] overflow-y-auto space-y-1 pr-1">
                                {blockedDates.map(date => (
                                  <div key={date} className="px-2.5 py-1.5 bg-red-50 border border-red-100 rounded flex justify-between items-center">
                                    <span className="font-mono text-[11px] font-bold text-red-700">{date}</span>
                                    <button 
                                      onClick={() => handleUnblockDate(date)}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-100/50 p-0.5 rounded transition cursor-pointer"
                                      title="Unblock Date"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Manage Bank Details */}
                      <div className="bg-white rounded-2xl shadow-md border border-slate-150 p-6 space-y-4">
                        <h3 className="text-base font-bold font-display text-navy-900 uppercase border-b border-slate-100 pb-3">Bank Account & UPI Settings</h3>
                        <p className="text-[11px] text-slate-400">Configure bank details and UPI ID displayed to clients during booking checkout.</p>
                        
                        {bankSaveMessage && (
                          <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded">
                            {bankSaveMessage}
                          </div>
                        )}

                        <form onSubmit={(e) => {
                          e.preventDefault();
                          saveBankDetailsToStorage(bankDetails);
                        }} className="space-y-3 text-xs">
                          <div>
                            <label className="block text-slate-600 font-semibold uppercase text-[10px] mb-1">Account Holder Name</label>
                            <input 
                              type="text" 
                              value={bankDetails.accountName}
                              onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-250 rounded text-xs focus:outline-none focus:border-navy-500 font-medium"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-slate-600 font-semibold uppercase text-[10px] mb-1">Bank Name</label>
                            <input 
                              type="text" 
                              value={bankDetails.bankName}
                              onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-250 rounded text-xs focus:outline-none focus:border-navy-500 font-medium"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-slate-600 font-semibold uppercase text-[10px] mb-1">Account Number</label>
                              <input 
                                type="text" 
                                value={bankDetails.accountNumber}
                                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-250 rounded text-xs focus:outline-none focus:border-navy-500 font-medium font-mono"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-slate-600 font-semibold uppercase text-[10px] mb-1">IFSC Code</label>
                              <input 
                                type="text" 
                                value={bankDetails.ifscCode}
                                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-250 rounded text-xs focus:outline-none focus:border-navy-500 font-medium font-mono"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-600 font-semibold uppercase text-[10px] mb-1">UPI ID (e.g. gpay / phonepe / paytm)</label>
                            <input 
                              type="text" 
                              value={bankDetails.upiId}
                              onChange={(e) => setBankDetails({ ...bankDetails, upiId: e.target.value })}
                              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-250 rounded text-xs focus:outline-none focus:border-navy-500 font-medium font-mono"
                              required
                            />
                          </div>

                          <button 
                            type="submit"
                            className="w-full py-2 bg-navy-800 hover:bg-navy-900 text-white font-bold rounded text-xs uppercase tracking-wider transition"
                          >
                            Save Bank Details
                          </button>
                        </form>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* Dedicated Cricket CVs View */}
              {adminSubTab === 'cvs' && (
                <div className="bg-white rounded-2xl shadow-xl border border-navy-100 p-6 sm:p-8 space-y-6 animate-fade-in text-slate-800">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-150 pb-4 gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
                        <h3 className="text-xl font-bold font-display text-navy-900 uppercase">Cricket CV Builder Database</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Review all cricket player CVs generated, including contact details and payment statuses.
                      </p>
                    </div>
                  </div>

                  {/* Registered players: shows every account and its email verification status,
                      whether or not the player has created a CV or paid */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
                        Registered Players ({cvUsersList.length})
                      </h4>
                      <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Verified: {cvUsersList.filter((u) => u.emailVerified).length}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          Not verified: {cvUsersList.filter((u) => !u.emailVerified).length}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                          Paid: {cvUsersList.filter((u) => u.paymentStatus === 'Paid').length}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-3 px-4">Player</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Mobile</th>
                            <th className="py-3 px-4">Registered On</th>
                            <th className="py-3 px-4">Email Verified</th>
                            <th className="py-3 px-4">CV</th>
                            <th className="py-3 px-4">Payment</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150">
                          {cvUsersList.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                                No registered players found.
                              </td>
                            </tr>
                          ) : (
                            cvUsersList.map((u) => (
                              <tr key={u.id} className="hover:bg-slate-50 transition">
                                <td className="py-3.5 px-4 font-semibold text-slate-700">{u.firstName} {u.lastName}</td>
                                <td className="py-3.5 px-4 text-slate-500">{u.email}</td>
                                <td className="py-3.5 px-4 text-slate-500">{u.mobileNumber || '-'}</td>
                                <td className="py-3.5 px-4 text-slate-500">
                                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '-'}
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    u.emailVerified
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-amber-50 text-amber-700 border-amber-200'
                                  }`}>
                                    {u.emailVerified ? 'Verified' : 'Pending'}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-slate-600">{u.hasCv ? 'Created' : 'Not started'}</td>
                                <td className="py-3.5 px-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    u.paymentStatus === 'Paid'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-slate-50 text-slate-600 border-slate-200'
                                  }`}>
                                    {u.paymentStatus}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wider pt-2">
                    Saved CVs ({cvList.length})
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">Ref Number</th>
                          <th className="py-3 px-4">Player</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Level & Role</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Updates Left</th>
                          <th className="py-3 px-4">Purchase Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {cvList.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                              No Cricket CVs found in database.
                            </td>
                          </tr>
                        ) : (
                          cvList.map((cv) => (
                            <tr key={cv.id} className="hover:bg-slate-50 transition">
                              <td className="py-3.5 px-4 font-mono font-bold text-navy-950">{cv.referenceNumber || 'Pending'}</td>
                              <td className="py-3.5 px-4 font-semibold text-slate-700">{cv.firstName} {cv.lastName}</td>
                              <td className="py-3.5 px-4 text-slate-500">{cv.email}</td>
                              <td className="py-3.5 px-4 text-slate-600">
                                <span className="font-semibold text-navy-800">{cv.cricketLevel}</span>
                                <span className="block text-[10px] text-slate-400">{cv.playingRole}</span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  cv.paymentStatus === 'Paid' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {cv.paymentStatus}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-semibold text-slate-650">
                                <div className="flex items-center space-x-1.5">
                                  <span>{((cv.editsAllowed || 5) - (cv.editsUsed || 0))} / {cv.editsAllowed || 5}</span>
                                  <div className="flex flex-col -space-y-0.5">
                                    <button
                                      onClick={() => handleUpdateCvEdits(cv, true)}
                                      className="p-0.5 hover:bg-slate-155 rounded text-emerald-600 hover:text-emerald-700 cursor-pointer transition"
                                      title="Increase edits remaining"
                                    >
                                      <ChevronUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleUpdateCvEdits(cv, false)}
                                      className="p-0.5 hover:bg-slate-155 rounded text-red-600 hover:text-red-700 cursor-pointer transition"
                                      title="Decrease edits remaining"
                                    >
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-slate-500">
                                {cv.purchaseDate ? new Date(cv.purchaseDate).toLocaleDateString('en-IN') : (cv.paymentStatus === 'Paid' ? new Date(cv.createdAt).toLocaleDateString('en-IN') : '-')}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {adminSubTab === 'economics' && (
                <div className="bg-white rounded-2xl shadow-xl border border-navy-100 p-6 sm:p-8 space-y-8 animate-fade-in text-slate-800">
                  <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-slate-150 pb-5 gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-6 w-6 text-amber-500" />
                        <h3 className="text-xl font-bold font-display text-navy-900 uppercase">Financial Insights & Economic Performance</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Analyze revenues, service breakdowns, and sales volumes across different timeframes.
                      </p>
                    </div>
                    {/* Timeframe Filter Buttons */}
                    <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                      {(['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'all-time'] as const).map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setEconomicsTimeframe(tf)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                            economicsTimeframe === tf
                              ? 'bg-navy-900 text-white shadow-sm font-extrabold'
                              : 'text-slate-650 hover:bg-slate-100'
                          }`}
                        >
                          {tf.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Calculations Block */}
                  {(() => {
                    const now = new Date();

                    const filterTx = (dateStr?: string) => {
                      if (!dateStr) return false;
                      const txDate = new Date(dateStr);
                      if (isNaN(txDate.getTime())) return false;

                      if (economicsTimeframe === 'daily') {
                        return txDate.getFullYear() === now.getFullYear() &&
                               txDate.getMonth() === now.getMonth() &&
                               txDate.getDate() === now.getDate();
                      }
                      if (economicsTimeframe === 'weekly') {
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(now.getDate() - 7);
                        return txDate >= sevenDaysAgo;
                      }
                      if (economicsTimeframe === 'monthly') {
                        return txDate.getFullYear() === now.getFullYear() &&
                               txDate.getMonth() === now.getMonth();
                      }
                      if (economicsTimeframe === 'quarterly') {
                        const currentQuarter = Math.floor(now.getMonth() / 3);
                        const txQuarter = Math.floor(txDate.getMonth() / 3);
                        return txDate.getFullYear() === now.getFullYear() && txQuarter === currentQuarter;
                      }
                      if (economicsTimeframe === 'yearly') {
                        return txDate.getFullYear() === now.getFullYear();
                      }
                      return true; // all-time
                    };

                    // 1. Consultation Bookings Revenue
                    const bookingTxs = bookings
                      .filter(b => b.paymentStatus === 'Paid' && filterTx(b.createdAt || b.date))
                      .map(b => ({
                        service: 'Consultation',
                        customer: b.fullName,
                        email: b.email,
                        amount: Number(b.price) || 0,
                        date: b.createdAt || b.date,
                        ref: b.id
                      }));
                    const bookingRevenue = bookingTxs.reduce((sum, tx) => sum + tx.amount, 0);

                    // 2. Eligibility Checks Revenue
                    const assessmentTxs = assessments
                      .filter(a => a.paymentStatus === 'Paid' && filterTx(a.createdAt))
                      .map(a => ({
                        service: 'Eligibility Check',
                        customer: `${a.firstName} ${a.lastName}`,
                        email: a.email,
                        amount: Number(a.paymentAmount) || 500,
                        date: a.createdAt || '',
                        ref: a.referenceNumber || 'N/A'
                      }));
                    const assessmentRevenue = assessmentTxs.reduce((sum, tx) => sum + tx.amount, 0);

                    // 3. CV Builder Revenue (Initial + Renewals)
                    const cvTxs: Array<{ service: string; customer: string; email: string; amount: number; date: string; ref: string }> = [];
                    cvList.forEach(cv => {
                      if (cv.paymentStatus === 'Paid') {
                        const purchases = cv.purchases && Array.isArray(cv.purchases) ? cv.purchases : [];
                        if (purchases.length === 0) {
                          // Legacy fallback: single initial purchase
                          if (filterTx(cv.createdAt)) {
                            cvTxs.push({
                              service: 'CV Builder (Initial)',
                              customer: `${cv.firstName} ${cv.lastName}`,
                              email: cv.email,
                              amount: 999,
                              date: cv.createdAt,
                              ref: cv.referenceNumber
                            });
                          }
                        } else {
                          purchases.forEach((p: any) => {
                            if (filterTx(p.date)) {
                              cvTxs.push({
                                service: p.type === 'renewal' ? 'CV Builder (Renewal)' : 'CV Builder (Initial)',
                                customer: `${cv.firstName} ${cv.lastName}`,
                                email: cv.email,
                                amount: Number(p.amount) || (p.type === 'renewal' ? 699 : 999),
                                date: p.date,
                                ref: p.invoiceNumber || cv.referenceNumber
                              });
                            }
                          });
                        }
                      }
                    });
                    const cvRevenue = cvTxs.reduce((sum, tx) => sum + tx.amount, 0);

                    const totalRevenue = bookingRevenue + assessmentRevenue + cvRevenue;
                    const totalSalesCount = bookingTxs.length + assessmentTxs.length + cvTxs.length;

                    // Combine all transactions sorted by date descending
                    const allTransactions = [...bookingTxs, ...assessmentTxs, ...cvTxs].sort(
                      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                    );

                    return (
                      <div className="space-y-8 animate-fade-in text-left">
                        {/* Overall Metrics Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Overall Revenue</span>
                            <h2 className="text-2xl font-black text-navy-950 font-mono">₹{totalRevenue.toLocaleString('en-IN')}.00</h2>
                            <p className="text-[9px] text-slate-400 font-semibold">{totalSalesCount} successful transactions</p>
                          </div>
                          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Bookings Service</span>
                            <h2 className="text-2xl font-black text-navy-900 font-mono">₹{bookingRevenue.toLocaleString('en-IN')}.00</h2>
                            <p className="text-[9px] text-slate-400 font-semibold">{bookingTxs.length} paid sessions ({totalRevenue > 0 ? Math.round((bookingRevenue / totalRevenue) * 100) : 0}% share)</p>
                          </div>
                          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Eligibility Checks</span>
                            <h2 className="text-2xl font-black text-navy-900 font-mono">₹{assessmentRevenue.toLocaleString('en-IN')}.00</h2>
                            <p className="text-[9px] text-slate-400 font-semibold">{assessmentTxs.length} paid reports ({totalRevenue > 0 ? Math.round((assessmentRevenue / totalRevenue) * 100) : 0}% share)</p>
                          </div>
                          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">CV Builder Service</span>
                            <h2 className="text-2xl font-black text-navy-900 font-mono">₹{cvRevenue.toLocaleString('en-IN')}.00</h2>
                            <p className="text-[9px] text-slate-400 font-semibold">{cvTxs.length} activations/renewals ({totalRevenue > 0 ? Math.round((cvRevenue / totalRevenue) * 100) : 0}% share)</p>
                          </div>
                        </div>

                        {/* Individual Services Performance Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Bookings performance card */}
                          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-2">Consultation Booking Performance</h4>
                            <div className="space-y-3 text-xs">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Total Sales:</span>
                                <span className="font-semibold text-slate-800">{bookingTxs.length} paid bookings</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Average Booking Value:</span>
                                <span className="font-semibold text-slate-800 font-mono">₹{bookingTxs.length > 0 ? Math.round(bookingRevenue / bookingTxs.length).toLocaleString('en-IN') : 0}</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-navy-900 h-full" style={{ width: `${totalRevenue > 0 ? (bookingRevenue / totalRevenue) * 100 : 0}%` }} />
                              </div>
                            </div>
                          </div>

                          {/* Assessments performance card */}
                          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-2">Eligibility Check Performance</h4>
                            <div className="space-y-3 text-xs">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Total Sales:</span>
                                <span className="font-semibold text-slate-800">{assessmentTxs.length} paid reports</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Average Report Value:</span>
                                <span className="font-semibold text-slate-800 font-mono">₹{assessmentTxs.length > 0 ? Math.round(assessmentRevenue / assessmentTxs.length).toLocaleString('en-IN') : 0}</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-gold-500 h-full" style={{ width: `${totalRevenue > 0 ? (assessmentRevenue / totalRevenue) * 100 : 0}%` }} />
                              </div>
                            </div>
                          </div>

                          {/* CV Builder performance card */}
                          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                            <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider border-b border-slate-100 pb-2">CV Builder Performance</h4>
                            <div className="space-y-3 text-xs">
                              <div className="flex justify-between">
                                <span className="text-slate-500">Activations:</span>
                                <span className="font-semibold text-slate-800">{cvTxs.filter(tx => tx.service.includes('Initial')).length} (₹999)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Renewals:</span>
                                <span className="font-semibold text-slate-800">{cvTxs.filter(tx => tx.service.includes('Renewal')).length} (₹699)</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">Average Order Value:</span>
                                <span className="font-semibold text-slate-800 font-mono">₹{cvTxs.length > 0 ? Math.round(cvRevenue / cvTxs.length).toLocaleString('en-IN') : 0}</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-600 h-full" style={{ width: `${totalRevenue > 0 ? (cvRevenue / totalRevenue) * 100 : 0}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Recent Transactions List */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold text-navy-950 uppercase tracking-wider">Transaction Ledger ({allTransactions.length})</h4>
                          <div className="overflow-x-auto max-h-[400px] border border-slate-250 rounded-xl">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                                  <th className="py-2.5 px-4">Date</th>
                                  <th className="py-2.5 px-4">Ref/Order ID</th>
                                  <th className="py-2.5 px-4">Service</th>
                                  <th className="py-2.5 px-4">Customer</th>
                                  <th className="py-2.5 px-4">Email</th>
                                  <th className="py-2.5 px-4 text-right">Amount</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-150">
                                {allTransactions.length === 0 ? (
                                  <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                                      No transactions found for the selected timeframe.
                                    </td>
                                  </tr>
                                ) : (
                                  allTransactions.map((tx, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition">
                                      <td className="py-2 px-4 text-slate-500">{new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                                      <td className="py-2 px-4 font-mono text-[10px] text-navy-950">{tx.ref}</td>
                                      <td className="py-2 px-4 text-slate-650 font-semibold">{tx.service}</td>
                                      <td className="py-2 px-4 text-slate-700 font-medium">{tx.customer}</td>
                                      <td className="py-2 px-4 text-slate-450">{tx.email}</td>
                                      <td className="py-2 px-4 text-right font-bold text-navy-950 font-mono">₹{tx.amount.toLocaleString('en-IN')}.00</td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>
                    );
                  })()}

                </div>
              )}


            </div>
          </div>
        )}

      </main>

      {/* --- FOOTER --- */}
      {activeTab !== 'coaches' && (
        <footer className="bg-navy-950 text-stone-300 pt-16 pb-8 border-t border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Logo brand about (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src={logoImg} 
                alt="The Cricket Advisor Logo Foot" 
                className="h-10 sm:h-12 w-auto rounded-lg object-contain shadow-sm" 
              />
              <div>
                <span className="font-display tracking-tight font-extrabold text-white text-sm block uppercase">
                  Prakash Palande
                </span>
                <span className="font-display tracking-widest text-[9px] font-bold text-gold-500 block uppercase">
                  Cricket Consultant & Advisor
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed max-w-sm font-light">
              Premium sports consulting agency delivering reliable placements, professional operations, and comprehensive overseas tour planning. Guided by trust and transparency.
            </p>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="text-white uppercase tracking-wider font-bold text-[11px]">Quick Navigation</h4>
            <div className="grid grid-cols-1 gap-2">
              <button onClick={() => scrollToSection('home')} className="text-left hover:text-gold-500 transition">Home</button>
              <button onClick={() => scrollToSection('why-choose-me')} className="text-left hover:text-gold-500 transition">Why Choose Me</button>
              <button onClick={() => scrollToSection('about-me')} className="text-left hover:text-gold-500 transition">About Prakash Palande</button>
              <button onClick={() => scrollToSection('services')} className="text-left hover:text-gold-500 transition">My Services</button>
              {/* <button onClick={() => { setActiveTab('placements'); }} className="text-left hover:text-gold-500 transition">Players Placed</button> */}
              {/* <button onClick={() => scrollToSection('client-websites')} className="text-left hover:text-gold-500 transition">Cricket Clients Website</button> */}
              <button onClick={() => scrollToSection('faq')} className="text-left hover:text-gold-500 transition">FAQ</button>
              <button onClick={() => scrollToSection('contact')} className="text-left hover:text-gold-500 transition">Contact Prakash Palande</button>
              <button 
                onClick={() => {
                  setActiveTab('main');
                  setIsRefundPolicyOpen(true);
                  setTimeout(() => {
                    scrollToSection('faq');
                  }, 100);
                }} 
                className="text-left text-gold-500 font-semibold hover:text-gold-400 transition"
              >
                Refund Policy
              </button>
            </div>
          </div>

          {/* Contact Details (4 cols) */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <h4 className="text-white uppercase tracking-wider font-bold text-[11px]">Contact & Support</h4>
            <div className="space-y-2">
              <p className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gold-500 flex-shrink-0" />
                <a href="mailto:thecricketadvisor@gmail.com" className="hover:text-gold-500 transition">thecricketadvisor@gmail.com</a>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gold-500 fill-current flex-shrink-0" />
                <a href="https://wa.me/918591133960" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition">+91 85911 33960</a>
              </p>
              <p className="text-[10px] text-stone-500 italic mt-3">Consultations are online via secure Zoom meetings only.</p>
            </div>
          </div>

        </div>

        {/* Bottom line */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-navy-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 font-light">
          <p>© 2026 Prakash Palande - Cricket Consultant & Advisor. All Rights Reserved.</p>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <span className="text-stone-500">Online Zoom Consultations</span>
            <button 
              onClick={() => { setActiveTab('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className="text-stone-600 hover:text-stone-400 transition"
              title="Portal Access"
            >
              <Lock className="h-3 w-3" />
            </button>
          </div>
        </div>
      </footer>
      )}

      {/* Tax Invoice Modal */}
      {selectedInvoiceBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 relative text-slate-800 my-8">
            
            {/* Modal Actions */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-4 print:hidden">
              <div className="flex items-center space-x-2 text-navy-900 font-bold uppercase text-xs tracking-wider">
                <FileText className="h-5 w-5 text-gold-600" />
                <span>Official Tax Invoice & Payment Receipt</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-navy-900 hover:bg-navy-950 text-gold-400 font-bold text-xs rounded-lg uppercase flex items-center space-x-1.5 transition shadow cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceBooking(null)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
 
            {/* Printable Invoice Document */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-6">
              
              {/* Header Branding */}
              <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-navy-900 pb-6 gap-4">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-gold-600 uppercase">OFFICIAL TAX INVOICE</span>
                  <h2 className="text-xl font-black font-display text-navy-950 uppercase tracking-tight">Prakash Palande Cricket Consultancy</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Global Player Placements, Board Advisory & Professional Coaching</p>
                  <p className="text-[11px] text-slate-400 mt-1">Email: thecricketadvisor@gmail.com | Web: www.thecricketadvisor.com</p>
                  <p className="text-[11px] text-slate-400">GST / SAC Code: 998311 (Management Advisory & Coaching Services)</p>
                </div>
 
                <div className="text-left sm:text-right font-mono text-xs space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Invoice Number</p>
                  <p className="font-extrabold text-navy-900 text-sm">INV-{selectedInvoiceBooking.id}</p>
                  <p className="text-slate-500 text-[11px]">Issued: {new Date(selectedInvoiceBooking.createdAt).toLocaleDateString()}</p>
                  <div className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded uppercase mt-1 border border-emerald-300">
                    Payment Status: PAID
                  </div>
                </div>
              </div>
 
              {/* Client & Booking Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b border-slate-200 pb-6">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BILLED TO (CLIENT)</p>
                  <p className="font-extrabold text-navy-900 text-sm">{selectedInvoiceBooking.fullName}</p>
                  <p className="text-slate-600"><strong>Email:</strong> {selectedInvoiceBooking.email}</p>
                  <p className="text-slate-600"><strong>WhatsApp:</strong> {selectedInvoiceBooking.whatsApp}</p>
                  <p className="text-slate-600"><strong>Country:</strong> {selectedInvoiceBooking.country}</p>
                  <p className="text-slate-600"><strong>Playing Level:</strong> {selectedInvoiceBooking.playingLevel}</p>
                </div>
 
                <div className="space-y-1.5 bg-white p-4 rounded-xl border border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CONSULTATION SCHEDULE</p>
                  <p className="font-bold text-navy-900">Date: {selectedInvoiceBooking.date}</p>
                  <p className="font-bold text-navy-900">Slot: {selectedInvoiceBooking.timeSlot}</p>
                  <p className="text-slate-600">Payment Method: <strong className="uppercase">{selectedInvoiceBooking.paymentMethod}</strong></p>
                  <p className="text-slate-600 break-words"><strong>Zoom Link:</strong> <a href={selectedInvoiceBooking.zoomLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold underline break-all">{selectedInvoiceBooking.zoomLink}</a></p>
                  <p className="text-slate-600">Passcode: <strong>TCC2026</strong></p>
                </div>
              </div>
 
              {/* Itemized Services Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[550px]">
                  <thead>
                    <tr className="bg-navy-950 text-white font-bold uppercase text-[10px] tracking-wider">
                      <th className="p-3 rounded-l-lg">Service Description</th>
                      <th className="p-3 text-center">Session Duration</th>
                      <th className="p-3 text-right rounded-r-lg">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 py-4">
                        <p className="font-bold text-navy-900 text-sm">{selectedInvoiceBooking.packageName}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">One-on-one video consultation with Prakash Palande including roadmap, player placement review, and recording.</p>
                      </td>
                      <td className="p-3 py-4 text-center font-bold text-slate-700">60 Minutes</td>
                      <td className="p-3 py-4 text-right font-extrabold text-navy-900 font-mono text-sm">₹{selectedInvoiceBooking.price}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total Summary */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-t-2 border-slate-300 pt-4 gap-4">
                <div className="text-[11px] text-slate-500 space-y-1 max-w-xs">
                  <p className="font-bold text-slate-700">Payment Authorization:</p>
                  <p>This document serves as an official receipt of payment for professional services. 18% GST included where applicable.</p>
                </div>

                <div className="w-full sm:w-64 bg-navy-900 text-white p-4 rounded-xl space-y-2 text-xs text-right font-mono border border-gold-500/20">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal:</span>
                    <span>₹{Math.round(selectedInvoiceBooking.price * 0.82)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>GST (18%):</span>
                    <span>₹{Math.round(selectedInvoiceBooking.price * 0.18)}</span>
                  </div>
                  <div className="flex justify-between text-gold-400 font-extrabold text-base border-t border-white/20 pt-2 font-display">
                    <span>TOTAL PAID:</span>
                    <span>₹{selectedInvoiceBooking.price}</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-slate-200 text-[10px] text-slate-400">
                <p>Prakash Palande Cricket Consultancy & Advisory &bull; Thank you for choosing our professional services!</p>
              </div>

            </div>

            <div className="flex flex-wrap justify-between items-center gap-2 pt-2 print:hidden">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={generateWhatsAppUrl(selectedInvoiceBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition cursor-pointer shadow-sm"
                >
                  <MessageSquare className="h-4 w-4 fill-current" />
                  <span>Send via WhatsApp</span>
                </a>

                <a
                  href={generateEmailUrl(selectedInvoiceBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition cursor-pointer shadow-sm"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email Zoom Link & Receipt</span>
                </a>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadIcsFile(selectedInvoiceBooking)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>Calendar Invite</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceBooking(null)}
                  className="px-4 py-2 bg-navy-900 hover:bg-navy-950 text-white text-xs font-bold rounded-lg uppercase tracking-wider cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Edit Client Email & WhatsApp Modal */}
      {editingBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gold-300 max-w-lg w-full p-6 space-y-5 relative text-slate-800">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2 text-navy-900 font-bold uppercase text-xs tracking-wider">
                <Edit2 className="h-4 w-4 text-gold-600" />
                <span>Update Client Email & WhatsApp Number</span>
              </div>
              <button
                onClick={() => setEditingBooking(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Update the contact email ID or WhatsApp number for booking reference <strong>{editingBooking.id}</strong>. Updating this allows 1-click dispatch to the updated address or number.
            </p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEditedBooking(editingBooking);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingBooking.fullName}
                  onChange={(e) => setEditingBooking({ ...editingBooking, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-navy-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                  Client Email ID (For Zoom Invites & Invoices) *
                </label>
                <input
                  type="email"
                  required
                  value={editingBooking.email}
                  onChange={(e) => setEditingBooking({ ...editingBooking, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-navy-500 font-medium"
                  placeholder="client@example.com"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                  Client WhatsApp Phone Number (With Country Code) *
                </label>
                <input
                  type="text"
                  required
                  value={editingBooking.whatsApp}
                  onChange={(e) => setEditingBooking({ ...editingBooking, whatsApp: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-navy-500 font-mono font-bold text-emerald-800"
                  placeholder="+91 98765 43210"
                />
                <p className="text-[10px] text-slate-400 mt-1">Include country code (e.g., +91 for India, +44 for UK, +1 for USA/Canada).</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                    Consultation Date
                  </label>
                  <input
                    type="date"
                    required
                    value={editingBooking.date}
                    onChange={(e) => setEditingBooking({ ...editingBooking, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-navy-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                    Time Slot
                  </label>
                  <input
                    type="text"
                    required
                    value={editingBooking.timeSlot}
                    onChange={(e) => setEditingBooking({ ...editingBooking, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-navy-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold uppercase text-[10px] mb-1">
                  Zoom Meeting URL
                </label>
                <input
                  type="url"
                  required
                  value={editingBooking.zoomLink}
                  onChange={(e) => setEditingBooking({ ...editingBooking, zoomLink: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-navy-500 font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingBooking(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg uppercase tracking-wider text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg uppercase tracking-wider text-xs shadow transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="h-4 w-4" />
                  <span>Save Client Details</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 3D Secure Card OTP Authentication Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-navy-900 max-w-md w-full p-6 space-y-5 relative text-slate-800">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-navy-900 text-gold-400 rounded-lg">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold font-display text-navy-950 text-sm uppercase tracking-wider">3D Secure Card Authentication</h3>
                  <p className="text-[10px] text-slate-500">Verified by Visa / Mastercard Identity Check</p>
                </div>
              </div>
              <button 
                onClick={() => setShowOtpModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Merchant:</span>
                <strong className="text-navy-900">The Cricket Solutions (Prakash Palande)</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Card Number:</span>
                <strong className="font-mono text-slate-900">•••• {cardForm.cardNumber.slice(-4) || '5678'}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Amount:</span>
                <strong className="text-emerald-700 font-extrabold">{selectedPackage && formatPrice(selectedPackage.price)}</strong>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Enter One Time Password (OTP)
              </label>
              <p className="text-[11px] text-slate-500">
                An OTP code has been sent to your registered mobile number associated with your card ending in <strong>•••• {cardForm.cardNumber.slice(-4) || '5678'}</strong>.
              </p>

              <div className="relative">
                <input 
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => {
                    setOtpInput(e.target.value.replace(/[^0-9]/g, ''));
                    setOtpError('');
                  }}
                  placeholder="849201"
                  className="w-full text-center text-xl font-mono font-bold tracking-[0.5em] px-4 py-3 bg-slate-50 border-2 border-navy-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <span className="text-[10px] text-slate-400 block text-right mt-1 font-mono">Demo OTP prefilled: 849201</span>
              </div>

              {otpError && (
                <p className="text-xs text-red-600 font-bold flex items-center space-x-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>{otpError}</span>
                </p>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-150">
              <button
                type="button"
                onClick={handleConfirmOtp}
                className="w-full py-3 bg-navy-900 hover:bg-navy-950 text-gold-400 font-bold rounded-xl shadow-lg transition uppercase tracking-wider text-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Lock className="h-4 w-4 text-gold-400" />
                <span>Submit OTP & Complete Payment</span>
              </button>

              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition uppercase tracking-wider text-[11px] cursor-pointer"
              >
                Cancel Transaction
              </button>
            </div>

          </div>
        </div>
      )}

      {/* UPI App Push Payment Modal */}
      {showUpiPushModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-emerald-600 max-w-md w-full p-6 space-y-5 relative text-slate-800">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-emerald-600 text-white rounded-lg">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold font-display text-navy-950 text-sm uppercase tracking-wider">UPI Payment Request Sent</h3>
                  <p className="text-[10px] text-slate-500">Open your UPI App to approve request</p>
                </div>
              </div>
              <button 
                onClick={() => setShowUpiPushModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="text-center space-y-3 py-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Smartphone className="h-8 w-8" />
              </div>

              <div>
                <h4 className="font-bold text-navy-950 text-sm">Approve Collect Request in UPI App</h4>
                <p className="text-xs text-slate-600 mt-1">
                  We have sent a collect request of <strong className="text-emerald-700">{selectedPackage && formatPrice(selectedPackage.price)}</strong> to VPA <strong className="font-mono text-navy-900">{upiForm.upiId || bankDetails.upiId}</strong>.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left text-xs text-amber-900 space-y-1">
                <span className="font-bold block uppercase text-[10px] tracking-wider text-amber-800">Instructions:</span>
                <p>1. Open Google Pay / PhonePe / Paytm / BHIM on your smartphone.</p>
                <p>2. Tap on the incoming notification from <strong>The Cricket Solutions</strong>.</p>
                <p>3. Enter your 4 or 6-digit UPI PIN to authorize transfer.</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-150">
              <button
                type="button"
                onClick={handleConfirmUpiPush}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition uppercase tracking-wider text-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                <CheckCircle className="h-4 w-4" />
                <span>I Have Approved Payment in UPI App</span>
              </button>

              <button
                type="button"
                onClick={() => setShowUpiPushModal(false)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition uppercase tracking-wider text-[11px] cursor-pointer"
              >
                Cancel / Try Different Gateway
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Checkout Policy Confirmation Pop-up Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-gold-550 max-w-xl w-full p-6 space-y-5 relative text-slate-800">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 bg-navy-900 text-gold-400 rounded-lg animate-pulse">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold font-display text-navy-955 text-xs uppercase tracking-wider">Mandatory Checkout Confirmation</h3>
                  <p className="text-[10px] text-slate-500">Please review & accept policies to proceed</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-650 leading-relaxed space-y-3">
              <p>
                Before completing your paid online consultation booking, you must confirm that you have read and agreed to our 
                booking terms, refund policies, and outcome disclaimers.
              </p>

              {/* Collapsible Refund Policy in Pop-up Modal */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button 
                  type="button"
                  onClick={() => setIsCheckoutRefundPolicyOpen(!isCheckoutRefundPolicyOpen)}
                  className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-slate-100 transition cursor-pointer text-left text-[11px] font-bold text-navy-950 uppercase"
                >
                  <span className="flex items-center space-x-1.5">
                    <FileText className="h-4 w-4 text-gold-600" />
                    <span>Read Full Refund Policy</span>
                  </span>
                  {isCheckoutRefundPolicyOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {isCheckoutRefundPolicyOpen && (
                  <div className="p-4 border-t border-slate-200 bg-white max-h-[220px] overflow-y-auto text-[11px] leading-relaxed">
                    <RefundPolicyContent />
                  </div>
                )}
              </div>

              {/* Mandatory Statement and Checkbox */}
              <div className="flex items-start space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-150">
                <input 
                  type="checkbox" 
                  id="terms-popup-checkbox"
                  checked={modalCheckboxChecked}
                  onChange={(e) => setModalCheckboxChecked(e.target.checked)}
                  className="h-5 w-5 mt-0.5 rounded border-slate-300 text-gold-600 focus:ring-gold-500 cursor-pointer"
                />
                <label htmlFor="terms-popup-checkbox" className="text-slate-700 text-xs leading-relaxed font-semibold select-none cursor-pointer">
                  I have read, understood, and agree to the Terms & Conditions, Privacy Policy, Disclaimer, and Refund Policy of TheCricketAdvisor.com. I understand that all payments are final and non-refundable except where The Cricket Advisor is unable to provide the purchased service.
                </label>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[10px] text-amber-800 leading-relaxed font-light">
                <strong>Outcome Disclaimer Notice:</strong> I further acknowledge that no service offered by TheCricketAdvisor.com guarantees any result, placement, selection, contract, employment, visa approval, scholarship, sponsorship, or any other specific outcome.
              </div>
            </div>

            <div className="flex space-x-3 pt-2 border-t border-slate-150">
              <button
                type="button"
                onClick={() => {
                  setShowTermsModal(false);
                  setBookingStep(2); // Go back to calendar step
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg uppercase tracking-wider text-xs transition cursor-pointer text-center"
              >
                Go Back
              </button>

              <button
                type="button"
                disabled={!modalCheckboxChecked}
                onClick={() => {
                  setHasAcceptedTermsPopup(true);
                  setShowTermsModal(false);
                }}
                className="flex-1 py-2.5 bg-gold-gradient disabled:opacity-50 disabled:cursor-not-allowed text-navy-950 font-bold rounded-lg uppercase tracking-wider text-xs transition shadow-lg cursor-pointer"
              >
                Agree & Proceed
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Hidden print capture container for high-fidelity PDF downloads */}
      {cvToken && cvForm && (
        <div id="cv-capture-wrapper" style={{ position: 'absolute', left: '-9999px', top: '-9999px', pointerEvents: 'none' }} aria-hidden="true">
          <div id="cv-download-print-capture" style={{ width: '794px', position: 'relative', backgroundColor: '#ffffff' }}>
            <CVTemplateRenderer cv={cvForm} accentColour={cvForm.accentColour} font={cvForm.font} isPreview={false} />
          </div>
        </div>
      )}

      {isTransitioning && (
        <div className="fixed inset-0 bg-[#0B1A30]/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in font-sans">
          <div className="bg-white border-2 border-black p-8 rounded-2xl max-w-xs w-full text-center space-y-4 shadow-2xl">
            <div className="flex justify-center">
              <svg className="animate-spin h-10 w-10 text-[#D4AF37]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <p className="text-[#0B1A30] font-black text-sm tracking-wider uppercase">Loading...</p>
            <p className="text-slate-500 text-xs font-semibold">Please wait while we prepare your document.</p>
          </div>
        </div>
      )}

      {/* ============== COACHES CORNER PAGE ============== */}
      {activeTab === 'coaches' && (
        <CoachesCorner
          onClose={() => {
            setActiveTab('main');
          }}
          skillsList={skillsList}
        />
      )}

    </div>
  );
}
