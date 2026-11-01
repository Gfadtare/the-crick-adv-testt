import React, { useState } from 'react';
import { CricketCVFull } from './CVTypes';
import { 
  CheckCircle, 
  AlertTriangle, 
  ChevronLeft, 
  CreditCard, 
  ShieldCheck, 
  QrCode, 
  Lock,
  Wallet
} from 'lucide-react';

interface CVReviewPageProps {
  cv: CricketCVFull;
  onPay: (isSimulated: boolean) => void;
  onPrev: () => void;
}

export default function CVReviewPage({ cv, onPay, onPrev }: CVReviewPageProps) {
  // 3 T&C checkboxes
  const [agreedDetails, setAgreedDetails] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedLocking, setAgreedLocking] = useState(false);

  // Payment method selection
  const [payMethod, setPayMethod] = useState<'card' | 'upi'>('card');
  const [cardNo, setCardNo] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');

  const allAgreed = agreedDetails && agreedTerms && agreedLocking;

  const isFormValid = () => {
    return allAgreed;
  };

  const handleCardNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces: XXXX XXXX XXXX XXXX
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNo(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format expiry: MM/YY
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-8 text-left max-w-4xl mx-auto shadow-2xl space-y-6 font-sans cv-review-card">
      <style dangerouslySetInnerHTML={{__html: `
        .cv-review-card {
          background-color: #ffffff !important;
          border-color: #e2e8f0 !important;
          color: #334155 !important;
        }
        .cv-review-card h2, 
        .cv-review-card h3, 
        .cv-review-card h4 {
          color: #0B1A30 !important;
        }
        .cv-review-card span.text-white {
          color: #0F172A !important;
        }
        .cv-review-card .bg-slate-950 {
          background-color: #f8fafc !important;
          border-color: #e2e8f0 !important;
        }
        .cv-review-card .border-slate-850, 
        .cv-review-card .border-slate-900, 
        .cv-review-card .border-slate-800 {
          border-color: #e2e8f0 !important;
        }
        .cv-review-card input {
          background-color: #ffffff !important;
          border-color: #cbd5e1 !important;
          color: #0F172A !important;
        }
        .cv-review-card input:focus {
          border-color: #D4AF37 !important;
          box-shadow: 0 0 0 1px #D4AF37 !important;
        }
        .cv-review-card p {
          color: #64748b !important;
        }
        .cv-review-card label {
          color: #334155 !important;
        }
        .cv-review-card .text-slate-300 {
          color: #475569 !important;
        }
        .cv-review-card .text-slate-400 {
          color: #64748b !important;
        }
        .cv-review-card .bg-slate-900 {
          background-color: #f1f5f9 !important;
        }
      `}} />
      
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-gold-500 uppercase tracking-widest flex items-center gap-1 font-display">
            Step 3 of 3 • Secure Checkout
          </span>
          <h2 className="text-2xl font-black text-white mt-1 uppercase tracking-tight">
            Review & Unlock Premium CV
          </h2>
          <p className="text-slate-400 text-xs">Verify details, agree to terms, and complete simulated payment.</p>
        </div>
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:border-[#D4AF37] rounded-xl text-xs font-bold transition-all text-slate-700 bg-slate-50 hover:bg-slate-100 font-sans shrink-0 shadow-sm"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Order Summary & T&C Checklist (col-span-6) */}
        <div className="md:col-span-6 space-y-6">
          
          {/* Order Summary Card */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Summary</h3>
            <div className="flex justify-between items-center border-b border-slate-900 pb-2">
              <div>
                <span className="font-bold text-white text-sm">
                  {cv.paymentStatus === 'Paid' ? 'Cricket CV 5-Edit Renewal' : 'Professional Cricket CV'}
                </span>
                <p className="text-[10px] text-slate-500 mt-0.5">Template: {cv.templateId.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 line-through">₹1,499</span>
                <span className="font-black text-gold-400 text-base block">₹249</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 space-y-1">
              <div>• Unlimited PDF downloads</div>
              <div>• 5 profile edits allowed per year</div>
            </div>
          </div>

          {/* Guidelines Warnings */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-3 text-xs text-yellow-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Identity Verification Lock</span>
              <p className="text-slate-400 mt-1 leading-relaxed">
                To prevent account sharing and maintain credibility, your core identity fields (Name, Date of Birth, Nationality) will be permanently locked on the CV sheet after purchase.
              </p>
            </div>
          </div>

          {/* Terms & Conditions Checkboxes */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Terms & Conditions Consent</h3>
            
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={agreedDetails}
                  onChange={(e) => setAgreedDetails(e.target.checked)}
                  className="w-4 h-4 text-gold-500 rounded border-slate-850 bg-slate-900 mt-0.5 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-[11px] text-slate-300 leading-relaxed">
                  I confirm that all playing statistics, personal information and cricket history provided in this form are accurate and truthful to the best of my knowledge.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="w-4 h-4 text-gold-500 rounded border-slate-850 bg-slate-900 mt-0.5 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-[11px] text-slate-300 leading-relaxed">
                  I agree to The Cricket Advisor Terms of Service and Privacy Policy, including no-refund digital delivery.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={agreedLocking}
                  onChange={(e) => setAgreedLocking(e.target.checked)}
                  className="w-4 h-4 text-gold-500 rounded border-slate-850 bg-slate-900 mt-0.5 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-[11px] text-slate-300 leading-relaxed text-yellow-500/90">
                  I understand that my Full Name, Nationality, and Date of Birth will be locked for future modifications once this CV is activated.
                </span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Payment Gateway Simulation (col-span-6) */}
        <div className="md:col-span-6 space-y-6 bg-slate-950 p-5 rounded-2xl border border-slate-850">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2">
            <Lock className="w-3.5 h-3.5 text-green-500" /> Secure Payment Gateway
          </h3>

          <p className="text-xs text-slate-450 leading-relaxed font-sans">
            Press the button below to initiate secure checkout simulation. You will be redirected back to the player dashboard once completed successfully.
          </p>

          {/* Secure indicator */}
          <div className="flex items-center gap-1.5 text-[9px] text-slate-500 pt-2 border-t border-slate-900">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500/80" /> Razorpay Secured 256-bit Encrypted Transaction
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <button 
              disabled={!isFormValid()}
              onClick={() => onPay(false)}
              className="w-full py-3.5 rounded-xl font-black bg-gold-gradient text-navy-950 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 text-xs cursor-pointer shadow-md shadow-gold-500/10 uppercase"
            >
              <Wallet className="w-4 h-4" /> {cv.paymentStatus === 'Paid' ? 'RENEW PLAN ₹249' : 'PAY ₹249 SECURELY'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
