import React, { useState, useEffect, useCallback } from 'react';
import { X, BookOpen, CheckCircle2, XCircle, Trophy, ArrowRight, Check, Lock, Play, ArrowLeft, Flame, Target, Medal, Code, HelpCircle } from 'lucide-react';
import { motion, animate } from 'framer-motion';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { roadmapData } from '../data/roadmapData';
import PythonEditor from '../components/PythonEditor';
import { runCode } from '../api/api';

const transpilePythonToJS = (pyCode) => {
  let code = pyCode;
  let lines = code.split('\n');
  let indentStack = [0];
  let resultLines = [];

  const polyfills = `
    const len = (x) => x && typeof x.length !== 'undefined' ? x.length : (x.size || 0);
    const sum = (x) => Array.isArray(x) ? x.reduce((a, b) => a + b, 0) : 0;
    const min = (x) => Array.isArray(x) ? Math.min(...x) : Math.min(x);
    const max = (x) => Array.isArray(x) ? Math.max(...x) : Math.max(x);
    const abs = Math.abs;
    const round = (val, dec) => dec ? Number(val.toFixed(dec)) : Math.round(val);
    const pow = Math.pow;
    const set = (x) => new Set(x);
    const isinstance = (x, t) => {
      if (t === list || t === 'list') return Array.isArray(x);
      if (t === str || t === 'str') return typeof x === 'string';
      if (t === int || t === 'int' || t === float || t === 'float') return typeof x === 'number';
      return false;
    };
    const list = 'list';
    const str = 'str';
    const int = 'int';
    const float = 'float';
    const math = {
      exp: Math.exp,
      sqrt: Math.sqrt,
      pow: Math.pow,
      pi: Math.PI
    };
    const np = {
      exp: (x) => Array.isArray(x) ? x.map(Math.exp) : Math.exp(x),
      sqrt: (x) => Array.isArray(x) ? x.map(Math.sqrt) : Math.sqrt(x),
      min: (x) => Array.isArray(x) ? Math.min(...x) : Math.min(x),
      max: (x) => Array.isArray(x) ? Math.max(...x) : Math.max(x),
      mean: (x) => Array.isArray(x) ? sum(x)/x.length : x,
      std: (x) => {
        if (!Array.isArray(x)) return 0;
        const m = sum(x)/x.length;
        return Math.sqrt(sum(x.map(v => Math.pow(v - m, 2))) / x.length);
      },
      maximum: (a, b) => {
        if (Array.isArray(b)) {
          return b.map(v => Math.max(a, v));
        }
        if (Array.isArray(a)) {
          return a.map(v => Math.max(v, b));
        }
        return Math.max(a, b);
      }
    };
    const zip = (a, b) => {
      const len = Math.min(a.length, b.length);
      const res = [];
      for(let i=0; i<len; i++) res.push([a[i], b[i]]);
      return res;
    };
    const re = {
      sub: (pattern, repl, string) => {
        const cleanPattern = pattern.replace(/^r['"]|['"]$/g, '');
        return string.replace(new RegExp(cleanPattern, 'g'), repl);
      }
    };
  `;

  for (let i = 0; i < lines.length; i++) {
    let rawLine = lines[i];
    if (rawLine.trim() === '' || rawLine.trim().startsWith('#')) {
      resultLines.push(rawLine.replace(/#.*/, (m) => '//' + m.slice(1)));
      continue;
    }

    let indent = rawLine.match(/^ */)[0].length;
    while (indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      resultLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
    }

    let line = rawLine.trim();

    if (line.startsWith('import ') || line.startsWith('from ')) {
      resultLines.push(' '.repeat(indent) + '// ' + line);
      continue;
    }

    // def statement
    const defMatch = line.match(/^def\s+(\w+)\s*\((.*?)\)\s*:/);
    if (defMatch) {
      const [_, funcName, args] = defMatch;
      resultLines.push(' '.repeat(indent) + `function ${funcName}(${args}) {`);
      indentStack.push(indent + 4);
      continue;
    }

    // if/elif/else statements
    const ifMatch = line.match(/^(if|elif)\s+(.*?)\s*:/);
    if (ifMatch) {
      const [_, keyword, condition] = ifMatch;
      const jsKeyword = keyword === 'elif' ? 'else if' : 'if';
      let jsCond = condition
        .replace(/\band\b/g, '&&')
        .replace(/\bor\b/g, '||')
        .replace(/\bnot\b/g, '!')
        .replace(/\bNone\b/g, 'null');
      resultLines.push(' '.repeat(indent) + `${jsKeyword} (${jsCond}) {`);
      indentStack.push(indent + 4);
      continue;
    }

    const elseMatch = line.match(/^else\s*:/);
    if (elseMatch) {
      resultLines.push(' '.repeat(indent) + `else {`);
      indentStack.push(indent + 4);
      continue;
    }

    // for loop statement
    const forMatch = line.match(/^for\s+(\w+)\s+in\s+(.*?)\s*:/);
    if (forMatch) {
      const [_, item, listName] = forMatch;
      resultLines.push(' '.repeat(indent) + `for (let ${item} of ${listName}) {`);
      indentStack.push(indent + 4);
      continue;
    }

    // Generator expressions in functions
    let genExpRegex = /(\w+)\(\s*(.*?)\s+for\s+([^ ]+)\s+in\s+([^\)]+)\)/g;
    let lineProcessed = line.replace(genExpRegex, (match, func, expr, variable, iterable) => {
      if (variable.includes(',')) {
        const vars = variable.split(',').map(v => v.trim());
        return `${func}((${iterable}).map(([${vars.join(', ')}]) => ${expr}))`;
      }
      return `${func}((${iterable}).map((${variable}) => ${expr}))`;
    });

    // List comprehensions
    let listCompRegex = /\[\s*(.*?)\s+for\s+([^ ]+)\s+in\s+([^\]]+)\]/g;
    lineProcessed = lineProcessed.replace(listCompRegex, (match, expr, variable, iterable) => {
      if (variable.includes(',')) {
        const vars = variable.split(',').map(v => v.trim());
        return `(${iterable}).map(([${vars.join(', ')}]) => ${expr})`;
      }
      return `(${iterable}).map((${variable}) => ${expr})`;
    });

    // List repetition
    let listRepRegex = /(\[[^\]]+\])\s*\*\s*([^\s;]+)/g;
    lineProcessed = lineProcessed.replace(listRepRegex, 'Array($2).fill($1[0])');

    // split() without arguments
    lineProcessed = lineProcessed.replace(/\.split\(\)/g, '.trim().split(/\\s+/)');

    lineProcessed = lineProcessed
      .replace(/\bTrue\b/g, 'true')
      .replace(/\bFalse\b/g, 'false')
      .replace(/\bNone\b/g, 'null')
      .replace(/\bpass\b/g, '')
      .replace(/#.*/, (m) => '//' + m.slice(1));

    resultLines.push(' '.repeat(indent) + lineProcessed);
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    resultLines.push(' '.repeat(indentStack[indentStack.length - 1]) + '}');
  }

  return polyfills + '\n' + resultLines.join('\n');
};

