import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

type AuthMode = 'login' | 'signup';
type AuthStep = 'initial' | 'details' | 'otp' | 'success';

export const AuthModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: (user?: any) => void }) => {
    const [mode, setMode] = useState<AuthMode>('signup');
    const [step, setStep] = useState<AuthStep>('initial');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep('initial');
                setMode('signup');
                setOtp(['', '', '', '', '', '']);
                setFormData({ firstName: '', lastName: '', email: '', password: '' });
            }, 300);
        }
    }, [isOpen]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("Logged in user:", result.user);
            setStep('success');
            setTimeout(() => onLogin(), 1500);
        } catch (error: any) {
            console.error("Google Login Error:", error);
            // Better error message for the user
            if (error.code === 'auth/operation-not-allowed') {
                alert("Google Login is not enabled. Please enable it in the Firebase Console under 'Authentication > Sign-in method'.");
            } else if (error.code === 'auth/unauthorized-domain') {
                alert("This domain is not authorized for Google Login. Please add your Vercel URL to the 'Authorized domains' list in the Firebase Console.");
            } else {
                alert(`Login failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        if (value.length > 1) value = value[0];
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (mode === 'signup') {
                setStep('otp');
            } else {
                setStep('success');
                setTimeout(() => onLogin(), 1500);
            }
        }, 1200);
    };

    const handleOTPSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep('success');
            setTimeout(() => onLogin(), 1500);
        }, 1200);
    };

    const tabVariants = {
        active: { color: '#1A1A1A', fontWeight: 900 },
        inactive: { color: 'rgba(26, 26, 26, 0.3)', fontWeight: 700 }
    };

    const slideVariants = {
        enter: { x: 50, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -50, opacity: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center md:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={window.innerWidth < 768 ? { y: '100%' } : { scale: 0.95, opacity: 0, y: 20 }}
                        animate={window.innerWidth < 768 ? { y: 0 } : { scale: 1, opacity: 1, y: 0 }}
                        exit={window.innerWidth < 768 ? { y: '100%' } : { scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="bg-[#F8F6F2] w-full max-w-[460px] md:rounded-[2.5rem] rounded-t-[2.5rem] shadow-3xl relative overflow-hidden z-[2001] flex flex-col md:max-h-[90vh] max-h-[95vh] mt-auto md:mt-0"
                    >
                        {/* Header Actions */}
                        <div className="flex items-center justify-between p-8 pb-4">
                            {step !== 'initial' && step !== 'success' && (
                                <button onClick={() => setStep('initial')} className="p-2 hover:bg-white rounded-full transition-colors text-charcoal/40 ring-1 ring-charcoal/5">
                                    <ArrowLeft size={20} />
                                </button>
                            )}
                            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-charcoal/40 ml-auto ring-1 ring-charcoal/5">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="px-8 md:px-12 pb-12 overflow-y-auto custom-scrollbar">
                            <AnimatePresence mode="wait">
                                {step !== 'success' && (
                                    <motion.div
                                        key="tabs"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex gap-8 border-b border-charcoal/5 mb-10"
                                    >
                                        {(['login', 'signup'] as AuthMode[]).map(t => (
                                            <button
                                                key={t}
                                                onClick={() => { setMode(t); setStep('initial'); }}
                                                className="relative pb-4 text-xs uppercase tracking-[0.2em] transition-all"
                                            >
                                                <motion.span animate={mode === t ? 'active' : 'inactive'} variants={tabVariants}>
                                                    {t === 'login' ? 'Log In' : 'Sign Up'}
                                                </motion.span>
                                                {mode === t && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A24D]"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                {step === 'initial' && (
                                    <motion.div key="initial" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-black text-charcoal tracking-tight">
                                                {mode === 'signup' ? 'Join the Studio' : 'Welcome Back'}
                                            </h3>
                                            <p className="text-charcoal/40 font-bold text-xs uppercase tracking-widest">
                                                {mode === 'signup' ? 'Start your curated collection' : 'Continue your artistic journey'}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <button
                                                onClick={handleGoogleLogin}
                                                disabled={loading}
                                                className="w-full flex items-center justify-center gap-4 py-4 bg-white border border-charcoal/5 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl hover:-translate-y-1 transition-all"
                                            >
                                                <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="" />
                                                Continue with Google
                                            </button>
                                            <div className="relative py-4 flex items-center gap-4">
                                                <div className="flex-1 h-[1px] bg-charcoal/5" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/10">or</span>
                                                <div className="flex-1 h-[1px] bg-charcoal/5" />
                                            </div>
                                            <button
                                                onClick={() => setStep('details')}
                                                className="w-full py-5 bg-[#C9A24D] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#C9A24D]/20 hover:bg-charcoal transition-all"
                                            >
                                                Continue with Email
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 'details' && (
                                    <motion.div key="details" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-charcoal tracking-tight">
                                                {mode === 'signup' ? 'Create Account' : 'Email Login'}
                                            </h3>
                                            <p className="text-charcoal/40 font-bold text-[10px] uppercase tracking-widest">
                                                {mode === 'signup' ? 'Fill your studio credentials' : 'Enter your credentials below'}
                                            </p>
                                        </div>

                                        <form onSubmit={handleDetailsSubmit} className="space-y-4">
                                            {mode === 'signup' && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black uppercase tracking-widest text-charcoal/20 ml-2">First Name</label>
                                                        <input required type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} placeholder="Simyon" className="w-full p-4 bg-white border border-charcoal/5 rounded-xl focus:ring-2 focus:ring-[#C9A24D]/20 outline-none font-bold text-sm" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black uppercase tracking-widest text-charcoal/20 ml-2">Last Name</label>
                                                        <input required type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} placeholder="User" className="w-full p-4 bg-white border border-charcoal/5 rounded-xl focus:ring-2 focus:ring-[#C9A24D]/20 outline-none font-bold text-sm" />
                                                    </div>
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-charcoal/20 ml-2">Email Address</label>
                                                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="simyon@aesthetic.studio" className="w-full p-4 bg-white border border-charcoal/5 rounded-xl focus:ring-2 focus:ring-[#C9A24D]/20 outline-none font-bold text-sm" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-charcoal/20 ml-2">Secure Password</label>
                                                <div className="relative">
                                                    <input required type={showPassword ? "text" : "password"} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" className="w-full p-4 bg-white border border-charcoal/5 rounded-xl focus:ring-2 focus:ring-[#C9A24D]/20 outline-none font-bold text-sm" />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20 hover:text-[#C9A24D]">
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                            {mode === 'login' && (
                                                <button type="button" className="text-[10px] font-black text-[#C9A24D] uppercase tracking-widest hover:underline text-left">Forgot password?</button>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full py-5 bg-charcoal text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:bg-teal disabled:opacity-50"
                                            >
                                                {loading ? 'Processing...' : (mode === 'signup' ? 'Create Account' : 'Login')}
                                            </button>
                                        </form>
                                    </motion.div>
                                )}

                                {step === 'otp' && (
                                    <motion.div key="otp" variants={slideVariants} initial="enter" animate="center" exit="exit" className="space-y-8">
                                        <div className="text-center space-y-3">
                                            <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto text-teal">
                                                <ShieldCheck size={32} />
                                            </div>
                                            <h3 className="text-2xl font-black text-charcoal">Verify Email</h3>
                                            <p className="text-charcoal/40 font-bold text-xs leading-relaxed max-w-[240px] mx-auto">Enter the 6-digit code sent to your email.</p>
                                        </div>

                                        <form onSubmit={handleOTPSubmit} className="space-y-8">
                                            <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
                                                {otp.map((digit, i) => (
                                                    <input
                                                        key={i}
                                                        ref={el => otpRefs.current[i] = el}
                                                        type="text"
                                                        value={digit}
                                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                                        className="w-10 h-14 md:w-12 md:h-16 bg-white border-2 border-charcoal/5 rounded-xl text-center font-black text-xl focus:border-[#C9A24D] outline-none transition-all shadow-sm"
                                                        maxLength={1}
                                                        required
                                                    />
                                                ))}
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={loading || otp.some(d => !d)}
                                                className="w-full py-5 bg-charcoal text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:bg-teal disabled:opacity-50"
                                            >
                                                {loading ? 'Verifying...' : 'Verify & Complete'}
                                            </button>
                                            <p className="text-center text-[10px] font-black uppercase tracking-widest text-charcoal/30">
                                                Didn't receive code? <span className="text-[#C9A24D] cursor-pointer hover:underline">Resend</span>
                                            </p>
                                        </form>
                                    </motion.div>
                                )}

                                {step === 'success' && (
                                    <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 flex flex-col items-center text-center space-y-6">
                                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/30">
                                            <CheckCircle2 size={48} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-3xl font-black text-charcoal tracking-tight">Success!</h3>
                                            <p className="text-charcoal/40 font-bold text-xs uppercase tracking-[0.2em]">Authentication Complete</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer Ornament */}
                        {step !== 'success' && (
                            <div className="px-12 py-6 bg-charcoal/[0.02] border-t border-charcoal/5 mt-auto flex justify-center">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-charcoal/10">Secure & Aesthetic Auth</span>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
