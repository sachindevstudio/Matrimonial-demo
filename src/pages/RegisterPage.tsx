import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Gender } from '../types';
import { validateAgeEligibility } from '../utils/rules';
import { ShieldCheck, UserCheck, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { registerMember, communities, websiteContent } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender>('female');
  const [community, setCommunity] = useState('Brahmin');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDemoFill = (type: 'bride' | 'groom') => {
    if (type === 'bride') {
      setFullName('Shreya Singhania');
      setMobile('+91 98204 11223');
      setEmail(`shreya_${Math.floor(100 + Math.random() * 900)}@demo.com`);
      setDob('2001-06-15');
      setGender('female');
      setCommunity('Agarwal');
      setCity('Mumbai');
      setPassword('Password123');
      setConfirmPassword('Password123');
      setError(null);
    } else {
      setFullName('Varun Deshmukh');
      setMobile('+91 98450 66778');
      setEmail(`varun_${Math.floor(100 + Math.random() * 900)}@demo.com`);
      setDob('1998-09-20');
      setGender('male');
      setCommunity('Maratha');
      setCity('Pune');
      setPassword('Password123');
      setConfirmPassword('Password123');
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Age validation
    const ageCheck = validateAgeEligibility(dob, gender);
    if (!ageCheck.isValid) {
      setError(ageCheck.error || 'Age eligibility check failed.');
      return;
    }

    setIsSubmitting(true);

    const result = registerMember({
      fullName,
      mobile,
      email,
      dob,
      gender,
      community,
      city,
      password,
    });

    setIsSubmitting(false);

    if (result.success) {
      // Redirect to member dashboard
      navigate('/member');
    } else {
      setError(result.error || 'Failed to complete registration.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-[#FFFDF9] rounded-2xl shadow-xl border border-[#E8DEC8] overflow-hidden">
        {/* Banner */}
        <div className="bg-[#8B1D2C] text-white p-6 sm:p-8 text-center border-b border-[#D4AF37]/40 relative">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FAF5EE] text-[#8B1D2C] font-serif text-xl border border-[#D4AF37] mb-3">
            ॐ
          </div>
          <h1 className="text-2xl sm:text-3xl font-brand font-bold">
            Begin Sacred Matchmaking
          </h1>
          <p className="text-xs text-[#E8D8C8]/90 mt-1 max-w-sm mx-auto">
            Create your confidential profile on {websiteContent.branding.siteName} and connect with verified prospects.
          </p>

          {/* Quick Demo Pre-fill helper */}
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-center gap-2 text-xs">
            <span className="text-[#D4AF37] flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Demo Fast-Fill:
            </span>
            <button
              type="button"
              onClick={() => handleDemoFill('bride')}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors"
            >
              Eligible Bride (Age 25)
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('groom')}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition-colors"
            >
              Eligible Groom (Age 28)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Gender Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A6B6A] mb-2">
              Profile Gender & Eligibility *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  gender === 'female'
                    ? 'bg-[#8B1D2C] text-white border-[#8B1D2C] shadow-sm'
                    : 'bg-[#FAF7F2] text-[#4A3E3D] border-[#E8DEC8] hover:bg-white'
                }`}
              >
                <span>Bride (Female)</span>
                <span className="text-[10px] opacity-80">(Min. 18 Yrs)</span>
              </button>

              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  gender === 'male'
                    ? 'bg-[#8B1D2C] text-white border-[#8B1D2C] shadow-sm'
                    : 'bg-[#FAF7F2] text-[#4A3E3D] border-[#E8DEC8] hover:bg-white'
                }`}
              >
                <span>Groom (Male)</span>
                <span className="text-[10px] opacity-80">(Min. 21 Yrs)</span>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#2D2424] mb-1">
              Candidate Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Shreya Singhania"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
            />
          </div>

          {/* Email & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D2424] mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2424] mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 98200 12345"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
              />
            </div>
          </div>

          {/* DOB & Community */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D2424] mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
              />
              <span className="text-[10px] text-[#7A6B6A] mt-0.5 block">
                {gender === 'male' ? 'Must be 21+ for groom' : 'Must be 18+ for bride'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2424] mb-1">
                Community / Caste *
              </label>
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
              >
                {communities.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-[#2D2424] mb-1">
              Current Residence City *
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Mumbai, Bengaluru, Delhi NCR"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
            />
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D2424] mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2424] mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E8DEC8] focus:outline-none focus:ring-2 focus:ring-[#8B1D2C] bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 text-xs font-semibold tracking-wide text-white bg-[#8B1D2C] hover:bg-[#721522] rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Registering...' : 'Create Account & Generate Member ID'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sign In link */}
          <div className="text-center pt-2 text-xs text-[#6B5E5D]">
            Already have a registered profile?{' '}
            <Link to="/login" className="font-semibold text-[#8B1D2C] hover:underline">
              Sign In with Member ID / Email
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
