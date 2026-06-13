import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, Plus, Trash, BookOpen, HelpCircle, Code, Settings, AlertCircle } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import SyllabusForm from './components/SyllabusForm';
import QuizForm from './components/QuizForm';
import ChallengeForm from './components/ChallengeForm';

export default function TopicManager({ courseName, onNavigate, isAuthenticated, onLogout }) {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [topicId, setTopicId] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [studyHeading, setStudyHeading] = useState('');
  const [studyContent, setStudyContent] = useState('');
  const [studyYTLink, setStudyYTLink] = useState('');
  const [studyCode, setStudyCode] = useState('');
  const [subtopics, setSubtopics] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [codingChallenges, setCodingChallenges] = useState([]);

  useEffect(() => {
    loadTopicsForCourse();
  }, [courseName]);

  const loadTopicsForCourse = () => {
    const savedTopics = localStorage.getItem('AI_Lab_Admin_Topics');
    if (savedTopics) {
      const topicsMap = JSON.parse(savedTopics);
      const courseTopicsList = topicsMap[courseName] || [];
      setTopics(courseTopicsList);
      if (courseTopicsList.length > 0) {
        selectTopic(courseTopicsList[0]);
      } else {
        createNewTopic();
      }
    }
  };

  const selectTopic = (topic) => {
    setSelectedTopic(topic);
    setTopicId(topic.id || 1);
    setTitle(topic.title || '');
    setDescription(topic.description || '');
    setStudyHeading(topic.study?.heading || '');
    setStudyContent(topic.study?.content || '');
    setStudyYTLink(topic.study?.YT_link || '');
    setStudyCode(topic.study?.code || '');
    setSubtopics(topic.subtopics || []);
    setQuiz(topic.quiz || []);
    
    // Support either multiple codingChallenges array or single codingChallenge object
    if (Array.isArray(topic.codingChallenges)) {
      setCodingChallenges(topic.codingChallenges);
    } else if (topic.codingChallenge) {
      setCodingChallenges([topic.codingChallenge]);
    } else {
      setCodingChallenges([]);
    }
    
    setActiveTab('general');
    setError('');
    setSuccess('');
  };

  const createNewTopic = () => {
    const nextId = topics.length > 0 ? Math.max(...topics.map(t => t.id || 0)) + 1 : 1;
    const newTopic = {
      id: nextId,
      title: 'New Milestone Topic',
      description: 'Short introduction description...',
      study: {
        heading: 'Introduction Lesson',
        content: 'Type lesson details...',
        YT_link: '',
        code: ''
      },
      subtopics: [],
      quiz: [],
      codingChallenges: []
    };
    setSelectedTopic(newTopic);
    setTopicId(newTopic.id);
    setTitle(newTopic.title);
    setDescription(newTopic.description);
    setStudyHeading(newTopic.study.heading);
    setStudyContent(newTopic.study.content);
    setStudyYTLink(newTopic.study.YT_link);
    setStudyCode(newTopic.study.code);
    setSubtopics([]);
    setQuiz([]);
    setCodingChallenges([]);
    setActiveTab('general');
  };

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError('Topic title cannot be empty.');
      return;
    }

    const updatedTopic = {
      ...selectedTopic,
      id: Number(topicId),
      title: title.trim(),
      description: description.trim(),
      study: {
        heading: studyHeading.trim(),
        content: studyContent.trim(),
        YT_link: studyYTLink.trim(),
        code: studyCode.trim()
      },
      subtopics,
      quiz,
      codingChallenges
    };

    // Update locally
    const savedTopics = localStorage.getItem('AI_Lab_Admin_Topics');
    const topicsMap = savedTopics ? JSON.parse(savedTopics) : {};
    let courseTopicsList = topicsMap[courseName] || [];

    const existsIdx = courseTopicsList.findIndex(t => t.id === selectedTopic.id || (t.title === selectedTopic.title && selectedTopic.id === undefined));
    if (existsIdx > -1) {
      courseTopicsList[existsIdx] = updatedTopic;
    } else {
      courseTopicsList.push(updatedTopic);
    }

    // Sort by id index
    courseTopicsList.sort((a, b) => a.id - b.id);
    topicsMap[courseName] = courseTopicsList;

    setTopics(courseTopicsList);
    setSelectedTopic(updatedTopic);
    localStorage.setItem('AI_Lab_Admin_Topics', JSON.stringify(topicsMap));

    // Send API requests
    const isEditing = existsIdx > -1;
    const url = isEditing
      ? `/api/v1/courses/${encodeURIComponent(courseName)}/topics/${selectedTopic.id}`
      : `/api/v1/courses/${encodeURIComponent(courseName)}/topics`;

    fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTopic)
    }).catch(() => {});

    setSuccess('Topic configuration saved successfully!');
  };

  const handleDelete = () => {
    if (!window.confirm(`Are you sure you want to delete topic "${title}"?`)) return;

    const savedTopics = localStorage.getItem('AI_Lab_Admin_Topics');
    const topicsMap = savedTopics ? JSON.parse(savedTopics) : {};
    let courseTopicsList = topicsMap[courseName] || [];

    courseTopicsList = courseTopicsList.filter(t => t.id !== selectedTopic.id);
    topicsMap[courseName] = courseTopicsList;

    setTopics(courseTopicsList);
    localStorage.setItem('AI_Lab_Admin_Topics', JSON.stringify(topicsMap));

    // Send DELETE API call
    fetch(`/api/v1/courses/${encodeURIComponent(courseName)}/topics/${selectedTopic.id}`, {
      method: 'DELETE'
    }).catch(() => {});

    if (courseTopicsList.length > 0) {
      selectTopic(courseTopicsList[0]);
    } else {
      createNewTopic();
    }
    setSuccess('Topic deleted successfully.');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} onNavigate={onNavigate} />

      <main className="flex-1 max-w-full px-6 sm:px-8 lg:px-12 pt-24 pb-8 space-y-6">
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin')}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-text-primary dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-850 p-2.5 rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="text-[10px] font-black text-primary dark:text-indigo-400 uppercase tracking-widest">
                Course: {courseName}
              </div>
              <h1 className="text-xl font-black text-text-primary dark:text-slate-100 tracking-tight">
                Syllabus & Milestone Builder
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={createNewTopic}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-text-primary dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <Plus size={14} /> New Milestone
            </button>
            <button
              onClick={handleSave}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all shadow-md shadow-emerald-500/15 active:scale-95 cursor-pointer"
            >
              <Save size={14} /> Save Configuration
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-500 text-xs font-bold p-4 rounded-xl border border-red-200/50 dark:border-red-950/50 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-950/50">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Left: Topics List */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-black text-text-primary dark:text-slate-300 uppercase tracking-widest pb-2 border-b border-slate-100 dark:border-slate-800">
              Course milestones
            </h2>
            <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
              {topics.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => selectTopic(t)}
                  className={`w-full text-left p-3 rounded-xl font-bold text-xs transition-all flex items-center justify-between ${
                    selectedTopic?.id === t.id
                      ? 'bg-primary/10 text-primary dark:bg-indigo-950/50 dark:text-indigo-400 border border-primary/20'
                      : 'text-text-primary dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  <span className="truncate pr-2">
                    {t.id}. {t.title}
                  </span>
                  <span className="text-[10px] opacity-65 font-mono">
                    ID:{t.id}
                  </span>
                </button>
              ))}
              {topics.length === 0 && (
                <div className="text-center py-8 text-xs italic text-text-secondary dark:text-slate-500">
                  No milestones. Click "New Milestone" to add one.
                </div>
              )}
            </div>
          </div>

          {/* Form Content Right */}
          <div className="lg:col-span-9 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm flex flex-col">
            {/* Form Tabs */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800/80 px-5 flex overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className={`py-4 px-4 font-bold text-xs flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'general'
                    ? 'border-primary text-primary dark:border-indigo-500 dark:text-indigo-400'
                    : 'border-transparent text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-200'
                }`}
              >
                <Settings size={14} /> General Settings
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('syllabus')}
                className={`py-4 px-4 font-bold text-xs flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'syllabus'
                    ? 'border-primary text-primary dark:border-indigo-500 dark:text-indigo-400'
                    : 'border-transparent text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-200'
                }`}
              >
                <BookOpen size={14} /> Syllabus Tree
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className={`py-4 px-4 font-bold text-xs flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'quiz'
                    ? 'border-primary text-primary dark:border-indigo-500 dark:text-indigo-400'
                    : 'border-transparent text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-200'
                }`}
              >
                <HelpCircle size={14} /> Quiz Settings
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('challenge')}
                className={`py-4 px-4 font-bold text-xs flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'challenge'
                    ? 'border-primary text-primary dark:border-indigo-500 dark:text-indigo-400'
                    : 'border-transparent text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-200'
                }`}
              >
                <Code size={14} /> Coding Sandbox
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6">
              {activeTab === 'general' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                        Topic ID (Index #)
                      </label>
                      <input
                        type="number"
                        value={topicId}
                        onChange={(e) => setTopicId(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                        placeholder="1"
                        required
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                        Topic/Milestone Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                        placeholder="e.g. Variables and Data Types"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                      Short Description (Roadmap Card hover description)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="2"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                      placeholder="e.g. Learn how variables store data dynamically in Python."
                    />
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-4">
                    <h3 className="text-xs font-black text-text-primary dark:text-slate-300 uppercase tracking-widest">
                      Milestone Core Study Material
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                          Study Heading
                        </label>
                        <input
                          type="text"
                          value={studyHeading}
                          onChange={(e) => setStudyHeading(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                          placeholder="e.g. Declaring python variables"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                          YouTube Video Lesson Player Link
                        </label>
                        <input
                          type="text"
                          value={studyYTLink}
                          onChange={(e) => setStudyYTLink(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                          placeholder="e.g. https://www.youtube.com/watch?v=..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                        Study Content Details
                      </label>
                      <textarea
                        value={studyContent}
                        onChange={(e) => setStudyContent(e.target.value)}
                        rows="4"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl text-xs font-semibold text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                        placeholder="Welcome lesson text details..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-wider mb-1">
                        Boilerplate Snippet Code
                      </label>
                      <textarea
                        value={studyCode}
                        onChange={(e) => setStudyCode(e.target.value)}
                        rows="3"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl text-[11px] font-mono text-text-primary dark:text-slate-200 focus:border-primary focus:outline-none"
                        placeholder="# Enter code example here"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="bg-red-50 hover:bg-red-100 text-red-650 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Trash size={14} /> Delete Topic Milestone
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'syllabus' && (
                <SyllabusForm subtopics={subtopics} onChange={setSubtopics} />
              )}

              {activeTab === 'quiz' && (
                <QuizForm quiz={quiz} onChange={setQuiz} />
              )}

              {activeTab === 'challenge' && (
                <ChallengeForm codingChallenges={codingChallenges} onChange={setCodingChallenges} />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
