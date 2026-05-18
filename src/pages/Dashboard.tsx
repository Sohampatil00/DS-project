import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

// ─── Sub-components ──────────────────────────────────────────────────────────

const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ end, duration = 1.5, suffix = '' }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(false);

    useEffect(() => {
        if (ref.current) return;
        ref.current = true;
        let start = 0;
        const step = end / (duration * 60);
        const timer = setInterval(() => {
            start = Math.min(start + step, end);
            setCount(Math.floor(start));
            if (start >= end) clearInterval(timer);
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [end]);

    return <>{count.toLocaleString()}{suffix}</>;
};

interface GoalTask { id: number; text: string; xp: number; done: boolean }
const INITIAL_GOALS: GoalTask[] = [
    { id: 1, text: 'Complete Binary Search lesson', xp: 50, done: true },
    { id: 2, text: 'Solve 3 challenges', xp: 100, done: false },
    { id: 3, text: 'Watch BST visualization', xp: 30, done: false },
];

const BADGES = [
    { emoji: '🚀', name: 'Fast Learner', date: 'Mar 12', xp: 100, desc: 'Completed 5 lessons in one day' },
    { emoji: '🔥', name: 'On Fire', date: 'Mar 15', xp: 150, desc: '7-day learning streak achieved' },
    { emoji: '💡', name: 'Insight', date: 'Mar 10', xp: 75, desc: 'Solved a hard problem on first try' },
    { emoji: '🌟', name: 'Star Student', date: 'Mar 8', xp: 200, desc: 'Top 10 on weekly leaderboard' },
    { emoji: '⚡', name: 'Speed Demon', date: 'Feb 28', xp: 125, desc: 'Solved 10 challenges in under 2 hours' },
    { emoji: '🧠', name: 'Deep Thinker', date: 'Feb 20', xp: 80, desc: 'Studied recursion for 2+ hours' },
    { emoji: '🎯', name: 'Sharpshooter', date: 'Feb 15', xp: 90, desc: '10 perfect challenge submissions' },
    { emoji: '👑', name: 'Royalty', date: '???', xp: 500, desc: 'Reach the top of the monthly leaderboard', locked: true },
];

const LEADERBOARD = [
    { name: 'Aryan K.', xp: 8240, rank: 1 },
    { name: 'Priya S.', xp: 7910, rank: 2 },
    { name: 'Soham D.', xp: 3450, rank: 3 },
    { name: 'Dev M.', xp: 3100, rank: 4 },
    { name: 'Isha R.', xp: 2890, rank: 5 },
];

const STREAK_DATA = Array.from({ length: 35 }, (_, i) => {
    const val = i === 34 ? 3 : [0, 0, 0, 1, 0, 1, 2, 0, 3, 1, 0, 2, 1, 3, 0, 1, 2, 3, 0, 1, 3, 2, 0, 1, 3, 2, 1, 3, 2, 1, 3, 3, 2, 3, 3][i];
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    return { val, date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) };
});

const heatColor = (v: number) => {
    if (v === 0) return '#1E293B';
    if (v === 1) return 'rgba(37,99,235,0.35)';
    if (v === 2) return 'rgba(37,99,235,0.65)';
    return '#2563EB';
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export const Dashboard: React.FC = () => {
    const [goals, setGoals] = useState<GoalTask[]>(INITIAL_GOALS);
    const [toast, setToast] = useState<string | null>(null);
    const [flippedBadge, setFlippedBadge] = useState<number | null>(null);

    const toggleGoal = (id: number) => {
        setGoals((prev) =>
            prev.map((g) => {
                if (g.id !== id || g.done) return g;
                setToast(`+${g.xp} XP — "${g.text}"!`);
                setTimeout(() => setToast(null), 2500);
                return { ...g, done: true };
            })
        );
    };

    const doneCount = goals.filter((g) => g.done).length;
    const totalGoals = goals.length;
    const R = 38, circ = 2 * Math.PI * R;
    const dash = circ * (1 - doneCount / totalGoals);

    const XP = 3450, XP_MAX = 4000;

    return (
        <div className="max-w-[1400px] mx-auto p-4 md:p-8 pb-20 space-y-6">

            {/* XP Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                        className="fixed top-20 right-6 z-50 glass px-5 py-3 rounded-card border border-amber/30 text-amber font-bold text-sm flex items-center gap-2 shadow-lg"
                    >
                        ⚡ {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── HERO CARD ── */}
            <div className="rounded-card overflow-hidden p-6 md:p-8 flex flex-wrap gap-6 items-center justify-between relative"
                style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #0F172A 100%)', minHeight: 180 }}>
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#93C5FD_1px,transparent_1px)] [background-size:24px_24px]" />

                <div className="relative z-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Welcome back, Soham! 👋</h1>
                    <p className="text-amber font-semibold text-lg flex items-center gap-2">
                        Day 7 Streak <span className="text-2xl">🔥</span>
                    </p>
                    <span className="mt-2 inline-block px-3 py-1 bg-green/20 border border-green/30 rounded-full text-green text-xs font-bold">Free Forever 🎉</span>
                </div>

                <div className="relative z-10 flex-1 min-w-[280px] max-w-[420px]">
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="text-brand-300 font-bold">Level 5 — Array Apprentice</span>
                        <span className="text-text-2">{XP.toLocaleString()} / {XP_MAX.toLocaleString()} XP</span>
                    </div>
                    <div className="h-3 bg-brand-900/70 rounded-full overflow-hidden border border-white/10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(XP / XP_MAX) * 100}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg,#2563EB,#8B5CF6)' }}
                        />
                    </div>
                </div>

                <div className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center font-extrabold text-3xl text-white"
                    style={{ background: 'conic-gradient(#2563EB,#8B5CF6,#2563EB)', boxShadow: '0 0 30px rgba(37,99,235,0.4)' }}>
                    <span className="w-16 h-16 rounded-full bg-brand-900 flex items-center justify-center text-2xl font-black">5</span>
                </div>
            </div>

            {/* ── STATS ROW ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: '📚', label: 'Topics Done', value: 24, suffix: '/48', extra: 'donut' },
                    { icon: '🔥', label: 'Streak', value: 7, suffix: ' days', extra: 'flame' },
                    { icon: '⚡', label: 'Total XP', value: XP, suffix: '', extra: null },
                    { icon: '🏅', label: 'Badges', value: 7, suffix: '', extra: null },
                ].map((s) => (
                    <motion.div key={s.label} whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.2)' }}
                        className="glass rounded-card p-5 border border-white/5 flex flex-col gap-2 cursor-default transition-all">
                        <span className="text-2xl">{s.icon}</span>
                        <p className="text-text-2 text-xs font-medium">{s.label}</p>
                        <p className="text-2xl font-black text-white">
                            <AnimatedCounter end={s.value} />{s.suffix}
                        </p>
                        {s.extra === 'donut' && (
                            <svg width={40} height={40}>
                                <circle cx={20} cy={20} r={15} fill="none" stroke="#1E293B" strokeWidth={4} />
                                <circle cx={20} cy={20} r={15} fill="none" stroke="#2563EB" strokeWidth={4}
                                    strokeDasharray={`${2 * Math.PI * 15 * (24 / 48)} ${2 * Math.PI * 15}`}
                                    strokeLinecap="round" transform="rotate(-90 20 20)" />
                            </svg>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* ── CONTINUE LEARNING ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { tag: 'Resume', title: 'Linked Lists: Insertion', module: 'Data Structures', progress: 60, color: '#F59E0B', label: 'Resume →', diff: 'Intermediate' },
                    { tag: 'Up Next', title: 'Binary Search Trees', module: 'Data Structures', progress: 0, color: '#8B5CF6', label: 'Start →', diff: 'Advanced' },
                ].map((c) => (
                    <motion.div key={c.tag} whileHover={{ y: -3 }} className="glass rounded-card p-5 border border-white/5 relative overflow-hidden flex flex-col gap-3 cursor-pointer group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-card" style={{ background: c.color }} />
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] uppercase tracking-widest font-bold text-text-2">{c.tag}</span>
                                <h3 className="text-lg font-bold text-white mt-0.5 group-hover:text-brand-300 transition-colors">{c.title}</h3>
                                <p className="text-xs text-text-2 mt-1">{c.module}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-brand-800 text-text-2 text-[10px] font-bold border border-white/5">{c.diff}</span>
                        </div>
                        {c.progress > 0 && (
                            <div className="h-1.5 bg-brand-900/50 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${c.progress}%` }} transition={{ duration: 0.8, delay: 0.2 }}
                                    className="h-full rounded-full" style={{ background: c.color }} />
                            </div>
                        )}
                        <button className="self-start px-4 py-2 rounded-btn text-sm font-bold text-white bg-brand-800 hover:bg-brand-700 border border-white/10 transition-colors">
                            {c.label}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* ── TODAY's GOALS ── */}
            <div className="glass rounded-card p-6 border border-white/5">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">Today's Goals <span className="text-text-2 text-sm font-normal">{doneCount}/{totalGoals}</span></h2>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-shrink-0 flex flex-col items-center">
                        <svg width={100} height={100} viewBox="0 0 100 100">
                            <circle cx={50} cy={50} r={R} fill="none" stroke="#1E293B" strokeWidth={8} />
                            <motion.circle cx={50} cy={50} r={R} fill="none" stroke="#2563EB" strokeWidth={8}
                                strokeLinecap="round" transform="rotate(-90 50 50)"
                                initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: dash }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                strokeDasharray={circ}
                            />
                            <text x={50} y={55} textAnchor="middle" fill="white" fontSize={18} fontWeight="bold">{doneCount}/{totalGoals}</text>
                        </svg>
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                        {goals.map((g) => (
                            <motion.button key={g.id} onClick={() => toggleGoal(g.id)}
                                className="flex items-center gap-3 text-left group w-full"
                                whileTap={{ scale: 0.98 }}>
                                <div className={cn('w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all',
                                    g.done ? 'border-brand-500 bg-gradient-to-br from-brand-500 to-purple' : 'border-white/20 group-hover:border-white/40')}>
                                    {g.done && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white text-[10px]">✓</motion.span>}
                                </div>
                                <span className={cn('text-sm font-medium flex-1', g.done ? 'line-through text-text-2' : 'text-white')}>
                                    {g.text}
                                </span>
                                <span className="text-xs font-bold text-amber">+{g.xp} XP</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── BADGES ── */}
            <div>
                <h2 className="text-lg font-bold text-white mb-4">Badges Earned</h2>
                <div className="flex gap-4 overflow-x-auto pb-3 hide-scrollbar">
                    {BADGES.map((b, i) => {
                        const isFlipped = flippedBadge === i;
                        const isLocked = (b as any).locked;
                        return (
                            <motion.div key={b.name} className="flex-shrink-0 w-28 cursor-pointer" style={{ perspective: 800 }}
                                onClick={() => setFlippedBadge(isFlipped ? null : i)}>
                                <div style={{ position: 'relative', width: 120, height: 140, transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)', transition: 'transform 0.5s ease' }}>
                                    {/* Front */}
                                    <div style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}
                                        className="glass rounded-card p-3 flex flex-col items-center gap-1.5 border border-white/5">
                                        <div className={cn('w-12 h-12 rounded-full flex items-center justify-center text-2xl',
                                            isLocked ? 'grayscale opacity-40' : '')}
                                            style={{ background: 'linear-gradient(135deg,#1B3A6B,#2563EB)' }}>
                                            {isLocked ? '🔒' : b.emoji}
                                        </div>
                                        <p className="text-[11px] font-bold text-white text-center leading-tight">{b.name}</p>
                                        <p className="text-[10px] text-text-2">{b.date}</p>
                                        <p className="text-[10px] text-amber font-bold">+{b.xp} XP</p>
                                    </div>
                                    {/* Back */}
                                    <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', position: 'absolute', inset: 0 }}
                                        className="glass rounded-card p-3 flex items-center justify-center border border-brand-500/30 bg-brand-900">
                                        <p className="text-[10px] text-text-2 text-center leading-relaxed">{b.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* ── STREAK CALENDAR ── */}
            <div className="glass rounded-card p-6 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">🔥 Current streak: <span className="text-amber">7 days</span></h2>
                    <span className="text-xs text-text-2">Best: <span className="text-white font-bold">14 days</span></span>
                </div>
                <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(7, minmax(0,1fr))' }}>
                    {STREAK_DATA.map((d, i) => (
                        <div key={i} title={`${d.date}: ${d.val} topics`}
                            className="aspect-square rounded-sm relative group cursor-default"
                            style={{
                                background: heatColor(d.val),
                                outline: i === 34 ? '2px solid #F59E0B' : undefined,
                            }}>
                            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-brand-800 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 border border-white/10">
                                {d.date}: {d.val} topics
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── LEADERBOARD ── */}
            <div className="glass rounded-card p-6 border border-white/5">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-white">This Week's Top Learners</h2>
                    <span className="text-xs text-green font-medium">All learners, all free</span>
                </div>
                <div className="flex flex-col gap-3">
                    {LEADERBOARD.map((l) => {
                        const medal = l.rank === 1 ? '🥇' : l.rank === 2 ? '🥈' : l.rank === 3 ? '🥉' : `#${l.rank}`;
                        const isMe = l.name === 'Soham D.';
                        return (
                            <div key={l.name} className={cn('flex items-center gap-3 p-2 rounded-input', isMe ? 'bg-brand-700/30 border border-brand-500/20' : '')}>
                                <span className="w-8 text-center text-lg">{medal}</span>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                                    {l.name[0]}
                                </div>
                                <span className={cn('flex-1 text-sm font-medium', isMe ? 'text-white font-bold' : 'text-text-1')}>{l.name}{isMe ? ' (You)' : ''}</span>
                                <div className="w-24 h-1.5 bg-brand-900 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${(l.xp / 8240) * 100}%` }} />
                                </div>
                                <span className="text-xs font-mono text-brand-300 w-14 text-right">{l.xp.toLocaleString()} XP</span>
                            </div>
                        );
                    })}
                </div>
                <button className="mt-5 w-full text-sm text-brand-300 hover:text-white font-medium text-center transition-colors">
                    View Full Leaderboard →
                </button>
            </div>
        </div>
    );
};
