import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface CVEmailVerificationProps {
  token: string;
  onVerified: () => void;
  onClose: () => void;
}

export default function CVEmailVerification({ token, onVerified, onClose }: CVEmailVerificationProps) {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/cv-verify-email?token=${token}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Verification failed. Token may be expired.');
        }

        setStatus('success');
        setTimeout(() => {
          onVerified();
        }, 2000);
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-sm mx-auto text-center shadow-2xl space-y-6 cv-email-verify-card">
      <style dangerouslySetInnerHTML={{__html: `
        .cv-email-verify-card {
          background-color: #ffffff !important;
          border-color: #e2e8f0 !important;
          color: #334155 !important;
        }
        .cv-email-verify-card h2 {
          color: #0B1A30 !important;
        }
        .cv-email-verify-card p.text-slate-400 {
          color: #64748b !important;
        }
        .cv-email-verify-card button.bg-slate-850 {
          background-color: #f1f5f9 !important;
          border-color: #cbd5e1 !important;
          color: #475569 !important;
        }
        .cv-email-verify-card button.bg-slate-850:hover {
          background-color: #e2e8f0 !important;
          color: #0F172A !important;
        }
      `}} />
      {status === 'verifying' && (
        <div className="space-y-4 py-6">
          <Loader2 className="w-12 h-12 text-gold-400 animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-white">Verifying Email...</h2>
          <p className="text-slate-400 text-xs">Completing account activation securely.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-4 py-6">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Account Verified!</h2>
          <p className="text-slate-400 text-xs">Redirecting to your dashboard shortly...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4 py-6">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Verification Failed</h2>
          <p className="text-slate-400 text-xs mb-4">{errorMessage}</p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-850 transition text-xs font-bold"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
}
