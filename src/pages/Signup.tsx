import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { cn } from '../lib/utils';

interface FloatingInputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (v: string) => void;
    icon: React.ReactNode;
    error?: string;
    extra?: React.ReactNode;
    autoComplete?: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({ label, type = 'text', value, onChange, icon, error, extra, autoComplete }) => {
    const [focused, setFocused] = useState(false);
    const raised = focused || value.length > 0;

    return (
        <div className="relative w-full">
            <div className={cn(
                'relative border rounded-input transition-all duration-200',
                focused ? 'border-brand-500 ring-1 ring-brand-500/30' : error ? 'border-rose/50' : 'border-borderAdaptive/10 hover:border-borderAdaptive/20',
                'bg-brand-900/50'
            )}>
                <label className={cn(
                    'absolute left-10 transition-all duration-200 pointer-events-none font-medium select-none',
                    raised ? 'top-1.5 text-[10px] text-brand-300' : 'top-1/2 -translate-y-1/2 text-sm text-text-2'
                )}>
                    {label}
                </label>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-2">{icon}</div>
                <input
                    type={type}
                    value={value}
                    autoComplete={autoComplete}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-transparent text-text-1 text-sm pt-5 pb-2 pl-10 pr-10 focus:outline-none rounded-input font-sans"
                />
                {extra && <div className="absolute right-3 top-1/2 -translate-y-1/2">{extra}</div>}
            </div>
            <AnimatePresence>
                {error && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }} className="text-rose text-xs mt-1 ml-1 overflow-hidden">{error}</motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

const getStrength = (pw: string): { level: 0 | 1 | 2 | 3 | 4; label: string; color: string } => {
    if (pw.length === 0) return { level: 0, label: '', color: '' };
    if (pw.length < 6) return { level: 1, label: 'Too short', color: '#F43F5E' };
    const hasUpper = /[A-Z]/.test(pw);
    const hasNum = /\d/.test(pw);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pw);
    const score = (hasUpper ? 1 : 0) + (hasNum ? 1 : 0) + (hasSpecial ? 1 : 0);
    if (score === 0) return { level: 2, label: 'Weak', color: '#F59E0B' };
    if (score === 1) return { level: 3, label: 'Good', color: '#10B981' };
    return { level: 4, label: 'Strong 💪', color: '#10B981' };
};

export const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [shake, setShake] = useState(false);

    const strength = getStrength(password);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!name.trim()) e.name = 'Please enter your name';
        if (!email.includes('@')) e.email = 'Enter a valid email address';
        if (password.length < 6) e.password = 'Password must be at least 6 characters';
        if (password !== confirm) e.confirm = 'Passwords do not match';
        if (!agreed) e.terms = 'You must agree to the terms';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        if (!validate()) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }
        setStatus('loading');
        await new Promise((r) => setTimeout(r, 1400));
        setStatus('success');
        await new Promise((r) => setTimeout(r, 600));
        navigate('/onboarding');
    };

    return (
        <AuthLayout>
            <h1 className="text-2xl font-extrabold text-text-1 text-center mb-1">Start learning free</h1>
            <p className="text-text-2 text-sm text-center mb-8">Join 50,000+ students. No card required.</p>

            <motion.form
                onSubmit={handleSubmit}
                animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4"
            >
                <FloatingInput label="Full Name" value={name} onChange={setName} icon={<User className="w-4 h-4" />} error={errors.name} autoComplete="name" />
                <FloatingInput label="Email address" type="email" value={email} onChange={setEmail} icon={<Mail className="w-4 h-4" />} error={errors.email} autoComplete="email" />

                <div>
                    <FloatingInput
                        label="Password"
                        type={showPw ? 'text' : 'password'}
                        value={password}
                        onChange={setPassword}
                        icon={<Lock className="w-4 h-4" />}
                        error={errors.password}
                        autoComplete="new-password"
                        extra={
                            <button type="button" onClick={() => setShowPw((p) => !p)} className="text-text-2 hover:text-text-1 transition-colors">
                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        }
                    />
                    {/* Strength meter */}
                    {password.length > 0 && (
                        <div className="mt-2">
                            <div className="flex gap-1 mb-1">
                                {[1, 2, 3, 4].map((n) => (
                                    <motion.div
                                        key={n}
                                        className="flex-1 h-1 rounded-full"
                                        animate={{
                                            backgroundColor: n <= strength.level ? strength.color : '#1E293B',
                                        }}
                                        transition={{ duration: 0.2 }}
                                    />
                                ))}
                            </div>
                            <p className="text-xs font-medium" style={{ color: strength.color }}>{strength.label}</p>
                        </div>
                    )}
                </div>

                <FloatingInput
                    label="Confirm Password"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={setConfirm}
                    icon={<Lock className="w-4 h-4" />}
                    error={errors.confirm}
                    autoComplete="new-password"
                    extra={
                        <button type="button" onClick={() => setShowConfirm((p) => !p)} className="text-text-2 hover:text-text-1 transition-colors">
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    }
                />

                {/* Terms */}
                <div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <button
                            type="button"
                            onClick={() => setAgreed((a) => !a)}
                            className={cn(
                                'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
                                agreed ? 'border-brand-500' : errors.terms ? 'border-rose' : 'border-borderAdaptive/20 group-hover:border-borderAdaptive/40'
                            )}
                            style={agreed ? { background: 'linear-gradient(135deg,#2563EB,#8B5CF6)' } : {}}
                        >
                            <AnimatePresence>
                                {agreed && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 400 }}>
                                        <Check className="w-3 h-3 text-text-1" strokeWidth={3} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                        <span className="text-xs text-text-2 leading-relaxed">
                            I agree to the <Link to="#" className="text-brand-300 hover:text-text-1">Terms of Service</Link> and{' '}
                            <Link to="#" className="text-brand-300 hover:text-text-1">Privacy Policy</Link>
                        </span>
                    </label>
                    {errors.terms && <p className="text-rose text-xs mt-1 ml-8">{errors.terms}</p>}
                </div>

                <div className="pt-1">
                    <motion.button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        whileHover={status === 'idle' ? { scale: 1.02, boxShadow: '0 0 30px rgba(37,99,235,0.4)' } : {}}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-3 rounded-btn font-bold text-text-1 text-sm flex items-center justify-center gap-2 transition-all"
                        style={{ background: 'linear-gradient(135deg,#2563EB,#8B5CF6)' }}
                    >
                        {status === 'idle' && 'Create Free Account'}
                        {status === 'loading' && <div className="w-5 h-5 border-2 border-borderAdaptive/30 border-t-white rounded-full animate-spin" />}
                        {status === 'success' && <><Check className="w-5 h-5" /> Account created!</>}
                    </motion.button>
                    <p className="text-center text-xs text-text-2 mt-1.5">It's free!</p>
                </div>
            </motion.form>

            <p className="text-center text-sm text-text-2 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-300 hover:text-text-1 font-semibold transition-colors">Sign in →</Link>
            </p>
        </AuthLayout>
    );
};
