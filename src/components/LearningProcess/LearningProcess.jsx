import React from 'react';
import { BookOpen, Code, Terminal, Trophy } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Bite-sized Lessons',
    description: 'Perfect for your commute or coffee break.',
    icon: BookOpen,
    color: 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
  },
  {
    id: 2,
    title: 'Interactive Practice',
    description: 'Type real code, run it, and get instant feedback right in your browser.',
    icon: Code,
    color: 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400'
  },
  {
    id: 3,
    title: 'Build Projects',
    description: 'Apply what you learn by building real-world applications and games.',
    icon: Terminal,
    color: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
  },
  {
    id: 4,
    title: 'Earn Streaks',
    description: 'More Streaks = More Motivation.',
    icon: Trophy,
    color: 'bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400'
  }
];

const LearningProcess = () => {
  return (
    <section className="py-24 bg-background dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-text-primary dark:text-slate-100 mb-4 tracking-tight">How It Works</h2>
          <p className="text-xl text-text-secondary dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Our scientifically proven method makes learning to code easy and fun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex flex-col items-center text-center">
              {/* Connector line for desktop */}
              {index !== steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-border dark:bg-slate-800 border-dashed border-t-2" />
              )}
              
              <div className={`w-24 h-24 rounded-3xl ${step.color} flex items-center justify-center mb-6 relative z-10 shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300`}>
                <step.icon size={40} />
              </div>
              
              <h3 className="text-2xl font-bold text-text-primary dark:text-slate-100 mb-3">{step.title}</h3>
              <p className="text-text-secondary dark:text-slate-400 font-medium leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningProcess;
