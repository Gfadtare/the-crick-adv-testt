import React from 'react';
import { CheckCircle2, Receipt, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { CricketCVFull } from './CVTypes';

interface CVPaymentSuccessProps {
  cv: CricketCVFull;
  onNext: () => void;
}

export default function CVPaymentSuccess({ cv, onNext }: CVPaymentSuccessProps) {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-left max-w-lg mx-auto shadow-2xl space-y-6 font-sans print-receipt-container">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #header, #footer, .fixed, button, .no-print {
            display: none !important;
          }
          .print-receipt-container, .print-receipt-container * {
            visibility: visible;
          }
          .print-receipt-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-receipt-container h2, 
          .print-receipt-container h3, 
          .print-receipt-container span, 
          .print-receipt-container p,
          .print-receipt-container td,
          .print-receipt-container div {
            color: black !important;
          }
          .print-receipt-container div.bg-slate-950 {
            border-color: #cbd5e1 !important;
            background-color: #f1f5f9 !important;
          }
        }
        @media screen {
          .print-receipt-container {
            background-color: #ffffff !important;
            border-color: #e2e8f0 !important;
            color: #334155 !important;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05) !important;
          }
          .print-receipt-container h2 {
            color: #0B1A30 !important;
          }
          .print-receipt-container p.text-slate-400 {
            color: #64748b !important;
          }
          .print-receipt-container .bg-slate-950 {
            background-color: #f8fafc !important;
            border-color: #e2e8f0 !important;
          }
          .print-receipt-container .bg-slate-950 h3 {
            color: #0B1A30 !important;
          }
          .print-receipt-container .border-slate-850,
          .print-receipt-container .border-slate-900 {
            border-color: #e2e8f0 !important;
          }
          .print-receipt-container span.text-white {
            color: #0F172A !important;
          }
          .print-receipt-container span.text-slate-400 {
            color: #64748b !important;
          }
          .print-receipt-container .bg-slate-950\/40 {
            background-color: #f8fafc !important;
            border-color: #e2e8f0 !important;
          }
          .print-receipt-container .bg-slate-950\/40 span {
            color: #0B1A30 !important;
          }
          .print-receipt-container .bg-slate-950\/40 p {
            color: #64748b !important;
          }
        }
      `}} />
      
      {/* Animated Success Banner */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 py-4">
        <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight uppercase font-display">
          Payment Successful!
        </h2>
        <p className="text-slate-400 text-xs max-w-sm">
          Your payment has been verified. Your premium Cricket CV has been unlocked!
        </p>
      </div>

      {/* Invoice Box */}
      <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-900 pb-2">
          <Receipt className="w-3.5 h-3.5 text-gold-500" /> Invoice Receipt Details
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Invoice No:</span>
            <span className="text-white font-mono font-semibold">
              {cv.latestInvoiceNumber || `INV-${cv.referenceNumber || 'TCA-9999'}`}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Date:</span>
            <span className="text-white font-semibold">{currentDate}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Product:</span>
            <span className="text-white font-semibold">Premium Cricket CV Package</span>
          </div>
          <div className="flex justify-between items-center text-slate-400 border-t border-slate-900 pt-2.5">
            <span>Amount Paid:</span>
            <span className="text-gold-400 font-bold text-sm">₹249</span>
          </div>
        </div>
      </div>

      {/* Info notification */}
      <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 flex items-start gap-3">
        <Mail className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <span className="font-bold text-white block">Email Confirmation Sent</span>
          <p className="text-slate-400 leading-relaxed">
            A copy of this invoice has been sent to your registered email address <strong className="no-capitalize">{cv.email}</strong>.
          </p>
        </div>
      </div>

      {/* Security assurances */}
      <div className="flex justify-center items-center gap-1 text-[10px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-green-500/80" /> Account upgraded • Identity profile locked
      </div>

      {/* CTA Buttons */}
      <div className="pt-2 flex gap-3 no-print">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 py-3.5 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer font-sans"
        >
          <Receipt className="w-4 h-4 text-gold-400" /> Print Receipt
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3.5 bg-gold-gradient text-navy-950 font-black rounded-xl text-xs hover:shadow-lg hover:shadow-gold-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer font-sans uppercase"
        >
          View Clean CV <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
