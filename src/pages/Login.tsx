import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
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
                {/* Floating label */}
                <label className={cn(
                    'absolute left-10 transition-all duration-200 pointer-events-none font-medium select-none',
                    raised ? 'top-1.5 text-[10px] text-brand-300' : 'top-1/2 -translate-y-1/2 text-sm text-text-2'
                )}>
                    {label}
                </label>

                {/* Icon */}
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
                    <motion.p
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-rose text-xs mt-1 ml-1 overflow-hidden"
                    >{error}</motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [shake, setShake] = useState(false);

    const validate = () => {
        const e: typeof errors = {};
        if (!email.includes('@')) e.email = 'Enter a valid email address';
        if (password.length < 6) e.password = 'Password must be at least 6 characters';
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
        navigate('/dashboard');
    };

    return (
        <AuthLayout>
            <h1 className="text-2xl font-extrabold text-text-1 text-center mb-1">Welcome back</h1>
            <p className="text-text-2 text-sm text-center mb-8">Continue your free learning journey</p>

            {/* Google */}
            <button className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2.5 rounded-btn text-sm transition-all shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.25)] mb-5 active:scale-[0.98]">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-borderAdaptive/10" />
                <span className="text-text-2 text-xs">or</span>
                <div className="flex-1 h-px bg-borderAdaptive/10" />
            </div>

            <motion.form onSubmit={handleSubmit} animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-4">
                <FloatingInput
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    icon={<Mail className="w-4 h-4" />}
                    error={errors.email}
                    autoComplete="email"
                />
                <FloatingInput
                    label="Password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={setPassword}
                    icon={<Lock className="w-4 h-4" />}
                    error={errors.password}
                    autoComplete="current-password"
                    extra={
                        <button type="button" onClick={() => setShowPw((p) => !p)} className="text-text-2 hover:text-text-1 transition-colors">
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    }
                />

                <div className="text-right">
                    <Link to="#" className="text-xs text-brand-300 hover:text-text-1 transition-colors">Forgot password?</Link>
                </div>

                <motion.button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    whileHover={status === 'idle' ? { scale: 1.02, boxShadow: '0 0 30px rgba(37,99,235,0.4)' } : {}}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3 rounded-btn font-bold text-text-1 text-sm flex items-center justify-center gap-2 transition-all"
                    style={{ background: 'linear-gradient(135deg,#2563EB,#8B5CF6)' }}
                >
                    {status === 'idle' && 'Sign In'}
                    {status === 'loading' && <div className="w-5 h-5 border-2 border-borderAdaptive/30 border-t-white rounded-full animate-spin" />}
                    {status === 'success' && <><Check className="w-5 h-5" /> Success! Redirecting...</>}
                </motion.button>
            </motion.form>

            <p className="text-center text-sm text-text-2 mt-6">
                New to CodeViz?{' '}
                <Link to="/signup" className="text-brand-300 hover:text-text-1 font-semibold transition-colors">Sign up free →</Link>
            </p>
        </AuthLayout>
    );
};
