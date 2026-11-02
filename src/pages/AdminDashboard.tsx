import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  MatrimonialProfile,
  Member,
  MembershipPlan,
  PaymentRequest,
  SuccessStory,
} from '../types';
import { formatCurrencyINR } from '../utils/rules';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Heart,
  Settings,
  Layers,
  Sparkles,
  Receipt,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  Clock,
  RotateCcw,
  ExternalLink,
  Upload,
  Check,
  AlertCircle,
  Save,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    logout,
    members,
    updateMember,
    paymentRequests,
    approvePayment,
    rejectPayment,
    profiles,
    addProfile,
    updateProfile,
    deleteProfile,
    plans,
    addPlan,
    updatePlan,
    deletePlan,
    communities,
    successStories,
    addSuccessStory,
    updateSuccessStory,
    deleteSuccessStory,
    websiteContent,
    updateWebsiteContent,
    resetDemoData,
    showToast,
  } = useApp();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'members'
    | 'payments'
    | 'profiles'
    | 'plans'
    | 'communities'
    | 'stories'
    | 'content'
    | 'settings'
  >('overview');

  // Modal states
  const [selectedPaymentForModal, setSelectedPaymentForModal] = useState<PaymentRequest | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [editingProfile, setEditingProfile] = useState<MatrimonialProfile | null>(null);
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [isAddingStory, setIsAddingStory] = useState(false);

  // Filters
  const [memberSearch, setMemberSearch] = useState('');
  const [memberStatusFilter, setMemberStatusFilter] = useState<string>('all');
  const [profileSearch, setProfileSearch] = useState('');
  const [profileGenderFilter, setProfileGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [profileCommunityFilter, setProfileCommunityFilter] = useState<string>('all');

  // Website Content Form State
  const [editableContent, setEditableContent] = useState(websiteContent);

  if (!currentUser || currentUser.type !== 'admin') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="bg-[#FFFDF9] p-8 rounded-2xl border border-[#E8DEC8] max-w-md w-full text-center shadow-lg">
          <ShieldCheck className="w-12 h-12 text-[#8B1D2C] mx-auto mb-3" />
          <h2 className="text-xl font-brand font-bold text-[#2D2424] mb-2">Admin Clearance Required</h2>
          <p className="text-xs text-[#554746] mb-6">
            Sign in with administrative credentials to access the matrimonial management portal.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/login"
              className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#8B1D2C] text-white hover:bg-[#721522]"
            >
              Sign In as Admin
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 text-xs font-semibold rounded-lg border border-[#8B1D2C] text-[#8B1D2C] hover:bg-white"
            >
              Public Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Derived metrics
  const totalMembersCount = members.length;
  const activeMembersCount = members.filter((m) => m.membershipStatus === 'ACTIVE').length;
  const pendingPaymentsCount = paymentRequests.filter((r) => r.status === 'PENDING').length;
  const expiredMembersCount = members.filter((m) => m.membershipStatus === 'EXPIRED').length;

  // Filtered members
  const filteredMembers = members.filter((m) => {
    if (memberStatusFilter !== 'all' && m.membershipStatus !== memberStatusFilter) return false;
    if (memberSearch.trim()) {
      const q = memberSearch.toLowerCase();
      const matchName = m.fullName.toLowerCase().includes(q);
      const matchEmail = m.email.toLowerCase().includes(q);
      const matchId = m.memberId.toLowerCase().includes(q);
      const matchCity = m.city.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchId && !matchCity) return false;
    }
    return true;
  });

  // Filtered profiles
  const filteredProfiles = profiles.filter((p) => {
    if (profileGenderFilter !== 'all' && p.gender !== profileGenderFilter) return false;
    if (profileCommunityFilter !== 'all' && p.community !== profileCommunityFilter) return false;
    if (profileSearch.trim()) {
      const q = profileSearch.toLowerCase();
      const matchName = p.fullName.toLowerCase().includes(q);
      const matchId = p.profileId.toLowerCase().includes(q);
      const matchCity = p.city.toLowerCase().includes(q);
      const matchOcc = p.occupation.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchCity && !matchOcc) return false;
    }
    return true;
  });

  const handleSaveWebsiteContent = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteContent(editableContent);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2424] flex flex-col md:flex-row pt-[29px]">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#1A0B10] text-[#E8D8C8] flex flex-col justify-between shrink-0 shadow-lg">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-2 text-xl font-brand font-bold text-[#D4AF37]">
              <span className="w-7 h-7 rounded-full bg-[#8B1D2C] text-[#D4AF37] flex items-center justify-center text-sm font-serif border border-[#D4AF37]">
                ॐ
              </span>
              <span>{websiteContent.branding.siteName}</span>
            </div>
            <div className="text-[11px] text-white/60 mt-1 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Admin Management Hub</span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'overview', label: '1. Overview', icon: LayoutDashboard },
              { id: 'members', label: '2. Members', icon: Users, badge: members.length },
              { id: 'payments', label: '3. Payment Requests', icon: Receipt, badge: pendingPaymentsCount || undefined, alert: pendingPaymentsCount > 0 },
              { id: 'profiles', label: '4. Matrimonial Profiles', icon: Heart, badge: profiles.length },
              { id: 'plans', label: '5. Membership Plans', icon: CreditCard, badge: plans.length },
              { id: 'communities', label: '6. Communities', icon: Layers, badge: communities.length },
              { id: 'stories', label: '7. Success Stories', icon: Sparkles, badge: successStories.length },
              { id: 'content', label: '8. Website Content', icon: FileText },
              { id: 'settings', label: '9. Website Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#8B1D2C] text-white font-semibold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <tab.icon className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      tab.alert
                        ? 'bg-amber-400 text-slate-950 font-bold animate-pulse'
                        : activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-between"
          >
            <span>Preview Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full py-2 px-3 text-xs font-medium text-red-300 hover:text-red-200 hover:bg-white/5 rounded-lg flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Right Column: Dedicated Admin Header + Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FAF7F2]">
        {/* Sleek Admin App Header */}
        <header className="h-14 bg-[#FFFDF9] border-b border-[#E8DEC8] px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-[29px] z-20 shadow-xs">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#8B1D2C]">Admin Console</span>
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
              <div className="w-8 h-8 rounded-full bg-[#1A0B10] text-[#D4AF37] flex items-center justify-center font-bold text-xs border border-[#D4AF37]/50 shadow-xs">
                A
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-[#2D2424] leading-none">Super Administrator</div>
                <div className="text-[10px] text-emerald-600 leading-none mt-1 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Authorized Console
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Viewport */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B1D2C]">
                  Platform Executive Dashboard
                </span>
                <h1 className="text-2xl font-brand font-bold text-[#2D2424] mt-1">
                  Matrimonial Performance & Operations
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('payments')}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#8B1D2C] text-white hover:bg-[#721522] shadow flex items-center gap-1.5"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Review {pendingPaymentsCount} Pending Payments</span>
                </button>
              </div>
            </div>

            {/* Metric Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="bg-[#FFFDF9] p-4 rounded-xl border border-[#E8DEC8] shadow-sm">
                <div className="text-[11px] text-[#7A6B6A]">Total Members</div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{totalMembersCount}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Registered Accounts</div>
              </div>

              <div className="bg-[#FFFDF9] p-4 rounded-xl border border-[#E8DEC8] shadow-sm">
                <div className="text-[11px] text-[#7A6B6A]">Active Members</div>
                <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">{activeMembersCount}</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">Profiles Unlocked</div>
              </div>

              <div className="bg-[#FFFDF9] p-4 rounded-xl border border-amber-300 shadow-sm bg-amber-50/50">
                <div className="text-[11px] text-amber-800 font-semibold">Pending Payments</div>
                <div className="text-2xl font-bold font-mono text-amber-900 mt-1">{pendingPaymentsCount}</div>
                <div className="text-[10px] text-amber-700 mt-0.5">Action Required</div>
              </div>

              <div className="bg-[#FFFDF9] p-4 rounded-xl border border-[#E8DEC8] shadow-sm">
                <div className="text-[11px] text-[#7A6B6A]">Expired Members</div>
                <div className="text-2xl font-bold font-mono text-red-700 mt-1">{expiredMembersCount}</div>
                <div className="text-[10px] text-red-600 mt-0.5">Renewal Pipeline</div>
              </div>

              <div className="bg-[#FFFDF9] p-4 rounded-xl border border-[#E8DEC8] shadow-sm">
                <div className="text-[11px] text-[#7A6B6A]">Matrimonial Profiles</div>
                <div className="text-2xl font-bold font-mono text-[#8B1D2C] mt-1">{profiles.length}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Active Catalog</div>
              </div>

              <div className="bg-[#FFFDF9] p-4 rounded-xl border border-[#E8DEC8] shadow-sm">
                <div className="text-[11px] text-[#7A6B6A]">Active Plans</div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{plans.length}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Configured Tiers</div>
              </div>
            </div>

            {/* Quick Actions & Pending Requests Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-brand font-bold text-lg text-[#2D2424] flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#8B1D2C]" />
                  <span>Pending Payment Approvals</span>
                </h3>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="text-xs text-[#8B1D2C] font-semibold hover:underline"
                >
                  View All Payments ({paymentRequests.length})
                </button>
              </div>

              {pendingPaymentsCount > 0 ? (
                <div className="bg-[#FFFDF9] rounded-2xl border border-amber-300 overflow-hidden shadow-sm">
                  <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 font-medium">
                    ⚡ {pendingPaymentsCount} member(s) have submitted payment screenshots and are waiting for your approval to unlock profiles.
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF5EE] border-b border-[#E8DEC8] text-[#7A6B6A] font-semibold uppercase">
                      <tr>
                        <th className="px-4 py-3">Member</th>
                        <th className="px-4 py-3">Plan</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">UTR / Transaction ID</th>
                        <th className="px-4 py-3">Submitted</th>
                        <th className="px-4 py-3 text-right">Instant Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DEC8]">
                      {paymentRequests
                        .filter((p) => p.status === 'PENDING')
                        .map((req) => (
                          <tr key={req.id} className="hover:bg-amber-50/40">
                            <td className="px-4 py-3">
                              <div className="font-semibold text-slate-900">{req.memberName}</div>
                              <div className="text-[11px] font-mono text-[#8B1D2C]">{req.memberCode}</div>
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-800">{req.planName}</td>
                            <td className="px-4 py-3 font-mono font-bold text-[#8B1D2C]">
                              {formatCurrencyINR(req.amount)}
                            </td>
                            <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                              {req.transactionId}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {new Date(req.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="px-4 py-3 text-right space-x-2">
                              <button
                                onClick={() => setSelectedPaymentForModal(req)}
                                className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded hover:bg-slate-100"
                              >
                                View Details & Proof
                              </button>
                              <button
                                onClick={() => approvePayment(req.id)}
                                className="px-3 py-1.5 text-xs font-semibold rounded bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm"
                              >
                                Approve Now
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-[#FFFDF9] p-6 text-center rounded-xl border border-[#E8DEC8] text-xs text-slate-600">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  All submitted payments have been reviewed! No pending queue.
                </div>
              )}
            </div>

            {/* Recent Members Strip */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-brand font-bold text-lg text-[#2D2424] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#8B1D2C]" />
                  <span>Recently Registered Members</span>
                </h3>
                <button
                  onClick={() => setActiveTab('members')}
                  className="text-xs text-[#8B1D2C] font-semibold hover:underline"
                >
                  Manage All Members ({members.length})
                </button>
              </div>

              <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8DEC8] overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF5EE] border-b border-[#E8DEC8] text-[#7A6B6A] font-semibold uppercase">
                    <tr>
                      <th className="px-4 py-3">Member ID</th>
                      <th className="px-4 py-3">Full Name</th>
                      <th className="px-4 py-3">Community & City</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Selected Plan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DEC8]">
                    {members.slice(0, 5).map((m) => (
                      <tr key={m.id} className="hover:bg-[#FAF7F2]">
                        <td className="px-4 py-3 font-mono font-semibold text-[#8B1D2C]">{m.memberId}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{m.fullName}</div>
                          <div className="text-[11px] text-slate-500">{m.email}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {m.community} · {m.city}
                        </td>
                        <td className="px-4 py-3">
                          {m.membershipStatus === 'ACTIVE' ? (
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Active
                            </span>
                          ) : m.membershipStatus === 'PENDING' ? (
                            <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Pending
                            </span>
                          ) : m.membershipStatus === 'EXPIRED' ? (
                            <span className="text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                              Expired
                            </span>
                          ) : (
                            <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              No Plan
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {m.selectedPlanName || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MEMBERS MANAGEMENT */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-brand font-bold text-[#2D2424]">
                  Registered Member Directory
                </h1>
                <p className="text-xs text-[#554746] mt-0.5">
                  Search, verify credentials, activate, or adjust member status.
                </p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#FFFDF9] p-4 rounded-xl border border-[#E8DEC8] shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Search by name, ID, email, or city..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={memberStatusFilter}
                  onChange={(e) => setMemberStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
                >
                  <option value="all">All Statuses ({members.length})</option>
                  <option value="ACTIVE">Active ({members.filter((m) => m.membershipStatus === 'ACTIVE').length})</option>
                  <option value="PENDING">Pending ({members.filter((m) => m.membershipStatus === 'PENDING').length})</option>
                  <option value="EXPIRED">Expired ({members.filter((m) => m.membershipStatus === 'EXPIRED').length})</option>
                  <option value="NONE">No Plan ({members.filter((m) => m.membershipStatus === 'NONE').length})</option>
                </select>
              </div>
            </div>

            {/* Members Table */}
            <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8DEC8] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF5EE] border-b border-[#E8DEC8] text-[#7A6B6A] font-semibold uppercase">
                    <tr>
                      <th className="px-4 py-3">Member Code</th>
                      <th className="px-4 py-3">Candidate</th>
                      <th className="px-4 py-3">Gender & Age</th>
                      <th className="px-4 py-3">Community & City</th>
                      <th className="px-4 py-3">Membership Status</th>
                      <th className="px-4 py-3">Selected Tier</th>
                      <th className="px-4 py-3 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DEC8]">
                    {filteredMembers.map((m) => (
                      <tr key={m.id} className="hover:bg-[#FAF7F2]">
                        <td className="px-4 py-3 font-mono font-bold text-[#8B1D2C]">{m.memberId}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{m.fullName}</div>
                          <div className="text-[11px] text-slate-500">{m.email} · {m.mobile}</div>
                        </td>
                        <td className="px-4 py-3 capitalize text-slate-700">
                          {m.gender === 'female' ? 'Bride' : 'Groom'} ({m.dob})
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {m.community} · {m.city}
                        </td>
                        <td className="px-4 py-3">
                          {m.membershipStatus === 'ACTIVE' ? (
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Active
                            </span>
                          ) : m.membershipStatus === 'PENDING' ? (
                            <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Pending
                            </span>
                          ) : m.membershipStatus === 'EXPIRED' ? (
                            <span className="text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                              Expired
                            </span>
                          ) : (
                            <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              No Plan
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {m.selectedPlanName || 'None'}
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          {m.membershipStatus !== 'ACTIVE' ? (
                            <button
                              onClick={() => {
                                updateMember(m.id, {
                                  membershipStatus: 'ACTIVE',
                                  membershipActivatedAt: new Date().toISOString(),
                                  membershipExpiresAt: new Date(Date.now() + 90 * 86400000).toISOString(),
                                });
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-700 text-white rounded hover:bg-emerald-800"
                              title="Activate member"
                            >
                              Activate
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                updateMember(m.id, {
                                  membershipStatus: 'EXPIRED',
                                });
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-red-600 text-white rounded hover:bg-red-700"
                              title="Set status to expired"
                            >
                              Expire
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT REQUESTS */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-brand font-bold text-[#2D2424]">
                  UPI Payment Verifications & UTR Log
                </h1>
                <p className="text-xs text-[#554746] mt-0.5">
                  Inspect candidate payment slips, check transaction IDs, approve to instantly unlock profiles, or reject with feedback.
                </p>
              </div>
            </div>

            <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8DEC8] overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF5EE] border-b border-[#E8DEC8] text-[#7A6B6A] font-semibold uppercase">
                  <tr>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Plan & Amount</th>
                    <th className="px-4 py-3">UTR Reference ID</th>
                    <th className="px-4 py-3">Submitted At</th>
                    <th className="px-4 py-3">Current Status</th>
                    <th className="px-4 py-3">Screenshot Proof</th>
                    <th className="px-4 py-3 text-right">Approval Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DEC8]">
                  {paymentRequests.map((pay) => (
                    <tr key={pay.id} className="hover:bg-[#FAF7F2]">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{pay.memberName}</div>
                        <div className="text-[11px] font-mono text-[#8B1D2C]">{pay.memberCode}</div>
                        <div className="text-[11px] text-slate-500">{pay.memberEmail}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{pay.planName}</div>
                        <div className="font-mono font-bold text-[#8B1D2C]">{formatCurrencyINR(pay.amount)}</div>
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                        {pay.transactionId}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {new Date(pay.submittedAt).toLocaleDateString()} {new Date(pay.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3">
                        {pay.status === 'APPROVED' ? (
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Approved
                          </span>
                        ) : pay.status === 'REJECTED' ? (
                          <span className="text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            Rejected
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {pay.screenshotUrl ? (
                          <button
                            onClick={() => setSelectedPaymentForModal(pay)}
                            className="flex items-center gap-1.5 text-[#8B1D2C] hover:underline font-semibold"
                          >
                            <img
                              src={pay.screenshotUrl}
                              alt="Receipt Thumbnail"
                              className="w-7 h-7 rounded border object-cover"
                            />
                            <span>View Proof</span>
                          </button>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        {pay.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => approvePayment(pay.id)}
                              className="px-3 py-1 text-xs font-semibold bg-emerald-700 text-white rounded hover:bg-emerald-800 shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setSelectedPaymentForModal(pay)}
                              className="px-3 py-1 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-700 shadow-sm"
                            >
                              Reject
                            </button>
                          </>
                        ) : pay.status === 'APPROVED' ? (
                          <span className="text-[11px] text-emerald-700 font-medium">Activated</span>
                        ) : (
                          <span className="text-[11px] text-red-600">Reason: {pay.rejectionReason}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MATRIMONIAL PROFILES */}
        {activeTab === 'profiles' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-brand font-bold text-[#2D2424]">
                  Matrimonial Profile Catalog ({profiles.length} Profiles)
                </h1>
                <p className="text-xs text-[#554746] mt-0.5">
                  Manage prospective candidate cards, edit details, upload photos, toggle featured flags or visibility.
                </p>
              </div>

              <button
                onClick={() => setIsAddingProfile(true)}
                className="px-4 py-2 text-xs font-semibold bg-[#8B1D2C] text-white rounded-lg hover:bg-[#721522] shadow flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Candidate Profile</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-[#FFFDF9] p-4 rounded-xl border border-[#E8DEC8] shadow-sm flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={profileSearch}
                  onChange={(e) => setProfileSearch(e.target.value)}
                  placeholder="Search by profile ID, candidate name, city..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
                />
              </div>

              <select
                value={profileGenderFilter}
                onChange={(e) => setProfileGenderFilter(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
              >
                <option value="all">All Genders</option>
                <option value="female">Brides (Female)</option>
                <option value="male">Grooms (Male)</option>
              </select>

              <select
                value={profileCommunityFilter}
                onChange={(e) => setProfileCommunityFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
              >
                <option value="all">All Communities</option>
                {communities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Profiles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#FFFDF9] rounded-2xl border border-[#E8DEC8] overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-[#2E1018]">
                    <img
                      src={p.photoUrl}
                      alt={p.fullName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="bg-black/60 backdrop-blur-md text-[#D4AF37] text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                        {p.profileId}
                      </span>
                      {p.isFeatured && (
                        <span className="bg-[#8B1D2C] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => updateProfile(p.id, { isVisible: !p.isVisible })}
                        className={`p-1.5 rounded-full backdrop-blur-md text-xs ${
                          p.isVisible ? 'bg-emerald-800 text-white' : 'bg-red-800 text-white'
                        }`}
                        title={p.isVisible ? 'Visible on site' : 'Hidden from site'}
                      >
                        {p.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 text-white">
                      <div className="font-bold text-sm drop-shadow">{p.fullName}</div>
                      <div className="text-[11px] text-white/90">
                        {p.age} Yrs · {p.community} · {p.city}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-xs text-[#554746]">
                    <div>{p.education}</div>
                    <div className="font-semibold text-slate-800">{p.occupation} ({p.annualIncome})</div>
                    <div className="text-[11px] text-slate-500 pt-1 border-t border-[#E8DEC8]">
                      Parent Contact: {p.contactInfo.guardianContact}
                    </div>
                  </div>

                  <div className="p-3 bg-[#FAF5EE] border-t border-[#E8DEC8] flex items-center justify-between text-xs">
                    <button
                      onClick={() => setEditingProfile(p)}
                      className="px-3 py-1 font-semibold text-[#8B1D2C] hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete profile for ${p.fullName}?`)) {
                          deleteProfile(p.id);
                        }
                      }}
                      className="px-2 py-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MEMBERSHIP PLANS */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-brand font-bold text-[#2D2424]">
                  Membership Plan Management
                </h1>
                <p className="text-xs text-[#554746] mt-0.5">
                  Configure plan names, pricing in INR, durations in days, and benefit checklists. Changes reflect immediately across website and member dashboards.
                </p>
              </div>

              <button
                onClick={() => setIsAddingPlan(true)}
                className="px-4 py-2 text-xs font-semibold bg-[#8B1D2C] text-white rounded-lg hover:bg-[#721522] shadow flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Membership Tier</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((plan) => (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-6 bg-[#FFFDF9] border flex flex-col justify-between shadow-sm ${
                      plan.isRecommended ? 'border-[#D4AF37] ring-1 ring-[#D4AF37]' : 'border-[#E8DEC8]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-brand font-bold text-lg text-slate-900">{plan.name}</h3>
                        <button
                          onClick={() => updatePlan(plan.id, { isEnabled: !plan.isEnabled })}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            plan.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {plan.isEnabled ? 'Active' : 'Disabled'}
                        </button>
                      </div>

                      <div className="text-xs text-slate-600 mb-4">{plan.description}</div>

                      <div className="mb-4 pb-4 border-b border-[#E8DEC8]">
                        <span className="text-3xl font-bold font-mono text-[#8B1D2C]">
                          {formatCurrencyINR(plan.price)}
                        </span>
                        <div className="text-xs text-slate-500 mt-1">
                          Duration: {plan.durationDays} Days ({plan.durationLabel})
                        </div>
                      </div>

                      <ul className="space-y-1.5 text-xs text-slate-700 mb-6">
                        {plan.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-[#E8DEC8] flex items-center justify-between">
                      <button
                        onClick={() => setEditingPlan(plan)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#8B1D2C] hover:bg-[#FAF5EE] rounded flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Plan
                      </button>
                      <button
                        onClick={() => updatePlan(plan.id, { isRecommended: !plan.isRecommended })}
                        className={`text-xs px-2.5 py-1 rounded font-medium ${
                          plan.isRecommended ? 'bg-[#D4AF37] text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {plan.isRecommended ? '★ Recommended' : 'Make Recommended'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 6: COMMUNITIES */}
        {activeTab === 'communities' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-brand font-bold text-[#2D2424]">
                Supported Indian Communities
              </h1>
              <p className="text-xs text-[#554746] mt-0.5">
                Manage cultural heritage and community categories available for candidates and search filters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {communities.map((comm) => (
                <div key={comm.id} className="bg-[#FFFDF9] p-5 rounded-xl border border-[#E8DEC8] shadow-sm">
                  <h3 className="font-brand font-bold text-base text-[#8B1D2C]">{comm.name}</h3>
                  <p className="text-xs text-slate-600 mt-1">{comm.description}</p>
                  <div className="text-[11px] font-mono text-[#7A6B6A] mt-3 pt-2 border-t border-[#E8DEC8]">
                    {comm.memberCount.toLocaleString()} Verified Registrations
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SUCCESS STORIES */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-brand font-bold text-[#2D2424]">
                  Success Stories Management
                </h1>
                <p className="text-xs text-[#554746] mt-0.5">
                  Celebrate radiant weddings formed on the platform. Published stories appear directly on the homepage.
                </p>
              </div>

              <button
                onClick={() => setIsAddingStory(true)}
                className="px-4 py-2 text-xs font-semibold bg-[#8B1D2C] text-white rounded-lg hover:bg-[#721522] shadow flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Success Story</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {successStories.map((story) => (
                <div
                  key={story.id}
                  className="bg-[#FFFDF9] rounded-2xl border border-[#E8DEC8] overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="aspect-[16/9] bg-[#2E1018] relative">
                    <img
                      src={story.photoUrl}
                      alt={story.coupleNames}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded shadow ${
                          story.isPublished ? 'bg-emerald-700 text-white' : 'bg-slate-700 text-white'
                        }`}
                      >
                        {story.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2 text-xs">
                    <div className="font-semibold text-[#8B1D2C]">{story.weddingDate} · {story.location}</div>
                    <h3 className="font-brand font-bold text-lg text-slate-900">{story.coupleNames}</h3>
                    <blockquote className="italic text-slate-600 border-l-2 border-[#D4AF37] pl-3 py-1">
                      "{story.quote}"
                    </blockquote>
                    <p className="text-slate-600 leading-relaxed mt-2">{story.story}</p>
                  </div>

                  <div className="p-4 bg-[#FAF5EE] border-t border-[#E8DEC8] flex items-center justify-between text-xs">
                    <button
                      onClick={() => setEditingStory(story)}
                      className="font-semibold text-[#8B1D2C] hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => updateSuccessStory(story.id, { isPublished: !story.isPublished })}
                      className="font-medium text-slate-700 hover:text-slate-900"
                    >
                      {story.isPublished ? 'Unpublish' : 'Publish to Homepage'}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete story for ${story.coupleNames}?`)) {
                          deleteSuccessStory(story.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: WEBSITE CONTENT MANAGEMENT (IMPORTANT) */}
        {activeTab === 'content' && (
          <form onSubmit={handleSaveWebsiteContent} className="space-y-8 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8B1D2C]">
                  Non-Technical Client Controls
                </span>
                <h1 className="text-2xl font-brand font-bold text-[#2D2424] mt-1">
                  Website Content & QR Management
                </h1>
                <p className="text-xs text-[#554746] mt-0.5">
                  Update your website branding name, hero statements, UPI QR code, contact information, and toggle homepage sections without writing any code.
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-[#8B1D2C] text-white hover:bg-[#721522] shadow transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>

            {/* A. Branding */}
            <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E8DEC8] shadow-sm space-y-4">
              <h3 className="font-brand font-bold text-base text-[#8B1D2C] border-b border-[#E8DEC8] pb-2">
                1. Website Branding & Identity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Platform / Brand Name *
                  </label>
                  <input
                    type="text"
                    value={editableContent.branding.siteName}
                    onChange={(e) =>
                      setEditableContent({
                        ...editableContent,
                        branding: { ...editableContent.branding, siteName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    e.g. Shubhbandhan or VivahSetu
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Brand Tagline</label>
                  <input
                    type="text"
                    value={editableContent.branding.tagline}
                    onChange={(e) =>
                      setEditableContent({
                        ...editableContent,
                        branding: { ...editableContent.branding, tagline: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* B. Hero Section */}
            <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E8DEC8] shadow-sm space-y-4">
              <h3 className="font-brand font-bold text-base text-[#8B1D2C] border-b border-[#E8DEC8] pb-2">
                2. Homepage Hero Header
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Hero Main Headline</label>
                  <input
                    type="text"
                    value={editableContent.hero.heading}
                    onChange={(e) =>
                      setEditableContent({
                        ...editableContent,
                        hero: { ...editableContent.hero, heading: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Hero Subheading</label>
                  <textarea
                    rows={2}
                    value={editableContent.hero.subheading}
                    onChange={(e) =>
                      setEditableContent({
                        ...editableContent,
                        hero: { ...editableContent.hero, subheading: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">Hero Badge Text</label>
                    <input
                      type="text"
                      value={editableContent.hero.badgeText}
                      onChange={(e) =>
                        setEditableContent({
                          ...editableContent,
                          hero: { ...editableContent.hero, badgeText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">Primary CTA Button</label>
                    <input
                      type="text"
                      value={editableContent.hero.ctaRegisterText}
                      onChange={(e) =>
                        setEditableContent({
                          ...editableContent,
                          hero: { ...editableContent.hero, ctaRegisterText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* C. QR Code Management */}
            <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E8DEC8] shadow-sm space-y-4">
              <h3 className="font-brand font-bold text-base text-[#8B1D2C] border-b border-[#E8DEC8] pb-2">
                3. UPI QR Code & Payment Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs items-center">
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">Merchant UPI VPA ID *</label>
                    <input
                      type="text"
                      value={editableContent.paymentQR.upiId}
                      onChange={(e) =>
                        setEditableContent({
                          ...editableContent,
                          paymentQR: { ...editableContent.paymentQR, upiId: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">Official Merchant Name *</label>
                    <input
                      type="text"
                      value={editableContent.paymentQR.merchantName}
                      onChange={(e) =>
                        setEditableContent({
                          ...editableContent,
                          paymentQR: { ...editableContent.paymentQR, merchantName: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">QR Code Image Path / URL</label>
                    <input
                      type="text"
                      value={editableContent.paymentQR.qrImageUrl}
                      onChange={(e) =>
                        setEditableContent({
                          ...editableContent,
                          paymentQR: { ...editableContent.paymentQR, qrImageUrl: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div className="bg-[#FAF5EE] p-4 rounded-xl border border-[#E8DEC8] text-center flex flex-col items-center">
                  <div className="text-[11px] font-semibold text-[#8B1D2C] mb-2 uppercase">Live QR Preview</div>
                  <img
                    src={editableContent.paymentQR.qrImageUrl}
                    alt="QR Preview"
                    className="w-36 h-36 object-contain rounded border border-[#E8DEC8] bg-white p-2"
                  />
                  <span className="text-[10px] text-slate-500 mt-2 font-mono">
                    {editableContent.paymentQR.upiId}
                  </span>
                </div>
              </div>
            </div>

            {/* D. Section Visibility Toggles */}
            <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E8DEC8] shadow-sm space-y-4">
              <h3 className="font-brand font-bold text-base text-[#8B1D2C] border-b border-[#E8DEC8] pb-2">
                4. Homepage Section Visibility Controls
              </h3>
              <p className="text-xs text-slate-500">
                Instantly turn homepage sections on or off without altering frontend code:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {[
                  { key: 'howItWorks', label: 'How It Works (5 Steps)' },
                  { key: 'featuredProfiles', label: 'Featured Profiles Showcase' },
                  { key: 'whyChooseUs', label: 'Why Choose Us / Values' },
                  { key: 'successStories', label: 'Success Stories & Couples' },
                  { key: 'membershipPlans', label: 'Membership Plans & Pricing' },
                ].map((sec) => (
                  <label
                    key={sec.key}
                    className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DEC8] flex items-center justify-between cursor-pointer hover:bg-white"
                  >
                    <span className="font-medium text-slate-900">{sec.label}</span>
                    <input
                      type="checkbox"
                      checked={(editableContent.sectionVisibility as any)[sec.key]}
                      onChange={(e) =>
                        setEditableContent({
                          ...editableContent,
                          sectionVisibility: {
                            ...editableContent.sectionVisibility,
                            [sec.key]: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-[#8B1D2C] rounded focus:ring-[#8B1D2C]"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* E. Contact Details */}
            <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E8DEC8] shadow-sm space-y-4">
              <h3 className="font-brand font-bold text-base text-[#8B1D2C] border-b border-[#E8DEC8] pb-2">
                5. Contact & Support Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Support Phone *</label>
                  <input
                    type="text"
                    value={editableContent.contact.phone}
                    onChange={(e) =>
                      setEditableContent({
                        ...editableContent,
                        contact: { ...editableContent.contact, phone: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Support Email *</label>
                  <input
                    type="email"
                    value={editableContent.contact.email}
                    onChange={(e) =>
                      setEditableContent({
                        ...editableContent,
                        contact: { ...editableContent.contact, email: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-800 mb-1">Physical Address *</label>
                  <input
                    type="text"
                    value={editableContent.contact.address}
                    onChange={(e) =>
                      setEditableContent({
                        ...editableContent,
                        contact: { ...editableContent.contact, address: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 text-xs font-semibold rounded-xl bg-[#8B1D2C] text-white hover:bg-[#721522] shadow transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save All Content Updates</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 9: WEBSITE SETTINGS & FACTORY RESET */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="text-2xl font-brand font-bold text-[#2D2424]">
                Demo Configuration & Reset
              </h1>
              <p className="text-xs text-[#554746] mt-0.5">
                Manage demo state persistence, seed records, and client presentation options.
              </p>
            </div>

            <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#E8DEC8] shadow-sm space-y-4">
              <h3 className="font-brand font-bold text-base text-slate-900">
                Factory Demo Data Reset
              </h3>
              <p className="text-xs text-[#554746] leading-relaxed">
                Clicking the button below resets localStorage and re-populates pristine demo profiles, sample members (Rahul, Pooja, Amit, Priya), payment requests, and plans back to factory presentation state.
              </p>
              <button
                onClick={() => {
                  if (window.confirm('Reset all demo state back to factory default?')) {
                    resetDemoData();
                    navigate('/');
                  }
                }}
                className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-red-700 text-white hover:bg-red-800 shadow transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All Demo Data to Default</span>
              </button>
            </div>

            <div className="bg-[#FAF5EE] p-6 rounded-2xl border border-[#D4AF37]/50 text-xs text-[#554746] space-y-2">
              <div className="font-bold text-[#8B1D2C]">Presentation Guidance:</div>
              <p>
                1. <strong>Interconnected Proof</strong>: Any approval in "Payment Requests" immediately unlocks profiles on member dashboards and changes status to Active without page reload.
              </p>
              <p>
                2. <strong>Website Content Sync</strong>: Changing the brand name or hero text in Tab 8 immediately updates the navbar and header across the entire application.
              </p>
            </div>
          </div>
        )}
      </main>
      </div>

      {/* Payment Inspection & Approval Modal */}
      {selectedPaymentForModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] text-[#2D2424] max-w-lg w-full rounded-2xl shadow-2xl border border-[#D4AF37]/40 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#8B1D2C]">
                  {selectedPaymentForModal.memberCode}
                </span>
                <h3 className="font-brand font-bold text-lg text-slate-900">
                  Payment Verification: {selectedPaymentForModal.memberName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPaymentForModal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DEC8]">
                <div>
                  <span className="text-slate-500">Plan:</span>
                  <div className="font-semibold">{selectedPaymentForModal.planName}</div>
                </div>
                <div>
                  <span className="text-slate-500">Amount:</span>
                  <div className="font-mono font-bold text-[#8B1D2C]">
                    {formatCurrencyINR(selectedPaymentForModal.amount)}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">UTR / Ref ID:</span>
                  <div className="font-mono font-bold text-slate-900">
                    {selectedPaymentForModal.transactionId}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500">Submitted:</span>
                  <div>{new Date(selectedPaymentForModal.submittedAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Screenshot Preview */}
              <div>
                <span className="font-semibold block mb-1">Attached Payment Slip:</span>
                <div className="rounded-xl overflow-hidden border border-[#E8DEC8] bg-black max-h-56 flex items-center justify-center">
                  <img
                    src={selectedPaymentForModal.screenshotUrl}
                    alt="Receipt Screenshot"
                    className="max-h-56 object-contain"
                  />
                </div>
              </div>

              {/* Rejection reason input */}
              {selectedPaymentForModal.status === 'PENDING' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Rejection Feedback (if declining):
                  </label>
                  <input
                    type="text"
                    value={rejectionReasonInput}
                    onChange={(e) => setRejectionReasonInput(e.target.value)}
                    placeholder="e.g. UTR number not found on bank statement"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#E8DEC8]">
              <button
                onClick={() => setSelectedPaymentForModal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Close Window
              </button>

              {selectedPaymentForModal.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      rejectPayment(selectedPaymentForModal.id, rejectionReasonInput);
                      setSelectedPaymentForModal(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      approvePayment(selectedPaymentForModal.id);
                      setSelectedPaymentForModal(null);
                    }}
                    className="px-5 py-2 text-xs font-semibold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
                  >
                    Approve & Unlock Profiles
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Profile Modal */}
      {(editingProfile || isAddingProfile) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] text-[#2D2424] max-w-2xl w-full rounded-2xl shadow-2xl border border-[#D4AF37]/40 p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
              <h3 className="font-brand font-bold text-lg text-slate-900">
                {editingProfile ? `Edit Profile: ${editingProfile.fullName}` : 'Add New Candidate Profile'}
              </h3>
              <button
                onClick={() => {
                  setEditingProfile(null);
                  setIsAddingProfile(false);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form);
                const candidateData = {
                  fullName: fd.get('fullName') as string,
                  gender: fd.get('gender') as any,
                  age: Number(fd.get('age')),
                  dob: fd.get('dob') as string,
                  height: fd.get('height') as string,
                  community: fd.get('community') as string,
                  subcaste: fd.get('subcaste') as string,
                  motherTongue: fd.get('motherTongue') as string,
                  religion: 'Hindu',
                  education: fd.get('education') as string,
                  occupation: fd.get('occupation') as string,
                  company: fd.get('company') as string,
                  annualIncome: fd.get('annualIncome') as string,
                  city: fd.get('city') as string,
                  state: fd.get('state') as string,
                  diet: fd.get('diet') as string,
                  maritalStatus: 'Never Married',
                  about: fd.get('about') as string,
                  photoUrl: (fd.get('photoUrl') as string) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                  galleryUrls: [],
                  isFeatured: fd.get('isFeatured') === 'on',
                  isVisible: true,
                  familyDetails: {
                    fatherOccupation: fd.get('fatherOccupation') as string || 'Business',
                    motherOccupation: fd.get('motherOccupation') as string || 'Homemaker',
                    siblings: fd.get('siblings') as string || '1 Sibling',
                    familyValues: 'Moderate Traditional',
                    familyType: 'Nuclear',
                  },
                  horoscope: {
                    rashi: fd.get('rashi') as string || 'Mesh (Aries)',
                    nakshatra: fd.get('nakshatra') as string || 'Rohini',
                    manglik: fd.get('manglik') as string || 'Non-Manglik',
                  },
                  contactInfo: {
                    phone: fd.get('phone') as string || '+91 98200 11223',
                    email: fd.get('email') as string || 'candidate@gmail.com',
                    whatsapp: fd.get('whatsapp') as string || '+91 98200 11223',
                    guardianContact: fd.get('guardianContact') as string || 'Parents - +91 98200 33445',
                  },
                };

                if (editingProfile) {
                  updateProfile(editingProfile.id, candidateData);
                  setEditingProfile(null);
                } else {
                  addProfile(candidateData);
                  setIsAddingProfile(false);
                }
              }}
              className="space-y-4 max-h-[70vh] overflow-y-auto text-xs pr-1"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    name="fullName"
                    defaultValue={editingProfile?.fullName || ''}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Gender *</label>
                  <select
                    name="gender"
                    defaultValue={editingProfile?.gender || 'female'}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  >
                    <option value="female">Female (Bride)</option>
                    <option value="male">Male (Groom)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Age *</label>
                  <input
                    name="age"
                    type="number"
                    defaultValue={editingProfile?.age || 26}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Height *</label>
                  <input
                    name="height"
                    defaultValue={editingProfile?.height || "5' 5\""}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Date of Birth</label>
                  <input
                    name="dob"
                    type="date"
                    defaultValue={editingProfile?.dob || '2000-01-01'}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Community *</label>
                  <input
                    name="community"
                    defaultValue={editingProfile?.community || 'Brahmin'}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Subcaste</label>
                  <input
                    name="subcaste"
                    defaultValue={editingProfile?.subcaste || 'General'}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Mother Tongue</label>
                  <input
                    name="motherTongue"
                    defaultValue={editingProfile?.motherTongue || 'Hindi'}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Education *</label>
                  <input
                    name="education"
                    defaultValue={editingProfile?.education || 'MBA, Top Tier University'}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Occupation *</label>
                  <input
                    name="occupation"
                    defaultValue={editingProfile?.occupation || 'Senior Manager'}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Company</label>
                  <input
                    name="company"
                    defaultValue={editingProfile?.company || 'MNC Corp'}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Annual Income *</label>
                  <input
                    name="annualIncome"
                    defaultValue={editingProfile?.annualIncome || '₹28 Lakhs / annum'}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">City *</label>
                  <input
                    name="city"
                    defaultValue={editingProfile?.city || 'Mumbai'}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Candidate Bio / About</label>
                <textarea
                  name="about"
                  rows={2}
                  defaultValue={editingProfile?.about || 'Warm-hearted, spiritually grounded professional who values deep family traditions.'}
                  className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Candidate Mobile Phone</label>
                  <input
                    name="phone"
                    defaultValue={editingProfile?.contactInfo.phone || '+91 98200 45678'}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Guardian / Parent Contact</label>
                  <input
                    name="guardianContact"
                    defaultValue={editingProfile?.contactInfo.guardianContact || 'Mr. Sharma (Father) - +91 98200 11990'}
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Profile Photo Image URL</label>
                <input
                  name="photoUrl"
                  defaultValue={editingProfile?.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
                  className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  defaultChecked={editingProfile?.isFeatured}
                  id="feat-box"
                  className="w-4 h-4 text-[#8B1D2C]"
                />
                <label htmlFor="feat-box" className="font-semibold">Mark as Featured on Homepage</label>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-[#E8DEC8]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(null);
                    setIsAddingProfile(false);
                  }}
                  className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-semibold bg-[#8B1D2C] text-white rounded-lg hover:bg-[#721522]"
                >
                  Save Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Membership Plan Modal */}
      {(editingPlan || isAddingPlan) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] text-[#2D2424] max-w-lg w-full rounded-2xl shadow-2xl border border-[#D4AF37]/40 p-6 space-y-4">
            <h3 className="font-brand font-bold text-lg text-slate-900">
              {editingPlan ? `Edit Plan: ${editingPlan.name}` : 'Create New Membership Plan'}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form);
                const benefits = (fd.get('benefits') as string)
                  .split('\n')
                  .map((b) => b.trim())
                  .filter(Boolean);

                const planPayload = {
                  name: fd.get('name') as string,
                  price: Number(fd.get('price')),
                  durationDays: Number(fd.get('durationDays')),
                  durationLabel: fd.get('durationLabel') as string,
                  description: fd.get('description') as string,
                  badge: fd.get('badge') as string,
                  benefits,
                  isRecommended: fd.get('isRecommended') === 'on',
                  isEnabled: true,
                  displayOrder: Number(fd.get('displayOrder') || 1),
                };

                if (editingPlan) {
                  updatePlan(editingPlan.id, planPayload);
                  setEditingPlan(null);
                } else {
                  addPlan(planPayload);
                  setIsAddingPlan(false);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Plan Name *</label>
                <input
                  name="name"
                  defaultValue={editingPlan?.name || ''}
                  required
                  placeholder="e.g. Platinum Alliances"
                  className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Price in INR (₹) *</label>
                  <input
                    name="price"
                    type="number"
                    defaultValue={editingPlan?.price || 2999}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Duration (in Days) *</label>
                  <input
                    name="durationDays"
                    type="number"
                    defaultValue={editingPlan?.durationDays || 60}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Duration Label</label>
                <input
                  name="durationLabel"
                  defaultValue={editingPlan?.durationLabel || '2 Months (60 Days)'}
                  className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Description</label>
                <input
                  name="description"
                  defaultValue={editingPlan?.description || 'Tailored matchmaking package.'}
                  className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Benefits (one per line) *</label>
                <textarea
                  name="benefits"
                  rows={4}
                  defaultValue={editingPlan?.benefits.join('\n') || 'Unlock 40 contact numbers\nDirect parental introduction\nVedic Kundali alignment'}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-[#E8DEC8] bg-white text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="isRecommended"
                  defaultChecked={editingPlan?.isRecommended}
                  id="rec-box"
                  className="w-4 h-4 text-[#8B1D2C]"
                />
                <label htmlFor="rec-box" className="font-semibold">Highlight as Recommended Plan</label>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-[#E8DEC8]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPlan(null);
                    setIsAddingPlan(false);
                  }}
                  className="px-4 py-2 text-xs text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-semibold bg-[#8B1D2C] text-white rounded-lg hover:bg-[#721522]"
                >
                  Save Membership Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
