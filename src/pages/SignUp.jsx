import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile, signOut } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../../firebase/clients';

// Map Firebase error codes to user-friendly messages
const getFirebaseErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Contact support.';
    case 'auth/too-many-requests':
      return 'Too many requests. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-up popup was closed. Please try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email but different sign-in method.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

// Helper: send Firebase ID token to server → server sets httpOnly session cookie
const createSessionCookie = async (user) => {
  const idToken = await user.getIdToken();
  const res = await fetch('/api/session/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    throw new Error('Failed to create session cookie');
  }
  return res.json();
};

const SignUp = ({ onNavigate, onAuthSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Interaction & UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [firebaseError, setFirebaseError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // Floating label states
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms & conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setFirebaseError('');

    try {
      // 1. Create Firebase account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // 2. Set the user's display name
      await updateProfile(userCredential.user, { displayName: name });
      // 3. Sign out from Firebase client
      await signOut(auth);

      setSignUpSuccess(true);
      setTimeout(() => {
        // Redirect to login page after successful signup
        onNavigate('login');
      }, 1500);
    } catch (error) {
      console.error('Signup error:', error.code || error.message);
      setFirebaseError(getFirebaseErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (platform) => {
    setIsLoading(true);
    setFirebaseError('');

    const provider = platform === 'google' ? googleProvider : githubProvider;

    try {
      // 1. Authenticate with social provider
      const userCredential = await signInWithPopup(auth, provider);
      // 2. Sign out from Firebase client
      await signOut(auth);

      setSignUpSuccess(true);
      setTimeout(() => {
        // Redirect to login page after successful signup
        onNavigate('login');
      }, 1500);
    } catch (error) {
      console.error('Social signup error:', error.code || error.message);
      setFirebaseError(getFirebaseErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Decorative Gradient Background Blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 dark:bg-cyan-500/5 blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 dark:bg-indigo-500/5 blur-3xl" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        {/* Back Button */}
        <button
          onClick={() => onNavigate('landing')}
          className="group flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors duration-200 mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl rounded-3xl p-8 sm:p-10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!signUpSuccess ? (
              <motion.div
                key="signup-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-cyan-400">
                    Create Account
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Join AI Lab Learning Portal and start your AI engineering roadmap
                  </p>
                </div>

                {/* Firebase Error Banner */}
                {firebaseError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-2xl flex items-start space-x-3"
                  >
                    <AlertCircle className="text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-sm text-red-600 dark:text-red-400">{firebaseError}</p>
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Input */}
                  <div className="relative">
                    <label
                      htmlFor="name"
                      className={`absolute left-10 transition-all duration-200 pointer-events-none ${isNameFocused || name
                          ? 'top-1.5 text-xs text-primary dark:text-indigo-400 font-semibold'
                          : 'top-4 text-slate-400 dark:text-slate-500 text-sm'
                        }`}
                    >
                      Full Name
                    </label>
                    <User className="absolute left-3 top-4 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                      }}
                      onFocus={() => setIsNameFocused(true)}
                      onBlur={() => setIsNameFocused(false)}
                      disabled={isLoading}
                      className={`w-full pl-10 pr-4 pt-6 pb-2 bg-slate-100/50 dark:bg-slate-800/40 border rounded-2xl outline-none transition-all duration-200 text-slate-800 dark:text-slate-100 ${errors.name
                          ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/10'
                          : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-indigo-500 focus:ring-4 focus:ring-primary/10 dark:focus:ring-indigo-500/10'
                        }`}
                    />
                    {errors.name && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-1 mt-1 text-red-500 text-xs"
                      >
                        <AlertCircle size={12} />
                        <span>{errors.name}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className={`absolute left-10 transition-all duration-200 pointer-events-none ${isEmailFocused || email
                          ? 'top-1.5 text-xs text-primary dark:text-indigo-400 font-semibold'
                          : 'top-4 text-slate-400 dark:text-slate-500 text-sm'
                        }`}
                    >
                      Email Address
                    </label>
                    <Mail className="absolute left-3 top-4 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                      id="email"
                      type="text"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      onFocus={() => setIsEmailFocused(true)}
                      onBlur={() => setIsEmailFocused(false)}
                      disabled={isLoading}
                      className={`w-full pl-10 pr-4 pt-6 pb-2 bg-slate-100/50 dark:bg-slate-800/40 border rounded-2xl outline-none transition-all duration-200 text-slate-800 dark:text-slate-100 ${errors.email
                          ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/10'
                          : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-indigo-500 focus:ring-4 focus:ring-primary/10 dark:focus:ring-indigo-500/10'
                        }`}
                    />
                    {errors.email && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-1 mt-1 text-red-500 text-xs"
                      >
                        <AlertCircle size={12} />
                        <span>{errors.email}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <label
                      htmlFor="password"
                      className={`absolute left-10 transition-all duration-200 pointer-events-none ${isPasswordFocused || password
                          ? 'top-1.5 text-xs text-primary dark:text-indigo-400 font-semibold'
                          : 'top-4 text-slate-400 dark:text-slate-500 text-sm'
                        }`}
                    >
                      Password
                    </label>
                    <Lock className="absolute left-3 top-4 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                      }}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      disabled={isLoading}
                      className={`w-full pl-10 pr-10 pt-6 pb-2 bg-slate-100/50 dark:bg-slate-800/40 border rounded-2xl outline-none transition-all duration-200 text-slate-800 dark:text-slate-100 ${errors.password
                          ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/10'
                          : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-indigo-500 focus:ring-4 focus:ring-primary/10 dark:focus:ring-indigo-500/10'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.password && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-1 mt-1 text-red-500 text-xs"
                      >
                        <AlertCircle size={12} />
                        <span>{errors.password}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div className="relative">
                    <label
                      htmlFor="confirmPassword"
                      className={`absolute left-10 transition-all duration-200 pointer-events-none ${isConfirmPasswordFocused || confirmPassword
                          ? 'top-1.5 text-xs text-primary dark:text-indigo-400 font-semibold'
                          : 'top-4 text-slate-400 dark:text-slate-500 text-sm'
                        }`}
                    >
                      Confirm Password
                    </label>
                    <Lock className="absolute left-3 top-4 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                      }}
                      onFocus={() => setIsConfirmPasswordFocused(true)}
                      onBlur={() => setIsConfirmPasswordFocused(false)}
                      disabled={isLoading}
                      className={`w-full pl-10 pr-10 pt-6 pb-2 bg-slate-100/50 dark:bg-slate-800/40 border rounded-2xl outline-none transition-all duration-200 text-slate-800 dark:text-slate-100 ${errors.confirmPassword
                          ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/10'
                          : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-indigo-500 focus:ring-4 focus:ring-primary/10 dark:focus:ring-indigo-500/10'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {errors.confirmPassword && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-1 mt-1 text-red-500 text-xs"
                      >
                        <AlertCircle size={12} />
                        <span>{errors.confirmPassword}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <div>
                    <label className="flex items-start space-x-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => {
                          setTermsAccepted(e.target.checked);
                          if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                        }}
                        disabled={isLoading}
                        className="mt-1 w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-700 text-primary dark:text-indigo-500 focus:ring-primary dark:focus:ring-indigo-500 bg-white dark:bg-slate-800 transition"
                      />
                      <span>
                        I agree to the{' '}
                        <a href="#" className="font-semibold text-primary dark:text-indigo-400 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="font-semibold text-primary dark:text-indigo-400 hover:underline">Privacy Policy</a>
                      </span>
                    </label>
                    {errors.terms && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-1 mt-1.5 text-red-500 text-xs"
                      >
                        <AlertCircle size={12} />
                        <span>{errors.terms}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Sign Up Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center bg-primary hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-[0_4px_0_0_rgba(67,56,202,1)] hover:shadow-[0_4px_0_0_rgba(55,48,163,1)] active:shadow-none active:translate-y-1 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin mr-2" size={18} />
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-850" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-slate-400 dark:bg-slate-900 dark:text-slate-500">
                      Or register with
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={() => handleSocialSignUp('google')}
                    disabled={isLoading}
                    className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 active:scale-98 transition duration-150 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold text-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                    <span>Google</span>
                  </button>

                  {/* GitHub */}
                  <button
                    type="button"
                    onClick={() => handleSocialSignUp('github')}
                    disabled={isLoading}
                    className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 active:scale-98 transition duration-150 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold text-sm"
                  >
                    <svg className="w-5 h-5 text-slate-900 dark:text-slate-100" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    <span>GitHub</span>
                  </button>
                </div>

                {/* Footer Switch */}
                <p className="mt-8 text-center text-sm text-slate-550 dark:text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="font-bold text-primary dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="signup-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/10">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  Account Created!
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Welcome to AI Lab Learning Portal. Setting up your profile and dashboard...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
