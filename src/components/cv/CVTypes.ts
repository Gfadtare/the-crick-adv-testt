export interface CareerEntry {
  id: string;
  teamName: string;
  country: string;
  competition: string;
  startYear: string;
  endYear: string;
  role: string;
  captaincy: boolean;
  level: string;
  description: string;
}

export interface StatisticsBlock {
  id: string;
  format: string; // e.g. 'Test' | 'ODI' | 'T20I' | 'First-Class' | 'List A' | 'T20' | 'Domestic' | 'Club' | 'Youth' | 'Other'
  // Batting
  batMatches?: string;
  batInnings?: string;
  batRuns?: string;
  batHighestScore?: string;
  batAverage?: string;
  batStrikeRate?: string;
  batFifties?: string;
  batHundreds?: string;
  batFours?: string;
  batSixes?: string;
  // Bowling
  bowlMatches?: string;
  bowlInnings?: string;
  bowlOvers?: string;
  bowlRuns?: string;
  bowlWickets?: string;
  bowlBestBowling?: string;
  bowlAverage?: string;
  bowlEconomy?: string;
  bowlStrikeRate?: string;
  bowlFourWickets?: string;
  bowlFiveWickets?: string;
  bowlTenWickets?: string;
  // Fielding
  fieldCatches?: string;
  fieldRunOuts?: string;
  fieldStumpings?: string;
}

export interface FormatStats {
  hasStats: boolean;
  
  // Batting
  batMatches: number;
  batInnings: number;
  batNotOuts: number;
  batRuns: number;
  batHighestScore: number;
  batHighestNotOut: boolean;
  batBallsFaced: number;
  batFifties: number;
  batHundreds: number;
  batTwoHundreds?: number; // Only for Multi-Day

  // Bowling
  bowlMatches: number;
  bowlInnings: number;
  bowlOvers: number;
  bowlBalls: number;
  bowlRunsConceded: number;
  bowlWickets: number;
  bowlBestWickets: number;
  bowlBestRuns: number;
  bowlFourWickets: number;
  bowlFiveWickets: number;
  bowlTenWickets?: number; // Only for Multi-Day

  // Fielding
  fieldCatches: number;
  fieldRunOuts: number;
  fieldStumpings: number;
}

export const createDefaultFormatStats = (isMultiDay = false): FormatStats => ({
  hasStats: false,
  batMatches: 0,
  batInnings: 0,
  batNotOuts: 0,
  batRuns: 0,
  batHighestScore: 0,
  batHighestNotOut: false,
  batBallsFaced: 0,
  batFifties: 0,
  batHundreds: 0,
  ...(isMultiDay ? { batTwoHundreds: 0 } : {}),

  bowlMatches: 0,
  bowlInnings: 0,
  bowlOvers: 0,
  bowlBalls: 0,
  bowlRunsConceded: 0,
  bowlWickets: 0,
  bowlBestWickets: 0,
  bowlBestRuns: 0,
  bowlFourWickets: 0,
  bowlFiveWickets: 0,
  ...(isMultiDay ? { bowlTenWickets: 0 } : {}),

  fieldCatches: 0,
  fieldRunOuts: 0,
  fieldStumpings: 0
});

export interface Achievement {
  id: string;
  title: string;
  year: string;
  teamEvent: string;
  opponentTeam?: string;
  description: string;
}

export interface CareerHighlight {
  id: string;
  achievement: string;
  opponent: string;
  tournament: string;
  year: string;
}

export interface ProfessionalExperience {
  id: string;
  organisation: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  achievements: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
  educationType?: string;
  educationLevel?: string;
}

export interface Certification {
  id: string;
  certName: string;
  details: string;
  year: string;
}

export interface Reference {
  id: string;
  name: string;
  position: string;
  organisation: string;
  relationship: string;
  email: string;
  phone: string;
}

export interface CVUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface PlayerProfile {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  identityLocked: boolean;
  playerProfileId: string; // e.g. TCA-PP-2026-000001
}

export interface CricketCVFull {
  // Meta
  id: string;
  userId: string;
  playerProfileId: string;
  referenceNumber: string;    // TCA-CV-2026-XXXXXX
  templateId: string;          // 'executive' | 'professional' | 'international' | 'classic' | 'performance'
  font: string;                // 'Inter' | 'Montserrat' | 'Poppins' | etc.
  accentColour: string;        // hex code from curated list
  status: 'draft' | 'complete' | 'paid';
  version: number;
  createdAt: string;
  updatedAt: string;
  paymentStatus: 'Pending' | 'Paid';
  downloadStatus: 'LOCKED' | 'UNLOCKED';
  latestInvoiceNumber?: string;
  
