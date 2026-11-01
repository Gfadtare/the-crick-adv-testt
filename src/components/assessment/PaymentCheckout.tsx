import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Loader2,
  User,
  Award,
  Sparkles,
  ArrowRight,
  Receipt,
  PhoneCall,
  ChevronRight,
  Check,
} from 'lucide-react';
import { SubmissionData, TestMode } from './types';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

interface PaymentCheckoutProps {
  submission: SubmissionData;
  onPaymentSuccess: (updatedSubmission: SubmissionData) => void;
  onBackToEdit: () => void;
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  submission,
  onPaymentSuccess,
  onBackToEdit,
}) => {
  const [checkoutMode, setCheckoutMode] = useState<TestMode | null>(submission.testMode || null);
  const [disclaimers, setDisclaimers] = useState({
    confirmDetails: false,
    agreeRules: false,
    acceptTerms: false
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<{
    txId: string;
    amount: number;
    method: string;
    paidAt: string;
  } | null>(null);

  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false);

  const handleDownloadReceipt = async () => {
    const receiptElement = document.getElementById('skills-assessment-receipt-card');
    if (!receiptElement) {
      alert("Receipt element not found.");
      return;
    }
    
    setIsDownloadingReceipt(true);
    let clone: HTMLElement | null = null;
    try {
      // Clone the receipt element to render a standard desktop layout offscreen
      clone = receiptElement.cloneNode(true) as HTMLElement;
      clone.style.width = '650px';
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '-9999px';
      clone.style.backgroundColor = '#ffffff';
      
      // Force 2 columns grid layout for a clean layout inside PDF
      const gridContainer = clone.querySelector('.grid');
      if (gridContainer) {
        gridContainer.classList.remove('grid-cols-1', 'md:grid-cols-2');
        gridContainer.classList.add('grid-cols-2');
      }
      
      // Force specialization element to span across columns
      const colSpans = clone.querySelectorAll('.md\\:col-span-2, .col-span-1');
      colSpans.forEach(el => {
        if (el.classList.contains('md:col-span-2')) {
          el.classList.remove('md:col-span-2');
          el.classList.add('col-span-2');
        }
      });

      document.body.appendChild(clone);
      
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = pdfWidth - 30; // 15mm margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.setFillColor(248, 250, 252);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
      
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(11, 26, 48);
      pdf.text("THE CRICKET ADVISOR", 15, 20);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139);
      pdf.text("Official Skills Certification Receipt", 15, 25);
      
      const todayStr = new Date().toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      pdf.text(`Printed On: ${todayStr}`, pdfWidth - 15 - 55, 25);
      
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.5);
      pdf.line(15, 28, pdfWidth - 15, 28);
      
      pdf.addImage(imgData, 'JPEG', 15, 35, imgWidth, imgHeight);
      
      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184);
      pdf.text("Thank you for registering for the Skills Certification Assessment.", 15, 35 + imgHeight + 15);
      pdf.text("Please keep this document safe for scheduling.", 15, 35 + imgHeight + 19);
      
      pdf.save(`Receipt_Skills_Assessment_${submission.id}.pdf`);
    } catch (err) {
      console.error('Error generating receipt PDF:', err);
      alert('Failed to generate receipt PDF. Please screenshot this page instead.');
    } finally {
      if (clone && clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
      setIsDownloadingReceipt(false);
    }
  };

  const amount = checkoutMode === 'Online' ? 11999 : 17999;

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

  const handlePayMode = async (mode: TestMode, amt: number) => {
    setIsProcessing(true);

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
    const isMockKey = !razorpayKeyId || razorpayKeyId.startsWith('your_') || razorpayKeyId === 'MY_GEMINI_API_KEY';

    if (isMockKey) {
      console.log('Using simulated checkout for ' + mode);
      await handleSimulateSuccessMode(mode, amt);
      return;
    }

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Failed to load Razorpay payment SDK. Please check your internet connection.');
        setIsProcessing(false);
        return;
      }

      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amt }),
      });

      if (!res.ok) {
        throw new Error('Failed to create payment order from server');
      }

      const orderData = await res.json();
      if (!orderData.id) {
        throw new Error('Order creation did not return a valid order ID');
      }

      const options = {
        key: razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'The Cricket Advisor',
        description: 'Cricket Skills Certification Test',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            setIsProcessing(true);
            const verifyRes = await fetch('/api/verify-skills-assessment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                assessment: {
                  ...submission,
                  testMode: mode,
                  amountPaid: amt
                }
              })
            });

            if (verifyRes.ok) {
              const verifyData = await verifyRes.json();
              const paidAtStr = new Date().toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });

              const updatedSubmission: SubmissionData = {
                ...submission,
                testMode: mode,
                id: verifyData.referenceNumber || submission.id,
                paymentDetails: {
                  transactionId: response.razorpay_payment_id,
                  amount: amt,
                  currency: 'INR',
                  paymentMethod: 'Razorpay Secure Checkout',
                  paidAt: paidAtStr,
                },
              };

              setTransactionDetails({
                txId: response.razorpay_payment_id,
                amount: amt,
                method: 'RAZORPAY',
                paidAt: paidAtStr,
              });
              setIsProcessing(false);
              setPaymentComplete(true);
              onPaymentSuccess(updatedSubmission);
            } else {
              const errData = await verifyRes.json();
              alert(`Payment verification failed: ${errData.error || 'Unknown error'}`);
              setIsProcessing(false);
            }
          } catch (err: any) {
            console.error('Verification failed:', err);
            alert(`Verification error: ${err.message}`);
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${submission.firstName || ''} ${submission.lastName || ''}`,
          email: submission.email || '',
          contact: submission.mobileNumber || ''
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
      console.error('Razorpay initialization failed:', err);
      alert(`Payment failed to initialize: ${err.message}`);
      setIsProcessing(false);
    }
  };

  const handleSimulateSuccessMode = async (mode: TestMode, amt: number) => {
    setIsProcessing(true);
    try {
      const mockTxId = `TXN-MOCK-${Date.now().toString().slice(-8)}`;
      const verifyRes = await fetch('/api/verify-skills-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: 'order_mock_' + Date.now(),
          razorpay_payment_id: 'test_payment_id',
          razorpay_signature: 'mock_signature',
          assessment: {
            ...submission,
            testMode: mode,
            amountPaid: amt
          }
        })
      });

      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        const paidAtStr = new Date().toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
        const updatedSubmission: SubmissionData = {
          ...submission,
          testMode: mode,
          id: verifyData.referenceNumber || submission.id,
          paymentDetails: {
            transactionId: mockTxId,
            amount: amt,
            currency: 'INR',
            paymentMethod: 'Simulated Payment',
            paidAt: paidAtStr,
          },
        };

        setTransactionDetails({
          txId: mockTxId,
          amount: amt,
          method: 'SIMULATED',
          paidAt: paidAtStr,
        });

        setIsProcessing(false);
        setPaymentComplete(true);
        onPaymentSuccess(updatedSubmission);
      } else {
        alert('Simulation failed during server verification.');
        setIsProcessing(false);
      }
    } catch (err: any) {
      console.error('Error during simulated checkout:', err);
      alert('Error during simulated checkout: ' + err.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-6">
      <AnimatePresence mode="wait">
        {!paymentComplete ? (
          <motion.div
            key="checkout-step"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-2xl shadow-2xl border-2 border-slate-300 overflow-hidden"
          >
            {/* Header: The Cricket Advisor Navy Blue & Gold Theme */}
            <div className="bg-[#0B1A30] text-white p-6 md:p-8 border-b-4 border-amber-500">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-amber-300 font-extrabold mb-2">
                <ShieldCheck size={18} className="text-amber-400" />
                <span>The Cricket Advisor • Registration Payment Gateway</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Proceed for Payment
              </h2>
              <p className="text-slate-300 text-xs md:text-sm mt-1">
                Your candidate registration details have been validated. Please select your payment method to confirm your test slot.
              </p>
            </div>

            <div className="p-6 md:p-8 space-y-8 bg-slate-50/50">
              {/* Candidate Quick Summary Box with 2px borders */}
              <div className="bg-white border-2 border-slate-300 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-wider">
                    <User size={16} className="text-blue-600" /> Registered Candidate Summary
                  </div>
                  <div className="text-lg md:text-xl font-black text-[#0B1A30]">
                    {submission.firstName} {submission.lastName}{' '}
                    <span className="text-xs font-bold text-slate-500">
                      (Age: {submission.age} Yrs • Nationality: {submission.nationality})
                    </span>
                  </div>
                  <div className="text-xs md:text-sm text-blue-900 font-bold">
                    Role: <span className="text-[#0B1A30] underline">{submission.playingRole}</span> • Specialty: <span className="text-slate-700">{submission.subRole}</span>
                  </div>
                </div>

                <button
                  onClick={onBackToEdit}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-blue-900 font-extrabold text-xs rounded-xl transition cursor-pointer self-start md:self-center"
                >
                  Edit Registration Form
                </button>
              </div>

              {checkoutMode === null ? (
                /* Assessment Test Format Options */
                <div className="space-y-3">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Select Assessment Test Format & Fee <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Online Option */}
                    <div
                      className={`p-6 rounded-2xl border-2 transition relative flex flex-col justify-between bg-white border-black/20`}
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-[#0B1A30] font-black text-lg mb-1">
                            <Sparkles size={20} className="text-blue-600" />
                            Online Video Assessment
                          </div>
                          <p className="text-xs mb-6 leading-relaxed font-bold text-center text-blue-900 bg-blue-50/60 px-3 py-2.5 rounded-xl border border-blue-100">
                            Showcase Your Cricket Through Videos. Get Expertly Assessed. Unlock Your Potential.<br />
                            Professional evaluation by a BCCI Level 3 & ECB Level 1 Qualified Coach
                          </p>

                          <div className="text-left space-y-2 mb-6 text-sm font-medium text-slate-700 pt-2 border-t border-slate-100">
                            <span className="font-extrabold text-xs block text-blue-900 mb-2">On-line Features:</span>
                            <div className="grid grid-cols-1 gap-3">
                              {[
                                'Video-Based Skill Assessment',
                                'Batting Technique Assessment',
                                'Bowling Technique Assessment',
                                'Fielding Skills Assessment',
                                'Wicketkeeping Assessment (Where Applicable)',
                                'Technical Strengths & Weaknesses Analysis',
                                'Expert Coach Evaluation by BCCI Level 3 & ECB Level 1 Qualified Coach',
                                'Professional Skill Rating Score',
                                'Player Strengths & Development Areas',
                                'Overseas Club Suitability Assessment',
                                'Personalised Digital Assessment Report',
                                'Official Digital Cricket Skills Certificate'
                              ].map((feat, idx) => (
                                <div key={idx} className="flex items-start gap-2 font-normal">
                                  <Check size={14} className="text-emerald-600 shrink-0 mt-1" />
                                  <span>{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Pay Button at the bottom */}
                        <div className="pt-4 flex flex-col items-center justify-center gap-3 border-t border-slate-100 mt-auto">
                          <button
                            type="button"
                            onClick={() => setCheckoutMode('Online')}
                            className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition shadow-md hover:scale-105 cursor-pointer text-center text-sm border border-emerald-400"
                          >
                            Pay ₹11,999 INR
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Offline Option */}
                    <div
                      className={`p-6 rounded-2xl border-2 transition relative flex flex-col justify-between bg-white border-black/20`}
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-[#0B1A30] font-black text-lg mb-1">
                            <Award size={20} className="text-amber-500" />
                            Offline On-Ground Assessment
                          </div>
                          <p className="text-xs mb-6 leading-relaxed font-bold text-center text-amber-900 bg-amber-50/50 px-3 py-2.5 rounded-xl border border-amber-200">
                            Showcase Your Cricket Skills Live. Get Assessed by Expert Coaches.<br />
                            On-ground performance evaluation by BCCI Level 3 & ECB Level 1 Qualified Coaches.
                          </p>

                          <div className="text-left space-y-2 mb-6 text-sm font-medium text-slate-700 pt-2 border-t border-slate-100">
                            <span className="font-extrabold text-xs block text-[#0B1A30] mb-2">Off-Line Features</span>
                            <div className="grid grid-cols-1 gap-3">
                              {[
                                'Live Batting Assessment',
                                'Live Bowling Assessment',
                                'Live Fielding Assessment',
                                'Wicketkeeping Assessment (Where Applicable)',
                                'Batting Technique & Shot Execution',
                                'Bowling Accuracy, Pace/Spin & Variations',
                                'Fielding Technique, Catching & Throwing',
                                'One-to-One Expert Coach Observation',
                                'Expert Coach Evaluation by BCCI Level 3 & ECB Level 1 Qualified Coach',
                                'Technical Strengths & Weaknesses Analysis',
                                'Professional Skill Rating Score',
                                'Overseas Club Suitability Assessment',
                                'Expert Coach Assessment Report',
                                'Official Cricket Skills Certificate'
                              ].map((feat, idx) => (
                                <div key={idx} className="flex items-start gap-2 font-normal">
                                  <Check size={14} className="text-emerald-600 shrink-0 mt-1" />
                                  <span>{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Pay Button at the bottom with different premium gold gradient */}
                        <div className="pt-4 flex flex-col items-center justify-center gap-3 border-t border-slate-100 mt-auto">
                          <button
                            type="button"
                            onClick={() => setCheckoutMode('Offline')}
                            className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-500 text-white font-extrabold rounded-xl transition shadow-md hover:scale-105 cursor-pointer text-center text-sm border border-amber-400"
                          >
                            Pay ₹17,999 INR
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Secure Payment Gateway View with Disclaimers */
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white border border-black/20 rounded-2xl p-6 md:p-8 space-y-6 shadow-md"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  <div className="flex items-center justify-between border-b border-slate-150 pb-4">
                    <div className="flex items-center gap-2.5">
                      <Lock className="text-emerald-600" size={24} />
                      <div>
                        <h4 className="text-lg font-black text-[#0B1A30]">Secure Checkout Gateway</h4>
                        <p className="text-xs text-slate-500">256-bit Encrypted SSL Gateway • Official Certification Payment Portal</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCheckoutMode(null);
                        setDisclaimers({ confirmDetails: false, agreeRules: false, acceptTerms: false });
                      }}
                      className="px-4 py-2 border border-slate-350 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl transition cursor-pointer"
                    >
                      Change Package
                    </button>
                  </div>

                  {/* Payment Details Box */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Assessment Format</span>
                      <div className="text-base font-black text-[#0B1A30]">
                        {checkoutMode === 'Online' ? 'Online Video Assessment' : 'Offline On-Ground Assessment'}
                      </div>
                    </div>
                    <div className="space-y-1 md:text-right">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Amount Payable</span>
                      <div className="text-xl font-black text-emerald-600">
                        ₹{amount.toLocaleString('en-IN')} <span className="text-xs font-bold text-slate-500">INR</span>
                      </div>
                    </div>
                  </div>

                  {/* Disclaimer Section */}
                  <div className="space-y-4 pt-2">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      Required Payment Disclaimers <span className="text-red-500">*</span>
                    </h5>
                    
                    <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                      <label className="flex items-start gap-3 cursor-pointer select-none text-xs text-slate-700 font-medium">
                        <input
                          type="checkbox"
                          checked={disclaimers.confirmDetails}
                          onChange={(e) => setDisclaimers({ ...disclaimers, confirmDetails: e.target.checked })}
                          className="mt-0.5 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer"
                        />
                        <span>I confirm that all entered candidate profile information (name, age, country, and role details) is verified and accurate.</span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer select-none text-xs text-slate-700 font-medium">
                        <input
                          type="checkbox"
                          checked={disclaimers.agreeRules}
                          onChange={(e) => setDisclaimers({ ...disclaimers, agreeRules: e.target.checked })}
                          className="mt-0.5 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer"
                        />
                        <span>I understand and agree to follow the official cricket assessment rules, camera settings, and video submission/ground slot guidelines.</span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer select-none text-xs text-slate-700 font-medium">
                        <input
                          type="checkbox"
                          checked={disclaimers.acceptTerms}
                          onChange={(e) => setDisclaimers({ ...disclaimers, acceptTerms: e.target.checked })}
                          className="mt-0.5 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer"
                        />
                        <span>I accept the Terms of Service, Privacy Policy, and understand that registration fees are non-refundable once evaluation begins.</span>
                      </label>
                    </div>
                  </div>

                  {/* Payment Gateway Actions */}
                  <div className="pt-4 flex flex-col items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handlePayMode(checkoutMode!, amount)}
                      disabled={isProcessing || !disclaimers.confirmDetails || !disclaimers.agreeRules || !disclaimers.acceptTerms}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-black text-base rounded-xl transition flex items-center justify-center gap-2 shadow-md cursor-pointer border border-emerald-500"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={20} className="animate-spin text-white" />
                          <span>Processing Payment...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard size={20} />
                          <span>Pay ₹{amount.toLocaleString('en-IN')} with Razorpay</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          /* Payment Successful Banner & Exact Required Confirmation Message */
          <motion.div
            key="success-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl border-2 border-slate-300 overflow-hidden"
          >
            {/* Success Top Banner with Navy Blue & Gold Accents */}
            <div className="bg-[#0B1A30] text-white p-8 md:p-10 text-center relative border-b-4 border-amber-500">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 text-[#0B1A30] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl border-4 border-amber-300">
                <CheckCircle2 size={48} />
              </div>

              {/* Exact User Requested Success Message */}
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-white">
                You Payment is succesfull
              </h2>

              <div className="bg-blue-950/90 border-2 border-amber-400/50 rounded-2xl p-5 max-w-xl mx-auto my-4 text-amber-300 text-base md:text-lg font-black leading-relaxed shadow-lg">
                The Cricket Advisor Team Will Connect With You In The Next 3 To 5 Working Days
              </div>

              <p className="text-xs text-slate-300 mt-2 font-mono font-semibold">
                Transaction ID: {transactionDetails?.txId} • Paid Amount: ₹{transactionDetails?.amount.toLocaleString('en-IN')} INR
              </p>
            </div>

            {/* Receipt Details with 2px borders */}
            <div className="p-6 md:p-8 space-y-6 bg-slate-50/50">
              <div id="skills-assessment-receipt-card" className="bg-white border-2 border-slate-300 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Receipt size={18} className="text-blue-600" /> Official Test Receipt
                  </span>
                  <span className="text-xs font-mono font-extrabold text-blue-950 bg-blue-100 border border-blue-300 px-3 py-1 rounded-full">
                    STATUS: PAID & CONFIRMED
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">Candidate Name</span>
                    <span className="font-extrabold text-slate-900 text-base">
                      {submission.firstName} {submission.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">Registration Assessment ID</span>
                    <span className="font-bold font-mono text-blue-900">{submission.id}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">Chosen Test Format</span>
                    <span className="font-bold text-slate-900">{checkoutMode || submission.testMode} Test</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">Registered Playing Role</span>
                    <span className="font-bold text-slate-900">{submission.playingRole}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-xs text-slate-500 font-bold block">Certified Technique / Specialization</span>
                    <span className="font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border-2 border-slate-200 block text-xs md:text-sm mt-1">
                      {submission.subRole}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">Mobile Contact</span>
                    <span className="font-bold text-slate-900 font-mono">
                      {submission.mobileCountryCode} {submission.mobileNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">Email ID</span>
                    <span className="font-bold text-slate-900 truncate block">{submission.email}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">Amount Paid</span>
                    <span className="font-extrabold text-emerald-700 font-display text-base">
                      ₹{(transactionDetails?.amount || amount).toLocaleString('en-IN')} INR
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold block">Payment Method</span>
                    <span className="font-bold text-slate-900">
                      {transactionDetails?.method || 'Razorpay Secure Checkout'}
                    </span>
                  </div>
                </div>
              </div>

               {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleDownloadReceipt}
                  disabled={isDownloadingReceipt}
                  className="flex-1 py-3.5 px-6 bg-[#0B1A30] hover:bg-slate-900 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs md:text-sm cursor-pointer border-2 border-[#0B1A30]"
                >
                  {isDownloadingReceipt ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Generating PDF Receipt...</span>
                    </>
                  ) : (
                    <>
                      <Receipt size={16} />
                      <span>Download & Print Receipt</span>
                    </>
                  )}
                </button>
              </div>

              {/* Advisory Note */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex items-start gap-4">
                <PhoneCall size={26} className="text-amber-700 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-950 space-y-1.5">
                  <p className="font-black text-base md:text-lg">Next Steps for Candidate:</p>
                  <p className="font-semibold text-slate-800 leading-relaxed">
                    Our senior certified Cricket Advisors will review your registered specialty and schedule your personalized video assessment slot or ground academy location. Please keep your phone and email active.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
