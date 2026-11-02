import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldCheck, HeartHandshake, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { websiteContent } = useApp();
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="bg-[#1A0B10] text-[#E8D8C8] pt-16 pb-12 border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Branding & Heritage */}
          <div>
            <div className="flex items-center gap-2 text-2xl font-brand font-bold text-[#D4AF37] mb-3">
              <span className="w-8 h-8 rounded-full bg-[#8B1D2C] text-[#D4AF37] flex items-center justify-center text-lg font-serif border border-[#D4AF37]">
                ॐ
              </span>
              <span>{websiteContent.branding.siteName}</span>
            </div>
            <p className="text-xs text-[#E8D8C8]/80 leading-relaxed mb-4">
              {websiteContent.branding.tagline}. Dedicated to facilitating meaningful matrimonial alliances rooted in cultural values, verified backgrounds, and lifelong trust.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#D4AF37]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> 100% Verified
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Lock className="w-4 h-4" /> Data Shielded
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#D4AF37] mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Portal
                </Link>
              </li>
              <li>
                <a href="#about-us" className="hover:text-white transition-colors">
                  About Our Heritage
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#membership-plans" className="hover:text-white transition-colors">
                  Membership Plans
                </a>
              </li>
              <li>
                <a href="#success-stories" className="hover:text-white transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <Link to="/register" className="text-[#D4AF37] hover:underline font-medium">
                  Register Matrimonial Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#D4AF37] mb-4">
              Headquarters & Support
            </h4>
            <ul className="space-y-3 text-xs text-white/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{websiteContent.contact.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{websiteContent.contact.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{websiteContent.contact.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{websiteContent.contact.hours}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Sacred Matchmaking */}
          <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-sm mb-2">
              <HeartHandshake className="w-4 h-4" />
              <span>Sacred Privacy Promise</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed mb-3">
              We never broadcast confidential contact numbers or address details publicly. Only approved, verified active members can view permitted family dossiers.
            </p>
            <div className="text-[11px] text-white/50 border-t border-white/10 pt-2.5">
              Client Presentation Prototype · Frontend Demonstration System
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>
            © {new Date().getFullYear()} {websiteContent.branding.siteName} Matrimonial Services. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveModal('privacy')}
              className="hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveModal('terms')}
              className="hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              Terms & Conditions
            </button>
            <span>·</span>
            <Link to="/login" className="hover:text-[#D4AF37] transition-colors">
              Staff / Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] text-[#2D2424] max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-[#D4AF37]/30 max-h-[85vh] overflow-y-auto">
            <h3 className="text-xl font-brand font-bold text-[#8B1D2C] mb-3">
              {activeModal === 'privacy' ? 'Privacy & Data Protection Policy' : 'Terms & Conditions of Membership'}
            </h3>
            <div className="text-xs space-y-3 leading-relaxed text-[#554746] mb-6">
              {activeModal === 'privacy' ? (
                <>
                  <p>
                    At {websiteContent.branding.siteName}, confidential family integrity is paramount. Contact coordinates (phone numbers, personal emails, residential addresses) are strictly locked behind our verified subscription tier.
                  </p>
                  <p>
                    Every member undergoes mandatory ID eligibility checks (minimum 21 for grooms and 18 for brides) prior to unlocking match dossiers.
                  </p>
                  <p>
                    This demonstration instance runs client-side with localStorage persistence. No private user telemetry is stored on external servers.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    By registering on {websiteContent.branding.siteName}, members affirm that all academic qualifications, community declarations, and family background submissions are genuine and accurate.
                  </p>
                  <p>
                    Membership approval is granted subsequent to manual payment verification by our platform administrators. Subscriptions remain valid for the period stipulated in the chosen plan.
                  </p>
                  <p>
                    Commercial solicitation, unlawful profiling, or harassment of members results in immediate revocation of account privileges without refund.
                  </p>
                </>
              )}
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 text-xs font-semibold bg-[#8B1D2C] text-white rounded-lg hover:bg-[#721522] transition-colors"
            >
              Close Policy Window
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
