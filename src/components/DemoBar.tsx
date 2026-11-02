import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, ShieldCheck, UserCheck, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export const DemoBar: React.FC = () => {
  const { currentUser, quickSwitchUser, resetDemoData } = useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitch = (
    persona: 'visitor' | 'priya_none' | 'rahul_pending' | 'pooja_active' | 'amit_expired' | 'admin'
  ) => {
    quickSwitchUser(persona);
    if (persona === 'admin') {
      navigate('/admin');
    } else if (persona === 'visitor') {
      navigate('/');
    } else {
      navigate('/member');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to factory state? Any new registrations or payments will be reset.')) {
      resetDemoData();
      navigate('/');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-[#1A0B10] text-[#E8D8C8] border-b border-[#D4AF37]/30 text-xs shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-[#D4AF37] uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5" /> Demo Mode
          </span>
          <span className="hidden sm:inline text-white/40">|</span>
          <span className="hidden md:inline text-white/70">
            Current View:{' '}
            <strong className="text-white">
              {currentUser?.type === 'admin'
                ? 'Admin Console'
                : currentUser?.type === 'member'
                ? `${currentUser.member.fullName} (${currentUser.member.membershipStatus})`
                : 'Public Visitor'}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleSwitch('visitor')}
              className={`px-2 py-0.5 rounded transition-colors ${
                !currentUser ? 'bg-[#8B1D2C] text-white font-medium' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Public Visitor
            </button>
            <button
              onClick={() => handleSwitch('priya_none')}
              className={`px-2 py-0.5 rounded transition-colors ${
                currentUser?.type === 'member' && currentUser.member.email === 'priya@demo.com'
                  ? 'bg-[#8B1D2C] text-white font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Priya (New Member)
            </button>
            <button
              onClick={() => handleSwitch('rahul_pending')}
              className={`px-2 py-0.5 rounded transition-colors ${
                currentUser?.type === 'member' && currentUser.member.email === 'rahul@demo.com'
                  ? 'bg-[#8B1D2C] text-white font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Rahul (Pending Verification)
            </button>
            <button
              onClick={() => handleSwitch('pooja_active')}
              className={`px-2 py-0.5 rounded transition-colors ${
                currentUser?.type === 'member' && currentUser.member.email === 'pooja@demo.com'
                  ? 'bg-[#8B1D2C] text-white font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Pooja (Active Gold)
            </button>
            <button
              onClick={() => handleSwitch('amit_expired')}
              className={`px-2 py-0.5 rounded transition-colors ${
                currentUser?.type === 'member' && currentUser.member.email === 'amit@demo.com'
                  ? 'bg-[#8B1D2C] text-white font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Amit (Expired)
            </button>
            <button
              onClick={() => handleSwitch('admin')}
              className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors ${
                currentUser?.type === 'admin'
                  ? 'bg-[#D4AF37] text-slate-950 font-bold'
                  : 'text-[#D4AF37] hover:bg-[#D4AF37]/20'
              }`}
            >
              <ShieldCheck className="w-3 h-3" /> Admin
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden px-2 py-0.5 text-xs bg-white/10 rounded flex items-center gap-1 text-white hover:bg-white/20"
          >
            Switch Persona {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-white/60 hover:text-red-300 px-2 py-0.5 rounded hover:bg-white/10 transition-colors ml-1"
            title="Reset all demo data back to default initial values"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t border-white/10 px-4 py-2 bg-[#14080D] flex flex-wrap gap-1.5">
          <button
            onClick={() => { handleSwitch('visitor'); setIsOpen(false); }}
            className="px-2.5 py-1 text-xs rounded bg-white/10 text-white"
          >
            Visitor
          </button>
          <button
            onClick={() => { handleSwitch('priya_none'); setIsOpen(false); }}
            className="px-2.5 py-1 text-xs rounded bg-white/10 text-white"
          >
            Priya (New)
          </button>
          <button
            onClick={() => { handleSwitch('rahul_pending'); setIsOpen(false); }}
            className="px-2.5 py-1 text-xs rounded bg-white/10 text-white"
          >
            Rahul (Pending)
          </button>
          <button
            onClick={() => { handleSwitch('pooja_active'); setIsOpen(false); }}
            className="px-2.5 py-1 text-xs rounded bg-white/10 text-white"
          >
            Pooja (Active)
          </button>
          <button
            onClick={() => { handleSwitch('amit_expired'); setIsOpen(false); }}
            className="px-2.5 py-1 text-xs rounded bg-white/10 text-white"
          >
            Amit (Expired)
          </button>
          <button
            onClick={() => { handleSwitch('admin'); setIsOpen(false); }}
            className="px-2.5 py-1 text-xs rounded bg-[#D4AF37] text-slate-950 font-bold"
          >
            Admin Panel
          </button>
        </div>
      )}
    </div>
  );
};
