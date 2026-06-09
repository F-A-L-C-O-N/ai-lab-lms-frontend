import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { auth, googleProvider, githubProvider } from '../../firebase/clients';
import { signInWithPopup } from 'firebase/auth';
import NeuralNetworkBackground from '../components/NeuralNetworkBackground';

const SignUp = ({ onNavigate, onAuthSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    else if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!email) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setApiError('');
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      const res = await fetch('/api/v1/auth/social-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id_token: idToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Social signup failed');
      
      setSignUpSuccess(true);
      setTimeout(() => { onAuthSuccess ? onAuthSuccess() : onNavigate('home'); }, 1500);
    } catch (error) {
      console.error('Social login error:', error);
      setApiError(error.message || 'Social signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setApiError('');
    try {
      const res = await fetch('/api/v1/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Signup failed');
      setSignUpSuccess(true);
      setTimeout(() => { onNavigate('login'); }, 1500);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 dark:bg-cyan-500/5 blur-3xl" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 dark:bg-indigo-500/5 blur-3xl" />
      <NeuralNetworkBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-4xl z-10">
        <button onClick={() => onNavigate('landing')} className="group flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors duration-200 mb-6 cursor-pointer">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 shadow-2xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
          {/* Left Side: Face Image Banner */}
          <div className="hidden md:flex md:col-span-5 relative bg-[#090D1A] overflow-hidden flex-col justify-between p-8 text-white">
            <div className="absolute inset-0 opacity-85 mix-blend-screen" style={{ backgroundImage: "url('/ai_wireframe_face.png')", backgroundSize: "auto 105%", backgroundPosition: "40px center", backgroundRepeat: "no-repeat" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090D1A] via-transparent to-[#090D1A]/50 z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090D1A]/20 via-transparent to-[#090D1A] z-10" />
            <div className="relative z-20 flex flex-col h-full justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center font-black text-sm tracking-tight text-white shadow-lg shadow-primary/30">AI</div>
                <span className="font-black tracking-wider text-sm uppercase text-slate-200">AI LAB</span>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold tracking-tight leading-snug">Empower your mind with Artificial Intelligence.</h3>
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">Access bite-sized lessons, interactive coding sandboxes, and map your personalized neural pathway.</p>
              </div>
            </div>
          </div>
          {/* Right Side: Form Content */}
          <div className="col-span-1 md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {!signUpSuccess ? (
                <motion.div key="signup-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-cyan-400">Create Account</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Join AI Lab Learning Portal and start your AI engineering roadmap</p>
                  </div>
                  {apiError && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-2xl flex items-start space-x-3">
                      <AlertCircle className="text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" size={16} />
                      <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5 mb-6">
                    {/* Name Input */}
                    <div className="relative">
                      <label htmlFor="name" className={`absolute left-10 transition-all duration-200 pointer-events-none ${isNameFocused || name ? 'top-1.5 text-xs text-primary dark:text-indigo-400 font-semibold' : 'top-4 text-slate-400 dark:text-slate-500 text-sm'}`}>Full Name</label>
                      <User className="absolute left-3 top-4 text-slate-400 dark:text-slate-500" size={18} />
                      <input id="name" type="text" value={name} onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(prev => ({ ...prev, name: '' })); }} onFocus={() => setIsNameFocused(true)} onBlur={() => setIsNameFocused(false)} disabled={isLoading} className={`w-full pl-10 pr-4 pt-6 pb-2 bg-slate-100/50 dark:bg-slate-800/40 border rounded-2xl outline-none transition-all duration-200 text-slate-800 dark:text-slate-100 ${errors.name ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-indigo-500 focus:ring-4 focus:ring-primary/10 dark:focus:ring-indigo-500/10'}`} />
                      {errors.name && (<motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-1 mt-1 text-red-500 text-xs"><AlertCircle size={12} /><span>{errors.name}</span></motion.div>)}
                    </div>
                    {/* Email Input */}
                    <div className="relative">
                      <label htmlFor="email" className={`absolute left-10 transition-all duration-200 pointer-events-none ${isEmailFocused || email ? 'top-1.5 text-xs text-primary dark:text-indigo-400 font-semibold' : 'top-4 text-slate-400 dark:text-slate-500 text-sm'}`}>Email Address</label>
                      <Mail className="absolute left-3 top-4 text-slate-400 dark:text-slate-500" size={18} />
                      <input id="email" type="text" value={email} onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: '' })); }} onFocus={() => setIsEmailFocused(true)} onBlur={() => setIsEmailFocused(false)} disabled={isLoading} className={`w-full pl-10 pr-4 pt-6 pb-2 bg-slate-100/50 dark:bg-slate-800/40 border rounded-2xl outline-none transition-all duration-200 text-slate-800 dark:text-slate-100 ${errors.email ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-indigo-500 focus:ring-4 focus:ring-primary/10 dark:focus:ring-indigo-500/10'}`} />
                      {errors.email && (<motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-1 mt-1 text-red-500 text-xs"><AlertCircle size={12} /><span>{errors.email}</span></motion.div>)}
                    </div>
                    {/* Password Input */}
                    <div className="relative">
                      <label htmlFor="password" className={`absolute left-10 transition-all duration-200 pointer-events-none ${isPasswordFocused || password ? 'top-1.5 text-xs text-primary dark:text-indigo-400 font-semibold' : 'top-4 text-slate-400 dark:text-slate-500 text-sm'}`}>Password</label>
                      <Lock className="absolute left-3 top-4 text-slate-400 dark:text-slate-500" size={18} />
                      <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(prev => ({ ...prev, password: '' })); }} onFocus={() => setIsPasswordFocused(true)} onBlur={() => setIsPasswordFocused(false)} disabled={isLoading} className={`w-full pl-10 pr-10 pt-6 pb-2 bg-slate-100/50 dark:bg-slate-800/40 border rounded-2xl outline-none transition-all duration-200 text-slate-800 dark:text-slate-100 ${errors.password ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-indigo-500 focus:ring-4 focus:ring-primary/10 dark:focus:ring-indigo-500/10'}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                      {errors.password && (<motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-1 mt-1 text-red-500 text-xs"><AlertCircle size={12} /><span>{errors.password}</span></motion.div>)}
                    </div>
                    {/* Confirm Password */}
                    <div className="relative">
                      <label htmlFor="confirmPassword" className={`absolute left-10 transition-all duration-200 pointer-events-none ${isConfirmPasswordFocused || confirmPassword ? 'top-1.5 text-xs text-primary dark:text-indigo-400 font-semibold' : 'top-4 text-slate-400 dark:text-slate-500 text-sm'}`}>Confirm Password</label>
                      <Lock className="absolute left-3 top-4 text-slate-400 dark:text-slate-500" size={18} />
                      <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' })); }} onFocus={() => setIsConfirmPasswordFocused(true)} onBlur={() => setIsConfirmPasswordFocused(false)} disabled={isLoading} className={`w-full pl-10 pr-10 pt-6 pb-2 bg-slate-100/50 dark:bg-slate-800/40 border rounded-2xl outline-none transition-all duration-200 text-slate-800 dark:text-slate-100 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-indigo-500 focus:ring-4 focus:ring-primary/10 dark:focus:ring-indigo-500/10'}`} />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                      {errors.confirmPassword && (<motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-1 mt-1 text-red-500 text-xs"><AlertCircle size={12} /><span>{errors.confirmPassword}</span></motion.div>)}
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center bg-primary hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-[0_4px_0_0_rgba(67,56,202,1)] hover:shadow-[0_4px_0_0_rgba(55,48,163,1)] active:shadow-none active:translate-y-1 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none">
                      {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : 'Create Account'}
                    </button>
                  </form>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">Or continue with</span>
                    </div>
                  </div>

                  {/* Social Login Buttons */}
                  <div className="flex flex-col space-y-3">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin(googleProvider)}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-3 px-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span>Sign up with Google</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialLogin(githubProvider)}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center space-x-2 bg-[#24292F] text-white font-semibold py-3 px-4 rounded-2xl hover:bg-[#24292F]/90 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      <span>Sign up with GitHub</span>
                    </button>
                  </div>
                  <p className="mt-8 text-center text-sm text-slate-550 dark:text-slate-400">
                    Already have an account?{' '}
                    <button type="button" onClick={() => onNavigate('login')} className="font-bold text-primary dark:text-indigo-400 hover:underline cursor-pointer">Sign in</button>
                  </p>
                </motion.div>
              ) : (
                <motion.div key="signup-success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/10"><CheckCircle2 size={36} /></div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Account Created!</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Welcome to AI Lab Learning Portal. Setting up your profile and dashboard...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
