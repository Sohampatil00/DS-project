import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

// ─── Zustand — simple persist ────────────────────────────────────────────────
const STORAGE_KEY = 'codeviz_onboarding';

const goals = [
    { id: 'basics', icon: '🎯', title: 'Learn the Basics', desc: 'Start from scratch, build real foundations' },
    { id: 'interview', icon: '💼', title: 'Interview Prep', desc: 'Crack DSA rounds at top companies' },
    { id: 'levelup', icon: '📈', title: 'Level Up DSA', desc: 'Master trees, graphs, and advanced structures' },
    { id: 'academic', icon: '🎓', title: 'Academic Study', desc: 'Supplement your CS coursework' },
];

const levels = [
    { id: 'beginner', icon: '🌱', title: 'Absolute Beginner', desc: 'Never coded before', dots: 1 },
    { id: 'some', icon: '🌿', title: 'Some Experience', desc: 'Know the basics', dots: 2 },
    { id: 'intermediate', icon: '🌳', title: 'Intermediate', desc: 'Comfortable coding', dots: 3 },
    { id: 'advanced', icon: '🚀', title: 'Advanced', desc: 'DSA veteran', dots: 4 },
];

const langs = [
    { id: 'cpp', label: 'C++', tagline: 'System programming & competitive coding', color: '#2563EB', bg: 'rgba(37,99,235,0.15)' },
    { id: 'java', label: 'Java', tagline: 'Enterprise apps & Android development', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    { id: 'python', label: 'Python', tagline: 'Data science, ML & scripting', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    { id: 'c', label: 'C', tagline: 'Embedded systems & OS fundamentals', color: '#94A3B8', bg: 'rgba(148,163,184,0.1)' },
];

const dailyGoals = [10, 20, 30, 60];
const goalMotivation: Record<number, string> = {
    10: 'Even small steps compound. You\'ve got this.',
    20: 'A solid daily habit. Top learners average 22 min.',
    30: 'Great goal. You\'re in the top 20% of learners.',
    60: 'Ambitious. You\'ll fly through the curriculum.',
};
const goalPrediction: Record<number, string> = {
    10: '~6 weeks',
    20: '~3 weeks',
    30: '~2 weeks',
    60: '~1 week',
};

// ─── Canvas Confetti ─────────────────────────────────────────────────────────
const Confetti: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = Array.from({ length: 120 }, () => ({
            x: Math.random() * canvas.width,
            y: -20,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            color: ['#2563EB', '#8B5CF6', '#10B981', '#F59E0B', '#F43F5E', '#93C5FD'][Math.floor(Math.random() * 6)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 6,
        }));

        let frame: number;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;
            for (const p of particles) {
                if (p.y > canvas.height + 20) continue;
                alive = true;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05;
                p.rotation += p.rotSpeed;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                ctx.restore();
            }
            if (alive) frame = requestAnimationFrame(draw);
        };
        frame = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(frame);
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
};

// ─── Animated Checkmark ───────────────────────────────────────────────────────
const AnimatedCheck: React.FC = () => (
    <svg width={80} height={80} viewBox="0 0 80 80" className="mx-auto mb-4">
        <circle cx={40} cy={40} r={36} fill="rgba(37,99,235,0.1)" stroke="#2563EB" strokeWidth={2} />
        <motion.path
            d="M 25 40 L 36 52 L 56 28"
            fill="none"
            stroke="#10B981"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        />
    </svg>
);

// ─── Page component ───────────────────────────────────────────────────────────
export const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [dir, setDir] = useState(1);
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
    const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
    const [dailyGoal, setDailyGoal] = useState(20);
    const [confetti, setConfetti] = useState(false);

    const totalSteps = 4;

    const VARIANTS = {
        enter: (d: number) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
        center: { opacity: 1, x: 0 },
        exit: (d: number) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
    };

    const goNext = () => {
        if (step < totalSteps) {
            setDir(1);
            setStep((s) => s + 1);
        }
        if (step === totalSteps - 1) {
            setConfetti(true);
            setTimeout(() => setConfetti(false), 4000);
        }
    };
    const goPrev = () => { if (step > 0) { setDir(-1); setStep((s) => s - 1); } };

    const canContinue = [
        !!selectedGoal,
        !!selectedLevel,
        selectedLangs.length > 0,
        true,
        true,
    ][step];

    const finish = () => {
        const data = { goal: selectedGoal, level: selectedLevel, langs: selectedLangs, dailyGoal };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (_) { }
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at 50% -20%, #1B3A6B 0%, #0F172A 70%)' }}>

            {confetti && <Confetti />}

            {/* Blobs */}
            {[0, 1, 2].map((i) => (
                <motion.div key={i} className="absolute rounded-full pointer-events-none"
                    style={{
                        width: 350, height: 350, left: `${[10, 70, 40][i]}%`, top: `${[20, 60, 80][i]}%`,
                        background: i % 2 === 0 ? 'radial-gradient(circle,rgba(37,99,235,0.12),transparent 70%)' : 'radial-gradient(circle,rgba(139,92,246,0.10),transparent 70%)',
                        filter: 'blur(60px)'
                    }}
                    animate={{ x: [0, 20, -15, 0], y: [0, -15, 20, 0] }}
                    transition={{ duration: 18 + i * 4, repeat: Infinity, ease: 'easeInOut' }} />
            ))}

            {/* Progress dots */}
            {step < totalSteps && (
                <div className="flex gap-2 mb-10 relative z-10">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <motion.div key={i}
                            animate={{ width: i === step ? 28 : 8, backgroundColor: i === step ? '#2563EB' : i < step ? '#10B981' : '#334155' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="h-2 rounded-full"
                        />
                    ))}
                </div>
            )}

            <div className="relative z-10 w-full max-w-[560px]">
                <AnimatePresence custom={dir} mode="wait">
                    {/* ── STEP 0: Goal ── */}
                    {step === 0 && (
                        <motion.div key="step0" custom={dir} variants={VARIANTS} initial="enter" animate="center" exit="exit"
                            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}>
                            <h2 className="text-3xl font-extrabold text-text-1 text-center mb-2">What brings you to CodeViz?</h2>
                            <p className="text-text-2 text-center mb-8 text-sm">Pick your learning goal — you can change this anytime.</p>
                            <div className="grid grid-cols-2 gap-4">
                                {goals.map((g) => {
                                    const active = selectedGoal === g.id;
                                    return (
                                        <motion.button key={g.id} onClick={() => setSelectedGoal(g.id)}
                                            whileTap={{ scale: 0.97 }}
                                            className={cn('relative glass rounded-card p-5 text-left border-2 transition-all',
                                                active ? 'border-brand-500 shadow-glow scale-[1.02]' : 'border-borderAdaptive/5 hover:border-borderAdaptive/20')}
                                            style={active ? { background: 'rgba(37,99,235,0.08)' } : {}}>
                                            {active && (
                                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-text-1" />
                                                </div>
                                            )}
                                            <span className="text-3xl mb-3 block">{g.icon}</span>
                                            <p className="text-text-1 font-bold text-sm mb-1">{g.title}</p>
                                            <p className="text-text-2 text-xs leading-relaxed">{g.desc}</p>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 1: Level ── */}
                    {step === 1 && (
                        <motion.div key="step1" custom={dir} variants={VARIANTS} initial="enter" animate="center" exit="exit"
                            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}>
                            <h2 className="text-3xl font-extrabold text-text-1 text-center mb-2">How much do you know?</h2>
                            <p className="text-text-2 text-center mb-8 text-sm">Be honest — we'll tailor your path.</p>
                            <div className="flex flex-col gap-3">
                                {levels.map((l) => {
                                    const active = selectedLevel === l.id;
                                    return (
                                        <motion.button key={l.id} onClick={() => setSelectedLevel(l.id)}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn('glass rounded-card p-4 text-left border-2 flex items-center gap-4 transition-all',
                                                active ? 'border-brand-500' : 'border-borderAdaptive/5 hover:border-borderAdaptive/20')}
                                            style={active ? { background: 'rgba(37,99,235,0.08)' } : {}}>
                                            <span className="text-3xl">{l.icon}</span>
                                            <div className="flex-1">
                                                <p className="text-text-1 font-bold text-sm">{l.title}</p>
                                                <p className="text-text-2 text-xs mt-0.5">{l.desc}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4].map((d) => (
                                                    <div key={d} className="w-2 h-2 rounded-full" style={{ background: d <= l.dots ? '#2563EB' : '#334155' }} />
                                                ))}
                                            </div>
                                            {active && <Check className="w-4 h-4 text-brand-500" />}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 2: Languages ── */}
                    {step === 2 && (
                        <motion.div key="step2" custom={dir} variants={VARIANTS} initial="enter" animate="center" exit="exit"
                            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}>
                            <h2 className="text-3xl font-extrabold text-text-1 text-center mb-2">Pick your language(s)</h2>
                            <p className="text-text-2 text-center mb-8 text-sm">Select at least one — you can change this anytime.</p>
                            <div className="grid grid-cols-2 gap-3">
                                {langs.map((l) => {
                                    const active = selectedLangs.includes(l.id);
                                    const toggle = () => setSelectedLangs((prev) =>
                                        active ? prev.filter((x) => x !== l.id) : [...prev, l.id]);
                                    return (
                                        <motion.button key={l.id} onClick={toggle} whileTap={{ scale: 0.96 }}
                                            className={cn('relative overflow-hidden glass rounded-card p-5 text-left border-2 transition-all',
                                                active ? 'border-2' : 'border-borderAdaptive/5 hover:border-borderAdaptive/20')}
                                            style={active ? { borderColor: l.color, background: l.bg } : {}}>
                                            <p className="text-2xl font-black text-text-1 mb-1">{l.label}</p>
                                            <p className="text-text-2 text-xs leading-relaxed">{l.tagline}</p>
                                            {active && (
                                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                                                    style={{ background: l.color }}>
                                                    <Check className="w-3 h-3 text-text-1" />
                                                </div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* ── STEP 3: Daily Goal ── */}
                    {step === 3 && (
                        <motion.div key="step3" custom={dir} variants={VARIANTS} initial="enter" animate="center" exit="exit"
                            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}>
                            <h2 className="text-3xl font-extrabold text-text-1 text-center mb-2">Set a daily goal</h2>
                            <p className="text-text-2 text-center mb-10 text-sm">Consistency beats intensity. Even 10 min/day compounds.</p>

                            {/* Slider */}
                            <div className="relative mb-8 px-2">
                                <div className="flex justify-between text-xs text-text-2 mb-4 font-mono">
                                    {dailyGoals.map((g) => <span key={g}>{g < 60 ? `${g}m` : '1h'}</span>)}
                                </div>
                                <div className="relative h-3">
                                    <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-brand-800 overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ background: 'linear-gradient(90deg, #2563EB, #8B5CF6)' }}
                                            animate={{ width: `${((dailyGoals.indexOf(dailyGoal)) / (dailyGoals.length - 1)) * 100}%` }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min={0} max={3} step={1}
                                        value={dailyGoals.indexOf(dailyGoal)}
                                        onChange={(e) => setDailyGoal(dailyGoals[+e.target.value])}
                                        className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                                    />
                                    {/* Custom thumb */}
                                    <motion.div
                                        className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full shadow-lg pointer-events-none"
                                        style={{ background: 'linear-gradient(135deg, #2563EB, #8B5CF6)', boxShadow: '0 0 12px rgba(37,99,235,0.5)' }}
                                        animate={{ left: `calc(${(dailyGoals.indexOf(dailyGoal) / (dailyGoals.length - 1)) * 100}% - 12px)` }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    />
                                </div>
                            </div>

                            {/* Dynamic card */}
                            <AnimatePresence mode="wait">
                                <motion.div key={dailyGoal}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="glass rounded-card p-5 border border-brand-500/20 mb-4">
                                    <p className="text-text-1 font-bold text-lg mb-1">
                                        At {dailyGoal < 60 ? `${dailyGoal} min` : '1 hour'}/day, you'll complete Module 1 in{' '}
                                        <span className="text-brand-300">{goalPrediction[dailyGoal]}</span> 🎯
                                    </p>
                                    <p className="text-text-2 text-sm">{goalMotivation[dailyGoal]}</p>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* ── COMPLETION ── */}
                    {step === totalSteps && (
                        <motion.div key="complete" custom={dir} variants={VARIANTS} initial="enter" animate="center" exit="exit"
                            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }} className="text-center">
                            <AnimatedCheck />
                            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-purple to-amber mb-3">
                                You're all set! 🎉
                            </h2>
                            <p className="text-text-2 text-lg mb-8">Your free learning path is ready.</p>

                            <div className="flex flex-wrap justify-center gap-3 mb-10">
                                {[
                                    goals.find((g) => g.id === selectedGoal)?.title,
                                    langs.map((l) => l.id).filter((l) => selectedLangs.includes(l)).join(', '),
                                    `${dailyGoal < 60 ? `${dailyGoal} min` : '1 hr'}/day`,
                                ].filter(Boolean).map((pill) => (
                                    <span key={pill} className="px-4 py-2 glass rounded-full text-sm font-medium text-text-1 border border-borderAdaptive/10">
                                        {pill}
                                    </span>
                                ))}
                            </div>

                            <motion.button onClick={finish}
                                whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(37,99,235,0.5)' }}
                                whileTap={{ scale: 0.97 }}
                                className="flex items-center gap-2 mx-auto px-8 py-4 rounded-btn text-lg font-bold text-text-1"
                                style={{ background: 'linear-gradient(135deg, #2563EB, #8B5CF6)' }}>
                                Start Learning Free
                                <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                    <ArrowRight className="w-5 h-5" />
                                </motion.span>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation buttons */}
                {step < totalSteps && (
                    <div className="flex items-center justify-between mt-10">
                        <motion.button onClick={goPrev} disabled={step === 0}
                            whileTap={{ scale: 0.96 }}
                            className={cn('flex items-center gap-1.5 px-4 py-2 rounded-btn text-sm font-medium transition-all',
                                step === 0 ? 'opacity-0 pointer-events-none' : 'text-text-2 hover:text-text-1 border border-borderAdaptive/10 hover:border-borderAdaptive/20')}>
                            <ChevronLeft className="w-4 h-4" /> Back
                        </motion.button>

                        <button onClick={() => {
                            setSelectedGoal(null); setSelectedLevel(null); setSelectedLangs([]); setDailyGoal(20);
                            navigate('/dashboard');
                        }} className="text-xs text-text-2 hover:text-text-1 transition-colors">
                            Skip for now
                        </button>

                        <motion.button onClick={goNext} disabled={!canContinue}
                            whileHover={canContinue ? { scale: 1.04, boxShadow: '0 0 24px rgba(37,99,235,0.4)' } : {}}
                            whileTap={{ scale: 0.96 }}
                            className={cn('flex items-center gap-1.5 px-6 py-2.5 rounded-btn text-sm font-bold text-text-1 transition-all',
                                canContinue ? '' : 'opacity-40 cursor-not-allowed')}
                            style={{ background: 'linear-gradient(135deg, #2563EB, #8B5CF6)' }}>
                            Continue <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
};
