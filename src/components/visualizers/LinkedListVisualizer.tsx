import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LLNode {
    id: string;
    value: number;
    addr: string;
    state: 'default' | 'active' | 'visited' | 'deleting' | 'found';
}

const randomAddr = () => '0x' + Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0').toUpperCase();

const FILL: Record<LLNode['state'], string> = {
    default: '#1E293B',
    active: '#2563EB',
    visited: '#10B981',
    found: '#1B3A6B',
    deleting: '#F43F5E',
};
const STROKE: Record<LLNode['state'], string> = {
    default: '#334155',
    active: '#93C5FD',
    visited: '#10B981',
    found: '#93C5FD',
    deleting: '#F43F5E',
};
const GLOW: Record<LLNode['state'], string> = {
    default: 'none',
    active: 'drop-shadow(0 0 8px rgba(37,99,235,0.7))',
    visited: 'drop-shadow(0 0 6px rgba(16,185,129,0.5))',
    found: 'drop-shadow(0 0 10px rgba(147,197,253,0.6))',
    deleting: 'drop-shadow(0 0 8px rgba(244,63,94,0.6))',
};

const NODE_W = 100, NODE_H = 48, GAP = 36, START_X = 20, Y = 96;

export const LinkedListVisualizer: React.FC<{ isPlaying?: boolean; speed?: number }> = ({
    isPlaying = false, speed = 1,
}) => {
    const [nodes, setNodes] = useState<LLNode[]>([]);
    const [demoStep, setDemoStep] = useState(0);
    const [log, setLog] = useState<string[]>([]);
    const [inputVal, setInputVal] = useState('');
    const demoRef = useRef(isPlaying);
    demoRef.current = isPlaying;

    const ms = (base: number) => base / speed;

    const addToLog = (msg: string) => setLog((l) => [msg, ...l.slice(0, 4)]);

    const insertTail = async (value: number) => {
        const newNode: LLNode = { id: `${Date.now()}-${Math.random()}`, value, addr: randomAddr(), state: 'default' };
        addToLog(`Inserted ${value} at tail`);
        setNodes((prev) => [...prev, newNode]);
        await new Promise<void>((r) => setTimeout(r, ms(500)));
    };

    const insertHead = async (value: number) => {
        const newNode: LLNode = { id: `${Date.now()}-${Math.random()}`, value, addr: randomAddr(), state: 'default' };
        addToLog(`Inserted ${value} at head`);
        setNodes((prev) => [newNode, ...prev]);
        await new Promise<void>((r) => setTimeout(r, ms(500)));
    };

    const search = async (value: number) => {
        addToLog(`Searching for ${value}…`);
        setNodes((n) => n.map((nd) => ({ ...nd, state: 'default' })));
        // read current length snapshot
        const snap = [...(await new Promise<LLNode[]>((r) => { setNodes((n) => { r(n); return n; }); }))]
        for (let i = 0; i < snap.length; i++) {
            setNodes((n) => n.map((nd, idx) => ({
                ...nd,
                state: idx === i ? 'active' : idx < i ? 'visited' : 'default',
            })));
            await new Promise<void>((r) => setTimeout(r, ms(320)));
            if (snap[i].value === value) {
                setNodes((n) => n.map((nd, idx) => ({ ...nd, state: idx === i ? 'found' : nd.state })));
                addToLog(`Found ${value} at position ${i}!`);
                return;
            }
        }
        addToLog(`${value} not found`);
    };

    const deleteNode = async (value: number) => {
        setNodes((n) => {
            const idx = n.findIndex((nd) => nd.value === value);
            if (idx === -1) return n;
            addToLog(`Deleting node ${value}`);
            return n.map((nd, i) => ({ ...nd, state: i === idx ? 'deleting' : 'default' }));
        });
        await new Promise<void>((r) => setTimeout(r, ms(600)));
        setNodes((n) => n.filter((nd) => nd.state !== 'deleting'));
    };

    const traverse = async () => {
        addToLog('Traversing list…');
        const snap = [...(await new Promise<LLNode[]>((r) => { setNodes((n) => { r(n); return n; }); }))];
        for (let i = 0; i < snap.length; i++) {
            setNodes((n) => n.map((nd, idx) => ({ ...nd, state: idx === i ? 'active' : idx < i ? 'visited' : 'default' })));
            await new Promise<void>((r) => setTimeout(r, ms(300)));
        }
        addToLog('Traversal complete!');
        await new Promise<void>((r) => setTimeout(r, ms(400)));
        setNodes((n) => n.map((nd) => ({ ...nd, state: 'default' })));
    };

    const DEMO = [
        { op: insertTail, value: 10 },
        { op: insertTail, value: 20 },
        { op: insertTail, value: 30 },
        { op: insertHead, value: 5 },
        { op: search, value: 20 },
        { op: deleteNode, value: 10 },
        { op: traverse, value: 0 },
    ];

    useEffect(() => {
        if (!isPlaying) return;
        if (demoStep >= DEMO.length) return;
        const run = async () => {
            await DEMO[demoStep].op(DEMO[demoStep].value);
            if (demoRef.current) setDemoStep((s) => s + 1);
        };
        run();
    }, [isPlaying, demoStep]);

    const totalWidth = Math.max(560, nodes.length * (NODE_W + GAP) + START_X + 60);

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Interactive controls */}
            <div className="flex flex-wrap gap-2">
                <input type="number" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { insertTail(+inputVal); setInputVal(''); } }}
                    placeholder="Value"
                    className="w-24 bg-brand-800 border border-borderAdaptive/10 rounded-input px-3 py-1.5 text-sm text-text-1 font-mono focus:outline-none focus:border-brand-500 transition-colors" />
                <button onClick={() => { if (inputVal) { insertTail(+inputVal); setInputVal(''); } }}
                    className="px-3 py-1.5 bg-brand-500 hover:bg-brand-500/80 text-white text-xs font-bold rounded-btn transition-all active:scale-95">
                    + Tail
                </button>
                <button onClick={() => { if (inputVal) { insertHead(+inputVal); setInputVal(''); } }}
                    className="px-3 py-1.5 bg-purple/80 hover:bg-purple text-text-1 text-xs font-bold rounded-btn transition-all active:scale-95">
                    + Head
                </button>
                <button onClick={() => { if (inputVal) { search(+inputVal); setInputVal(''); } }}
                    className="px-3 py-1.5 bg-amber/20 hover:bg-amber/30 text-amber text-xs font-bold rounded-btn border border-amber/20 transition-all active:scale-95">
                    Search
                </button>
                <button onClick={() => { if (inputVal) { deleteNode(+inputVal); setInputVal(''); } }}
                    className="px-3 py-1.5 bg-rose/20 hover:bg-rose/30 text-rose text-xs font-bold rounded-btn border border-rose/20 transition-all active:scale-95">
                    Delete
                </button>
                <button onClick={traverse}
                    className="px-3 py-1.5 bg-green/20 hover:bg-green/30 text-green text-xs font-bold rounded-btn border border-green/20 transition-all active:scale-95">
                    Traverse
                </button>
                <button onClick={() => { setNodes([]); setLog([]); }}
                    className="px-3 py-1.5 bg-borderAdaptive/5 hover:bg-borderAdaptive/10 text-text-2 text-xs font-bold rounded-btn border border-borderAdaptive/10 transition-all active:scale-95 ml-auto">
                    Clear
                </button>
            </div>

            {/* SVG Canvas */}
            <div className="w-full rounded-card overflow-x-auto border border-borderAdaptive/5 custom-scrollbar" style={{ background: '#080C10' }}>
                <svg width={totalWidth} height={200} style={{ display: 'block' }}>
                    <defs>
                        <marker id="ll-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                            <polygon points="0 0, 8 3, 0 6" fill="#F59E0B" />
                        </marker>
                    </defs>

                    <AnimatePresence>
                        {nodes.map((node, i) => {
                            const x = START_X + i * (NODE_W + GAP);
                            const nextNode = nodes[i + 1];
                            return (
                                <motion.g
                                    key={node.id}
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{
                                        opacity: node.state === 'deleting' ? 0 : 1,
                                        scale: node.state === 'deleting' ? 0.3 : 1,
                                    }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                                    style={{ transformOrigin: `${x + NODE_W / 2}px ${Y + NODE_H / 2}px` }}
                                >
                                    {/* Address label */}
                                    <text x={x + 4} y={Y - 12} fill="#64748B" fontSize={9} fontFamily="'Fira Code', monospace">
                                        {node.addr}
                                    </text>

                                    {/* Main rect */}
                                    <rect x={x} y={Y} width={NODE_W} height={NODE_H} rx={7}
                                        fill={FILL[node.state]}
                                        stroke={STROKE[node.state]}
                                        strokeWidth={node.state !== 'default' ? 2 : 1.5}
                                        style={{ filter: GLOW[node.state], transition: 'fill 0.2s ease, stroke 0.2s ease, filter 0.2s ease' }}
                                    />

                                    {/* Divider */}
                                    <line x1={x + 70} y1={Y + 1} x2={x + 70} y2={Y + NODE_H - 1} stroke="#334155" strokeWidth={1} />

                                    {/* Value */}
                                    <text x={x + 35} y={Y + NODE_H / 2 + 5}
                                        textAnchor="middle" fill="white" fontSize={15} fontWeight="bold"
                                        fontFamily="'Fira Code', monospace">
                                        {node.value}
                                    </text>

                                    {/* Pointer symbol */}
                                    <text x={x + 85} y={Y + NODE_H / 2 + 6}
                                        textAnchor="middle" fill={nextNode ? '#F59E0B' : '#475569'} fontSize={15}
                                        fontFamily="'Fira Code', monospace">
                                        {nextNode ? '→' : '∅'}
                                    </text>

                                    {/* Arrow to next node */}
                                    {nextNode && (
                                        <motion.line
                                            x1={x + NODE_W} y1={Y + NODE_H / 2}
                                            x2={x + NODE_W + GAP} y2={Y + NODE_H / 2}
                                            stroke="#F59E0B" strokeWidth={2}
                                            markerEnd="url(#ll-arrow)"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            transition={{ delay: 0.15, duration: 0.3 }}
                                        />
                                    )}
                                </motion.g>
                            );
                        })}
                    </AnimatePresence>

                    {nodes.length === 0 && (
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
                            fill="#475569" fontSize={13} fontFamily="Inter, sans-serif">
                            No nodes yet — insert some values above
                        </text>
                    )}
                </svg>
            </div>

            {/* Memory table */}
            {nodes.length > 0 && (
                <div className="glass rounded-card p-3 border border-borderAdaptive/5 overflow-hidden">
                    <p className="text-[10px] uppercase tracking-widest text-text-2 font-bold mb-2">Memory View</p>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-xs font-mono text-text-2 border-collapse">
                            <thead>
                                <tr className="text-[10px] uppercase text-text-2">
                                    <th className="text-left pb-1.5 pr-6">Address</th>
                                    <th className="text-left pb-1.5 pr-6">Value</th>
                                    <th className="text-left pb-1.5">Next →</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {nodes.map((n, i) => (
                                        <motion.tr key={n.id}
                                            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                                            className={cn('transition-colors duration-200',
                                                n.state === 'active' || n.state === 'found' ? 'text-brand-300' : '',
                                                n.state === 'deleting' ? 'text-rose line-through' : '',
                                                n.state === 'visited' ? 'text-green' : '',
                                            )}>
                                            <td className="pr-6 py-0.5">{n.addr}</td>
                                            <td className="pr-6 py-0.5">{n.value}</td>
                                            <td className="py-0.5">{nodes[i + 1]?.addr ?? 'NULL'}</td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Operation log */}
            {log.length > 0 && (
                <div className="text-xs font-mono text-text-2 px-1 space-y-0.5">
                    {log.map((entry, i) => (
                        <motion.p key={`${i}-${entry}`}
                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1 - i * 0.18, y: 0 }}
                            className={cn(i === 0 ? 'text-brand-300 font-medium' : '')}>
                            {'>'} {entry}
                        </motion.p>
                    ))}
                </div>
            )}
        </div>
    );
};
