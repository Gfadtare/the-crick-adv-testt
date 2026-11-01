import React, { useState } from 'react';
import { CricketCVFull, CareerEntry, StatisticsBlock, Achievement, ProfessionalExperience, Education, Certification, Reference, CareerHighlight, createDefaultFormatStats, FormatStats } from './CVTypes';
import CricketNumberSelector from './CricketNumberSelector';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  AlertCircle,
  FileText,
  Activity,
  Layers,
  Award,
  BookOpen,
  Link2
} from 'lucide-react';
import CVFontSelector from './CVFontSelector';
import CVColourSelector from './CVColourSelector';

interface CVBuilderFormProps {
  cv: CricketCVFull;
  onChange: (cv: CricketCVFull) => void;
  onSaveDraft: (cv: CricketCVFull) => Promise<void>;
  onNext: (cv: CricketCVFull) => void | Promise<void>;
  onPrev: () => void;
  isSaving: boolean;
  isIdentityLocked: boolean;
}

const getEducationLevels = (type: string): string[] => {
  switch (type) {
    case 'School':
      return ['Secondary School', 'High School', 'Higher Secondary'];
    case 'College':
      return ['Junior College', 'Senior College'];
    case 'Diploma':
      return ['Diploma', 'Advanced Diploma'];
    case 'Bachelor\'s Degree':
      return ['BA', 'BSc', 'BCom', 'BBA', 'BTech', 'BE'];
    case 'Master\'s Degree':
      return ['MA', 'MSc', 'MCom', 'MBA', 'MTech', 'ME'];
    case 'Doctorate / PhD':
      return ['PhD', 'Doctoral Degree'];
    default:
      return [];
  }
};

const FITNESS_OPTIONS = [
  'Cricket-Specific Fitness & Conditioning',
  'Strength & Resistance Training (Gym)',
  'Speed, Agility & Quickness Training',
  'Running & Sprint Training',
  'Endurance & Cardiovascular Training',
  'Functional Training',
  'Core Strength & Stability Training',
  'Mobility & Flexibility Training',
  'Conditioning Training',
  'Yoga & Pilates',
  'Swimming',
  'Cycling'
];

const LANGUAGES_OPTIONS = [
  'English',
  'Hindi',
  'Marathi',
  'Spanish',
  'French',
  'German',
  'Gujarati',
  'Tamil',
  'Telugu',
  'Kannada',
  'Bengali',
  'Punjabi',
  'Urdu'
];

const HOBBIES_OPTIONS = [
  'Reading',
  'Travelling',
  'Music',
  'Gaming',
  'Cooking',
  'Photography',
  'Cycling',
  'Swimming',
  'Running',
  'Gym / Workout',
  'Golf',
  'Chess',
  'Hiking / Trekking',
  'Watch Movies'
];

const calculateAge = (dobString?: string) => {
  if (!dobString) return '-';
  if (/^\d+$/.test(dobString.trim()) || dobString.toLowerCase().includes('year')) {
    return dobString.trim();
  }
  const year = parseInt(dobString.split('-')[0], 10);
  if (isNaN(year)) return dobString;
  return new Date().getFullYear() - year;
};

