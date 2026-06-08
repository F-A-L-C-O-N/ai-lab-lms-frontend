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
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-100 hover:bg-border/50 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className="text-text-secondary dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-bold text-sm tracking-widest transition-colors duration-200 cursor-pointer"
              >
                LOG OUT
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate && onNavigate('login')}
                  className="text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-100 font-bold text-sm tracking-widest transition-colors duration-200 cursor-pointer"
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
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-100 hover:bg-border/50 dark:hover:bg-slate-800 rounded-full transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
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
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLogout && onLogout();
                }}
                className="w-full text-left px-3 py-3 text-base font-bold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
              >
                LOG OUT
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate && onNavigate('login');
                  }}
                  className="w-full text-left px-3 py-3 text-base font-bold text-text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                >
                  LOG IN
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate && onNavigate('signup');
                  }}
                  className="w-full mt-4 bg-primary text-white font-bold py-3 rounded-xl shadow-[0_4px_0_0_rgba(67,56,202,1)] active:shadow-none active:translate-y-1 transition-all cursor-pointer"
                >
                  GET STARTED
                </button>
              </>
            )}
          </div>
      )}
    </header>
  );
};

export default Navbar;
