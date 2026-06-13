import React from 'react';
import { Flame, Check, Calendar } from 'lucide-react';


const weeklyProgress = [
  { day: 'Mon', active: true },
  { day: 'Tue', active: true },
  { day: 'Wed', active: true },
  { day: 'Thu', active: true },
  { day: 'Fri', active: true },
  { day: 'Sat', active: false },
  { day: 'Sun', active: false },
];

const Gamification = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/40 transition-colors duration-300" id="quests">
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-text-primary dark:text-slate-100 mb-4 tracking-tight">Make Learning a Habit</h2>
          <p className="text-xl text-text-secondary dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Complete daily quests, keep your streak alive, and build your coding habits.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Streak Tracker */}
          <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 border-2 border-border dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border dark:border-slate-800">
                <h3 className="text-2xl font-bold text-text-primary dark:text-slate-100 flex items-center">
                  <Flame className="mr-2 text-accent fill-accent" size={28} /> Daily Streak
                </h3>
                <span className="text-sm font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 px-3 py-1 rounded-lg">Active</span>
              </div>
              
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-50 dark:bg-amber-950/20 rounded-full mb-4 relative">
                  <Flame size={48} className="text-accent fill-accent animate-pulse" />
                  <span className="absolute bottom-1 right-1 bg-green-500 text-white rounded-full p-1 border-2 border-white dark:border-slate-950">
                    <Check size={12} className="stroke-[3]" />
                  </span>
                </div>
                <h4 className="text-4xl font-black text-text-primary dark:text-slate-100 mb-1">12 Days</h4>
                <p className="text-text-secondary dark:text-slate-400 font-bold text-sm">Personal Best: 24 days</p>
              </div>

              {/* Weekly calendar tracker */}
              <div className="mt-6">
                <p className="text-sm font-bold text-text-secondary dark:text-slate-400 mb-3 flex items-center">
                  <Calendar size={16} className="mr-1.5" /> This Week
                </p>
                <div className="flex justify-between">
                  {weeklyProgress.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-xs font-bold text-text-secondary dark:text-slate-500 mb-2">{day.day[0]}</span>
                      <div 
                        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 font-bold text-xs ${
                          day.active 
                            ? 'bg-accent/15 dark:bg-accent/10 border-accent dark:border-accent/40 text-accent' 
                            : 'bg-slate-50 dark:bg-slate-900 border-border dark:border-slate-800 text-slate-300 dark:text-slate-500'
                        }`}
                      >
                        {day.active ? <Flame size={16} className="fill-accent" /> : day.day[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-border dark:border-slate-800 flex items-center justify-between text-sm font-bold text-text-secondary dark:text-slate-400">
              <span>Streak Freeze: 1 Active</span>
              <button className="text-primary dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gamification;