  // Section 1 — Personal
  firstName: string;
  lastName: string;
  preferredName: string;
  dateOfBirth: string;
  nationality: string;
  countryOfResidence: string;
  currentCity: string;
  height: string;
  languages: string[];
  profilePhoto: string;       // base64 or URL
  personalWebsite: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  
  // New Player Level fields
  typeOfPlayerLevel?: string;
  highestLevelPlayed?: string;
  playerLevelCountry?: string;
  espnLink?: string;
  crickherosLink?: string;
  
  // Section 2 — Cricket Profile
  playingRole: string;          // 'Batter' | 'Bowler' | 'All-Rounder' | 'Wicket-Keeper'
  playingRoleDetail?: string;
  secondaryRole: string;
  battingStyle: string;         // 'Right-Handed' | 'Left-Handed'
  bowlingStyle: string;         // full bowling style
  isWicketkeeper: boolean;
  throwingArm: string;
  bowlingPace: string;
  careerLevel: string;
  currentTeam: string;
  currentClub: string;
  currentCountry: string;
  availability: string;
  overseasExperience: boolean;
  internationalExperience: boolean;
  aboutPlayer: string;          // Bio / profile statement
  
  // Section 3 — Playing Career
  careerHistory: CareerEntry[];
  
  // Section 4 — Statistics
  statistics: StatisticsBlock[];
  oneDayStats?: FormatStats;
  multiDayStats?: FormatStats;
  t20Stats?: FormatStats;
  
  // Section 5 — Career Highlights / Achievements
  achievements: Achievement[];
  
  // Section 5.5 — Career Highlights
  careerHighlights?: CareerHighlight[];
  
  // Section 6 — Professional Experience
  experience: ProfessionalExperience[];
  
  // Section 7 — Education & Certifications
  education: Education[];
  certifications: Certification[];
  
  // Section 7.5 — Fitness & Training
  fitnessActivities?: string[];

  // Section 7.6 — Hobbies
  hobbies?: string[];
  
  // Section 8 — Contact
  email: string;
  phone: string;
  
  // Section 9 — References
  references: Reference[];
  showReferences: 'show' | 'request';
  
  // Media Links section (5 fields)
  mediaLinks?: string[];
  
  // Consent
  declarationAccepted: boolean;
  
  // Edit tracking
  editsAllowed: number;         // 5 per year
  editsUsed: number;
  editPeriodStart: string;
  editPeriodEnd: string;

  // Stats visibility settings
  showBatting?: boolean;
  showBowling?: boolean;
  showFielding?: boolean;

  // Specialist Skills
  specialistSkills?: string[];
}

export const initialCVForm = (userId: string = '', email: string = '', firstName: string = '', lastName: string = ''): CricketCVFull => ({
  id: '',
  userId,
  playerProfileId: '',
  referenceNumber: '',
  templateId: 'prestige',
  font: 'Inter',
  accentColour: '#0B1A30', // Default Navy
  status: 'draft',
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  paymentStatus: 'Pending',
  downloadStatus: 'LOCKED',
  
  firstName,
  lastName,
  preferredName: '',
  dateOfBirth: '',
  nationality: '',
  countryOfResidence: '',
  currentCity: '',
  height: '',
  languages: [],
  profilePhoto: '',
  personalWebsite: '',
  linkedin: '',
  instagram: '',
  twitter: '',
  
  typeOfPlayerLevel: '',
  highestLevelPlayed: '',
  playerLevelCountry: '',
  espnLink: '',
  crickherosLink: '',
  
  playingRole: '',
  playingRoleDetail: '',
  secondaryRole: '',
  battingStyle: '',
  bowlingStyle: '',
  isWicketkeeper: false,
  throwingArm: '',
  bowlingPace: '',
  careerLevel: '',
  currentTeam: '',
  currentClub: '',
  currentCountry: '',
  availability: '',
  overseasExperience: false,
  internationalExperience: false,
  aboutPlayer: '',
  
  careerHistory: [],
  statistics: [],
  oneDayStats: createDefaultFormatStats(false),
  multiDayStats: createDefaultFormatStats(true),
  t20Stats: createDefaultFormatStats(false),
  achievements: [],
  careerHighlights: [],
  experience: [],
  education: [],
  certifications: [],
  fitnessActivities: [],
  hobbies: [],
  email,
  phone: '',
  
  references: [],
  showReferences: 'show',
  declarationAccepted: false,
  mediaLinks: ['', '', '', '', ''],
  
  editsAllowed: 5,
  editsUsed: 0,
  editPeriodStart: new Date().toISOString(),
  editPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),

  showBatting: true,
  showBowling: true,
  showFielding: true,
  specialistSkills: []
});

