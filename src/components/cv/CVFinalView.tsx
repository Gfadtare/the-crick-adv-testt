import React from 'react';
import { Download, LayoutDashboard, Sparkles, AlertCircle } from 'lucide-react';
import { CricketCVFull } from './CVTypes';
import CVLivePreview from './CVLivePreview';

interface CVFinalViewProps {
  cv: CricketCVFull;
  onDownloadCleanPDF: () => void;
  onGoToDashboard: () => void;
}

export default function CVFinalView({ cv, onDownloadCleanPDF, onGoToDashboard }: CVFinalViewProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-8 text-left max-w-5xl mx-auto shadow-2xl space-y-8 font-sans cv-final-card">
      <style dangerouslySetInnerHTML={{__html: `
        .cv-final-card {
          background-color: #ffffff !important;
          border-color: #e2e8f0 !important;
          color: #334155 !important;
        }
        .cv-final-card h2, 
        .cv-final-card h3, 
        .cv-final-card h4 {
          color: #0B1A30 !important;
        }
        .cv-final-card p.text-slate-400 {
          color: #64748b !important;
        }
        .cv-final-card .bg-slate-950 {
          background-color: #f8fafc !important;
          border-color: #e2e8f0 !important;
        }
        .cv-final-card .bg-slate-950\/40 {
          background-color: #f8fafc !important;
          border-color: #e2e8f0 !important;
        }
        .cv-final-card .border-slate-850, 
        .cv-final-card .border-slate-800,
        .cv-final-card .border-slate-900 {
          border-color: #e2e8f0 !important;
        }
        .cv-final-card button.border-slate-800 {
          border-color: #cbd5e1 !important;
          color: #475569 !important;
        }
        .cv-final-card button.border-slate-800:hover {
          background-color: #f1f5f9 !important;
          color: #0F172A !important;
        }
        .cv-final-card strong.text-white {
          color: #0F172A !important;
        }
        .cv-final-card .text-slate-350 {
          color: #475569 !important;
        }
      `}} />
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <span className="text-xs font-bold text-gold-500 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Premium CV Unlocked
          </span>
          <h2 className="text-2xl font-black text-white mt-1 uppercase tracking-tight font-display">
            Your Unwatermarked CV
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Download your clean A4 document or return to the player dashboard.
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onGoToDashboard}
            className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white transition flex items-center gap-2 text-xs font-bold cursor-pointer font-sans"
          >
            <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
          </button>
          <button 
            onClick={onDownloadCleanPDF}
            className="px-6 py-2.5 rounded-xl bg-gold-gradient text-navy-950 hover:shadow-lg hover:shadow-gold-500/20 font-black transition flex items-center gap-2 text-xs cursor-pointer font-sans"
          >
            <Download className="w-4 h-4" /> Download Clean PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Info panel */}
        <div className="lg:col-span-4 space-y-5">


          <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-850 flex gap-3 text-xs leading-relaxed" style={{ color: '#000000' }}>
            <AlertCircle className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5" style={{ color: '#000000' }}>Need to edit details?</span>
              {cv.editsAllowed - cv.editsUsed > 0 ? (
                <>You have <strong className="text-gold-400">{cv.editsAllowed - cv.editsUsed} edits left</strong> for this year. You can update statistics, career history, or achievements from the dashboard at any time.</>
              ) : (
                <>You have <strong className="text-red-400">0 edits left</strong> for this year. You can renew your plan from the dashboard to restore 5 edits or contact support for help.</>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview Without Watermark */}
        <div id="cv-live-preview-wrapper" className="lg:col-span-8 rounded-xl overflow-hidden shadow-2xl border border-slate-850 h-[500px] lg:h-[820px]">
          <CVLivePreview cv={cv} isPreview={true} />
        </div>

      </div>

    </div>
  );
}
