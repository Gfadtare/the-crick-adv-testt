import React from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, User, Globe, Phone, Mail, ShieldCheck, RefreshCw, Copy, Check } from 'lucide-react';
import { SubmissionData } from './types';

interface SubmissionSummaryProps {
  data: SubmissionData;
  onReset: () => void;
}

export const SubmissionSummary: React.FC<SubmissionSummaryProps> = ({ data, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = `Cricket Skills Certification Registration\nAssessment ID: ${data.id}\nName: ${data.firstName} ${data.lastName}\nAge: ${data.age}\nNationality: ${data.nationality}\nResidence: ${data.countryOfResidence}\nRole: ${data.playingRole} (${data.subRole})\nMobile: ${data.mobileCountryCode} ${data.mobileNumber}\nEmail: ${data.email}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden my-6"
    >
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 md:p-8 text-center relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 opacity-15 text-white pointer-events-none">
          <Award size={180} />
        </div>
        <div className="inline-flex items-center justify-center p-3 bg-white/15 backdrop-blur-md rounded-full mb-3 text-emerald-100">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Assessment Registered!</h2>
        <p className="text-emerald-100 mt-1 text-sm md:text-base">
          Cricket Skills Certification Assessment Test details have been successfully captured.
        </p>
        <div className="mt-4 inline-block bg-emerald-950/40 border border-emerald-400/30 rounded-lg px-4 py-1.5 text-xs md:text-sm font-mono tracking-wider">
          ID: <span className="text-emerald-300 font-semibold">{data.id}</span>
        </div>
      </div>

      {/* Ticket Body */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Personal Info Group */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-3 uppercase tracking-wider">
            <User size={18} />
            <span>Candidate Profile</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500 block text-xs">Full Name</span>
              <span className="font-medium text-slate-900 text-base">
                {data.firstName} {data.lastName}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Age Category</span>
              <span className="font-medium text-slate-900 text-base">
                {data.age} Years Old ({data.isAbove18 === 'Yes' ? 'Adult' : 'Minor'})
              </span>
            </div>

            {data.isAbove18 === 'No' && data.applicantRelation && (
              <div className="md:col-span-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <span className="text-amber-800 text-xs block font-medium">Applied By Guardian / Parent</span>
                <span className="text-amber-950 font-semibold text-sm">
                  {data.applicantRelation}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Location & Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-3 uppercase tracking-wider">
              <Globe size={18} />
              <span>Location Details</span>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-slate-500 block text-xs">Nationality</span>
                <span className="font-medium text-slate-900">{data.nationality}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs">Country of Residence</span>
                <span className="font-medium text-slate-900">{data.countryOfResidence}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-3 uppercase tracking-wider">
              <Phone size={18} />
              <span>Contact Info</span>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-slate-500 block text-xs flex items-center gap-1">
                  <Phone size={12} /> Mobile Number
                </span>
                <span className="font-medium text-slate-900 font-mono">
                  {data.mobileCountryCode} {data.mobileNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-xs flex items-center gap-1">
                  <Mail size={12} /> Email Address
                </span>
                <span className="font-medium text-slate-900 truncate block">{data.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Playing Specialty */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 rounded-xl p-5 border border-emerald-200">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm mb-2 uppercase tracking-wider">
            <ShieldCheck size={18} />
            <span>Cricket Playing Role & Skill Specialty</span>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-emerald-700 text-xs font-medium">Selected Primary Role</span>
              <div className="text-emerald-950 font-bold text-lg">{data.playingRole}</div>
            </div>
            <div className="pt-2 border-t border-emerald-200/80">
              <span className="text-emerald-700 text-xs font-medium">Certified Sub-Role Option</span>
              <div className="text-slate-900 font-medium text-sm md:text-base mt-0.5 bg-white/80 p-3 rounded-lg border border-emerald-200/60 shadow-xs">
                {data.subRole}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition cursor-pointer"
          >
            {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
            <span>{copied ? 'Copied Details' : 'Copy Registration Details'}</span>
          </button>
          <button
            onClick={onReset}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-800 text-white rounded-xl font-medium hover:bg-emerald-900 transition shadow-md shadow-emerald-900/10 cursor-pointer"
          >
            <RefreshCw size={18} />
            <span>Take Another Test</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
