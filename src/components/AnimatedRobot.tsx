import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LottieLib from 'lottie-react';
import { X, Send, Sparkles, Bot, User, MessageSquare, Zap } from 'lucide-react';

// Vite CJS/ESM interop: lottie-react ships as CJS, so `.default` may be
// the actual component when bundled. Fall back to the module itself if not.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Lottie = (LottieLib as any).default ?? LottieLib;

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const quickReplies = [
  "Explain this concept",
  "Give me a hint",
  "Show an example",
  "What should I learn next?",
];

export default function AnimatedRobot() {
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'bot',
      text: "Hey there! 👋 I'm your AI Lab assistant. Ask me anything about your courses, coding challenges, or AI concepts!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [botPositionIndex, setBotPositionIndex] = useState(0);

  const botPositions = [
    "absolute right-full bottom-0 mr-4",
    "absolute right-full top-[35%] mr-4",
    "absolute right-full top-0 mr-4",
    "absolute bottom-full left-[20%] mb-4"
  ];

  useEffect(() => {
    if (messages.length > 1) {
      setBotPositionIndex((messages.length - 1) % botPositions.length);
    }
  }, [messages.length]);

  // Fetch animation data from public/ at runtime — immune to git operations
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch('/robot-animation.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch(() => {/* silently fail — robot just won't render */});
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isChatOpen]);

  const generateBotResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    if (lower.includes('hint') || lower.includes('help')) {
      return "💡 Here's a tip: Break the problem down into smaller steps. Start by understanding the input and expected output, then write pseudocode before actual code!";
    }
    if (lower.includes('explain') || lower.includes('concept')) {
      return "📚 I'd love to help explain! Could you tell me which specific topic or concept you're working on? I can break it down step by step.";
    }
    if (lower.includes('example')) {
      return "✨ Sure! Here's a quick example:\n\n```python\ndef greet(name):\n    return f'Hello, {name}!'\n\nprint(greet('AI Lab'))\n```\n\nTry modifying it to fit your current challenge!";
    }
    if (lower.includes('learn') || lower.includes('next')) {
      return "🗺️ Based on the learning roadmap, I'd recommend completing your current module first, then moving to the next milestone. Consistency is key — even 20 minutes daily adds up!";
    }
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return "Hello! 😊 How can I help you today? Feel free to ask about any topic, request hints for challenges, or get explanations!";
    }
    if (lower.includes('thank')) {
      return "You're welcome! 🎉 Keep up the great work. Remember, every expert was once a beginner!";
    }
    if (lower.includes('error') || lower.includes('bug') || lower.includes('fix')) {
      return "🔍 Debugging tip: Check for common issues like:\n• Missing colons after `if`, `for`, `def`\n• Incorrect indentation\n• Undefined variables\n• Off-by-one errors in loops\n\nPaste your error message and I'll try to help!";
    }
    return "🤖 That's a great question! I'm here to help with your AI Lab coursework. Try asking me to explain a concept, give you a hint, or show an example!";
  };

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      text: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking/explaining
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        role: 'bot',
        text: generateBotResponse(messageText),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000 + Math.random() * 1000); // slightly longer typing state to show off the fly-in animation!
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
    setIsHovered(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-none">
      <div className="relative">
        {/* Chat Panel */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              className="pointer-events-auto w-[270px] sm:w-[380px] h-[440px] sm:h-[540px] flex flex-col rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(99,102,241,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-slate-200/60 dark:border-slate-800/80"
              style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(245,247,250,0.95) 100%)',
                backdropFilter: 'blur(30px)',
              }}
            >
              {/* Dark mode override */}
              <div className="hidden dark:block absolute inset-0 rounded-[32px] -z-10" style={{
                background: 'linear-gradient(160deg, rgba(15,23,42,0.92) 0%, rgba(8,12,24,0.98) 100%)',
              }} />

              {/* Glowing neon top bar */}
              <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              {/* Header */}
              <div className="relative z-10 px-4 py-3.5 sm:px-6 sm:py-5 flex items-center justify-between border-b border-slate-100/80 dark:border-slate-800/60" style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.08) 100%)',
              }}>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-indigo-500 dark:bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <Bot size={16} className="text-white sm:w-5 sm:h-5" />
                    {/* Status Indicator */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
                  </div>
                </div>
                
                <button
                  onClick={toggleChat}
                  className="w-7 h-7 sm:w-9 sm:h-9 rounded-2xl bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-all cursor-pointer border border-slate-200/30 dark:border-slate-700/30"
                >
                  <X size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-indigo-200 dark:scrollbar-thumb-slate-800">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {/* Message Bubble */}
                      <div className={`px-4 py-3 rounded-[20px] text-xs sm:text-[13px] leading-relaxed shadow-sm whitespace-pre-wrap transition-all ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-indigo-500 to-indigo-605 text-white rounded-tr-sm shadow-[0_4px_12px_rgba(99,102,241,0.2)]'
                          : 'bg-white/80 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 rounded-tl-sm border border-slate-200/50 dark:border-slate-800/50'
                      }`}>
                        {msg.text}
                      </div>
                      
                      {/* Tiny Timestamp */}
                      <span className="text-[8px] text-slate-400 dark:text-slate-600 self-end mb-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator & flying robot inside the box */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="flex flex-col items-center justify-center py-5 bg-indigo-500/[0.04] dark:bg-indigo-500/[0.02] rounded-[24px] border border-indigo-500/10 dark:border-indigo-500/5 my-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                    >
                      {/* Floating animated robot inside the chat area */}
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-20 h-20 sm:w-28 sm:h-28"
                      >
                        <Lottie
                          animationData={animationData}
                          loop={true}
                          autoplay={true}
                          style={{ width: '100%', height: '100%', background: 'transparent' }}
                        />
                      </motion.div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] sm:text-xs text-indigo-650 dark:text-indigo-400 font-extrabold uppercase tracking-wider animate-pulse flex items-center gap-1">
                          <Sparkles size={10} className="text-indigo-500 dark:text-indigo-400" />
                          Thinking and Explaining
                        </span>
                        <span className="flex gap-0.5">
                          <span className="w-1 h-1 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 h-1 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 h-1 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {messages.length <= 1 && (
                <div className="relative z-10 px-4 pb-3 flex flex-wrap gap-1.5 justify-center">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleSend(reply)}
                      className="px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-xl bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:scale-102 hover:-translate-y-0.5 transition-all shadow-[0_2px_6px_rgba(0,0,0,0.03)] cursor-pointer"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="relative z-10 px-4 py-3.5 sm:px-5 sm:py-4 border-t border-slate-100 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/40">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-slate-900 rounded-[20px] px-3 py-2 border border-slate-200/80 dark:border-slate-800/80 focus-within:border-indigo-400 dark:focus-within:border-indigo-500 focus-within:shadow-[0_0_12px_rgba(99,102,241,0.12)] transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question..."
                    className="flex-1 bg-transparent text-xs sm:text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-medium"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isTyping}
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      inputValue.trim() && !isTyping
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-650 text-white shadow-md shadow-indigo-500/25 hover:brightness-105 active:scale-95'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    <Send size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Robot Button */}
        <motion.div
          layout
          className={`pointer-events-auto flex flex-col items-center cursor-pointer select-none flex-shrink-0 transition-all duration-500 ${
            isChatOpen ? botPositions[botPositionIndex] : 'relative'
          }`}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{
            opacity: isTyping ? 0 : 1,
            scale: isTyping ? 0 : 1,
            x: isTyping ? 150 : 0, // Fly into the chatbox
            y: isTyping ? -150 : 0,
            pointerEvents: isTyping ? 'none' : 'auto',
            transition: {
              type: 'spring',
              stiffness: 260,
              damping: 20,
            },
          }}
          whileHover={{
            scale: isTyping ? 0 : 1.08,
            transition: { duration: 0.2 },
          }}
          onHoverStart={() => !isChatOpen && !isTyping && setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onTouchStart={() => !isChatOpen && !isTyping && setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          onClick={toggleChat}
        >
          {/* Floating idle animation */}
          <motion.div
            animate={{ y: isTyping ? 0 : [0, -12, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className={`relative flex items-center justify-center transition-all duration-300 ${
              isChatOpen ? 'w-20 h-20 sm:w-32 sm:h-32' : 'w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52'
            }`}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && !isChatOpen && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full mb-3 px-4 py-2 bg-slate-900/90 text-white text-xs font-semibold rounded-xl shadow-xl backdrop-blur-md border border-slate-700/50 whitespace-nowrap flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Smurf Ai !
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900/90" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notification badge when chat is closed */}
            <AnimatePresence>
              {!isChatOpen && !isTyping && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute top-3 right-3 sm:top-5 sm:right-5 w-4 h-4 sm:w-5 sm:h-5 bg-indigo-500 rounded-full flex items-center justify-center z-10 shadow-lg shadow-indigo-500/30 border border-white dark:border-slate-900"
                >
                  <span className="text-white text-[8px] sm:text-[9px] font-black">AI</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lottie Animation */}
            <div className="w-full h-full flex items-center justify-center bg-transparent">
              <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%', background: 'transparent' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
