import React, { useState, useEffect } from 'react';
import { CricketCVFull, DEMO_CV_DATA } from './CVTypes';
import { 
  Lock, 
  Download, 
  Edit3, 
  LogOut, 
  Sparkles,
  RefreshCw,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Info
} from 'lucide-react';
import CVLivePreview from './CVLivePreview';
import CVColourSelector from './CVColourSelector';
import CVFontSelector from './CVFontSelector';

interface CVDashboardProps {
  cv: CricketCVFull;
  cvToken: string;
  onLogout: () => void;
  onEditCV: () => void;
  onDownloadCleanPDF: () => void;
  onRenewSuccess: (updatedCv: CricketCVFull) => void;
  onRequestCorrection: () => void;
  onSelectTemplate: (templateId: string, isStyleUpdate?: boolean) => void;
  onSelectFont: (font: string, isStyleUpdate?: boolean) => void;
  onSelectColour: (colour: string, isStyleUpdate?: boolean) => void;
  onPayAndDownload?: () => void;
  onRenewPlanCheckout?: () => void;
}

export default function CVDashboard({
  cv,
  cvToken,
  onLogout,
  onEditCV,
  onDownloadCleanPDF,
  onSelectTemplate,
  onPayAndDownload,
  onRenewSuccess,
  onRequestCorrection,
  onSelectFont,
  onSelectColour,
  onRenewPlanCheckout
}: CVDashboardProps) {
  const editsLeft = cv.editsAllowed - cv.editsUsed;
  const [showRenewModal, setShowRenewModal] = useState(false);

  const calculateAge = (dobString?: string) => {
    if (!dobString) return '-';
    if (/^\d+$/.test(dobString.trim()) || dobString.toLowerCase().includes('year')) {
      return dobString.trim();
    }
    const year = parseInt(dobString.split('-')[0], 10);
    if (isNaN(year)) return dobString;
    return (new Date().getFullYear() - year).toString();
  };
  const [showTokenConfirmModal, setShowTokenConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // Local state for instant preview — updates immediately without waiting for parent re-render
  const [previewCv, setPreviewCv] = useState<CricketCVFull>(cv);

  useEffect(() => {
    setPreviewCv(cv);
  }, [cv]);

  const templates = [
    /*
    {
      id: 'executive',
      name: 'The Executive',
      desc: 'Clean corporate layout with a prominent left sidebar. Ideal for professional club and administrative opportunities.',
      character: 'Corporate, Structured',
      layoutPreview: (activeColor: string) => (
        <div className="w-10 h-14 bg-white border border-slate-700 rounded overflow-hidden flex flex-row shrink-0 select-none">
          <div className="w-3.5 h-full" style={{ backgroundColor: activeColor }} />
          <div className="flex-1 p-0.5 space-y-0.5">
            <div className="h-0.5 bg-slate-300 w-full" />
            <div className="h-0.5 bg-slate-200 w-3/4" />
            <div className="h-2" />
            <div className="h-0.5 bg-slate-100 w-full" />
            <div className="h-0.5 bg-slate-100 w-full" />
          </div>
        </div>
      )
    },
    {
      id: 'professional',
      name: 'The Professional',
      desc: 'Modern layout with an accent color banner. Displays key statistics blocks directly at the top for immediate impact.',
      character: 'Modern, Stats-Focused',
      layoutPreview: (activeColor: string) => (
        <div className="w-10 h-14 bg-white border border-slate-700 rounded overflow-hidden flex flex-col shrink-0 select-none">
          <div className="h-2.5 w-full" style={{ backgroundColor: activeColor }} />
          <div className="flex-1 p-0.5 space-y-0.5">
            <div className="grid grid-cols-3 gap-0.5">
              <div className="h-1.5 bg-slate-200" />
              <div className="h-1.5 bg-slate-200" />
              <div className="h-1.5 bg-slate-200" />
            </div>
            <div className="h-0.5 bg-slate-300 w-full" />
            <div className="h-0.5 bg-slate-200 w-3/4" />
          </div>
        </div>
      )
    },
    {
      id: 'international',
      name: 'The International',
      desc: 'Tailored for overseas opportunities. Detailed sections for nationality, residence, visa availability and overseas playing experience.',
      character: 'Global Placement',
      layoutPreview: (activeColor: string) => (
        <div className="w-10 h-14 bg-white border border-slate-700 rounded overflow-hidden flex flex-col shrink-0 select-none">
          <div className="h-0.5 w-full" style={{ backgroundColor: activeColor }} />
          <div className="flex-1 p-0.5 space-y-0.5">
            <div className="h-1.5 bg-slate-100 w-full" />
            <div className="grid grid-cols-2 gap-0.5">
              <div className="h-5 bg-slate-50 border border-slate-100" />
              <div className="h-5 bg-slate-50 border border-slate-100" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'classic',
      name: 'The Classic',
      desc: 'Traditional clean format with elegant typography. Focuses on playing history and simple text-based data representation.',
      character: 'Traditional, Elegant',
      layoutPreview: (activeColor: string) => (
        <div className="w-10 h-14 bg-white border border-slate-700 rounded overflow-hidden flex flex-col items-center justify-between p-0.5 shrink-0 select-none">
          <div className="h-0.5 bg-slate-400 w-1/2" />
          <div className="w-full space-y-0.5">
            <div className="h-0.5 bg-slate-200 w-full" />
            <div className="h-0.5 bg-slate-200 w-full" />
            <div className="h-0.5 bg-slate-200 w-full" />
            <div className="h-0.5 bg-slate-200 w-full" />
          </div>
          <div className="h-0.5 w-full" style={{ backgroundColor: activeColor }} />
        </div>
      )
    },
    {
      id: 'performance',
      name: 'The Performance',
      desc: 'Athletic profile displaying statistics highlights first. Emphasizes tournament statistics and major team logs.',
      character: 'Athlete, High-Impact',
      layoutPreview: (activeColor: string) => (
        <div className="w-10 h-14 bg-white border border-slate-700 rounded overflow-hidden flex flex-col shrink-0 p-0.5 space-y-0.5 select-none">
          <div className="flex justify-between items-center">
            <div className="h-1.5 w-3 bg-slate-200" />
            <div className="h-1.5 w-3" style={{ backgroundColor: activeColor }} />
          </div>
          <div className="grid grid-cols-2 gap-0.5">
            <div className="h-2.5 bg-slate-100" />
            <div className="h-2.5 bg-slate-100" />
          </div>
          <div className="h-0.5 bg-slate-300 w-full" />
        </div>
      )
    },
    */
    {
      id: 'prestige',
      name: 'The Prestige',
      desc: 'Elite double-border layout featuring stumps decoration, a deep navy sidebar and warm cream aesthetics.',
      character: 'Prestigious, Detailed',
      layoutPreview: (activeColor: string) => (
        <div className="w-10 h-14 bg-[#faf8f4] border border-slate-700 rounded overflow-hidden flex shrink-0 select-none">
          <div className="w-3 h-full bg-[#152238] flex flex-col justify-between p-0.5">
            <div className="h-2 w-full rounded-sm" style={{ backgroundColor: activeColor }} />
            <div className="h-0.5 bg-slate-500 w-full" />
          </div>
          <div className="flex-1 p-0.5 space-y-0.5 flex flex-col justify-between">
            <div className="border border-slate-300 p-0.5 space-y-0.5">
              <div className="h-0.5 bg-slate-300 w-full" />
              <div className="h-0.5 bg-slate-200 w-3/4" />
            </div>
            <div className="h-0.5 bg-slate-200 w-full" />
          </div>
        </div>
      )
    }
  ];

  // Optimal color switcher based on template selection
  const getOptimalColor = (templateId: string) => {
    switch (templateId) {
      case 'professional': return '#991B1B'; // crimson
      case 'international': return '#065F46'; // emerald green
      case 'classic': return '#1F2937'; // charcoal grey
      case 'performance': return '#B45309'; // gold/bronze
      case 'prestige': return '#c1904f'; // gold
      case 'executive':
      default: return '#0B1A30'; // navy
    }
  };

  const handleSelectTemplate = (id: string) => {
    const newColor = getOptimalColor(id);
    // Update local preview immediately — no parent re-render delay
    setPreviewCv(prev => ({ ...prev, templateId: id, accentColour: newColor }));
    // Also propagate to parent for persistence
    const isStyleUpdate = cv.paymentStatus === 'Paid';
    onSelectTemplate(id, isStyleUpdate);
  };

  const handleSelectColour = (color: string) => {
    setPreviewCv(prev => ({ ...prev, accentColour: color }));
    const isStyleUpdate = cv.paymentStatus === 'Paid';
    onSelectColour(color, isStyleUpdate);
  };

  const handleSelectFont = (font: string) => {
    setPreviewCv(prev => ({ ...prev, font: font }));
    const isStyleUpdate = cv.paymentStatus === 'Paid';
    onSelectFont(font, isStyleUpdate);
  };

  const handleEditDetailsClick = () => {
    if (cv.paymentStatus === 'Paid') {
      setShowTokenConfirmModal(true);
    } else {
      // Unpaid user goes directly to form edits without warning
      onEditCV();
    }
  };

  const confirmTokenEdit = () => {
    setShowTokenConfirmModal(false);
    onEditCV();
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/cv-renew-plan', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cvToken}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        alert('Payment Verified! Simulated transaction of ₹249 completed successfully. 5 edits restored.');
        onRenewSuccess(data.cv);
        setShowRenewModal(false);
      } else {
        alert(`Error: ${data.error || 'Failed to renew plan'}`);
      }
    } catch (err: any) {
      alert(`Error simulating payment: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpayRenewal = async () => {
    setIsProcessing(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Failed to load Razorpay payment SDK. Please check your internet connection.');
        setIsProcessing(false);
        return;
      }

      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 249 }) // amount in rupees; create-order API converts to paise
      });

      if (!orderRes.ok) {
        const errorText = await orderRes.text();
        throw new Error(errorText || 'Failed to create order on server');
      }

      const orderData = await orderRes.json();
      if (!orderData.id) {
        throw new Error('Order creation did not return a valid order ID');
      }

      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'The Cricket Advisor',
        description: 'Cricket CV 5-Edit Renewal',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/cv-verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cvToken}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cvId: cv.id,
                userId: cv.userId
              })
            });

            if (verifyRes.ok) {
              const getRes = await fetch(`/api/cv-get?t=${Date.now()}`, {
                headers: {
                  'Authorization': `Bearer ${cvToken}`
                }
              });
              if (getRes.ok) {
                const getData = await getRes.json();
                alert('Payment Verified! Plan renewed successfully. 5 edits restored.');
                onRenewSuccess(getData.cv);
                setShowRenewModal(false);
              } else {
                alert('Payment verified, but failed to fetch updated CV details. Please reload the page.');
              }
            } else {
              const data = await verifyRes.json();
              alert(`Verification failed: ${data.error || 'Unknown error'}`);
            }
          } catch (err: any) {
            console.error(err);
            alert(`Verification error: ${err.message}`);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${cv.firstName || ''} ${cv.lastName || ''}`,
          email: cv.email || '',
          contact: cv.phone || ''
        },
        theme: {
          color: '#0B1A30'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Razorpay renewal failed:', err);
      alert(`Payment failed to initialize: ${err.message}`);
      setIsProcessing(false);
    }
  };

  const isPaid = cv.paymentStatus === 'Paid';

  // For preview rendering:
  // If user is paid: render the user's real CV with local style overrides
  // If user is unpaid: render the Suresh Kothari DEMO_CV_DATA with selected styles applied
  const previewCVData: CricketCVFull = isPaid
    ? previewCv
    : {
        ...DEMO_CV_DATA,
        templateId: previewCv.templateId || 'prestige',
        font: previewCv.font || 'Inter',
        accentColour: previewCv.accentColour || '#0B1A30',
        showBatting: previewCv.showBatting !== false,
        showBowling: previewCv.showBowling !== false
      };

  return (
    <div className="bg-[#FDFBF7] border-2 border-[#1E293B] rounded-2xl p-5 md:p-8 text-left max-w-5xl mx-auto shadow-[4px_4px_0px_0px_rgba(30,41,59,1)] space-y-8 font-sans relative text-[#1E293B] capitalize">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-[#1E293B] pb-6 gap-4 font-sans">
        <div>
          <span className="text-xs font-extrabold text-gold-600 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-gold-500" /> Player Career Dashboard
          </span>
          <h2 className="text-3xl font-black text-[#1E293B] mt-1 uppercase tracking-tight font-display">
            Welcome, {cv.firstName} {cv.lastName}
          </h2>
          <p className="text-slate-600 text-xs mt-0.5 font-semibold">
            Manage your professional cricket resume and download documents.
          </p>
        </div>
        <button 
          onClick={onLogout}
          className="px-5 py-2.5 rounded-xl border-2 border-[#1E293B] text-[#1E293B] hover:bg-[#F4F0EA] transition flex items-center gap-2 text-xs font-bold cursor-pointer font-sans"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>

      {/* Grid Layout Redesigned */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 font-sans">
        
        {/* Left Column: Profile Card & Actions */}
        <div className={isPaid ? "md:col-span-7 space-y-6" : "md:col-span-12 space-y-6"}>
               {/* Identity Profile Card */}
          <div className="bg-[#FAF6EE] p-6 rounded-xl border-2 border-[#1E293B] space-y-5 shadow-sm">
            <div className="flex justify-between items-center border-b-2 border-[#1E293B] pb-3">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Verified Player Identity</h3>
              <span className={`flex items-center gap-1 text-[10px] bg-[#FDFBF7] px-2.5 py-1 rounded font-bold uppercase tracking-wider ${
                isPaid ? 'text-green-800 border-2 border-[#1E293B] bg-green-50' : 'text-yellow-800 border-2 border-[#1E293B] bg-yellow-50'
              }`}>
                <Lock className="w-3 h-3" /> {isPaid ? 'Locked' : 'Unpaid Draft'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs font-sans">
              <div>
                <span className="text-[10px] text-slate-655 uppercase block mb-1 font-bold">First Name</span>
                <span className="font-bold text-[#1E293B] text-sm">{cv.firstName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-655 uppercase block mb-1 font-bold">Last Name</span>
                <span className="font-bold text-[#1E293B] text-sm">{cv.lastName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-655 uppercase block mb-1 font-bold">Nationality</span>
                <span className="font-bold text-[#1E293B] text-sm">{cv.nationality || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-655 uppercase block mb-1 font-bold">Age</span>
                <span className="font-bold text-[#1E293B] text-sm">{calculateAge(cv.dateOfBirth)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-slate-655 uppercase block mb-1 font-bold">State / County / Province</span>
                <span className="font-bold text-[#1E293B] text-sm">
                  {cv.currentCity || '-'}
                </span>
              </div>
            </div>

            {isPaid && (
              <div className="pt-3 border-t-2 border-[#1E293B] text-center">
                <button 
                  onClick={onRequestCorrection}
                  className="text-[10px] text-gold-600 hover:underline transition cursor-pointer font-bold font-sans"
                >
                  Request Profile Info Correction
                </button>
              </div>
            )}
          </div>

          {/* Primary Operations Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleEditDetailsClick}
              disabled={isPaid && editsLeft <= 0}
              className={`flex-1 py-4 rounded-xl font-black flex items-center justify-center gap-2 text-xs transition-all cursor-pointer ${
                !isPaid || editsLeft > 0 
                  ? 'bg-[#FDFBF7] border-2 border-[#1E293B] text-[#1E293B] hover:bg-[#F4F0EA] shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]' 
                  : 'bg-slate-150 border-2 border-slate-300 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Edit3 className="w-4 h-4 text-gold-500" /> {isPaid ? 'EDIT CV DETAILS' : 'CREATE MY CRICKET CV'}
            </button>
            
            {isPaid && (
              <button 
                onClick={onDownloadCleanPDF}
                className="flex-1 py-4 rounded-xl font-black bg-gold-gradient text-navy-950 border-2 border-[#1E293B] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs cursor-pointer font-sans shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]"
              >
                <Download className="w-4 h-4" /> DOWNLOAD CLEAN PDF
              </button>
            )}
          </div>

        </div>

        {/* Right Column: Edits Tracking & Plan Renewal (Only for paid users) */}
        {isPaid && (
          <div className="md:col-span-5 space-y-6">
            
            {/* Annual Modifications Counter */}
            <div className="bg-[#FAF6EE] p-6 rounded-xl border-2 border-[#1E293B] space-y-5 shadow-sm">
              <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider">Modifications Tracker</h3>
              
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-black text-[#1E293B]">{editsLeft} / {cv.editsAllowed}</span>
                <span className="text-[10px] text-slate-655 uppercase font-bold tracking-wider">edits remaining</span>
              </div>

              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gold-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(0, (editsLeft / cv.editsAllowed) * 100)}%` }}
                />
              </div>

              {editsLeft <= 0 ? (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl space-y-3 animate-fade-in">
                  <div className="flex gap-2 items-start text-xs text-red-650 font-sans">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Edit Limit Reached!</span> You have used all 5 edits. Update plans to unlock more updates.
                    </div>
                  </div>
                  
                  <button 
                    onClick={onRenewPlanCheckout || (() => setShowRenewModal(true))}
                    className="w-full py-2.5 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer font-sans shadow-md"
                    style={{ backgroundColor: '#dc2626' }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> RENEW PLAN / ADD EDITS
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                  Annual modifications balance resets automatically on {new Date(cv.editPeriodEnd || Date.now()).toLocaleDateString()}.
                </p>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Section: Premium Designs Showcase & Live Preview */}
      <div className="border-t border-slate-200 pt-8 space-y-6">
        <div>
          <h3 className="text-lg font-black text-black uppercase tracking-wider flex items-center gap-2 font-display">
            <Layers className="w-5 h-5 text-gold-500" /> Premium Templates & Live Preview
          </h3>
          <p className="text-slate-650 text-xs mt-1 font-semibold">
            {isPaid 
              ? 'Select a design layout below to instantly format your live profile CV.' 
              : 'Showing Suresh Kothari (Demo Player Profiles) watermark preview. Toggling templates updates the styles on-the-fly.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
          
          {/* Templates list & Style customization (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-3">
              <h4 className="text-xs font-black text-black uppercase tracking-wider">Select Design</h4>
              <div className="space-y-3">
                {templates.map((t) => {
                  const isSelected = previewCVData.templateId === t.id;
                  const optColor = getOptimalColor(t.id);
                  return (
                    <div 
                      key={t.id}
                      onClick={() => handleSelectTemplate(t.id)}
                      className={`p-3 rounded-xl text-left cursor-pointer transition-all flex items-start gap-4 ${
                        isSelected 
                          ? 'bg-gold-50/20 border border-gold-500 shadow-sm' 
                          : 'bg-white border border-slate-200 hover:border-slate-350'
                      }`}
                    >
                      {/* Visual mini-layout structure representation */}
                      {t.layoutPreview(optColor)}

                      <div className="space-y-0.5 flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-extrabold text-black text-xs">{t.name}</h4>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            isSelected ? 'bg-gold-500 text-navy-950' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {t.character}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-655 leading-relaxed font-sans mt-1 font-medium">{t.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customization controls displayed directly on unpaid (and paid) dashboards */}
            <div className="border-t border-slate-200 pt-5">
              <CVColourSelector 
                selectedColour={cv.accentColour}
                onSelectColour={handleSelectColour}
              />
            </div>

            <div className="border-t border-slate-200 pt-5">
              <CVFontSelector 
                selectedFont={cv.font}
                onSelectFont={handleSelectFont}
              />
            </div>

          </div>

          {/* Live Preview Container (col-span-7) */}
          <div className="lg:col-span-7 h-[500px] lg:h-[820px] rounded-xl overflow-hidden shadow-xl border border-slate-200">
            <CVLivePreview cv={previewCVData} isPreview={true} />
          </div>

        </div>
      </div>

      {/* Edit Token Confirmation Modal Popup */}
      {showTokenConfirmModal && (
        <div className="fixed inset-0 bg-[#0B1A30]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl text-left text-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-650 font-bold">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B1A30] uppercase tracking-wider font-display">Confirm Profile Modification</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Edit CV Details Token Verification</p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-sans text-slate-650">
              <p className="leading-relaxed">
                Opening the profile form sheet to edit your details will consume **1 edit token**.
              </p>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Current Balance:</span>
                  <span className="text-slate-800 font-semibold">{editsLeft} / {cv.editsAllowed} edits</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Cost to Edit:</span>
                  <span className="text-gold-600 font-bold">1 edit token</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 leading-normal">
                You get 5 edits per year. Style configuration adjustments (template selections, fonts, colours) done from the dashboard preview do NOT consume tokens.
              </p>
            </div>

            <div className="flex gap-3 font-sans">
              <button 
                onClick={() => setShowTokenConfirmModal(false)}
                className="flex-1 py-3 border border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-navy-950 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmTokenEdit}
                className="flex-1 py-3 bg-gold-gradient text-navy-950 rounded-xl text-xs font-black hover:opacity-90 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Confirm & Use 1 Token
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Plan Renewal Modal Gateway */}
      {showRenewModal && (
        <div className="fixed inset-0 bg-[#0B1A30]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl text-left text-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-gold-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0B1A30] uppercase tracking-wider">Plan Renewal Checkout</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">The Cricket Advisor Secure Checkout</p>
              </div>
            </div>

            <div className="space-y-4 text-xs font-sans text-slate-600">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Product:</span>
                  <span className="text-slate-800 font-semibold">Cricket CV 5-Edit Renewal</span>
                </div>
                <div className="flex justify-between items-center mt-2 text-slate-500 border-t border-slate-200 pt-2">
                  <span>Total Amount:</span>
                  <span className="text-gold-600 font-bold text-sm">₹249</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Please complete your checkout process securely using Razorpay to proceed.
              </p>
            </div>

            <div className="flex flex-col gap-3 font-sans">
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowRenewModal(false)}
                  disabled={isProcessing}
                  className="px-4 py-3 border border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-navy-950 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRazorpayRenewal}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-gold-gradient text-navy-950 rounded-xl text-xs font-black hover:opacity-90 transition flex items-center justify-center gap-1.5 cursor-pointer uppercase animate-pulse-subtle"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-3.5 h-3.5" /> Pay ₹249 Securely
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
