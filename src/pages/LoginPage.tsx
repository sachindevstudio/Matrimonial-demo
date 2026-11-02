import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserCheck, Sparkles, AlertCircle, ArrowRight, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginMember, loginAdmin, websiteContent } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'member' | 'admin'>('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = loginMember(email, password);
    if (success) {
      navigate('/member');
    } else {
      setError('Member credentials not recognized. You can click any demo account below.');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = loginAdmin(email, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid admin credentials. Please use admin@vivahsetu.demo / Admin123');
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass = 'Password123') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-[#FFFDF9] rounded-2xl shadow-xl border border-[#E8DEC8] overflow-hidden">
        {/* Banner */}
        <div className="bg-[#8B1D2C] text-white p-6 text-center border-b border-[#D4AF37]/40">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FAF5EE] text-[#8B1D2C] font-serif text-xl border border-[#D4AF37] mb-2">
            ॐ
          </div>
          <h1 className="text-2xl font-brand font-bold">
            {websiteContent.branding.siteName} Portal
          </h1>
          <p className="text-xs text-[#E8D8C8]/90 mt-1">
            Sign in to access matrimonial profiles and management
          </p>

          {/* Tab Switcher */}
          <div className="mt-4 p-1 bg-[#2E1018] rounded-xl grid grid-cols-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('member');
                setEmail('');
                setPassword('');
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'member'
                  ? 'bg-white text-[#8B1D2C] shadow'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Member Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setEmail('admin@vivahsetu.demo');
                setPassword('Admin123');
                setError(null);
              }}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'admin'
                  ? 'bg-[#D4AF37] text-slate-950 shadow'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Staff / Admin Console
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'member' ? (
            <form onSubmit={handleMemberSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D2424] mb-1">
                  Registered Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. pooja@demo.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#2D2424]">
                    Password *
                  </label>
                  <span className="text-[11px] text-[#7A6B6A]">Default: Password123</span>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-xs font-semibold rounded-xl bg-[#8B1D2C] text-white hover:bg-[#721522] shadow transition-colors flex items-center justify-center gap-2"
              >
                <span>Sign In as Member</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Demo Accounts List for Presentation */}
              <div className="pt-4 border-t border-[#E8DEC8]">
                <div className="text-xs font-semibold text-[#8B1D2C] flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Client Demo Accounts (1-Click Fill):</span>
                </div>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('pooja@demo.com')}
                    className="w-full p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#FAF5EE] border border-[#E8DEC8] text-left text-xs flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Pooja Verma</div>
                      <div className="text-[11px] text-emerald-700">Active Gold Member (Unlocked)</div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">pooja@demo.com</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoAccount('rahul@demo.com')}
                    className="w-full p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#FAF5EE] border border-[#E8DEC8] text-left text-xs flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Rahul Sharma</div>
                      <div className="text-[11px] text-amber-700">Payment Pending Verification</div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">rahul@demo.com</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoAccount('amit@demo.com')}
                    className="w-full p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#FAF5EE] border border-[#E8DEC8] text-left text-xs flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Amit Patel</div>
                      <div className="text-[11px] text-red-700">Expired Membership (Locked)</div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">amit@demo.com</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoAccount('priya@demo.com')}
                    className="w-full p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#FAF5EE] border border-[#E8DEC8] text-left text-xs flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">Priya Iyer</div>
                      <div className="text-[11px] text-slate-600">Fresh Registration (No Plan)</div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">priya@demo.com</span>
                  </button>
                </div>
              </div>

              <div className="text-center pt-2 text-xs text-[#6B5E5D]">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-[#8B1D2C] hover:underline">
                  Register Candidate Profile
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="bg-[#FAF5EE] p-3 rounded-xl border border-[#D4AF37]/50 text-xs text-[#4A3E3D] space-y-1">
                <div className="font-semibold text-[#8B1D2C] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Admin Demonstration Credentials:</span>
                </div>
                <div>Email: <strong className="font-mono text-slate-900">admin@vivahsetu.demo</strong></div>
                <div>Password: <strong className="font-mono text-slate-900">Admin123</strong></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2424] mb-1">
                  Administrator Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2424] mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-xs font-semibold rounded-xl bg-[#D4AF37] text-slate-950 hover:bg-[#C59B27] shadow transition-colors flex items-center justify-center gap-2 font-brand"
              >
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
