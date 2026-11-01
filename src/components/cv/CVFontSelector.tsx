import React from 'react';

interface CVFontSelectorProps {
  selectedFont: string;
  onSelectFont: (font: string) => void;
}

export default function CVFontSelector({
  selectedFont,
  onSelectFont
}: CVFontSelectorProps) {
  const fonts = [
    { id: 'Inter', name: 'Inter', desc: 'Modern and highly readable corporate choice.' },
    { id: 'Montserrat', name: 'Montserrat', desc: 'Geometric, punchy, premium bold headers.' },
    { id: 'Poppins', name: 'Poppins', desc: 'Clean, soft, elegant geometric style.' },
    { id: 'Roboto', name: 'Roboto', desc: 'Structured, formal, high readability.' },
    { id: 'Open Sans', name: 'Open Sans', desc: 'Highly neutral, clear representation.' },
    { id: 'Lato', name: 'Lato', desc: 'Warm, soft, friendly but corporate feel.' },
    { id: 'Merriweather', name: 'Merriweather', desc: 'Traditional editorial look, professional serif.' },
    { id: 'Source Sans', name: 'Source Sans Pro', desc: 'Slim, clean, corporate look.' },
    { id: 'Playfair Display', name: 'Playfair Display', desc: 'Classic elite high-contrast serif headers.' }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white mb-1">Select Typography</h3>
        <p className="text-slate-400 text-[11px]">Choose a professional font that matches your design style.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {fonts.map((f) => {
          const isSelected = selectedFont === f.id;
          return (
            <button
              key={f.id}
              onClick={() => onSelectFont(f.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-start min-h-[85px] ${
                isSelected 
                  ? 'bg-blue-950/20 border-gold-500 text-white shadow-sm' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div 
                className="text-sm font-extrabold mb-1"
                style={{ fontFamily: f.id === 'Source Sans' ? "'Source Sans Pro', sans-serif" : f.id }}
              >
                {f.name}
              </div>
              <div className="text-[10px] text-slate-400 leading-snug font-sans font-medium">{f.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