export default function CVBuilderForm({
  cv,
  onChange,
  onSaveDraft,
  onNext,
  onPrev,
  isSaving,
  isIdentityLocked
}: CVBuilderFormProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [openLanguages, setOpenLanguages] = useState<boolean>(false);
  const [openHobbies, setOpenHobbies] = useState<boolean>(false);
  const steps = [
    { num: 1, name: 'Personal', desc: 'Basic Details' },
    { num: 2, name: 'Cricket Profile', desc: 'Playing Role & Style' },
    { num: 3, name: 'Experience & Teams', desc: 'Teams & Clubs' },
    { num: 4, name: 'Statistics', desc: 'Stats Log' },
    { num: 5, name: 'Scorecard, Profile & Media Links', desc: 'Online Profiles & Media' },
    { num: 6, name: 'Specialist Cricket Skills', desc: 'Core Skills' },
    { num: 7, name: 'Achievements', desc: 'Major Highlights' },
    { num: 8, name: 'Career Highlights', desc: 'Athletic Highlights' },
    { num: 9, name: 'Education', desc: 'Academic & Qualifications' },
    { num: 10, name: 'Contact', desc: 'Contact Info' },
    { num: 11, name: 'Languages & Hobbies', desc: 'Interests & Languages' }
  ];

  const [validationError, setValidationError] = useState<string>('');
  const [localBestBowling, setLocalBestBowling] = useState<string>('');

  React.useEffect(() => {
    const stats = cv.oneDayStats || { bowlBestWickets: 0, bowlBestRuns: 0 };
    if (stats.bowlBestWickets || stats.bowlBestRuns) {
      setLocalBestBowling(`${stats.bowlBestWickets}/${stats.bowlBestRuns}`);
    } else {
      setLocalBestBowling('');
    }
  }, [cv.id, currentStep, cv.oneDayStats?.bowlBestWickets, cv.oneDayStats?.bowlBestRuns]);

  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(null);
  const [visibleLinksCount, setVisibleLinksCount] = useState<number>(1);

  React.useEffect(() => {
    const filledCount = cv.mediaLinks?.filter(l => l && l.trim() !== '').length || 0;
    setVisibleLinksCount(Math.max(1, filledCount));
  }, [cv.id]);
  const [highlightForm, setHighlightForm] = useState<{
    achievement: string;
    opponent: string;
    tournament: string;
    year: string;
  }>({
    achievement: '',
    opponent: '',
    tournament: '',
    year: '2026'
  });

  const handleSaveHighlight = () => {
    if (!highlightForm.achievement) {
      setValidationError("Achievement is required.");
      return;
    }
    if (!highlightForm.opponent.trim()) {
      setValidationError("Opponent Team is required.");
      return;
    }
    if (!highlightForm.tournament.trim()) {
      setValidationError("Tournament Name is required.");
      return;
    }
    if (!highlightForm.year) {
      setValidationError("Year is required.");
      return;
    }
    const yVal = parseInt(highlightForm.year, 10);
    if (isNaN(yVal) || yVal < 2005 || yVal > 2026) {
      setValidationError("Year must be between 2005 and 2026.");
      return;
    }

    setValidationError(""); // clear any validation error

    if (editingHighlightId === 'new') {
      addCareerHighlight(highlightForm);
    } else if (editingHighlightId) {
      updateCareerHighlight(editingHighlightId, highlightForm);
    }

    setEditingHighlightId(null);
  };

  const validateStep1 = (): string => {
    if (!cv.firstName || !cv.firstName.trim()) return "First Name is required.";
    if (!cv.lastName || !cv.lastName.trim()) return "Last Name is required.";
    if (!cv.dateOfBirth) return "Date of Birth is required.";
    if (!cv.nationality || !cv.nationality.trim()) return "Nationality is required.";
    if (!cv.typeOfPlayerLevel) {
      return "Please select your Type of Player Level.";
    }
    if (!cv.highestLevelPlayed) {
      return "Please select your Highest Level Played.";
    }
    return '';
  };

  const validateStep2 = (): string => {
    if (!cv.playingRole) {
      return "Please select your Playing Role.";
    }
    if (!cv.playingRoleDetail) {
      return "Please select your Playing Role Subtype.";
    }
    if (!cv.battingStyle) return "Please select your Batting Style.";
    if (!cv.aboutPlayer || !cv.aboutPlayer.trim()) return "Please fill in the About Player bio section.";
    const wordCount = cv.aboutPlayer ? cv.aboutPlayer.trim().split(/\s+/).filter(Boolean).length : 0;
    if (wordCount > 120) {
      return "About Player section cannot exceed 120 words to ensure it fits on Page 1. Please shorten your bio.";
    }
    // Count paragraph breaks (consecutive blank lines count as one)
    const paragraphCount = cv.aboutPlayer.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    if (paragraphCount > 4) {
      return "About Player section cannot have more than 4 paragraphs to ensure it fits on Page 1. Please merge some paragraphs.";
    }
    return '';
  };

  const validateStep3 = (): string => {
    if (cv.careerHistory && cv.careerHistory.length > 0) {
      for (let i = 0; i < cv.careerHistory.length; i++) {
        const item = cv.careerHistory[i];
        if (!item.teamName || !item.teamName.trim()) return `Team Name is required for experience entry #${i+1}.`;
        if (!item.startYear) return `Start Year is required for experience entry #${i+1}.`;
        if (!item.endYear) return `End Year is required for experience entry #${i+1}.`;
      }
    } else {
      return "Please add at least one playing career experience entry.";
    }
    return '';
  };

  const validateStep4 = (): string => {
    const stats = cv.oneDayStats || createDefaultFormatStats(false);
    if (!stats.hasStats) {
      return '';
    }
    const showBatting = cv.showBatting !== false;
    const showBowling = cv.showBowling !== false;
    if (showBatting && (stats.batMatches || 0) === 0) {
      return "Please enter matches played for Batting Statistics, or disable Batting in settings.";
    }
    if (showBowling) {
      const matches = stats.bowlMatches || 0;
      if (matches === 0) {
        return "Please enter matches played for Bowling Statistics, or disable Bowling in settings.";
      }
      const fourWkts = stats.bowlFourWickets || 0;
      const fiveWkts = stats.bowlFiveWickets || 0;
      if (fourWkts > matches) {
        return "4-Wicket Hauls cannot exceed the number of matches played.";
      }
      if (fiveWkts > matches) {
        return "5-Wicket Hauls cannot exceed the number of matches played.";
      }
      if (fourWkts + fiveWkts > matches) {
        return "The combined 4-wicket and 5-wicket hauls cannot exceed the number of matches played.";
      }
    }
    return '';
  };

  const validateStep6 = (): string => {
    if (cv.achievements && cv.achievements.length > 0) {
      for (let i = 0; i < cv.achievements.length; i++) {
        const ach = cv.achievements[i];
        if (!ach.title || !ach.title.trim()) return `Achievement Title is required for achievement #${i+1}.`;
        if (!ach.year) return `Achievement Year is required for achievement #${i+1}.`;
        if (!ach.teamEvent || !ach.teamEvent.trim()) return `Team/Event is required for achievement #${i+1}.`;
      }
    }
    return '';
  };

  const validateStep7 = (): string => {
    if (cv.careerHighlights && cv.careerHighlights.length > 0) {
      for (let i = 0; i < cv.careerHighlights.length; i++) {
        const hl = cv.careerHighlights[i];
        if (!hl.achievement || !hl.achievement.trim()) return `Highlight Detail/Score is required for highlight #${i+1}.`;
        if (!hl.opponent || !hl.opponent.trim()) return `Opponent is required for highlight #${i+1}.`;
        if (!hl.tournament || !hl.tournament.trim()) return `Tournament is required for highlight #${i+1}.`;
        if (!hl.year) return `Year is required for highlight #${i+1}.`;
      }
    }
    return '';
  };

  const validateStep8 = (): string => {
    if (cv.education && cv.education.length > 0) {
      for (let i = 0; i < cv.education.length; i++) {
        const edu = cv.education[i];
        if (!edu.degree || !edu.degree.trim()) return `Degree is required for education entry #${i+1}.`;
        if (!edu.year) return `Graduation Year is required for education entry #${i+1}.`;
      }
    } else {
      return "Please add at least one education entry.";
    }
    return '';
  };

  const validateStep9 = (): string => {
    if (!cv.email || !cv.email.trim()) return "Email address is required.";
    if (!cv.phone || !cv.phone.trim()) return "Phone number is required.";

    // Validate references setting selection
    if (!cv.showReferences || (cv.showReferences !== 'show' && cv.showReferences !== 'request')) {
      return "Please select a References Display Setting option (Display directly on CV or Available upon request).";
    }

    if (cv.showReferences === 'show') {
      if (!cv.references || cv.references.length === 0) {
        return "At least one reference is required when 'Display directly on CV' is selected. Please click 'Add Reference' or choose 'Available upon request'.";
      }
      for (let i = 0; i < cv.references.length; i++) {
        const ref = cv.references[i];
        if (!ref.name || !ref.name.trim()) {
          return `Name is required for reference entry #${i + 1}.`;
        }
        if (!ref.organisation || !ref.organisation.trim()) {
          return `Organisation is required for reference entry #${i + 1}.`;
        }
        
        let phoneRest = ref.phone || '';
        for (const code of ['+91', '+44', '+61', '+971', '+1', '+27', '+64', '+94', '+968', '+263']) {
          if (phoneRest.startsWith(code)) {
            phoneRest = phoneRest.substring(code.length).trim();
            break;
          }
        }
        if (!phoneRest || !phoneRest.trim()) {
          return `Mobile Number is required for reference entry #${i + 1}.`;
        }
      }
    }

    return '';
  };

  const validateStep10 = (): string => {
    if (!cv.languages || cv.languages.length === 0) return "Please select at least one Language.";
    if (!cv.hobbies || cv.hobbies.length === 0) return "Please select at least one Hobby.";
    return '';
  };

  const updateCVField = (field: keyof CricketCVFull, value: any) => {
    onChange({
      ...cv,
      [field]: value
    });
  };

  const handleNextStep = () => {
    if (editingHighlightId !== null) {
      setValidationError("Please save or cancel your current career highlight entry first.");
      return;
    }
    let err = '';
    if (currentStep === 1) err = validateStep1();
    else if (currentStep === 2) err = validateStep2();
    else if (currentStep === 3) err = validateStep3();
    else if (currentStep === 4) err = validateStep4();
    else if (currentStep === 5) {
      // Scorecard, Profile & Media Links (no validation / optional)
      err = '';
    }
    else if (currentStep === 6) {
      const selectedCount = cv.specialistSkills?.length || 0;
      if (selectedCount === 0) {
        err = "Please select at least 1 specialist skill.";
      } else if (selectedCount > 5) {
        err = "You can select a maximum of 5 specialist skills.";
      }
    }
    else if (currentStep === 7) err = validateStep6();
    else if (currentStep === 8) err = validateStep7();
    else if (currentStep === 9) err = validateStep8();
    else if (currentStep === 10) err = validateStep9();
    else if (currentStep === 11) err = validateStep10();

    if (err) {
      setValidationError(err);
      return;
    }

    setValidationError('');
    onSaveDraft(cv);
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      onNext(cv);
    }
  };

  const handlePrevStep = () => {
    setValidationError('');
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    } else {
      onPrev();
    }
  };

  // Add/Remove Helpers
  const sortCareerHistory = (history: CareerEntry[]): CareerEntry[] => {
    return [...history].sort((a, b) => {
      const aEnd = a.endYear || '';
      const bEnd = b.endYear || '';
      const aStart = parseInt(a.startYear, 10) || 0;
      const bStart = parseInt(b.startYear, 10) || 0;

      const aIsPresent = aEnd.toLowerCase() === 'present';
      const bIsPresent = bEnd.toLowerCase() === 'present';
      if (aIsPresent && !bIsPresent) return -1;
      if (!aIsPresent && bIsPresent) return 1;

      if (aIsPresent && bIsPresent) {
        return bStart - aStart;
      }

      const aEndNum = parseInt(aEnd, 10) || 0;
      const bEndNum = parseInt(bEnd, 10) || 0;
      if (aEndNum !== bEndNum) {
        return bEndNum - aEndNum;
      }

      return bStart - aStart;
    });
  };

  const addCareerEntry = () => {
    const entry: CareerEntry = {
      id: `career-${Date.now()}`,
      teamName: '',
      country: '',
      competition: '',
      startYear: '',
      endYear: '',
      role: 'Player',
      captaincy: false,
      level: 'Club',
      description: ''
    };
    updateCVField('careerHistory', sortCareerHistory([...cv.careerHistory, entry]));
  };

  const removeCareerEntry = (id: string) => {
    updateCVField('careerHistory', cv.careerHistory.filter(c => c.id !== id));
  };

  const updateCareerEntry = (id: string, field: keyof CareerEntry, value: any) => {
    const updated = cv.careerHistory.map(c => c.id === id ? { ...c, [field]: value } : c);
    updateCVField('careerHistory', sortCareerHistory(updated));
  };

  const addStatBlock = () => {
    const block: StatisticsBlock = {
      id: `stat-${Date.now()}`,
      format: 'Club',
      batMatches: '',
      batInnings: '',
      batRuns: '',
      batHighestScore: '',
      batAverage: '',
      batStrikeRate: '',
      batFifties: '',
      batHundreds: '',
      bowlWickets: '',
      bowlBestBowling: '',
      bowlAverage: '',
      bowlEconomy: ''
    };
    updateCVField('statistics', [...cv.statistics, block]);
  };

  const updateStatBlock = (id: string, field: keyof StatisticsBlock, value: any) => {
    updateCVField('statistics', cv.statistics.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeStatBlock = (id: string) => {
    updateCVField('statistics', cv.statistics.filter(s => s.id !== id));
  };

  const updateFormatStats = (format: 'oneDay' | 'multiDay' | 't20', field: keyof FormatStats, value: any) => {
    const statsField = format === 'oneDay' ? 'oneDayStats' : format === 'multiDay' ? 'multiDayStats' : 't20Stats';
    const currentStats = cv[statsField] || createDefaultFormatStats(format === 'multiDay');
    
    let validatedValue = value;
    if (typeof value === 'number') {
      validatedValue = Math.max(0, value);
    }
    
    if (field === 'batNotOuts') {
      const innings = currentStats.batInnings;
      if (validatedValue > innings) {
        validatedValue = innings;
      }
    }

    if (field === 'batInnings') {
      const matches = currentStats.batMatches;
      if (validatedValue > matches) {
        validatedValue = matches;
      }
      const notOuts = currentStats.batNotOuts;
      let newNotOuts = notOuts;
      if (notOuts > validatedValue) {
        newNotOuts = validatedValue;
      }
      updateCVField(statsField, {
        ...currentStats,
        batInnings: validatedValue,
        batNotOuts: newNotOuts
      });
      return;
    }

    if (field === 'bowlInnings') {
      const matches = currentStats.bowlMatches;
      if (validatedValue > matches) {
        validatedValue = matches;
      }
    }

    if (field === 'bowlMatches') {
      const innings = currentStats.bowlInnings;
      let newInnings = innings;
      if (innings > validatedValue) {
        newInnings = validatedValue;
      }
      updateCVField(statsField, {
        ...currentStats,
        bowlMatches: validatedValue,
        bowlInnings: newInnings
      });
      return;
    }

    if (field === 'batMatches') {
      const innings = currentStats.batInnings;
      let newInnings = innings;
      if (innings > validatedValue) {
        newInnings = validatedValue;
      }
      const notOuts = currentStats.batNotOuts;
      let newNotOuts = notOuts;
      if (notOuts > newInnings) {
        newNotOuts = newInnings;
      }
      updateCVField(statsField, {
        ...currentStats,
        batMatches: validatedValue,
        batInnings: newInnings,
        batNotOuts: newNotOuts
      });
      return;
    }
    
    if (field === 'bowlBalls') {
      validatedValue = Math.max(0, Math.min(5, validatedValue));
    }

    updateCVField(statsField, {
      ...currentStats,
      [field]: validatedValue
    });
  };

  const addAchievement = () => {
    const ach: Achievement = {
      id: `ach-${Date.now()}`,
      title: '',
      year: '',
      teamEvent: '',
      opponentTeam: '',
      description: ''
    };
    updateCVField('achievements', [...cv.achievements, ach]);
  };

  const updateAchievement = (id: string, fieldOrUpdates: keyof Achievement | Partial<Achievement>, value?: any) => {
    if (typeof fieldOrUpdates === 'object') {
      updateCVField('achievements', cv.achievements.map(a => a.id === id ? { ...a, ...fieldOrUpdates } : a));
    } else {
      updateCVField('achievements', cv.achievements.map(a => a.id === id ? { ...a, [fieldOrUpdates]: value } : a));
    }
  };

  const removeAchievement = (id: string) => {
    updateCVField('achievements', cv.achievements.filter(a => a.id !== id));
  };

  const sortCareerHighlights = (list: CareerHighlight[]) => {
    return [...list].sort((a, b) => {
      const yearA = parseInt(a.year, 10) || 0;
      const yearB = parseInt(b.year, 10) || 0;
      return yearB - yearA;
    });
  };

  const addCareerHighlight = (item: Omit<CareerHighlight, 'id'>) => {
    const newHighlight: CareerHighlight = {
      id: `highlight-${Date.now()}`,
      ...item
    };
    const newList = [...(cv.careerHighlights || []), newHighlight];
    updateCVField('careerHighlights', sortCareerHighlights(newList));
  };

  const updateCareerHighlight = (id: string, updates: Partial<CareerHighlight>) => {
    const updated = (cv.careerHighlights || []).map(h => h.id === id ? { ...h, ...updates } : h);
    updateCVField('careerHighlights', sortCareerHighlights(updated));
  };

  const removeCareerHighlight = (id: string) => {
    updateCVField('careerHighlights', (cv.careerHighlights || []).filter(h => h.id !== id));
  };

  const addExperience = () => {
    const exp: ProfessionalExperience = {
      id: `exp-${Date.now()}`,
      organisation: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      responsibilities: '',
      achievements: ''
    };
    updateCVField('experience', [...cv.experience, exp]);
  };

  const updateExperience = (id: string, field: keyof ProfessionalExperience, value: any) => {
    updateCVField('experience', cv.experience.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeExperience = (id: string) => {
    updateCVField('experience', cv.experience.filter(e => e.id !== id));
  };

  const addEducation = () => {
    const edu: Education = {
      id: `edu-${Date.now()}`,
      school: '',
      degree: '',
      year: '',
      educationType: '',
      educationLevel: ''
    };
    updateCVField('education', [...cv.education, edu]);
  };

  const updateEducation = (id: string, fieldOrUpdates: keyof Education | Partial<Education>, value?: any) => {
    if (typeof fieldOrUpdates === 'object') {
      updateCVField('education', cv.education.map(e => e.id === id ? { ...e, ...fieldOrUpdates } : e));
    } else {
      updateCVField('education', cv.education.map(e => e.id === id ? { ...e, [fieldOrUpdates]: value } : e));
    }
  };

  const removeEducation = (id: string) => {
    updateCVField('education', cv.education.filter(e => e.id !== id));
  };

  const addReference = () => {
    const ref: Reference = {
      id: `ref-${Date.now()}`,
      name: '',
      position: '',
      organisation: '',
      relationship: '',
      email: '',
      phone: ''
    };
    updateCVField('references', [...cv.references, ref]);
  };

  const updateReference = (id: string, field: keyof Reference, value: any) => {
    updateCVField('references', cv.references.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const removeReference = (id: string) => {
    updateCVField('references', cv.references.filter(r => r.id !== id));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl p-5 md:p-6 text-left cv-builder-card">
      <style dangerouslySetInnerHTML={{__html: `
        .cv-builder-card {
          background-color: #FDFBF7 !important;
          border-color: #1E293B !important;
          border-width: 2px !important;
          border-style: solid !important;
          color: #1E293B !important;
          box-shadow: 4px 4px 0px 0px rgba(30,41,59,1) !important;
        }
        .cv-builder-card input, 
        .cv-builder-card select, 
        .cv-builder-card textarea {
          background-color: #ffffff !important;
          border-color: #1E293B !important;
          border-width: 2px !important;
          border-style: solid !important;
          color: #1E293B !important;
          font-weight: 600 !important;
          box-sizing: border-box !important;
          min-height: 38px !important;
        }
        .cv-builder-card select option {
          background-color: #ffffff !important;
          color: #1E293B !important;
        }
        .cv-builder-card input::placeholder, 
        .cv-builder-card textarea::placeholder {
          color: #64748b !important;
        }
        .cv-builder-card input:focus, 
        .cv-builder-card select:focus, 
        .cv-builder-card textarea:focus {
          border-color: #1E293B !important;
          outline: none !important;
          box-shadow: 0 0 0 2px #D4AF37 !important;
        }
        .cv-builder-card label {
          color: #1E293B !important;
          font-weight: 850 !important;
        }
        .cv-builder-card h2 {
          color: #1E293B !important;
          font-weight: 900 !important;
        }
        .cv-builder-card h3,
        .cv-builder-card h4 {
          color: #1E293B !important;
          font-weight: 900 !important;
          border-bottom: 2px solid #1E293B !important;
          padding-bottom: 6px !important;
          margin-bottom: 16px !important;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .cv-builder-card p {
          color: #1E293B !important;
          font-weight: 500 !important;
        }
        .cv-builder-card .border-slate-800 {
          border-color: #1E293B !important;
          border-width: 2px !important;
          border-style: solid !important;
        }
        .cv-builder-card .border-b {
          border-color: #1E293B !important;
          border-width: 2px !important;
        }
        .cv-builder-card .bg-slate-900 {
          background-color: #F4F0EA !important;
          border-color: #1E293B !important;
          border-width: 2px !important;
          border-style: solid !important;
        }
        .cv-builder-card .bg-slate-950 {
          background-color: #ffffff !important;
          border-color: #1E293B !important;
          border-width: 2px !important;
          border-style: solid !important;
        }
        .cv-builder-card .border-slate-850 {
          border-color: #1E293B !important;
          border-width: 2px !important;
          border-style: solid !important;
        }
        .cv-builder-card button.bg-slate-800 {
          background-color: #ffffff !important;
          border-color: #1E293B !important;
          border-width: 2px !important;
          border-style: solid !important;
          color: #1E293B !important;
          font-weight: bold !important;
        }
        .cv-builder-card button.bg-slate-800:hover {
          background-color: #F4F0EA !important;
          color: #1E293B !important;
        }
        .cv-builder-card .text-slate-400 {
          color: #1E293B !important;
          font-weight: 700 !important;
        }
        .cv-builder-card .text-slate-500 {
          color: #1E293B !important;
          font-weight: 700 !important;
        }
        .cv-builder-card .text-white {
          color: #1E293B !important;
        }
        /* Style non-active progress markers */
        .cv-builder-card .bg-slate-800 {
          background-color: #e2e8f0 !important;
          border-color: #cbd5e1 !important;
        }
        /* Override borders for status banner & bottom nav to remain borderless/standard */
        .cv-builder-card .save-status-banner {
          border: none !important;
          border-width: 0px !important;
        }
        .cv-builder-card .navigation-buttons-container {
          border: none !important;
          border-width: 0px !important;
        }
        .cv-builder-card .back-nav-btn {
          border-color: #cbd5e1 !important;
          border-width: 1px !important;
          border-style: solid !important;
          background-color: #ffffff !important;
          color: #334155 !important;
        }
        .cv-builder-card .continue-nav-btn {
          border: none !important;
          outline: none !important;
        }
        .cv-builder-card .note-text-white {
          color: #ffffff !important;
          font-weight: bold !important;
        }
        .cv-builder-card .stats-settings-title {
          color: #D4AF37 !important;
          font-weight: bold !important;
        }
      `}} />
      {/* Save Status Banner */}
      <div className="flex justify-between items-center mb-6 text-xs pb-4 save-status-banner">
        <span className="font-semibold text-slate-400">
          Step {currentStep} of {steps.length}: {steps[currentStep-1].name}
        </span>
        <span className={`px-2 py-0.5 rounded font-mono ${isSaving ? 'text-gold-400 bg-gold-400/10' : 'text-green-400 bg-green-400/10'}`}>
          {isSaving ? 'Autosaving...' : 'Saved ✓'}
        </span>
      </div>

      {/* Progress Dots */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2">
        {steps.map(s => (
          <button 
            key={s.num}
            onClick={() => {
              onSaveDraft(cv);
              setCurrentStep(s.num);
            }}
            className={`h-2 flex-1 min-w-[30px] rounded transition-all ${
              s.num === currentStep 
                ? 'bg-gold-500' 
                : s.num < currentStep 
                  ? 'bg-blue-600' 
                  : 'bg-slate-800 hover:bg-slate-700'
            }`}
            title={s.name}
          />
        ))}
      </div>

      {/* Step Render Area */}
      <div className="min-h-[400px]">
        {/* STEP 1: PERSONAL */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-gold-400" /> Personal Identity
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-bold">First Name</label>
                <input 
                  type="text" 
                  value={cv.firstName}
                  disabled={true}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-xs disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-bold">Last Name</label>
                <input 
                  type="text" 
                  value={cv.lastName}
                  disabled={true}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-xs disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-bold">Country</label>
                <input 
                  type="text" 
                  value={cv.nationality}
                  disabled={true}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-xs disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-bold">Age</label>
                <input 
                  type="text" 
                  value={calculateAge(cv.dateOfBirth)}
                  disabled={true}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-xs disabled:opacity-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-bold">State / County / Province</label>
                <input 
                  type="text" 
                  value={cv.currentCity}
                  disabled={true}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-xs disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-bold">Height</label>
                <select 
                  value={cv.height || ''}
                  onChange={(e) => updateCVField('height', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-xs focus:border-gold-500 outline-none"
                >
                  <option value="">Select Height</option>
                  {(() => {
                    const options = [];
                    for (let ft = 4; ft <= 15; ft++) {
                      const maxIn = ft === 15 ? 0 : 11;
                      for (let inch = 0; inch <= maxIn; inch++) {
                        options.push(`${ft}'${inch}"`);
                      }
                    }
                    return options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ));
                  })()}
                </select>
              </div>
            </div>

            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 flex items-start gap-3 text-xs" style={{ color: '#000000' }}>
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="block font-bold text-amber-700 uppercase tracking-wider text-[10px]" style={{ color: '#b45309' }}>Security Notice</span>
                <span className="block font-medium leading-relaxed" style={{ color: '#000000' }}>
                  Identity details (Name, Age, Nationality, State/Province) are verified and locked. To correct mistakes, please request a change from the admin console.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-bold">Profile Photo (Max 5MB)</label>
              {cv.profilePhoto ? (
                <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-850 rounded-xl animate-fade-in text-left">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <img 
                      src={cv.profilePhoto} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] text-green-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Photo Uploaded
                    </div>
                    <p className="text-[10px] text-slate-500 font-sans">Your photo has been captured successfully.</p>
                    <button 
                      type="button"
                      onClick={() => updateCVField('profilePhoto', '')}
                      className="text-[10px] text-red-400 hover:text-red-300 font-bold underline cursor-pointer block text-left"
                    >
                      Remove & Re-upload another image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative border border-dashed border-slate-800 bg-slate-950/60 hover:bg-slate-950 hover:border-gold-500/50 p-6 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition duration-200 text-center">
                  <User className="w-8 h-8 text-slate-500" />
                  <span className="text-[11px] text-slate-400 font-medium font-sans">Click to upload player photo</span>
                  <span className="text-[9px] text-slate-500 font-mono">Max size 5MB (JPG, PNG, WEBP)</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        alert("File size exceeds the 5MB limit. Please upload a smaller image.");
                        return;
                      }
                      // Shrink the photo before storing it. A full-size photo (up to 5MB) becomes
                      // ~7MB as text, which exceeds Vercel's 4.5MB request limit and made CV saves fail.
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (typeof reader.result !== 'string') return;
                        const original = reader.result;
                        const img = new Image();
                        img.onload = () => {
                          const MAX = 800;
                          const scale = Math.min(1, MAX / Math.max(img.width, img.height));
                          const canvas = document.createElement('canvas');
                          canvas.width = Math.round(img.width * scale);
                          canvas.height = Math.round(img.height * scale);
                          const ctx = canvas.getContext('2d');
                          if (!ctx) {
                            updateCVField('profilePhoto', original);
                            return;
                          }
                          ctx.fillStyle = '#ffffff';
                          ctx.fillRect(0, 0, canvas.width, canvas.height);
                          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                          updateCVField('profilePhoto', canvas.toDataURL('image/jpeg', 0.85));
                        };
                        img.onerror = () => alert('This image could not be read. Please try a JPG or PNG file.');
                        img.src = original;
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Player Level Information Section */}
            <div className="pt-6 space-y-4 text-left">
              <h4 className="text-xs font-bold text-gold-400 uppercase tracking-wider">Type Of Playing Level</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-bold min-h-[32px] flex items-end pb-1">Select Playing Level</label>
                  <select
                    value={cv.typeOfPlayerLevel || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChange({
                        ...cv,
                        typeOfPlayerLevel: val,
                        highestLevelPlayed: '',
                        playerLevelCountry: ''
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-xs select-custom"
                  >
                    <option value="">Select Level</option>
                    <option value="International Cricketer">International Cricketer</option>
                    <option value="Professional Cricketer">Professional Cricketer</option>
                    <option value="Semi-Professional Cricketer">Semi-Professional Cricketer</option>
                    <option value="Club/Regional Cricketer">Club/Regional Cricketer</option>
                  </select>
                </div>


              </div>

              {cv.typeOfPlayerLevel && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Highest Level Played dropdown */}
                  <div>
                    <label className="block text-xs text-slate-400 font-bold min-h-[32px] flex items-end pb-1">Highest Level Played</label>
                    <select
                      value={cv.highestLevelPlayed || ''}
                      onChange={(e) => updateCVField('highestLevelPlayed', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-xs select-custom"
                    >
                      <option value="">Select Option</option>
                      {cv.typeOfPlayerLevel === 'International Cricketer' && (
                        <>
                          <option value="International- Test Cricket">International- Test Cricket</option>
                          <option value="International – One Day International">International – One Day International</option>
                          <option value="International- T20 International">International- T20 International</option>
                          <option value="International- Test/One Day International/T20 International">International- Test/One Day International/T20 International</option>
                          <option value="International- Under 19">International- Under 19</option>
                        </>
                      )}
                      {cv.typeOfPlayerLevel === 'Professional Cricketer' && (
                        <>
                          <option value="First Class Cricket">First Class Cricket</option>
                          <option value="List A Cricket">List A Cricket</option>
                          <option value="Domestic T20 Cricket">Domestic T20 Cricket</option>
                        </>
                      )}
                      {cv.typeOfPlayerLevel === 'Semi-Professional Cricketer' && (
                        <>
                          <option value="Under 16 State Cricket">Under 16 State Cricket</option>
                          <option value="Under 19 State Cricket">Under 19 State Cricket</option>
                          <option value="Under 23 State Cricket">Under 23 State Cricket</option>
                          <option value="Under 16/19/23 State Cricket">Under 16/19/23 State Cricket</option>
                          <option value="T20 Franchise Cricket">T20 Franchise Cricket</option>
                          <option value="University Cricket">University Cricket</option>
                        </>
                      )}
                      {cv.typeOfPlayerLevel === 'Club/Regional Cricketer' && (
                        <>
                          <option value="Under 16 Club/Regional Cricket">Under 16 Club/Regional Cricket</option>
                          <option value="Under 19 Club/Regional Cricket">Under 19 Club/Regional Cricket</option>
                          <option value="Under 23 Club/Regional Cricket">Under 23 Club/Regional Cricket</option>
                          <option value="Senior Club/Regional Cricket">Senior Club/Regional Cricket</option>
                        </>
                      )}
                    </select>
                  </div>

                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: CRICKET PROFILE */}
        {currentStep === 2 && (() => {
          const wordCount = cv.aboutPlayer ? cv.aboutPlayer.trim().split(/\s+/).filter(Boolean).length : 0;
          const paragraphCount = cv.aboutPlayer ? cv.aboutPlayer.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
          return (
            <div className="space-y-4 text-left animate-fade-in">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-gold-400" /> Playing Proficiency & Style
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 font-bold min-h-[32px] flex items-end pb-1">
                    Select your Playing Role
                  </label>
                  <select
                    value={cv.playingRole || ''}
                    onChange={(e) => {
                      const role = e.target.value;
                      onChange({
                        ...cv,
                        playingRole: role,
                        playingRoleDetail: '', // reset detail
                        battingStyle: '',
                        bowlingStyle: '',
                        isWicketkeeper: false
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-xs select-custom"
                  >
                    <option value="">Select Role</option>
                    <option value="Batter">Batter</option>
                    <option value="Batter & Wicket Keeper">Batter & Wicket Keeper</option>
                    <option value="Bowler">Bowler</option>
                    <option value="All Rounder (Seam)">All Rounder (Seam)</option>
                    <option value="All Rounder (Spin)">All Rounder (Spin)</option>
                  </select>
                </div>

                {cv.playingRole && (
                  <div>
                    <label className="block text-xs text-slate-400 font-bold min-h-[32px] flex items-end pb-1">
                      Select Playing Role Subtype
                    </label>
                    <select
                      value={cv.playingRoleDetail || ''}
                      onChange={(e) => {
                        const detail = e.target.value;
                        let derivedBatting = '';
                        let derivedBowling = '';
                        let derivedWk = false;

                        // Derive batting
                        if (detail.includes('Right Hand') || detail.includes('Right Arm')) {
                          derivedBatting = 'Right-Handed';
                        } else if (detail.includes('Left Hand') || detail.includes('Left Arm')) {
                          derivedBatting = 'Left-Handed';
                        }

                        // Derive bowling and wicketkeeper
                        if (cv.playingRole === 'Batter') {
                          derivedBowling = 'None';
                        } else if (cv.playingRole === 'Batter & Wicket Keeper') {
                          derivedBowling = 'None';
                          derivedWk = true;
                        } else if (cv.playingRole === 'Bowler') {
                          derivedBowling = detail;
                        } else if (cv.playingRole === 'All Rounder (Seam)') {
                          if (detail.includes('Right Arm Fast')) derivedBowling = 'Right-Arm Fast';
                          else if (detail.includes('Left Arm Fast')) derivedBowling = 'Left-Arm Fast';
                        } else if (cv.playingRole === 'All Rounder (Spin)') {
                          if (detail.includes('Right Arm Off Spin')) derivedBowling = 'Right-Arm Off Spin';
                          else if (detail.includes('Right Arm Leg Spin')) derivedBowling = 'Right-Arm Leg Spin';
                          else if (detail.includes('Left Arm Orthodox')) derivedBowling = 'Left-Arm Orthodox';
                          else if (detail.includes('Left Arm Chinaman/Wrist Spinner') || detail.includes('Left Arm Chinaman/Wrist Spin')) derivedBowling = 'Left-Arm Wrist Spin';
                          else if (detail.includes('Ambidextrous')) derivedBowling = 'Ambidextrous';
                        }

                        onChange({
                          ...cv,
                          playingRoleDetail: detail,
                          battingStyle: derivedBatting || cv.battingStyle || 'Right-Handed',
                          bowlingStyle: derivedBowling || cv.bowlingStyle || 'None',
                          isWicketkeeper: derivedWk
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-xs select-custom"
                    >
                      <option value="">Select Option</option>
                      {cv.playingRole === 'Batter' && (
                        <>
                          <option value="Right Hand Opening Batter">Right Hand Opening Batter</option>
                          <option value="Left Hand Opening Batter">Left Hand Opening Batter</option>
                          <option value="Right Hand Middle Order Batter">Right Hand Middle Order Batter</option>
                          <option value="Left Hand Middle Order Batter">Left Hand Middle Order Batter</option>
                        </>
                      )}
                      {cv.playingRole === 'Batter & Wicket Keeper' && (
                        <>
                          <option value="Right Hand Opening Batter & Wicket Keeper">Right Hand Opening Batter & Wicket Keeper</option>
                          <option value="Left Hand Opening Batter & Wicket Keeper">Left Hand Opening Batter & Wicket Keeper</option>
                          <option value="Right Hand Middle Order Batter & Wicket Keeper">Right Hand Middle Order Batter & Wicket Keeper</option>
                          <option value="Left Hand Middle Order Batter & Wicket Keeper">Left Hand Middle Order Batter & Wicket Keeper</option>
                        </>
                      )}
                      {cv.playingRole === 'Bowler' && (
                        <>
                          <option value="Left Arm Fast Bowler">Left Arm Fast Bowler</option>
                          <option value="Right Arm Fast Bowler">Right Arm Fast Bowler</option>
                          <option value="Left Arm Orthodox">Left Arm Orthodox</option>
                          <option value="Left Arm Chinaman/Wrist Spin">Left Arm Chinaman/Wrist Spin</option>
                          <option value="Right Arm Off Spin">Right Arm Off Spin</option>
                          <option value="Right Arm Leg Spin">Right Arm Leg Spin</option>
                          <option value="Ambidextrous (Spin)">Ambidextrous (Spin)</option>
                          <option value="Ambidextrous (Pace)">Ambidextrous (Pace)</option>
                          <option value="Ambidextrous (Spin & Pace)">Ambidextrous (Spin & Pace)</option>
                        </>
                      )}
                      {cv.playingRole === 'All Rounder (Seam)' && (
                        <>
                          <option value="Batting All Rounder- Left Hand Opening Batter & Right Arm Fast Bowler">Batting All Rounder- Left Hand Opening Batter & Right Arm Fast Bowler</option>
                          <option value="Batting All Rounder- Left Hand Opening Batter & Left Arm Fast Bowler">Batting All Rounder- Left Hand Opening Batter & Left Arm Fast Bowler</option>
                          <option value="Batting All Rounder- Right Hand Opening Batter & Right Arm Fast Bowler">Batting All Rounder- Right Hand Opening Batter & Right Arm Fast Bowler</option>
                          <option value="Batting All Rounder- Right Hand Opening Batter & Left Arm Fast Bowler">Batting All Rounder- Right Hand Opening Batter & Left Arm Fast Bowler</option>
                          <option value="Batting All Rounder- Left Hand Middle Order Batter & Right Arm Fast Bowler">Batting All Rounder- Left Hand Middle Order Batter & Right Arm Fast Bowler</option>
                          <option value="Batting All Rounder- Left Hand Middle Order Batter & Left Arm Fast Bowler">Batting All Rounder- Left Hand Middle Order Batter & Left Arm Fast Bowler</option>
                          <option value="Batting All Rounder- Right Hand Middle Order Batter & Right Arm Fast Bowler">Batting All Rounder- Right Hand Middle Order Batter & Right Arm Fast Bowler</option>
                          <option value="Batting All Rounder- Right Hand Middle Order & Left Arm Fast Bowler">Batting All Rounder- Right Hand Middle Order & Left Arm Fast Bowler</option>
                        </>
                      )}
                      {cv.playingRole === 'All Rounder (Spin)' && (
                        <>
                          <option value="Left Hand Opening Batter & Right Arm Off Spin">Left Hand Opening Batter & Right Arm Off Spin</option>
                          <option value="Left Hand Opening Batter & Right Arm Leg Spin">Left Hand Opening Batter & Right Arm Leg Spin</option>
                          <option value="Left Hand Opening Batter & Left Arm Orthodox">Left Hand Opening Batter & Left Arm Orthodox</option>
                          <option value="Left Hand Opening Batter & Left Arm Chinaman/Wrist Spinner">Left Hand Opening Batter & Left Arm Chinaman/Wrist Spinner</option>
                          <option value="Left Hand Opening Batter & Ambidextrous">Left Hand Opening Batter & Ambidextrous</option>
                          <option value="Right Hand Opening Batter & Right Arm Off Spin">Right Hand Opening Batter & Right Arm Off Spin</option>
                          <option value="Right Hand Opening Batter & Right Arm Leg Spin">Right Hand Opening Batter & Right Arm Leg Spin</option>
                          <option value="Right Hand Opening Batter & Left Arm Orthodox">Right Hand Opening Batter & Left Arm Orthodox</option>
                          <option value="Right Hand Opening Batter & Left Arm Chinaman/Wrist Spinner">Right Hand Opening Batter & Left Arm Chinaman/Wrist Spinner</option>
                          <option value="Right Hand Opening Batter & Ambidextrous">Right Hand Opening Batter & Ambidextrous</option>
                          <option value="Left Hand Middle Order Batter & Right Arm Off Spin">Left Hand Middle Order Batter & Right Arm Off Spin</option>
                          <option value="Left Hand Middle Order Batter & Right Arm Leg Spin">Left Hand Middle Order Batter & Right Arm Leg Spin</option>
                          <option value="Left Hand Middle Order Batter & Left Arm Orthodox">Left Hand Middle Order Batter & Left Arm Orthodox</option>
                          <option value="Left Hand Middle Order Batter & Left Arm Chinaman/Wrist Spinner">Left Hand Middle Order Batter & Left Arm Chinaman/Wrist Spinner</option>
                          <option value="Left Hand Middle Order Batter & Ambidextrous">Left Hand Middle Order Batter & Ambidextrous</option>
                          <option value="Right Hand Middle Order Batter & Right Arm Off Spin">Right Hand Middle Order Batter & Right Arm Off Spin</option>
                          <option value="Right Hand Middle Order Batter & Right Arm Leg Spin">Right Hand Middle Order Batter & Right Arm Leg Spin</option>
                          <option value="Right Hand Middle Order Batter & Left Arm Orthodox">Right Hand Middle Order Batter & Left Arm Orthodox</option>
                          <option value="Right Hand Middle Order Batter & Left Arm Chinaman/Wrist Spinner">Right Hand Middle Order Batter & Left Arm Chinaman/Wrist Spinner</option>
                          <option value="Right Hand Middle Order Batter & Ambidextrous">Right Hand Middle Order Batter & Ambidextrous</option>
                        </>
                      )}
                    </select>
                  </div>
                )}
              </div>


              {/* About the Player */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs text-slate-400 font-bold">About the Player (Bio Summary)</label>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${paragraphCount > 4 ? 'text-red-500 bg-red-500/10' : 'text-slate-400 bg-slate-100'}`}>
                      {paragraphCount} / 4 para
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${wordCount > 120 ? 'text-red-500 bg-red-500/10' : wordCount > 100 ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 bg-slate-100'}`}>
                      {wordCount} / 120 words
                    </span>
                  </div>
                </div>
                <textarea
                  value={cv.aboutPlayer || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Block input if word count exceeds 120
                    const wc = val.trim().split(/\s+/).filter(Boolean).length;
                    if (wc <= 120) {
                      updateCVField('aboutPlayer', val);
                    }
                  }}
                  placeholder="Briefly describe your cricket journey, key playing achievements, and career goals."
                  rows={6}
                  className={`w-full bg-slate-950 border p-2.5 rounded text-white text-xs font-sans resize-none ${
                    wordCount > 120 || paragraphCount > 4
                      ? 'border-red-500'
                      : wordCount > 100
                      ? 'border-amber-400/60'
                      : 'border-slate-800'
                  }`}
                />
                <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                  ⚠️ Keep your bio to <strong className="text-slate-400">max 120 words</strong> and <strong className="text-slate-400">max 4 paragraphs</strong> to ensure it stays on Page 1 of your CV.
                </p>
              </div>
            </div>
          );
        })()}

        {/* STEP 3: EXPERIENCE AND TEAMS */}
        {currentStep === 3 && (
          <div className="space-y-4 text-left animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-gold-400" /> Experience and Teams
              </h3>
            </div>

            {cv.careerHistory.length === 0 ? (
              <div className="text-center py-10 bg-slate-950/20 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                No teams added. Click "Add Team" to build your log history.
              </div>
            ) : (
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                {cv.careerHistory.map((item) => (
                  <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 relative">
                    <button 
                      onClick={() => removeCareerEntry(item.id)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-400 p-1 hover:bg-slate-900 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1 font-bold">Team Name</label>
                          <input 
                            type="text" 
                            value={item.teamName}
                            onChange={(e) => updateCareerEntry(item.id, 'teamName', e.target.value)}
                            placeholder="e.g. Mumbai Indians, Yorkshire CCC"
                            className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1 font-bold">Country</label>
                          <select 
                            value={item.country || ''}
                            onChange={(e) => updateCareerEntry(item.id, 'country', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-white text-xs"
                          >
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Sri Lanka">Sri Lanka</option>
                            <option value="New Zealand">New Zealand</option>
                            <option value="Australia">Australia</option>
                            <option value="South Africa">South Africa</option>
                            <option value="Canada">Canada</option>
                            <option value="United States Of America">United States Of America</option>
                            <option value="Oman">Oman</option>
                            <option value="Zimbabwe">Zimbabwe</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1 font-bold">Starting Year</label>
                          <select 
                            value={item.startYear}
                            onChange={(e) => updateCareerEntry(item.id, 'startYear', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-white text-xs"
                          >
                            <option value="">Select Year</option>
                            {Array.from({ length: 2026 - 2005 + 1 }, (_, i) => 2026 - i).map(yr => (
                              <option key={yr} value={yr}>{yr}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1 font-bold">Ending Year</label>
                          <select 
                            value={item.endYear}
                            onChange={(e) => updateCareerEntry(item.id, 'endYear', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-white text-xs"
                          >
                            <option value="">Select Year</option>
                            <option value="Present">Present</option>
                            {Array.from({ length: 2026 - 2005 + 1 }, (_, i) => 2026 - i).map(yr => (
                              <option key={yr} value={yr}>{yr}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button 
                onClick={addCareerEntry}
                className="flex items-center gap-1.5 text-xs px-3.5 py-2.5 bg-[#D4AF37] hover:bg-[#b8952d] text-[#0A192F] font-black rounded-xl transition-all cursor-pointer shadow-md uppercase tracking-wider"
              >
                <Plus className="w-4.5 h-4.5" /> Add Team
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: STATISTICS */}
        {currentStep === 4 && (() => {
          const stats = cv.oneDayStats || createDefaultFormatStats(false);

          const batDismissals = Math.max(0, stats.batInnings - stats.batNotOuts);
          const batAverage = batDismissals > 0 ? (stats.batRuns / batDismissals).toFixed(2) : '-';
          const batStrikeRate = stats.batBallsFaced > 0 ? ((stats.batRuns / stats.batBallsFaced) * 100).toFixed(2) : '-';

          const bowlTotalBalls = (stats.bowlOvers * 6) + stats.bowlBalls;
          const bowlAverage = stats.bowlWickets > 0 ? (stats.bowlRunsConceded / stats.bowlWickets).toFixed(2) : '-';
          const bowlEconomy = bowlTotalBalls > 0 ? ((stats.bowlRunsConceded * 6) / bowlTotalBalls).toFixed(2) : '-';

          return (
            <div className="space-y-4 text-left animate-fade-in animate-duration-300">
              <div className="space-y-1 mb-2">
                <h3 className="text-base font-extrabold flex items-center gap-1.5 pb-2" style={{ borderBottom: '3.5px solid #000000', color: '#000000', width: '100%' }}>
                  <Activity className="w-4 h-4 text-black" /> Player Career Statistics
                </h3>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed pt-1">
                  Enter your overall career statistics.
                </p>
              </div>

              {/* Statistics Display Settings Card */}
              <div className="p-4 space-y-3 mb-4" style={{ backgroundColor: '#2D3139', border: '1.5px solid #ffffff', borderRadius: '0.75rem', fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace', fontWeight: 'bold' }}>
                <span className="stats-settings-title text-[11px] uppercase tracking-wider block">
                  Statistics Display Settings
                </span>
                <p className="note-text-white text-[10px] leading-relaxed font-bold">
                  Note: Use the toggle switches below to select which career statistics categories (Batting, Bowling) you want to display on your printed and online CV. By default, both categories are enabled.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {/* Batting Toggle */}
                  <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800">
                    <span className="note-text-white text-[11px] font-bold tracking-wide uppercase">Batting</span>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        checked={cv.showBatting !== false}
                        onChange={(e) => updateCVField('showBatting', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-red-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-100 after:border-slate-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  {/* Bowling Toggle */}
                  <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800">
                    <span className="note-text-white text-[11px] font-bold tracking-wide uppercase">Bowling</span>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        checked={cv.showBowling !== false}
                        onChange={(e) => updateCVField('showBowling', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-red-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-100 after:border-slate-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Toggle switch for hasStats */}
              <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-xl border border-slate-850 justify-between">
                <div className="pr-4">
                  <span className="text-xs text-white font-extrabold tracking-wide uppercase" style={{ fontWeight: 'bold' }}>
                    Include Career Statistics on CV
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-bold" style={{ fontWeight: 'bold' }}>Toggle to display career statistics summary on your generated Cricket CV.</p>
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed font-bold" style={{ fontWeight: 'bold' }}>
                    You may refer to your online profile on platforms such as CricHeroes, CricHQ, CricClubs, or other reliable cricket-statistics websites.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    checked={!!stats.hasStats}
                    onChange={(e) => updateFormatStats('oneDay', 'hasStats', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-red-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-100 after:border-slate-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              {stats.hasStats && (
                <div className="space-y-6 pt-2 animate-fade-in">
                  
                  {/* BATTING SECTION */}
                  {cv.showBatting !== false && (
                    <div className="space-y-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-widest pb-1.5" style={{ borderBottom: '3.5px solid #000000', color: '#000000' }}>1. Batting Statistics</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">Matches</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Total matches played in career.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="number"
                            min={0}
                            value={stats.batMatches || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateFormatStats('oneDay', 'batMatches', isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">Innings</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Number of innings batted.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="number"
                            min={0}
                            value={stats.batInnings || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateFormatStats('oneDay', 'batInnings', isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">Not Outs</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Innings where you were not dismissed.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="number"
                            min={0}
                            value={stats.batNotOuts || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateFormatStats('oneDay', 'batNotOuts', isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">Runs Scored</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Total career runs scored.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="number"
                            min={0}
                            value={stats.batRuns || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateFormatStats('oneDay', 'batRuns', isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                      
                      {/* Highest Score + Not Out Toggle */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs text-white font-bold tracking-wide uppercase">Highest Score</label>
                            <span className="text-[10px] text-slate-500 block mt-0.5">Your highest individual score.</span>
                          </div>
                          <div className="relative mt-1">
                            <input 
                              type="number"
                              min={0}
                              value={stats.batHighestScore || ''}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                updateFormatStats('oneDay', 'batHighestScore', isNaN(val) ? 0 : val);
                              }}
                              className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-900/60 justify-between">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Not Out (*)</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={!!stats.batHighestNotOut}
                              onChange={(e) => updateFormatStats('oneDay', 'batHighestNotOut', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-red-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-100 after:border-slate-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">Balls Faced</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Total balls faced in career.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="number"
                            min={0}
                            value={stats.batBallsFaced || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateFormatStats('oneDay', 'batBallsFaced', isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">50s</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Innings where you scored between 50 and 99 runs.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="number"
                            min={0}
                            value={stats.batFifties || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateFormatStats('oneDay', 'batFifties', isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">100s</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Innings where you scored 100 runs or more.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="number"
                            min={0}
                            value={stats.batHundreds || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateFormatStats('oneDay', 'batHundreds', isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">Catches</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Catches taken in career.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="number"
                            min={0}
                            value={stats.fieldCatches || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateFormatStats('oneDay', 'fieldCatches', isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">Stumpings</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Stumpings Taken In Career.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="number"
                            min={0}
                            value={stats.fieldStumpings || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateFormatStats('oneDay', 'fieldStumpings', isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Auto-Calculated Batting Stats */}
                    <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Dismissals</div>
                        <div className="text-sm font-black text-white mt-1">{batDismissals}</div>
                        <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold mt-1 inline-block">Auto Calculated</span>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Batting Average</div>
                        <div className="text-sm font-black text-white mt-1">{batAverage}</div>
                        <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold mt-1 inline-block">Auto Calculated</span>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Strike Rate</div>
                        <div className="text-sm font-black text-white mt-1">{batStrikeRate}</div>
                        <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold mt-1 inline-block">Auto Calculated</span>
                      </div>
                    </div>
                  </div>
                  )}

                  {/* BOWLING SECTION */}
                  {cv.showBowling !== false && (
                    <div className="space-y-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-widest pb-1.5" style={{ borderBottom: '3.5px solid #000000', color: '#000000' }}>2. Bowling Statistics</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">Matches</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Matches played as a bowler.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="number"
                            min={0}
                            value={stats.bowlMatches || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateFormatStats('oneDay', 'bowlMatches', isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">Innings</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Innings bowled.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="number"
                            min={0}
                            value={stats.bowlInnings || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateFormatStats('oneDay', 'bowlInnings', isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Overs Input Box */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">Overs Bowled</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Completed overs bowled.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="number"
                            min={0}
                            value={stats.bowlOvers || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateFormatStats('oneDay', 'bowlOvers', isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Runs Conceded */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">Runs Conceded</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Total career runs conceded.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="number"
                            min={0}
                            value={stats.bowlRunsConceded || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateFormatStats('oneDay', 'bowlRunsConceded', isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Wickets Taken */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">Wickets Taken</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Total career wickets taken.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="number"
                            min={0}
                            value={stats.bowlWickets || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateFormatStats('oneDay', 'bowlWickets', isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Best Bowling Figure */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">Best Bowling Figure</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Best individual bowling analysis.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="text"
                            placeholder="First wickets then runs (e.g. 4/24)"
                            value={localBestBowling}
                            onChange={(e) => {
                              const raw = e.target.value;
                              setLocalBestBowling(raw);
                              const parts = raw.split('/');
                              if (parts.length === 2) {
                                const wickets = parseInt(parts[0], 10);
                                const runs = parseInt(parts[1], 10);
                                if (!isNaN(wickets) && !isNaN(runs)) {
                                  const statsField = 'oneDayStats';
                                  const currentStats = cv[statsField] || createDefaultFormatStats(false);
                                  updateCVField(statsField, {
                                    ...currentStats,
                                    bowlBestWickets: Math.max(0, wickets),
                                    bowlBestRuns: Math.max(0, runs)
                                  });
                                }
                              } else if (raw === '') {
                                const statsField = 'oneDayStats';
                                const currentStats = cv[statsField] || createDefaultFormatStats(false);
                                updateCVField(statsField, {
                                  ...currentStats,
                                  bowlBestWickets: 0,
                                  bowlBestRuns: 0
                                });
                              }
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                          <span className="text-[9px] text-slate-500 block mt-1">Format: [Wickets]/[Runs] (e.g., 4/24)</span>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">4-Wicket Hauls</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Innings with exactly 4 wickets.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="number"
                            min={0}
                            value={stats.bowlFourWickets || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateFormatStats('oneDay', 'bowlFourWickets', isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
                        <div>
                          <label className="block text-xs text-white font-bold tracking-wide uppercase">5-Wicket Hauls</label>
                          <span className="text-[10px] text-slate-500 block mt-0.5">Innings with 5 wickets or more.</span>
                        </div>
                        <div className="relative mt-1">
                          <input 
                            type="number"
                            min={0}
                            value={stats.bowlFiveWickets || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              updateFormatStats('oneDay', 'bowlFiveWickets', isNaN(val) ? 0 : val);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Auto-Calculated Bowling Stats */}
                    <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-900 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Balls Bowled</div>
                        <div className="text-sm font-black text-white mt-1">{bowlTotalBalls}</div>
                        <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold mt-1 inline-block">Auto Calculated</span>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Bowling Avg</div>
                        <div className="text-sm font-black text-white mt-1">{bowlAverage}</div>
                        <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold mt-1 inline-block">Auto Calculated</span>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Economy Rate</div>
                        <div className="text-sm font-black text-white mt-1">{bowlEconomy}</div>
                        <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold mt-1 inline-block">Auto Calculated</span>
                      </div>
                    </div>
                  </div>
                  )}

                </div>
              )}
            </div>
          );
        })()}

        
        {/* STEP 5: SCORECARD, PROFILE & MEDIA LINKS */}
        {currentStep === 5 && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="space-y-1 mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5 pb-2" style={{ borderBottom: '3.5px solid #000000', color: '#000000' }}>
                <Link2 className="w-4 h-4 text-gold-400" /> Scorecard, Profile & Media Links
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                Provide up to 5 URLs/links to your online matches scorecards, cricket profiles (e.g. CricHeroes, ESPNcricinfo), videos, or other media files.
              </p>
            </div>

            <div className="space-y-4">
              {[0, 1, 2, 3, 4].slice(0, visibleLinksCount).map((index) => {
                const linkVal = cv.mediaLinks?.[index] || '';
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-slate-500 uppercase block font-semibold">
                        Link {index + 1}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newLinks = [...(cv.mediaLinks || ['', '', '', '', ''])];
                          newLinks.splice(index, 1);
                          newLinks.push('');
                          onChange({ ...cv, mediaLinks: newLinks });
                          setVisibleLinksCount(prev => Math.max(1, prev - 1));
                        }}
                        className="text-red-500 hover:text-red-400 p-1 hover:bg-slate-900 rounded flex items-center gap-1 text-[10px] font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                    <input
                      type="url"
                      value={linkVal}
                      onChange={(e) => {
                        const newLinks = [...(cv.mediaLinks || ['', '', '', '', ''])];
                        newLinks[index] = e.target.value;
                        onChange({ ...cv, mediaLinks: newLinks });
                      }}
                      placeholder={`https://example.com/link-${index + 1}`}
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-gold-500 transition font-sans no-capitalize"
                    />
                  </div>
                );
              })}
            </div>

            {visibleLinksCount < 5 && (
              <div className="pt-2 text-left">
                <button
                  type="button"
                  onClick={() => setVisibleLinksCount(prev => Math.min(5, prev + 1))}
                  className="flex items-center gap-1 text-xs hover:opacity-80 transition-all font-black cursor-pointer"
                  style={{ color: '#0A192F', background: 'transparent', border: 'none', padding: 0 }}
                >
                  <Plus className="w-3.5 h-3.5" style={{ color: '#0A192F' }} /> Add Link
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: SPECIALIST CRICKET SKILLS */}
        {currentStep === 6 && (
          <div className="space-y-6 text-left animate-fade-in">
            <div className="space-y-1 mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-gold-400" /> Specialist Cricket Skills
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                What are your strongest specialist cricket skills?
              </p>
            </div>

            {/* Counter block */}
            {(() => {
              const selectedCount = cv.specialistSkills?.length || 0;
              return (
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#ffffff', display: 'inline-block', lineHeight: 'normal' }}>
                      Select up to 5 skills
                    </span>
                    <p className="text-[10px] mt-0.5 font-bold text-custom-darkblack-step5" style={{ fontWeight: 'bold', lineHeight: 'normal' }}>
                      Choose 1 to 5 options that highlight your specific match play strengths.
                    </p>
                  </div>
                  <div className={`text-xs font-extrabold px-3 py-1.5 rounded-lg border uppercase tracking-wider shrink-0 ${
                    selectedCount === 5 
                      ? 'bg-gold-500/10 text-gold-400 border-gold-500/30' 
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}>
                    {selectedCount === 5 
                      ? '5 / 5 selected — Maximum reached' 
                      : `${selectedCount} / 5 selected`}
                  </div>
                </div>
              );
            })()}

            {/* Grid of options */}
            {(() => {
              const options = [
                "Bowling Sharp Yorkers",
                "Multiple Variations in  Bowling",
                "Batting Against Pace",
                "Batting Against Spin",
                "Power Hitting",
                "Finishing",
                "Running Between the Wickets",
                "Death Overs Bowling",
                "Middle Overs Bowling",
                "Bowling at the Death",
                "Bowling Sharp Yorkers",
                "Multiple Variations in  Bowling",
                "Extra Ordinary Fielding"
              ];
              
              const getIndicesFromSkills = (skills: string[]): number[] => {
                const indices: number[] = [];
                const tempSkills = [...skills];
                options.forEach((option, idx) => {
                  const foundIdx = tempSkills.indexOf(option);
                  if (foundIdx > -1) {
                    indices.push(idx);
                    tempSkills.splice(foundIdx, 1);
                  }
                });
                return indices;
              };

              const selectedIndices = getIndicesFromSkills(cv.specialistSkills || []);
              const selectedCount = selectedIndices.length;

              const handleToggleSkill = (idx: number) => {
                let newIndices: number[];
                if (selectedIndices.includes(idx)) {
                  newIndices = selectedIndices.filter(i => i !== idx);
                } else if (selectedCount < 5) {
                  newIndices = [...selectedIndices, idx];
                } else {
                  return;
                }
                const newSkills = newIndices.map(i => options[i]);
                updateCVField('specialistSkills', newSkills);
              };

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {options.map((option, idx) => {
                    const isSelected = selectedIndices.includes(idx);
                    const isDisabled = !isSelected && selectedCount >= 5;
                    
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleToggleSkill(idx)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition text-left w-full cursor-pointer ${
                          isSelected 
                            ? 'bg-gold-500/10 border-gold-500 text-white font-bold' 
                            : isDisabled
                              ? 'bg-slate-900/20 border-slate-900 text-slate-600 cursor-not-allowed opacity-50'
                              : 'bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isSelected 
                              ? 'bg-gold-500 border-gold-500 text-navy-950' 
                              : 'border-slate-700'
                          }`}>
                            {isSelected && (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-black">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span 
                            className="text-xs uppercase tracking-wide"
                            style={{ 
                              color: isSelected ? '#000000' : isDisabled ? '#94a3b8' : '#000000', 
                              fontWeight: isDisabled ? 'normal' : 'bold' 
                            }}
                          >
                            {option}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })()}

            {validationError && (
              <div className="text-red-500 text-xs font-bold pt-2">
                {validationError}
              </div>
            )}
          </div>
        )}

{/* STEP 7: ACHIEVEMENTS */}
        {currentStep === 7 && (
          <div className="space-y-4 text-left animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-gold-400" /> Achievement & Awards
              </h3>
              <button 
                onClick={addAchievement}
                className="flex items-center gap-1 text-xs hover:opacity-80 transition-all font-black cursor-pointer"
                style={{ color: '#0A192F', background: 'transparent', border: 'none' }}
              >
                <Plus className="w-3.5 h-3.5" style={{ color: '#0A192F' }} /> Add Award
              </button>
            </div>

            {cv.achievements.length === 0 ? (
              <div className="text-center py-10 bg-slate-950/20 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                No achievements listed yet. Click "Add Award" to list your achievements.
              </div>
            ) : (
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                {cv.achievements.map((ach) => {
                  const showOpponent = ach.title === 'Player of the Match' || ach.title === 'Hat-trick';
                  const hasTournament = ach.teamEvent && ach.teamEvent.trim() !== '';
                  const hasOpponent = ach.opponentTeam && ach.opponentTeam.trim() !== '';
                  const showYear = showOpponent ? (hasTournament && hasOpponent) : hasTournament;

                  return (
                    <div key={ach.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 relative">
                      <button 
                        onClick={() => removeAchievement(ach.id)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-400 p-1 hover:bg-slate-900 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="space-y-3 pr-6">
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-1 font-bold">Select Achievement / Award</label>
                          <select 
                            value={ach.title}
                            onChange={(e) => {
                              updateAchievement(ach.id, {
                                title: e.target.value,
                                teamEvent: '',
                                opponentTeam: '',
                                year: ''
                              });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-white text-xs select-custom"
                          >
                            <option value="">Select Option</option>
                            <option value="Player of the Tournament">Player of the Tournament</option>
                            <option value="Player of the Match">Player of the Match</option>
                            <option value="Best Batter">Best Batter</option>
                            <option value="Best Bowler">Best Bowler</option>
                            <option value="Best Wicket Keeper">Best Wicket Keeper</option>
                            <option value="Best Fielder">Best Fielder</option>
                            <option value="Hat-trick">Hat-trick</option>
                          </select>
                        </div>

                        {ach.title && (
                          <div className="animate-fade-in">
                            <label className="block text-[10px] text-slate-500 mb-1 font-bold">Tournament Name</label>
                            <input 
                              type="text" 
                              value={ach.teamEvent}
                              onChange={(e) => updateAchievement(ach.id, 'teamEvent', e.target.value)}
                              placeholder="e.g. County Championship, IPL 2025"
                              className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-white text-xs"
                            />
                          </div>
                        )}

                        {ach.title && showOpponent && hasTournament && (
                          <div className="animate-fade-in">
                            <label className="block text-[10px] text-slate-500 mb-1 font-bold">Opponent Team</label>
                            <input 
                              type="text" 
                              value={ach.opponentTeam || ''}
                              onChange={(e) => updateAchievement(ach.id, 'opponentTeam', e.target.value)}
                              placeholder="e.g. Yorkshire CCC, Mumbai Indians"
                              className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-white text-xs"
                            />
                          </div>
                        )}

                        {ach.title && showYear && (
                          <div className="animate-fade-in">
                            <label className="block text-[10px] text-slate-500 mb-1 font-bold">Year</label>
                            <select 
                              value={ach.year}
                              onChange={(e) => updateAchievement(ach.id, 'year', e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-white text-xs select-custom"
                            >
                              <option value="">Select Year</option>
                              {Array.from({ length: 2026 - 2005 + 1 }, (_, i) => 2026 - i).map(yr => (
                                <option key={yr} value={yr}>{yr}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 8: CAREER HIGHLIGHTS */}
        {currentStep === 8 && (
          <div className="space-y-4 text-left animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-gold-400" /> Career Highlights
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                  Do you have any notable career highlights? Add your most important individual performances. You can add multiple highlights.
                </p>
              </div>
              {editingHighlightId === null && (
                <button 
                  onClick={() => {
                    setHighlightForm({
                      achievement: '',
                      opponent: '',
                      tournament: '',
                      year: '2026'
                    });
                    setEditingHighlightId('new');
                    setValidationError('');
                  }}
                  className="flex items-center gap-1 text-xs hover:opacity-80 transition-all font-black shrink-0 cursor-pointer"
                  style={{ color: '#0A192F', background: 'transparent', border: 'none' }}
                >
                  <Plus className="w-3.5 h-3.5" style={{ color: '#0A192F' }} /> Add Highlight
                </button>
              )}
            </div>

            {editingHighlightId !== null ? (
              /* Add/Edit Career Highlight Form */
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4 animate-fade-in">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {editingHighlightId === 'new' ? 'Add New Career Highlight' : 'Edit Career Highlight'}
                </h4>

                <div className="space-y-3">
                  {/* Step 1: Select Career Highlight */}
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1 font-bold">Select Career Highlight</label>
                    <select
                      value={highlightForm.achievement}
                      onChange={(e) => setHighlightForm(prev => ({ ...prev, achievement: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-xs select-custom"
                    >
                      <option value="">-- Select Highlight --</option>
                      <option value="Scored a Match-Winning 100">Scored a Match-Winning 100</option>
                      <option value="Scored a Match-Winning 50">Scored a Match-Winning 50</option>
                      <option value="Took a Match-Winning 5-Wicket Haul">Took a Match-Winning 5-Wicket Haul</option>
                      <option value="Took 10 Wickets in a Match">Took 10 Wickets in a Match</option>
                    </select>
                  </div>

                  {/* Step 2: Enter Opponent Team */}
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1 font-bold">Who was the opponent?</label>
                    <input
                      type="text"
                      placeholder="Opponent Team Name"
                      value={highlightForm.opponent}
                      onChange={(e) => setHighlightForm(prev => ({ ...prev, opponent: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-xs"
                    />
                  </div>

                  {/* Step 3: Enter Tournament */}
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1 font-bold">What tournament was it?</label>
                    <input
                      type="text"
                      placeholder="Tournament Name"
                      value={highlightForm.tournament}
                      onChange={(e) => setHighlightForm(prev => ({ ...prev, tournament: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-xs"
                    />
                  </div>

                  {/* Step 4: Select Year */}
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1 font-bold">When did this happen?</label>
                    <select
                      value={highlightForm.year}
                      onChange={(e) => setHighlightForm(prev => ({ ...prev, year: e.target.value }))}
                      className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-xs select-custom"
                    >
                      {Array.from({ length: 2026 - 2005 + 1 }, (_, i) => 2026 - i).map(yr => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveHighlight}
                    className="px-4 py-2 bg-gold-gradient text-navy-950 text-xs font-bold rounded hover:opacity-90 transition cursor-pointer"
                  >
                    Save Highlight
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingHighlightId(null);
                      setValidationError('');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Career Highlights List View */
              (cv.careerHighlights || []).length === 0 ? (
                <div className="text-center py-10 bg-slate-950/20 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                  No career highlights listed yet. Click "+ Add Highlight" to list your career achievements.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-1 animate-fade-in">
                  {(cv.careerHighlights || []).map((hl) => (
                    <div key={hl.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 relative flex flex-col justify-between space-y-3">
                      <div className="absolute top-3 right-3 flex gap-1">
                        <button
                          onClick={() => {
                            setHighlightForm({
                              achievement: hl.achievement,
                              opponent: hl.opponent,
                              tournament: hl.tournament,
                              year: hl.year
                            });
                            setEditingHighlightId(hl.id);
                            setValidationError('');
                          }}
                          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition cursor-pointer font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeCareerHighlight(hl.id)}
                          className="text-[10px] bg-red-950/40 hover:bg-red-900/40 text-red-400 px-2 py-1 rounded transition cursor-pointer font-bold"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="pr-16 text-xs text-left space-y-1">
                        <div className="font-bold text-white text-xs">{hl.achievement}</div>
                        <div className="text-[10px] text-slate-400">
                          <strong>Opponent:</strong> {hl.opponent}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          <strong>Tournament:</strong> {hl.tournament}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          <strong>Year:</strong> {hl.year}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}

        {/* STEP 9: EDUCATION */}
        {currentStep === 9 && (
          <div className="space-y-4 text-left animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-gold-400" /> Academic Education
              </h3>
              <button 
                onClick={addEducation}
                className="flex items-center gap-1 text-xs hover:opacity-80 transition-all font-black cursor-pointer"
                style={{ color: '#0A192F', background: 'transparent', border: 'none' }}
              >
                <Plus className="w-3.5 h-3.5" style={{ color: '#0A192F' }} /> Add Education
              </button>
            </div>

            {cv.education.length === 0 ? (
              <div className="text-center py-10 bg-slate-950/20 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                No academic entries listed yet. Click "Add Education" to list your education.
              </div>
            ) : (
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                {cv.education.map((item) => (
                  <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 relative">
                    <button 
                      onClick={() => removeEducation(item.id)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-400 p-1 hover:bg-slate-900 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="space-y-3 pr-6">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-1 font-bold">Education Type</label>
                        <select 
                          value={item.educationType || ''}
                          onChange={(e) => {
                            updateEducation(item.id, {
                              educationType: e.target.value,
                              educationLevel: '',
                              degree: ''
                            });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-white text-xs select-custom"
                        >
                          <option value="">Select Education Type</option>
                          <option value="School">School</option>
                          <option value="College">College</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Bachelor's Degree">Bachelor's Degree</option>
                          <option value="Master's Degree">Master's Degree</option>
                          <option value="Doctorate / PhD">Doctorate / PhD</option>
                        </select>
                      </div>

                      {item.educationType && (
                        <div className="animate-fade-in">
                          <label className="block text-[10px] text-slate-500 mb-1 font-bold">Education Level</label>
                          <select 
                            value={item.educationLevel || ''}
                            onChange={(e) => {
                              updateEducation(item.id, {
                                educationLevel: e.target.value,
                                degree: e.target.value
                              });
                            }}
                            className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-white text-xs select-custom"
                          >
                            <option value="">Select Education Level</option>
                            {getEducationLevels(item.educationType).map(lvl => (
                              <option key={lvl} value={lvl}>{lvl}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {item.educationType && item.educationLevel && (
                        <div className="animate-fade-in">
                          <label className="block text-[10px] text-slate-500 mb-1 font-bold">Year</label>
                          <select 
                            value={item.year}
                            onChange={(e) => updateEducation(item.id, 'year', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-white text-xs select-custom"
                          >
                            <option value="">Select Year</option>
                            {Array.from({ length: 2026 - 2005 + 1 }, (_, i) => 2026 - i).map(yr => (
                              <option key={yr} value={yr}>{yr}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 10: CONTACT */}
        {currentStep === 10 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-gold-400" /> Contact Info
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">Email Address</label>
                  <input 
                    type="email" 
                    value={cv.email}
                    disabled={true} // email is associated with their login account
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-xs opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-bold">Phone Number</label>
                  <input 
                    type="text" 
                    value={cv.phone}
                    onChange={(e) => updateCVField('phone', e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* References Option */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center pb-1.5" style={{ borderBottom: '3.5px solid #000000' }}>
                <h3 className="text-sm font-bold flex items-center gap-1.5" style={{ color: '#000000' }}>
                  <User className="w-4 h-4 text-black" /> References
                </h3>
                <button 
                  onClick={addReference}
                  className="flex items-center gap-1 text-xs hover:opacity-80 transition-all font-black cursor-pointer"
                  style={{ color: '#0A192F', background: 'transparent', border: 'none' }}
                >
                  <Plus className="w-3.5 h-3.5" style={{ color: '#0A192F' }} /> Add Reference
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-xs text-slate-400 mb-1.5 font-bold">References Display Setting <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                    <input 
                      type="radio" 
                      name="showReferences"
                      checked={cv.showReferences === 'show'}
                      onChange={() => updateCVField('showReferences', 'show')}
                      className="text-gold-500 focus:ring-0" 
                    />
                    Display directly on CV
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                    <input 
                      type="radio" 
                      name="showReferences"
                      checked={cv.showReferences === 'request'}
                      onChange={() => updateCVField('showReferences', 'request')}
                      className="text-gold-500 focus:ring-0" 
                    />
                    Show "Available upon request"
                  </label>
                </div>
              </div>

              {cv.showReferences === 'show' && (
                cv.references.length === 0 ? (
                  <div className="text-center py-6 bg-slate-950/20 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                    No references added yet.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {cv.references.map((ref) => (
                      <div key={ref.id} className="bg-slate-950 p-3 rounded-lg border border-slate-850 space-y-2 relative">
                        <button 
                          onClick={() => removeReference(ref.id)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-400 p-1 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="grid grid-cols-2 gap-2 pr-6">
                          <div>
                            <label className="block text-[9px] text-slate-500 mb-1">Name <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              value={ref.name}
                              onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] text-slate-500 mb-1">Organisation <span className="text-red-500">*</span></label>
                            <input 
                              type="text" 
                              value={ref.organisation}
                              onChange={(e) => updateReference(ref.id, 'organisation', e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded text-white text-xs"
                            />
                          </div>
                        </div>

                        {/* Mobile Number Row */}
                        <div className="mt-1.5 pr-6">
                          <label className="block text-[9px] text-slate-500 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                          {(() => {
                            const phoneCodes = ['+91', '+44', '+61', '+971', '+1', '+27', '+64', '+94', '+968', '+263'];
                            let selectedCode = '+91';
                            let restNumber = ref.phone || '';
                            
                            for (const code of phoneCodes) {
                              if (restNumber.startsWith(code)) {
                                selectedCode = code;
                                restNumber = restNumber.substring(code.length).trim();
                                break;
                              }
                            }

                            return (
                              <div className="flex gap-1">
                                <select
                                  value={selectedCode}
                                  onChange={(e) => {
                                    const code = e.target.value;
                                    updateReference(ref.id, 'phone', `${code} ${restNumber}`);
                                  }}
                                  className="bg-slate-900 border border-slate-800 p-1.5 rounded text-white text-xs cursor-pointer w-20 flex-shrink-0 select-custom"
                                >
                                  <option value="+91">+91 (IN)</option>
                                  <option value="+44">+44 (UK)</option>
                                  <option value="+61">+61 (AU)</option>
                                  <option value="+971">+971 (AE)</option>
                                  <option value="+1">+1 (US/CA)</option>
                                  <option value="+27">+27 (ZA)</option>
                                  <option value="+64">+64 (NZ)</option>
                                  <option value="+94">+94 (LK)</option>
                                  <option value="+968">+968 (OM)</option>
                                  <option value="+263">+263 (ZW)</option>
                                </select>
                                <input 
                                  type="text" 
                                  value={restNumber}
                                  placeholder="Phone number"
                                  onChange={(e) => {
                                    const num = e.target.value.replace(/[^0-9\s-]/g, '');
                                    updateReference(ref.id, 'phone', `${selectedCode} ${num}`);
                                  }}
                                  className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded text-white text-xs"
                                />
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}
          </div>
        </div>
      )}

        {/* STEP 11: LANGUAGES & HOBBIES */}
        {currentStep === 11 && (
          <div className="space-y-6 text-left animate-fade-in">
            {/* Languages */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-gold-400" /> Languages
              </h3>
              <p className="text-xs text-slate-400 font-semibold mb-1">
                Select the languages you can speak and communicate in:
              </p>
              
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setOpenLanguages(!openLanguages);
                    setOpenHobbies(false);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-xs text-left flex justify-between items-center"
                >
                  <span>Select Languages...</span>
                  <span className="text-slate-500 font-bold">▼</span>
                </button>

                {openLanguages && (
                  <div className="absolute left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-lg shadow-xl z-55 max-h-[200px] overflow-y-auto p-2 space-y-1">
                    {LANGUAGES_OPTIONS.map((lang) => {
                      const isSelected = (cv.languages || []).includes(lang);
                      return (
                        <label
                          key={lang}
                          className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-xs text-slate-300 no-blue-hover"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              const currentList = cv.languages || [];
                              const newList = isSelected
                                ? currentList.filter(l => l !== lang)
                                : [...currentList, lang];
                              updateCVField('languages', newList);
                            }}
                            className="rounded text-gold-500 bg-slate-900 border-slate-800 focus:ring-0"
                          />
                          {lang}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected languages tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(cv.languages || []).map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ color: '#0A192F' }}
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => {
                        updateCVField('languages', (cv.languages || []).filter(l => l !== lang));
                      }}
                      className="text-red-500 hover:text-red-400 font-bold ml-1 text-sm"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4" style={{ borderTop: '3.5px solid #000000' }}>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-gold-400" /> Hobbies & Interests
              </h3>
              <p className="text-xs text-slate-400 font-semibold mb-1">
                Select your hobbies and interests:
              </p>
              
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setOpenHobbies(!openHobbies);
                    setOpenLanguages(false);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded text-white text-xs text-left flex justify-between items-center"
                >
                  <span>Select Hobbies...</span>
                  <span className="text-slate-500 font-bold">▼</span>
                </button>

                {openHobbies && (
                  <div className="absolute left-0 right-0 mt-1 bg-slate-950 border border-slate-800 rounded-lg shadow-xl z-55 max-h-[200px] overflow-y-auto p-2 space-y-1">
                    {HOBBIES_OPTIONS.map((hobby) => {
                      const isSelected = (cv.hobbies || []).includes(hobby);
                      return (
                        <label
                          key={hobby}
                          className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-xs text-slate-300 no-blue-hover"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              const currentList = cv.hobbies || [];
                              const newList = isSelected
                                ? currentList.filter(h => h !== hobby)
                                : [...currentList, hobby];
                              updateCVField('hobbies', newList);
                            }}
                            className="rounded text-gold-500 bg-slate-900 border-slate-800 focus:ring-0"
                          />
                          {hobby}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected hobbies tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(cv.hobbies || []).map((hobby) => (
                  <span
                    key={hobby}
                    className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ color: '#0A192F' }}
                  >
                    {hobby}
                    <button
                      type="button"
                      onClick={() => {
                        updateCVField('hobbies', (cv.hobbies || []).filter(h => h !== hobby));
                      }}
                      className="text-red-500 hover:text-red-400 font-bold ml-1 text-sm"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {validationError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-lg text-xs font-semibold mt-4 text-left">
          {validationError}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="pt-6 mt-6 flex justify-between navigation-buttons-container">
        <button
          onClick={handlePrevStep}
          className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all flex items-center gap-1 text-xs cursor-pointer back-nav-btn"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        
        <button
          onClick={handleNextStep}
          className="px-6 py-2.5 rounded-lg font-bold bg-gold-gradient text-navy-950 hover:opacity-90 transition-all flex items-center gap-1 text-xs cursor-pointer continue-nav-btn"
        >
          {currentStep === steps.length ? 'Go to Review' : 'Save & Continue'} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