export const DEMO_CV_DATA: CricketCVFull = {
  id: 'demo-suresh-kothari',
  userId: 'demo-user-id',
  playerProfileId: 'TCA-PP-2026-999999',
  referenceNumber: 'TCA-CV-2026-DEMO99',
  templateId: 'prestige',
  font: 'Inter',
  accentColour: '#0B1A30',
  status: 'complete',
  version: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  paymentStatus: 'Pending',
  downloadStatus: 'LOCKED',
  
  firstName: 'Suresh',
  lastName: 'Kothari',
  preferredName: 'Suresh',
  dateOfBirth: '1998-05-12',
  nationality: 'Indian',
  countryOfResidence: 'India',
  currentCity: 'Mumbai',
  height: '182 cm',
  languages: ['English', 'Hindi', 'Marathi'],
  profilePhoto: '',
  personalWebsite: 'www.sureshkothari.example.com',
  linkedin: 'linkedin.com/in/suresh-kothari-cricket',
  instagram: '@sureshkothari_off',
  twitter: '@sureshkothari_88',
  
  playingRole: 'Batter',
  secondaryRole: 'Off-Spin Bowler',
  battingStyle: 'Right-Handed',
  bowlingStyle: 'Right-Arm Off-Break',
  isWicketkeeper: false,
  throwingArm: 'Right',
  bowlingPace: 'Slow',
  careerLevel: 'First-Class',
  currentTeam: 'Mumbai Ranji Team',
  currentClub: 'CCI Mumbai',
  currentCountry: 'India',
  availability: 'Fully Available',
  overseasExperience: true,
  internationalExperience: false,
  aboutPlayer: 'Aggressive top-order right-handed opening batsman and useful off-spinner. Known for a strong technical foundation, explosive powerplay scoring, and anchor innings capability in multi-day formats. Professional team player with overseas league experience.',
  
  careerHistory: [
    {
      id: 'h1',
      teamName: 'Mumbai Ranji Team',
      country: 'India',
      competition: 'Ranji Trophy (First-Class)',
      startYear: '2021',
      endYear: '2026',
      role: 'Opening Batsman',
      captaincy: false,
      level: 'Professional',
      description: 'Regular opener for the senior state team. Played multiple match-winning knocks and contributed to the tournament victory in the 2023/24 season.'
    },
    {
      id: 'h2',
      teamName: 'CCI Mumbai',
      country: 'India',
      competition: 'A Division League',
      startYear: '2018',
      endYear: '2026',
      role: 'Top-order Batsman & Off-spinner',
      captaincy: true,
      level: 'Club',
      description: 'Captained the team in 2024. Maintained an average of 48.5 with the bat and took 22 wickets.'
    },
    {
      id: 'h3',
      teamName: 'Lancashire League Club',
      country: 'United Kingdom',
      competition: 'Overseas Professional League',
      startYear: '2023',
      endYear: '2023',
      role: 'Overseas Professional',
      captaincy: false,
      level: 'Club',
      description: 'Scored 840 runs in a single season average of 56.0 with 3 centuries, and took 28 wickets as a primary bowling option.'
    }
  ],
  
  statistics: [
    {
      id: 's1',
      format: 'First-Class',
      batMatches: '24',
      batInnings: '42',
      batRuns: '1680',
      batHighestScore: '164',
      batAverage: '42.00',
      batStrikeRate: '58.50',
      batFifties: '9',
      batHundreds: '4',
      batFours: '198',
      batSixes: '12',
      bowlMatches: '24',
      bowlInnings: '18',
      bowlOvers: '120.4',
      bowlRuns: '420',
      bowlWickets: '15',
      bowlBestBowling: '3/45',
      bowlAverage: '28.00',
      bowlEconomy: '3.48',
      bowlStrikeRate: '48.20'
    },
    {
      id: 's2',
      format: 'List A',
      batMatches: '32',
      batInnings: '32',
      batRuns: '1240',
      batHighestScore: '118',
      batAverage: '41.33',
      batStrikeRate: '86.40',
      batFifties: '7',
      batHundreds: '2',
      batFours: '112',
      batSixes: '22',
      bowlMatches: '32',
      bowlInnings: '24',
      bowlOvers: '154.0',
      bowlRuns: '685',
      bowlWickets: '24',
      bowlBestBowling: '4/32',
      bowlAverage: '28.54',
      bowlEconomy: '4.44',
      bowlStrikeRate: '38.50'
    }
  ],
  
  achievements: [
    {
      id: 'a1',
      title: 'Best Batsman Award',
      year: '2024',
      teamEvent: 'CCI Mumbai Annual Awards',
      description: 'Awarded for scoring highest runs in the local top-tier league.'
    },
    {
      id: 'a2',
      title: 'Ranji Trophy Winner',
      year: '2024',
      teamEvent: 'Mumbai Ranji Team',
      description: 'Part of the championship-winning squad, contributing a vital 92 in the semi-finals.'
    }
  ],
  
  experience: [
    {
      id: 'e1',
      organisation: 'Cricket Academy of Mumbai',
      position: 'Assistant Batting Coach (Part-time)',
      location: 'Mumbai, India',
      startDate: '2022',
      endDate: '2026',
      responsibilities: 'Coaching junior batting talents aged 14-19 on batting technique and temperament.',
      achievements: 'Assisted 3 junior cricketers to break into the state under-16 selections.'
    }
  ],
  
  education: [
    {
      id: 'edu1',
      school: 'Mumbai University',
      degree: 'Bachelor of Commerce',
      year: '2020'
    }
  ],
  
  certifications: [
    {
      id: 'c1',
      certName: 'ICC Level 1 Coaching Certificate',
      details: 'Certified cricket coach under ICC training curriculum.',
      year: '2022'
    }
  ],
  fitnessActivities: [],
  hobbies: [],
  careerHighlights: [],
  oneDayStats: {
    hasStats: true,
    batMatches: 45,
    batInnings: 42,
    batNotOuts: 6,
    batRuns: 1450,
    batHighestScore: 92,
    batHighestNotOut: true,
    batBallsFaced: 1650,
    batFifties: 11,
    batHundreds: 0,
    bowlMatches: 45,
    bowlInnings: 38,
    bowlOvers: 240,
    bowlBalls: 2,
    bowlRunsConceded: 1080,
    bowlWickets: 52,
    bowlBestWickets: 4,
    bowlBestRuns: 28,
    bowlFourWickets: 3,
    bowlFiveWickets: 0,
    fieldCatches: 18,
    fieldRunOuts: 4,
    fieldStumpings: 0
  },
  multiDayStats: {
    hasStats: true,
    batMatches: 12,
    batInnings: 20,
    batNotOuts: 2,
    batRuns: 850,
    batHighestScore: 145,
    batHighestNotOut: false,
    batBallsFaced: 1950,
    batFifties: 5,
    batHundreds: 2,
    batTwoHundreds: 0,
    bowlMatches: 12,
    bowlInnings: 18,
    bowlOvers: 190,
    bowlBalls: 0,
    bowlRunsConceded: 720,
    bowlWickets: 35,
    bowlBestWickets: 5,
    bowlBestRuns: 45,
    bowlFourWickets: 2,
    bowlFiveWickets: 1,
    bowlTenWickets: 0,
    fieldCatches: 8,
    fieldRunOuts: 1,
    fieldStumpings: 0
  },
  t20Stats: {
    hasStats: true,
    batMatches: 65,
    batInnings: 60,
    batNotOuts: 12,
    batRuns: 1820,
    batHighestScore: 102,
    batHighestNotOut: true,
    batBallsFaced: 1380,
    batFifties: 12,
    batHundreds: 1,
    bowlMatches: 65,
    bowlInnings: 55,
    bowlOvers: 198,
    bowlBalls: 4,
    bowlRunsConceded: 1485,
    bowlWickets: 68,
    bowlBestWickets: 5,
    bowlBestRuns: 18,
    bowlFourWickets: 2,
    bowlFiveWickets: 1,
    fieldCatches: 25,
    fieldRunOuts: 8,
    fieldStumpings: 0
  },
  email: 'suresh.kothari@example.com',
  phone: '+91 98765 43210',
  
  references: [
    {
      id: 'ref1',
      name: 'Amol Muzumdar',
      position: 'Head Coach / Former Cricketer',
      organisation: 'Mumbai Cricket Association',
      relationship: 'Mentor & Head Coach',
      email: 'amol.muzumdar@example.com',
      phone: '+91 99999 88888'
    }
  ],
  
  showReferences: 'show',
  declarationAccepted: true,
  mediaLinks: ['https://cricheroes.in/player-profile/999999/Suresh-Kothari', 'https://www.espncricinfo.com/player/suresh-kothari-999999', '', '', ''],
  
  editsAllowed: 5,
  editsUsed: 0,
  editPeriodStart: new Date().toISOString(),
  editPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),

  specialistSkills: [
    "Bowling Sharp Yorkers",
    "Power Hitting",
    "Death Overs Bowling"
  ]
};
