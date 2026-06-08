import React from 'react';
import { Flame } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 pt-16 pb-8 border-t border-border dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="col-span-2 lg:col-span-2">
            <a href="#" className="flex items-center text-primary dark:text-indigo-400 font-bold text-2xl tracking-tighter mb-4">
              <Flame size={28} className="fill-primary dark:fill-indigo-400 mr-2" />
              LearnHub
            </a>
            <p className="text-text-secondary dark:text-slate-400 font-medium mb-6 max-w-sm">
              The fun, effective way to learn to code. Build skills in 5 minutes a day with bite-sized lessons.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary dark:text-slate-500 dark:hover:text-slate-100 transition-colors font-bold text-sm">
                Twitter
              </a>
              <a href="#" className="text-slate-400 hover:text-pink-600 dark:text-slate-500 dark:hover:text-slate-100 transition-colors font-bold text-sm">
                Instagram
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-100 transition-colors font-bold text-sm">
                GitHub
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-700 dark:text-slate-500 dark:hover:text-slate-100 transition-colors font-bold text-sm">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Links Cols */}
          <div>
            <h4 className="font-bold text-text-primary dark:text-slate-200 mb-4">About</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 font-medium transition-colors">Our Mission</a></li>
              <li><a href="#" className="text-text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 font-medium transition-colors">Careers</a></li>
              <li><a href="#" className="text-text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 font-medium transition-colors">Research</a></li>
              <li><a href="#" className="text-text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 font-medium transition-colors">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-text-primary dark:text-slate-200 mb-4">Products</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 font-medium transition-colors">LearnHub App</a></li>
              <li><a href="#" className="text-text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 font-medium transition-colors">LearnHub for Schools</a></li>
              <li><a href="#" className="text-text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 font-medium transition-colors">LearnHub for Business</a></li>
              <li><a href="#" className="text-text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 font-medium transition-colors">Podcast</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-text-primary dark:text-slate-200 mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 font-medium transition-colors">Help Center</a></li>
              <li><a href="#" className="text-text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 font-medium transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 font-medium transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 font-medium transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border dark:border-slate-900 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 dark:text-slate-500 font-medium text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} LearnHub Inc. All rights reserved.
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
