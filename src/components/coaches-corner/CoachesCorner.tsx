import React, { useState, useMemo, useEffect } from "react";
import { X, Search, Trophy, ClipboardList, User, Award, Filter, RefreshCw, Loader2 } from "lucide-react";
import { SubmissionData } from "../assessment/types";
import { CoachesCornerLogin } from "./CoachesCornerLogin";
import { ReportForm } from "./ReportForm";

interface CoachesCornerProps {
  onClose: () => void;
  skillsList?: SubmissionData[]; // Optional legacy prop
}

export const CoachesCorner: React.FC<CoachesCornerProps> = ({ onClose }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [candidates, setCandidates] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState<SubmissionData | null>(null);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<"All" | "Online" | "Offline">("All");

  const fetchCandidates = async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch("/api/get-skills-assessments?secret=coach2024");
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data)) {
          setCandidates(data);
        } else {
          setError("Failed to retrieve candidate records.");
        }
      } else {
        setError(`Server returned status: ${resp.status}`);
      }
    } catch (err: any) {
      console.error("Error fetching candidates:", err);
      setError("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch candidates list once logged in
  useEffect(() => {
    if (loggedIn) {
      fetchCandidates();
    }
  }, [loggedIn]);

  const paidCandidates = useMemo(() => {
    // Show paid/submitted candidates
    return candidates.filter(c => c.paymentStatus?.toLowerCase() === "paid" || c.amountPaid || c.testMode);
  }, [candidates]);

  const filtered = useMemo(() => {
    return paidCandidates.filter(c => {
      const modeMatch = filterMode === "All" || c.testMode === filterMode;
      const q = search.toLowerCase().trim();
      const nameMatch = `${c.firstName} ${c.lastName}`.toLowerCase().includes(q);
      const idMatch = c.id?.toLowerCase().includes(q);
      const emailMatch = c.email?.toLowerCase().includes(q);
      return modeMatch && (nameMatch || idMatch || emailMatch || q === "");
    });
  }, [paidCandidates, search, filterMode]);

  const onlineCount = paidCandidates.filter(c => c.testMode === "Online").length;
  const offlineCount = paidCandidates.filter(c => c.testMode === "Offline").length;

  if (!loggedIn) {
    return <CoachesCornerLogin onLogin={() => setLoggedIn(true)} onBack={onClose} />;
  }

  if (selectedCandidate) {
    return <ReportForm candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />;
  }

  return (
    <div className="fixed inset-0 z-[9990] bg-[#FAF9F5] flex flex-col overflow-hidden font-coaches">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(0deg,rgba(11,26,48,0.04) 0,rgba(11,26,48,0.04) 1px,transparent 0,transparent 40px),repeating-linear-gradient(90deg,rgba(11,26,48,0.04) 0,rgba(11,26,48,0.04) 1px,transparent 0,transparent 40px)", backgroundSize: "40px 40px" }}
      />

      {/* Header */}
      <div className="relative flex-shrink-0 bg-[#0B1A30] text-white border-b-4 border-black px-6 py-5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FDF8E7] border-2 border-black flex items-center justify-center shadow-sm text-2xl flex-shrink-0">
            🏏
          </div>
          <div>
            <p className="text-[#F5C451] text-[10px] uppercase tracking-[0.2em] font-bold">The Cricket Advisor</p>
            <h1 className="text-xl font-black text-white">Coaches Corner</h1>
            <p className="text-slate-300 text-xs">Assessment Report Generator</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Stats badges */}
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-400 text-emerald-800 text-xs font-bold rounded-full">
              🟢 {onlineCount} Online
            </span>
            <span className="px-3 py-1.5 bg-amber-50 border border-amber-400 text-amber-800 text-xs font-bold rounded-full">
              🟠 {offlineCount} Offline
            </span>
            <span className="px-3 py-1.5 bg-[#FDF8E7] border-2 border-black text-[#0B1A30] text-xs font-extrabold rounded-full">
              {paidCandidates.length} Total
            </span>
          </div>

          <button
            onClick={fetchCandidates}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white disabled:opacity-40 transition cursor-pointer border border-white/20 hover:scale-105"
            title="Refresh candidate list"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          </button>

          <button onClick={onClose} className="p-2.5 rounded-xl bg-white/10 hover:bg-red-500/40 hover:text-red-250 text-white transition cursor-pointer border border-white/20 hover:scale-105">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Sub-header: search + filter */}
      <div className="relative flex-shrink-0 px-6 py-4 bg-[#FDF8E7]/50 border-b-2 border-black flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by candidate name, email, or registration ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-black rounded-xl text-[#0B1A30] placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C451]/40 focus:border-[#F5C451] transition"
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Filter size={14} className="text-slate-650" />
          {(["All", "Online", "Offline"] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none ${
                filterMode === mode
                  ? mode === "Online"
                    ? "bg-emerald-500 text-white border-black"
                    : mode === "Offline"
                    ? "bg-amber-500 text-white border-black"
                    : "bg-[#F5C451] text-[#0B1A30] border-black"
                  : "bg-white text-[#0B1A30] hover:bg-[#FDF8E7]"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Candidate List */}
      <div className="relative flex-1 overflow-y-auto p-6">
        {error && (
          <div className="max-w-xl mx-auto mb-6 p-4 bg-red-50 border-2 border-red-400 rounded-2xl text-red-800 text-center text-sm font-semibold">
            ⚠️ {error}
          </div>
        )}

        {loading && candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
            <Loader2 size={40} className="text-[#0B1A30] animate-spin" />
            <p className="text-[#0B1A30] font-semibold">Loading candidates from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
            <ClipboardList size={40} className="text-slate-600" />
            <p className="text-slate-600 font-semibold">
              {paidCandidates.length === 0
                ? "No paid candidates found. Candidates who complete payment will appear here."
                : "No candidates match your search."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl mx-auto">
            {filtered.map(candidate => {
              const isOnline = candidate.testMode === "Online";
              return (
                <div
                  key={candidate.id}
                  className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-155 hover:translate-y-[-2px] group"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-black shadow-sm ${isOnline ? "bg-emerald-50" : "bg-amber-50"}`}>
                        <User size={18} className={isOnline ? "text-emerald-700" : "text-amber-700"} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[#0B1A30] font-black text-sm truncate group-hover:underline underline-offset-4 decoration-2 decoration-[#F5C451]">
                          {candidate.firstName} {candidate.lastName}
                        </h3>
                        <p className="text-slate-500 text-[11px] font-mono">{candidate.id}</p>
                      </div>
                    </div>
                    <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border-2 border-black ${
                      isOnline ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
                    }`}>
                      {isOnline ? "🟢" : "🟠"} {candidate.testMode}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    {[
                      ["Role", candidate.playingRole],
                      ["Specialty", candidate.subRole],
                      ["Age", candidate.age],
                      ["Nationality", candidate.nationality],
                      ["Email", candidate.email],
                      ["Mobile", `${candidate.mobileCountryCode} ${candidate.mobileNumber}`],
                    ].map(([label, val]) => (
                      <div key={label} className="bg-[#FDF8E7]/40 border border-black rounded-xl px-3 py-2">
                        <span className="block text-slate-500 text-[9px] uppercase tracking-wider font-bold">{label}</span>
                        <span className="block text-[#0B1A30] font-bold truncate mt-0.5">{val || "—"}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">✓ Paid</span>
                    <span className="text-slate-400 text-[10px]">•</span>
                    {candidate.amountPaid && (
                      <>
                        <span className="text-[10px] text-slate-600 font-mono">
                          ₹{candidate.amountPaid.toLocaleString("en-IN")} INR
                        </span>
                        <span className="text-slate-400 text-[10px]">•</span>
                      </>
                    )}
                    <span className="text-[10px] text-slate-500">{candidate.submittedAt || "Recent"}</span>
                  </div>

                  <button
                    onClick={() => setSelectedCandidate(candidate)}
                    className="w-full py-3 bg-[#F5C451] hover:bg-[#E2AF3C] text-[#0B1A30] border-2 border-black font-extrabold rounded-xl transition text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Award size={14} />
                    📋 Create Report
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative flex-shrink-0 bg-[#0B1A30] border-t-2 border-black text-slate-400 px-6 py-4 text-center">
        <p className="text-slate-500 text-[10px]">
          © The Cricket Advisor – Coaches Corner | Showing {filtered.length} of {paidCandidates.length} paid candidates
        </p>
      </div>
    </div>
  );
};
