import React from 'react';
import { Play, Code, CheckCircle, Zap } from 'lucide-react';

const Hero = ({ onNavigate }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 text-primary dark:text-indigo-400 px-4 py-2 rounded-full font-bold text-sm mb-6 animate-float">
              <Zap size={16} className="fill-primary dark:fill-indigo-400" />
              <span>The fun, effective way to learn</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-text-primary mb-6 leading-tight tracking-tight">
              Learn AI & ML<br className="hidden lg:block" />
            </h1>
            
            <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Bite-sized lessons, interactive practice, and a daily streak. 
              Join millions building skills in Machine Learning, Deep Learning, and Neural Networks.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={() => onNavigate && onNavigate('signup')}
                className="w-full sm:w-auto bg-primary hover:bg-indigo-700 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-[0_6px_0_0_rgba(67,56,202,1)] hover:shadow-[0_4px_0_0_rgba(55,48,163,1)] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-none transition-all cursor-pointer"
              >
                START LEARNING NOW
              </button>
              
              <button className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white dark:bg-slate-900 border-2 border-border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-text-primary dark:text-slate-100 font-bold text-lg px-8 py-4 rounded-2xl shadow-[0_6px_0_0_rgba(226,232,240,1)] dark:shadow-[0_6px_0_0_rgba(30,41,59,1)] hover:shadow-[0_4px_0_0_rgba(203,213,225,1)] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-none transition-all">
                <Play size={20} className="fill-text-primary dark:fill-slate-100" />
                <span>WATCH DEMO</span>
              </button>
            </div>
          </div>

          {/* Gamified UI Illustration */}
          <div className="w-full lg:w-1/2 relative h-[400px] lg:h-[500px]">
            {/* Main Phone Mockup */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[550px] bg-white dark:bg-slate-900 border-8 border-slate-900 rounded-[3rem] shadow-2xl overflow-hidden z-10">
              <div className="h-full w-full bg-background dark:bg-slate-950 p-4 flex flex-col">
                <div className="w-1/2 h-6 bg-border dark:bg-slate-800 mx-auto rounded-full mb-6" />
                <h3 className="font-bold text-xl text-text-primary mb-4">Define Neural Layer</h3>
                <p className="text-text-secondary text-sm mb-4">Complete the Dense layer initialization with 32 units.</p>
                
                <div className="bg-[#1E293B] rounded-xl p-4 mb-4 flex-grow font-mono text-xs text-slate-300">
                  <span className="text-pink-400">from</span>
                  <span className="text-slate-100"> keras.layers </span>
                  <span className="text-pink-400">import</span>
                  <span className="text-slate-100"> Dense</span>
                  <br /><br />
                  <span className="text-slate-100">layer = Dense(units=</span>
                  <div className="inline-block w-12 h-6 bg-slate-700 rounded animate-pulse align-middle mx-1" />
                  <span className="text-slate-100">)</span>
                </div>
                
                <div className="flex gap-2 mt-auto">
                  <button className="flex-1 bg-border dark:bg-slate-800 rounded-xl py-3 font-bold text-text-secondary dark:text-slate-300">32</button>
                  <button className="flex-1 bg-border dark:bg-slate-800 rounded-xl py-3 font-bold text-text-secondary dark:text-slate-300">Dense</button>
                </div>
                <button className="w-full bg-primary text-white rounded-xl py-3 font-bold mt-4">CHECK</button>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 left-0 lg:-left-10 glass dark:bg-slate-900/80 dark:border-slate-800 p-4 rounded-2xl flex items-center space-x-3 shadow-xl z-20 animate-float">
              <div className="bg-green-100 dark:bg-green-950/30 p-2 rounded-full">
                <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-bold text-text-primary dark:text-slate-100 text-sm">Lesson Complete!</p>
                <p className="text-xs text-text-secondary dark:text-slate-400 font-bold text-yellow-500">+10 XP Earned</p>
              </div>
            </div>

            <div className="absolute bottom-20 right-0 lg:-right-10 glass dark:bg-slate-900/80 dark:border-slate-800 p-4 rounded-2xl flex items-center space-x-3 shadow-xl z-20 animate-float-delayed">
              <div className="bg-accent/20 dark:bg-accent/10 p-2 rounded-full">
                 <span className="text-2xl">🔥</span>
              </div>
              <div>
                <p className="font-bold text-text-primary dark:text-slate-100 text-sm">7 Day Streak!</p>
                <p className="text-xs text-text-secondary dark:text-slate-400">Keep it up!</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
