import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BSTNode {
    value: number;
    left?: BSTNode;
    right?: BSTNode;
}

type NodeState = Record<number, 'default' | 'active' | 'visited' | 'found' | 'inserting'>;

const insert = (root: BSTNode | undefined, value: number): BSTNode => {
    if (!root) return { value };
    if (value < root.value) return { ...root, left: insert(root.left, value) };
    if (value > root.value) return { ...root, right: insert(root.right, value) };
    return root;
};

interface NodePos { x: number; y: number; parentX?: number; parentY?: number }
const calcPositions = (
    node: BSTNode | undefined, x: number, y: number, spread: number,
    result: Map<number, NodePos>, parentX?: number, parentY?: number,
) => {
    if (!node) return;
    result.set(node.value, { x, y, parentX, parentY });
    calcPositions(node.left, x - spread, y + 76, spread / 2, result, x, y);
    calcPositions(node.right, x + spread, y + 76, spread / 2, result, x, y);
};

const INITIAL_VALUES = [50, 30, 70, 20, 40, 60, 80];
const R = 26;

// Animated SVG line that draws itself using stroke-dashoffset
const AnimatedEdge: React.FC<{
    x1: number; y1: number; x2: number; y2: number;
    stroke: string; strokeWidth: number;
}> = ({ x1, y1, x2, y2, stroke, strokeWidth }) => {
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return (
        <motion.line
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={length}
            initial={{ strokeDashoffset: length, opacity: 0 }}
            animate={{ strokeDashoffset: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        />
    );
};

export const BSTVisualizer: React.FC = () => {
    const buildInitial = () => {
        let root: BSTNode | undefined;
        INITIAL_VALUES.forEach((v) => (root = insert(root, v)));
        return root;
    };

    const [tree, setTree] = useState<BSTNode | undefined>(buildInitial);
    const [states, setStates] = useState<NodeState>({});
    const [inputVal, setInputVal] = useState('');
    const [traversalResult, setTraversalResult] = useState<number[]>([]);
    const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');

    const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    const handleInsert = async () => {
        const v = parseInt(inputVal);
        if (isNaN(v) || v < 0 || v > 999) return;
        setInputVal('');
        setStates((s) => ({ ...s, [v]: 'inserting' }));
        setTree((t) => insert(t, v));
        await delay(800);
        setStates((s) => ({ ...s, [v]: 'default' }));
    };

    const handleSearch = async () => {
        const v = parseInt(inputVal);
        if (isNaN(v)) return;
        setInputVal('');
        setStates({});
        let cur = tree;
        while (cur) {
            const cv = cur.value;
            setStates((s) => ({ ...s, [cv]: 'active' }));
            await delay(550);
            if (cv === v) { setStates((s) => ({ ...s, [v]: 'found' })); break; }
            setStates((s) => ({ ...s, [cv]: 'visited' }));
            cur = v < cv ? cur.left : cur.right;
        }
    };

    const traverse = (node: BSTNode | undefined, type: string, acc: number[]): number[] => {
        if (!node) return acc;
        if (type === 'preorder') acc.push(node.value);
        traverse(node.left, type, acc);
        if (type === 'inorder') acc.push(node.value);
        traverse(node.right, type, acc);
        if (type === 'postorder') acc.push(node.value);
        return acc;
    };

    const handleTraverse = async () => {
        setStates({}); setTraversalResult([]);
        const nodes = traverse(tree, traversalType, []);
        for (const v of nodes) {
            setStates((s) => ({ ...s, [v]: 'active' }));
            setTraversalResult((r) => [...r, v]);
            await delay(420);
            setStates((s) => ({ ...s, [v]: 'visited' }));
        }
    };

    const positions = new Map<number, NodePos>();
    calcPositions(tree, 280, 44, 130, positions);

    const nodeColor = (state: string) => {
        switch (state) {
            case 'active': return '#2563EB';
            case 'inserting': return '#8B5CF6';
            case 'visited': return '#10B981';
            case 'found': return '#F59E0B';
            default: return '#1E293B';
        }
    };
    const nodeGlow = (state: string) => {
        if (state === 'active') return 'drop-shadow(0 0 10px rgba(37,99,235,0.7))';
        if (state === 'found') return 'drop-shadow(0 0 10px rgba(245,158,11,0.7))';
        if (state === 'inserting') return 'drop-shadow(0 0 10px rgba(139,92,246,0.7))';
        return 'none';
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Controls */}
            <div className="flex flex-wrap gap-2 items-center">
                <input type="number" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleInsert(); }}
                    placeholder="Value (0–999)"
                    className="w-28 bg-brand-800 border border-borderAdaptive/10 rounded-input px-3 py-1.5 text-sm text-text-1 font-mono focus:outline-none focus:border-brand-500 transition-colors" />
                <button onClick={handleInsert}
                    className="px-3 py-1.5 bg-brand-500 hover:bg-brand-500/80 text-white text-xs font-bold rounded-btn transition-all active:scale-95">
                    Insert
                </button>
                <button onClick={handleSearch}
                    className="px-3 py-1.5 bg-amber/20 hover:bg-amber/30 text-amber text-xs font-bold rounded-btn border border-amber/20 transition-all active:scale-95">
                    Search
                </button>
                <select value={traversalType} onChange={(e) => setTraversalType(e.target.value as 'inorder' | 'preorder' | 'postorder')}
                    className="bg-brand-800 border border-borderAdaptive/10 rounded-input px-2 py-1.5 text-xs text-text-2 focus:outline-none">
                    <option value="inorder">Inorder</option>
                    <option value="preorder">Preorder</option>
                    <option value="postorder">Postorder</option>
                </select>
                <button onClick={handleTraverse}
                    className="px-3 py-1.5 bg-green/20 hover:bg-green/30 text-green text-xs font-bold rounded-btn border border-green/20 transition-all active:scale-95">
                    Traverse
                </button>
                <button onClick={() => { setTree(buildInitial()); setStates({}); setTraversalResult([]); setInputVal(''); }}
                    className="px-3 py-1.5 bg-borderAdaptive/5 hover:bg-borderAdaptive/10 text-text-2 text-xs font-bold rounded-btn border border-borderAdaptive/10 transition-all active:scale-95 ml-auto">
                    Reset
                </button>
            </div>

            {/* SVG Tree */}
            <div className="rounded-card overflow-hidden border border-borderAdaptive/5" style={{ background: '#080C10', minHeight: 300 }}>
                <svg width="100%" height={300} viewBox="0 0 560 300" style={{ overflow: 'visible' }}>
                    {/* Render edges first (below nodes) */}
                    <AnimatePresence>
                        {Array.from(positions.entries()).map(([val, pos]) => {
                            if (pos.parentX === undefined || pos.parentY === undefined) return null;
                            const state = states[val] ?? 'default';
                            const edgeColor = state === 'active' ? '#F59E0B' : state === 'visited' ? '#10B981' : '#334155';
                            return (
                                <AnimatedEdge
                                    key={`edge-${val}`}
                                    x1={pos.parentX} y1={pos.parentY + R}
                                    x2={pos.x} y2={pos.y - R}
                                    stroke={edgeColor}
                                    strokeWidth={state === 'active' ? 2.5 : 1.5}
                                />
                            );
                        })}
                    </AnimatePresence>

                    {/* Nodes — using SVG transforms so y doesn't break parent coordinate space */}
                    <AnimatePresence>
                        {Array.from(positions.entries()).map(([val, pos]) => {
                            const state = states[val] ?? 'default';
                            return (
                                <motion.g
                                    key={`node-${val}`}
                                    initial={{ opacity: 0, scale: 0.4 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                                    style={{ originX: pos.x, originY: pos.y }}
                                    // Use SVG translateX/Y via transform instead of x/y to avoid layout issues
                                    transform={`translate(0,0)`}
                                >
                                    <circle
                                        cx={pos.x} cy={pos.y} r={R}
                                        fill={nodeColor(state)}
                                        stroke={state !== 'default' ? 'rgba(255,255,255,0.3)' : '#334155'}
                                        strokeWidth={state !== 'default' ? 2.5 : 1.5}
                                        style={{ filter: nodeGlow(state), transition: 'fill 0.25s ease, filter 0.25s ease' }}
                                    />
                                    <text x={pos.x} y={pos.y + 5} textAnchor="middle"
                                        fill="white" fontSize={13} fontWeight="bold"
                                        fontFamily="'Fira Code', monospace" pointerEvents="none">
                                        {val}
                                    </text>
                                </motion.g>
                            );
                        })}
                    </AnimatePresence>
                </svg>
            </div>

            {/* Traversal result */}
            {traversalResult.length > 0 && (
                <div className="glass rounded-card px-4 py-2.5 border border-borderAdaptive/5 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-medium text-text-2 font-mono mr-2 capitalize">{traversalType}:</span>
                    <AnimatePresence>
                        {traversalResult.map((v, i) => (
                            <motion.span key={`${v}-${i}`}
                                initial={{ opacity: 0, y: 8, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 300, delay: 0 }}
                                className="px-2 py-0.5 bg-brand-700 text-text-1 text-xs font-mono rounded border border-brand-500/30">
                                {v}
                            </motion.span>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};
