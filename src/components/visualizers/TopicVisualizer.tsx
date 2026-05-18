import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Shared hook: step through an array of frames ────────────────────────────
function useSteps(count: number, playing: boolean, msPerStep: number) {
    const [step, setStep] = useState(0);
    useEffect(() => {
        if (!playing) return;
        const id = setInterval(() => setStep(s => (s + 1) % count), msPerStep);
        return () => clearInterval(id);
    }, [playing, msPerStep, count]);
    // reset to 0 when topic changes
    useEffect(() => { setStep(0); }, [count]);
    return [step, setStep] as const;
}

// ─── Binary Search ────────────────────────────────────────────────────────────
const BinarySearchVis: React.FC<{ playing: boolean; speed: number }> = ({ playing, speed }) => {
    const arr = [-1, 0, 3, 5, 9, 12];
    const frames = [
        { left: 0, right: 5, mid: 2, found: false, label: 'Step 1: mid=2, arr[2]=3 < 9 → search right half' },
        { left: 3, right: 5, mid: 4, found: false, label: 'Step 2: mid=4, arr[4]=9 == 9 → found!' },
        { left: 3, right: 5, mid: 4, found: true,  label: '✓ Target 9 found at index 4' },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(1400 / speed));
    const cur = frames[step];

    return (
        <div className="flex flex-col items-center gap-5 w-full select-none">
            <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-text-2">arr =</span>
                <span className="text-brand-300">[{arr.join(', ')}]</span>
                <span className="text-text-2 ml-2">target =</span>
                <span className="text-amber font-bold">9</span>
            </div>

            <div className="flex gap-2">
                {arr.map((v, i) => {
                    const isMid   = i === cur.mid;
                    const isFound = cur.found && i === cur.mid;
                    const inRange = i >= cur.left && i <= cur.right;
                    const isL     = i === cur.left;
                    const isR     = i === cur.right;
                    return (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <motion.div
                                className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold border-2"
                                animate={{
                                    y: isMid ? -10 : 0,
                                    backgroundColor: isFound ? '#10B981' : isMid ? '#F59E0B' : inRange ? '#1E3A5F' : '#0F172A',
                                    borderColor:     isFound ? '#10B981' : isMid ? '#F59E0B' : inRange ? '#3B82F6' : '#1E293B',
                                    scale: isMid ? 1.18 : 1,
                                }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            >
                                <span style={{ color: isFound || isMid ? '#0F172A' : inRange ? '#93C5FD' : '#475569' }}>{v}</span>
                            </motion.div>
                            <span className="text-[9px] font-mono text-text-2">[{i}]</span>
                            <span className="text-[9px] font-bold h-3" style={{
                                color: isL && isR ? '#A78BFA' : isL ? '#34D399' : isR ? '#F87171' : 'transparent'
                            }}>
                                {isL && isR ? 'L=R' : isL ? 'L' : isR ? 'R' : '·'}
                            </span>
                        </div>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={step}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center font-mono text-text-2 bg-brand-900/50 px-4 py-2 rounded-lg border border-white/5 max-w-xs">
                    {cur.label}
                </motion.div>
            </AnimatePresence>

            <div className="flex gap-4 text-[10px] font-mono text-text-2">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber inline-block" />mid</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#1E3A5F] border border-brand-500 inline-block" />range</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green inline-block" />found</span>
            </div>
        </div>
    );
};

// ─── Bubble Sort ──────────────────────────────────────────────────────────────
const SortingVis: React.FC<{ playing: boolean; speed: number }> = ({ playing, speed }) => {
    const INIT = [64, 34, 25, 12, 22, 11, 90];
    type S = 'default' | 'comparing' | 'sorted';
    const [bars, setBars] = useState<{ val: number; state: S }[]>(INIT.map(v => ({ val: v, state: 'default' })));
    const [done, setDone] = useState(false);
    const [runKey, setRunKey] = useState(0);

    useEffect(() => {
        if (!playing) return;
        setBars(INIT.map(v => ({ val: v, state: 'default' })));
        setDone(false);
        const arr = [...INIT];
        let cancelled = false;
        const n = arr.length;
        const delay = () => new Promise<void>(r => setTimeout(r, Math.round(380 / speed)));

        (async () => {
            for (let i = 0; i < n - 1 && !cancelled; i++) {
                for (let j = 0; j < n - i - 1 && !cancelled; j++) {
                    setBars(arr.map((v, k) => ({
                        val: v,
                        state: k === j || k === j + 1 ? 'comparing' : k >= n - i ? 'sorted' : 'default',
                    })));
                    await delay();
                    if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
            if (!cancelled) { setBars(arr.map(v => ({ val: v, state: 'sorted' }))); setDone(true); }
        })();
        return () => { cancelled = true; };
    }, [playing, speed, runKey]);

    const maxVal = Math.max(...INIT);
    return (
        <div className="flex flex-col items-center gap-4 w-full select-none">
            <p className="text-xs font-mono text-text-2">Bubble Sort — live execution</p>
            <div className="flex items-end gap-1.5 h-32 w-full max-w-xs">
                {bars.map((b, i) => (
                    <div key={i} className="flex flex-col items-end justify-end flex-1 gap-0.5">
                        <motion.div
                            className="w-full rounded-t-md"
                            animate={{
                                height: `${Math.round((b.val / maxVal) * 112)}px`,
                                backgroundColor: b.state === 'comparing' ? '#F59E0B' : b.state === 'sorted' ? '#10B981' : '#3B82F6',
                            }}
                            transition={{ duration: 0.18 }}
                        />
                        <span className="text-[8px] text-text-2 font-mono text-center w-full">{b.val}</span>
                    </div>
                ))}
            </div>
            {done
                ? <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-xs font-bold text-green">✓ Sorted!</motion.p>
                : <p className="text-xs text-text-2 font-mono">{playing ? 'Sorting...' : 'Press ▶ to start'}</p>
            }
            <div className="flex gap-4 text-[10px] font-mono text-text-2">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-500 inline-block" />unsorted</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber inline-block" />comparing</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green inline-block" />sorted</span>
            </div>
            {done && (
                <button onClick={() => { setRunKey(k => k + 1); }} className="text-[10px] text-brand-300 border border-brand-500/30 px-3 py-1 rounded-full hover:bg-brand-800 transition-colors">
                    ↺ Replay
                </button>
            )}
        </div>
    );
};

// ─── Recursion Tree ───────────────────────────────────────────────────────────
const RecursionVis: React.FC<{ playing: boolean; speed: number }> = ({ playing, speed }) => {
    const nodes = [
        { id: 0, label: 'fact(4)', x: 150, y: 24,  parentId: -1 },
        { id: 1, label: 'fact(3)', x: 90,  y: 84,  parentId: 0  },
        { id: 2, label: 'fact(2)', x: 50,  y: 144, parentId: 1  },
        { id: 3, label: 'fact(1)', x: 25,  y: 204, parentId: 2  },
        { id: 4, label: '→ 1',    x: 25,  y: 254, parentId: 3  },
        { id: 5, label: '→ 2',    x: 50,  y: 204, parentId: 2  },
        { id: 6, label: '→ 6',    x: 90,  y: 144, parentId: 1  },
        { id: 7, label: '→ 24',   x: 150, y: 84,  parentId: 0  },
    ];
    const [visible, setVisible] = useState(1);
    useEffect(() => {
        if (!playing) return;
        const id = setInterval(() => setVisible(v => v < nodes.length ? v + 1 : 1), Math.round(900 / speed));
        return () => clearInterval(id);
    }, [playing, speed]);

    return (
        <div className="flex flex-col items-center gap-2 w-full select-none">
            <p className="text-xs font-mono text-text-2">factorial(4) — call & return</p>
            <svg width="300" height="280" className="overflow-visible">
                {nodes.slice(0, visible).map(n => {
                    if (n.parentId < 0) return null;
                    const p = nodes[n.parentId];
                    return (
                        <motion.line key={`l${n.id}`}
                            x1={p.x} y1={p.y + 13} x2={n.x} y2={n.y - 13}
                            stroke={n.id >= 5 ? '#10B981' : '#3B82F6'} strokeWidth="1.5" strokeDasharray="4 2"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25 }}
                        />
                    );
                })}
                {nodes.slice(0, visible).map(n => (
                    <motion.g key={`n${n.id}`}
                        initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                        transition={{ type: 'spring', stiffness: 280, damping: 18 }}>
                        <rect x={n.x - 34} y={n.y - 13} width={68} height={26} rx={6}
                            fill={n.id === visible - 1 ? '#1E3A5F' : n.id >= 5 ? '#064E3B' : '#1E293B'}
                            stroke={n.id === visible - 1 ? '#3B82F6' : n.id >= 5 ? '#10B981' : '#334155'}
                            strokeWidth="1.5" />
                        <text x={n.x} y={n.y + 5} textAnchor="middle"
                            fill={n.id >= 5 ? '#34D399' : n.id === visible - 1 ? '#93C5FD' : '#94A3B8'}
                            fontSize="10" fontFamily="monospace">{n.label}</text>
                    </motion.g>
                ))}
            </svg>
        </div>
    );
};

// ─── Linked List ──────────────────────────────────────────────────────────────
const LinkedListVis: React.FC<{ playing: boolean; speed: number }> = ({ playing, speed }) => {
    const frames = [
        { nodes: [1],       active: 0,  label: 'insertTail(1) → head = [1]' },
        { nodes: [1, 2],    active: 1,  label: 'insertTail(2) → [1] → [2]' },
        { nodes: [1, 2, 3], active: 2,  label: 'insertTail(3) → [1] → [2] → [3]' },
        { nodes: [1, 2, 3], active: 0,  label: 'Traverse: cur = head (1)' },
        { nodes: [1, 2, 3], active: 1,  label: 'Traverse: cur = cur.next (2)' },
        { nodes: [1, 2, 3], active: 2,  label: 'Traverse: cur = cur.next (3)' },
        { nodes: [1, 2, 3], active: -1, label: 'cur.next = null → done ✓' },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(1000 / speed));
    const cur = frames[step];

    return (
        <div className="flex flex-col items-center gap-5 w-full select-none">
            <div className="flex items-center gap-1 flex-wrap justify-center">
                <AnimatePresence>
                    {cur.nodes.map((v, i) => (
                        <motion.div key={v}
                            initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-1">
                            <div className={`flex border-2 rounded-lg overflow-hidden text-xs font-mono transition-colors ${i === cur.active ? 'border-brand-400' : 'border-white/15'}`}>
                                <div className={`px-3 py-2 font-bold transition-colors ${i === cur.active ? 'bg-brand-600 text-white' : 'bg-brand-900/60 text-text-1'}`}>{v}</div>
                                <div className="px-2 py-2 bg-[#0D1117] text-text-2 border-l border-white/10 text-[10px]">next</div>
                            </div>
                            <span className="text-text-2 text-sm">→</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div className="px-3 py-2 text-xs font-mono text-text-2 border border-white/10 rounded-lg bg-[#0D1117]">null</div>
            </div>
            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs font-mono text-brand-300 text-center bg-brand-900/40 px-3 py-1.5 rounded-lg border border-white/5">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─── Stack (Bracket Matching) ─────────────────────────────────────────────────
const StackVis: React.FC<{ playing: boolean; speed: number }> = ({ playing, speed }) => {
    const frames = [
        { stack: ['('],             label: "Read '(' → push" },
        { stack: ['(', '['],        label: "Read '[' → push" },
        { stack: ['(', '[', '{'],   label: "Read '{' → push" },
        { stack: ['(', '[', '{', '('], label: "Read '(' → push" },
        { stack: ['(', '[', '{'],   label: "Read ')' → pop '(' ✓ match" },
        { stack: ['(', '['],        label: "Read '}' → pop '{' ✓ match" },
        { stack: ['('],             label: "Read ']' → pop '[' ✓ match" },
        { stack: [],                label: "Read ')' → pop '(' ✓ — stack empty → balanced!" },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(900 / speed));
    const cur = frames[step];

    return (
        <div className="flex flex-col items-center gap-3 w-full select-none">
            <p className="text-xs font-mono text-text-2">
                Input: <span className="text-brand-300 font-bold">({`[{()}]`})</span>
            </p>
            <div className="flex gap-8 items-end">
                {/* Stack column */}
                <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] text-text-2 font-mono mb-1">stack</p>
                    <div className="flex flex-col-reverse gap-1 min-h-[130px] justify-end items-center w-14">
                        <AnimatePresence>
                            {cur.stack.map((c, i) => (
                                <motion.div key={`${c}-${i}`}
                                    initial={{ opacity: 0, y: -16, scale: 0.7 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -16, scale: 0.7 }}
                                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                                    className={`w-12 h-9 flex items-center justify-center text-base font-bold rounded border-2 ${i === cur.stack.length - 1 ? 'bg-brand-600 border-brand-400 text-white' : 'bg-brand-900/60 border-white/15 text-text-1'}`}>
                                    {c}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {cur.stack.length === 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-[10px] text-green font-bold">empty ✓</motion.div>
                        )}
                    </div>
                    <div className="w-14 h-0.5 bg-white/20 rounded mt-1" />
                    <span className="text-[9px] text-text-2 font-mono">top</span>
                </div>
                {/* Step indicator */}
                <div className="flex flex-col items-center gap-1 pb-4">
                    <p className="text-[10px] text-text-2 font-mono mb-1">step</p>
                    <div className="w-8 h-8 rounded-full bg-brand-700 border border-brand-400 flex items-center justify-center text-sm font-bold text-white">
                        {step + 1}
                    </div>
                    <p className="text-[9px] text-text-2 font-mono">/ {frames.length}</p>
                </div>
            </div>
            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs font-mono text-center text-text-2 max-w-[220px] bg-brand-900/40 px-3 py-1.5 rounded-lg border border-white/5">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─── BST Insert ───────────────────────────────────────────────────────────────
const BSTVis: React.FC<{ playing: boolean; speed: number }> = ({ playing, speed }) => {
    const frames = [
        { vals: [5],             active: 5,  label: 'Insert 5 → becomes root' },
        { vals: [5, 3],          active: 3,  label: '3 < 5 → go left → insert' },
        { vals: [5, 3, 7],       active: 7,  label: '7 > 5 → go right → insert' },
        { vals: [5, 3, 7, 1],    active: 1,  label: '1 < 5 → left, 1 < 3 → left → insert' },
        { vals: [5, 3, 7, 1, 4], active: 4,  label: '4 < 5 → left, 4 > 3 → right → insert' },
        { vals: [5, 3, 7, 1, 4], active: -1, label: 'In-order traversal: 1 3 4 5 7 ✓' },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(1100 / speed));
    const cur = frames[step];

    const pos: Record<number, { x: number; y: number; parent?: number }> = {
        5: { x: 150, y: 28 },
        3: { x: 85,  y: 88,  parent: 5 },
        7: { x: 215, y: 88,  parent: 5 },
        1: { x: 50,  y: 148, parent: 3 },
        4: { x: 120, y: 148, parent: 3 },
    };

    return (
        <div className="flex flex-col items-center gap-3 w-full select-none">
            <svg width="300" height="185" className="overflow-visible">
                {cur.vals.map(v => {
                    const p = pos[v]; if (!p.parent) return null;
                    const pp = pos[p.parent!];
                    return (
                        <motion.line key={`e${v}`}
                            x1={pp.x} y1={pp.y + 15} x2={p.x} y2={p.y - 15}
                            stroke="#334155" strokeWidth="1.5"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }}
                        />
                    );
                })}
                {cur.vals.map(v => {
                    const p = pos[v];
                    const isActive = v === cur.active;
                    const isDone   = cur.active === -1;
                    return (
                        <motion.g key={`n${v}`}
                            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                            style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                            transition={{ type: 'spring', stiffness: 280, damping: 18 }}>
                            <circle cx={p.x} cy={p.y} r={17}
                                fill={isActive ? '#2563EB' : isDone ? '#10B981' : '#1E293B'}
                                stroke={isActive ? '#93C5FD' : isDone ? '#34D399' : '#334155'}
                                strokeWidth="2" />
                            <text x={p.x} y={p.y + 5} textAnchor="middle"
                                fill={isActive || isDone ? 'white' : '#94A3B8'}
                                fontSize="12" fontWeight="bold" fontFamily="monospace">{v}</text>
                        </motion.g>
                    );
                })}
            </svg>
            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs font-mono text-brand-300 text-center bg-brand-900/40 px-3 py-1.5 rounded-lg border border-white/5">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─── Loop (Even Numbers) ──────────────────────────────────────────────────────
const LoopVis: React.FC<{ playing: boolean; speed: number }> = ({ playing, speed }) => {
    const evens = [2, 4, 6, 8, 10];
    const frames = [
        { i: 0, printed: [] as number[],          label: 'i = 2, i <= 10 → print 2' },
        { i: 1, printed: [2],                     label: 'i = 4, i <= 10 → print 4' },
        { i: 2, printed: [2, 4],                  label: 'i = 6, i <= 10 → print 6' },
        { i: 3, printed: [2, 4, 6],               label: 'i = 8, i <= 10 → print 8' },
        { i: 4, printed: [2, 4, 6, 8],            label: 'i = 10, i <= 10 → print 10' },
        { i: 5, printed: [2, 4, 6, 8, 10],        label: 'i = 12, i > 10 → loop ends ✓' },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(800 / speed));
    const cur = frames[step];

    return (
        <div className="flex flex-col items-center gap-5 w-full select-none">
            <div className="text-xs font-mono text-text-2 bg-brand-900/50 px-4 py-2 rounded-lg border border-white/5 text-center">
                <span className="text-brand-300">for</span> i = 2; i &lt;= 10; i += 2
            </div>
            <div className="flex gap-2">
                {evens.map((v, idx) => {
                    const isCurrent = idx === cur.i;
                    const isPrinted = cur.printed.includes(v);
                    return (
                        <motion.div key={v}
                            animate={{
                                backgroundColor: isCurrent ? '#2563EB' : isPrinted ? '#10B981' : '#1E293B',
                                scale: isCurrent ? 1.2 : 1,
                                y: isCurrent ? -8 : 0,
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold border border-white/10">
                            <span style={{ color: isCurrent || isPrinted ? 'white' : '#475569' }}>{v}</span>
                        </motion.div>
                    );
                })}
            </div>
            <div className="text-xs font-mono text-text-2">
                Output: <span className="text-green">{cur.printed.join(' ')}{cur.printed.length > 0 ? ' ' : ''}</span>
                {cur.i < evens.length && <span className="animate-pulse text-amber">▌</span>}
            </div>
            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs font-mono text-center text-text-2 bg-brand-900/40 px-3 py-1.5 rounded-lg border border-white/5">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─── Variables / Memory ───────────────────────────────────────────────────────
const VariablesVis: React.FC<{ playing: boolean; speed: number }> = ({ playing, speed }) => {
    const vars = [
        { name: 'age',    type: 'int',    value: '25',      addr: '0x1A4', color: '#3B82F6' },
        { name: 'height', type: 'float',  value: '5.9',     addr: '0x1A8', color: '#F59E0B' },
        { name: 'name',   type: 'string', value: '"Alice"', addr: '0x1AC', color: '#10B981' },
    ];
    const [visible, setVisible] = useState(0);
    useEffect(() => {
        if (!playing) return;
        setVisible(0);
        const id = setInterval(() => setVisible(v => v < vars.length ? v + 1 : 0), Math.round(900 / speed));
        return () => clearInterval(id);
    }, [playing, speed]);

    return (
        <div className="flex flex-col gap-3 w-full px-2 select-none">
            <p className="text-xs font-mono text-text-2">Memory allocation</p>
            <div className="flex flex-col gap-2">
                {vars.slice(0, visible).map((v, i) => (
                    <motion.div key={v.name}
                        initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-2 bg-brand-900/60 border border-white/10 rounded-lg px-3 py-2.5">
                        <span className="text-[10px] font-mono text-text-2 w-12 shrink-0">{v.addr}</span>
                        <span className="text-[10px] font-mono w-12 shrink-0" style={{ color: v.color }}>{v.type}</span>
                        <span className="text-xs font-bold text-white flex-1">{v.name}</span>
                        <motion.span
                            key={v.value}
                            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="text-xs font-mono font-bold" style={{ color: v.color }}>
                            {v.value}
                        </motion.span>
                    </motion.div>
                ))}
                {visible === 0 && <p className="text-xs text-text-2 font-mono animate-pulse">Allocating...</p>}
            </div>
            {visible === vars.length && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-xs text-green font-mono">✓ All variables allocated</motion.p>
            )}
        </div>
    );
};

// ─── Conditionals ─────────────────────────────────────────────────────────────
const ConditionalsVis: React.FC<{ playing: boolean; speed: number }> = ({ playing, speed }) => {
    const cases = [
        { n: 7,  branch: 'Positive', color: '#10B981', cond: 'n > 0 → true' },
        { n: -3, branch: 'Negative', color: '#F43F5E', cond: 'n < 0 → true' },
        { n: 0,  branch: 'Zero',     color: '#F59E0B', cond: 'else → true' },
    ];
    const [idx] = useSteps(cases.length, playing, Math.round(1400 / speed));
    const cur = cases[idx];

    return (
        <div className="flex flex-col items-center gap-3 w-full select-none">
            <div className="flex items-center gap-3">
                <div className="bg-brand-900/60 border border-white/10 rounded-xl px-5 py-3 text-center min-w-[80px]">
                    <p className="text-[10px] text-text-2 font-mono mb-1">input n</p>
                    <AnimatePresence mode="wait">
                        <motion.p key={cur.n} initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }}
                            className="text-3xl font-bold text-white">{cur.n}</motion.p>
                    </AnimatePresence>
                </div>
                <div className="text-text-2 text-lg">→</div>
                <div className="bg-brand-900/60 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-text-2 leading-relaxed">
                    <p className={cur.branch === 'Positive' ? 'text-green font-bold' : ''}>if n &gt; 0 → Positive</p>
                    <p className={cur.branch === 'Negative' ? 'text-rose font-bold' : ''}>elif n &lt; 0 → Negative</p>
                    <p className={cur.branch === 'Zero' ? 'text-amber font-bold' : ''}>else → Zero</p>
                </div>
                <div className="text-text-2 text-lg">→</div>
                <AnimatePresence mode="wait">
                    <motion.div key={cur.branch}
                        initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="px-4 py-3 rounded-xl font-bold text-sm border-2 min-w-[80px] text-center"
                        style={{ backgroundColor: cur.color + '20', borderColor: cur.color, color: cur.color }}>
                        {cur.branch}
                    </motion.div>
                </AnimatePresence>
            </div>
            <p className="text-[10px] font-mono text-text-2">{cur.cond}</p>
        </div>
    );
};

// ─── Functions / Call Stack ───────────────────────────────────────────────────
const FunctionsVis: React.FC<{ playing: boolean; speed: number }> = ({ playing, speed }) => {
    const frames = [
        { stack: [{ name: 'main()', vars: 'n = 7' }],                                                    label: 'main() starts, calls isPrime(7)' },
        { stack: [{ name: 'main()', vars: 'n = 7' }, { name: 'isPrime(7)', vars: 'n=7, i=2' }],          label: 'isPrime: 7 % 2 ≠ 0, i++' },
        { stack: [{ name: 'main()', vars: 'n = 7' }, { name: 'isPrime(7)', vars: 'n=7, i=3' }],          label: 'isPrime: 7 % 3 ≠ 0, i++ (i²>7)' },
        { stack: [{ name: 'main()', vars: 'n = 7' }, { name: 'isPrime(7) → true', vars: '' }],           label: 'isPrime returns true → frame popped' },
        { stack: [{ name: 'main()', vars: 'result = true' }],                                             label: 'main() prints "true" ✓' },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(1100 / speed));
    const cur = frames[step];

    return (
        <div className="flex flex-col items-center gap-3 w-full select-none">
            <p className="text-xs font-mono text-text-2">Call stack — isPrime(7)</p>
            <div className="flex flex-col-reverse gap-1.5 w-full max-w-[220px] min-h-[120px] justify-end">
                <AnimatePresence>
                    {cur.stack.map((f, i) => (
                        <motion.div key={`${f.name}-${i}`}
                            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                            transition={{ type: 'spring', stiffness: 280 }}
                            className={`border rounded-lg px-3 py-2 text-xs font-mono ${i === cur.stack.length - 1 ? 'bg-brand-700/40 border-brand-400 text-white' : 'bg-brand-900/40 border-white/10 text-text-2'}`}>
                            <p className="font-bold">{f.name}</p>
                            {f.vars && <p className="text-[10px] opacity-70">{f.vars}</p>}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <div className="w-full max-w-[220px] h-0.5 bg-white/15 rounded" />
            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs font-mono text-center text-text-2 bg-brand-900/40 px-3 py-1.5 rounded-lg border border-white/5 max-w-[220px]">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─── Pointers / Swap ──────────────────────────────────────────────────────────
const PointerVis: React.FC<{ playing: boolean; speed: number }> = ({ playing, speed }) => {
    const frames = [
        { a: 3, b: 7, highlight: '',    label: 'Before: a=3 at 0x100, b=7 at 0x104' },
        { a: 3, b: 7, highlight: 'tmp', label: 'tmp = *pA → tmp = 3' },
        { a: 7, b: 7, highlight: 'a',   label: '*pA = *pB → a = 7' },
        { a: 7, b: 3, highlight: 'b',   label: '*pB = tmp → b = 3' },
        { a: 7, b: 3, highlight: 'done',label: 'After swap: a=7, b=3 ✓' },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(1100 / speed));
    const cur = frames[step];

    return (
        <div className="flex flex-col items-center gap-5 w-full select-none">
            <div className="flex gap-8 items-start">
                {[
                    { label: 'a', val: cur.a, addr: '0x100', ptr: 'pA', hi: cur.highlight === 'a' || cur.highlight === 'done' },
                    { label: 'b', val: cur.b, addr: '0x104', ptr: 'pB', hi: cur.highlight === 'b' || cur.highlight === 'done' },
                ].map(box => (
                    <div key={box.label} className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-mono text-text-2">{box.addr}</span>
                        <motion.div
                            animate={{ borderColor: box.hi ? '#10B981' : '#3B82F6', backgroundColor: box.hi ? '#064E3B' : '#1E293B' }}
                            transition={{ duration: 0.3 }}
                            className="w-16 h-16 border-2 rounded-xl flex items-center justify-center">
                            <motion.span key={box.val} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                className="text-2xl font-bold text-white">{box.val}</motion.span>
                        </motion.div>
                        <span className="text-xs font-bold text-brand-300">{box.label}</span>
                        <span className="text-[10px] font-mono text-text-2">*{box.ptr}</span>
                    </div>
                ))}
                {cur.highlight === 'tmp' && (
                    <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-mono text-text-2">stack</span>
                        <div className="w-16 h-16 border-2 border-amber/60 bg-amber/10 rounded-xl flex items-center justify-center">
                            <span className="text-2xl font-bold text-amber">3</span>
                        </div>
                        <span className="text-xs font-bold text-amber">tmp</span>
                    </motion.div>
                )}
            </div>
            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs font-mono text-center text-text-2 bg-brand-900/40 px-3 py-1.5 rounded-lg border border-white/5 max-w-[240px]">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─── Hello World (Intro) ──────────────────────────────────────────────────────
const HelloWorldVis: React.FC<{ playing: boolean; speed: number }> = ({ playing, speed }) => {
    const frames = [
        { line: 'int main() {',                  out: '',               label: 'Program starts at main()' },
        { line: '  cout << "Hello, World!";',    out: '',               label: 'Execute print statement' },
        { line: '  return 0;',                   out: 'Hello, World!',  label: 'Output written to stdout' },
        { line: '}',                             out: 'Hello, World!',  label: 'main() returns 0 → exit ✓' },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(1000 / speed));
    const cur = frames[step];

    return (
        <div className="flex flex-col items-center gap-4 w-full select-none">
            <div className="w-full max-w-xs bg-[#0D1117] border border-white/10 rounded-xl overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 bg-brand-900/40">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green/60" />
                    <span className="text-[10px] text-text-2 font-mono ml-2">main.cpp</span>
                </div>
                <div className="p-3 font-mono text-xs space-y-1">
                    {frames.map((f, i) => (
                        <motion.div key={i}
                            animate={{ backgroundColor: i === step ? '#1E3A5F' : 'transparent' }}
                            className="px-2 py-0.5 rounded transition-colors">
                            <span style={{ color: i === step ? '#93C5FD' : '#475569' }}>{f.line}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
            <div className="w-full max-w-xs bg-[#080C10] border border-white/10 rounded-xl p-3">
                <p className="text-[10px] text-text-2 font-mono mb-1">stdout</p>
                <AnimatePresence>
                    {cur.out && (
                        <motion.p key="out" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            className="text-sm font-mono text-green">{cur.out}</motion.p>
                    )}
                </AnimatePresence>
                {!cur.out && <span className="text-text-2 text-xs font-mono animate-pulse">▌</span>}
            </div>
            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs font-mono text-center text-text-2">{cur.label}</motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─── Default ──────────────────────────────────────────────────────────────────
const DefaultVis: React.FC<{ topicTitle: string }> = ({ topicTitle }) => (
    <div className="flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-700/30 border border-brand-500/30 flex items-center justify-center text-2xl font-mono text-brand-300">
            {'</>'}
        </div>
        <p className="text-sm font-bold text-white">{topicTitle}</p>
        <p className="text-xs text-text-2 leading-relaxed max-w-[200px]">
            Press ▶ Play to animate, or write your solution and click Run Code.
        </p>
    </div>
);

// ─── Router ───────────────────────────────────────────────────────────────────
export type VisProps = { playing: boolean; speed: number; topicId: string; topicTitle: string };

export const TopicVisualizer: React.FC<VisProps> = ({ playing, speed, topicId, topicTitle }) => {
    if (topicId === 'intro-to-programming')       return <HelloWorldVis   playing={playing} speed={speed} />;
    if (topicId === 'variables-data-types')        return <VariablesVis   playing={playing} speed={speed} />;
    if (topicId === 'control-flow-conditionals' || topicId === 'control-flow--conditionals')   return <ConditionalsVis playing={playing} speed={speed} />;
    if (topicId === 'control-flow-loops' || topicId === 'control-flow--loops')                return <LoopVis        playing={playing} speed={speed} />;
    if (topicId === 'functions-scope')             return <FunctionsVis   playing={playing} speed={speed} />;
    if (topicId === 'recursion')                   return <RecursionVis   playing={playing} speed={speed} />;
    if (topicId === 'pointers-references')         return <PointerVis     playing={playing} speed={speed} />;
    if (topicId === 'linked-lists')                return <LinkedListVis  playing={playing} speed={speed} />;
    if (topicId === 'stack')                       return <StackVis       playing={playing} speed={speed} />;
    if (topicId === 'binary-search-tree')          return <BSTVis         playing={playing} speed={speed} />;
    if (topicId === 'sorting-algorithms')          return <SortingVis     playing={playing} speed={speed} />;
    if (topicId === 'searching-algorithms')        return <BinarySearchVis playing={playing} speed={speed} />;
    return <DefaultVis topicTitle={topicTitle} />;
};
