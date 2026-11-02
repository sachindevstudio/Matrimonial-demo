import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border transition-all transform translate-y-0 backdrop-blur-md ${
            toast.type === 'error'
              ? 'bg-[#4A0E17]/95 text-white border-red-500/30'
              : toast.type === 'info'
              ? 'bg-[#1E293B]/95 text-white border-slate-700'
              : 'bg-[#2E1018]/95 text-white border-[#D4AF37]/40'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          ) : toast.type === 'info' ? (
            <Info className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-sm leading-snug">{toast.message}</div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/60 hover:text-white p-1 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
