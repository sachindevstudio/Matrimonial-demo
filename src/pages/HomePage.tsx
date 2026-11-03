import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { QrPaymentModal } from '../components/QrPaymentModal';
import { MembershipPlan } from '../types';
import { formatCurrencyINR } from '../utils/rules';
import {
  ShieldCheck,
  Heart,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Lock,
  Users,
  Compass,
  Award,
  PhoneCall,
  CalendarCheck,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { websiteContent, plans, successStories, currentUser } = useApp();
  const navigate = useNavigate();
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<MembershipPlan | null>(null);

  const handlePlanSelect = (plan: MembershipPlan) => {
    if (!currentUser) {
      navigate('/register');
      return;
    }
    if (currentUser.type === 'admin') {
      navigate('/admin');
      return;
    }
    setSelectedPlanForPayment(plan);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2424]">
      {/* 1. HERO SECTION */}
      {websiteContent.hero && (
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Text column */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                {/* Quiet editorial kicker */}
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8B1D2C]">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  <span>{websiteContent.hero.badgeText}</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-brand font-bold text-[#4A0E17] leading-[1.15] text-balance">
                  {websiteContent.hero.heading}
                </h1>

                <p className="text-base sm:text-lg text-[#554746] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {websiteContent.hero.subheading}
                </p>

                {/* Primary CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    to={currentUser ? (currentUser.type === 'admin' ? '/admin' : '/member') : '/register'}
                    className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white bg-[#8B1D2C] rounded-xl hover:bg-[#721522] shadow-lg hover:shadow-xl transition-all duration-200 text-center flex items-center justify-center gap-2 group"
                  >
                    <span>
                      {currentUser
                        ? currentUser.type === 'admin'
                          ? 'Go to Admin Console'
                          : 'Go to Member Dashboard'
                        : websiteContent.hero.ctaRegisterText}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href="#membership-plans"
                    className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-[#8B1D2C] bg-[#FFFDF9] border border-[#D4AF37] rounded-xl hover:bg-[#FAF5EE] shadow-sm transition-all text-center"
                  >
                    {websiteContent.hero.ctaPlansText}
                  </a>
                </div>

                {/* Subtle trust metrics */}
                <div className="pt-6 border-t border-[#E8DEC8] flex flex-wrap items-center justify-center lg:justify-start gap-8 text-xs text-[#6B5E5D]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#8B1D2C]" />
                    <span>Government ID Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#8B1D2C]" />
                    <span>Shielded Family Privacy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#8B1D2C]" />
                    <span>Direct Vedic Kundali Matching</span>
                  </div>
                </div>
              </div>

              {/* Visual frame */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative golden border */}
                  <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#D4AF37]/50 via-[#8B1D2C]/20 to-transparent blur-md" />
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/60 aspect-[4/3] lg:aspect-[5/4] bg-[#2E1018]">
                    <img
                      src={websiteContent.hero.bannerImageUrl || '/images/hero_wedding.jpg'}
                      alt="Sacred Indian Wedding Ceremony"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white p-3 rounded-xl bg-black/40 backdrop-blur-md border border-white/20">
                      <div className="flex items-center justify-between text-xs font-semibold text-[#D4AF37]">
                        <span>Sacred Matrimonial Heritage</span>
                        <span className="font-mono">100% Curated</span>
                      </div>
                      <div className="text-xs text-white/90 mt-1">
                        Culturally aligned matchmaking across 12+ verified Indian communities.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. HOW IT WORKS (5 STEPS) */}
      {websiteContent.sectionVisibility.howItWorks && (
        <section id="how-it-works" className="py-20 bg-[#FFFDF9] border-y border-[#E8DEC8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#8B1D2C]">
                Simple & Transparent Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-brand font-bold text-[#4A0E17]">
                How Shubhbandhan Works
              </h2>
              <p className="text-sm text-[#6B5E5D] leading-relaxed">
                From initial profile creation to verified family introductions in five dignified steps.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {
                  step: '01',
                  title: 'Register Profile',
                  desc: 'Create your matrimonial account with educational, professional, and family details.',
                  icon: Users,
                },
                {
                  step: '02',
                  title: 'Choose Plan',
                  desc: 'Select a suitable membership tier based on your duration and introduction preferences.',
                  icon: Compass,
                },
                {
                  step: '03',
                  title: 'Make UPI Payment',
                  desc: 'Scan the official platform QR code and submit your 12-digit UTR reference ID.',
                  icon: Sparkles,
                },
                {
                  step: '04',
                  title: 'Admin Approval',
                  desc: 'Our staff verifies transaction details and activates your full membership immediately.',
                  icon: ShieldCheck,
                },
                {
                  step: '05',
                  title: 'Explore & Connect',
                  desc: 'Unlock full contact coordinates, phone numbers, WhatsApp, and family dossiers.',
                  icon: Heart,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E8DEC8] hover:border-[#D4AF37] transition-all flex flex-col justify-between group shadow-sm hover:shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-[#8B1D2C] bg-[#8B1D2C]/10 px-2 py-0.5 rounded">
                        {item.step}
                      </span>
                      <item.icon className="w-5 h-5 text-[#8B1D2C] group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-brand font-bold text-base text-[#2D2424] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#554746] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* 4. ABOUT US SECTION */}
      <section id="about-us" className="py-20 bg-[#FFFDF9] border-y border-[#E8DEC8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-xl aspect-[4/3] bg-[#2E1018]">
                <img
                  src={websiteContent.about.imageUrl || '/images/about_ceremony.jpg'}
                  alt="Traditional Indian Vivah Ceremony"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#8B1D2C]">
                Our Sacred Commitment
              </span>
              <h2 className="text-3xl sm:text-4xl font-brand font-bold text-[#4A0E17]">
                {websiteContent.about.heading}
              </h2>
              <p className="text-sm text-[#554746] leading-relaxed">
                {websiteContent.about.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {websiteContent.about.points.map((pt, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-xs text-[#2D2424]">
                    <CheckCircle2 className="w-4 h-4 text-[#8B1D2C] shrink-0 mt-0.5" />
                    <span className="font-medium">{pt}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/register"
                  className="px-6 py-3 text-xs font-semibold bg-[#8B1D2C] text-white rounded-lg hover:bg-[#721522] transition-colors"
                >
                  Join Verified Families Today
                </Link>
                <a
                  href="#contact-info"
                  className="px-5 py-3 text-xs font-semibold text-[#8B1D2C] border border-[#8B1D2C]/40 rounded-lg hover:bg-white transition-colors"
                >
                  Speak With Relationship Advisor
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      {websiteContent.sectionVisibility.whyChooseUs && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#8B1D2C]">
                Distinguished Values
              </span>
              <h2 className="text-3xl sm:text-4xl font-brand font-bold text-[#4A0E17]">
                Why Families Trust Shubhbandhan
              </h2>
              <p className="text-sm text-[#6B5E5D]">
                Built from the ground up to respect cultural nuances, privacy rights, and genuine life intentions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#FFFDF9] p-8 rounded-2xl border border-[#E8DEC8] hover:border-[#D4AF37] transition-all shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#8B1D2C]/10 text-[#8B1D2C] flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-brand font-bold text-lg text-[#2D2424] mb-3">
                  Strict Contact Shielding
                </h3>
                <p className="text-xs text-[#554746] leading-relaxed">
                  We never broadcast phone numbers, emails, or personal coordinates publicly. Access is granted exclusively to vetted, approved active members.
                </p>
              </div>

              <div className="bg-[#FFFDF9] p-8 rounded-2xl border border-[#E8DEC8] hover:border-[#D4AF37] transition-all shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#8B1D2C]/10 text-[#8B1D2C] flex items-center justify-center mb-6">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-brand font-bold text-lg text-[#2D2424] mb-3">
                  Manual Verification Protocol
                </h3>
                <p className="text-xs text-[#554746] leading-relaxed">
                  Each applicant undergoes phone and identity verification to eliminate fake profiles, brokers, and unauthorized solicitations.
                </p>
              </div>

              <div className="bg-[#FFFDF9] p-8 rounded-2xl border border-[#E8DEC8] hover:border-[#D4AF37] transition-all shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-[#8B1D2C]/10 text-[#8B1D2C] flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-brand font-bold text-lg text-[#2D2424] mb-3">
                  Vedic Astrological Dossier
                </h3>
                <p className="text-xs text-[#554746] leading-relaxed">
                  In-depth Kundali, Rashi, Nakshatra, and Manglik assessment provided directly alongside family credentials for seamless alignment.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. SUCCESS STORIES */}
      {websiteContent.sectionVisibility.successStories && (
        <section id="success-stories" className="py-20 bg-[#FFFDF9] border-y border-[#E8DEC8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#8B1D2C]">
                Real Sacred Alliances
              </span>
              <h2 className="text-3xl sm:text-4xl font-brand font-bold text-[#4A0E17]">
                Blessed Success Stories
              </h2>
              <p className="text-sm text-[#6B5E5D]">
                Glimpses into radiant celebrations formed through thoughtful connections on Shubhbandhan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {successStories
                .filter((s) => s.isPublished)
                .map((story) => (
                  <div
                    key={story.id}
                    className="bg-[#FAF7F2] rounded-2xl border border-[#E8DEC8] overflow-hidden flex flex-col sm:flex-row shadow-sm hover:shadow transition-shadow"
                  >
                    <div className="sm:w-5/12 aspect-[4/3] sm:aspect-auto bg-[#2E1018]">
                      <img
                        src={story.photoUrl || '/images/couple_1.jpg'}
                        alt={story.coupleNames}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>
                    <div className="sm:w-7/12 p-6 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="text-xs text-[#8B1D2C] font-semibold mb-1">
                          {story.weddingDate} · {story.location}
                        </div>
                        <h3 className="font-brand font-bold text-xl text-[#2D2424]">
                          {story.coupleNames}
                        </h3>
                        <blockquote className="text-xs italic text-[#554746] mt-2 border-l-2 border-[#D4AF37] pl-3 py-1">
                          "{story.quote}"
                        </blockquote>
                        <p className="text-xs text-[#6B5E5D] mt-3 leading-relaxed">
                          {story.story}
                        </p>
                      </div>
                      <div className="text-[11px] text-[#7A6B6A] pt-2 border-t border-[#E8DEC8]">
                        Alliance verified & celebrated through Shubhbandhan
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. MEMBERSHIP PLANS SECTION */}
      {websiteContent.sectionVisibility.membershipPlans && (
        <section id="membership-plans" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#8B1D2C]">
                Affordable & Value Driven
              </span>
              <h2 className="text-3xl sm:text-4xl font-brand font-bold text-[#4A0E17]">
                Membership Plans & Pricing
              </h2>
              <p className="text-sm text-[#6B5E5D]">
                Choose the right plan to unlock verified phone numbers, direct parental communication, and full matchmaking features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {plans
                .filter((p) => p.isEnabled)
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((plan) => (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                      plan.isRecommended
                        ? 'bg-[#FFFDF9] border-2 border-[#D4AF37] shadow-xl ring-1 ring-[#D4AF37]/50'
                        : 'bg-[#FFFDF9] border border-[#E8DEC8] hover:border-[#D4AF37] shadow-sm'
                    }`}
                  >
                    {plan.isRecommended && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#8B1D2C] text-[#E8D8C8] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#D4AF37] shadow-sm">
                        {plan.badge || 'Recommended'}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-brand font-bold text-xl text-[#2D2424]">
                          {plan.name}
                        </h3>
                        {!plan.isRecommended && plan.badge && (
                          <span className="text-[11px] text-[#8B1D2C] font-semibold bg-[#8B1D2C]/10 px-2 py-0.5 rounded">
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#6B5E5D] mb-6 min-h-[32px]">
                        {plan.description}
                      </div>

                      <div className="mb-6 pb-6 border-b border-[#E8DEC8]">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl sm:text-4xl font-bold font-mono text-[#8B1D2C]">
                            {formatCurrencyINR(plan.price)}
                          </span>
                        </div>
                        <div className="text-xs text-[#7A6B6A] mt-1">
                          Duration: {plan.durationLabel}
                        </div>
                      </div>

                      <div className="space-y-3 mb-8">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#8B1D2C]">
                          Plan Inclusions:
                        </div>
                        <ul className="space-y-2.5 text-xs text-[#4A3E3D]">
                          {plan.benefits.map((b, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => handlePlanSelect(plan)}
                        className={`w-full py-3 px-4 text-xs font-semibold rounded-xl transition-all shadow-sm text-center block ${
                          plan.isRecommended
                            ? 'bg-[#8B1D2C] text-white hover:bg-[#721522] hover:shadow'
                            : 'bg-[#FAF5EE] text-[#8B1D2C] border border-[#8B1D2C]/30 hover:bg-[#8B1D2C] hover:text-white'
                        }`}
                      >
                        {currentUser
                          ? currentUser.type === 'admin'
                            ? 'Edit In Admin'
                            : 'Choose Plan & Pay via QR'
                          : 'Register & Choose Plan'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. CONTACT ADVISORY STRIP */}
      <section id="contact-info" className="py-16 bg-[#2E1018] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
                Personal Matchmaking Assistance
              </span>
              <h3 className="text-2xl font-brand font-bold text-white">
                Need Help Selecting Matches or Registering?
              </h3>
              <p className="text-xs text-[#E8D8C8]/80 max-w-xl">
                Our Senior Relationship Advisors are available Monday through Saturday to personally assist your family.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`tel:${websiteContent.contact.phone}`}
                className="px-6 py-3 rounded-xl bg-[#D4AF37] text-slate-950 font-semibold text-xs hover:bg-[#C59B27] transition-colors flex items-center gap-2 shadow"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call {websiteContent.contact.phone}</span>
              </a>
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
              >
                Start Free Registration
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QR Payment Simulation Modal if invoked */}
      <QrPaymentModal
        plan={selectedPlanForPayment}
        onClose={() => setSelectedPlanForPayment(null)}
        onSuccess={() => {
          navigate('/member');
        }}
      />
    </div>
  );
};
