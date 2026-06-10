import React from 'react';
import { Lock, Flame, Check } from 'lucide-react';
import { roadmapData } from '../../data/roadmapData';
import { getLearningPaths } from '../../data/topics';

const paths = getLearningPaths();

const LearningPaths = ({ onCardClick, userName }) => {
  // Load and verify streak info dynamically
  const getStreakInfo = () => {
    const saved = localStorage.getItem('AI_Lab_Streak_Info');
    let streakInfo = saved ? JSON.parse(saved) : { count: 0, lastActivityDate: '', bestStreak: 0, history: [] };
    if (!streakInfo.history) streakInfo.history = [];

    // Check if streak is broken (last activity older than yesterday)
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streakInfo.lastActivityDate && streakInfo.lastActivityDate !== today && streakInfo.lastActivityDate !== yesterdayStr) {
      streakInfo.count = 0;
      localStorage.setItem('AI_Lab_Streak_Info', JSON.stringify(streakInfo));
    }
    return streakInfo;
  };

  const streakInfo = getStreakInfo();

  // Generate dynamic weekly progress calendar from Monday to Sunday
  const getWeeklyProgress = (history) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const day = today.getDay();
    // Calculate Monday of the current week
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.getTime());
    monday.setDate(diff);

    const weekly = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday.getTime());
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = daysOfWeek[d.getDay()];
      weekly.push({
        day: dayLabel,
        active: history.includes(dateStr)
      });
    }
    return weekly;
  };

  const weeklyProgress = getWeeklyProgress(streakInfo.history);

  const getProgress = (name) => {
    const steps = roadmapData[name] || [];
    if (steps.length === 0) return 0;
    const completedSteps = JSON.parse(localStorage.getItem('AI Lab Learning Portal_completed_steps') || '{}');
    const completedList = completedSteps[name] || [];
    const totalMilestones = steps.length * 2 + 1;
    return Math.round((completedList.length / totalMilestones) * 100);
  };

  const dynamicPaths = paths.map(path => ({
    ...path,
    progress: getProgress(path.name)
  }));
  return (
    <section className="pt-12 pb-24 bg-background dark:bg-slate-950 transition-colors duration-300" id="learn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header and Streak Section (Side-by-Side Flex Layout) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16 pb-8 border-b border-slate-100 dark:border-slate-800/60">
          <div className="max-w-xl">
            {userName && (
              <div className="flex items-center gap-2 mb-8">
                <span className="text-2xl sm:text-3xl font-black text-text-primary dark:text-slate-100 tracking-tight uppercase">
                  Welcome, {userName}
                </span>
                <span className="text-2xl sm:text-3xl animate-wave">👋</span>
              </div>
            )}
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
                {streakInfo.count > 0 && (
                  <span className="absolute -bottom-0.5 -right-0.5 bg-green-500 text-white rounded-full p-0.5 border-2 border-white dark:border-slate-900 shadow-sm">
                    <Check size={8} className="stroke-[3]" />
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-black text-text-primary dark:text-slate-100 tracking-tight">{streakInfo.count} {streakInfo.count === 1 ? 'Day' : 'Days'}</h4>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    streakInfo.count > 0 
                      ? 'text-green-600 dark:text-green-400 bg-green-100/70 dark:bg-green-950/40 border border-green-200 dark:border-green-800/40'
                      : 'text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  }`}>{streakInfo.count > 0 ? 'Active' : 'Inactive'}</span>
                </div>
                <p className="text-text-secondary dark:text-slate-400 text-xs font-semibold text-left">Best: {streakInfo.bestStreak} {streakInfo.bestStreak === 1 ? 'day' : 'days'}</p>
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
          {dynamicPaths.map((path) => (
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

              
              <h3 className="text-xl font-bold text-text-primary dark:text-slate-100 mb-2">{path.name}</h3>
              
              {!path.locked ? (
                <div>
                  <div className="flex justify-between items-center text-sm font-bold text-text-secondary dark:text-slate-400 mb-2">
                    <span>Progress</span>
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
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500">Locked</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningPaths;
