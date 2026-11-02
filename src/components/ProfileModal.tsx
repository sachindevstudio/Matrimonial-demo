import React from 'react';
import { MatrimonialProfile } from '../types';
import {
  X,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  Users,
  Moon,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface ProfileModalProps {
  profile: MatrimonialProfile | null;
  isOpen: boolean;
  onClose: () => void;
  isUnlocked: boolean;
  onUpgradeClick?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  isUnlocked,
  onUpgradeClick,
}) => {
  if (!isOpen || !profile) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFDF9] text-[#2D2424] max-w-3xl w-full rounded-2xl shadow-2xl border border-[#D4AF37]/40 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-[#8B1D2C] text-white p-6 relative flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-[#D4AF37]/30">
          <button
            onClick={onClose}
            aria-label="Close profile details"
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Photo */}
          <div className="relative w-28 h-36 rounded-xl overflow-hidden border-2 border-[#D4AF37] shadow-lg shrink-0 bg-[#2E1018]">
            <img
              src={profile.photoUrl}
              alt={profile.fullName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {profile.isFeatured && (
              <span className="absolute bottom-1 right-1 bg-[#D4AF37] text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                Featured
              </span>
            )}
          </div>

          {/* Core Info */}
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-[#E8D8C8] mb-1">
              <span className="font-mono text-[#D4AF37] font-semibold">{profile.profileId}</span>
              <span>·</span>
              <span>{profile.community} ({profile.subcaste})</span>
              <span>·</span>
              <span>{profile.motherTongue}</span>
            </div>

            <h2 id="profile-title" className="text-2xl font-brand font-bold text-white mb-1">
              {profile.fullName}
            </h2>

            <div className="text-sm text-white/90 flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
              <span>{profile.age} Yrs, {profile.height}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                {profile.city}, {profile.state}
              </span>
              <span>·</span>
              <span className="text-[#D4AF37] font-medium">{profile.maritalStatus}</span>
            </div>

            {/* Unlocked / Locked Access Pill */}
            {isUnlocked ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Active Member — Full Dossier Unlocked
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Private Contact Shield Active
              </div>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Contact Details Card (Unlocked vs Shielded) */}
          <div
            className={`p-5 rounded-xl border ${
              isUnlocked
                ? 'bg-emerald-50/70 border-emerald-300/80 text-emerald-950'
                : 'bg-amber-50/70 border-amber-300/80 text-[#4A3E3D]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8B1D2C]" />
                <span>Contact & Communication Details</span>
              </h3>
              {isUnlocked && (
                <span className="text-xs bg-emerald-600 text-white font-medium px-2 py-0.5 rounded">
                  Permitted Access
                </span>
              )}
            </div>

            {isUnlocked ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <div className="text-emerald-800 font-medium mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    Direct Mobile
                  </div>
                  <div className="font-mono text-sm font-bold text-slate-900">
                    {profile.contactInfo.phone}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <div className="text-emerald-800 font-medium mb-1 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    WhatsApp Connect
                  </div>
                  <div className="font-mono text-sm font-bold text-slate-900">
                    {profile.contactInfo.whatsapp}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <div className="text-emerald-800 font-medium mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Email
                  </div>
                  <div className="font-mono text-sm font-bold text-slate-900">
                    {profile.contactInfo.email}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-200">
                  <div className="text-emerald-800 font-medium mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    Guardian / Parental Contact
                  </div>
                  <div className="font-medium text-xs text-slate-900">
                    {profile.contactInfo.guardianContact}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-[#5C4D4C] max-w-md mx-auto">
                  To protect our families from unsolicited commercial calls, contact details and parental phone numbers are shielded for public visitors and free tier members.
                </p>
                {onUpgradeClick && (
                  <button
                    onClick={() => {
                      onClose();
                      onUpgradeClick();
                    }}
                    className="px-5 py-2 text-xs font-semibold bg-[#8B1D2C] text-white rounded-lg hover:bg-[#721522] shadow transition-colors inline-flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Upgrade Membership to View Contacts
                  </button>
                )}
              </div>
            )}
          </div>

          {/* About Bio */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#8B1D2C] mb-2">
              About {profile.fullName.split(' ')[0]}
            </h3>
            <p className="text-xs text-[#4A3E3D] leading-relaxed bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DEC8]">
              {profile.about}
            </p>
          </div>

          {/* Education & Career */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DEC8]">
              <h4 className="text-xs font-semibold text-[#8B1D2C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#8B1D2C]" /> Education
              </h4>
              <p className="text-xs font-medium text-slate-900">{profile.education}</p>
            </div>

            <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DEC8]">
              <h4 className="text-xs font-semibold text-[#8B1D2C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-[#8B1D2C]" /> Profession & Income
              </h4>
              <p className="text-xs font-medium text-slate-900">{profile.occupation}</p>
              <p className="text-xs text-slate-600">{profile.company}</p>
              <p className="text-xs font-bold text-[#8B1D2C] mt-1">{profile.annualIncome}</p>
            </div>
          </div>

          {/* Family Background */}
          <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DEC8]">
            <h4 className="text-xs font-semibold text-[#8B1D2C] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#8B1D2C]" /> Family Background
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#7A6B6A]">Father: </span>
                <span className="font-medium text-slate-900">{profile.familyDetails.fatherOccupation}</span>
              </div>
              <div>
                <span className="text-[#7A6B6A]">Mother: </span>
                <span className="font-medium text-slate-900">{profile.familyDetails.motherOccupation}</span>
              </div>
              <div>
                <span className="text-[#7A6B6A]">Siblings: </span>
                <span className="font-medium text-slate-900">{profile.familyDetails.siblings}</span>
              </div>
              <div>
                <span className="text-[#7A6B6A]">Family Values: </span>
                <span className="font-medium text-slate-900">{profile.familyDetails.familyValues} ({profile.familyDetails.familyType})</span>
              </div>
            </div>
          </div>

          {/* Astrological & Horoscope Details */}
          <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DEC8]">
            <h4 className="text-xs font-semibold text-[#8B1D2C] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-[#8B1D2C]" /> Astrological / Kundali Dossier
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs text-center">
              <div className="bg-white p-2.5 rounded-lg border border-[#E8DEC8]">
                <div className="text-[11px] text-[#7A6B6A]">Rashi (Moon Sign)</div>
                <div className="font-semibold text-slate-900 mt-0.5">{profile.horoscope.rashi}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#E8DEC8]">
                <div className="text-[11px] text-[#7A6B6A]">Nakshatra</div>
                <div className="font-semibold text-slate-900 mt-0.5">{profile.horoscope.nakshatra}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-[#E8DEC8]">
                <div className="text-[11px] text-[#7A6B6A]">Manglik Status</div>
                <div className="font-semibold text-slate-900 mt-0.5">{profile.horoscope.manglik}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF6F0] p-4 border-t border-[#E8DEC8] flex items-center justify-between">
          <div className="text-xs text-[#7A6B6A]">
            Profile verified under Shubhbandhan 5-tier screening protocol.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium border border-[#8B1D2C] text-[#8B1D2C] rounded-lg hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
