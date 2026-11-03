import React, { useState } from 'react';
import { MembershipPlan } from '../types';
import { useApp } from '../context/AppContext';
import { formatCurrencyINR } from '../utils/rules';
import { X, QrCode, Upload, CheckCircle2, Copy, Sparkles, AlertCircle } from 'lucide-react';

interface QrPaymentModalProps {
  plan: MembershipPlan | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const QrPaymentModal: React.FC<QrPaymentModalProps> = ({ plan, onClose, onSuccess }) => {
  const { websiteContent, currentUser, submitPaymentRequest, showToast } = useApp();

  const [transactionId, setTransactionId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!plan) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(websiteContent.paymentQR.upiId);
    showToast(`UPI ID ${websiteContent.paymentQR.upiId} copied to clipboard!`, 'info');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image receipt (PNG or JPG).');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setScreenshotUrl(event.target?.result as string);
      setIsUploading(false);
      setError(null);
    };
    reader.onerror = () => {
      setError('Error reading file. Please try again.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUseDemoSample = () => {
    setTransactionId(`UPI${Math.floor(10000000000 + Math.random() * 90000000000)}`);
    setScreenshotUrl('/images/sample_qr.jpg');
    setError(null);
    showToast('Loaded realistic sample UTR and receipt screenshot', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.type !== 'member') {
      setError('You must be logged in as a registered member to submit a payment.');
      return;
    }

    if (!transactionId.trim() || transactionId.trim().length < 6) {
      setError('Please provide a valid 12-digit UPI / UTR Transaction ID.');
      return;
    }

    const proof = screenshotUrl || '/images/sample_qr.jpg';

    const success = submitPaymentRequest({
      memberId: currentUser.member.id,
      planId: plan.id,
      transactionId: transactionId.trim(),
      screenshotUrl: proof,
    });

    if (success) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-payment-modal-title"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFDF9] text-[#2D2424] max-w-2xl w-full rounded-2xl shadow-2xl border border-[#D4AF37]/40 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#8B1D2C] text-white p-5 flex items-center justify-between border-b border-[#D4AF37]/30">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#D4AF37]">
              Step 3 of 5 · QR UPI Payment Simulation
            </span>
            <h2 id="qr-payment-modal-title" className="text-xl font-brand font-bold text-white">
              Activate {plan.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close payment modal"
            className="text-white/70 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Plan Summary Bar */}
          <div className="bg-[#FAF5EE] p-4 rounded-xl border border-[#E8DEC8] flex items-center justify-between">
            <div>
              <div className="text-xs text-[#7A6B6A]">Selected Membership Tier</div>
              <div className="text-base font-bold text-[#8B1D2C]">{plan.name}</div>
              <div className="text-xs text-slate-600">{plan.durationLabel} unhindered access</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[#7A6B6A]">Payable Amount</div>
              <div className="text-2xl font-bold font-mono text-[#8B1D2C]">
                {formatCurrencyINR(plan.price)}
              </div>
            </div>
          </div>

          {/* QR Code and Instructions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* QR Card */}
            <div className="bg-white p-4 rounded-xl border border-[#D4AF37]/40 shadow-sm flex flex-col items-center text-center">
              <div className="text-xs font-semibold text-[#8B1D2C] mb-2 uppercase tracking-wide">
                Official Scan & Pay QR
              </div>

              <div className="w-48 h-48 rounded-lg overflow-hidden border border-[#E8DEC8] bg-[#FAF5EE] p-2 flex items-center justify-center">
                <img
                  src={websiteContent.paymentQR.qrImageUrl || '/images/sample_qr.jpg'}
                  alt="UPI QR Code"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/images/sample_qr.jpg';
                  }}
                />
              </div>

              <div className="mt-3 text-xs w-full bg-[#FAF5EE] p-2 rounded-lg border border-[#E8DEC8]">
                <div className="text-[11px] text-[#7A6B6A]">Virtual Payment Address (VPA)</div>
                <div className="flex items-center justify-center gap-1.5 font-mono font-semibold text-[#8B1D2C] mt-0.5">
                  <span>{websiteContent.paymentQR.upiId}</span>
                  <button
                    onClick={handleCopyUpi}
                    className="p-1 hover:text-[#2D2424]"
                    title="Copy UPI ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 mt-1">
                Accepted: Google Pay · PhonePe · Paytm · BHIM · Any Bank UPI
              </div>
            </div>

            {/* Step-by-step Instructions */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8B1D2C]">
                Payment Instructions:
              </h4>
              <ol className="text-xs space-y-2 text-[#4A3E3D]">
                {websiteContent.paymentQR.instructions.map((inst, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#8B1D2C] text-[#D4AF37] text-[11px] font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{inst}</span>
                  </li>
                ))}
              </ol>

              {/* Demo Helper Pill */}
              <div className="bg-[#FAF5EE] p-3 rounded-lg border border-[#D4AF37]/40 text-xs text-[#5C4D4C]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-[#8B1D2C] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Fast Client Presentation
                  </span>
                  <button
                    type="button"
                    onClick={handleUseDemoSample}
                    className="text-[11px] font-semibold text-[#8B1D2C] hover:underline"
                  >
                    Auto-Fill Sample UTR & Receipt
                  </button>
                </div>
                <p className="text-[11px] text-slate-600">
                  Click above to immediately simulate a real receipt and 12-digit UTR without taking a manual screenshot.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-[#E8DEC8]">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#2D2424] mb-1">
                UPI / Bank Reference Number (UTR / Transaction ID) *
              </label>
              <input
                type="text"
                required
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g., 431098223401 or UPI93821049281"
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-lg border border-[#D4AF37]/50 focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
              />
              <span className="text-[11px] text-[#7A6B6A] mt-1 block">
                Found on your UPI confirmation receipt (12 alphanumeric digits).
              </span>
            </div>

            {/* Screenshot Upload */}
            <div>
              <label className="block text-xs font-semibold text-[#2D2424] mb-1">
                Upload Payment Screenshot *
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="cursor-pointer px-4 py-2 text-xs font-semibold rounded-lg border border-[#8B1D2C] text-[#8B1D2C] hover:bg-[#8B1D2C] hover:text-white transition-colors flex items-center gap-2 shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>Choose Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <span className="text-xs text-[#7A6B6A]">or use the auto-fill sample button above</span>
              </div>

              {/* Preview */}
              {screenshotUrl && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-[#E8DEC8] flex items-center gap-3">
                  <img
                    src={screenshotUrl}
                    alt="Payment receipt preview"
                    className="w-14 h-14 object-cover rounded border"
                  />
                  <div className="flex-1 text-xs">
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Screenshot Attached
                    </span>
                    <span className="text-slate-500 text-[11px] block mt-0.5">
                      Ready for rapid administrator verification.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setScreenshotUrl('')}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#6B5E5D] hover:text-[#8B1D2C]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold rounded-lg bg-[#8B1D2C] text-white hover:bg-[#721522] shadow transition-all flex items-center gap-2"
              >
                <span>Submit Payment Request</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
