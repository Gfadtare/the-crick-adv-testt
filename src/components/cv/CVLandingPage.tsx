import React, { useState } from 'react';
import { 
  CheckCircle, 
  FileText, 
  Globe, 
  Layers, 
  ArrowRight, 
  HelpCircle, 
  Shield, 
  TrendingUp, 
  Briefcase 
} from 'lucide-react';
import CVLivePreview from './CVLivePreview';
import { CricketCVFull } from './CVTypes';

const demoCV: CricketCVFull = {
  id: "demo_cv",
  userId: "demo_user",
  playerProfileId: "TCA-PP-2026-000001",
  referenceNumber: "TCA-CV-2026-DEMO",
  templateId: "prestige",
  font: "Inter",
  accentColour: "#0B1A30",
  status: "draft",
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  paymentStatus: "Pending",
  downloadStatus: "LOCKED",
  firstName: "Prakash",
  lastName: "Palande",
  preferredName: "Prakash",
  dateOfBirth: "1994-05-18",
  email: "prakash.palande@example.com",
  phone: "+91 98765 43210",
  countryOfResidence: "India",
  currentCity: "Mumbai",
  nationality: "Indian",
  height: "5ft 11in",
  languages: ["English", "Hindi", "Marathi"],
  profilePhoto: "",
  personalWebsite: "",
  linkedin: "",
  instagram: "",
  twitter: "",
  playingRole: "All-Rounder",
  secondaryRole: "Middle-order Batsman",
  battingStyle: "Right-hand Bat",
  bowlingStyle: "Right-arm Off-break",
  isWicketkeeper: false,
  throwingArm: "Right",
  bowlingPace: "Medium",
  careerLevel: "First-Class",
  currentTeam: "Mumbai",
  currentClub: "Shivaji Park Gymkhana",
  currentCountry: "India",
  availability: "Available for UK league 2026",
  overseasExperience: false,
  internationalExperience: false,
  aboutPlayer: "Aggressive batting all-rounder and proven match-winner with extensive experience in domestic leagues, currently representing Mumbai. Looking for overseas club cricket opportunities in the UK.",
  careerHistory: [
    { id: "ch1", teamName: "Mumbai Cricket Association", role: "All-Rounder", level: "Domestic First Class", country: "India", startYear: "2018", endYear: "Present", competition: "Ranji Trophy", captaincy: false, description: "Consistent matches in domestic 4-day cricket." },
    { id: "ch2", teamName: "Shivaji Park Gymkhana", role: "Captain", level: "Club League Division A", country: "India", startYear: "2015", endYear: "2018", competition: "Kanga League", captaincy: true, description: "Led the first XI team to league title." }
  ],
  statistics: [
    { id: "s1", format: "First Class", batMatches: "45", batRuns: "1850", batAverage: "42.5", batHighestScore: "142*", bowlMatches: "45", bowlWickets: "68", bowlAverage: "24.2", bowlBestBowling: "5/32" },
    { id: "s2", format: "One Day", batMatches: "82", batRuns: "2940", batAverage: "38.6", batHighestScore: "118", bowlMatches: "82", bowlWickets: "94", bowlAverage: "28.5", bowlBestBowling: "4/28" },
    { id: "s3", format: "T20", batMatches: "64", batRuns: "1480", batAverage: "29.6", batHighestScore: "88*", bowlMatches: "64", bowlWickets: "52", bowlAverage: "22.1", bowlBestBowling: "4/15" }
  ],
  achievements: [
    { id: "a1", title: "Ranji Trophy Champion", year: "2022", teamEvent: "Mumbai Team", description: "Contributed 420 runs and 18 wickets in the tournament." },
    { id: "a2", title: "Best All-Rounder", year: "2020", teamEvent: "MCA Invitation League", description: "Finished as highest wicket taker and 3rd highest run scorer." }
  ],
  experience: [],
  education: [],
  certifications: [],
  references: [
    { id: "r1", name: "Amol Mujumdar", relationship: "Coach", email: "mumbaicoach@example.com", phone: "+91 99999 88888", position: "Head Coach", organisation: "Mumbai Cricket Team" }
  ],
  showReferences: "show",
  declarationAccepted: true,
  editsAllowed: 5,
  editsUsed: 0,
  editPeriodStart: "",
  editPeriodEnd: ""
};

