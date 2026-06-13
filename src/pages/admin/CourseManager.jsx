import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Layers, Plus, Trash } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

export default function CourseManager({ onNavigate, isAuthenticated, onLogout }) {
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const savedCourses = localStorage.getItem('AI_Lab_Admin_Courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
  }, []);

  const handleCreateCourse = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedName = newCourseName.trim();
    if (!trimmedName) {
      setError('Course name cannot be blank.');
      return;
    }

    if (courses.includes(trimmedName)) {
      setError('Course already exists.');
      return;
    }

    const updatedCourses = [...courses, trimmedName];
    setCourses(updatedCourses);
    localStorage.setItem('AI_Lab_Admin_Courses', JSON.stringify(updatedCourses));

    // Initialize blank topics for this course
    const savedTopics = localStorage.getItem('AI_Lab_Admin_Topics');
    const topicsMap = savedTopics ? JSON.parse(savedTopics) : {};
    topicsMap[trimmedName] = [];
    localStorage.setItem('AI_Lab_Admin_Topics', JSON.stringify(topicsMap));

    // Trigger POST mock request to keep aligned with API goals
    fetch('/api/v1/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmedName })
    }).catch(() => {
      // Ignore API errors for mock-safety
    });

    setNewCourseName('');
    setSuccess(`Course "${trimmedName}" created successfully!`);
  };

  const handleDeleteCourse = (courseName) => {
    if (!window.confirm(`Are you sure you want to delete course "${courseName}"?`)) return;

    const updated = courses.filter(c => c !== courseName);
    setCourses(updated);
    localStorage.setItem('AI_Lab_Admin_Courses', JSON.stringify(updated));

    const savedTopics = localStorage.getItem('AI_Lab_Admin_Topics');
    if (savedTopics) {
      const topicsMap = JSON.parse(savedTopics);
      delete topicsMap[courseName];
      localStorage.setItem('AI_Lab_Admin_Topics', JSON.stringify(topicsMap));
    }

    // Trigger DELETE mock request
    fetch(`/api/v1/courses/${encodeURIComponent(courseName)}`, {
      method: 'DELETE'
    }).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} onNavigate={onNavigate} />

      <main className="flex-1 max-w-full px-6 sm:px-8 lg:px-12 pt-24 pb-10 space-y-8">
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin')}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-text-primary dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 p-2.5 rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-primary dark:text-indigo-400 font-black text-xs uppercase tracking-widest mb-0.5">
                <Layers size={14} />
                <span>COURSE MANAGER</span>
              </div>
              <h1 className="text-2xl font-black text-text-primary dark:text-slate-100 tracking-tight">
                Create and Configure Courses
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Create Form */}
          <form
            onSubmit={handleCreateCourse}
            className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <h2 className="text-base font-black text-text-primary dark:text-slate-250 mb-3">
              Add New Course
            </h2>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 text-red-500 text-xs font-bold p-3.5 rounded-xl border border-red-200/50 dark:border-red-950/50">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold p-3.5 rounded-xl border border-emerald-200/50 dark:border-emerald-950/50">
                {success}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                Course Name
              </label>
              <input
                type="text"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-3 rounded-xl text-sm font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                placeholder="e.g. Advanced Python and Data Science"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-primary/10 active:scale-95 cursor-pointer"
            >
              <Plus size={16} /> Create Course
            </button>
          </form>

          {/* Courses List */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-black text-text-primary dark:text-slate-250">
              Configured Courses
            </h2>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {courses.map((course, idx) => (
                <div key={idx} className="flex justify-between items-center py-3.5">
                  <div className="text-sm font-bold text-text-primary dark:text-slate-200">
                    {course}
                  </div>
                  <button
                    onClick={() => handleDeleteCourse(course)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash size={15} />
                  </button>
                </div>
              ))}
              {courses.length === 0 && (
                <div className="text-center py-10 text-xs italic text-text-secondary dark:text-slate-400">
                  No courses exist yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
