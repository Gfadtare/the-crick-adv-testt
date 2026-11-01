import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Globe,
  Mail,
  Award,
  AlertCircle,
  X,
  ShieldCheck,
  Sparkles,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Check,
} from 'lucide-react';
import { FormState, Country, PlayingRole, IsAbove18, ApplicantRelation, SubmissionData } from './types';
import {
  COUNTRIES,
  COUNTRY_CODES,
  APPLICANT_RELATIONS,
  PLAYING_ROLES,
  SUB_ROLES_MAP,
  getAgeOptions,
} from './cricketOptions';

interface CricketAssessmentFormProps {
  onClose: () => void;
  onSubmitSuccess: (data: SubmissionData) => void;
}

export const CricketAssessmentForm: React.FC<CricketAssessmentFormProps> = ({
  onClose,
  onSubmitSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const [formData, setFormData] = useState<FormState>({
    firstName: '',
    lastName: '',
    isAbove18: '',
    age: '',
    applicantRelation: '',
    nationality: '',
    countryOfResidence: '',
    mobileCountryCode: '+91',
    mobileNumber: '',
    email: '',
    playingRole: '',
    subRole: '',
    testMode: 'Online',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Name filters (prevents typing numbers or special characters) and capitalizes every word
  const handleFirstNameChange = (val: string) => {
    const cleanVal = val.replace(/[^a-zA-Z\s'-]/g, '');
    const capitalizedVal = cleanVal
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setFormData((prev) => ({ ...prev, firstName: capitalizedVal }));
    if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: undefined }));
  };

  const handleLastNameChange = (val: string) => {
    const cleanVal = val.replace(/[^a-zA-Z\s'-]/g, '');
    const capitalizedVal = cleanVal
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setFormData((prev) => ({ ...prev, lastName: capitalizedVal }));
    if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: undefined }));
  };

  // Mobile Number filter (prevents typing alphabets)
  const handleMobileNumberChange = (val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, mobileNumber: cleanVal }));
    if (errors.mobileNumber) setErrors((prev) => ({ ...prev, mobileNumber: undefined }));
  };

  const handleAbove18Change = (val: IsAbove18) => {
    setFormData((prev) => ({
      ...prev,
      isAbove18: val,
      age: '',
      applicantRelation: val === 'Yes' ? '' : prev.applicantRelation,
    }));
    if (errors.isAbove18) {
      setErrors((prev) => ({ ...prev, isAbove18: undefined, age: undefined, applicantRelation: undefined }));
    }
  };

  // Handle Country of Residence change (auto update country code)
  const handleCountryOfResidenceChange = (country: Country) => {
    const code = COUNTRY_CODES[country] || '+91';
    setFormData((prev) => ({
      ...prev,
      countryOfResidence: country,
      mobileCountryCode: code,
    }));
    if (errors.countryOfResidence) {
      setErrors((prev) => ({ ...prev, countryOfResidence: undefined }));
    }
  };

  // Handle Playing Role change
  const handlePlayingRoleChange = (role: PlayingRole) => {
    setFormData((prev) => ({
      ...prev,
      playingRole: role,
      subRole: '', // Reset sub role when main role changes
    }));
    if (errors.playingRole) {
      setErrors((prev) => ({ ...prev, playingRole: undefined, subRole: undefined }));
    }
  };

  // Validate specific step
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (stepNumber === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First Name is required (letters only)';
      } else if (/[0-9]/.test(formData.firstName)) {
        newErrors.firstName = 'First Name cannot contain numbers';
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last Name is required (letters only)';
      } else if (/[0-9]/.test(formData.lastName)) {
        newErrors.lastName = 'Last Name cannot contain numbers';
      }

      if (!formData.isAbove18) newErrors.isAbove18 = 'Select candidate age category (Above 18: Yes/No)';
      if (!formData.age) newErrors.age = 'Select candidate age';

      if (formData.isAbove18 === 'No' && !formData.applicantRelation) {
        newErrors.applicantRelation = 'Select parent/guardian applying for minor candidate';
      }
    }

    if (stepNumber === 2) {
      if (!formData.nationality) newErrors.nationality = 'Select Nationality';
      if (!formData.countryOfResidence) newErrors.countryOfResidence = 'Select Country of Residence';

      if (!formData.mobileNumber.trim()) {
        newErrors.mobileNumber = 'Mobile Number is required (digits only)';
      } else if (!/^\d{6,14}$/.test(formData.mobileNumber)) {
        newErrors.mobileNumber = 'Valid mobile number required (6-14 digits)';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email ID is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = 'Enter a valid email address';
      }
    }

    if (stepNumber === 3) {
      if (!formData.playingRole) newErrors.playingRole = 'Select primary playing role';
      if (!formData.subRole) newErrors.subRole = 'Select specific technique / sub-role option';
    }

    if (stepNumber === 4) {
      if (!formData.testMode) newErrors.testMode = 'Select assessment test format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      return;
    }

    const registrationId = `CSA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const submission: SubmissionData = {
      ...formData,
      id: registrationId,
      submittedAt: new Date().toLocaleString(),
    };

    onSubmitSuccess(submission);
  };

  const currentSubRoles = formData.playingRole ? SUB_ROLES_MAP[formData.playingRole] : [];
  const ageOptions = getAgeOptions(formData.isAbove18);

  const stepTitles = [
    'Personal Details & Age Verification',
    'Location & Contact Details',
    'Cricket Playing Role & Specialty',
    'Select Assessment Test Format & Fee',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border-2 border-slate-300 overflow-hidden my-4 md:my-6"
    >
      {/* Clean Modal Header with Progress Indicator (Hidden earlier requested promotional header text) */}
      <div className="bg-[#0B192C] text-white p-4 sm:p-6 md:p-8 relative border-b-4 border-amber-500">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-600 z-10"
          title="Close form"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pr-10 md:pr-12">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center text-[#0B192C] shadow-lg font-black shrink-0 border-2 border-amber-300">
              <Award size={22} className="sm:w-[26px] sm:h-[26px]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white">
                Registration Form
              </h3>
              <p className="text-[10px] sm:text-xs text-amber-300 font-extrabold uppercase tracking-wider mt-0.5">
                Step {currentStep} of 4: {stepTitles[currentStep - 1]}
              </p>
            </div>
          </div>

          {/* Step Progress Indicators */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black border-2 transition-all ${
                  currentStep === step
                    ? 'bg-amber-400 text-[#0B192C] border-amber-300 scale-105 sm:scale-110 shadow-md'
                    : currentStep > step
                    ? 'bg-blue-800 text-amber-300 border-blue-600'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {currentStep > step ? <CheckCircle size={14} /> : step}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full mt-5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Global Validation Error Banner */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border-b-2 border-red-300 p-4 px-6 md:px-8 flex items-center gap-3 text-red-900 text-sm font-medium">
          <AlertCircle size={20} className="text-red-600 shrink-0" />
          <span>
            Please review the highlighted fields below before proceeding to the next step.
          </span>
        </div>
      )}

      {/* FORM CONTENT DISPLAYING ONE SECTION AT A TIME */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 bg-slate-50/50">
        <AnimatePresence mode="wait">

          {/* ================= STEP 1: PERSONAL DETAILS & AGE VERIFICATION ================= */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-blue-300 shadow-sm space-y-6"
            >
              <div className="border-b-2 border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-3">
                <div className="flex items-center gap-2 text-[#0B192C] font-black text-base sm:text-lg min-w-0">
                  <User size={20} className="text-blue-600 shrink-0" />
                  <h3 className="text-sm sm:text-base md:text-lg leading-tight font-black text-[#0B1A30]">1. Personal Information & Candidate Age</h3>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-slate-300 uppercase tracking-wider shrink-0">
                  Step 1 of 4
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* First Name Box */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleFirstNameChange(e.target.value)}
                    placeholder="First name (Alphabets only)"
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.firstName ? 'border-red-500 bg-red-50/50' : 'border-blue-200 focus:border-blue-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-semibold text-sm bg-white shadow-xs`}
                  />
                  <p className="text-[11px] text-slate-500">Only alphabetic characters permitted</p>
                  {errors.firstName && (
                    <p className="text-red-600 text-xs font-medium flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name Box */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleLastNameChange(e.target.value)}
                    placeholder="Last name (Alphabets only)"
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.lastName ? 'border-red-500 bg-red-50/50' : 'border-blue-200 focus:border-blue-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-semibold text-sm bg-white shadow-xs`}
                  />
                  <p className="text-[11px] text-slate-500">Only alphabetic characters permitted</p>
                  {errors.lastName && (
                    <p className="text-red-600 text-xs font-medium flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Are you above 18 Box */}
              <div className="space-y-2 pt-2 border-t-2 border-slate-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Are you above 18 years? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleAbove18Change('Yes')}
                    className={`py-3.5 px-4 rounded-xl border-2 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                      formData.isAbove18 === 'Yes'
                        ? 'bg-[#0B192C] text-amber-400 border-[#0B192C] shadow-md ring-2 ring-blue-600/30'
                        : 'bg-white text-slate-700 border-blue-200 hover:border-blue-300 hover:bg-blue-50/30'
                    }`}
                  >
                    <CheckCircle size={18} className={formData.isAbove18 === 'Yes' ? 'text-amber-400' : 'text-slate-400'} />
                    <span>Yes (18+ Adult Candidate)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAbove18Change('No')}
                    className={`py-3.5 px-4 rounded-xl border-2 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                      formData.isAbove18 === 'No'
                        ? 'bg-[#0B192C] text-amber-400 border-[#0B192C] shadow-md ring-2 ring-blue-600/30'
                        : 'bg-white text-slate-700 border-blue-200 hover:border-blue-300 hover:bg-blue-50/30'
                    }`}
                  >
                    <CheckCircle size={18} className={formData.isAbove18 === 'No' ? 'text-amber-400' : 'text-slate-400'} />
                    <span>No (Under 18 Minor Candidate)</span>
                  </button>
                </div>
                {errors.isAbove18 && (
                  <p className="text-red-600 text-xs font-medium flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.isAbove18}
                  </p>
                )}
              </div>

              {/* Conditional Age & Minor Guardian Row */}
              {formData.isAbove18 !== '' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-2 border-t-2 border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  {/* Age Selection Dropdown */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                      Select Candidate Age ({formData.isAbove18 === 'Yes' ? '18 to 50 Years' : '5 to 17 Years'}) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.age}
                      onChange={(e) => {
                        setFormData({ ...formData, age: e.target.value });
                        if (errors.age) setErrors({ ...errors, age: undefined });
                      }}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        errors.age ? 'border-red-500 bg-red-50/50' : 'border-blue-200 focus:border-blue-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-semibold text-sm bg-white shadow-xs cursor-pointer`}
                    >
                      <option value="">{formData.isAbove18 === 'Yes' ? 'Please Select Your Age' : 'Please Select Candidate Age'}</option>
                      {ageOptions.map((num) => (
                        <option key={num} value={num}>
                          {num} years old
                        </option>
                      ))}
                    </select>
                    {errors.age && (
                      <p className="text-red-600 text-xs font-medium flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.age}
                      </p>
                    )}
                  </div>

                  {/* Minor Applicant Logic */}
                  {formData.isAbove18 === 'No' && (
                    <div className="space-y-1.5 bg-amber-50 p-4 rounded-xl border-2 border-amber-300">
                      <label className="block text-xs font-bold uppercase tracking-wider text-amber-950">
                        Who is applying for cricket skills certification test? <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.applicantRelation}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            applicantRelation: e.target.value as ApplicantRelation,
                          });
                          if (errors.applicantRelation) setErrors({ ...errors, applicantRelation: undefined });
                        }}
                        className={`w-full px-4 py-2.5 rounded-xl border-2 ${
                          errors.applicantRelation ? 'border-red-500 bg-red-50/50' : 'border-blue-200 focus:border-blue-600'
                        } focus:outline-none text-slate-900 font-semibold text-sm bg-white cursor-pointer`}
                      >
                        <option value="">Select Your Relationship</option>
                        {APPLICANT_RELATIONS.map((rel) => (
                          <option key={rel} value={rel}>
                            {rel}
                          </option>
                        ))}
                      </select>
                      {errors.applicantRelation && (
                        <p className="text-red-600 text-xs font-medium flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.applicantRelation}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ================= STEP 2: LOCATION & CONTACT DETAILS ================= */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-blue-300 shadow-sm space-y-6"
            >
              <div className="border-b-2 border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-3">
                <div className="flex items-center gap-2 text-[#0B192C] font-black text-base sm:text-lg min-w-0">
                  <Globe size={20} className="text-blue-600 shrink-0" />
                  <h3 className="text-sm sm:text-base md:text-lg leading-tight font-black text-[#0B1A30]">2. Location & Contact Details</h3>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-slate-300 uppercase tracking-wider shrink-0">
                  Step 2 of 4
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nationality Box */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.nationality}
                    onChange={(e) => {
                      setFormData({ ...formData, nationality: e.target.value as Country });
                      if (errors.nationality) setErrors({ ...errors, nationality: undefined });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.nationality ? 'border-red-500 bg-red-50/50' : 'border-blue-200 focus:border-blue-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-semibold text-sm bg-white shadow-xs cursor-pointer`}
                  >
                    <option value="">-- Select Nationality --</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.nationality && (
                    <p className="text-red-600 text-xs font-medium flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.nationality}
                    </p>
                  )}
                </div>

                {/* Country of Residence Box */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    Country of Residence <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.countryOfResidence}
                    onChange={(e) => handleCountryOfResidenceChange(e.target.value as Country)}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      errors.countryOfResidence ? 'border-red-500 bg-red-50/50' : 'border-blue-200 focus:border-blue-600'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-semibold text-sm bg-white shadow-xs cursor-pointer`}
                  >
                    <option value="">-- Select Residence --</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.countryOfResidence && (
                    <p className="text-red-600 text-xs font-medium flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.countryOfResidence}
                    </p>
                  )}
                </div>

                {/* Mobile No Box */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="w-24 shrink-0 relative">
                      <span className="absolute left-2.5 top-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
                        CODE
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={formData.mobileCountryCode}
                        className="w-full pl-2.5 pr-1 pt-4 pb-1 rounded-xl border-2 border-blue-200 bg-slate-100 font-mono font-bold text-slate-900 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formData.mobileNumber}
                        onChange={(e) => handleMobileNumberChange(e.target.value)}
                        placeholder="Digits only (e.g. 9876543210)"
                        className={`w-full px-3.5 py-3 rounded-xl border-2 ${
                          errors.mobileNumber ? 'border-red-500 bg-red-50/50' : 'border-blue-200 focus:border-blue-600'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-mono font-semibold text-sm bg-white shadow-xs`}
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">Alphabets strictly blocked</p>
                  {errors.mobileNumber && (
                    <p className="text-red-600 text-xs font-medium flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.mobileNumber}
                    </p>
                  )}
                </div>

                {/* Email ID Box */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value.trim() });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      placeholder="candidate@example.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                        errors.email ? 'border-red-500 bg-red-50/50' : 'border-blue-200 focus:border-blue-600'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 font-semibold text-sm bg-white shadow-xs`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">For assessment confirmation updates</p>
                  {errors.email && (
                    <p className="text-red-600 text-xs font-medium flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= STEP 3: PLAYING ROLE & SPECIALTY SELECTION ================= */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-slate-300 shadow-sm space-y-6"
            >
              <div className="border-b-2 border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-3">
                <div className="flex items-center gap-2 text-[#0B192C] font-black text-base sm:text-lg min-w-0">
                  <ShieldCheck size={20} className="text-blue-600 shrink-0" />
                  <h3 className="text-sm sm:text-base md:text-lg leading-tight font-black text-[#0B1A30]">3. Playing Role & Technical Specialty</h3>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-slate-300 uppercase tracking-wider shrink-0">
                  Step 3 of 4
                </span>
              </div>

              {/* Primary Playing Role Cards (5 Roles) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                  Select Primary Playing Role (Click one option) <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                  {PLAYING_ROLES.map((role) => {
                    const isSelected = formData.playingRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handlePlayingRoleChange(role)}
                        className={`p-3 sm:p-4 rounded-xl border border-black text-left flex flex-col justify-between transition cursor-pointer min-h-[84px] sm:min-h-[96px] ${
                          isSelected
                            ? 'bg-[#0B192C] text-amber-300 shadow-lg ring-2 ring-blue-600/40'
                            : 'bg-white text-slate-800 hover:bg-slate-50'
                        }`}
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        <div className="flex items-center justify-end mb-1">
                          <div
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-400'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#0B1A30]" />}
                          </div>
                        </div>
                        <span className="font-extrabold text-xs sm:text-sm leading-tight">{role}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.playingRole && (
                  <p className="text-red-600 text-xs font-medium flex items-center gap-1 mt-1">
                    <AlertCircle size={12} /> {errors.playingRole}
                  </p>
                )}
              </div>

              {/* Sub-Role Options Container */}
              {formData.playingRole ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-black space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-black text-[#0B192C]">
                        Specialty / Sub-Role Options for <span className="text-blue-700 underline">{formData.playingRole}</span>
                      </h4>
                      <p className="text-xs text-slate-600">
                        Select your exact technique specialization ({currentSubRoles.length} options available):
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-full border border-blue-300 self-start sm:self-center shrink-0">
                      {formData.subRole ? '1 Selected' : '0 Selected'}
                    </span>
                  </div>

                  {/* Sub-Role Options Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto p-1">
                    {currentSubRoles.map((option) => {
                      const isOptionSelected = formData.subRole === option;
                      return (
                        <label
                          key={option}
                          onClick={() => {
                            setFormData({ ...formData, subRole: option });
                            if (errors.subRole) setErrors({ ...errors, subRole: undefined });
                          }}
                          className={`p-2.5 sm:p-3.5 rounded-xl border border-black transition cursor-pointer flex items-start gap-2 sm:gap-3 ${
                            isOptionSelected
                              ? 'bg-blue-900 text-white shadow-md ring-2 ring-amber-400/50'
                              : 'bg-white text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name="subRoleOption"
                            checked={isOptionSelected}
                            onChange={() => {}}
                            className="mt-1 text-blue-600 focus:ring-blue-500 h-4 w-4 shrink-0 cursor-pointer"
                          />
                          <span className={`text-[11px] sm:text-xs font-bold leading-relaxed ${isOptionSelected ? 'text-white' : 'text-slate-800'}`}>
                            {option}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {errors.subRole && (
                    <p className="text-red-600 text-xs font-medium flex items-center gap-1 mt-1">
                      <AlertCircle size={12} /> {errors.subRole}
                    </p>
                  )}
                </motion.div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-black bg-slate-50 text-center text-xs text-slate-500 font-medium">
                  Please click on a Primary Playing Role above to display its technical sub-role options.
                </div>
              )}
            </motion.div>
          )}

          {/* ================= STEP 4: ONLINE & OFFLINE PACKAGE SELECTION ================= */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl p-4 sm:p-6 border-2 border-slate-300 shadow-sm space-y-6"
            >
              <div className="border-b-2 border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between items-start gap-3">
                <div className="flex items-center gap-2 text-[#0B192C] font-black text-base sm:text-lg min-w-0">
                  <Award size={20} className="text-blue-600 shrink-0" />
                  <h3 className="text-sm sm:text-base md:text-lg leading-tight font-black text-[#0B1A30]">4. Select Assessment Format & Fee</h3>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-amber-300 uppercase tracking-wider shrink-0">
                  Step 4 of 4
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
                You have successfully completed your registration details. Please select your preferred assessment format package below to proceed with payment:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Online Test Option Box */}
                <div
                  className={`p-4 sm:p-6 rounded-2xl border-2 transition relative flex flex-col justify-between bg-white border-slate-355`}
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[#0B192C] font-black text-xl mb-2">
                        <Sparkles size={22} className="text-blue-600" />
                        Online Video Assessment
                      </div>
                      <p className="text-xs mb-6 leading-relaxed font-bold text-center text-blue-900 bg-blue-50/60 px-3 py-2.5 rounded-xl border border-blue-100">
                        Showcase Your Cricket Through Videos. Get Expertly Assessed. Unlock Your Potential.<br />
                        Professional evaluation by a BCCI Level 3 & ECB Level 1 Qualified Coach
                      </p>

                      <div className="text-left space-y-2 mb-6 text-sm font-medium text-slate-700 pt-2 border-t border-slate-100">
                        <span className="font-extrabold text-xs block text-blue-900 mb-2">On-line Features:</span>
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            'Video-Based Skill Assessment',
                            'Batting Technique Assessment',
                            'Bowling Technique Assessment',
                            'Fielding Skills Assessment',
                            'Wicketkeeping Assessment (Where Applicable)',
                            'Technical Strengths & Weaknesses Analysis',
                            'Expert Coach Evaluation by BCCI Level 3 & ECB Level 1 Qualified Coach',
                            'Professional Skill Rating Score',
                            'Player Strengths & Development Areas',
                            'Overseas Club Suitability Assessment',
                            'Personalised Digital Assessment Report',
                            'Official Digital Cricket Skills Certificate'
                          ].map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Check size={14} className="text-emerald-600 shrink-0 mt-1" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pay Button at the bottom */}
                    <div className="pt-4 flex items-center justify-center border-t border-slate-100 mt-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData(prev => ({ ...prev, testMode: 'Online' }));
                          const registrationId = `CSA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
                          const submission = {
                            ...formData,
                            testMode: 'Online',
                            id: registrationId,
                            submittedAt: new Date().toLocaleString(),
                          };
                          onSubmitSuccess(submission);
                        }}
                        className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition shadow-md hover:scale-105 cursor-pointer text-center text-sm border border-emerald-400"
                      >
                        Pay ₹11,999 INR
                      </button>
                    </div>
                  </div>
                </div>

                {/* Offline Test Option Box */}
                <div
                  className={`p-4 sm:p-6 rounded-2xl border-2 transition relative flex flex-col justify-between bg-white border-slate-355`}
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[#0B192C] font-black text-xl mb-2">
                        <Award size={22} className="text-amber-500" />
                        Offline On-Ground Assessment
                      </div>
                      <p className="text-xs mb-6 leading-relaxed font-bold text-center text-amber-900 bg-amber-50/50 px-3 py-2.5 rounded-xl border border-amber-200">
                        Showcase Your Cricket Skills Live. Get Assessed by Expert Coaches.<br />
                        On-ground performance evaluation by BCCI Level 3 & ECB Level 1 Qualified Coaches.
                      </p>

                      <div className="text-left space-y-2 mb-6 text-sm font-medium text-slate-700 pt-2 border-t border-slate-100">
                        <span className="font-extrabold text-xs block text-[#0B1A30] mb-2">Off-Line Features</span>
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            'Live Batting Assessment',
                            'Live Bowling Assessment',
                            'Live Fielding Assessment',
                            'Wicketkeeping Assessment (Where Applicable)',
                            'Batting Technique & Shot Execution',
                            'Bowling Accuracy, Pace/Spin & Variations',
                            'Fielding Technique, Catching & Throwing',
                            'One-to-One Expert Coach Observation',
                            'Expert Coach Evaluation by BCCI Level 3 & ECB Level 1 Qualified Coach',
                            'Technical Strengths & Weaknesses Analysis',
                            'Professional Skill Rating Score',
                            'Overseas Club Suitability Assessment',
                            'Expert Coach Assessment Report',
                            'Official Cricket Skills Certificate'
                          ].map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Check size={14} className="text-emerald-600 shrink-0 mt-1" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pay Button at the bottom with different premium gold gradient */}
                    <div className="pt-4 flex items-center justify-center border-t border-slate-100 mt-auto">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData(prev => ({ ...prev, testMode: 'Offline' }));
                          const registrationId = `CSA-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
                          const submission = {
                            ...formData,
                            testMode: 'Offline',
                            id: registrationId,
                            submittedAt: new Date().toLocaleString(),
                          };
                          onSubmitSuccess(submission);
                        }}
                        className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-white font-extrabold rounded-xl transition shadow-md hover:scale-105 cursor-pointer text-center text-sm border border-amber-400"
                      >
                        Pay ₹17,999 INR
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* STEP NAVIGATION CONTROLS AT THE BOTTOM */}
        <div className="mt-6 pt-6 border-t-2 border-slate-300 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-3 sm:px-5 sm:py-3 rounded-xl border-2 border-slate-300 bg-white text-slate-800 font-bold hover:bg-slate-100 transition cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-1 flex-1 sm:flex-initial"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
              <span className="hidden sm:inline"> to Step {currentStep - 1}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 sm:px-5 sm:py-3 rounded-xl border-2 border-slate-300 bg-white text-slate-600 font-bold hover:bg-slate-100 transition cursor-pointer text-xs uppercase tracking-wider flex-1 sm:flex-initial text-center"
            >
              Cancel
            </button>
          )}

          {currentStep < 4 && (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-3.5 sm:px-8 sm:py-3.5 bg-[#0B192C] hover:bg-blue-950 text-amber-300 font-black text-sm rounded-xl transition shadow-lg cursor-pointer border-2 border-[#0B192C] flex items-center justify-center gap-2 flex-1 sm:flex-initial"
            >
              <span>Next Step</span>
              <ChevronRight size={16} className="text-amber-400" />
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};
