import React from 'react';
import { Brain, Cpu, Database, Eye, MessageSquare, Sparkles, Lock, Flame, Check, Calendar } from 'lucide-react';

const paths = [
  { id: 1, name: 'Machine Learning Foundations', icon: Database, color: 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400', level: 12, progress: 65 },
  { id: 2, name: 'Deep Learning & Neural Nets', icon: Brain, color: 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400', level: 8, progress: 40 },
  { id: 3, name: 'Natural Language Processing', icon: MessageSquare, color: 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400', level: 3, progress: 15 },
  { id: 4, name: 'Computer Vision', icon: Eye, color: 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400', level: 0, progress: 0, locked: true },
  { id: 5, name: 'Reinforcement Learning', icon: Cpu, color: 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400', level: 0, progress: 0, locked: true },
  { id: 6, name: 'Generative AI & LLMs', icon: Sparkles, color: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400', level: 0, progress: 0, locked: true },
];

const weeklyProgress = [
  { day: 'Mon', active: true },
  { day: 'Tue', active: true },
  { day: 'Wed', active: true },
  { day: 'Thu', active: true },
  { day: 'Fri', active: true },
  { day: 'Sat', active: false },
  { day: 'Sun', active: false },
];

const LearningPaths = ({ onCardClick }) => {
  return (
    <section className="py-24 bg-background dark:bg-slate-950 transition-colors duration-300" id="learn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header and Streak Section (Side-by-Side Flex Layout) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16 pb-8 border-b border-slate-100 dark:border-slate-800/60">
          <div className="max-w-xl">
            <h2 className="text-4xl font-extrabold text-text-primary dark:text-slate-100 mb-4 tracking-tight">
              Choose Your Learning Path
            </h2>
            <p className="text-lg text-text-secondary dark:text-slate-400 font-medium leading-relaxed">
              Start with the mathematical foundations of ML, explore deep neural architectures, or dive into state-of-the-art Generative AI.
            </p>
          </div>

          {/* Premium Landscape Streak Holder - Far Right Aligned, Extra Wide & Spaced */}
          <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 rounded-3xl p-5 border-2 border-amber-500/20 dark:border-amber-500/10 shadow-lg shadow-amber-500/5 dark:shadow-none flex flex-col md:flex-row items-center gap-8 w-full lg:w-[620px] shrink-0 relative overflow-hidden ml-auto">
            {/* Background glowing effect */}
            <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Daily Streak summary */}
            <div className="flex items-center gap-4 md:border-r border-slate-200 dark:border-slate-800 md:pr-6 shrink-0 w-full md:w-auto">
              <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40 rounded-2xl shrink-0 shadow-inner">
                <Flame size={32} className="text-amber-500 fill-amber-500 animate-bounce" style={{ animationDuration: '3s' }} />
                <span className="absolute -bottom-0.5 -right-0.5 bg-green-500 text-white rounded-full p-0.5 border-2 border-white dark:border-slate-900 shadow-sm">
                  <Check size={8} className="stroke-[3]" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-black text-text-primary dark:text-slate-100 tracking-tight">12 Days</h4>
                  <span className="text-[9px] font-extrabold text-green-600 dark:text-green-400 bg-green-100/70 dark:bg-green-950/40 border border-green-200 dark:border-green-800/40 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                </div>
                <p className="text-text-secondary dark:text-slate-400 text-xs font-semibold">Best: 24 days</p>
              </div>
            </div>

            {/* Weekly calendar tracker - stretched with min-w-[340px] and gap-3.5 */}
            <div className="flex-grow flex flex-col justify-center w-full min-w-[340px] md:border-r border-slate-200 dark:border-slate-800 md:pr-6">
              <div className="flex justify-between gap-3.5">
                {weeklyProgress.map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-text-secondary dark:text-slate-500 mb-1.5">{day.day[0]}</span>
                    <div 
                      className={`w-8 h-8 rounded-xl flex items-center justify-center border font-bold text-[10px] transition-all duration-300 ${
                        day.active 
                          ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-sm scale-105' 
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800/60 text-slate-300 dark:text-slate-500'
                      }`}
                    >
                      {day.active ? <Flame size={14} className="fill-amber-500 text-amber-500" /> : day.day[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Freeze info */}
            <div className="flex items-center justify-center shrink-0 w-full md:w-auto">
              <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 px-3 py-2 rounded-xl shadow-sm hover:scale-105 transition-all">
                Freeze: 1 Active
              </span>
            </div>
          </div>
        </div>

        {/* Path cards grid - 3 columns on large screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paths.map((path) => (
            <div 
              key={path.id} 
              onClick={() => !path.locked && onCardClick && onCardClick(path.name)}
              className={`relative bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 ${
                path.locked 
                  ? 'border-border/50 dark:border-slate-800/50 opacity-75' 
                  : 'border-border dark:border-slate-800 hover:border-primary dark:hover:border-indigo-500 cursor-pointer hover:-translate-y-1 shadow-[0_4px_0_0_rgba(226,232,240,1)] dark:shadow-[0_4px_0_0_rgba(15,23,42,1)] hover:shadow-[0_4px_0_0_rgba(79,70,229,1)]'
              } transition-all duration-300`}
            >
              {path.locked && (
                <div className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 p-2 rounded-full">
                  <Lock size={16} className="text-slate-400 dark:text-slate-500" />
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${path.locked ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500' : path.color} mb-6`}>
                <path.icon size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-text-primary dark:text-slate-100 mb-2">{path.name}</h3>
              
              {!path.locked ? (
                <div>
                  <div className="flex justify-between items-center text-sm font-bold text-text-secondary dark:text-slate-400 mb-2">
                    <span>Level {path.level}</span>
                    <span>{path.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-primary h-3 rounded-full" 
                      style={{ width: `${path.progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500">Unlock at Level 5</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningPaths;
