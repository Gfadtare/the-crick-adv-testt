import React, { useState, useEffect, useRef } from "react";
import { X, Download, ChevronDown, ChevronUp, Trophy, Star, Loader2, MessageSquare, Save, CheckCircle } from "lucide-react";
import { getCategories, initialScores, ScoresMap, categoryAverage, grandAverage, CategoryGroup, getAllKeys } from "./OnlineReportCategories";
import { SubmissionData } from "../assessment/types";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import logoImg from "../../assets/images/the_cricket_advisor_logo.png";
import signatureImg from "../../assets/images/coach_signature.png";

interface ReportFormProps {
  candidate: SubmissionData;
  onClose: () => void;
}

const SCORE_LABELS: Record<number, string> = {
  1: "1 – Poor", 2: "2 – Below Average", 3: "3 – Weak", 4: "4 – Below Par",
  5: "5 – Average", 6: "6 – Satisfactory", 7: "7 – Good",
  8: "8 – Very Good", 9: "9 – Excellent", 10: "10 – Outstanding",
};

function scoreColor(v: number): string {
  if (v === 0) return "bg-slate-100 text-slate-400";
  if (v <= 4) return "bg-red-100 text-red-700";
  if (v <= 7) return "bg-amber-100 text-amber-800";
  return "bg-emerald-100 text-emerald-700";
}

