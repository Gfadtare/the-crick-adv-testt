import React, { useState } from 'react';
import { CricketCVFull } from './CVTypes';
import CVLivePreview from './CVLivePreview';
import CVColourSelector from './CVColourSelector';
import CVFontSelector from './CVFontSelector';
import { Layers, ChevronLeft, ArrowRight, Sparkles, Check } from 'lucide-react';
import { runTemplateLayoutTests } from './templates/registry/TemplateValidation';

interface CVStyleStepProps {
  cv: CricketCVFull;
  onChange: (updated: CricketCVFull) => void;
  onNext: (cv: CricketCVFull) => void;
  onPrev: () => void;
}

const templates = [
  /*
  {
    id: 'executive',
    name: 'The Executive',
    desc: 'Clean corporate layout with a prominent left sidebar.',
    character: 'Corporate, Structured',
    accentDefault: '#0B1A30',
    preview: (color: string) => (
      <div className="w-12 h-16 bg-white rounded border border-slate-200 overflow-hidden flex flex-row shrink-0">
        <div className="w-4 h-full" style={{ backgroundColor: color }} />
        <div className="flex-1 p-1 space-y-1">
          <div className="h-1 bg-slate-300 w-full rounded" />
          <div className="h-1 bg-slate-200 w-3/4 rounded" />
          <div className="h-3" />
          <div className="h-1 bg-slate-100 w-full rounded" />
          <div className="h-1 bg-slate-100 w-full rounded" />
        </div>
      </div>
    ),
  },
  {
    id: 'professional',
    name: 'The Professional',
    desc: 'Modern accent banner with key stats blocks at the top.',
    character: 'Modern, Stats-Focused',
    accentDefault: '#991B1B',
    preview: (color: string) => (
      <div className="w-12 h-16 bg-white rounded border border-slate-200 overflow-hidden flex flex-col shrink-0">
        <div className="h-3 w-full" style={{ backgroundColor: color }} />
        <div className="flex-1 p-1 space-y-1">
          <div className="grid grid-cols-3 gap-0.5">
            <div className="h-2 bg-slate-200 rounded" /><div className="h-2 bg-slate-200 rounded" /><div className="h-2 bg-slate-200 rounded" />
          </div>
          <div className="h-1 bg-slate-300 w-full rounded" />
          <div className="h-1 bg-slate-200 w-3/4 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: 'international',
    name: 'The International',
    desc: 'Tailored for overseas placements. Visa, nationality & overseas sections.',
    character: 'Global Placement',
    accentDefault: '#065F46',
    preview: (color: string) => (
      <div className="w-12 h-16 bg-white rounded border border-slate-200 overflow-hidden flex flex-col shrink-0">
        <div className="h-1 w-full" style={{ backgroundColor: color }} />
        <div className="flex-1 p-1 space-y-1">
          <div className="h-2 bg-slate-100 w-full rounded" />
          <div className="grid grid-cols-2 gap-1">
            <div className="h-7 bg-slate-50 border border-slate-100 rounded" />
            <div className="h-7 bg-slate-50 border border-slate-100 rounded" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'classic',
    name: 'The Classic',
    desc: 'Traditional format with elegant typography and clean structure.',
    character: 'Traditional, Elegant',
    accentDefault: '#1F2937',
    preview: (color: string) => (
      <div className="w-12 h-16 bg-white rounded border border-slate-200 overflow-hidden flex flex-col items-center justify-between p-1 shrink-0">
        <div className="h-1 bg-slate-400 w-1/2 rounded" />
        <div className="w-full space-y-1">
          {[0,1,2,3,4].map(i => <div key={i} className="h-0.5 bg-slate-200 w-full" />)}
        </div>
        <div className="h-1 w-full rounded" style={{ backgroundColor: color }} />
      </div>
    ),
  },
  {
    id: 'performance',
    name: 'The Performance',
    desc: 'Athletic profile displaying statistics highlights first.',
    character: 'Athlete, High-Impact',
    accentDefault: '#B45309',
    preview: (color: string) => (
      <div className="w-12 h-16 bg-white rounded border border-slate-200 overflow-hidden flex flex-col shrink-0 p-1 space-y-1">
        <div className="flex justify-between items-center">
          <div className="h-2 w-4 bg-slate-200 rounded" />
          <div className="h-2 w-4 rounded" style={{ backgroundColor: color }} />
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="h-4 bg-slate-100 rounded" /><div className="h-4 bg-slate-100 rounded" />
        </div>
        <div className="h-1 bg-slate-300 w-full rounded" />
        <div className="h-1 bg-slate-200 w-3/4 rounded" />
      </div>
    ),
  },
  */
  {
    id: 'prestige',
    name: 'The Prestige',
    desc: 'Elite double-border layout featuring stumps decoration, a deep navy sidebar and warm cream aesthetics.',
    character: 'Prestigious, Detailed',
    accentDefault: '#c1904f',
    preview: (color: string) => (
      <div className="w-12 h-16 bg-[#faf8f4] rounded border border-slate-200 overflow-hidden flex shrink-0 select-none">
        <div className="w-4 h-full bg-[#152238] flex flex-col justify-between p-0.5">
          <div className="h-2 w-full rounded-sm" style={{ backgroundColor: color }} />
          <div className="h-0.5 bg-slate-500 w-full" />
        </div>
        <div className="flex-1 p-1 space-y-1 flex flex-col justify-between">
          <div className="border border-slate-300 p-0.5 space-y-0.5">
            <div className="h-0.5 bg-slate-300 w-full" />
            <div className="h-0.5 bg-slate-200 w-3/4" />
          </div>
          <div className="h-0.5 bg-slate-200 w-full" />
        </div>
      </div>
    ),
  },
];

