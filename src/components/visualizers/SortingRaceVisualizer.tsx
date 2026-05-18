import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type BarState = 'unsorted' | 'comparing' | 'swapping' | 'sorted';

interface AlgoState {
    name: string;
    bars: { value: number; state: BarState }[];
    comparisons: number;
    swaps: number;
    done: boolean;
    winner: boolean;
}

const ALGORITHMS = ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort'];

const randomArray = (size: number) =>
    Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const barColor = (state: BarState) => {
    switch (state) {
        case 'comparing': return '#F59E0B';
        case 'swapping': return '#F43F5E';
        case 'sorted': return '#10B981';
        default: return '#2563EB';
    }
};

export const SortingRaceVisualizer: React.FC = () => {
    const [arraySize, setArraySize] = useState(20);
    const [speedMs, setSpeedMs] = useState(60);
    const [algos, setAlgos] = useState<AlgoState[]>([]);
    const [racing, setRacing] = useState(false);
    const [winnerId, setWinnerId] = useState<number | null>(null);
    const stopRef = useRef(false);

    const generateNew = () => {
        const arr = randomArray(arraySize);
        setWinnerId(null);
        setRacing(false);
        stopRef.current = true;
        setTimeout(() => {
            stopRef.current = false;
            setAlgos(ALGORITHMS.map((name) => ({
                name,
                bars: arr.map((v) => ({ value: v, state: 'unsorted' as BarState })),
                comparisons: 0,
                swaps: 0,
                done: false,
                winner: false,
            })));
        }, 50);
    };

    useEffect(() => { generateNew(); }, [arraySize]);

    const updateAlgo = (idx: number, updater: (a: AlgoState) => Partial<AlgoState>) =>
        setAlgos((prev) => prev.map((a, i) => i === idx ? { ...a, ...updater(a) } : a));

    const markDone = (idx: number) => setAlgos((prev) => {
        const updated = prev.map((a, i) => i === idx ? { ...a, done: true, bars: a.bars.map((b) => ({ ...b, state: 'sorted' as BarState })) } : a);
        const doneCount = updated.filter(a => a.done).length;
        if (doneCount === 1) {
            setWinnerId(idx);
            return updated.map((a, i) => i === idx ? { ...a, winner: true } : a);
        }
        return updated;
    });

    const runBubble = async (idx: number, arr: number[]) => {
        const a = [...arr];
        const n = a.length;
        let comps = 0, swps = 0;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (stopRef.current) return;
                comps++;
                updateAlgo(idx, (s) => ({ bars: s.bars.map((b, k) => ({ ...b, state: (k === j || k === j + 1) ? 'comparing' : k >= n - i ? 'sorted' : 'unsorted' as BarState })), comparisons: comps }));
                await sleep(speedMs);
                if (a[j] > a[j + 1]) {
                    [a[j], a[j + 1]] = [a[j + 1], a[j]];
                    swps++;
                    updateAlgo(idx, (s) => ({ bars: a.map((v, k) => ({ value: v, state: (k === j || k === j + 1) ? 'swapping' : k >= n - i ? 'sorted' : 'unsorted' as BarState })), swaps: swps }));
                    await sleep(speedMs);
                }
            }
        }
        markDone(idx);
    };

    const runSelection = async (idx: number, arr: number[]) => {
        const a = [...arr];
        const n = a.length;
        let comps = 0, swps = 0;
        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            for (let j = i + 1; j < n; j++) {
                if (stopRef.current) return;
                comps++;
                updateAlgo(idx, (s) => ({ bars: a.map((v, k) => ({ value: v, state: k === j || k === minIdx ? 'comparing' : k < i ? 'sorted' : 'unsorted' as BarState })), comparisons: comps }));
                await sleep(speedMs);
                if (a[j] < a[minIdx]) minIdx = j;
            }
            if (minIdx !== i) {
                [a[i], a[minIdx]] = [a[minIdx], a[i]];
                swps++;
                updateAlgo(idx, (s) => ({ bars: a.map((v, k) => ({ value: v, state: k === i || k === minIdx ? 'swapping' : k <= i ? 'sorted' : 'unsorted' as BarState })), swaps: swps }));
                await sleep(speedMs);
            }
        }
        markDone(idx);
    };

    const runInsertion = async (idx: number, arr: number[]) => {
        const a = [...arr];
        const n = a.length;
        let comps = 0, swps = 0;
        for (let i = 1; i < n; i++) {
            let j = i;
            while (j > 0 && a[j - 1] > a[j]) {
                if (stopRef.current) return;
                comps++;
                swps++;
                [a[j], a[j - 1]] = [a[j - 1], a[j]];
                updateAlgo(idx, () => ({ bars: a.map((v, k) => ({ value: v, state: k === j || k === j - 1 ? 'swapping' : k < i + 1 ? 'unsorted' : 'unsorted' as BarState })), comparisons: comps, swaps: swps }));
                await sleep(speedMs);
                j--;
            }
        }
        markDone(idx);
    };

    const runMerge = async (idx: number, arr: number[]) => {
        const a = [...arr];
        let comps = 0;
        const merge = async (lo: number, mid: number, hi: number) => {
            const left = a.slice(lo, mid + 1), right = a.slice(mid + 1, hi + 1);
            let i = 0, j = 0, k = lo;
            while (i < left.length && j < right.length) {
                if (stopRef.current) return;
                comps++;
                if (left[i] <= right[j]) { a[k++] = left[i++]; }
                else { a[k++] = right[j++]; }
                updateAlgo(idx, () => ({ bars: a.map((v, x) => ({ value: v, state: x >= lo && x <= hi ? 'comparing' : 'unsorted' as BarState })), comparisons: comps }));
                await sleep(speedMs);
            }
            while (i < left.length) { a[k++] = left[i++]; }
            while (j < right.length) { a[k++] = right[j++]; }
        };
        const mergeSort = async (lo: number, hi: number) => {
            if (lo >= hi) return;
            const mid = Math.floor((lo + hi) / 2);
            await mergeSort(lo, mid);
            await mergeSort(mid + 1, hi);
            await merge(lo, mid, hi);
        };
        await mergeSort(0, a.length - 1);
        if (!stopRef.current) markDone(idx);
    };

    const runQuick = async (idx: number, arr: number[]) => {
        const a = [...arr];
        let comps = 0, swps = 0;
        const partition = async (lo: number, hi: number) => {
            const pivot = a[hi];
            let i = lo - 1;
            for (let j = lo; j < hi; j++) {
                if (stopRef.current) return lo;
                comps++;
                updateAlgo(idx, () => ({ bars: a.map((v, k) => ({ value: v, state: k === hi ? 'comparing' : k === j ? 'comparing' : 'unsorted' as BarState })), comparisons: comps }));
                await sleep(speedMs);
                if (a[j] <= pivot) {
                    i++;
                    [a[i], a[j]] = [a[j], a[i]];
                    swps++;
                    updateAlgo(idx, () => ({ swaps: swps, bars: a.map((v, k) => ({ value: v, state: k === i || k === j ? 'swapping' : 'unsorted' as BarState })) }));
                    await sleep(speedMs);
                }
            }
            [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
            return i + 1;
        };
        const quickSort = async (lo: number, hi: number) => {
            if (lo >= hi || stopRef.current) return;
            const p = await partition(lo, hi);
            await quickSort(lo, p - 1);
            await quickSort(p + 1, hi);
        };
        await quickSort(0, a.length - 1);
        if (!stopRef.current) markDone(idx);
    };

    const startRace = () => {
        if (algos.length === 0) return;
        setRacing(true);
        setWinnerId(null);
        stopRef.current = false;
        const runners = [runBubble, runSelection, runInsertion, runMerge, runQuick];
        algos.forEach((algo, idx) => runners[idx](idx, algo.bars.map((b) => b.value)));
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-center">
                <button onClick={generateNew} className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-800 hover:bg-brand-700 border border-white/10 text-white text-xs font-bold rounded-btn transition-colors">
                    🎲 New Array
                </button>
                <div className="flex items-center gap-2 text-xs text-text-2">
                    <span>Size:</span>
                    <input type="range" min={8} max={40} value={arraySize} onChange={(e) => setArraySize(+e.target.value)} className="w-24 accent-brand-500" />
                    <span className="text-white font-mono w-4">{arraySize}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-2">
                    <span>Speed:</span>
                    <input type="range" min={10} max={200} value={210 - speedMs} onChange={(e) => setSpeedMs(210 - +e.target.value)} className="w-24 accent-brand-500" />
                </div>
                <button
                    onClick={startRace}
                    disabled={racing}
                    className="flex items-center gap-2 px-5 py-2 rounded-btn text-sm font-bold text-white bg-gradient-to-r from-brand-500 to-purple hover:shadow-glow transition-all disabled:opacity-40"
                >
                    🏁 {racing ? 'Racing...' : 'Start Race!'}
                </button>
            </div>

            {/* Charts */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                {algos.map((algo, idx) => (
                    <div key={algo.name} className="flex-1 min-w-[140px] flex flex-col gap-2 relative">
                        {/* Winner crown */}
                        <AnimatePresence>
                            {algo.winner && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.5 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className="absolute -top-7 left-1/2 -translate-x-1/2 text-2xl z-10 select-none"
                                >
                                    👑
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div
                            className="flex items-end gap-px rounded-card overflow-hidden border border-white/5"
                            style={{ background: '#080C10', height: 120, padding: '4px 6px' }}
                        >
                            {algo.bars.map((bar, i) => (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        height: `${bar.value}%`,
                                        background: barColor(bar.state),
                                        borderRadius: '2px 2px 0 0',
                                        transition: 'height 0.08s ease, background 0.1s ease',
                                        boxShadow: bar.state === 'comparing' ? '0 0 6px #F59E0B' : bar.state === 'swapping' ? '0 0 6px #F43F5E' : 'none',
                                    }}
                                />
                            ))}
                        </div>

                        <div className="text-center">
                            <p className={`text-xs font-bold ${algo.winner ? 'text-amber' : 'text-white'}`}>{algo.name}</p>
                            <p className="text-[10px] text-text-2 font-mono mt-0.5">
                                C: <span className="text-brand-300">{algo.comparisons}</span>  S: <span className="text-rose">{algo.swaps}</span>
                            </p>
                            {algo.done && <p className="text-[10px] text-green font-bold">✓ Done</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
