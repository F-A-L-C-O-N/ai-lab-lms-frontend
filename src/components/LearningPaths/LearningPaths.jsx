import React from 'react';
import { Brain, Cpu, Database, Eye, MessageSquare, Sparkles, Lock } from 'lucide-react';

const paths = [
  { id: 1, name: 'Machine Learning Foundations', icon: Database, color: 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400', level: 12, progress: 65 },
  { id: 2, name: 'Deep Learning & Neural Nets', icon: Brain, color: 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400', level: 8, progress: 40 },
  { id: 3, name: 'Natural Language Processing', icon: MessageSquare, color: 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400', level: 3, progress: 15 },
  { id: 4, name: 'Computer Vision', icon: Eye, color: 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400', level: 0, progress: 0, locked: true },
  { id: 5, name: 'Reinforcement Learning', icon: Cpu, color: 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400', level: 0, progress: 0, locked: true },
  { id: 6, name: 'Generative AI & LLMs', icon: Sparkles, color: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400', level: 0, progress: 0, locked: true },
];

const LearningPaths = ({ onCardClick }) => {
  return (
    <section className="py-24 bg-background dark:bg-slate-950 transition-colors duration-300" id="learn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-text-primary dark:text-slate-100 mb-4 tracking-tight">Choose Your Learning Path</h2>
          <p className="text-xl text-text-secondary dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Start with the mathematical foundations of ML, explore deep neural architectures, or dive into state-of-the-art Generative AI.
          </p>
        </div>

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
