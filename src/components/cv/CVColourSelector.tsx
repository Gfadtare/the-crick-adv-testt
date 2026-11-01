import React from 'react';
import { Check } from 'lucide-react';

interface CVColourSelectorProps {
  selectedColour: string;
  onSelectColour: (colour: string) => void;
}

export default function CVColourSelector({
  selectedColour,
  onSelectColour
}: CVColourSelectorProps) {
  const colours = [
    { name: 'Navy', hex: '#0B1A30', label: 'TCA Navy' },
    { name: 'Black', hex: '#1E293B', label: 'Dark Charcoal' },
    { name: 'Dark Green', hex: '#052E16', label: 'Club Green' },
    { name: 'Royal Blue', hex: '#1D4ED8', label: 'Royal Blue' },
    { name: 'Maroon', hex: '#7F1D1D', label: 'Maroon' },
    { name: 'Charcoal', hex: '#374151', label: 'Charcoal' },
    { name: 'Cricket Green', hex: '#15803D', label: 'Cricket Grass' },
    { name: 'Burgundy', hex: '#581C87', label: 'Deep Wine' }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white mb-1">Select Accent Color</h3>
        <p className="text-slate-400 text-[11px]">Apply a professional accent tone for headings, borders, and banners.</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {colours.map((c) => {
          const isSelected = selectedColour.toLowerCase() === c.hex.toLowerCase();
          return (
            <button
              key={c.hex}
              onClick={() => onSelectColour(c.hex)}
              className={`p-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                isSelected 
                  ? 'bg-blue-950/20 border-gold-500' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div 
                className="w-6 h-6 rounded-full border border-white/20 shadow-sm relative flex items-center justify-center"
                style={{ backgroundColor: c.hex }}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />}
              </div>
              <div className="text-[9px] font-bold text-slate-300 leading-none">{c.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
