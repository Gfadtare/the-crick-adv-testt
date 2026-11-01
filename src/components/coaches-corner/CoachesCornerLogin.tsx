import React, { useState } from "react";
import { ShieldCheck, Eye, EyeOff, Lock } from "lucide-react";

interface CoachesCornerLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const COACHES_PIN = "coach2024";

export const CoachesCornerLogin: React.FC<CoachesCornerLoginProps> = ({ onLogin, onBack }) => {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === COACHES_PIN) {
      setError("");
      onLogin();
    } else {
      setError("Invalid PIN. Please try again.");
      setShaking(true);
      setPin("");
      setTimeout(() => setShaking(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-6 font-coaches">
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,rgba(11,26,48,0.04) 0,rgba(11,26,48,0.04) 1px,transparent 0,transparent 40px),repeating-linear-gradient(90deg,rgba(11,26,48,0.04) 0,rgba(11,26,48,0.04) 1px,transparent 0,transparent 40px)", backgroundSize: "40px 40px" }}
      />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FDF8E7] border-2 border-black shadow-md mb-4">
            <span className="text-4xl">🏏</span>
          </div>
          <h1 className="text-3xl font-black text-[#0B1A30] tracking-tight">Coaches Corner</h1>
          <p className="text-[#B89020] text-xs font-black mt-1.5 uppercase tracking-widest">Assessment Report Generator</p>
          <p className="text-slate-500 text-xs mt-1 font-semibold">The Cricket Advisor – Certified Division</p>
        </div>
        <div className={`bg-white border-2 border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${shaking ? "shake-anim" : ""}`}>
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
            <Lock size={16} className="text-[#0B1A30]" />
            <h2 className="text-[#0B1A30] font-black text-base uppercase tracking-wider">Coach Access Login</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-650 uppercase tracking-widest mb-2">Coach Access PIN</label>
              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={e => { setPin(e.target.value); setError(""); }}
                  placeholder="Enter your Coach PIN"
                  className="w-full px-4 py-3.5 pr-12 bg-white border-2 border-black rounded-xl text-[#0B1A30] placeholder-slate-400 font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-[#F5C451]/40 focus:border-[#F5C451] transition"
                  autoComplete="off"
                />
                <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-[#0B1A30] transition cursor-pointer">
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-red-650 text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} className="text-red-500" /> {error}
                </p>
              )}
            </div>
            <button type="submit" className="w-full py-4 bg-[#F5C451] hover:bg-[#E2AF3C] text-[#0B1A30] border-2 border-black font-extrabold rounded-xl transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] text-sm uppercase tracking-wider cursor-pointer">
              🏏 Enter Coaches Corner
            </button>
          </form>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="bg-[#FDF8E7] border border-black rounded-xl p-3 text-center space-y-1">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Default Access PIN</p>
              <p className="text-[#0B1A30] font-mono font-black text-lg">coach2024</p>
            </div>
          </div>
        </div>
        <button onClick={onBack} className="mt-6 w-full py-3 text-slate-650 hover:text-[#0B1A30] text-sm font-bold transition text-center underline decoration-2 decoration-[#F5C451] underline-offset-4 cursor-pointer">
          ← Back to Public Website
        </button>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-8px)}80%{transform:translateX(8px)}}.shake-anim{animation:shake 0.5s ease-in-out;}`}</style>
    </div>
  );
};