const RoadmapPage = ({ courseName, onBack, onNavigate, isAuthenticated, onLogout }) => {
  const steps = roadmapData[courseName] || [];

  // Local Storage Progress Persistence
  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem('AI Lab Learning Portal_completed_steps');
    return saved ? JSON.parse(saved) : {};
  });

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset your course progress? This will lock all milestones except the first one and return the car to the beginning.")) {
      const updated = { ...completedSteps };
      delete updated[courseName];
      setCompletedSteps(updated);
      localStorage.setItem('AI Lab Learning Portal_completed_steps', JSON.stringify(updated));
      setCurrentAnimatedIndex(0);
      setCarCoords({ x: 300, y: 100, angle: 90 });
    }
  };

  // Window width state for responsive roadmap layout
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Coding challenge states
  const [userCode, setUserCode] = useState('');
  const [compileOutput, setCompileOutput] = useState(null);
  const [isChallengePassed, setIsChallengePassed] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);



  // Draggable divider between editor and console
  const [editorHeight, setEditorHeight] = useState(420);
  const [isDragging, setIsDragging] = useState(false);
  const editorConsoleRef = React.useRef(null);
  const dragStartY = React.useRef(0);
  const dragStartHeight = React.useRef(420);

  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY || e.touches?.[0]?.clientY || 0;
    dragStartHeight.current = editorHeight;
  }, [editorHeight]);

  useEffect(() => {
    if (!isDragging) return;
    const handleDragMove = (e) => {
      const clientY = e.clientY || e.touches?.[0]?.clientY || 0;
      const delta = clientY - dragStartY.current;
      // Total height is 700px. Header + divider = ~46px. Console min-h = 180px.
      // Maximum editor height = 700 - 46 - 180 = 474px.
      const newHeight = Math.max(150, Math.min(474, dragStartHeight.current + delta));
      setEditorHeight(newHeight);
    };
    const handleDragEnd = () => setIsDragging(false);
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove);
    window.addEventListener('touchend', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  // Helper to determine milestone lock/complete status
  const isMilestoneCompleted = (milestone) => {
    const completedList = completedSteps[courseName] || [];
    if (milestone.type === 'topic') {
      const isStudyDone = completedList.includes(milestone.id);
      const isChallenge = milestone.stepData.study.code ? true : false;
      const hasPractice = isChallenge || (milestone.stepData.quiz && milestone.stepData.quiz.length > 0);
      if (hasPractice) {
        const practiceId = milestone.id.replace('-topic', '-practice');
        const isPracticeDone = completedList.includes(practiceId);
        return isStudyDone && isPracticeDone;
      }
      return isStudyDone;
    }
    return completedList.includes(milestone.id);
  };

  const isMilestoneUnlocked = (milestone, idx) => {
    const index = idx !== undefined && idx !== null ? idx : (milestones ? milestones.indexOf(milestone) : -1);
    if (index <= 0) return true;
    const prevMilestone = milestones[index - 1];
    if (!prevMilestone) return false;
    return isMilestoneCompleted(prevMilestone);
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

  const handleStartPracticeForMilestone = (milestone) => {
    const isChallenge = milestone.stepData.study.code ? true : false;
    const practiceMilestone = {
      ...milestone,
      id: milestone.id.replace('-topic', '-practice'),
      type: isChallenge ? 'challenge' : 'quiz',
      title: isChallenge ? `Coding Challenge: ${milestone.title}` : `${milestone.title} Quiz`,
      duration: isChallenge ? '30 min' : '10 min',
    };
    setActiveStep(practiceMilestone);
    setLessonPhase('quiz');
    setViewMode('lesson');
    if (isChallenge) {
      setUserCode(practiceMilestone.stepData.codingChallenge?.initialCode || '');
      setCompileOutput(null);
      setIsChallengePassed(false);
    } else {
      setCurrentQuestionIdx(0);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setScore(0);
    }
  };

  const handleStartPractice = () => {
    if (activeStep.type === 'challenge') {
      setLessonPhase('quiz');
      setUserCode(activeStep.stepData.codingChallenge?.initialCode || '');
      setCompileOutput(null);
      setIsChallengePassed(false);
    } else if (!activeStep.stepData.quiz || activeStep.stepData.quiz.length === 0) {
      handleCompleteStep();
    } else {
      setLessonPhase('quiz');
    }
  };

  const handleCompileRun = async () => {
    const challenge = activeStep.stepData.codingChallenge;
    if (!challenge) return;

    setIsCompiling(true);
    setCompileOutput(null);

    try {
      // Send the code to the compilation server
      const result = await runCode({
        code: userCode,
        stdin: '',
      });

      // Server returned an error in stderr
      if (result.stderr) {
        setCompileOutput({ success: false, error: result.stderr });
        setIsChallengePassed(false);
        return;
      }

      // Compare stdout against test cases
      const stdout = result.stdout.trim();
      const testResults = challenge.testCases.map((tc, idx) => {
        const expectedStr = JSON.stringify(tc.expected);
        // Simple line-based matching — each test case output on a line
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
    } catch (err) {
      setCompileOutput({ success: false, error: err.message });
      setIsChallengePassed(false);
    } finally {
      setIsCompiling(false);
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

  const getStreakCount = () => {
    try {
      const saved = localStorage.getItem('AI_Lab_Streak_Info');
      if (!saved) return 0;
      const streakInfo = JSON.parse(saved);
      if (!streakInfo.history) streakInfo.history = [];

      // Check if streak is broken (last activity older than yesterday)
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (streakInfo.lastActivityDate && streakInfo.lastActivityDate !== today && streakInfo.lastActivityDate !== yesterdayStr) {
        return 0;
      }
      return streakInfo.count || 0;
    } catch (e) {
      return 0;
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
            // broken streak or first activity
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
    }
    setViewMode('roadmap');
    setActiveStep(null);
    window.scrollTo(0, 0);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
    if (currentQuestionIdx + 1 < activeStep.stepData.quiz.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      handleCompleteStep();
    }
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
    });

    // 2. Final Course Assessment
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
    const isCompleted = isMilestoneCompleted(milestone);
    if (isCompleted) {
      return 'completed';
    }
    const isUnlocked = isMilestoneUnlocked(milestone, index);
    if (isUnlocked) {
      return 'current';
    }
    return 'locked';
  };

  const isSmallScreen = windowWidth <= 750;
  const isTinyScreen = windowWidth < 480;

  const getMilestoneCoords = (index, total) => {
    const Y = 100 + index * 180;
    if (index === 0) {
      return { X: 300, Y };
    }
    // Reduce amplitude on small screens so cards fit on the sides
    const amplitude = isTinyScreen ? 60 : (isSmallScreen ? 80 : 150);
    const X = index % 2 === 1 ? (300 - amplitude) : (300 + amplitude);
    return { X, Y };
  };

  // Path reference state for dynamic SVG path measurements
  const [pathElement, setPathElement] = useState(null);
  const [milestoneDistances, setMilestoneDistances] = useState([]);
  const [currentAnimatedIndex, setCurrentAnimatedIndex] = useState(0);
  const [carCoords, setCarCoords] = useState({ x: 300, y: 100, angle: 90 });
  const [isMoving, setIsMoving] = useState(false);

  // Calculations
  const completedList = completedSteps[courseName] || [];
  const completedCount = milestones.filter(m => isMilestoneCompleted(m)).length;
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  // Custom Top Stats Bar Calculations
  const completedTopics = steps.filter(step => completedList.includes(`step-${step.id}-topic`)).length;
  const completedQuizzes = steps.filter(step => {
    const isChallenge = step.study.code ? true : false;
    return !isChallenge && completedList.includes(`step-${step.id}-practice`);
  }).length;
  const completedChallenges = steps.filter(step => {
    const isChallenge = step.study.code ? true : false;
    return isChallenge && completedList.includes(`step-${step.id}-practice`);
  }).length;

  const isMilestoneRevealed = (index) => {
    if (index === 0) return true;
    return currentAnimatedIndex >= index - 0.5;
  };

  const getGateCoords = (i) => {
    if (!pathElement || milestoneDistances.length <= i) {
      // Fallback using average of milestone coordinates
      const prev = getMilestoneCoords(i - 1, milestones.length);
      const curr = getMilestoneCoords(i, milestones.length);
      return { x: (prev.X + curr.X) / 2, y: (prev.Y + curr.Y) / 2, angle: 90 };
    }
    const startDist = milestoneDistances[i - 1];
    const endDist = milestoneDistances[i];
    const midDist = (startDist + endDist) / 2;
    const pt = pathElement.getPointAtLength(midDist);
    const ptAhead = pathElement.getPointAtLength(Math.min(pathElement.getTotalLength(), midDist + 1));
    const angle = Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x) * (180 / Math.PI);
    return { x: pt.x, y: pt.y, angle };
  };

  const revealedMilestones = milestones.filter((m, idx) => isMilestoneRevealed(idx));
  const H = 100 + (Math.max(1, milestones.length) - 1) * 180 + 100;
  const cloudStartUpdateY = 100 + currentAnimatedIndex * 180 + 90;

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

  // Calculate exact distances along the path for all milestones
  useEffect(() => {
    if (!pathElement || milestones.length === 0) return;

    const distances = [0];
    const svgNS = "http://www.w3.org/2000/svg";
    const tempSvg = document.createElementNS(svgNS, "svg");
    tempSvg.style.position = "absolute";
    tempSvg.style.width = "0";
    tempSvg.style.height = "0";
    tempSvg.style.visibility = "hidden";
    document.body.appendChild(tempSvg);

    const start = getMilestoneCoords(0, milestones.length);
    let d = `M ${start.X} ${start.Y}`;

    for (let i = 0; i < milestones.length - 1; i++) {
      const s = getMilestoneCoords(i, milestones.length);
      const e = getMilestoneCoords(i + 1, milestones.length);
      d += ` C ${s.X} ${s.Y + 90}, ${e.X} ${e.Y - 90}, ${e.X} ${e.Y}`;

      const tempPath = document.createElementNS(svgNS, "path");
      tempPath.setAttribute("d", d);
      tempSvg.appendChild(tempPath);
      distances.push(tempPath.getTotalLength());
    }

    document.body.removeChild(tempSvg);
    setMilestoneDistances(distances);
  }, [pathElement, milestones.length, windowWidth]);

  // Handle vehicle movement animation when completed steps update
  useEffect(() => {
    const newActiveIdx = milestones.findIndex((m, idx) => getMilestoneStatus(m, idx) === 'current');
    const targetIdx = newActiveIdx !== -1 ? newActiveIdx : milestones.length - 1;

    // Helper to update car coordinates
    const updateCoords = (val) => {
      if (!pathElement || milestoneDistances.length === 0) return;
      const pathLength = pathElement.getTotalLength();

      const segmentIdx = Math.floor(val);
      const t = val - segmentIdx;

      let distance = 0;
      if (segmentIdx >= milestoneDistances.length - 1) {
        distance = milestoneDistances[milestoneDistances.length - 1];
      } else {
        const startDist = milestoneDistances[segmentIdx];
        const endDist = milestoneDistances[segmentIdx + 1];
        distance = startDist + t * (endDist - startDist);
      }

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

    let activeAnimation = null;
    let activeTimeout = null;

    if (targetIdx !== currentAnimatedIndex) {
      const start = currentAnimatedIndex;
      const end = targetIdx;

      if (end > start && Math.floor(start) < Math.floor(end)) {
        const gate = Math.floor(start) + 0.5;
        
        setIsMoving(true);
        activeAnimation = animate(start, gate, {
          duration: 1.1,
          ease: "easeOut",
          onUpdate: (latest) => {
            setCurrentAnimatedIndex(latest);
            updateCoords(latest);
          },
          onComplete: () => {
            activeTimeout = setTimeout(() => {
              activeAnimation = animate(gate, end, {
                duration: 1.1,
                ease: "easeIn",
                onUpdate: (latest) => {
                  setCurrentAnimatedIndex(latest);
                  updateCoords(latest);
                },
                onComplete: () => {
                  setIsMoving(false);
                }
              });
            }, 1000);
          }
        });
      } else {
        setIsMoving(true);
        activeAnimation = animate(start, end, {
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
      }

      return () => {
        if (activeAnimation) activeAnimation.stop();
        if (activeTimeout) clearTimeout(activeTimeout);
      };
    } else {
      updateCoords(targetIdx);
    }
  }, [completedList.join(','), pathElement, milestones.length, milestoneDistances]);

  // Compute trails
  const getTrailParticles = () => {
    if (!pathElement || milestoneDistances.length === 0) return [];
    const pathLength = pathElement.getTotalLength();

    const val = currentAnimatedIndex;
    const segmentIdx = Math.floor(val);
    const t = val - segmentIdx;

    let distance = 0;
    if (segmentIdx >= milestoneDistances.length - 1) {
      distance = milestoneDistances[milestoneDistances.length - 1];
    } else {
      const startDist = milestoneDistances[segmentIdx];
      const endDist = milestoneDistances[segmentIdx + 1];
      distance = startDist + t * (endDist - startDist);
    }

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
      <div className={viewMode === 'roadmap' ? 'flex flex-col flex-grow' : 'hidden'}>
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
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600 dark:text-green-400">{progressPercent}%</span>
                      {completedList.length > 0 && (
                        <button
                          onClick={handleResetProgress}
                          className="text-[#6C63FF] hover:text-[#5b52e0] dark:text-indigo-400 dark:hover:text-indigo-300 font-bold hover:underline flex items-center text-[11px]"
                          title="Reset Course Progress"
                        >
                          (Reset Progress)
                        </button>
                      )}
                    </div>
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
                    <span className="text-2xl font-black text-text-primary dark:text-slate-100">{getStreakCount()}</span>
                    <span className="text-[10px] text-green-600 dark:text-green-400 font-black ml-1">DAYS</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Winding Road Journey Section */}
          <div className="flex justify-center items-center pt-12 pb-0 overflow-x-hidden md:overflow-x-visible">
            <div
              className="relative w-full max-w-[600px]"
              style={{ height: `${H}px` }}
            >

              {/* Curved SVG Road */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
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



              {/* Full-Screen Cloud Overlay (Magical Fog of War) */}
              {currentAnimatedIndex < milestones.length - 1 && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 w-[220vw] pointer-events-none transition-all duration-300"
                  style={{
                    top: `${(cloudStartUpdateY / H) * 100}%`,
                    height: `${H - cloudStartUpdateY + 300}px`, // extend past bottom of road to cover page bottom
                    zIndex: 35
                  }}
                >
                  {/* Embedded keyframe styles for smooth cloud movements */}
                  <style>{`
                    @keyframes floatCloudLeft {
                      0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
                      50% { transform: translate(-15px, -8px) scale(1.04) rotate(-2deg); }
                    }
                    @keyframes floatCloudRight {
                      0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
                      50% { transform: translate(15px, -10px) scale(1.03) rotate(2deg); }
                    }
                    @keyframes floatMist {
                      0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
                      50% { transform: translateY(-20px) translateX(15px) scale(1.15); }
                    }
                  `}</style>

                  <div className="relative w-full h-full overflow-hidden">
                    {/* Background Soft Mist Layer */}
                    <div
                      className="absolute inset-x-0 top-0 h-[140px] bg-gradient-to-b from-transparent via-[#F0F9FF]/95 to-[#F0F9FF] dark:via-slate-950/95 dark:to-slate-950"
                    />
                    {/* Make the solid background color go all the way down */}
                    <div
                      className="absolute inset-x-0 top-[140px] bottom-0 bg-[#F0F9FF] dark:bg-slate-950"
                    />

                    {/* SVG Definitions for Premium Gradients */}
                    <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
                      <defs>
                        <linearGradient id="whitePinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" className="text-white dark:text-[#1E293B]" stopColor="currentColor" />
                          <stop offset="60%" className="text-[#F8FCFF] dark:text-[#0F172A]" stopColor="currentColor" />
                          <stop offset="100%" className="text-[#E0F2FE] dark:text-slate-950" stopColor="currentColor" />
                        </linearGradient>
                        <linearGradient id="cottonCandyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" className="text-[#F0F9FF] dark:text-slate-800" stopColor="currentColor" />
                          <stop offset="50%" className="text-[#E0F2FE] dark:text-[#1E293B]" stopColor="currentColor" />
                          <stop offset="100%" className="text-[#BAE6FD] dark:text-[#0F172A]" stopColor="currentColor" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Floating Mist Particles */}
                    {[...Array(25)].map((_, idx) => {
                      const size = 30 + (idx * 8) % 50; // 30px to 80px (larger mist)
                      const left = 5 + (idx * 9) % 90;
                      const top = 30 + (idx * 37) % Math.max(300, H - cloudStartUpdateY + 150);
                      const duration = 6 + (idx * 2) % 8;
                      const delay = (idx * 0.8) % 4;
                      return (
                        <div
                          key={`mist-part-${idx}`}
                          className="absolute rounded-full bg-gradient-to-br from-white/50 to-[#E0F2FE]/60 dark:from-indigo-500/10 dark:to-purple-500/5 blur-[6px]"
                          style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            left: `${left}%`,
                            top: `${top}px`,
                            animation: `floatMist ${duration}s infinite ease-in-out`,
                            animationDelay: `${delay}s`,
                            opacity: 0.75
                          }}
                        />
                      );
                    })}

                    {/* Dense overlapping cloud rows filling the entire covered height */}
                    {(() => {
                      const rows = [];
                      const startY = -40;
                      // Stop exactly at the end of the road plus bottom padding
                      const endY = H - cloudStartUpdateY + 260;
                      // Place a row of clouds every 55px down the height for maximum overlap and no gaps
                      for (let y = startY; y < endY; y += 55) {
                        rows.push(y);
                      }

                      return rows.map((yVal, rowIndex) => {
                        // More clouds per row (7 clouds) to ensure full horizontal overlaps
                        const cloudCount = rowIndex === 0 ? 8 : 7; 
                        return (
                          <div key={`cloud-row-${rowIndex}`} className="absolute w-full" style={{ top: `${yVal}px` }}>
                            {[...Array(cloudCount)].map((_, colIndex) => {
                              // Highly staggered offsets to lock into the gaps of the adjacent rows
                              const offset = (rowIndex % 2 === 0) ? 0 : 7;
                              const randomShift = ((colIndex + rowIndex) % 3) * 5 - 10;
                              const leftPercent = (colIndex * 100) / (cloudCount - 1) - 12 + offset + randomShift;
                              
                              const isLeftFloat = (rowIndex + colIndex) % 2 === 0;
                              const scale = 1.1 + ((colIndex + rowIndex) % 4) * 0.15; // Larger scale (1.1x to 1.7x)
                              const duration = 7 + (colIndex * 1.5 + rowIndex) % 5;
                              const animName = isLeftFloat ? 'floatCloudLeft' : 'floatCloudRight';

                              return (
                                <div
                                  key={`cloud-item-${rowIndex}-${colIndex}`}
                                  className="absolute"
                                  style={{
                                    left: `${leftPercent}%`,
                                    transform: `scale(${scale})`,
                                    animation: `${animName} ${duration}s infinite ease-in-out`,
                                    opacity: 0.50
                                  }}
                                >
                                  {/* Larger cloud width/height for seamless locking and zero space gaps */}
                                  <svg width="360" height="210" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_12px_26px_rgba(186,230,253,0.36)] dark:drop-shadow-[0_12px_26px_rgba(15,23,42,0.6)]">
                                    <path
                                      d="M 20 45 C 15 45, 10 40, 10 33 C 10 24, 18 20, 26 22 C 30 12, 50 12, 56 18 C 64 14, 76 18, 76 28 C 82 28, 88 34, 86 41 C 84 46, 78 48, 72 47 C 65 52, 35 52, 20 45 Z"
                                      fill="url(#cottonCandyGrad)"
                                    />
                                    <path
                                      d="M 24 40 C 20 40, 16 36, 17 32 C 18 25, 24 22, 30 24 C 34 16, 48 16, 52 22 C 58 19, 66 22, 67 29 C 72 29, 76 33, 75 38 C 70 42, 45 44, 24 40 Z"
                                      fill="url(#whitePinkGrad)"
                                      opacity="0.88"
                                    />
                                    {rowIndex === 0 && (
                                      <path
                                        d="M 20 45 C 15 45, 10 40, 10 33 C 10 24, 18 20, 26 22 C 30 12, 50 12, 56 18 C 64 14, 76 18, 76 28"
                                        className="stroke-white dark:stroke-slate-500"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        opacity="0.85"
                                      />
                                    )}
                                  </svg>
                                </div>
                              );
                            })}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}

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
                if (!isMilestoneRevealed(index)) return null;

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
                    const isStudyDone = completedList.includes(milestone.id);
                    if (!isStudyDone) {
                      handleStartLesson(milestone);
                    } else {
                      const isChallenge = milestone.stepData.study.code ? true : false;
                      const hasPractice = isChallenge || (milestone.stepData.quiz && milestone.stepData.quiz.length > 0);
                      const practiceId = milestone.id.replace('-topic', '-practice');
                      const isPracticeDone = completedList.includes(practiceId);
                      if (hasPractice && !isPracticeDone) {
                        handleStartPracticeForMilestone(milestone);
                      } else {
                        // Both done, default to review study
                        handleStartLesson(milestone);
                      }
                    }
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
                  <motion.div
                    key={milestone.id}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 100 }}
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
                      className={`w-14 h-14 rounded-full flex items-center justify-center border-4 shadow-lg transition-all duration-300 z-10 relative ${status === 'completed'
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
                      className="absolute transition-all duration-300 pointer-events-auto"
                      style={(() => {
                        // Card width and offset based on screen size
                        // The node circle is w-14 (56px). Parent is centered via -translate-x-1/2,
                        // so the parent edge is ~28px from node center. Offset must be > 56px
                        // to clear the full circle diameter + provide a visible gap.
                        const cardWidth = isTinyScreen ? 105 : (isSmallScreen ? 125 : 220);
                        const offset = isTinyScreen ? 58 : (isSmallScreen ? 62 : 75);

                        const style = {
                          width: `${cardWidth}px`,
                          top: '50%',
                          transform: 'translateY(-50%)',
                        };

                        if (coords.X < 300) {
                          // Node on left side → card goes further left (away from road)
                          style.right = `${offset}px`;
                          style.left = 'auto';
                        } else {
                          // Node on right side or center → card goes further right
                          style.left = `${offset}px`;
                          style.right = 'auto';
                        }

                        return style;
                      })()}
                    >
                      <div
                        onClick={handleClick}
                        className={`${isSmallScreen ? 'p-2.5 rounded-2xl' : 'p-4 rounded-3xl'} border-2 transition-all duration-300 cursor-pointer ${
                          status === 'current'
                            ? 'bg-white dark:bg-slate-900 border-[#6C63FF] dark:border-indigo-500 shadow-[0_4px_12px_rgba(108,99,255,0.15)] hover:scale-[1.03] hover:shadow-[0_6px_16px_rgba(108,99,255,0.22)]'
                            : status === 'completed'
                              ? 'bg-white dark:bg-slate-900 border-[#4CAF50] dark:border-green-800/80 shadow-sm hover:scale-[1.03]'
                              : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-850 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="flex items-center space-x-1 mb-1 justify-start">
                          <span className={isSmallScreen ? 'text-xs' : 'text-sm'}>{emoji}</span>
                          <span className={`${isSmallScreen ? 'text-[7px]' : 'text-[9px]'} font-black uppercase tracking-wider text-text-secondary dark:text-slate-400 truncate`}>
                            {typeLabel}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className={`${isTinyScreen ? 'text-[9px]' : (isSmallScreen ? 'text-[10px]' : 'text-sm')} font-black text-text-primary dark:text-slate-100 leading-snug tracking-tight text-left`}>
                          {milestone.title}
                        </h4>

                        {/* Footer details */}
                        <div className={`flex ${isSmallScreen ? 'flex-col gap-0.5' : 'items-center justify-between'} ${isSmallScreen ? 'mt-1.5 pt-1' : 'mt-3 pt-2'} border-t border-slate-100 dark:border-slate-800 ${isSmallScreen ? 'text-[7px]' : 'text-[9px]'} font-bold text-text-secondary dark:text-slate-450`}>
                          <span className="flex items-center">
                            {(() => {
                              if (milestone.type !== 'topic') return milestone.duration;
                              const isChallenge = milestone.stepData.study.code ? true : false;
                              const hasPractice = isChallenge || (milestone.stepData.quiz && milestone.stepData.quiz.length > 0);
                              return hasPractice ? (isChallenge ? '45 min' : '25 min') : '15 min';
                            })()}
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

                  </motion.div>
                );
              })}

            </div>
          </div>

        </main>

      </div>

      {/* 2. IMMERSIVE LESSON VIEW (FULL SCREEN) */}
      {viewMode === 'lesson' && activeStep && (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">

          {/* Immersive Top Bar */}
          <div className={`${activeStep?.type === 'challenge' && lessonPhase === 'quiz' ? 'max-w-[96%]' : 'max-w-4xl'} w-full mx-auto px-4 md:px-6 pt-6 pb-4 flex items-center space-x-6`}>
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
          <div className={`flex-grow flex ${activeStep?.type === 'challenge' && lessonPhase === 'quiz' ? 'items-start' : 'items-center'} justify-center p-4`}>
            <div className={`${activeStep?.type === 'challenge' && lessonPhase === 'quiz' ? 'max-w-[96%] py-2 md:py-3' : 'max-w-xl py-8 md:py-12'} w-full`}>

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

                  <div className="pt-8 flex gap-4 justify-end">
                    {(() => {
                      const isChallenge = activeStep.stepData.study.code ? true : false;
                      const hasPractice = isChallenge || (activeStep.stepData.quiz && activeStep.stepData.quiz.length > 0);
                      
                      const practiceId = activeStep.id.replace('-topic', '-practice');
                      const isPracticeDone = completedSteps[courseName]?.includes(practiceId);

                      if (!hasPractice) {
                        return (
                          <button
                            onClick={handleCompleteStep}
                            className="w-full sm:w-auto bg-[#4CAF50] hover:bg-green-600 text-white px-10 py-4.5 rounded-2xl font-bold text-base flex items-center justify-center shadow-[0_4px_0_0_rgba(56,142,60,1)] active:translate-y-[4px] active:shadow-none transition-all"
                          >
                            COMPLETE STUDY
                            <ArrowRight size={18} className="ml-1.5" />
                          </button>
                        );
                      }

                      if (isPracticeDone) {
                        return (
                          <>
                            <button
                              onClick={() => {
                                setViewMode('roadmap');
                                setActiveStep(null);
                              }}
                              className="w-full sm:w-auto bg-slate-200 hover:bg-slate-350 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 px-6 py-4.5 rounded-2xl font-bold text-base flex items-center justify-center transition-all"
                            >
                              BACK TO ROADMAP
                            </button>
                            <button
                              onClick={() => {
                                const practiceMilestone = {
                                  ...activeStep,
                                  id: practiceId,
                                  type: isChallenge ? 'challenge' : 'quiz',
                                  title: isChallenge ? `Coding Challenge: ${activeStep.title}` : `${activeStep.title} Quiz`,
                                  duration: isChallenge ? '30 min' : '10 min',
                                };
                                setActiveStep(practiceMilestone);
                                setLessonPhase('quiz');
                                if (isChallenge) {
                                  setUserCode(practiceMilestone.stepData.codingChallenge?.initialCode || '');
                                  setCompileOutput(null);
                                  setIsChallengePassed(false);
                                } else {
                                  setCurrentQuestionIdx(0);
                                  setSelectedOption(null);
                                  setIsAnswerChecked(false);
                                  setScore(0);
                                }
                              }}
                              className="w-full sm:w-auto bg-primary hover:bg-indigo-700 text-white px-6 py-4.5 rounded-2xl font-bold text-base flex items-center justify-center shadow-[0_4px_0_0_rgba(67,56,202,1)] active:translate-y-[4px] active:shadow-none transition-all"
                            >
                              PRACTICE AGAIN
                              <ArrowRight size={18} className="ml-1.5" />
                            </button>
                          </>
                        );
                      }

                      // Practice exists and is not completed yet
                      return (
                        <button
                          onClick={() => {
                            // Mark study as completed first
                            const completedList = completedSteps[courseName] || [];
                            if (!completedList.includes(activeStep.id)) {
                              const updated = {
                                ...completedSteps,
                                [courseName]: [...completedList, activeStep.id]
                              };
                              setCompletedSteps(updated);
                              localStorage.setItem('AI Lab Learning Portal_completed_steps', JSON.stringify(updated));
                            }

                            // Transition to practice
                            const practiceMilestone = {
                              ...activeStep,
                              id: practiceId,
                              type: isChallenge ? 'challenge' : 'quiz',
                              title: isChallenge ? `Coding Challenge: ${activeStep.title}` : `${activeStep.title} Quiz`,
                              duration: isChallenge ? '30 min' : '10 min',
                            };
                            setActiveStep(practiceMilestone);
                            setLessonPhase('quiz');
                            if (isChallenge) {
                              setUserCode(practiceMilestone.stepData.codingChallenge?.initialCode || '');
                              setCompileOutput(null);
                              setIsChallengePassed(false);
                            } else {
                              setCurrentQuestionIdx(0);
                              setSelectedOption(null);
                              setIsAnswerChecked(false);
                              setScore(0);
                            }
                          }}
                          className="w-full sm:w-auto bg-[#3B3B98] hover:bg-[#2e2e77] text-white px-10 py-4.5 rounded-2xl font-bold text-base flex items-center justify-center shadow-[0_4px_0_0_rgba(46,46,119,1)] active:translate-y-[4px] active:shadow-none transition-all"
                        >
                          {isChallenge ? 'START CHALLENGE' : 'START QUIZ'}
                          <ArrowRight size={18} className="ml-1.5" />
                        </button>
                      );
                    })()}
                  </div>
                </div>
              )}
              {/* SUB-PHASE B: ACTIVE PRACTICE QUIZ */}
              {lessonPhase === 'quiz' && (
                activeStep.type === 'challenge' ? (
                  <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px] animate-scale-up bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                    {/* Left Column: Challenge Description & Test Cases */}
                    <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                      <div className="space-y-5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-primary dark:text-indigo-400 rounded-full text-xs font-bold w-fit">
                          <Code size={14} className="stroke-[2.5]" />
                          <span>CODING CHALLENGE</span>
                        </div>
                        <h2 className="text-2xl font-black text-text-primary dark:text-slate-100 leading-tight tracking-tight">
                          {activeStep.title}
                        </h2>

                        <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-100/50 dark:border-indigo-900/35 rounded-2xl p-5 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-xl pointer-events-none" />
                          <p className="text-sm font-semibold text-text-secondary dark:text-slate-350 leading-relaxed relative z-10">
                            {activeStep.stepData.codingChallenge.description}
                          </p>
                        </div>
                      </div>

                      {/* Test Cases Panel */}
                      <div className="space-y-3 pt-2">
                        <h3 className="text-xs font-black uppercase tracking-wider text-text-primary dark:text-slate-200 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Expected Behavior
                        </h3>
                        <div className="space-y-2.5">
                          {activeStep.stepData.codingChallenge.testCases.map((tc, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 rounded-2xl p-4 text-xs font-semibold hover:border-slate-300/60 dark:hover:border-slate-700/60 transition-colors">
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-text-secondary dark:text-slate-500">Test Input:</span>
                                <code className="bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded text-text-primary dark:text-slate-300 font-mono">{JSON.stringify(tc.input)}</code>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-text-secondary dark:text-slate-500">Expected Output:</span>
                                <code className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">{JSON.stringify(tc.expected)}</code>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Code Editor & Console Output Panel */}
                    <div className="lg:col-span-8 flex flex-col bg-[#0B0F19] border border-slate-850 rounded-2xl overflow-hidden shadow-2xl" style={{ height: '700px' }}>
                      {/* Interactive Code Editor */}
                      <div className="flex flex-col relative">
                        {/* Chrome window header */}
                        <div className="bg-[#121824] border-b border-slate-850 px-4 flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center">
                            {/* Window buttons */}
                            <div className="flex space-x-1.5 mr-6 items-center">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block" />
                              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block" />
                              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block" />
                            </div>
                            {/* Tabs */}
                            <div className="flex pt-1.5">
                              <span className="bg-[#0B0F19] border-t-2 border-primary text-slate-100 px-4 py-2 font-mono flex items-center gap-1.5 rounded-t-lg text-[11px] border-x border-slate-850">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                solution.py
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 py-1">
                            <span className="font-bold uppercase tracking-wider text-[9px] text-slate-500 font-mono hidden sm:inline mr-1">Python</span>
                            <button
                              onClick={handleCompileRun}
                              disabled={isCompiling}
                              className={`border border-slate-700/50 px-3 py-1 rounded-lg font-bold text-[10px] flex items-center justify-center transition-all active:scale-95 ${isCompiling ? 'bg-slate-800 text-slate-400 cursor-wait' : 'bg-[#1E293B] hover:bg-[#334155] text-slate-100'}`}
                            >
                              {isCompiling ? (
                                <>
                                  <svg className="animate-spin mr-1 h-2.5 w-2.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                                  COMPILING...
                                </>
                              ) : (
                                <>
                                  <Play size={10} className="mr-1 fill-current" />
                                  COMPILE & RUN
                                </>
                              )}
                            </button>

                            <button
                              onClick={handleCompleteStep}
                              disabled={!isChallengePassed}
                              className={`px-3 py-1 rounded-lg font-bold text-[10px] flex items-center justify-center transition-all active:scale-95 ${isChallengePassed
                                ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-500 text-white shadow-md shadow-emerald-500/10'
                                : 'bg-slate-800/50 text-slate-500 border border-slate-800/80 cursor-not-allowed'
                              }`}
                            >
                              FINISH CHALLENGE
                              <ArrowRight size={10} className="ml-1" />
                            </button>
                          </div>
                        </div>

                        {/* Code Editor Body - CodeMirror */}
                        <PythonEditor
                          value={userCode}
                          onChange={setUserCode}
                          height={editorHeight}
                        />
                      </div>

                      {/* Draggable Split Divider */}
                      <div
                        onMouseDown={handleDragStart}
                        onTouchStart={handleDragStart}
                        className={`group relative flex items-center justify-center cursor-row-resize select-none transition-colors duration-150 ${isDragging ? 'bg-primary/20' : 'hover:bg-slate-700/40'
                          }`}
                        style={{ height: '8px' }}
                      >
                        {/* Accent line */}
                        <div className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] transition-colors duration-150 ${isDragging ? 'bg-primary' : 'bg-slate-700/80 group-hover:bg-slate-500'
                          }`} />
                        {/* Grab handle dots */}
                        <div className={`relative flex items-center gap-0.5 px-2 py-0.5 rounded-full transition-colors duration-150 ${isDragging ? 'bg-primary/30' : 'bg-slate-800 group-hover:bg-slate-700'
                          }`}>
                          <span className={`w-1 h-1 rounded-full transition-colors ${isDragging ? 'bg-primary' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
                          <span className={`w-1 h-1 rounded-full transition-colors ${isDragging ? 'bg-primary' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
                          <span className={`w-1 h-1 rounded-full transition-colors ${isDragging ? 'bg-primary' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
                          <span className={`w-1 h-1 rounded-full transition-colors ${isDragging ? 'bg-primary' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
                          <span className={`w-1 h-1 rounded-full transition-colors ${isDragging ? 'bg-primary' : 'bg-slate-600 group-hover:bg-slate-400'}`} />
                        </div>
                      </div>

                      {/* Compile/Run Output Console */}
                      <div className="bg-[#080B11] flex flex-col font-mono text-xs flex-1 min-h-0">
                        <div className="p-4 space-y-2 overflow-y-auto flex-1 flex flex-col justify-center bg-[#080B11]">
                          {!compileOutput ? (
                            <div className="text-slate-500 text-center py-4 italic">
                              Run your code to see compilation outputs and test results...
                            </div>
                          ) : compileOutput.error ? (
                            <div className="text-red-400 space-y-1.5">
                              <div className="font-bold flex items-center gap-1.5"><XCircle size={14} /> {compileOutput.error}</div>
                              <div className="text-[10px] text-red-500/80">Check your syntax, missing brackets, or variables.</div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {/* Raw stdout from execution */}
                              {compileOutput.stdout && (
                                <div className="mb-2">
                                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Program Output</div>
                                  <pre className="text-[11px] text-emerald-400 font-mono whitespace-pre-wrap bg-slate-900/50 rounded-lg p-2.5 border border-slate-800/50">{compileOutput.stdout}</pre>
                                </div>
                              )}
                              {/* Test case results */}
                              <div className={`font-black flex items-center gap-1.5 pb-1 border-b border-slate-900/50 ${compileOutput.success ? 'text-green-400' : 'text-red-400'}`}>
                                {compileOutput.success ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                {compileOutput.success ? 'CONGRATULATIONS! ALL TESTS PASSED' : 'SOME TESTS FAILED'}
                              </div>
                              <div className="space-y-1 font-mono text-[11px]">
                                {compileOutput.results.map((res, idx) => (
                                  <div key={idx} className="flex justify-between items-center py-0.5">
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
                    </div>
                  </div>
                ) : (
                  <div className="w-full bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.35)] space-y-6 animate-scale-up">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-bold w-fit">
                        <HelpCircle size={14} className="stroke-[2.5]" />
                        <span>PRACTICE QUIZ</span>
                      </div>
                      <span className="text-xs font-black text-slate-400 dark:text-slate-500 font-mono">
                        Question {currentQuestionIdx + 1} of {activeStep.stepData.quiz.length}
                      </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-black text-text-primary dark:text-slate-100 leading-snug tracking-tight">
                      {activeStep.stepData.quiz[currentQuestionIdx].question}
                    </h2>

                    {/* Multi-choice items */}
                    <div className="space-y-3.5 pt-2">
                      {activeStep.stepData.quiz[currentQuestionIdx].options.map((option, idx) => {
                        const isSelected = selectedOption === idx;
                        const isCorrect = activeStep.stepData.quiz[currentQuestionIdx].answerIndex === idx;

                        const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D...

                        let optionStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-primary/50 dark:hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/70 text-text-primary dark:text-slate-300';
                        let badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400';

                        if (isSelected && !isAnswerChecked) {
                          optionStyle = 'border-primary dark:border-indigo-400 bg-indigo-50/15 dark:bg-indigo-950/20 text-primary dark:text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.08)]';
                          badgeStyle = 'bg-primary dark:bg-indigo-500 text-white';
                        } else if (isAnswerChecked) {
                          if (isCorrect) {
                            optionStyle = 'border-green-500 dark:border-green-500/80 bg-green-50/15 dark:bg-green-950/20 text-green-600 dark:text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.08)]';
                            badgeStyle = 'bg-green-500 text-white';
                          } else if (isSelected && !isCorrect) {
                            optionStyle = 'border-red-500 dark:border-red-500/80 bg-red-50/15 dark:bg-red-950/20 text-red-655 dark:text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.08)]';
                            badgeStyle = 'bg-red-500 text-white';
                          } else {
                            optionStyle = 'border-slate-150 dark:border-slate-900/60 bg-slate-50/10 dark:bg-slate-900/10 text-slate-450 dark:text-slate-500 opacity-60';
                            badgeStyle = 'bg-slate-100/50 dark:bg-slate-900/50 text-slate-350 dark:text-slate-650';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={isAnswerChecked}
                            className={`w-full text-left p-4.5 rounded-2xl border-2 font-bold text-base flex items-center justify-between transition-all duration-200 group active:scale-[0.995] ${optionStyle}`}
                          >
                            <div className="flex items-center gap-3.5">
                              <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black tracking-wider transition-colors font-mono ${badgeStyle}`}>
                                {optionLetter}
                              </span>
                              <span className="leading-snug">{option}</span>
                            </div>
                            {isAnswerChecked && isCorrect && (
                              <div className="bg-green-500 text-white p-1 rounded-full shadow-lg animate-scale-up">
                                <Check size={14} className="stroke-[3]" />
                              </div>
                            )}
                            {isAnswerChecked && isSelected && !isCorrect && (
                              <div className="bg-red-500 text-white p-1 rounded-full shadow-lg animate-scale-up">
                                <X size={14} className="stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Answer Explanation */}
                    {isAnswerChecked && (
                      <div className={`p-5 rounded-2xl border-2 animate-scale-up relative overflow-hidden ${selectedOption === activeStep.stepData.quiz[currentQuestionIdx].answerIndex
                        ? 'bg-green-50/45 dark:bg-green-950/10 border-green-200/50 dark:border-green-900/20 text-green-800 dark:text-green-300'
                        : 'bg-red-50/45 dark:bg-red-950/10 border-red-200/50 dark:border-red-900/20 text-red-800 dark:text-red-300'
                        }`}>
                        <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                          {selectedOption === activeStep.stepData.quiz[currentQuestionIdx].answerIndex ? (
                            <CheckCircle2 size={72} />
                          ) : (
                            <XCircle size={72} />
                          )}
                        </div>
                        <p className="font-black text-sm mb-1 uppercase tracking-wider flex items-center gap-1.5">
                          {selectedOption === activeStep.stepData.quiz[currentQuestionIdx].answerIndex ? '🎉 Correct Answer!' : '💡 Incorrect Answer'}
                        </p>
                        <p className="text-xs font-semibold leading-relaxed opacity-90">
                          {activeStep.stepData.quiz[currentQuestionIdx].explanation}
                        </p>
                      </div>
                    )}

                    {/* Action Controls */}
                    <div className="pt-4 flex justify-end">
                      {!isAnswerChecked ? (
                        <button
                          onClick={handleCheckAnswer}
                          disabled={selectedOption === null}
                          className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-[0_4px_0_0_rgba(67,56,202,1)] active:translate-y-[4px] active:shadow-none hover:-translate-y-[1px] ${selectedOption !== null
                            ? 'bg-primary text-white hover:bg-indigo-700 shadow-[0_4px_0_0_rgba(67,56,202,0.3)]'
                            : 'bg-slate-100 text-slate-400 shadow-none border border-slate-200 cursor-not-allowed dark:bg-slate-900 dark:border-slate-800 dark:text-slate-600'
                            }`}
                        >
                          CHECK ANSWER
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuestion}
                          className="w-full sm:w-auto bg-primary hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold text-base flex items-center justify-center transition-all duration-200 shadow-[0_4px_0_0_rgba(67,56,202,0.3)] hover:-translate-y-[1px] active:translate-y-[4px] active:shadow-none"
                        >
                          {currentQuestionIdx + 1 === activeStep.stepData.quiz.length ? 'FINISH' : 'NEXT'}
                          <ArrowRight size={18} className="ml-1.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}



            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default RoadmapPage;
