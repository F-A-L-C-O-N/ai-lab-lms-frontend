import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, Sun, User, ChevronDown, KeyRound, Eye, EyeOff, Lock, Check, Mail, Flame, Trophy, BookOpen } from 'lucide-react';
import logo from '../../assets/logo.png';

const Navbar = ({ onNavigate, isAuthenticated, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const getProfileStats = () => {
    const completedStepsObj = JSON.parse(localStorage.getItem('AI Lab Learning Portal_completed_steps') || '{}');
    let totalCompleted = 0;
    Object.values(completedStepsObj).forEach(list => {
      if (Array.isArray(list)) {
        totalCompleted += list.length;
      }
    });

    const savedStreak = localStorage.getItem('AI_Lab_Streak_Info');
    const streakInfo = savedStreak ? JSON.parse(savedStreak) : { count: 0, bestStreak: 0 };

    return {
      totalCompleted,
      streakCount: streakInfo.count || 0,
      bestStreak: streakInfo.bestStreak || 0
    };
  };
  
  // Change password form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Feedback states
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const dropdownRef = useRef(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    // Success (Mock update on frontend)
    setSuccessMessage('Password updated successfully!');
    
    // Clear form after a short delay and close modal
    setTimeout(() => {
      setIsChangePasswordOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('');
    }, 1800);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);


  return (
    <>
      <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-border dark:border-slate-800'
          : 'bg-background dark:bg-slate-950 border-b border-border dark:border-slate-900'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => onNavigate && onNavigate(isAuthenticated ? 'home' : 'landing')}
              className="flex items-center gap-2 sm:gap-3 text-primary dark:text-indigo-400 font-bold text-lg sm:text-2xl tracking-tighter cursor-pointer bg-transparent border-none p-0 focus:outline-none"
            >
              <img src={logo} alt="Logo" className="h-9 sm:h-12 w-auto object-contain" />
              <span>AI Lab Learning Portal</span>
            </button>
          </div>


          {/* Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Custom Day/Night Theme Toggle Switch */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="relative w-[72px] h-[34px] rounded-full transition-all duration-300 focus:outline-none overflow-hidden cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] border border-slate-300 dark:border-slate-800 shrink-0"
              style={{
                backgroundColor: isDarkMode ? '#112330' : '#fbe695'
              }}
              aria-label="Toggle Dark Mode"
            >
              {/* Day Mode Scenery */}
              {!isDarkMode && (
                <>
                  <div className="absolute left-[12px] top-[9px] w-[14px] h-[14px] rounded-full bg-white shadow-[0_0_10px_5px_rgba(255,255,255,0.4)]" />
                  <svg className="absolute bottom-0 left-0 w-full h-[14px] text-[#e7b848] fill-current" viewBox="0 0 72 14" preserveAspectRatio="none">
                    <path d="M0 14 L0 8 L15 3 L32 9 L50 2 L64 7 L72 5 L72 14 Z" opacity="0.6" fill="#d39e2f" />
                    <path d="M0 14 L0 10 L10 6 L24 10 L40 5 L55 9 L72 7 L72 14 Z" />
                  </svg>
                </>
              )}

              {/* Night Mode Scenery */}
              {isDarkMode && (
                <>
                  <div className="absolute right-[22px] top-[8px] w-1 h-1 bg-white rounded-full opacity-80 animate-pulse" />
                  <div className="absolute right-[14px] top-[14px] w-[2px] h-[2px] bg-white rounded-full opacity-60" />
                  <div className="absolute right-[32px] top-[12px] w-[2px] h-[2px] bg-white rounded-full opacity-50 animate-pulse" />
                  <svg className="absolute right-[8px] top-[8px] w-[14px] h-[14px] text-white/90 fill-current rotate-[15deg]" viewBox="0 0 24 24">
                    <path d="M21.75 16.25A10.75 10.75 0 0 1 12 3a10.75 10.75 0 1 0 9.75 13.25z"/>
                  </svg>
                  <svg className="absolute bottom-0 left-0 w-full h-[14px] text-[#3d5e7a] fill-current" viewBox="0 0 72 14" preserveAspectRatio="none">
                    <path d="M0 14 L0 8 L15 3 L32 9 L50 2 L64 7 L72 5 L72 14 Z" opacity="0.6" fill="#233a4c" />
                    <path d="M0 14 L0 10 L10 6 L24 10 L40 5 L55 9 L72 7 L72 14 Z" />
                  </svg>
                </>
              )}

              {/* Sliding Circular Knob */}
              <div 
                className={`absolute top-[3px] w-[26px] h-[26px] rounded-full bg-white shadow-md transition-all duration-300 ease-out transform ${
                  isDarkMode ? 'left-[4px]' : 'left-[40px]'
                }`}
              />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
                {/* Profile Button */}
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 border-2 border-border dark:border-slate-800 hover:border-primary dark:hover:border-indigo-500 text-text-primary dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                >
                  <User size={18} className="text-primary dark:text-indigo-400" />
                  
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-border dark:border-slate-800 mb-1">
                      <p className="text-xs font-semibold text-text-secondary dark:text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-text-primary dark:text-slate-150 truncate">{localStorage.getItem('userName') || 'Learner'}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-text-primary dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
                    >
                      <User size={16} className="text-primary dark:text-indigo-400" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsChangePasswordOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-text-primary dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
                    >
                      <KeyRound size={16} className="text-primary dark:text-indigo-400" />
                      Change Password
                    </button>
                  </div>
                )}

                <button
                  onClick={onLogout}
                  className="border-2 border-red-200 hover:border-red-300 dark:border-red-900/50 dark:hover:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                >
                  LOG OUT
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onNavigate && onNavigate('login')}
                  className="border-2 border-border dark:border-slate-800 hover:border-primary dark:hover:border-indigo-500 text-text-primary dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                >
                  LOG IN
                </button>

                <button
                  onClick={() => onNavigate && onNavigate('signup')}
                  className="bg-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_0_0_rgba(67,56,202,1)] hover:shadow-[0_4px_0_0_rgba(55,48,163,1)] active:shadow-none cursor-pointer"
                >
                  GET STARTED
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            {/* Custom Day/Night Theme Toggle Switch (Mobile) */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="relative w-[72px] h-[34px] rounded-full transition-all duration-300 focus:outline-none overflow-hidden cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] border border-slate-300 dark:border-slate-800 shrink-0"
              style={{
                backgroundColor: isDarkMode ? '#112330' : '#fbe695'
              }}
              aria-label="Toggle Dark Mode"
            >
              {/* Day Mode Scenery */}
              {!isDarkMode && (
                <>
                  <div className="absolute left-[12px] top-[9px] w-[14px] h-[14px] rounded-full bg-white shadow-[0_0_10px_5px_rgba(255,255,255,0.4)]" />
                  <svg className="absolute bottom-0 left-0 w-full h-[14px] text-[#e7b848] fill-current" viewBox="0 0 72 14" preserveAspectRatio="none">
                    <path d="M0 14 L0 8 L15 3 L32 9 L50 2 L64 7 L72 5 L72 14 Z" opacity="0.6" fill="#d39e2f" />
                    <path d="M0 14 L0 10 L10 6 L24 10 L40 5 L55 9 L72 7 L72 14 Z" />
                  </svg>
                </>
              )}

              {/* Night Mode Scenery */}
              {isDarkMode && (
                <>
                  <div className="absolute right-[22px] top-[8px] w-1 h-1 bg-white rounded-full opacity-80 animate-pulse" />
                  <div className="absolute right-[14px] top-[14px] w-[2px] h-[2px] bg-white rounded-full opacity-60" />
                  <div className="absolute right-[32px] top-[12px] w-[2px] h-[2px] bg-white rounded-full opacity-50 animate-pulse" />
                  <svg className="absolute right-[8px] top-[8px] w-[14px] h-[14px] text-white/90 fill-current rotate-[15deg]" viewBox="0 0 24 24">
                    <path d="M21.75 16.25A10.75 10.75 0 0 1 12 3a10.75 10.75 0 1 0 9.75 13.25z"/>
                  </svg>
                  <svg className="absolute bottom-0 left-0 w-full h-[14px] text-[#3d5e7a] fill-current" viewBox="0 0 72 14" preserveAspectRatio="none">
                    <path d="M0 14 L0 8 L15 3 L32 9 L50 2 L64 7 L72 5 L72 14 Z" opacity="0.6" fill="#233a4c" />
                    <path d="M0 14 L0 10 L10 6 L24 10 L40 5 L55 9 L72 7 L72 14 Z" />
                  </svg>
                </>
              )}

              {/* Sliding Circular Knob */}
              <div 
                className={`absolute top-[3px] w-[26px] h-[26px] rounded-full bg-white shadow-md transition-all duration-300 ease-out transform ${
                  isDarkMode ? 'left-[4px]' : 'left-[40px]'
                }`}
              />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-100 focus:outline-none p-1"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-xl rounded-2xl absolute right-4 top-[68px] w-52 p-3 z-50">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2 w-full">
                <div className="px-3 py-1.5 border-b border-border dark:border-slate-800 mb-1">
                  <p className="text-[10px] font-semibold text-text-secondary dark:text-slate-400 uppercase tracking-wider">Account</p>
                  <p className="text-xs font-bold text-text-primary dark:text-slate-150 truncate">{localStorage.getItem('userName') || 'Learner'}</p>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-text-primary dark:text-slate-100 bg-slate-50 dark:bg-slate-800/40 border-2 border-border dark:border-slate-800 rounded-xl transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  <User size={16} className="text-primary dark:text-indigo-400" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsChangePasswordOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-text-primary dark:text-slate-100 bg-slate-50 dark:bg-slate-800/40 border-2 border-border dark:border-slate-800 rounded-xl transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  <KeyRound size={16} className="text-primary dark:text-indigo-400" />
                  Change Password
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout && onLogout();
                  }}
                  className="w-full text-center py-2 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/40 rounded-xl transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  LOG OUT
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate && onNavigate('login');
                  }}
                  className="w-full text-center py-2 text-sm font-bold text-text-primary dark:text-slate-100 bg-slate-50 dark:bg-slate-800/40 border-2 border-border dark:border-slate-800 rounded-xl transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  LOG IN
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate && onNavigate('signup');
                  }}
                  className="w-full bg-primary text-white font-bold py-2 text-sm rounded-xl shadow-[0_3px_0_0_rgba(67,56,202,1)] active:shadow-none active:translate-y-1 transition-all cursor-pointer text-center"
                >
                  GET STARTED
                </button>
              </div>
            )}
          </div>
      )}

    </header>

    {/* Change Password Modal */}
    {isChangePasswordOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 border-2 border-border dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative transition-all duration-300 animate-in zoom-in-95 duration-200">
          {/* Close Button */}
          <button
            onClick={() => {
              setIsChangePasswordOpen(false);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className="absolute top-4 right-4 text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-100 transition-colors p-1 cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/30 mb-3">
              <Lock size={22} className="text-primary dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-black text-text-primary dark:text-slate-100 tracking-tight">Change Password</h3>
            <p className="text-xs font-medium text-text-secondary dark:text-slate-400 mt-1">
              Security update for your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 text-xs font-semibold bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-400 shrink-0" />
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-3 text-xs font-semibold bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-xl border border-green-100 dark:border-green-900/30 flex items-center gap-2">
                <Check size={16} className="text-green-600 dark:text-green-400 shrink-0" />
                {successMessage}
              </div>
            )}

            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-text-primary dark:text-slate-350 mb-1.5 uppercase tracking-wider">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-border dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-indigo-500 transition-colors pr-10 text-text-primary dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-100 cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-text-primary dark:text-slate-350 mb-1.5 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-border dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-indigo-500 transition-colors pr-10 text-text-primary dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-100 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-text-primary dark:text-slate-350 mb-1.5 uppercase tracking-wider">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-border dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary dark:focus:border-indigo-500 transition-colors pr-10 text-text-primary dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-100 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={successMessage !== ''}
              className="w-full bg-primary hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-[0_4px_0_0_rgba(67,56,202,1)] hover:shadow-[0_4px_0_0_rgba(55,48,163,1)] active:shadow-none active:translate-y-1 transition-all cursor-pointer text-center text-sm"
            >
              UPDATE PASSWORD
            </button>
          </form>
        </div>
      </div>
    )}

    {/* Profile Detail Modal */}
    {isProfileModalOpen && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-900 border-2 border-border dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative transition-all duration-300 animate-in zoom-in-95 duration-200">
          {/* Close Button */}
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="absolute top-4 right-4 text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-100 transition-colors p-1 cursor-pointer"
          >
            <X size={20} />
          </button>

          {/* Profile Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center border-2 border-indigo-100 dark:border-indigo-900/30 mb-4 shadow-lg">
              <User size={38} className="text-white" />
            </div>
            <h3 className="text-2xl font-black text-text-primary dark:text-slate-100 tracking-tight">
              {localStorage.getItem('userName') || 'Learner'}
            </h3>
            <p className="text-xs font-semibold text-text-secondary dark:text-slate-400 mt-1 flex items-center justify-center gap-1">
              <Mail size={12} className="text-slate-400" />
              {localStorage.getItem('userEmail') || 'No email associated'}
            </p>
          </div>

          {/* Stats Section */}
          <div className="space-y-4 pt-4 border-t border-border dark:border-slate-800/80">
            <h4 className="text-xs font-bold text-text-primary dark:text-slate-350 uppercase tracking-wider mb-2">
              Learning Achievements
            </h4>
            
            {(() => {
              const stats = getProfileStats();
              return (
                <div className="grid grid-cols-1 gap-3">
                  {/* Active Streak */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-border dark:border-slate-800/80 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center border border-orange-100 dark:border-orange-900/30">
                        <Flame size={18} className="text-orange-600 dark:text-orange-400 fill-orange-600 dark:fill-orange-400" />
                      </div>
                      <span className="text-sm font-bold text-text-primary dark:text-slate-200">Active Streak</span>
                    </div>
                    <span className="text-sm font-black text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-xl border border-orange-100 dark:border-orange-900/30">
                      {stats.streakCount} {stats.streakCount === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>

                  {/* Best Streak */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-border dark:border-slate-800/80 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center border border-amber-100 dark:border-amber-900/30">
                        <Trophy size={18} className="text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                      </div>
                      <span className="text-sm font-bold text-text-primary dark:text-slate-200">Best Streak</span>
                    </div>
                    <span className="text-sm font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-xl border border-amber-100 dark:border-amber-900/30">
                      {stats.bestStreak} {stats.bestStreak === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>

                  {/* Completed Steps */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 border border-border dark:border-slate-800/80 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/30">
                        <BookOpen size={18} className="text-primary dark:text-indigo-400" />
                      </div>
                      <span className="text-sm font-bold text-text-primary dark:text-slate-200">Completed Steps</span>
                    </div>
                    <span className="text-sm font-black text-primary dark:text-indigo-450 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                      {stats.totalCompleted} {stats.totalCompleted === 1 ? 'Milestone' : 'Milestones'}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Action button */}
          <div className="mt-6">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-[0_4px_0_0_rgba(67,56,202,1)] hover:shadow-[0_4px_0_0_rgba(55,48,163,1)] active:shadow-none active:translate-y-1 transition-all cursor-pointer text-center text-sm"
            >
              CLOSE PROFILE
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Navbar;
