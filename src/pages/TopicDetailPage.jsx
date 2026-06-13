import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Check, BookOpen, HelpCircle, Code, Trophy,
  Play, ArrowRight, CheckCircle2, XCircle, RefreshCw, Star,
  Terminal, Sparkles, FileText, ChevronRight, Video
} from 'lucide-react';
import PythonEditor from '../components/PythonEditor';
import { runCode, fetchCourses } from '../api/api';
const getEmbedUrl = (url) => {
  if (!url) return '';
  let videoId = '';
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else if (url.includes('youtube.com/watch')) {
    const parts = url.split('?')[1];
    if (parts) {
      const params = new URLSearchParams(parts);
      videoId = params.get('v');
    }
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

const POLL_INTERVAL = 30000; // 30 seconds

const TopicDetailPage = ({ courseName, topicId, onBack, onNavigate }) => {
  const decodedCourseName = courseName;

  // Live course data from API (falls back to static roadmapData)
  const [apiCourseSteps, setApiCourseSteps] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // Fetch courses from backend on mount + poll every POLL_INTERVAL
  useEffect(() => {
    let isMounted = true;
    let timerId = null;

    const loadCourses = async () => {
      try {
        const courses = await fetchCourses();
        if (!isMounted) return;
        // The API returns a flat list of topic objects.
        // Filter by courseName to get topics for this course.
        const filtered = courses.filter(
          (c) => c.courseName === decodedCourseName
        );
        setApiCourseSteps(filtered);
        setFetchError(null);
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to fetch courses:', err);
        setFetchError(err.message);
        // Keep existing data (either previous API data or static fallback)
      }
    };

    loadCourses();
    timerId = setInterval(loadCourses, POLL_INTERVAL);

    return () => {
      isMounted = false;
      if (timerId) clearInterval(timerId);
    };
  }, [decodedCourseName]);

  // Use API data
  const courseSteps = apiCourseSteps || [];

  const topic = courseSteps.find(step => String(step.id) === String(topicId));

  // Subtopics list
  const subtopics = topic?.subtopics || (topic ? [
    {
      id: `${topic.id}.1`,
      title: 'Overview',
      heading: topic.study.heading,
      content: topic.study.content,
      YT_link: topic.study.YT_link || null,
      code: topic.study.code || null
    }
  ] : []);

  // State management
  const [activeItemId, setActiveItemId] = useState(null);
  const [expandedSubtopics, setExpandedSubtopics] = useState({});
  const [activeTab, setActiveTab] = useState('study'); // study, quiz, coding
  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem('AI Lab Learning Portal_completed_steps');
    return saved ? JSON.parse(saved) : {};
  });

  const milestoneId = `step-${topicId}-topic`;
  const practiceId = `step-${topicId}-practice`;
  const quizId = `step-${topicId}-quiz`;
  const challengeId = `step-${topicId}-challenge`;

  const hasQuiz = topic?.quiz && topic.quiz.length > 0;
  const hasChallenge = !!topic?.codingChallenge;

  const isQuizDone = completedSteps[decodedCourseName]?.includes(quizId);
  const isChallengeDone = completedSteps[decodedCourseName]?.includes(challengeId);
  const isLessonDone = completedSteps[decodedCourseName]?.includes(milestoneId);

  // A topic is fully completed only when the lesson, quiz (if exists), and challenge (if exists) are all completed.
  const isTopicFullyCompleted =
    (isLessonDone || !topic?.study) &&
    (!hasQuiz || isQuizDone) &&
    (!hasChallenge || isChallengeDone);

  // Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(() => {
    const saved = localStorage.getItem('AI Lab Learning Portal_completed_steps');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed[decodedCourseName]?.includes(quizId) || false;
    }
    return false;
  });

  // Code Editor State
  const [userCode, setUserCode] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileOutput, setCompileOutput] = useState(null);
  const [isChallengePassed, setIsChallengePassed] = useState(() => {
    const saved = localStorage.getItem('AI Lab Learning Portal_completed_steps');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed[decodedCourseName]?.includes(challengeId) || false;
    }
    return false;
  });
  const [editorHeight, setEditorHeight] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const startHeight = useRef(300);

  // Sandbox State (if no coding challenge exists)
  const defaultSandboxCode = `print("Hello World")`;
  const [sandboxCode, setSandboxCode] = useState(defaultSandboxCode);
  const [isSandboxCompiling, setIsSandboxCompiling] = useState(false);
  const [sandboxOutput, setSandboxOutput] = useState(null);

  // Initial state for active item and expanded parent subtopics
  useEffect(() => {
    if (subtopics.length > 0 && !activeItemId) {
      const firstSt = subtopics[0];
      if (firstSt.subsubtopics && firstSt.subsubtopics.length > 0) {
        setActiveItemId(firstSt.subsubtopics[0].id);
        setExpandedSubtopics({ [firstSt.id]: true });
      } else {
        setActiveItemId(firstSt.id);
      }
    }
  }, [subtopics, activeItemId]);

  // Sync initial code and reset selection when topic changes
  useEffect(() => {
    if (topic?.codingChallenge) {
      setUserCode(topic.codingChallenge.initialCode || '');
    }
    if (subtopics.length > 0) {
      const firstSt = subtopics[0];
      if (firstSt.subsubtopics && firstSt.subsubtopics.length > 0) {
        setActiveItemId(firstSt.subsubtopics[0].id);
        setExpandedSubtopics({ [firstSt.id]: true });
      } else {
        setActiveItemId(firstSt.id);
        setExpandedSubtopics({});
      }
    }
  }, [topicId, topic]);


  // Flatten all selectable items (subtopics and sub-subtopics) to easily find active content
  const allContentItems = [];
  subtopics.forEach(st => {
    if (st.subsubtopics && st.subsubtopics.length > 0) {
      allContentItems.push(...st.subsubtopics);
    } else {
      allContentItems.push(st);
    }
  });

  const activeItem = allContentItems.find(item => String(item.id) === String(activeItemId)) || allContentItems[0];

  // Handle marking parts as completed
  const markPartCompleted = (partType) => {
    const currentList = completedSteps[decodedCourseName] || [];
    const updatedList = [...currentList];

    let targetId = '';
    if (partType === 'lesson') {
      targetId = milestoneId;
    } else if (partType === 'quiz') {
      targetId = quizId;
    } else if (partType === 'challenge') {
      targetId = challengeId;
    }

    if (targetId && !updatedList.includes(targetId)) {
      updatedList.push(targetId);
    }

    // Determine if overall practice is done:
    const quizSatisfied = !hasQuiz || updatedList.includes(quizId);
    const challengeSatisfied = !hasChallenge || updatedList.includes(challengeId);

    if (quizSatisfied && challengeSatisfied) {
      if (!updatedList.includes(practiceId)) {
        updatedList.push(practiceId);
      }
      // Also automatically mark lesson/milestone completed if not done yet
      if (!updatedList.includes(milestoneId)) {
        updatedList.push(milestoneId);
      }
    }

    const updated = {
      ...completedSteps,
      [decodedCourseName]: updatedList
    };

    setCompletedSteps(updated);
    localStorage.setItem('AI Lab Learning Portal_completed_steps', JSON.stringify(updated));

    // Update Daily Streak dynamically when completing a milestone
    try {
      const today = new Date().toISOString().split('T')[0];
      const savedStreak = localStorage.getItem('AI_Lab_Streak_Info');
      let streakInfo = savedStreak ? JSON.parse(savedStreak) : { count: 0, lastActivityDate: '', bestStreak: 0, history: [] };
      if (!streakInfo.history) streakInfo.history = [];

      if (!streakInfo.history.includes(today)) {
        streakInfo.history.push(today);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (streakInfo.lastActivityDate === yesterdayStr) {
          streakInfo.count += 1;
        } else if (streakInfo.lastActivityDate === today) {
          // keep count
        } else {
          streakInfo.count = 1;
        }

        streakInfo.lastActivityDate = today;
        if (streakInfo.count > streakInfo.bestStreak) {
          streakInfo.bestStreak = streakInfo.count;
        }
        localStorage.setItem('AI_Lab_Streak_Info', JSON.stringify(streakInfo));
      }
    } catch (e) {
      console.error('Failed to update streak:', e);
    }
  };

  const handleMarkCompleted = () => {
    markPartCompleted('lesson');
  };

  const handleFinishAndReturn = () => {
    // Store current completed topic index for car animation in RoadmapPage
    const currentMilestoneIdx = courseSteps.findIndex(step => String(step.id) === String(topicId));
    if (currentMilestoneIdx !== -1) {
      localStorage.setItem('AI_Lab_Just_Completed_Topic_Index', String(currentMilestoneIdx));
    }
    // Mark completed if not already marked
    markPartCompleted('lesson');
    if (hasQuiz) markPartCompleted('quiz');
    if (hasChallenge) markPartCompleted('challenge');
    // Return back to RoadmapPage
    onBack();
  };

  // Drag handlers for resizing editor
  const handleDragStart = (e) => {
    setIsDragging(true);
    dragStartY.current = e.clientY || e.touches[0].clientY;
    startHeight.current = editorHeight;
  };

  useEffect(() => {
    const handleDragMove = (e) => {
      if (!isDragging) return;
      const clientY = e.clientY || e.touches[0].clientY;
      const deltaY = clientY - dragStartY.current;
      const newHeight = Math.max(150, Math.min(600, startHeight.current + deltaY));
      setEditorHeight(newHeight);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  // Show "not found" only after all hooks have run (React rules of hooks)
  if (!topic) {
    return (
      <div className="min-h-screen bg-background dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-border dark:border-slate-800 shadow-xl max-w-md w-full">
          <XCircle className="text-red-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-black text-text-primary dark:text-slate-100 mb-2">Topic Not Found</h2>
          <p className="text-text-secondary dark:text-slate-400 mb-6 font-medium">
            {apiCourseSteps === null
              ? 'Loading topic data from the server...'
              : "We couldn't find the topic you're looking for. It may have been moved or renamed."}
          </p>
          {apiCourseSteps !== null && (
            <button
              onClick={onBack}
              className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={18} />
              Go back to Roadmap
            </button>
          )}
        </div>
      </div>
    );
  }

  // Coding Challenge execution
  const handleCompileRun = async () => {
    const challenge = topic.codingChallenge;
    if (!challenge) return;

    setIsCompiling(true);
    setCompileOutput(null);

    try {
      const result = await runCode({
        code: userCode,
        stdin: '',
      });

      if (result.stderr) {
        setCompileOutput({ success: false, error: result.stderr });
        setIsChallengePassed(false);
        return;
      }

      const stdout = result.stdout.trim();
      const testResults = challenge.testCases.map((tc, idx) => {
        const expectedStr = JSON.stringify(tc.expected);
        const outputLines = stdout.split('\n');
        const got = outputLines[idx] !== undefined ? outputLines[idx].trim() : '';
        const passed = got === expectedStr || got === String(tc.expected);
        return {
          caseIdx: idx + 1,
          input: JSON.stringify(tc.input),
          expected: expectedStr,
          got: got || '(no output)',
          passed,
        };
      });

      const allPassed = testResults.every(r => r.passed);
      setCompileOutput({ success: allPassed, results: testResults, stdout });
      setIsChallengePassed(allPassed);

      // Auto mark practice completed if passed
      if (allPassed) {
        markPartCompleted('challenge');
      }
    } catch (err) {
      setCompileOutput({ success: false, error: err.message });
      setIsChallengePassed(false);
    } finally {
      setIsCompiling(false);
    }
  };

  // Run Sandbox code
  const handleRunSandbox = async () => {
    setIsSandboxCompiling(true);
    setSandboxOutput(null);

    try {
      const result = await runCode({
        code: sandboxCode,
        stdin: '',
      });

      if (result.stderr) {
        setSandboxOutput({ success: false, error: result.stderr });
        return;
      }

      setSandboxOutput({ success: true, stdout: result.stdout });
    } catch (err) {
      setSandboxOutput({ success: false, error: err.message });
    } finally {
      setIsSandboxCompiling(false);
    }
  };

  // Quiz selection handlers
  const handleOptionSelect = (optionIdx) => {
    if (isAnswerChecked) return;
    setSelectedOption(optionIdx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerChecked(true);
    if (selectedOption === topic.quiz[currentQuestionIdx].answerIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
    if (currentQuestionIdx + 1 < topic.quiz.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
      markPartCompleted('quiz');
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* Immersive Top Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-12 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-text-primary dark:text-slate-100 flex items-center justify-center cursor-pointer"
              title="Back to Roadmap"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-primary dark:text-indigo-400">
                {decodedCourseName}
              </span>
              <h1 className="text-base sm:text-lg font-black text-text-primary dark:text-slate-100 truncate max-w-xs sm:max-w-md">
                {topic.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isTopicFullyCompleted ? (
              <div className="flex items-center gap-2">
                <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <Check size={14} className="stroke-[3]" />
                  Completed
                </span>
                <button
                  onClick={handleFinishAndReturn}
                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition-all shadow-md hover:shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer"
                >
                  Finish Topic
                  <ArrowRight size={12} className="stroke-[3]" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleMarkCompleted}
                className="bg-primary hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md hover:shadow-indigo-500/10 flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={14} className="stroke-[3]" />
                {isLessonDone ? 'Lesson Completed' : 'Mark Completed'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="flex-grow max-w-full mx-auto w-full px-6 sm:px-8 lg:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Section: Subtopics Sidebar (Content Side) */}
        <section className="lg:col-span-3 space-y-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm transition-colors">
            <h3 className="text-xs font-black uppercase tracking-wider text-text-secondary dark:text-slate-500 mb-4 flex items-center gap-2">
              <FileText size={14} className="text-primary dark:text-indigo-400" />
              Syllabus Contents
            </h3>

            <div className="space-y-2">
              {subtopics.map((st) => {
                const hasChildren = st.subsubtopics && st.subsubtopics.length > 0;
                const isExpanded = !!expandedSubtopics[st.id];

                // Determine if this subtopic or any of its children is active
                const isChildActive = hasChildren && st.subsubtopics.some(sst => String(sst.id) === String(activeItemId));
                const isParentActive = String(st.id) === String(activeItemId);
                const isAnyActive = isParentActive || isChildActive;

                return (
                  <div key={st.id} className="space-y-1">
                    {/* Parent Subtopic Item */}
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          setExpandedSubtopics(prev => ({ ...prev, [st.id]: !prev[st.id] }));
                          // Auto select first child if none of them is active
                          if (!isChildActive) {
                            setActiveItemId(st.subsubtopics[0].id);
                          }
                        } else {
                          setActiveItemId(st.id);
                        }
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between group active:scale-[0.98] cursor-pointer ${isAnyActive && !hasChildren
                          ? 'bg-primary/5 dark:bg-indigo-500/10 border-primary dark:border-indigo-500 text-primary dark:text-indigo-400 shadow-sm'
                          : isAnyActive
                            ? 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/35 text-text-primary dark:text-slate-205 font-black'
                            : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/20 text-text-primary dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                        }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black font-mono shrink-0 transition-colors ${isAnyActive
                            ? 'bg-primary text-white dark:bg-indigo-500'
                            : 'bg-slate-200/60 dark:bg-slate-800 text-text-secondary dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                          }`}>
                          {st.id}
                        </span>
                        <span className="text-xs font-black truncate leading-tight">{st.title}</span>
                      </div>

                      {hasChildren ? (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold pr-1 transition-transform duration-200">
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      ) : (
                        <ChevronRight size={14} className={`shrink-0 transition-transform ${isAnyActive ? 'text-primary dark:text-indigo-400 translate-x-0.5' : 'text-slate-400 dark:text-slate-650 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                          }`} />
                      )}
                    </button>

                    {/* Children Sub-subtopics */}
                    {hasChildren && isExpanded && (
                      <div className="pl-6 space-y-1 mt-1 border-l-2 border-slate-100 dark:border-slate-800/80 ml-5 animate-slide-down">
                        {st.subsubtopics.map((sst) => {
                          const isSstActive = String(sst.id) === String(activeItemId);
                          return (
                            <button
                              key={sst.id}
                              onClick={() => setActiveItemId(sst.id)}
                              className={`w-full text-left py-2.5 px-3.5 rounded-xl border transition-all duration-150 flex items-center justify-between group active:scale-[0.98] cursor-pointer ${isSstActive
                                  ? 'bg-primary/5 dark:bg-indigo-500/10 border-primary/40 dark:border-indigo-500/40 text-primary dark:text-indigo-400 font-bold shadow-sm'
                                  : 'border-transparent text-text-secondary dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/30 hover:text-text-primary dark:hover:text-slate-200'
                                }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`text-[9px] font-black font-mono shrink-0 ${isSstActive ? 'text-primary dark:text-indigo-400' : 'text-slate-400'
                                  }`}>
                                  {sst.id}
                                </span>
                                <span className="text-xs truncate leading-tight font-semibold">{sst.title}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Center Section: Sub-subtopic / Subtopic Content Details */}
        <section className="lg:col-span-5 space-y-6">
          {activeItem && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors space-y-6 animate-fade-in">

              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850 pb-4">
                <div className="flex items-center space-x-2 text-primary dark:text-indigo-400">
                  <BookOpen size={20} />
                  <span className="text-xs font-black uppercase tracking-widest">Lesson Material</span>
                </div>
                <span className="bg-slate-100 dark:bg-slate-800 text-text-secondary dark:text-slate-400 px-3 py-1 rounded-full text-[10px] font-black font-mono">
                  Module {activeItem.id}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-text-primary dark:text-slate-100 tracking-tight leading-tight">
                {activeItem.heading}
              </h2>

              {/* Paragraph content */}
              <p className="text-sm sm:text-base text-text-secondary dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line">
                {activeItem.content}
              </p>

              {/* YouTube Video Embed */}
              {activeItem.YT_link && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-slate-400 font-bold px-1 uppercase tracking-wider">
                    <Video size={14} className="text-red-500" />
                    <span>Video Lesson:</span>
                  </div>
                  <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-950">
                    <iframe
                      width="100%"
                      height="100%"
                      src={getEmbedUrl(activeItem.YT_link)}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Example Code Block */}
              {activeItem.code && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-text-secondary dark:text-slate-500 font-bold px-1">
                    <span>Reference Snippet:</span>
                    <span className="font-mono">python</span>
                  </div>
                  <div className="bg-[#0B0F19] rounded-2xl p-5 overflow-x-auto border border-slate-800 shadow-md">
                    <pre className="font-mono text-xs text-slate-300">
                      <code>{activeItem.code}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Deep Dive details card */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-850 rounded-3xl p-6 sm:p-8 transition-colors">
            <div className="flex items-center space-x-2 text-indigo-500 mb-4">
              <Sparkles size={20} className="animate-pulse" />
              <h3 className="text-sm font-black text-text-primary dark:text-slate-100">Deep Dive Notes</h3>
            </div>

            <div className="space-y-4 text-xs font-semibold text-text-secondary dark:text-slate-400 leading-relaxed">
              <p>
                To fully master this concept, understand the underlying mathematical optimization logic. In practice, algorithms operate by iterating through dataset coordinates to find a minimum error trajectory.
              </p>
              <p>
                Real-world implementations utilize specialized tensor arrays, automated gradient loops, and scaling methods to ensure execution remains extremely quick across large dataset scales.
              </p>
            </div>
          </div>
        </section>

        {/* Right Section: Interactive Practice Panel */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-colors flex flex-col min-h-[500px]">

            {/* Tabs Header */}
            <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850 px-4 py-2.5 flex items-center justify-start space-x-2 shrink-0">
              <button
                onClick={() => setActiveTab('study')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'study'
                    ? 'bg-white dark:bg-slate-900 text-primary dark:text-indigo-400 shadow-sm'
                    : 'text-text-secondary dark:text-slate-500 hover:text-text-primary dark:hover:text-slate-300'
                  }`}
              >
                <Terminal size={14} />
                Sandbox
              </button>

              {hasQuiz && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'quiz'
                      ? 'bg-white dark:bg-slate-900 text-primary dark:text-indigo-400 shadow-sm'
                      : 'text-text-secondary dark:text-slate-500 hover:text-text-primary dark:hover:text-slate-300'
                    }`}
                >
                  <HelpCircle size={14} />
                  Quiz
                </button>
              )}

              {hasChallenge && (
                <button
                  onClick={() => setActiveTab('coding')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === 'coding'
                      ? 'bg-white dark:bg-slate-900 text-primary dark:text-indigo-400 shadow-sm'
                      : 'text-text-secondary dark:text-slate-500 hover:text-text-primary dark:hover:text-slate-300'
                    }`}
                >
                  <Code size={14} />
                  Challenge
                </button>
              )}
            </div>

            {/* Tab Body */}
            <div className="p-6 flex-grow flex flex-col justify-between">

              {/* TAB 1: MOCK SANDBOX */}
              {activeTab === 'study' && (
                <div className="flex-grow flex flex-col justify-between space-y-4 animate-fade-in">
                  <div className="space-y-3">
                    <h3 className="text-sm font-black text-text-primary dark:text-slate-200"> Try it yourself here!</h3>
                    <p className="text-xs font-semibold text-text-secondary dark:text-slate-400 leading-normal">
                      Write and run Python code instantly. Try extending or experimenting with this lesson's concept.
                    </p>
                  </div>

                  {/* Sandbox Editor wrapper */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-inner flex flex-col bg-[#0B0F19]">
                    <div className="bg-[#121824] px-4 py-2 flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-850">
                      <span>main.py</span>
                      <button
                        onClick={handleRunSandbox}
                        disabled={isSandboxCompiling}
                        className={`bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer font-bold ${isSandboxCompiling ? 'cursor-wait opacity-50' : ''}`}
                      >
                        {isSandboxCompiling ? (
                          <RefreshCw size={10} className="animate-spin" />
                        ) : (
                          <Play size={10} className="fill-current" />
                        )}
                        RUN CODE
                      </button>
                    </div>

                    <PythonEditor
                      value={sandboxCode}
                      onChange={setSandboxCode}
                      height={250}
                    />
                  </div>

                  {/* Sandbox Console Output */}
                  <div className="bg-[#080B11] border border-slate-850 rounded-2xl p-4 font-mono text-xs text-slate-300 min-h-[120px] flex flex-col justify-center">
                    {!sandboxOutput ? (
                      <span className="text-slate-500 italic text-center">Output console is empty. Click RUN CODE to execute.</span>
                    ) : sandboxOutput.error ? (
                      <div className="text-red-400 space-y-1">
                        <div className="font-bold flex items-center gap-1.5"><XCircle size={14} /> Execution Error</div>
                        <pre className="whitespace-pre-wrap text-[10px] bg-red-955/20 border border-red-900/30 p-2 rounded-lg">{sandboxOutput.error}</pre>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-900/50 pb-1">Output:</div>
                        <pre className="text-emerald-400 whitespace-pre-wrap">{sandboxOutput.stdout || '(no output)'}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: INTERACTIVE QUIZ */}
              {activeTab === 'quiz' && hasQuiz && (
                <div className="flex-grow flex flex-col justify-between animate-fade-in">
                  {quizFinished ? (
                    <div className="text-center py-8 space-y-5 animate-scale-up">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/20">
                        <Trophy size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-text-primary dark:text-slate-100">Quiz Completed!</h3>
                        <p className="text-sm font-semibold text-text-secondary dark:text-slate-400 mt-1">
                          You scored <span className="text-primary dark:text-indigo-400 font-extrabold">{quizScore} / {topic.quiz.length}</span>
                        </p>
                      </div>

                      <button
                        onClick={handleResetQuiz}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-text-primary dark:text-slate-200 font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer text-xs"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6 flex-grow flex flex-col justify-between">
                      {/* Question Header */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-text-secondary dark:text-slate-500">
                          <span>QUESTION {currentQuestionIdx + 1} OF {topic.quiz.length}</span>
                          <span className="text-primary dark:text-indigo-400">{Math.round(((currentQuestionIdx) / topic.quiz.length) * 100)}% Complete</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIdx) / topic.quiz.length) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Question Text */}
                      <h3 className="text-xs sm:text-sm font-black text-text-primary dark:text-slate-100 tracking-tight leading-snug">
                        {topic.quiz[currentQuestionIdx].question}
                      </h3>

                      {/* Options List */}
                      <div className="space-y-3">
                        {topic.quiz[currentQuestionIdx].options.map((option, idx) => {
                          const isSelected = selectedOption === idx;
                          const isCorrectOption = idx === topic.quiz[currentQuestionIdx].answerIndex;

                          let optionStyle = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50';
                          if (isAnswerChecked) {
                            if (isCorrectOption) {
                              optionStyle = 'border-emerald-500 dark:border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 shadow-md shadow-emerald-500/5';
                            } else if (isSelected) {
                              optionStyle = 'border-red-500 dark:border-red-600 bg-red-50/40 dark:bg-red-950/20 text-red-800 dark:text-red-300';
                            } else {
                              optionStyle = 'border-slate-100 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/20 opacity-50';
                            }
                          } else if (isSelected) {
                            optionStyle = 'border-primary dark:border-indigo-50 bg-indigo-50/20 dark:bg-indigo-950/20 text-primary dark:text-indigo-400 ring-2 ring-primary/10';
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => handleOptionSelect(idx)}
                              disabled={isAnswerChecked}
                              className={`w-full text-left p-3 rounded-2xl border-2 font-bold text-[10px] sm:text-xs transition-all duration-200 flex items-start justify-between cursor-pointer ${optionStyle}`}
                            >
                              <span className="pr-4">{option}</span>
                              {isAnswerChecked && isCorrectOption && (
                                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                              )}
                              {isAnswerChecked && isSelected && !isCorrectOption && (
                                <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation details */}
                      {isAnswerChecked && (
                        <div className="bg-slate-55 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-4 text-[10px] font-semibold leading-relaxed animate-scale-up text-text-secondary dark:text-slate-400">
                          <strong className="text-text-primary dark:text-slate-200 block mb-1">Explanation:</strong>
                          {topic.quiz[currentQuestionIdx].explanation}
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        {!isAnswerChecked ? (
                          <button
                            onClick={handleCheckAnswer}
                            disabled={selectedOption === null}
                            className={`w-full font-bold py-3 px-6 rounded-2xl text-[10px] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${selectedOption === null
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                                : 'bg-primary hover:bg-indigo-700 text-white hover:shadow-indigo-500/20'
                              }`}
                          >
                            Check Answer
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuestion}
                            className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold py-3 px-6 rounded-2xl text-[10px] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {currentQuestionIdx + 1 === topic.quiz.length ? 'Finish Quiz' : 'Next Question'}
                            <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CODING CHALLENGE */}
              {activeTab === 'coding' && hasChallenge && (
                <div className="flex-grow flex flex-col justify-between space-y-4 animate-fade-in">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-black text-text-primary dark:text-slate-200">Coding Challenge</h3>
                      <span className="bg-indigo-50 dark:bg-indigo-950/40 text-primary dark:text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold">Python</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-[10px] font-semibold text-text-secondary dark:text-slate-350 leading-relaxed max-h-[140px] overflow-y-auto">
                      {topic.codingChallenge.description}
                    </div>
                  </div>

                  {/* Drag-adjustable Editor */}
                  <div className="border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden flex flex-col bg-[#0B0F19]">
                    <div className="bg-[#121824] px-4 py-2 flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-850">
                      <span>solution.py</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleCompileRun}
                          disabled={isCompiling}
                          className={`bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer font-bold ${isCompiling ? 'cursor-wait opacity-50' : ''}`}
                        >
                          {isCompiling ? (
                            <RefreshCw size={10} className="animate-spin" />
                          ) : (
                            <Play size={10} className="fill-current" />
                          )}
                          COMPILE & RUN
                        </button>
                      </div>
                    </div>

                    <PythonEditor
                      value={userCode}
                      onChange={setUserCode}
                      height={editorHeight}
                    />
                  </div>

                  {/* Drag Handle */}
                  <div
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    className="flex items-center justify-center cursor-row-resize h-2 select-none group bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-10 h-1 bg-slate-300 dark:bg-slate-700 rounded-full group-hover:bg-slate-400" />
                  </div>

                  {/* Test Output Panel */}
                  <div className="bg-[#080B11] border border-slate-850 rounded-2xl p-4 font-mono text-[10px] text-slate-300 min-h-[150px] flex flex-col justify-center">
                    {!compileOutput ? (
                      <span className="text-slate-500 italic text-center">Run your code to verify with test cases.</span>
                    ) : compileOutput.error ? (
                      <div className="text-red-400 space-y-1">
                        <div className="font-bold flex items-center gap-1.5"><XCircle size={14} /> Compilation Error</div>
                        <pre className="whitespace-pre-wrap text-[10px] bg-red-955/20 border border-red-900/30 p-2 rounded-lg">{compileOutput.error}</pre>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className={`font-black flex items-center gap-1.5 pb-1 border-b border-slate-900/50 ${compileOutput.success ? 'text-green-400' : 'text-red-400'}`}>
                          {compileOutput.success ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {compileOutput.success ? 'ALL TESTS PASSED!' : 'SOME TESTS FAILED'}
                        </div>

                        <div className="space-y-1 text-[10px]">
                          {compileOutput.results.map((res, idx) => (
                            <div key={idx} className="flex justify-between items-center py-0.5 border-b border-slate-900/20 last:border-0">
                              <span className="text-slate-400">Test Case #{res.caseIdx}:</span>
                              <span className={res.passed ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                                {res.passed ? 'PASSED' : `FAILED (Expected: ${res.expected}, Got: ${res.got})`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TopicDetailPage;
