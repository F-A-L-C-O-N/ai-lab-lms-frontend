import React, { useState, useEffect } from 'react';
import { X, BookOpen, CheckCircle2, XCircle, Trophy, ArrowRight, Check, Lock, Play, ArrowLeft, Flame, Target, Medal, Code, HelpCircle } from 'lucide-react';
import { motion, animate } from 'framer-motion';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { roadmapData } from '../data/roadmapData';

const RoadmapPage = ({ courseName, onBack, onNavigate, isAuthenticated, onLogout }) => {
  const steps = roadmapData[courseName] || [];

  // Local Storage Progress Persistence
  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem('learnhub_completed_steps');
    return saved ? JSON.parse(saved) : {};
  });

  // Page view mode: 'roadmap' or 'lesson'
  const [viewMode, setViewMode] = useState('roadmap');
  
  // Selected lesson state
  const [activeStep, setActiveStep] = useState(null);
  
  // Lesson phases: 'study' or 'quiz' or 'complete'
  const [lessonPhase, setLessonPhase] = useState('study');

  // Quiz execution states
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);

  // Helper to determine milestone lock/complete status
  const isMilestoneCompleted = (milestone) => {
    const completedList = completedSteps[courseName] || [];
    return completedList.includes(milestone.id);
  };

  const isMilestoneUnlocked = (milestone, idx) => {
    const index = idx !== undefined && idx !== null ? idx : (milestones ? milestones.indexOf(milestone) : -1);
    if (index <= 0) return true;
    const prevMilestone = milestones[index - 1];
    if (!prevMilestone) return false;
    const completedList = completedSteps[courseName] || [];
    return completedList.includes(prevMilestone.id);
  };

  const handleStartLesson = (milestone) => {
    setActiveStep(milestone);
    setLessonPhase('study');
    setViewMode('lesson');
    // Reset quiz states
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setScore(0);
  };

  const handleStartPractice = () => {
    if (!activeStep.stepData.quiz || activeStep.stepData.quiz.length === 0) {
      handleCompleteStep();
    } else {
      setLessonPhase('quiz');
    }
  };

  const handleOptionSelect = (optionIdx) => {
    if (isAnswerChecked) return;
    setSelectedOption(optionIdx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerChecked(true);
    if (selectedOption === activeStep.stepData.quiz[currentQuestionIdx].answerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
    if (currentQuestionIdx + 1 < activeStep.stepData.quiz.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setLessonPhase('complete');
    }
  };

  const handleCompleteStep = () => {
    const completedList = completedSteps[courseName] || [];
    if (!completedList.includes(activeStep.id)) {
      const updated = {
        ...completedSteps,
        [courseName]: [...completedList, activeStep.id]
      };
      setCompletedSteps(updated);
      localStorage.setItem('learnhub_completed_steps', JSON.stringify(updated));
    }
    setViewMode('roadmap');
    setActiveStep(null);
    window.scrollTo(0, 0);
  };

  // Flattened Milestones Generation
  const getMilestones = (courseSteps) => {
    const list = [];
    courseSteps.forEach((step, index) => {
      // 1. Topic Node
      list.push({
        id: `step-${step.id}-topic`,
        stepId: step.id,
        title: step.title,
        type: 'topic',
        duration: '15 min',
        stepData: step,
        stepIndex: index
      });
      
      // 2. Quiz / Challenge Node
      const isChallenge = step.study.code ? true : false;
      list.push({
        id: `step-${step.id}-practice`,
        stepId: step.id,
        title: isChallenge ? `Coding Challenge: ${step.title}` : `${step.title} Quiz`,
        type: isChallenge ? 'challenge' : 'quiz',
        duration: isChallenge ? '30 min' : '10 min',
        stepData: step,
        stepIndex: index
      });
    });

    // 3. Final Course Assessment
    if (courseSteps.length > 0) {
      list.push({
        id: 'final-assessment',
        stepId: 'final',
        title: 'Final Course Assessment',
        type: 'assessment',
        duration: '45 min',
        stepData: courseSteps[courseSteps.length - 1],
        stepIndex: courseSteps.length
      });
    }
    return list;
  };

  const milestones = getMilestones(steps);

  const getMilestoneStatus = (milestone, index) => {
    const completedList = completedSteps[courseName] || [];
    const isCompleted = completedList.includes(milestone.id);
    if (isCompleted) {
      return 'completed';
    }
    const isUnlocked = isMilestoneUnlocked(milestone, index);
    if (isUnlocked) {
      return 'current';
    }
    return 'locked';
  };

  const getMilestoneCoords = (index, total) => {
    const Y = 100 + index * 180;
    if (index === 0) {
      return { X: 300, Y };
    }
    const X = index % 2 === 1 ? 150 : 450;
    return { X, Y };
  };

  const H = 100 + milestones.length * 180;

  // Calculations
  const completedList = completedSteps[courseName] || [];
  const completedCount = milestones.filter(m => completedList.includes(m.id)).length;
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  // Custom Top Stats Bar Calculations
  const completedTopics = milestones.filter(m => m.type === 'topic' && completedList.includes(m.id)).length;
  const completedQuizzes = milestones.filter(m => m.type === 'quiz' && completedList.includes(m.id)).length;
  const completedChallenges = milestones.filter(m => m.type === 'challenge' && completedList.includes(m.id)).length;

  // Path reference state for dynamic SVG path measurements
  const [pathElement, setPathElement] = useState(null);
  const [currentAnimatedIndex, setCurrentAnimatedIndex] = useState(0);
  const [carCoords, setCarCoords] = useState({ x: 300, y: 100, angle: 90 });
  const [isMoving, setIsMoving] = useState(false);

  // Construct a single continuous path connecting all milestones
  const getFullPathD = () => {
    if (milestones.length === 0) return '';
    const start = getMilestoneCoords(0, milestones.length);
    let d = `M ${start.X} ${start.Y}`;
    for (let i = 0; i < milestones.length - 1; i++) {
      const s = getMilestoneCoords(i, milestones.length);
      const e = getMilestoneCoords(i + 1, milestones.length);
      d += ` C ${s.X} ${s.Y + 90}, ${e.X} ${e.Y - 90}, ${e.X} ${e.Y}`;
    }
    return d;
  };
  
  const fullPathD = getFullPathD();

  // Handle vehicle movement animation when completed steps update
  useEffect(() => {
    const newActiveIdx = milestones.findIndex((m, idx) => getMilestoneStatus(m, idx) === 'current');
    const targetIdx = newActiveIdx !== -1 ? newActiveIdx : milestones.length - 1;
    
    // Helper to update car coordinates
    const updateCoords = (val) => {
      if (!pathElement) return;
      const pathLength = pathElement.getTotalLength();
      const progress = val / (milestones.length - 1);
      const distance = progress * pathLength;
      const pt = pathElement.getPointAtLength(distance);
      const ptAhead = pathElement.getPointAtLength(Math.min(pathLength, distance + 1));
      const angle = Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x) * (180 / Math.PI);
      setCarCoords({ x: pt.x, y: pt.y, angle });
    };

    // First initialization
    if (!pathElement) {
      setCurrentAnimatedIndex(targetIdx);
      const coords = getMilestoneCoords(targetIdx, milestones.length);
      setCarCoords({ x: coords.X, y: coords.Y, angle: 90 });
      return;
    }
    
    // Position immediately if we are mounting or index is identical
    if (currentAnimatedIndex === 0 && carCoords.x === 300 && carCoords.y === 100) {
      setCurrentAnimatedIndex(targetIdx);
      updateCoords(targetIdx);
      return;
    }

    if (targetIdx !== currentAnimatedIndex) {
      setIsMoving(true);
      const controls = animate(currentAnimatedIndex, targetIdx, {
        duration: 2.2,
        ease: "easeInOut",
        onUpdate: (latest) => {
          setCurrentAnimatedIndex(latest);
          updateCoords(latest);
        },
        onComplete: () => {
          setIsMoving(false);
        }
      });
      return () => controls.stop();
    } else {
      updateCoords(targetIdx);
    }
  }, [completedList, pathElement, milestones.length]);

  // Compute trails
  const getTrailParticles = () => {
    if (!pathElement) return [];
    const pathLength = pathElement.getTotalLength();
    const progress = currentAnimatedIndex / (milestones.length - 1);
    const distance = progress * pathLength;
    
    const particles = [];
    const offsets = [12, 24, 36];
    offsets.forEach((offset, idx) => {
      const dist = distance - offset;
      if (dist > 0) {
        const pt = pathElement.getPointAtLength(dist);
        particles.push({
          id: idx,
          x: pt.x,
          y: pt.y,
          opacity: (0.6 - idx * 0.2) * (isMoving ? 1 : 0)
        });
      }
    });
    return particles;
  };
  
  const trailParticles = getTrailParticles();

  const currentSegmentIdx = Math.floor(currentAnimatedIndex);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FC] dark:bg-slate-950 font-sans transition-colors duration-300">
      
      {/* 1. ROADMAP VIEW (DASHBOARD) */}
      {viewMode === 'roadmap' && (
        <>
          <Navbar onNavigate={onNavigate} isAuthenticated={isAuthenticated} onLogout={onLogout} />
          
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
            
            {/* Back Navigation Bar */}
            <div className="mb-8 flex items-center justify-between">
              <button 
                onClick={onBack}
                className="flex items-center text-text-secondary dark:text-slate-400 hover:text-primary dark:hover:text-indigo-400 font-bold transition-colors group"
              >
                <ArrowLeft size={20} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </button>
              
              <span className="text-xs font-black uppercase tracking-wider bg-primary/10 dark:bg-indigo-950/40 text-primary dark:text-indigo-400 px-3 py-1.5 rounded-lg border border-primary/20 dark:border-indigo-900/30">
                AI/ML Learning Path
              </span>
            </div>

            {/* Course Progress Section at Top */}
            <div className="bg-white dark:bg-slate-900 border-2 border-border dark:border-slate-800 rounded-3xl p-6 md:p-8 mb-12 shadow-[0_4px_0_0_rgba(226,232,240,1)] dark:shadow-[0_4px_0_0_rgba(15,23,42,1)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left: Progress Title & Bar */}
                <div className="lg:col-span-5 space-y-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#6C63FF] bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/30">
                      Course Progress
                    </span>
                    <h1 className="text-2xl md:text-3xl font-black text-text-primary dark:text-slate-100 tracking-tight mt-3">{courseName}</h1>
                    <p className="text-xs font-semibold text-text-secondary dark:text-slate-400 mt-1">
                      Climb the winding road to master advanced concepts.
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center text-xs font-black text-text-primary dark:text-slate-200 mb-2">
                      <span>Overall Completion</span>
                      <span className="text-green-600 dark:text-green-400">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden p-[2px] border border-border dark:border-slate-750">
                      <div 
                        className="bg-gradient-to-r from-[#3B3B98] to-[#6C63FF] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(108,99,255,0.4)]"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right: 4 Stats Cards */}
                <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  
                  {/* Topics Card */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 flex flex-col justify-between h-[100px] shadow-sm">
                    <span className="text-xs font-bold text-text-secondary dark:text-slate-400 flex items-center">
                      <BookOpen size={14} className="text-[#3B3B98] mr-1.5" /> Topics
                    </span>
                    <div>
                      <span className="text-2xl font-black text-text-primary dark:text-slate-100">{completedTopics}</span>
                      <span className="text-[10px] text-text-secondary dark:text-slate-400 font-bold ml-1">/{steps.length}</span>
                    </div>
                  </div>
                  
                  {/* Quizzes Card */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 flex flex-col justify-between h-[100px] shadow-sm">
                    <span className="text-xs font-bold text-text-secondary dark:text-slate-400 flex items-center">
                      <Target size={14} className="text-[#FF6B6B] mr-1.5" /> Quizzes
                    </span>
                    <div>
                      <span className="text-2xl font-black text-text-primary dark:text-slate-100">{completedQuizzes}</span>
                      <span className="text-[10px] text-text-secondary dark:text-slate-400 font-bold ml-1">/{steps.filter(s => !s.study.code).length}</span>
                    </div>
                  </div>
                  
                  {/* Challenges Card */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 flex flex-col justify-between h-[100px] shadow-sm">
                    <span className="text-xs font-bold text-text-secondary dark:text-slate-400 flex items-center">
                      <Code size={14} className="text-[#6C63FF] mr-1.5" /> Challenges
                    </span>
                    <div>
                      <span className="text-2xl font-black text-text-primary dark:text-slate-100">{completedChallenges}</span>
                      <span className="text-[10px] text-text-secondary dark:text-slate-400 font-bold ml-1">/{steps.filter(s => s.study.code).length}</span>
                    </div>
                  </div>
                  
                  {/* Streak Card */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl p-4 flex flex-col justify-between h-[100px] shadow-sm">
                    <span className="text-xs font-bold text-text-secondary dark:text-slate-400 flex items-center">
                      <Flame size={14} className="text-[#FF6B6B] mr-1.5 fill-accent text-accent" /> Streak
                    </span>
                    <div>
                      <span className="text-2xl font-black text-text-primary dark:text-slate-100">12</span>
                      <span className="text-[10px] text-green-600 dark:text-green-400 font-black ml-1">DAYS</span>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Winding Road Journey Section */}
            <div className="flex justify-center items-center py-12 overflow-x-hidden md:overflow-x-visible">
              <div 
                className="relative w-full max-w-[600px]" 
                style={{ height: `${H}px` }}
              >
                
                {/* Curved SVG Road */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none" 
                  viewBox={`0 0 600 ${H}`} 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Hidden continuous path for length & point measurements */}
                  <path 
                    d={fullPathD} 
                    ref={setPathElement} 
                    fill="none" 
                    stroke="transparent" 
                    className="pointer-events-none"
                  />

                  {milestones.slice(0, -1).map((_, i) => {
                    const start = getMilestoneCoords(i, milestones.length);
                    const end = getMilestoneCoords(i + 1, milestones.length);
                    const pathD = `M ${start.X} ${start.Y} C ${start.X} ${start.Y + 90}, ${end.X} ${end.Y - 90}, ${end.X} ${end.Y}`;
                    
                    const targetMilestone = milestones[i + 1];
                    const targetStatus = getMilestoneStatus(targetMilestone, i + 1);
                    const isUnlocked = targetStatus !== 'locked';
                    const isCurrentlyTraveled = isMoving && i === currentSegmentIdx;
                    
                    return (
                      <g key={i}>
                        {/* Thick Road Track */}
                        <path 
                          d={pathD} 
                          stroke={isUnlocked ? '#6C63FF' : '#E2E8F0'} 
                          strokeWidth={28} 
                          strokeLinecap="round" 
                          fill="none" 
                          className="transition-colors duration-500 dark:stroke-slate-800"
                        />
                        {/* Road Glow layer when unlocked or active */}
                        {(isCurrentlyTraveled || (isUnlocked && !isMoving)) && (
                          <path 
                            d={pathD} 
                            stroke="#6C63FF" 
                            strokeWidth={36} 
                            strokeLinecap="round" 
                            fill="none" 
                            className="opacity-20 blur-sm transition-opacity duration-300"
                          />
                        )}
                        {/* Lane Dash Divider */}
                        <path 
                          d={pathD} 
                          stroke={isUnlocked ? '#FFFFFF' : '#94A3B8'} 
                          strokeWidth={2} 
                          strokeDasharray="6,6" 
                          strokeLinecap="round" 
                          fill="none" 
                          className="transition-colors duration-500 opacity-70 dark:stroke-slate-650"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Motion Trail Particles */}
                {trailParticles.map(p => (
                  <div 
                    key={p.id}
                    className="absolute w-3.5 h-3.5 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#6C63FF] pointer-events-none transition-opacity duration-300 shadow-[0_0_8px_#FF6B6B] z-20"
                    style={{
                      left: `${(p.x / 600) * 100}%`,
                      top: `${(p.y / H) * 100}%`,
                      transform: 'translate(-50%, -50%) scale(0.8)',
                      opacity: p.opacity
                    }}
                  />
                ))}

                {/* Animated Progress Vehicle (Sports Car) */}
                <div 
                  className="absolute z-40 pointer-events-none transition-transform duration-75"
                  style={{
                    left: `${(carCoords.x / 600) * 100}%`,
                    top: `${(carCoords.y / H) * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${carCoords.angle}deg)`
                  }}
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Shadow */}
                    <rect x="2" y="5" width="36" height="15" rx="4" fill="black" opacity="0.25" />
                    {/* Body */}
                    <rect x="4" y="3" width="32" height="18" rx="5" fill="#FF6B6B" />
                    {/* Windshield / Cab */}
                    <rect x="12" y="6" width="14" height="12" rx="2.5" fill="#1E293B" />
                    <rect x="15" y="7.5" width="8" height="9" rx="1" fill="#475569" />
                    {/* Spoiler */}
                    <rect x="4" y="5" width="2" height="14" rx="0.5" fill="#EF4444" />
                    {/* Headlights */}
                    <circle cx="34" cy="7.5" r="1.5" fill="#FDE047" />
                    <circle cx="34" cy="16.5" r="1.5" fill="#FDE047" />
                    {/* Tail Lights */}
                    <rect x="5" y="6" width="1" height="2.5" fill="#EF4444" />
                    <rect x="5" y="15.5" width="1" height="2.5" fill="#EF4444" />
                    {/* Wheels */}
                    <rect x="9" y="1" width="7" height="2" rx="0.5" fill="#0F172A" />
                    <rect x="24" y="1" width="7" height="2" rx="0.5" fill="#0F172A" />
                    <rect x="9" y="21" width="7" height="2" rx="0.5" fill="#0F172A" />
                    <rect x="24" y="21" width="7" height="2" rx="0.5" fill="#0F172A" />
                  </svg>
                </div>
                
                {/* Milestone Node Buttons & Info Cards */}
                {milestones.map((milestone, index) => {
                  const coords = getMilestoneCoords(index, milestones.length);
                  const status = getMilestoneStatus(milestone, index);
                  const isUnlocked = status !== 'locked';
                  
                  // Setup type-specific visual properties
                  let Icon = BookOpen;
                  let colorClass = 'bg-[#3B3B98] text-white';
                  let emoji = '📚';
                  let typeLabel = 'Topic';
                  
                  if (milestone.type === 'quiz') {
                    Icon = HelpCircle;
                    colorClass = 'bg-[#FF6B6B] text-white';
                    emoji = '❓';
                    typeLabel = 'Practice Quiz';
                  } else if (milestone.type === 'challenge') {
                    Icon = Code;
                    colorClass = 'bg-[#6C63FF] text-white';
                    emoji = '💻';
                    typeLabel = 'Coding Challenge';
                  } else if (milestone.type === 'assessment') {
                    Icon = Trophy;
                    colorClass = 'bg-amber-500 text-white';
                    emoji = '🏆';
                    typeLabel = 'Final Assessment';
                  }
                  
                  const handleClick = () => {
                    if (status === 'locked') return;
                    
                    if (milestone.type === 'topic') {
                      handleStartLesson(milestone);
                    } else if (milestone.type === 'quiz' || milestone.type === 'challenge') {
                      setActiveStep(milestone);
                      setLessonPhase('quiz');
                      setViewMode('lesson');
                      setCurrentQuestionIdx(0);
                      setSelectedOption(null);
                      setIsAnswerChecked(false);
                      setScore(0);
                    } else if (milestone.type === 'assessment') {
                      const allQuestions = [];
                      steps.forEach(s => {
                        if (s.quiz) allQuestions.push(...s.quiz);
                      });
                      
                      const assessmentStepData = {
                        id: 'final',
                        title: 'Final Course Assessment',
                        study: { 
                          heading: 'Final Course Assessment', 
                          content: 'Complete the comprehensive test covering all lessons in this course.' 
                        },
                        quiz: allQuestions
                      };
                      
                      setActiveStep({
                        ...milestone,
                        stepData: assessmentStepData
                      });
                      setLessonPhase('study');
                      setViewMode('lesson');
                      setCurrentQuestionIdx(0);
                      setSelectedOption(null);
                      setIsAnswerChecked(false);
                      setScore(0);
                    }
                  };
                  
                  return (
                    <div 
                      key={milestone.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                      style={{ 
                        left: `${(coords.X / 600) * 100}%`, 
                        top: `${(coords.Y / H) * 100}%` 
                      }}
                    >
                      {/* Glow Ring for Current Step */}
                      {status === 'current' && (
                        <div className="absolute -inset-3 rounded-full bg-[#6C63FF]/30 dark:bg-indigo-500/30 animate-pulse z-0" />
                      )}
                      
                      {/* Interactive Circle Node */}
                      <motion.button
                        whileHover={isUnlocked ? { scale: 1.15 } : {}}
                        whileTap={isUnlocked ? { scale: 0.95 } : {}}
                        onClick={handleClick}
                        className={`w-14 h-14 rounded-full flex items-center justify-center border-4 shadow-lg transition-all duration-300 z-10 relative ${
                          status === 'completed'
                            ? 'bg-[#4CAF50] border-white dark:border-slate-900 text-white shadow-[#4CAF50]/20'
                            : status === 'current'
                              ? 'bg-[#3B3B98] border-white dark:border-slate-900 text-white shadow-[#3B3B98]/30 ring-4 ring-[#6C63FF]/20'
                              : 'bg-slate-200 dark:bg-slate-800 border-white dark:border-slate-900 text-slate-400 dark:text-slate-650 shadow-none cursor-not-allowed'
                        }`}
                      >
                        {status === 'completed' ? (
                          <Check size={24} className="stroke-[3.5]" />
                        ) : status === 'locked' ? (
                          <Lock size={18} />
                        ) : (
                          <Icon size={20} className="stroke-[2.5]" />
                        )}
                      </motion.button>
                      
                      {/* Info Card Next to Circle */}
                      <div 
                        className={`absolute w-[180px] md:w-[220px] transition-all duration-300 pointer-events-auto ${
                          coords.X === 150
                            ? 'left-1/2 -translate-x-1/2 top-[65px] md:right-[75px] md:left-auto md:translate-x-0 md:top-1/2 md:-translate-y-1/2'
                            : coords.X === 450
                              ? 'left-1/2 -translate-x-1/2 top-[65px] md:left-[75px] md:right-auto md:translate-x-0 md:top-1/2 md:-translate-y-1/2'
                              : 'left-1/2 -translate-x-1/2 top-[65px] md:left-[75px] md:translate-x-0 md:top-1/2 md:-translate-y-1/2'
                        }`}
                      >
                        <div 
                          className={`p-4 rounded-3xl border-2 transition-all duration-300 ${
                            status === 'current'
                              ? 'bg-white dark:bg-slate-900 border-[#6C63FF] dark:border-indigo-500 shadow-[0_4px_12px_rgba(108,99,255,0.15)] md:scale-105'
                              : status === 'completed'
                                ? 'bg-white dark:bg-slate-900 border-[#4CAF50] dark:border-green-800/80 shadow-sm'
                                : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-850 opacity-60'
                          }`}
                        >
                          <div className="flex items-center space-x-1.5 mb-1.5 justify-center md:justify-start">
                            <span className="text-sm">{emoji}</span>
                            <span className="text-[9px] font-black uppercase tracking-wider text-text-secondary dark:text-slate-400">
                              {typeLabel}
                            </span>
                          </div>
                          
                          <h4 className="text-xs md:text-sm font-black text-text-primary dark:text-slate-100 leading-snug tracking-tight text-center md:text-left flex items-center justify-center md:justify-start">
                            {milestone.title}
                          </h4>
                          
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[9px] font-bold text-text-secondary dark:text-slate-450">
                            <span className="flex items-center">
                              {milestone.type === 'challenge' && (
                                <Code size={10} className="mr-1 text-[#6C63FF]" />
                              )}
                              {milestone.duration}
                            </span>
                            <span className={
                              status === 'completed' 
                                ? 'text-green-600 dark:text-green-400 font-bold' 
                                : status === 'current' 
                                  ? 'text-[#6C63FF] dark:text-indigo-400 font-bold' 
                                  : 'text-slate-400 dark:text-slate-650'
                            }>
                              {status === 'completed' ? 'Completed' : status === 'current' ? 'Current' : 'Locked'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  );
                })}
                
              </div>
            </div>
            
          </main>
          
          <Footer />
        </>
      )}

      {/* 2. IMMERSIVE LESSON VIEW (FULL SCREEN) */}
      {viewMode === 'lesson' && activeStep && (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
          
          {/* Immersive Top Bar */}
          <div className="max-w-4xl w-full mx-auto px-4 md:px-6 pt-6 pb-4 flex items-center space-x-6">
            <button 
              onClick={() => setViewMode('roadmap')}
              className="text-text-secondary dark:text-slate-400 hover:text-text-primary dark:hover:text-slate-100 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={22} className="stroke-[2.5]" />
            </button>
            <div className="flex-grow bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-primary dark:bg-indigo-500 h-3 rounded-full transition-all duration-300"
                style={{ 
                  width: lessonPhase === 'study' 
                    ? '20%' 
                    : lessonPhase === 'quiz' 
                      ? `${20 + ((currentQuestionIdx + 1) / activeStep.stepData.quiz.length) * 70}%`
                      : '100%'
                }}
              />
            </div>
            {lessonPhase === 'quiz' && (
              <span className="text-xs font-black text-text-secondary dark:text-slate-400 uppercase tracking-widest hidden sm:inline">
                Q {currentQuestionIdx + 1}/{activeStep.stepData.quiz.length}
              </span>
            )}
          </div>

          {/* Immersive Body Area */}
          <div className="flex-grow flex items-center justify-center p-4">
            <div className="max-w-xl w-full py-8 md:py-12">
              
              {/* SUB-PHASE A: STUDY SLIDE */}
              {lessonPhase === 'study' && (
                <div className="space-y-6 animate-scale-up">
                  <div className="flex items-center space-x-3 text-primary dark:text-indigo-400">
                    <BookOpen size={28} />
                    <span className="text-xs font-black uppercase tracking-widest">Core Concept Material</span>
                  </div>
                  
                  <h2 className="text-3xl font-black text-text-primary dark:text-slate-100 tracking-tight leading-tight">
                    {activeStep.stepData.study.heading}
                  </h2>
                  
                  <p className="text-lg text-text-secondary dark:text-slate-400 font-semibold leading-relaxed">
                    {activeStep.stepData.study.content}
                  </p>

                  {activeStep.stepData.study.highlights && (
                    <div className="bg-indigo-50/30 dark:bg-indigo-955/10 border border-indigo-100/40 dark:border-indigo-900/30 rounded-2xl p-5">
                      <p className="font-bold text-sm text-primary dark:text-indigo-450 mb-3 uppercase tracking-wider">
                        Key Takeaways:
                      </p>
                      <ul className="space-y-2.5">
                        {activeStep.stepData.study.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-start text-sm font-bold text-text-primary dark:text-slate-300">
                            <span className="bg-indigo-100 dark:bg-indigo-950 p-0.5 rounded-full text-primary dark:text-indigo-400 mr-2.5 mt-0.5">
                              <Check size={12} className="stroke-[3]" />
                            </span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeStep.stepData.study.code && (
                    <div className="bg-[#0F172A] rounded-2xl p-5 overflow-x-auto border border-slate-800">
                      <pre className="font-mono text-xs text-slate-300">
                        <code>{activeStep.stepData.study.code}</code>
                      </pre>
                    </div>
                  )}

                  <div className="pt-8 flex justify-end">
                    {activeStep.type === 'topic' ? (
                      <button
                        onClick={handleCompleteStep}
                        className="w-full sm:w-auto bg-[#4CAF50] hover:bg-green-600 text-white px-10 py-4.5 rounded-2xl font-bold text-base flex items-center justify-center shadow-[0_4px_0_0_rgba(56,142,60,1)] active:translate-y-[4px] active:shadow-none transition-all"
                      >
                        COMPLETE STUDY
                        <ArrowRight size={18} className="ml-1.5" />
                      </button>
                    ) : (
                      <button
                        onClick={handleStartPractice}
                        className="w-full sm:w-auto bg-primary hover:bg-indigo-700 text-white px-10 py-4.5 rounded-2xl font-bold text-base flex items-center justify-center shadow-[0_4px_0_0_rgba(67,56,202,1)] active:translate-y-[4px] active:shadow-none transition-all"
                      >
                        START PRACTICE
                        <ArrowRight size={18} className="ml-1.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* SUB-PHASE B: ACTIVE PRACTICE QUIZ */}
              {lessonPhase === 'quiz' && (
                <div className="space-y-6">
                  <span className="text-xs font-black uppercase tracking-widest text-cyan-500">Practice Quiz</span>
                  
                  <h2 className="text-2xl md:text-3xl font-black text-text-primary dark:text-slate-100 leading-tight">
                    {activeStep.stepData.quiz[currentQuestionIdx].question}
                  </h2>

                  {/* Multi-choice items */}
                  <div className="space-y-3 pt-4">
                    {activeStep.stepData.quiz[currentQuestionIdx].options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = activeStep.stepData.quiz[currentQuestionIdx].answerIndex === idx;
                      
                      let optionStyle = 'border-border dark:border-slate-800 hover:border-primary dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900';
                      if (isSelected && !isAnswerChecked) {
                        optionStyle = 'border-primary dark:border-indigo-400 bg-indigo-50/10 dark:bg-indigo-950/20';
                      } else if (isAnswerChecked) {
                        if (isCorrect) {
                          optionStyle = 'border-green-500 bg-green-50/10 dark:bg-green-950/10 text-green-600 dark:text-green-400';
                        } else if (isSelected && !isCorrect) {
                          optionStyle = 'border-red-500 bg-red-50/10 dark:bg-red-950/10 text-red-600 dark:text-red-400';
                        } else {
                          optionStyle = 'border-border dark:border-slate-800 opacity-60 bg-slate-50/30 dark:bg-slate-900';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(idx)}
                          disabled={isAnswerChecked}
                          className={`w-full text-left p-5 rounded-2xl border-2 font-bold text-base flex items-center justify-between transition-all ${optionStyle}`}
                        >
                          <span>{option}</span>
                          {isAnswerChecked && isCorrect && <CheckCircle2 className="text-green-500 flex-shrink-0 ml-2" size={22} />}
                          {isAnswerChecked && isSelected && !isCorrect && <XCircle className="text-red-500 flex-shrink-0 ml-2" size={22} />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Answer Explanation */}
                  {isAnswerChecked && (
                    <div className={`p-5 rounded-2xl border animate-scale-up ${
                      selectedOption === activeStep.stepData.quiz[currentQuestionIdx].answerIndex 
                        ? 'bg-green-50 dark:bg-green-950/10 border-green-200 dark:border-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-red-50 dark:bg-red-950/10 border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      <p className="font-black text-sm mb-1">
                        {selectedOption === activeStep.stepData.quiz[currentQuestionIdx].answerIndex ? 'Correct!' : 'Incorrect'}
                      </p>
                      <p className="text-sm font-semibold">{activeStep.stepData.quiz[currentQuestionIdx].explanation}</p>
                    </div>
                  )}

                  {/* Action Controls */}
                  <div className="pt-6 flex justify-end">
                    {!isAnswerChecked ? (
                      <button
                        onClick={handleCheckAnswer}
                        disabled={selectedOption === null}
                        className={`w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-base transition-all shadow-[0_4px_0_0_rgba(67,56,202,1)] ${
                          selectedOption !== null
                            ? 'bg-primary text-white hover:bg-indigo-700'
                            : 'bg-slate-100 text-slate-400 shadow-none border border-slate-200 cursor-not-allowed dark:bg-slate-800 dark:border-slate-800'
                        }`}
                      >
                        CHECK ANSWER
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="w-full sm:w-auto bg-primary hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-bold text-base flex items-center justify-center shadow-[0_4px_0_0_rgba(67,56,202,1)]"
                      >
                        {currentQuestionIdx + 1 === activeStep.stepData.quiz.length ? 'FINISH' : 'NEXT'}
                        <ArrowRight size={18} className="ml-1.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* SUB-PHASE C: LESSON COMPLETION CELEBRATION */}
              {lessonPhase === 'complete' && (
                <div className="text-center py-10 space-y-8 flex flex-col items-center animate-scale-up">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-50 dark:bg-amber-950/20 rounded-full mb-2">
                    <Trophy size={50} className="text-accent fill-accent animate-bounce" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-text-primary dark:text-slate-100">Congratulations!</h2>
                    <p className="text-text-secondary dark:text-slate-400 font-semibold mt-1">
                      You finished all practice modules for "{activeStep.title}".
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950 border border-border dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-widest mb-1">XP Gained</p>
                      <p className="text-xl font-black text-primary dark:text-indigo-400">+10 XP</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-text-secondary dark:text-slate-400 uppercase tracking-widest mb-1">Gems Earned</p>
                      <p className="text-xl font-black text-cyan-500">+5 Gems</p>
                    </div>
                  </div>

                  <button
                    onClick={handleCompleteStep}
                    className="w-full max-w-sm bg-primary hover:bg-indigo-700 text-white font-bold py-4.5 rounded-2xl shadow-[0_4px_0_0_rgba(67,56,202,1)] active:translate-y-[4px] active:shadow-none transition-all"
                  >
                    CONTINUE ON ROADMAP
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default RoadmapPage;
