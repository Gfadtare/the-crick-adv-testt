import React, { useState } from 'react';
import { Edit2, List } from 'lucide-react';

interface CricketNumberSelectorProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max: number;
  step?: number;
  helperText?: string;
  largeNumbers?: boolean; // kept for interface compatibility
}

export default function CricketNumberSelector({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  helperText,
  largeNumbers = false
}: CricketNumberSelectorProps) {
  const [isManualInput, setIsManualInput] = useState(false);
  const [localValue, setLocalValue] = useState<string>(String(value));

  // Sync localValue when parent value changes
  React.useEffect(() => {
    if (parseInt(localValue, 10) !== value) {
      setLocalValue(String(value));
    }
  }, [value]);

  // Generate options dynamically - Memoized to prevent lagginess on keypresses
  const baseOptions = React.useMemo(() => {
    const opts: number[] = [];
    if (max <= 500) {
      for (let i = min; i <= max; i += step) {
        opts.push(i);
      }
    } else if (max <= 2000) {
      for (let i = min; i <= max; i += Math.max(1, step)) {
        opts.push(i);
      }
    } else {
      // Stepped options for larger ranges (Runs, Balls faced, Overs, etc.)
      // 0 to 100 with step 1
      for (let i = min; i <= 100; i += 1) {
        opts.push(i);
      }
      // 105 to 500 with step 5
      for (let i = 105; i <= 500; i += 5) {
        opts.push(i);
      }
      // 510 to 2000 with step 10
      for (let i = 510; i <= 2000; i += 10) {
        opts.push(i);
      }
      // 2050 to 10000 with step 50
      for (let i = 2050; i <= 10000; i += 50) {
        opts.push(i);
      }
      // 10100 to 50000 with step 100
      for (let i = 10100; i <= 50000; i += 100) {
        opts.push(i);
      }
      // 50500 to max with step 500
      for (let i = 50500; i <= max; i += 500) {
        opts.push(i);
      }
    }
    return opts;
  }, [min, max, step]);

  const options = React.useMemo(() => {
    if (!baseOptions.includes(value)) {
      const newOpts = [...baseOptions, value];
      newOpts.sort((a, b) => a - b);
      return newOpts;
    }
    return baseOptions;
  }, [baseOptions, value]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      onChange(Math.max(min, Math.min(max, val)));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setLocalValue(rawVal);

    if (rawVal === '') {
      onChange(0);
    } else {
      const val = parseInt(rawVal, 10);
      if (!isNaN(val)) {
        onChange(Math.max(min, Math.min(max, val)));
      }
    }
  };

  return (
    <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3 text-left">
      <div className="flex justify-between items-start">
        <div>
          <label className="block text-xs text-white font-bold tracking-wide uppercase">{label}</label>
          {helperText && <span className="text-[10px] text-slate-500 block mt-0.5">{helperText}</span>}
        </div>
        
        {/* Toggle Mode Button */}
        <button
          type="button"
          onClick={() => setIsManualInput(!isManualInput)}
          className="p-1.5 bg-slate-900 border border-slate-880 hover:border-slate-700 text-slate-400 hover:text-white rounded-lg transition cursor-pointer flex items-center justify-center"
          title={isManualInput ? "Switch to Dropdown Menu" : "Switch to Keyboard Input"}
        >
          {isManualInput ? <List className="w-3.5 h-3.5 text-gold-400" /> : <Edit2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="relative mt-1">
        {isManualInput ? (
          <input
            type="number"
            min={min}
            max={max}
            value={localValue}
            onChange={handleInputChange}
            className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-bold text-sm focus:outline-none"
          />
        ) : (
          <>
            <select
              value={value}
              onChange={handleSelectChange}
              className="w-full bg-slate-900 border border-slate-800 focus:border-gold-500 p-2.5 rounded-lg text-white font-semibold text-xs focus:outline-none appearance-none cursor-pointer pr-10 font-sans"
            >
              {options.map((val) => (
                <option key={val} value={val} className="bg-slate-900 text-white">
                  {val}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
