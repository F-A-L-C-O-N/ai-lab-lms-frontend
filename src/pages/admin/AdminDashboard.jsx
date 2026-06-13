import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash, Edit3, BookOpen, ArrowLeft, Layers, Trophy, Users, BarChart2, Search, Shield, Flame, CheckCircle2, ShieldAlert, Upload } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { fetchCourses } from '../../api/api';

export default function AdminDashboard({ onNavigate, isAuthenticated, onLogout }) {
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState({});
  const [activeSubTab, setActiveSubTab] = useState('courses'); // 'courses', 'users', 'analytics'

  // File Upload Reference
  const fileInputRef = useRef(null);

  // User Management States
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    // 1. Initialize Courses & Topics from API
    const loadFromApi = async () => {
      try {
        const allCourses = await fetchCourses();
        const map = {};
        allCourses.forEach(c => {
          if (!map[c.courseName]) map[c.courseName] = [];
          map[c.courseName].push(c);
        });
        const courseList = Object.keys(map);
        setCourses(courseList);
        setTopics(map);
        localStorage.setItem('AI_Lab_Admin_Courses', JSON.stringify(courseList));
        localStorage.setItem('AI_Lab_Admin_Topics', JSON.stringify(map));
      } catch (err) {
        console.error('Failed to fetch courses for admin:', err);
        // Fallback to localStorage cache
        const savedCourses = localStorage.getItem('AI_Lab_Admin_Courses');
        const savedTopics = localStorage.getItem('AI_Lab_Admin_Topics');
        if (savedCourses && savedTopics) {
          setCourses(JSON.parse(savedCourses));
          setTopics(JSON.parse(savedTopics));
        }
      }
    };

    loadFromApi();

    // 2. Initialize Users Registry
    const savedUsers = localStorage.getItem('AI_Lab_Admin_Users_List');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const defaultUsers = [
        { id: 1, name: 'Raju Kumar', email: 'raju@gmail.com', role: 'Student', streak: 5, completedMilestones: 3, lastActive: '2026-06-12' },
        { id: 2, name: 'System Admin', email: 'admin@ailab.com', role: 'Admin', streak: 12, completedMilestones: 8, lastActive: '2026-06-13' },
        { id: 3, name: 'Priya Sharma', email: 'priya@gmail.com', role: 'Student', streak: 0, completedMilestones: 1, lastActive: '2026-06-08' },
        { id: 4, name: 'Rohan Verma', email: 'rohan@gmail.com', role: 'Student', streak: 2, completedMilestones: 2, lastActive: '2026-06-11' },
        { id: 5, name: 'Ananya Roy', email: 'ananya@gmail.com', role: 'Student', streak: 8, completedMilestones: 4, lastActive: '2026-06-13' }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('AI_Lab_Admin_Users_List', JSON.stringify(defaultUsers));
    }
  }, []);

  const handleDeleteCourse = (courseName) => {
    if (!window.confirm(`Are you sure you want to delete course "${courseName}" and all its topics?`)) return;

    const newCourses = courses.filter(c => c !== courseName);
    const newTopics = { ...topics };
    delete newTopics[courseName];

    setCourses(newCourses);
    setTopics(newTopics);
    localStorage.setItem('AI_Lab_Admin_Courses', JSON.stringify(newCourses));
    localStorage.setItem('AI_Lab_Admin_Topics', JSON.stringify(newTopics));
  };

  // User CRUD Operations
  const handleToggleRole = (userId) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        const nextRole = u.role === 'Admin' ? 'Student' : 'Admin';
        return { ...u, role: nextRole };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('AI_Lab_Admin_Users_List', JSON.stringify(updatedUsers));
  };

  const handleDeleteUser = (userId, userName) => {
    if (!window.confirm(`Are you sure you want to remove user "${userName}"?`)) return;
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('AI_Lab_Admin_Users_List', JSON.stringify(updatedUsers));
  };

  const handleResetStreak = (userId) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) return { ...u, streak: 0 };
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('AI_Lab_Admin_Users_List', JSON.stringify(updatedUsers));
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        let newCourses = [...courses];
        let newTopics = { ...topics };
        let addedCount = 0;

        const importSingleCourse = (courseName, topicsArray) => {
          if (!courseName || !Array.isArray(topicsArray)) return;
          if (!newCourses.includes(courseName)) {
            newCourses.push(courseName);
          }
          newTopics[courseName] = topicsArray.map(topic => ({
            title: topic.title || 'Untitled Topic',
            description: topic.description || '',
            subtopics: Array.isArray(topic.subtopics) ? topic.subtopics : [],
            quiz: Array.isArray(topic.quiz) ? topic.quiz : [],
            codingChallenges: Array.isArray(topic.codingChallenges) ? topic.codingChallenges : []
          }));
          addedCount++;
        };

        // Format 1: Array of courses [{ courseName: '...', topics: [...] }]
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (item.courseName && item.topics) {
              importSingleCourse(item.courseName, item.topics);
            }
          });
        } 
        // Format 2: Single course object { courseName: '...', topics: [...] }
        else if (data.courseName && Array.isArray(data.topics)) {
          importSingleCourse(data.courseName, data.topics);
        }
        // Format 3: Key-value map { "Course A": [topics...], "Course B": [topics...] }
        else if (typeof data === 'object' && data !== null) {
          Object.keys(data).forEach(courseName => {
            if (Array.isArray(data[courseName])) {
              importSingleCourse(courseName, data[courseName]);
            }
          });
        }

        if (addedCount > 0) {
          setCourses(newCourses);
          setTopics(newTopics);
          localStorage.setItem('AI_Lab_Admin_Courses', JSON.stringify(newCourses));
          localStorage.setItem('AI_Lab_Admin_Topics', JSON.stringify(newTopics));
          alert(`Successfully imported ${addedCount} course(s) from JSON!`);
        } else {
          alert('Invalid JSON structure. Please ensure it matches the course or roadmapData schema.');
        }
      } catch (err) {
        alert('Failed to parse JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtered Users
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} onNavigate={onNavigate} />

      <main className="flex-1 max-w-full px-6 sm:px-8 lg:px-12 pt-24 pb-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary dark:text-indigo-400 font-black text-xs uppercase tracking-widest mb-1.5">
              <Layers size={14} />
              <span>CONTROL PANEL</span>
            </div>
            <h1 className="text-3xl font-black text-text-primary dark:text-slate-100 tracking-tight">
              LMS Portal Administration
            </h1>
            <p className="text-sm text-text-secondary dark:text-slate-400 font-semibold mt-1">
              Create, update, and manage your courses, quizzes, active learners, and learning data.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-text-primary dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft size={16} /> Exit Admin
            </button>
            {activeSubTab === 'courses' && (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-text-primary dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Upload size={16} className="text-primary dark:text-indigo-400" /> Bulk Upload JSON
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleBulkUpload}
                  accept=".json"
                  className="hidden"
                />
                <button
                  onClick={() => onNavigate('admin-course')}
                  className="bg-primary hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-1.5 transition-all shadow-md shadow-primary/10 active:scale-95 cursor-pointer"
                >
                  <Plus size={16} /> Create Course
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800/80 gap-6">
          <button
            onClick={() => setActiveSubTab('courses')}
            className={`pb-4 font-black text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'courses'
                ? 'border-primary text-primary dark:border-indigo-500 dark:text-indigo-400'
                : 'border-transparent text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-200'
            }`}
          >
            <BookOpen size={16} /> Course Configuration
          </button>
          <button
            onClick={() => setActiveSubTab('users')}
            className={`pb-4 font-black text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'users'
                ? 'border-primary text-primary dark:border-indigo-500 dark:text-indigo-400'
                : 'border-transparent text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-200'
            }`}
          >
            <Users size={16} /> User Management
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`pb-4 font-black text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'analytics'
                ? 'border-primary text-primary dark:border-indigo-500 dark:text-indigo-400'
                : 'border-transparent text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-200'
            }`}
          >
            <BarChart2 size={16} /> Learning Analytics
          </button>
        </div>

        {/* Tab 1: Course Management */}
        {activeSubTab === 'courses' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute right-4 bottom-4 text-primary/10 dark:text-indigo-500/10 pointer-events-none">
                  <BookOpen size={96} className="stroke-[1.5]" />
                </div>
                <div className="text-sm font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">
                  Total Courses
                </div>
                <div className="text-4xl font-black text-text-primary dark:text-slate-100 mt-2">
                  {courses.length}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute right-4 bottom-4 text-emerald-500/10 pointer-events-none">
                  <Layers size={96} className="stroke-[1.5]" />
                </div>
                <div className="text-sm font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">
                  Active Milestones
                </div>
                <div className="text-4xl font-black text-text-primary dark:text-slate-100 mt-2">
                  {Object.values(topics).reduce((acc, curr) => acc + curr.length, 0)}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute right-4 bottom-4 text-indigo-500/10 pointer-events-none">
                  <Trophy size={96} className="stroke-[1.5]" />
                </div>
                <div className="text-sm font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">
                  System Environment
                </div>
                <div className="text-xs font-black bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full w-fit mt-3">
                  PRODUCTION (STANDALONE MOCK & API)
                </div>
              </div>
            </div>

            {/* Course Cards Grid */}
            <div className="space-y-4">
              <h2 className="text-xl font-black text-text-primary dark:text-slate-200">
                Active Courses List
              </h2>

              {courses.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-sm text-text-secondary dark:text-slate-400">
                  No courses configured. Click "Create Course" to get started.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course, idx) => {
                    const courseTopics = topics[course] || [];
                    return (
                      <div
                        key={idx}
                        className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <h3 className="text-lg font-black text-text-primary dark:text-slate-150 leading-tight">
                              {course}
                            </h3>
                            <button
                              onClick={() => handleDeleteCourse(course)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                              title="Delete Course"
                            >
                              <Trash size={15} />
                            </button>
                          </div>

                          <div className="text-xs font-semibold text-text-secondary dark:text-slate-400 mb-6">
                            Milestones count: <span className="font-bold text-text-primary dark:text-slate-200">{courseTopics.length}</span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => onNavigate('admin-topic', course)}
                            className="flex-1 bg-primary hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit3 size={14} /> Manage Syllabus
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: User Management */}
        {activeSubTab === 'users' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Search Header */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm">
              <div className="relative w-full md:max-w-md">
                <Search size={16} className="absolute left-4 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search learners by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 pl-10 pr-4 py-2.5 rounded-2xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                />
              </div>
              <div className="text-xs font-bold text-text-secondary dark:text-slate-400">
                Registered Accounts: <span className="text-text-primary dark:text-slate-200">{filteredUsers.length}</span>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-text-secondary dark:text-slate-400 tracking-wider">
                      <th className="p-4 pl-6">Learner</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Access Role</th>
                      <th className="p-4 text-center">Day Streak</th>
                      <th className="p-4 text-center">Completed</th>
                      <th className="p-4 text-right pr-6 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs font-semibold text-text-primary dark:text-slate-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                        <td className="p-4 pl-6 font-bold">{user.name}</td>
                        <td className="p-4 text-text-secondary dark:text-slate-400">{user.email}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleRole(user.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 ${
                              user.role === 'Admin'
                                ? 'bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border border-red-200/40'
                                : 'bg-primary/10 text-primary dark:bg-indigo-950/30 dark:text-indigo-400 border border-primary/20'
                            }`}
                          >
                            <Shield size={10} />
                            {user.role}
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 text-orange-500 dark:text-orange-400 font-bold font-mono">
                            <Flame size={12} fill="currentColor" /> {user.streak}
                          </span>
                        </td>
                        <td className="p-4 text-center font-mono">{user.completedMilestones} topics</td>
                        <td className="p-4 text-right pr-6 space-x-2.5">
                          <button
                            onClick={() => handleResetStreak(user.id)}
                            className="text-[10px] text-orange-500 hover:underline cursor-pointer"
                          >
                            Reset Streak
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-red-450 hover:text-red-650 cursor-pointer"
                            title="Remove User"
                          >
                            <Trash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-10 italic text-text-secondary dark:text-slate-400">
                          No users found matching query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Learning Analytics */}
        {activeSubTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Visual Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-2">
                <div className="text-[10px] font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">
                  Total Active Learners
                </div>
                <div className="text-3xl font-black text-text-primary dark:text-slate-100 flex items-baseline gap-2">
                  <span>{users.filter(u => u.streak > 0).length}</span>
                  <span className="text-xs text-emerald-500 font-bold">80% active</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-2">
                <div className="text-[10px] font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">
                  Avg Streak Length
                </div>
                <div className="text-3xl font-black text-text-primary dark:text-slate-100 flex items-baseline gap-2">
                  <span>{(users.reduce((acc, u) => acc + u.streak, 0) / users.length).toFixed(1)}</span>
                  <span className="text-xs text-orange-500 font-bold">days</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-2">
                <div className="text-[10px] font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">
                  Milestones Completed
                </div>
                <div className="text-3xl font-black text-text-primary dark:text-slate-100 flex items-baseline gap-2">
                  <span>{users.reduce((acc, u) => acc + u.completedMilestones, 0)}</span>
                  <span className="text-xs text-indigo-500 font-bold">lessons total</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-2">
                <div className="text-[10px] font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider">
                  Average Syllabus Progress
                </div>
                <div className="text-3xl font-black text-text-primary dark:text-slate-100 flex items-baseline gap-2">
                  <span>45%</span>
                  <span className="text-xs text-emerald-500 font-bold">+12% this week</span>
                </div>
              </div>
            </div>

            {/* Custom SVG/CSS Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Chart 1: Course Completion Distribution */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-black text-text-primary dark:text-slate-250 flex items-center gap-2">
                  <BarChart2 size={16} className="text-primary dark:text-indigo-400" />
                  Milestone Completion Distribution by User
                </h3>

                {/* Pure CSS Bar Graph */}
                <div className="space-y-4">
                  {users.map((user) => {
                    const pct = Math.min(100, (user.completedMilestones / 10) * 100);
                    return (
                      <div key={user.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-text-primary dark:text-slate-300">{user.name}</span>
                          <span className="text-text-secondary dark:text-slate-450">{user.completedMilestones} completed</span>
                        </div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full transition-all duration-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart 2: System Activity Logs */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-text-primary dark:text-slate-250 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-primary dark:text-indigo-400" />
                  Live Platform Activity
                </h3>

                <div className="space-y-3.5">
                  <div className="flex gap-3 text-xs">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                    <div>
                      <p className="font-bold text-text-primary dark:text-slate-250">User Raju Kumar completed Topic 3</p>
                      <p className="text-[10px] text-text-secondary dark:text-slate-450 font-semibold">10 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 shrink-0" />
                    <div>
                      <p className="font-bold text-text-primary dark:text-slate-250">Ananya Roy submitted code challenge #1</p>
                      <p className="text-[10px] text-text-secondary dark:text-slate-450 font-semibold">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                    <div>
                      <p className="font-bold text-text-primary dark:text-slate-250">Course manager updated ML Foundations</p>
                      <p className="text-[10px] text-text-secondary dark:text-slate-450 font-semibold">3 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5 shrink-0" />
                    <div>
                      <p className="font-bold text-text-primary dark:text-slate-250">New registration: Rohan Verma</p>
                      <p className="text-[10px] text-text-secondary dark:text-slate-450 font-semibold">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
