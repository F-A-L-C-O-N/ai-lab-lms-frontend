import React from 'react';

const CTA = () => {
  return (
    <section className="py-24 bg-background dark:bg-slate-950 border-t border-border dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary dark:text-slate-100 mb-6 tracking-tight">
          Ready to start your coding journey?
        </h2>
        <p className="text-xl text-text-secondary dark:text-slate-400 font-medium mb-10 max-w-2xl mx-auto">
          Join us and start building your tech skills today.
        </p>
        <button className="bg-primary hover:bg-indigo-700 text-white font-bold text-xl px-12 py-5 rounded-2xl shadow-[0_6px_0_0_rgba(67,56,202,1)] hover:shadow-[0_4px_0_0_rgba(55,48,163,1)] hover:translate-y-[2px] active:translate-y-[6px] active:shadow-none transition-all w-full sm:w-auto">
          GET STARTED FOR FREE
        </button>
      </div>
    </section>
  );
};

export default CTA;
