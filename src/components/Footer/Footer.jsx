import React from 'react';
import { Flame } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 pt-12 pb-8 border-t border-border dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12">

        {/* Brand Section */}
        <div className="mb-10">
          <a href="#" className="flex items-center text-primary dark:text-indigo-400 font-bold text-2xl tracking-tighter mb-4">
            <Flame size={28} className="fill-primary dark:fill-indigo-400 mr-2" />
            AI Lab Learning Portal
          </a>
          <p className="text-text-secondary dark:text-slate-400 font-medium mb-6">
            The fun, effective way to learn to code. Build skills in 5 minutes a day with bite-sized lessons.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-slate-400 hover:text-primary dark:text-slate-500 dark:hover:text-slate-100 transition-colors font-bold text-sm">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-pink-600 dark:text-slate-500 dark:hover:text-slate-100 transition-colors font-bold text-sm">Instagram</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-100 transition-colors font-bold text-sm">GitHub</a>
            <a href="#" className="text-slate-400 hover:text-blue-700 dark:text-slate-500 dark:hover:text-slate-100 transition-colors font-bold text-sm">LinkedIn</a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border dark:border-slate-900 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 dark:text-slate-500 font-medium text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AI Lab Learning Portal Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm font-medium">
            <a href="#" className="text-slate-500 hover:text-primary dark:text-slate-500 dark:hover:text-slate-100">Guidelines</a>
            <a href="#" className="text-slate-500 hover:text-primary dark:text-slate-500 dark:hover:text-slate-100">Safety</a>
          </div>
        </div>

      </div>
    </footer>

  );
};

export default Footer;
