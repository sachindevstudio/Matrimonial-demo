import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Menu, X, User, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { websiteContent, currentUser, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-[29px] z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#E8DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-brand font-bold tracking-tight text-[#8B1D2C] whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          >
            <span className="w-8 h-8 rounded-full bg-[#8B1D2C] text-[#D4AF37] flex items-center justify-center text-lg font-serif border border-[#D4AF37]">
              ॐ
            </span>
            <span>{websiteContent.branding.siteName}</span>
          </Link>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4A3E3D]">
            <Link to="/" className="hover:text-[#8B1D2C] transition-colors whitespace-nowrap shrink-0">
              Home
            </Link>
            <a href="#about-us" className="hover:text-[#8B1D2C] transition-colors whitespace-nowrap shrink-0">
              About Us
            </a>
            <a href="#how-it-works" className="hover:text-[#8B1D2C] transition-colors whitespace-nowrap shrink-0">
              How It Works
            </a>
            <a href="#success-stories" className="hover:text-[#8B1D2C] transition-colors whitespace-nowrap shrink-0">
              Success Stories
            </a>
            <a href="#membership-plans" className="hover:text-[#8B1D2C] transition-colors whitespace-nowrap shrink-0">
              Plans
            </a>
          </nav>

          {/* Zone 3: 1 primary action or user session */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {currentUser?.type === 'admin' ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#D4AF37] text-[#1A0B10] hover:bg-[#C59B27] transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
                >
                  <Shield className="w-3.5 h-3.5" /> Admin Dashboard
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="px-3 py-2 text-xs font-medium text-[#6B5E5D] hover:text-[#8B1D2C] whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : currentUser?.type === 'member' ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/member"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#8B1D2C] text-white hover:bg-[#721522] transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  {currentUser.member.fullName.split(' ')[0]}'s Dashboard
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="px-3 py-2 text-xs font-medium text-[#6B5E5D] hover:text-[#8B1D2C] whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs font-medium text-[#4A3E3D] hover:text-[#8B1D2C] transition-colors whitespace-nowrap shrink-0"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-xs font-semibold tracking-wide text-white bg-[#8B1D2C] rounded-lg hover:bg-[#721522] shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#4A3E3D] hover:text-[#8B1D2C]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8DEC8] bg-[#FFFDF9] px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#4A3E3D] hover:text-[#8B1D2C]"
          >
            Home
          </Link>
          <a
            href="#about-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#4A3E3D] hover:text-[#8B1D2C]"
          >
            About Us
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#4A3E3D] hover:text-[#8B1D2C]"
          >
            How It Works
          </a>
          <a
            href="#success-stories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#4A3E3D] hover:text-[#8B1D2C]"
          >
            Success Stories
          </a>
          <a
            href="#membership-plans"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[#4A3E3D] hover:text-[#8B1D2C]"
          >
            Membership Plans
          </a>

          <div className="pt-3 border-t border-[#E8DEC8] flex flex-col gap-2">
            {currentUser?.type === 'admin' ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold rounded-lg bg-[#D4AF37] text-[#1A0B10]"
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                  className="w-full text-center py-2 text-sm text-[#8B1D2C]"
                >
                  Logout
                </button>
              </>
            ) : currentUser?.type === 'member' ? (
              <>
                <Link
                  to="/member"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold rounded-lg bg-[#8B1D2C] text-white"
                >
                  My Dashboard ({currentUser.member.fullName})
                </Link>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                  className="w-full text-center py-2 text-sm text-[#8B1D2C]"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-medium border border-[#8B1D2C]/30 text-[#8B1D2C] rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-medium bg-[#8B1D2C] text-white rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
