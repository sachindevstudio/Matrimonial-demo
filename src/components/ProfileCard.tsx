import React, { useState } from 'react';
import { MatrimonialProfile } from '../types';
import { ProfileModal } from './ProfileModal';
import { MapPin, Briefcase, GraduationCap, Lock, Unlock, Eye } from 'lucide-react';

interface ProfileCardProps {
  profile: MatrimonialProfile;
  isUnlocked: boolean;
  onUpgradeClick?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isUnlocked,
  onUpgradeClick,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8DEC8] hover:border-[#D4AF37] transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden flex flex-col group">
        {/* Photo Container */}
        <div className="relative aspect-[4/3] bg-[#2E1018] overflow-hidden">
          <img
            src={profile.photoUrl}
            alt={profile.fullName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
            <span className="font-mono text-[11px] bg-black/60 backdrop-blur-md text-[#D4AF37] px-2 py-0.5 rounded font-semibold border border-[#D4AF37]/30">
              {profile.profileId}
            </span>
            {profile.isFeatured && (
              <span className="bg-[#8B1D2C] text-[#E8D8C8] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-[#D4AF37]/40 shadow-sm">
                Featured
              </span>
            )}
          </div>

          {/* Bottom name and location over photo */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="font-brand font-bold text-lg leading-tight text-white drop-shadow">
              {profile.fullName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-white/90 mt-0.5">
              <span>{profile.age} Yrs · {profile.height}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-[#D4AF37]" /> {profile.city}
              </span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          {/* Metadata strictly following zero-pill discipline */}
          <div className="space-y-1.5 text-xs text-[#554746]">
            <div className="flex items-center gap-2 font-medium text-[#2D2424]">
              <span>{profile.community}</span>
              <span aria-hidden="true" className="text-[#D4AF37]">·</span>
              <span>{profile.subcaste}</span>
              <span aria-hidden="true" className="text-[#D4AF37]">·</span>
              <span>{profile.motherTongue}</span>
            </div>

            <div className="flex items-start gap-1.5 text-xs text-slate-700">
              <GraduationCap className="w-3.5 h-3.5 text-[#8B1D2C] shrink-0 mt-0.5" />
              <span className="truncate">{profile.education}</span>
            </div>

            <div className="flex items-start gap-1.5 text-xs text-slate-700">
              <Briefcase className="w-3.5 h-3.5 text-[#8B1D2C] shrink-0 mt-0.5" />
              <span className="truncate">
                {profile.occupation} · <strong className="text-[#8B1D2C] font-semibold">{profile.annualIncome}</strong>
              </span>
            </div>
          </div>

          {/* Status & Action */}
          <div className="pt-2 border-t border-[#E8DEC8]/80 flex items-center justify-between gap-2">
            {isUnlocked ? (
              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-800 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Unlock className="w-3.5 h-3.5 text-[#D4AF37]" />
                View Full Dossier & Contacts
              </button>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-[#FAF5EE] hover:bg-[#8B1D2C] hover:text-white text-[#8B1D2C] border border-[#8B1D2C]/30 hover:border-[#8B1D2C] transition-all flex items-center justify-center gap-1.5 group/btn"
              >
                <Lock className="w-3.5 h-3.5 text-[#8B1D2C] group-hover/btn:text-white" />
                <span>View Profile (Contact Shielded)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <ProfileModal
        profile={profile}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        isUnlocked={isUnlocked}
        onUpgradeClick={onUpgradeClick}
      />
    </>
  );
};