function ScoreBar({ value }: { value: number }) {
  const pct = value > 0 ? (value / 10) * 100 : 0;
  const barColor = value === 0 ? "bg-slate-200" : value <= 4 ? "bg-red-400" : value <= 7 ? "bg-amber-400" : "bg-emerald-500";
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 mt-1.5 overflow-hidden">
      <div className={`h-2 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

interface SectionCardProps {
  key?: string;
  group: CategoryGroup;
  scores: ScoresMap;
  comments: Record<string, string>;
  isToggled: boolean;
  onToggle: () => void;
  onChange: (key: string, val: number) => void;
  onComment: (groupKey: string, val: string) => void;
  onSaveDraft: () => void;
}

function SectionCard({
  group,
  scores,
  comments,
  isToggled,
  onToggle,
  onChange,
  onComment,
  onSaveDraft,
}: SectionCardProps) {
  const [open, setOpen] = useState(true);
  const avg = categoryAverage(group, scores);

  return (
    <div className={`rounded-2xl border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${!isToggled ? "opacity-75 bg-slate-50" : ""}`}>
      {/* Header Container */}
      <div className={`w-full flex items-center justify-between px-5 py-4 ${isToggled ? group.bgColor : "bg-red-50"} border-b-2 border-black`}>
        <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => isToggled && setOpen(!open)}>
          <span className={`text-base font-black uppercase tracking-wider ${isToggled ? group.textColor : "text-red-800"}`}>
            {group.key === "wicketkeeping" ? "Wicketkeeping" : group.label}
          </span>
          {isToggled && avg > 0 && (
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border border-black ${group.textColor} bg-white/70 shadow-sm`}>
              Avg: {avg} / 10
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {/* Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className={`px-3 py-1.5 rounded-xl border-2 border-black font-extrabold text-xs transition cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none ${
              isToggled
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {isToggled ? "Included in Report" : "Excluded from Report"}
          </button>
          
          <button
            type="button"
            onClick={() => isToggled && setOpen(!open)}
            className="p-1 cursor-pointer"
          >
            {open && isToggled ? <ChevronUp size={18} className="text-black" /> : <ChevronDown size={18} className="text-black" />}
          </button>
        </div>
      </div>

      {open && isToggled && (
        <div className="bg-white p-5 space-y-4">
          {group.subCategories.map(sub => {
            const v = scores[sub.key] || 0;
            return (
              <div key={sub.key}>
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-semibold text-slate-800 flex-1">{sub.label}</label>
                  <select
                    value={v}
                    onChange={e => onChange(sub.key, Number(e.target.value))}
                    className={`text-xs font-bold px-3 py-2 rounded-xl border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#F5C451]/30 cursor-pointer min-w-[170px] ${scoreColor(v)}`}
                  >
                    <option value={0}>-- Select Score --</option>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{SCORE_LABELS[n]}</option>
                    ))}
                  </select>
                </div>
                <ScoreBar value={v} />
              </div>
            );
          })}

          <div className="pt-3 border-t border-slate-100">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <MessageSquare size={12} /> Coach&apos;s Comments – {group.label}
            </label>
            <textarea
              rows={2}
              value={comments[group.key] || ""}
              onChange={e => onComment(group.key, e.target.value)}
              placeholder={`Optional coach notes for ${group.label}...`}
              className="w-full px-3 py-2 text-xs text-[#0B1A30] border-2 border-black rounded-xl focus:outline-none focus:border-[#F5C451] resize-none bg-[#FAF9F5] placeholder-slate-400"
            />
          </div>

          {/* Section Save Draft Button */}
          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onSaveDraft}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-900 border-2 border-black text-white font-extrabold text-xs rounded-xl transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none cursor-pointer"
            >
              <Save size={12} />
              <span>Save Section Draft</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export const ReportForm: React.FC<ReportFormProps> = ({ candidate, onClose }) => {
  const categoriesList = getCategories(candidate.testMode);
  const isWKRequired = candidate.playingRole?.toLowerCase().includes("wicket") || candidate.subRole?.toLowerCase().includes("keeper");

  const [scores, setScores] = useState<ScoresMap>(() => initialScores(candidate.testMode));
  const [sectionComments, setSectionComments] = useState<Record<string, string>>({});
  const [overallRemarks, setOverallRemarks] = useState("");
  const [generating, setGenerating] = useState(false);
  const [draftSavedMessage, setDraftSavedMessage] = useState("");
  const [draftLoadedAlert, setDraftLoadedAlert] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Initialize toggle states for all sections. Wicketkeeping defaults to isWKRequired.
  const [activeSections, setActiveSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    categoriesList.forEach(group => {
      if (group.key === "wicketkeeping") {
        initial[group.key] = isWKRequired;
      } else {
        initial[group.key] = true;
      }
    });
    return initial;
  });

  // Calculate dynamic grand average based only on toggled-on sections
  const grand = (() => {
    const activeKeys = categoriesList
      .filter(group => activeSections[group.key])
      .flatMap(group => group.subCategories.map(s => s.key));
      
    const filled = activeKeys.filter(k => (scores[k] || 0) > 0);
    if (filled.length === 0) return 0;
    const total = filled.reduce((acc, k) => acc + (scores[k] || 0), 0);
    return Math.round((total / filled.length) * 10) / 10;
  })();

  const allFilled = Object.entries(scores).every(([k, v]) => {
    // Find which category group this subcategory key belongs to
    const group = categoriesList.find(g => g.subCategories.some(s => s.key === k));
    if (!group) return true;
    
    // If the group is toggled OFF, we don't require its scores to be filled!
    if (!activeSections[group.key]) {
      return true;
    }
    
    return (v as number) > 0;
  });

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`tcc_coach_draft_${candidate.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.scores) {
          // Merge to ensure missing keys from previous versions don't crash
          setScores(prev => ({ ...prev, ...parsed.scores }));
        }
        if (parsed.sectionComments) {
          setSectionComments(parsed.sectionComments);
        }
        if (parsed.overallRemarks) {
          setOverallRemarks(parsed.overallRemarks);
        }
        if (parsed.activeSections) {
          setActiveSections(prev => ({ ...prev, ...parsed.activeSections }));
        }
        setDraftLoadedAlert(true);
        setTimeout(() => setDraftLoadedAlert(false), 5000);
      }
    } catch (e) {
      console.error("Failed to load draft:", e);
    }
  }, [candidate.id]);

  const handleSaveDraft = () => {
    try {
      const draftData = {
        scores,
        sectionComments,
        overallRemarks,
        activeSections,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`tcc_coach_draft_${candidate.id}`, JSON.stringify(draftData));
      setDraftSavedMessage("Progress Saved Successfully!");
      setTimeout(() => setDraftSavedMessage(""), 3000);
    } catch (e) {
      console.error("Failed to save draft:", e);
      alert("Failed to save progress draft.");
    }
  };

  const handleScore = (key: string, val: number) => {
    setScores(prev => ({ ...prev, [key]: val }));
  };

  const handleComment = (groupKey: string, val: string) => {
    setSectionComments(prev => ({ ...prev, [groupKey]: val }));
  };

  const handleToggleSection = (groupKey: string) => {
    setActiveSections(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setGenerating(true);
    try {
      const headerBlock = document.getElementById("pdf-header-block");
      const sectionBlocks = document.querySelectorAll(".pdf-section-block");
      const remarksBlock = document.getElementById("pdf-remarks-block");
      const footerBlock = document.getElementById("pdf-footer-block");

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const margin = 12;
      const imgWidth = pdfWidth - (margin * 2); // 186mm
      const pageHeightLimit = 245; // Safe height boundary before breaking to next page
      
      let currentY = margin;

      const drawFooter = async () => {
        if (footerBlock) {
          const canvas = await html2canvas(footerBlock, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: false
          });
          const imgData = canvas.toDataURL("image/png");
          const footerHeightMM = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, "PNG", margin, pdfHeight - footerHeightMM - 8, imgWidth, footerHeightMM, undefined, "FAST");
        }
      };

      const addBlockToPDF = async (el: HTMLElement) => {
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false
        });
        const imgData = canvas.toDataURL("image/png");
        const blockHeightMM = (canvas.height * imgWidth) / canvas.width;

        // If rendering this block exceeds page boundary, trigger page break
        if (currentY + blockHeightMM > pageHeightLimit) {
          await drawFooter();
          pdf.addPage();
          currentY = margin;
        }

        pdf.addImage(imgData, "PNG", margin, currentY, imgWidth, blockHeightMM, undefined, "FAST");
        currentY += blockHeightMM + 5; // 5mm spacing between blocks
      };

      // 1. Capture and add Header Block
      if (headerBlock) {
        await addBlockToPDF(headerBlock);
      }

      // 2. Capture and add each active Section Block
      const sectionsArray = Array.from(sectionBlocks);
      for (const section of sectionsArray) {
        await addBlockToPDF(section as HTMLElement);
      }

      // 3. Capture and add Coach Remarks / Grand Score Block
      if (remarksBlock) {
        await addBlockToPDF(remarksBlock);
      }

      // 4. Draw Footer on the final page
      await drawFooter();

      pdf.save(`CoachReport_${candidate.firstName}_${candidate.lastName}_${candidate.id}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex flex-col overflow-hidden font-coaches">
      {/* Sticky top bar */}
      <div className="bg-[#0B1A30] text-white px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b-4 border-black flex-shrink-0 shadow-md">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer border border-white/10">
            <X size={18} />
          </button>
          <div>
            <p className="text-[10px] sm:text-xs text-amber-400 uppercase tracking-widest font-semibold">Creating Assessment Report</p>
            <h2 className="text-base sm:text-lg font-black text-white">{candidate.firstName} {candidate.lastName}</h2>
          </div>
          <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black uppercase border ${candidate.testMode === "Online" ? "bg-emerald-500/20 border-emerald-400 text-emerald-300" : "bg-teal-500/20 border-teal-400 text-teal-300"}`}>
            {candidate.testMode} Package
          </span>
        </div>
        <div className="w-full sm:w-auto flex flex-row items-center justify-between sm:justify-end gap-3">
          {grand > 0 && (
            <div className="text-left sm:text-right sm:mr-4">
              <p className="text-[10px] sm:text-xs text-slate-400">Grand Score</p>
              <p className={`text-xl sm:text-2xl font-black ${grand >= 8 ? "text-emerald-400" : grand >= 5 ? "text-amber-400" : "text-red-400"}`}>
                {grand} <span className="text-[10px] sm:text-sm font-semibold text-slate-400">/ 10</span>
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial justify-end">
            <button
              onClick={handleSaveDraft}
              className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-slate-800 hover:bg-slate-900 border-2 border-black text-white font-extrabold rounded-xl transition text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none cursor-pointer relative flex-1 sm:flex-none"
            >
              <Save size={14} className="sm:w-[16px] sm:h-[16px]" />
              <span className="whitespace-nowrap">Save Draft</span>
              {draftSavedMessage && (
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-emerald-650 border border-black text-white text-[10px] py-1 px-2.5 rounded shadow-lg whitespace-nowrap z-50 animate-bounce">
                  {draftSavedMessage}
                </span>
              )}
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={!allFilled || generating}
              className="flex items-center justify-center gap-2 px-3 py-2 sm:px-5 sm:py-3 bg-[#F5C451] hover:bg-[#E2AF3C] disabled:opacity-45 disabled:cursor-not-allowed text-[#0B1A30] border-2 border-black font-extrabold rounded-xl transition text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-none cursor-pointer flex-1 sm:flex-none"
            >
              {generating ? <Loader2 size={14} className="animate-spin sm:w-[16px] sm:h-[16px]" /> : <Download size={14} className="sm:w-[16px] sm:h-[16px]" />}
              <span className="whitespace-nowrap">{generating ? "Generating..." : "Download Report PDF"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto bg-[#FAF9F5] p-6">
        {draftLoadedAlert && (
          <div className="max-w-3xl mx-auto mb-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl px-4 py-3 text-emerald-800 text-sm font-semibold flex items-center gap-2 animate-pulse">
            <CheckCircle size={16} className="text-emerald-500" />
            Saved progress draft loaded successfully! You can resume scoring.
          </div>
        )}

        {!allFilled && (
          <div className="max-w-3xl mx-auto mb-4 bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-3 text-amber-800 text-sm font-semibold flex items-center gap-2">
            <Star size={16} className="text-amber-500" />
            All categories must be scored before you can download the report. Click &quot;Save Draft&quot; to save your progress at any time.
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-5">
          {/* Candidate Info Card */}
          <div className="bg-white rounded-2xl p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xs font-black text-[#0B1A30] uppercase tracking-widest mb-4 pb-1 border-b-2 border-black inline-block">Candidate Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
              {[
                ["Full Name", `${candidate.firstName} ${candidate.lastName}`],
                ["Registration ID", candidate.id],
                ["Package", candidate.testMode],
                ["Playing Role", candidate.playingRole],
                ["Specialty", candidate.subRole],
                ["Age", candidate.age],
                ["Nationality", candidate.nationality],
                ["Country of Residence", candidate.countryOfResidence],
                ["Email", candidate.email],
                ["Mobile", `${candidate.mobileCountryCode} ${candidate.mobileNumber}`],
                ["Assessment Date", today],
                ["Submitted At", candidate.submittedAt],
              ].map(([label, val]) => (
                <div key={label}>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</span>
                  <span className="block text-slate-800 font-semibold mt-0.5 break-words">{val || "–"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring Sections */}
          {categoriesList.map(group => {
            return (
              <SectionCard
                key={group.key}
                group={group}
                scores={scores}
                comments={sectionComments}
                isToggled={!!activeSections[group.key]}
                onToggle={() => handleToggleSection(group.key)}
                onChange={handleScore}
                onComment={handleComment}
                onSaveDraft={handleSaveDraft}
              />
            );
          })}

          {/* Overall Remarks */}
          <div className="bg-white rounded-2xl p-5 space-y-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <label className="flex items-center gap-2 text-sm font-black text-[#0B1A30] uppercase tracking-wider">
              <Trophy size={16} className="text-[#F5C451]" /> <span className="pb-0.5 border-b-2 border-black">Overall Coach Remarks</span>
            </label>
            <textarea
              rows={4}
              value={overallRemarks}
              onChange={e => setOverallRemarks(e.target.value)}
              placeholder="Write your overall assessment remarks and recommendations for the candidate..."
              className="w-full px-4 py-3 text-sm text-[#0B1A30] border-2 border-black rounded-xl focus:outline-none focus:border-[#F5C451] resize-none bg-[#FAF9F5] placeholder-slate-400"
            />
          </div>

          {/* Grand score summary */}
          {grand > 0 && (
            <div className="bg-[#0B1A30] border-2 border-black rounded-2xl p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-[#F5C451] text-xs uppercase tracking-widest font-black mb-2">Grand Overall Score</p>
              <p className={`text-6xl font-black ${grand >= 8 ? "text-emerald-400" : grand >= 5 ? "text-amber-400" : "text-red-400"}`}>
                {grand}
              </p>
              <p className="text-slate-300 text-sm font-bold mt-1">out of 10</p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Print Template for PDF */}
      <div className="absolute -top-[9999px] -left-[9999px] pointer-events-none">
        <div ref={printRef} style={{ width: "794px", backgroundColor: "#fff", fontFamily: "Georgia, serif" }}>
          
          {/* Header & Candidate Information Block */}
          <div id="pdf-header-block" style={{ width: "794px", backgroundColor: "#fff", padding: "40px 40px 10px 40px", boxSizing: "border-box" }}>
            {/* Report Header */}
            <div style={{ textAlign: "center", border: "2px solid #000000", background: "#FDF8E7", borderRadius: "12px", padding: "24px 20px", marginBottom: "24px" }}>
              <img src={logoImg} alt="TCA Logo" style={{ height: "64px", marginBottom: "15px", display: "block", marginLeft: "auto", marginRight: "auto" }} />
              <h1 style={{ fontSize: "20px", fontWeight: 900, color: "#0B1A30", margin: "0 0 8px 0" }}>{candidate.testMode} Cricket Skills Certification Report</h1>
              <p style={{ fontSize: "14px", fontWeight: "bold", color: "#000000", margin: "0 0 6px 0" }}>Issued by The Cricket Advisor – Certified Assessment Division</p>
              <p style={{ fontSize: "12px", fontWeight: "bold", color: "#000000", margin: 0 }}>Assessment Date: {today}</p>
            </div>

            {/* Candidate Details */}
            <div style={{ background: "#f8fafc", border: "2px solid #000000", borderRadius: "8px", padding: "16px" }}>
              <h2 style={{ fontSize: "11px", fontWeight: 700, color: "#000000", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px", marginTop: 0 }}>Candidate Information</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {[
                  ["Full Name", `${candidate.firstName} ${candidate.lastName}`],
                  ["Registration ID", candidate.id],
                  ["Package Type", candidate.testMode],
                  ["Playing Role", candidate.playingRole],
                  ["Specialty", candidate.subRole],
                  ["Age", candidate.age],
                  ["Nationality", candidate.nationality],
                  ["Country of Residence", candidate.countryOfResidence],
                  ["Email", candidate.email],
                ].map(([l, v]) => (
                  <div key={l} style={{ border: "2px solid #000000", borderRadius: "6px", padding: "8px 12px", background: "#ffffff" }}>
                    <div style={{ fontSize: "9px", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div>
                    <div style={{ fontSize: "11.5px", color: "#000000", fontWeight: 900, marginTop: "2px", wordBreak: "break-word" }}>{v || "–"}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Validity Block */}
            <div style={{ background: "#f8fafc", border: "2px solid #000000", borderRadius: "8px", padding: "16px", marginTop: "16px" }}>
              <h3 style={{ fontSize: "11px", fontWeight: 700, color: "#000000", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px 0" }}>
                Assessment Validity – 12 Months
              </h3>
              <ul style={{ margin: 0, paddingLeft: "20px", listStyleType: "disc", fontSize: "10.5px", color: "#000000", lineHeight: "1.7" }}>
                <li style={{ marginBottom: "4px" }}>This report is valid for 12 months from the date of assessment.</li>
                <li style={{ marginBottom: "4px" }}>Cricket skills and playing methods can change and improve over time.</li>
                <li style={{ marginBottom: "4px" }}>Player performance may vary with practice, coaching, fitness, and match experience.</li>
                <li style={{ marginBottom: "4px" }}>The player&apos;s technique and playing style may develop during this period.</li>
                <li style={{ margin: 0 }}>A new assessment is recommended after 12 months to review the player&apos;s current skills and progress.</li>
              </ul>
            </div>

            {/* Assessment Guidelines Block */}
            <div style={{ background: "#fafafa", border: "2px solid #000000", borderRadius: "8px", padding: "16px", marginTop: "16px" }}>
              <h3 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#000000", margin: "0 0 10px 0" }}>Assessment Guidelines</h3>
              <ul style={{ margin: 0, paddingLeft: "20px", listStyleType: "disc", fontSize: "10.5px", color: "#000000", lineHeight: "1.7" }}>
                <li style={{ marginBottom: "4px" }}>Assessment completed Online or Offline, as applicable.</li>
                <li style={{ marginBottom: "4px" }}>Results are based on the player&apos;s performance during the test.</li>
                <li style={{ marginBottom: "4px" }}>Scores are for guidance and development purposes.</li>
                <li style={{ marginBottom: "4px" }}>Results may change based on conditions, equipment, and player performance on the day.</li>
                <li style={{ margin: 0 }}>The report is not a guarantee of future performance or selection.</li>
              </ul>
            </div>
          </div>

          {/* Score Tables per active category group */}
          {categoriesList.map(group => {
            const isWkSection = group.key === "wicketkeeping";
            if ((isWkSection && !isWKRequired) || !activeSections[group.key]) {
              return null;
            }

            const avg = categoryAverage(group, scores);
            const displayLabel = group.key === "wicketkeeping" ? "Wicketkeeping" : group.label;

            return (
              <div key={group.key} className="pdf-section-block" style={{ width: "794px", backgroundColor: "#fff", padding: "10px 40px", boxSizing: "border-box" }}>
                <div style={{ borderRadius: "8px", overflow: "hidden", border: "2px solid #000000" }}>
                  <div style={{ background: "#0B1A30", color: "#fff", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 900, fontSize: "13px", textTransform: "uppercase" }}>{displayLabel}</span>
                    {avg > 0 && <span style={{ fontSize: "11px", color: "#fbbf24" }}>Section Average: {avg} / 10</span>}
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc" }}>
                        <th style={{ padding: "6px 12px", fontSize: "10px", textAlign: "left", color: "#64748b", fontWeight: 700 }}>Category</th>
                        <th style={{ padding: "6px 12px", fontSize: "10px", textAlign: "center", color: "#64748b", fontWeight: 700, width: "100px" }}>Score</th>
                        <th style={{ padding: "6px 12px", fontSize: "10px", textAlign: "left", color: "#64748b", fontWeight: 700 }}>Rating Bar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.subCategories.map((sub, i) => {
                        const v = scores[sub.key] || 0;
                        const barColor = v === 0 ? "#e2e8f0" : v <= 4 ? "#f87171" : v <= 7 ? "#fbbf24" : "#34d399";
                        return (
                          <tr key={sub.key} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc", borderTop: "1px solid #000000" }}>
                            <td style={{ padding: "7px 12px", fontSize: "11px", color: "#000000", fontWeight: 550 }}>{sub.label}</td>
                            <td style={{ padding: "7px 12px", textAlign: "center", fontSize: "13px", fontWeight: 900, color: v <= 4 ? "#ef4444" : v <= 7 ? "#d97706" : "#10b981" }}>{v > 0 ? `${v} / 10` : "—"}</td>
                            <td style={{ padding: "7px 12px" }}>
                              <div style={{ background: "#e2e8f0", borderRadius: "4px", height: "8px", overflow: "hidden" }}>
                                <div style={{ width: `${v * 10}%`, height: "8px", background: barColor, borderRadius: "4px" }} />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {sectionComments[group.key] && (
                    <div style={{ background: "#fffbeb", padding: "8px 16px", borderTop: "1px solid #000000", fontSize: "10px", color: "#000000" }}>
                      <strong>Coach Notes:</strong> {sectionComments[group.key]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Remarks & Grand Score Block */}
          <div id="pdf-remarks-block" style={{ width: "794px", backgroundColor: "#fff", padding: "10px 40px 20px 40px", boxSizing: "border-box" }}>
            {/* Grand Score */}
            <div style={{ background: "#0B1A30", border: "2px solid #000000", borderRadius: "12px", padding: "20px", textAlign: "center", marginBottom: "20px" }}>
              <p style={{ color: "#fbbf24", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px 0" }}>Grand Overall Score</p>
              <p style={{ color: grand >= 8 ? "#34d399" : grand >= 5 ? "#fbbf24" : "#f87171", fontSize: "48px", fontWeight: 900, margin: 0 }}>{grand > 0 ? `${grand} / 10` : "—"}</p>
            </div>

            {/* Overall Remarks */}
            {overallRemarks && (
              <div style={{ border: "2px solid #000000", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#000000", marginBottom: "8px", marginTop: 0 }}>Overall Coach Remarks</h3>
                <p style={{ fontSize: "12px", color: "#000000", lineHeight: 1.7, margin: 0 }}>{overallRemarks}</p>
              </div>
            )}

            {/* Signature & Verification Block */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "24px", paddingTop: "16px", borderTop: "2px solid #000000" }}>
              <div style={{ maxWidth: "420px" }}>
                <p style={{ fontSize: "10.5px", color: "#000000", lineHeight: "1.6", margin: 0 }}>
                  To validate a certification or submit a query regarding this report, authorized organizations are invited to contact our verification team at <a href="mailto:thecricketadvisor@gmail.com" style={{ color: "#0b1a30", textDecoration: "underline", fontWeight: "bold" }}>thecricketadvisor@gmail.com</a>.
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ display: "block", fontSize: "9px", color: "#000000", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Authorized Signatory</span>
                <img src={signatureImg} alt="Head Coach Signature" style={{ height: "65px", width: "auto", display: "inline-block" }} />
              </div>
            </div>
          </div>

          {/* Footer Block */}
          <div id="pdf-footer-block" style={{ width: "794px", backgroundColor: "#fff", padding: "10px 40px 20px 40px", boxSizing: "border-box" }}>
            <div style={{ borderTop: "2px solid #000000", paddingTop: "16px", textAlign: "center" }}>
              <p style={{ fontSize: "12px", color: "#0B1A30", fontWeight: "bold", marginBottom: "6px", marginTop: 0 }}>
                This report has been generated based on assessment conducted by BCCI Level 3 & ECB Level 1 certified coaches of The Cricket Advisor.
              </p>
              <p style={{ fontSize: "12px", color: "#0B1A30", fontWeight: "bold", margin: 0 }}>
                © The Cricket Advisor | www.thecricketadvisor.com | Confidential Assessment Report | {today}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
