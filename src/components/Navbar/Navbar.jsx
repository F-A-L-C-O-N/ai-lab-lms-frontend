import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';

const Navbar = ({ onNavigate, isAuthenticated, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

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
              className="text-primary dark:text-indigo-400 font-bold text-2xl tracking-tighter cursor-pointer bg-transparent border-none p-0 focus:outline-none"
            >
              AI Lab Learning Portal
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
              <button
                onClick={onLogout}
                className="border-2 border-red-200 hover:border-red-300 dark:border-red-900/50 dark:hover:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
              >
                LOG OUT
              </button>
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
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-border dark:border-slate-800 shadow-lg absolute w-full left-0">

            <div className="h-px bg-border dark:bg-slate-800 my-2"></div>

            {isAuthenticated ? (
              <div className="px-3 py-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLogout && onLogout();
                  }}
                  className="w-full text-center py-3 text-base font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/40 rounded-xl transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  LOG OUT
                </button>
              </div>
            ) : (
              <div className="px-3 py-2 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate && onNavigate('login');
                  }}
                  className="w-full text-center py-3 text-base font-bold text-text-primary dark:text-slate-100 bg-slate-50 dark:bg-slate-800/40 border-2 border-border dark:border-slate-800 rounded-xl transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  LOG IN
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate && onNavigate('signup');
                  }}
                  className="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-[0_4px_0_0_rgba(67,56,202,1)] active:shadow-none active:translate-y-1 transition-all cursor-pointer"
                >
                  GET STARTED
                </button>
              </div>
            )}
          </div>
      )}
    </header>
  );
};

export default Navbar;
