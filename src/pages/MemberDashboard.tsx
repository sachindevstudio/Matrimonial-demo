import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProfileCard } from '../components/ProfileCard';
import { QrPaymentModal } from '../components/QrPaymentModal';
import { MembershipPlan } from '../types';
import { formatCurrencyINR, isMembershipActive } from '../utils/rules';
import {
  LayoutDashboard,
  User,
  CreditCard,
  Users,
  Receipt,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Clock,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
} from 'lucide-react';

export const MemberDashboard: React.FC = () => {
  const {
    currentUser,
    logout,
    plans,
    profiles,
    paymentRequests,
    simulateActivate,
    simulateExpiry,
    websiteContent,
  } = useApp();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'plans' | 'browse' | 'payments'>('overview');
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<MembershipPlan | null>(null);

  // Filters for browse profiles
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'female' | 'male'>('all');
  const [filterCommunity, setFilterCommunity] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');

  if (!currentUser || currentUser.type !== 'member') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="bg-[#FFFDF9] p-8 rounded-2xl border border-[#E8DEC8] max-w-md w-full text-center shadow-lg">
          <ShieldAlert className="w-12 h-12 text-[#8B1D2C] mx-auto mb-3" />
          <h2 className="text-xl font-brand font-bold text-[#2D2424] mb-2">Member Session Required</h2>
          <p className="text-xs text-[#554746] mb-6">
            Please log in with a member account or register a new profile to access this dashboard.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/login"
              className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#8B1D2C] text-white hover:bg-[#721522]"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-xs font-semibold rounded-lg border border-[#8B1D2C] text-[#8B1D2C] hover:bg-white"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const member = currentUser.member;
  const isUnlocked = isMembershipActive(member);

  // Filtered profiles
  const filteredProfiles = profiles.filter((p) => {
    if (!p.isVisible) return false;
    if (filterGender !== 'all' && p.gender !== filterGender) return false;
    if (filterCommunity !== 'all' && p.community !== filterCommunity) return false;
    if (filterCity !== 'all' && !p.city.toLowerCase().includes(filterCity.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.fullName.toLowerCase().includes(q);
      const matchId = p.profileId.toLowerCase().includes(q);
      const matchOcc = p.occupation.toLowerCase().includes(q);
      const matchEdu = p.education.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchOcc && !matchEdu) return false;
    }
    return true;
  });

  const memberPayments = paymentRequests.filter((r) => r.memberId === member.id);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2424] flex flex-col md:flex-row pt-[29px]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#FFFDF9] border-r border-[#E8DEC8] flex flex-col justify-between shrink-0 shadow-sm">
        <div>
          {/* Brand header */}
          <div className="p-4 border-b border-[#E8DEC8] bg-[#FAF5EE]">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span className="w-7 h-7 rounded-full bg-[#8B1D2C] text-[#D4AF37] flex items-center justify-center text-sm font-serif border border-[#D4AF37]">
                ॐ
              </span>
              <div>
                <div className="text-base font-brand font-bold text-[#8B1D2C] leading-none">
                  {websiteContent.branding.siteName}
                </div>
                <div className="text-[10px] text-[#7A6B6A] uppercase tracking-wider font-semibold mt-0.5">
                  Member Portal
                </div>
              </div>
            </Link>
          </div>

          {/* Member Badge Header */}
          <div className="p-5 border-b border-[#E8DEC8] bg-white">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#8B1D2C]">
              <span>ID: {member.memberId}</span>
            </div>
            <h2 className="text-base font-brand font-bold text-[#2D2424] truncate mt-1">
              {member.fullName}
            </h2>
            <div className="text-xs text-[#7A6B6A] truncate">{member.email}</div>

            {/* Status Indicator */}
            <div className="mt-3">
              {member.membershipStatus === 'ACTIVE' ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Active Membership
                </div>
              ) : member.membershipStatus === 'PENDING' ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Verification Pending
                </div>
              ) : member.membershipStatus === 'EXPIRED' ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                  Membership Expired
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 text-slate-800 text-[11px] font-semibold">
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  No Active Plan
                </div>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'browse', label: 'Browse Profiles', icon: Users, badge: profiles.length },
              { id: 'plans', label: 'Membership Plans', icon: CreditCard },
              { id: 'profile', label: 'My Personal Profile', icon: User },
              { id: 'payments', label: 'Payment History', icon: Receipt, badge: memberPayments.length || undefined },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#8B1D2C] text-white shadow-sm'
                    : 'text-[#554746] hover:bg-[#FAF5EE] hover:text-[#8B1D2C]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <tab.icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#E8DEC8] text-slate-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Actions & Demo Simulation Bar */}
        <div className="p-4 border-t border-[#E8DEC8] space-y-3 bg-[#FAF5EE]/40">
          {/* Quick Demo Simulator helper */}
          <div className="p-2.5 rounded-xl bg-white border border-[#D4AF37]/50 text-[11px] space-y-1.5">
            <div className="font-semibold text-[#8B1D2C] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Demo State Simulators:
            </div>
            <div className="flex flex-col gap-1">
              {member.membershipStatus !== 'ACTIVE' ? (
                <button
                  onClick={() => simulateActivate(member.id)}
                  className="w-full py-1 text-center font-semibold rounded bg-emerald-700 text-white hover:bg-emerald-800"
                >
                  Simulate Admin Approval (Active)
                </button>
              ) : (
                <button
                  onClick={() => simulateExpiry(member.id)}
                  className="w-full py-1 text-center font-semibold rounded bg-red-700 text-white hover:bg-red-800"
                >
                  Simulate Expiration (State D)
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 text-xs font-medium text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Right Column: Dedicated Dashboard Top Bar + Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FAF7F2]">
        {/* Sleek App Dashboard Header */}
        <header className="h-14 bg-[#FFFDF9] border-b border-[#E8DEC8] px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-[29px] z-20 shadow-xs">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#8B1D2C]">Candidate Portal</span>
            <span className="text-[#8B1D2C]/40">/</span>
            <span className="font-semibold text-[#2D2424] capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-[#554746] hover:text-[#8B1D2C] hover:bg-[#FAF5EE] transition-colors border border-[#E8DEC8]"
            >
              <span>Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-[#E8DEC8]">
              <div className="w-8 h-8 rounded-full bg-[#8B1D2C] text-[#D4AF37] flex items-center justify-center font-bold text-xs border border-[#D4AF37]/50 shadow-xs">
                {member.fullName.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-[#2D2424] leading-none">{member.fullName}</div>
                <div className="text-[10px] text-[#7A6B6A] leading-none mt-1 font-mono">{member.memberId}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Workspace Viewport */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* VIEW 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Welcome Card */}
            <div className="bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl border border-[#E8DEC8] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B1D2C]">
                  Welcome to Your Candidate Portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-brand font-bold text-[#2D2424] mt-1">
                  Namaste, {member.fullName}
                </h1>
                <p className="text-xs text-[#554746] mt-1">
                  Member ID: <strong className="font-mono text-[#8B1D2C]">{member.memberId}</strong> · Registered {new Date(member.registeredAt).toLocaleDateString()}
                </p>
              </div>

              {/* Status Action Banner */}
              <div className="flex flex-wrap items-center gap-3">
                {member.membershipStatus === 'ACTIVE' ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Active: {member.selectedPlanName || 'Gold Bandhan'}
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-0.5">
                      Valid until: {member.membershipExpiresAt ? new Date(member.membershipExpiresAt).toLocaleDateString() : 'Active'}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-[#8B1D2C] text-white hover:bg-[#721522] shadow transition-colors flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Choose Membership Plan</span>
                  </button>
                )}
              </div>
            </div>

            {/* DYNAMIC STATE BANNER (STATE A / B / C / D) */}
            {member.membershipStatus === 'NONE' && (
              /* STATE A — No Membership */
              <div className="p-6 rounded-2xl bg-[#FFF5F5] border border-red-200 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-brand font-bold text-red-950">
                      STATE A: No Active Membership Subscribed
                    </h3>
                    <p className="text-xs text-red-800 mt-1 leading-relaxed">
                      Your matrimonial registration is complete! However, to protect privacy, all contact coordinates, WhatsApp numbers, and parental contact dossiers are locked. Select a membership plan and scan the UPI QR code to unlock all 12+ profiles.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="px-5 py-2 text-xs font-semibold bg-[#8B1D2C] text-white rounded-lg hover:bg-[#721522] transition-colors"
                  >
                    View 3 Membership Plans & QR
                  </button>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="px-4 py-2 text-xs font-medium border border-[#8B1D2C]/40 text-[#8B1D2C] rounded-lg hover:bg-white"
                  >
                    Preview Shielded Profiles
                  </button>
                </div>
              </div>
            )}

            {member.membershipStatus === 'PENDING' && (
              /* STATE B — Payment Pending */
              <div className="p-6 rounded-2xl bg-[#FFFBF0] border border-amber-300 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-brand font-bold text-amber-950">
                        STATE B: Payment Verification Pending
                      </h3>
                      <span className="text-[11px] font-mono bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded font-semibold">
                        Awaiting Admin Approval
                      </span>
                    </div>
                    <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                      We have received your payment submission for <strong className="font-semibold">{member.selectedPlanName}</strong> with Transaction Reference <strong className="font-mono">{member.lastTransactionId}</strong>. Our staff typically approves requests within 15-30 minutes.
                    </p>

                    <div className="mt-4 p-3 bg-white rounded-xl border border-amber-200 flex flex-wrap items-center gap-4 text-xs">
                      <div>
                        <span className="text-slate-500">Transaction ID:</span>{' '}
                        <strong className="font-mono text-slate-900">{member.lastTransactionId}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Submitted:</span>{' '}
                        <strong className="text-slate-900">
                          {member.lastPaymentSubmittedAt ? new Date(member.lastPaymentSubmittedAt).toLocaleTimeString() : 'Recently'}
                        </strong>
                      </div>
                      {member.paymentProofUrl && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Receipt Preview:</span>
                          <img
                            src={member.paymentProofUrl}
                            alt="Payment Receipt Preview"
                            className="w-8 h-8 rounded border object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Instant Approval Demo Trigger */}
                <div className="pt-2 flex items-center justify-between border-t border-amber-200/60">
                  <span className="text-[11px] text-amber-800">
                    Want to see how it unlocks immediately for the client?
                  </span>
                  <button
                    onClick={() => simulateActivate(member.id)}
                    className="px-4 py-1.5 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Instant Admin Approve (Client Demo)</span>
                  </button>
                </div>
              </div>
            )}

            {member.membershipStatus === 'ACTIVE' && (
              /* STATE C — Active Membership */
              <div className="p-6 rounded-2xl bg-[#F0FDF4] border border-emerald-300 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-brand font-bold text-emerald-950">
                      STATE C: Full Membership Active & Profiles Unlocked
                    </h3>
                    <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                      Congratulations! Your subscription has been verified by the administrator. All contact numbers, parental coordinates, and complete horoscope dossiers across all {profiles.length} profiles are now unlocked for you.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="px-5 py-2 text-xs font-semibold bg-emerald-800 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                  >
                    <Users className="w-4 h-4" />
                    <span>Browse Unlocked Matrimonial Matches</span>
                  </button>
                  <button
                    onClick={() => simulateExpiry(member.id)}
                    className="px-4 py-2 text-xs font-medium border border-red-400 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Simulate Expiry (State D Test)
                  </button>
                </div>
              </div>
            )}

            {member.membershipStatus === 'EXPIRED' && (
              /* STATE D — Expired Membership */
              <div className="p-6 rounded-2xl bg-[#FFF5F5] border border-red-300 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-800 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-brand font-bold text-red-950">
                      STATE D: Subscription Expired
                    </h3>
                    <p className="text-xs text-red-800 mt-1 leading-relaxed">
                      Your previous membership period has ended. Matrimonial profile contact details are locked again. Renew your membership to continue communicating with prospects.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="px-5 py-2 text-xs font-semibold bg-[#8B1D2C] text-white rounded-lg hover:bg-[#721522] transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Renew Membership Subscription</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Stat Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#FFFDF9] p-5 rounded-xl border border-[#E8DEC8] shadow-sm">
                <div className="text-xs text-[#7A6B6A]">Available Profiles</div>
                <div className="text-2xl font-bold font-mono text-[#8B1D2C] mt-1">{profiles.length}</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">Verified Candidates</div>
              </div>

              <div className="bg-[#FFFDF9] p-5 rounded-xl border border-[#E8DEC8] shadow-sm">
                <div className="text-xs text-[#7A6B6A]">Your Community</div>
                <div className="text-xl font-bold text-[#2D2424] mt-1">{member.community}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Matched preferences</div>
              </div>

              <div className="bg-[#FFFDF9] p-5 rounded-xl border border-[#E8DEC8] shadow-sm">
                <div className="text-xs text-[#7A6B6A]">Contact Privacy Status</div>
                <div className="text-base font-bold text-slate-900 mt-1">
                  {isUnlocked ? (
                    <span className="text-emerald-700">Fully Unlocked</span>
                  ) : (
                    <span className="text-amber-700">Protected / Locked</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {isUnlocked ? 'Direct calling enabled' : 'Plan required to call'}
                </div>
              </div>

              <div className="bg-[#FFFDF9] p-5 rounded-xl border border-[#E8DEC8] shadow-sm">
                <div className="text-xs text-[#7A6B6A]">Payment Records</div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{memberPayments.length}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Submitted UTRs</div>
              </div>
            </div>

            {/* Featured Matrimonial Prospects Strip */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-brand font-bold text-lg text-[#2D2424]">
                  Recommended Matches For You
                </h3>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="text-xs font-semibold text-[#8B1D2C] hover:underline flex items-center gap-1"
                >
                  View All ({profiles.length}) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.slice(0, 3).map((prof) => (
                  <ProfileCard
                    key={prof.id}
                    profile={prof}
                    isUnlocked={isUnlocked}
                    onUpgradeClick={() => setActiveTab('plans')}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: BROWSE PROFILES */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-brand font-bold text-[#2D2424]">
                  Browse Matrimonial Prospects
                </h1>
                <p className="text-xs text-[#554746] mt-0.5">
                  {isUnlocked
                    ? 'Your membership is active! Click any card to view contact coordinates and parental details.'
                    : 'Contact numbers are currently shielded. Upgrade membership to view telephone and WhatsApp numbers.'}
                </p>
              </div>

              {!isUnlocked && (
                <button
                  onClick={() => setActiveTab('plans')}
                  className="px-4 py-2 text-xs font-semibold bg-[#8B1D2C] text-white rounded-lg hover:bg-[#721522] shadow shrink-0"
                >
                  Upgrade to Unlock Contacts
                </button>
              )}
            </div>

            {/* Filter Bar */}
            <div className="bg-[#FFFDF9] p-4 rounded-xl border border-[#E8DEC8] shadow-sm space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Search query */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, ID, or job..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
                  />
                </div>

                {/* Gender filter */}
                <div>
                  <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
                  >
                    <option value="all">All Genders</option>
                    <option value="female">Brides (Female)</option>
                    <option value="male">Grooms (Male)</option>
                  </select>
                </div>

                {/* Community filter */}
                <div>
                  <select
                    value={filterCommunity}
                    onChange={(e) => setFilterCommunity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
                  >
                    <option value="all">All Communities</option>
                    <option value="Brahmin">Brahmin</option>
                    <option value="Agarwal">Agarwal</option>
                    <option value="Maratha">Maratha</option>
                    <option value="Patel">Patel</option>
                    <option value="Khatri">Khatri</option>
                    <option value="Rajput">Rajput</option>
                    <option value="Kayastha">Kayastha</option>
                    <option value="Jain">Jain</option>
                    <option value="Reddy">Reddy</option>
                    <option value="Nair">Nair</option>
                  </select>
                </div>

                {/* City filter */}
                <div>
                  <input
                    type="text"
                    value={filterCity === 'all' ? '' : filterCity}
                    onChange={(e) => setFilterCity(e.target.value || 'all')}
                    placeholder="Filter by city (e.g. Mumbai, Pune)..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#7A6B6A] pt-2 border-t border-[#E8DEC8]/60">
                <span>
                  Showing <strong className="text-slate-900">{filteredProfiles.length}</strong> matching profiles
                </span>
                {(searchQuery || filterGender !== 'all' || filterCommunity !== 'all' || filterCity !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterGender('all');
                      setFilterCommunity('all');
                      setFilterCity('all');
                    }}
                    className="text-[#8B1D2C] hover:underline font-medium"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Profile Grid */}
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProfiles.map((prof) => (
                  <ProfileCard
                    key={prof.id}
                    profile={prof}
                    isUnlocked={isUnlocked}
                    onUpgradeClick={() => setActiveTab('plans')}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-[#FFFDF9] p-12 text-center rounded-2xl border border-[#E8DEC8]">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-brand font-bold text-lg text-slate-800">No Matching Profiles Found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search criteria or resetting filters to browse all candidates.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterGender('all');
                    setFilterCommunity('all');
                    setFilterCity('all');
                  }}
                  className="mt-4 px-4 py-2 text-xs font-semibold bg-[#8B1D2C] text-white rounded-lg"
                >
                  Show All Profiles
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: MEMBERSHIP PLANS SELECTION */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8B1D2C]">
                Upgrade Your Privileges
              </span>
              <h1 className="text-2xl font-brand font-bold text-[#2D2424] mt-1">
                Choose a Membership Plan
              </h1>
              <p className="text-xs text-[#554746] mt-1">
                Select your preferred duration. Once selected, you can scan the platform UPI QR code and submit your 12-digit UTR reference ID.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {plans
                .filter((p) => p.isEnabled)
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((plan) => (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                      plan.isRecommended
                        ? 'bg-[#FFFDF9] border-2 border-[#D4AF37] shadow-xl'
                        : 'bg-[#FFFDF9] border border-[#E8DEC8]'
                    }`}
                  >
                    {plan.isRecommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8B1D2C] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border border-[#D4AF37]">
                        {plan.badge || 'Most Popular'}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-brand font-bold text-lg text-[#2D2424]">{plan.name}</h3>
                      </div>

                      <p className="text-xs text-[#6B5E5D] mb-4 min-h-[32px]">{plan.description}</p>

                      <div className="mb-4 pb-4 border-b border-[#E8DEC8]">
                        <span className="text-3xl font-bold font-mono text-[#8B1D2C]">
                          {formatCurrencyINR(plan.price)}
                        </span>
                        <div className="text-xs text-slate-500 mt-0.5">{plan.durationLabel}</div>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="text-[11px] font-semibold text-[#8B1D2C] uppercase tracking-wider">
                          Privileges:
                        </div>
                        <ul className="space-y-2 text-xs text-[#4A3E3D]">
                          {plan.benefits.map((b, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-snug">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => setSelectedPlanForPayment(plan)}
                        className={`w-full py-2.5 px-4 text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                          plan.isRecommended
                            ? 'bg-[#8B1D2C] text-white hover:bg-[#721522]'
                            : 'bg-[#FAF5EE] text-[#8B1D2C] border border-[#8B1D2C]/40 hover:bg-[#8B1D2C] hover:text-white'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Choose {plan.name} & Pay QR</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* VIEW 4: MY PERSONAL PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h1 className="text-2xl font-brand font-bold text-[#2D2424]">
                My Personal Profile Dossier
              </h1>
              <p className="text-xs text-[#554746] mt-0.5">
                Review your registered matrimonial credentials as visible to verified matches.
              </p>
            </div>

            <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E8DEC8] shadow-sm space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-[#E8DEC8]">
                <div className="w-16 h-16 rounded-full bg-[#8B1D2C] text-white font-brand text-2xl flex items-center justify-center border-2 border-[#D4AF37]">
                  {member.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-brand font-bold text-slate-900">{member.fullName}</h3>
                  <div className="text-xs text-[#7A6B6A] flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-semibold text-[#8B1D2C]">{member.memberId}</span>
                    <span>·</span>
                    <span className="capitalize">{member.gender === 'female' ? 'Bride' : 'Groom'}</span>
                    <span>·</span>
                    <span>{member.community}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DEC8]">
                  <span className="text-[#7A6B6A] block">Email Address</span>
                  <span className="font-medium text-slate-900 font-mono mt-0.5 block">{member.email}</span>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DEC8]">
                  <span className="text-[#7A6B6A] block">Mobile Phone</span>
                  <span className="font-medium text-slate-900 font-mono mt-0.5 block">{member.mobile}</span>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DEC8]">
                  <span className="text-[#7A6B6A] block">Date of Birth</span>
                  <span className="font-medium text-slate-900 mt-0.5 block">{member.dob}</span>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DEC8]">
                  <span className="text-[#7A6B6A] block">Current City</span>
                  <span className="font-medium text-slate-900 mt-0.5 block">{member.city}</span>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DEC8]">
                  <span className="text-[#7A6B6A] block">Community / Caste</span>
                  <span className="font-medium text-slate-900 mt-0.5 block">{member.community}</span>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DEC8]">
                  <span className="text-[#7A6B6A] block">Registration Date</span>
                  <span className="font-medium text-slate-900 mt-0.5 block">
                    {new Date(member.registeredAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: PAYMENT HISTORY */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-brand font-bold text-[#2D2424]">
                Payment Submission Records
              </h1>
              <p className="text-xs text-[#554746] mt-0.5">
                Review your submitted UPI transaction IDs, receipts, and admin review statuses.
              </p>
            </div>

            {memberPayments.length > 0 ? (
              <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8DEC8] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF5EE] border-b border-[#E8DEC8] text-[#7A6B6A] font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Plan Name</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Transaction ID / UTR</th>
                        <th className="px-4 py-3">Submission Date</th>
                        <th className="px-4 py-3">Review Status</th>
                        <th className="px-4 py-3">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DEC8]">
                      {memberPayments.map((pay) => (
                        <tr key={pay.id} className="hover:bg-[#FAF7F2]">
                          <td className="px-4 py-3 font-semibold text-slate-900">{pay.planName}</td>
                          <td className="px-4 py-3 font-mono font-bold text-[#8B1D2C]">
                            {formatCurrencyINR(pay.amount)}
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-700">{pay.transactionId}</td>
                          <td className="px-4 py-3 text-slate-600">
                            {new Date(pay.submittedAt).toLocaleDateString()} {new Date(pay.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3">
                            {pay.status === 'APPROVED' ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                              </span>
                            ) : pay.status === 'REJECTED' ? (
                              <span className="inline-flex items-center gap-1 text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                <ShieldAlert className="w-3.5 h-3.5" /> Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                <Clock className="w-3.5 h-3.5" /> Pending Verification
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {pay.screenshotUrl ? (
                              <a
                                href={pay.screenshotUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#8B1D2C] underline font-medium hover:text-[#721522]"
                              >
                                View Receipt
                              </a>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-[#FFFDF9] p-8 text-center rounded-2xl border border-[#E8DEC8]">
                <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="font-brand font-bold text-base text-slate-800">No Payment Records Yet</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Once you select a membership plan and submit a UPI transaction ID, records will appear here.
                </p>
                <button
                  onClick={() => setActiveTab('plans')}
                  className="mt-4 px-4 py-2 text-xs font-semibold bg-[#8B1D2C] text-white rounded-lg"
                >
                  Browse Membership Plans
                </button>
              </div>
            )}
          </div>
        )}
      </main>
      </div>

      {/* QR Payment Simulation Modal */}
      <QrPaymentModal
        plan={selectedPlanForPayment}
        onClose={() => setSelectedPlanForPayment(null)}
        onSuccess={() => {
          setActiveTab('overview');
        }}
      />
    </div>
  );
};