interface CVLandingPageProps {
  onStartBuilding: () => void;
  isLoggedIn: boolean;
  hasPaidCV: boolean;
  onGoToDashboard: () => void;
  onTriggerLogin: () => void;
  onTriggerSignup: () => void;
}

export default function CVLandingPage({ 
  onStartBuilding, 
  isLoggedIn, 
  hasPaidCV, 
  onGoToDashboard,
  onTriggerLogin,
  onTriggerSignup
}: CVLandingPageProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<'executive' | 'professional' | 'international' | 'classic' | 'performance'>('executive');

  const getAccentColour = (templateId: string) => {
    switch (templateId) {
      case 'professional': return '#991B1B';
      case 'international': return '#065F46';
      case 'classic': return '#1F2937';
      case 'performance': return '#B45309';
      case 'executive':
      default: return '#0B1A30';
    }
  };

  const faqs = [
    {
      q: "How much does it cost?",
      a: "The premium Cricket CV Builder costs a one-time payment of ₹249. There are no hidden subscription charges."
    },
    {
      q: "How many edits do I get?",
      a: "You get 5 complete updates/edits per year. This allows you to update your statistics, new club performances, and career milestones as the season progresses."
    },
    {
      q: "Can I preview my CV before paying?",
      a: "Yes! You can complete the entire form and view a full live preview of your CV with a subtle watermark. You only pay when you are ready to download the clean, premium PDF."
    },
    {
      q: "Why is my name and DOB locked after purchase?",
      a: "To prevent account sharing and abuse, your core identity information (Full Name, DOB, Nationality) is locked after your first successful purchase. One account belongs to one player identity."
    },
    {
      q: "What design templates are available?",
      a: "We offer 5 cricket-specific designs: The Executive (corporate), The Professional (stats-focused), The International (for overseas placements), The Classic (traditional layout), and The Performance (highly data-heavy)."
    }
  ];

  return (
    <div className="bg-[#0B1A30] text-slate-100 min-h-screen font-sans">
      {/* Top Header subbar for account authentication */}
      <div className="max-w-6xl mx-auto px-4 pt-6 flex justify-end gap-3 relative z-20">
        {isLoggedIn ? (
          <button 
            onClick={onGoToDashboard}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-750 transition cursor-pointer font-sans"
          >
            MY DASHBOARD
          </button>
        ) : (
          <>
            <button 
              onClick={onTriggerLogin}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gold-gradient text-navy-950 hover:opacity-90 transition cursor-pointer font-sans shadow-md"
            >
              LOG IN
            </button>
            <button 
              onClick={onTriggerSignup}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gold-gradient text-navy-950 hover:opacity-90 transition cursor-pointer font-sans shadow-md"
            >
              SIGN UP
            </button>
          </>
        )}
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 md:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-radial-gradient from-blue-900/40 via-transparent to-transparent opacity-50" />
        <div className="max-w-6xl mx-auto text-center relative z-10">

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
            Build a Cricket CV <br/>
            <span className="text-gradient-gold">That Gets You Noticed.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-light max-w-3xl mx-auto mb-10 leading-relaxed font-sans">
            Create a professional, cricket-specific CV designed to showcase your playing career, statistics, achievements and experience to clubs, teams, selectors, academies and overseas organisations.
          </p>

          <div className="flex justify-center items-center">
            {hasPaidCV ? (
              <button 
                onClick={onGoToDashboard}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-gold-gradient text-navy-950 hover:shadow-lg hover:shadow-gold-500/20 transition-all duration-300 flex items-center justify-center gap-2 text-base cursor-pointer font-sans"
              >
                Go to My Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={onStartBuilding}
                className="w-full sm:w-auto px-10 py-4.5 rounded-xl font-bold bg-gold-gradient text-navy-950 hover:shadow-lg hover:shadow-gold-500/20 transition-all duration-300 flex items-center justify-center gap-2 text-base cursor-pointer font-sans"
              >
                CREATE MY CRICKET CV <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="mt-8 text-lg md:text-xl text-slate-200 font-sans font-semibold">
            Includes 5 annual edits • Free live preview
          </div>
        </div>
      </section>
    </div>
  );
}