export default function CVStyleStep({ cv, onChange, onNext, onPrev }: CVStyleStepProps) {
  const [selectedId, setSelectedId] = useState(cv.templateId || 'prestige');
  const [testResults, setTestResults] = useState<any[] | null>(null);
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);

  const handleSelectTemplate = (id: string) => {
    const t = templates.find(t => t.id === id);
    setSelectedId(id);
    onChange({
      ...cv,
      templateId: id,
      accentColour: t?.accentDefault ?? cv.accentColour,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-8 text-left max-w-6xl mx-auto shadow-2xl font-sans cv-style-card">
      <style dangerouslySetInnerHTML={{__html: `
        .cv-style-card {
          background-color: #ffffff !important;
          border-color: #e2e8f0 !important;
          color: #334155 !important;
        }
        .cv-style-card h2, 
        .cv-style-card h3, 
        .cv-style-card h4 {
          color: #0B1A30 !important;
        }
        .cv-style-card p.text-slate-500 {
          color: #64748b !important;
        }
        .cv-style-card .border-slate-800,
        .cv-style-card .border-slate-850 {
          border-color: #e2e8f0 !important;
        }
        .cv-style-card .bg-slate-950 {
          background-color: #f8fafc !important;
          border-color: #e2e8f0 !important;
        }
        .cv-style-card span.text-white {
          color: #0F172A !important;
        }
        .cv-style-card span.text-slate-400 {
          color: #64748b !important;
        }
        .cv-style-card div.border-slate-200 {
          border-color: #e2e8f0 !important;
        }
        .cv-style-card .bg-slate-900 {
          background-color: #f1f5f9 !important;
        }
        .cv-style-card .text-gold-500 {
          color: #D4AF37 !important;
        }
      `}} />

      {/* Header */}
      <div className="border-b border-slate-800 pb-5 mb-6">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-1">
          <Sparkles className="w-3 h-3 text-slate-400" /> Step 2 of 3
        </span>
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Choose Layout &amp; Styling</h2>
        <p className="text-slate-500 text-xs mt-1">Select a design template and customize colors and typography.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Controls */}
        <div className="lg:col-span-5 flex flex-col gap-4">

          {/* Template list */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Layers className="w-3.5 h-3.5" /> Design Template
            </h3>
            <div className="space-y-2">
              {templates.map((t) => {
                const isSelected = selectedId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTemplate(t.id)}
                    className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 shadow-lg'
                        : 'bg-slate-950 hover:bg-slate-900'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="shrink-0">
                      {t.preview(isSelected ? t.accentDefault : '#475569')}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                          {t.name}
                        </span>
                        {isSelected && (
                          <span className="shrink-0 w-4 h-4 rounded-full bg-slate-600 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5 line-clamp-2">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colour */}
          <div className="border-t border-slate-800 pt-4">
            <CVColourSelector
              selectedColour={cv.accentColour}
              onSelectColour={(c) => onChange({ ...cv, accentColour: c })}
            />
          </div>

          {/* Font */}
          <div className="border-t border-slate-800 pt-4">
            <CVFontSelector
              selectedFont={cv.font}
              onSelectFont={(f) => onChange({ ...cv, font: f })}
            />
          </div>

          {/* Page Layout Validator */}
          <div className="border-t border-slate-800 pt-4 space-y-3 text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" /> Page Layout Validator
            </h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Verify that page-breaks, heading placements, and block bounds comply with A4 constraints across all layouts.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsRunningTests(true);
                setTimeout(() => {
                  const res = runTemplateLayoutTests(cv, {});
                  setTestResults(res);
                  setIsRunningTests(false);
                }, 400);
              }}
              disabled={isRunningTests}
              className="w-full py-2 border border-slate-800 hover:border-gold-500 hover:text-slate-200 rounded-lg text-[10px] font-bold text-slate-400 transition cursor-pointer"
            >
              {isRunningTests ? "Validating Layouts..." : "Run Layout Verification"}
            </button>

            {testResults && (
              <div className="space-y-2 mt-2 p-3 bg-slate-950/40 rounded-lg border border-slate-850">
                {testResults.map(res => (
                  <div key={res.templateId} className="flex justify-between items-center text-[10px] border-b border-slate-800/40 pb-1.5 last:border-0 last:pb-0">
                    <span className="font-semibold text-slate-400">{res.name}</span>
                    <span className={`font-bold ${res.passed ? 'text-green-500' : 'text-red-500'}`}>
                      {res.passed ? '✅ Passed' : '❌ Failed'} ({res.pageCount} Pages)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Live preview */}
        <div
          className="lg:col-span-7 rounded-xl overflow-hidden shadow-xl border border-slate-800 h-[500px] lg:h-[820px]"
        >
          <CVLivePreview cv={cv} isPreview={true} />
        </div>

      </div>

      {/* Footer nav */}
      <div className="pt-6 mt-6 border-t border-slate-800 flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-5 py-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={() => onNext(cv)}
          className="px-6 py-3 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition text-slate-900"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #B7942B)' }}
        >
          {cv.paymentStatus === 'Paid' ? 'Proceed' : 'Continue to Payment'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
