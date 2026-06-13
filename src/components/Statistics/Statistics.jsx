import React from 'react';
import { Users, BookOpen, Trophy, Globe } from 'lucide-react';

const stats = [
  { id: 1, name: 'Active Learners', value: '50M+', icon: Users, color: 'text-primary dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-950/40' },
  { id: 2, name: 'Bite-sized Lessons', value: '10,000+', icon: BookOpen, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-950/40' },
  { id: 3, name: 'Daily Habit Builders', value: '5M+', icon: Trophy, color: 'text-accent', bg: 'bg-amber-100 dark:bg-amber-950/40' },
  { id: 4, name: 'Countries Reached', value: '190+', icon: Globe, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-950/40' },
];

const Statistics = () => {
  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-y border-border dark:border-slate-800 relative z-20 transition-colors duration-300">
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-300">
              <div className={`p-4 rounded-2xl ${stat.bg} mb-4`}>
                <stat.icon size={32} className={stat.color} />
              </div>
              <p className="text-4xl font-black text-text-primary dark:text-slate-100 mb-2 tracking-tight">{stat.value}</p>
              <p className="text-text-secondary dark:text-slate-400 font-bold uppercase tracking-wider text-sm">{stat.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
