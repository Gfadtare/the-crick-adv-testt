import React from 'react';
import { Check } from 'lucide-react';

interface CVDesignSelectorProps {
  selectedTemplateId: string;
  onSelectTemplate: (id: string) => void;
  onNext: () => void;
}

export default function CVDesignSelector({
  selectedTemplateId,
  onSelectTemplate,
  onNext
}: CVDesignSelectorProps) {
  const templates = [
    /*
    {
       id: 'executive',
       name: 'The Executive',
       desc: 'Clean corporate layout with a prominent left sidebar. Ideal for professional club and administrative opportunities.',
       character: 'Corporate, Structured, Clear'
     },
     {
       id: 'professional',
       name: 'The Professional',
       desc: 'Modern layout with an accent color banner. Displays key statistics blocks directly at the top for immediate impact.',
       character: 'Modern, Stats-Focused, Balanced'
     },
     {
       id: 'international',
       name: 'The International',
       desc: 'Tailored for overseas opportunities. Detailed sections for nationality, residence, visa availability and overseas playing experience.',
       character: 'Global Placement, Detail-Rich'
     },
     {
       id: 'classic',
       name: 'The Classic',
       desc: 'Traditional clean format with elegant typography. Focuses on playing history and simple text-based data representation.',
       character: 'Traditional, Elegant, Text-First'
     },
     {
       id: 'performance',
       name: 'The Performance',
       desc: 'Athletic profile displaying statistics highlights first. Emphasizes tournament statistics and major team logs.',
       character: 'Athlete, High-Impact, Visual'
     }
     */
     {
       id: 'prestige',
       name: 'The Prestige',
       desc: 'Elite double-border layout featuring stumps decoration, a deep navy sidebar and warm cream aesthetics.',
       character: 'Prestigious, Detailed'
     }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Select Your CV Template</h2>
        <p className="text-slate-400 text-xs">Choose a design style that best fits your cricket profile and career level.</p>
      </div>

      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
        {templates.map((t) => {
          const isSelected = selectedTemplateId === t.id;
          return (
            <div 
              key={t.id}
              onClick={() => onSelectTemplate(t.id)}
              className={`p-5 rounded-xl border text-left cursor-pointer transition-all flex justify-between items-start gap-4 ${
                isSelected 
                  ? 'bg-blue-950/20 border-gold-500 shadow-md shadow-gold-500/5' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isSelected ? 'bg-gold-500 text-navy-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {t.character}
                  </span>
                </div>
                <h3 className="font-extrabold text-white text-base">{t.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
              </div>

              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                isSelected ? 'bg-gold-500 text-navy-950' : 'bg-slate-800 text-slate-600 border border-slate-700'
              }`}>
                {isSelected && <Check className="w-4 h-4" />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-800 flex justify-end">
        <button
          onClick={onNext}
          className="px-6 py-3 rounded-lg font-bold bg-gold-gradient text-navy-950 hover:opacity-90 transition-all cursor-pointer text-sm"
        >
          Use This Design & Continue
        </button>
      </div>
    </div>
  );
}
