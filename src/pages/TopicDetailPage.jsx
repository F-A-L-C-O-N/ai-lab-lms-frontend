import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Check, BookOpen, HelpCircle, Code, Trophy, 
  Play, ArrowRight, CheckCircle2, XCircle, RefreshCw, Star, 
  Terminal, Sparkles, Moon, Sun
} from 'lucide-react';
import { roadmapData } from '../data/roadmapData';
import PythonEditor from '../components/PythonEditor';
import { runCode } from '../api/api';

const TopicDetailPage = () => {
  const { courseName, topicId } = useParams();
  const navigate = useNavigate();
  
  const decodedCourseName = decodeURIComponent(courseName);
  const courseSteps = roadmapData[decodedCourseName] || [];
  const topic = courseSteps.find(step => String(step.id) === String(topicId));

  // State management
  const [activeTab, setActiveTab] = useState('study'); // study, quiz, coding
  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem('AI Lab Learning Portal_completed_steps');
    return saved ? JSON.parse(saved) : {};
  });

  const milestoneId = `step-${topicId}-topic`;
  const practiceId = `step-${topicId}-practice`;
  const isTopicDone = completedSteps[decodedCourseName]?.includes(milestoneId);
  const isPracticeDone = completedSteps[decodedCourseName]?.includes(practiceId);

  // Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Code Editor State
  const [userCode, setUserCode] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileOutput, setCompileOutput] = useState(null);
  const [isChallengePassed, setIsChallengePassed] = useState(false);
  const [editorHeight, setEditorHeight] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const startHeight = useRef(300);

  // Sandbox State (if no coding challenge exists)
  const defaultSandboxCode = `# Python Sandbox
# Try writing some Python code here related to ${topic?.title || 'this topic'}!

def greet(name):
    return f"Hello, {name}! Let's learn machine learning."

print(greet("Student"))
`;
  const [sandboxCode, setSandboxCode] = useState(defaultSandboxCode);
  const [isSandboxCompiling, setIsSandboxCompiling] = useState(false);
  const [sandboxOutput, setSandboxOutput] = useState(null);

  // Sync initial code when topic changes
  useEffect(() => {
    if (topic?.codingChallenge) {
      setUserCode(topic.codingChallenge.initialCode || '');
    }
  }, [topic]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-background dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-border dark:border-slate-800 shadow-xl max-w-md w-full">
          <XCircle className="text-red-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-black text-text-primary dark:text-slate-100 mb-2">Topic Not Found</h2>
          <p className="text-text-secondary dark:text-slate-400 mb-6 font-medium">
            We couldn't find the topic you're looking for. It may have been moved or renamed.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-primary hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={18} />
            Go back Home
          </button>
        </div>
      </div>
    );
  }

  const hasQuiz = topic.quiz && topic.quiz.length > 0;
  const hasChallenge = !!topic.codingChallenge;

  // Handle marking as completed
  const handleMarkCompleted = () => {
    const currentList = completedSteps[decodedCourseName] || [];
    
    // Add both the topic milestone and the practice milestone to indicate full completion
    const updatedList = [...currentList];
    if (!updatedList.includes(milestoneId)) {
      updatedList.push(milestoneId);
    }
    if (!updatedList.includes(practiceId)) {
      updatedList.push(practiceId);
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
        handleMarkCompleted();
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
      handleMarkCompleted();
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate('/');
                }
              }}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-text-primary dark:text-slate-100 flex items-center justify-center cursor-pointer"
              title="Back"
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
            {isTopicDone ? (
              <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Check size={14} className="stroke-[3]" />
                Completed
              </span>
            ) : (
              <button 
                onClick={handleMarkCompleted}
                className="bg-primary hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md hover:shadow-indigo-500/10 flex items-center gap-1.5 cursor-pointer"
              >
                <Check size={14} className="stroke-[3]" />
                Mark Completed
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Learning Content */}
        <section className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm transition-colors">
            
            {/* Header Badge */}
            <div className="flex items-center space-x-2 text-primary dark:text-indigo-400 mb-6">
              <BookOpen size={24} />
              <span className="text-xs font-black uppercase tracking-widest">Core Lesson</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-text-primary dark:text-slate-100 tracking-tight leading-tight mb-4">
              {topic.study.heading}
            </h2>

            {/* Paragraph content */}
            <p className="text-base sm:text-lg text-text-secondary dark:text-slate-400 font-semibold leading-relaxed mb-6">
              {topic.study.content}
            </p>

            {/* Highlights list */}
            {topic.study.highlights && (
              <div className="bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100/30 dark:border-indigo-900/30 rounded-2xl p-5 shadow-inner mb-6">
                <h4 className="font-bold text-sm text-primary dark:text-indigo-400 mb-3 uppercase tracking-wider">
                  Key Takeaways:
                </h4>
                <ul className="space-y-3">
                  {topic.study.highlights.map((h, index) => (
                    <li key={index} className="flex items-start text-sm font-bold text-text-primary dark:text-slate-300">
                      <span className="bg-indigo-100 dark:bg-indigo-950 p-0.5 rounded-full text-primary dark:text-indigo-400 mr-2.5 mt-0.5 shrink-0">
                        <Check size={12} className="stroke-[3]" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Example Code Block */}
            {topic.study.code && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-text-secondary dark:text-slate-500 font-bold px-1">
                  <span>Reference Snippet:</span>
                  <span className="font-mono">python</span>
                </div>
                <div className="bg-[#0B0F19] rounded-2xl p-5 overflow-x-auto border border-slate-800 shadow-md">
                  <pre className="font-mono text-xs text-slate-300">
                    <code>{topic.study.code}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
          
          {/* Extended Syllabus/Additional details */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-850 rounded-3xl p-6 sm:p-8 transition-colors">
            <div className="flex items-center space-x-2 text-indigo-500 mb-4">
              <Sparkles size={20} className="animate-pulse" />
              <h3 className="text-lg font-black text-text-primary dark:text-slate-100">Deep Dive Details</h3>
            </div>
            
            <div className="space-y-4 text-sm font-semibold text-text-secondary dark:text-slate-400 leading-relaxed">
              <p>
                To fully master this concept, understand the underlying mathematical optimization logic. In practice, algorithms operate by iterating through dataset coordinates to find a minimum error trajectory.
              </p>
              <p>
                Real-world implementations utilize specialized tensor arrays, automated gradient loops, and scaling methods to ensure execution remains extremely quick across large dataset scales.
              </p>
            </div>
          </div>
        </section>

        {/* Right Side: Interactive Panel (Tabs: Quiz / Code Challenge / Sandbox) */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-colors flex flex-col min-h-[500px]">
            
            {/* Tabs Header */}
            <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850 px-4 py-2.5 flex items-center justify-start space-x-2 shrink-0">
              <button
                onClick={() => setActiveTab('study')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'study'
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
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'quiz'
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
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'coding'
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
                <div className="flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-black text-text-primary dark:text-slate-200">Interactive Sandbox</h3>
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
                        <pre className="whitespace-pre-wrap text-[10px] bg-red-950/20 border border-red-900/30 p-2 rounded-lg">{sandboxOutput.error}</pre>
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
                <div className="flex-grow flex flex-col justify-between">
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
                      <h3 className="text-base sm:text-lg font-black text-text-primary dark:text-slate-100 tracking-tight leading-snug">
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
                            optionStyle = 'border-primary dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 text-primary dark:text-indigo-400 ring-2 ring-primary/10';
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => handleOptionSelect(idx)}
                              disabled={isAnswerChecked}
                              className={`w-full text-left p-4 rounded-2xl border-2 font-bold text-xs sm:text-sm transition-all duration-200 flex items-start justify-between cursor-pointer ${optionStyle}`}
                            >
                              <span className="pr-4">{option}</span>
                              {isAnswerChecked && isCorrectOption && (
                                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                              )}
                              {isAnswerChecked && isSelected && !isCorrectOption && (
                                <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation details */}
                      {isAnswerChecked && (
                        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-4 text-xs font-semibold leading-relaxed animate-scale-up text-text-secondary dark:text-slate-400">
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
                            className={`w-full font-bold py-3.5 px-6 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                              selectedOption === null
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                                : 'bg-primary hover:bg-indigo-700 text-white hover:shadow-indigo-500/20'
                            }`}
                          >
                            Check Answer
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuestion}
                            className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold py-3.5 px-6 rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {currentQuestionIdx + 1 === topic.quiz.length ? 'Finish Quiz' : 'Next Question'}
                            <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CODING CHALLENGE */}
              {activeTab === 'coding' && hasChallenge && (
                <div className="flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-black text-text-primary dark:text-slate-200">Coding Challenge</h3>
                      <span className="bg-indigo-50 dark:bg-indigo-950/40 text-primary dark:text-indigo-400 px-2 py-0.5 rounded text-[10px] font-bold">Python</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-xs font-semibold text-text-secondary dark:text-slate-350 leading-relaxed max-h-[140px] overflow-y-auto">
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
                  <div className="bg-[#080B11] border border-slate-850 rounded-2xl p-4 font-mono text-xs text-slate-300 min-h-[150px] flex flex-col justify-center">
                    {!compileOutput ? (
                      <span className="text-slate-500 italic text-center">Run your code to verify with test cases.</span>
                    ) : compileOutput.error ? (
                      <div className="text-red-400 space-y-1">
                        <div className="font-bold flex items-center gap-1.5"><XCircle size={14} /> Compilation Error</div>
                        <pre className="whitespace-pre-wrap text-[10px] bg-red-950/20 border border-red-900/30 p-2 rounded-lg">{compileOutput.error}</pre>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className={`font-black flex items-center gap-1.5 pb-1 border-b border-slate-900/50 ${compileOutput.success ? 'text-green-400' : 'text-red-400'}`}>
                          {compileOutput.success ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {compileOutput.success ? 'ALL TESTS PASSED!' : 'SOME TESTS FAILED'}
                        </div>
                        
                        <div className="space-y-1 text-[11px]">
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
