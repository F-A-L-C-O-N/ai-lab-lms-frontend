import React from 'react';
import { Star } from 'lucide-react';
import { roadmapData } from '../../data/roadmapData';

const getProgress = (name) => {
  const steps = roadmapData[name] || [];
  if (steps.length === 0) return 0;
  const completedSteps = JSON.parse(localStorage.getItem('AI Lab Learning Portal_completed_steps') || '{}');
  const completedList = completedSteps[name] || [];
  const totalMilestones = steps.length * 2 + 1;
  return Math.round((completedList.length / totalMilestones) * 100);
};

const tracks = [
  {
    id: 1,
    title: 'Linear & Logistic Regression',
    description: 'Learn parameter optimization, gradient descent, and cost function minimization.',
    time: '2 hours',
    lessons: 12,
    tag: 'Regression',
    color: 'bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50'
  },
  {
    id: 2,
    title: 'Decision Trees & Random Forests',
    description: 'Master entropy, information gain, and ensemble bagging algorithms.',
    time: '4 hours',
    lessons: 20,
    tag: 'Trees/Forests',
    color: 'bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50'
  },
  {
    id: 3,
    title: 'Support Vector Machines (SVM)',
    description: 'Understand margin maximization, support vectors, and kernel tricks.',
    time: '3 hours',
    lessons: 15,
    tag: 'Classification',
    color: 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/50'
  },
  {
    id: 4,
    title: 'K-Means Clustering',
    description: 'Dive into unsupervised learning, distance metrics, and centroid optimization.',
    xp: 300,
    time: '3 hours',
    lessons: 14,
    tag: 'Clustering',
    color: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
  }
];

const PopularTracks = ({ onCardClick }) => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-text-primary dark:text-slate-100 mb-4 tracking-tight">Trending ML Algorithms</h2>
            <p className="text-xl text-text-secondary dark:text-slate-400 font-medium">Practice coding foundational algorithms step-by-step.</p>
          </div>
          <button className="hidden md:block text-primary dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
            View all algorithms →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((track) => (
            <div 
              key={track.id} 
              onClick={() => onCardClick && onCardClick(track.title)}
              className="bg-white dark:bg-slate-950 rounded-3xl border-2 border-border dark:border-slate-800 p-6 hover:border-primary dark:hover:border-indigo-500 cursor-pointer transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_0_0_rgba(226,232,240,1)] dark:shadow-[0_4px_0_0_rgba(15,23,42,1)] hover:shadow-[0_4px_0_0_rgba(79,70,229,1)] flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${track.color}`}>
                  {track.tag}
                </span>
                <div className="flex items-center text-accent bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded-lg">
                  <Star size={14} className="fill-accent mr-1" />
                  <span className="text-xs font-bold">4.9</span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-text-primary dark:text-slate-100 mb-2 line-clamp-2">{track.title}</h3>
              <p className="text-sm text-text-secondary dark:text-slate-400 mb-4 flex-grow">{track.description}</p>
              
              <div className="pt-4 border-t border-border dark:border-slate-800 mt-auto">
                <div className="flex justify-between items-center text-xs font-bold text-text-secondary dark:text-slate-400 mb-2">
                  <span>Progress</span>
                  <span className="text-primary dark:text-indigo-400">{getProgress(track.title)}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden p-[1px] border border-slate-200/50 dark:border-slate-750">
                  <div 
                    className="bg-gradient-to-r from-primary to-indigo-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${getProgress(track.title)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <button className="bg-indigo-50 dark:bg-indigo-950/20 text-primary dark:text-indigo-400 font-bold px-6 py-3 rounded-xl w-full border border-indigo-100 dark:border-indigo-900/50">
            View all algorithms
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularTracks;
