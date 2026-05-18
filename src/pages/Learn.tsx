import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, ChevronLeft, Eye, CheckCircle2, ChevronRight, XCircle, FastForward, Rewind, SkipBack, SkipForward, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { GradientText } from '../components/GradientText';
import { topics } from '../data/topics';
import { getTopicContent } from '../data/topicContent';
import type { LangKey } from '../data/topicContent';
import { TopicVisualizer } from '../components/visualizers/TopicVisualizer';

const LANGS: LangKey[] = ['C++', 'Java', 'Python', 'C'];
const TABS = ['Theory', 'Hints', 'Challenge'];
const SPEEDS = ['0.5x', '1x', '2x', '4x'];

const monacoLang = (l: LangKey) => {
    if (l === 'C++') return 'cpp';
    if (l === 'C') return 'c';
    return l.toLowerCase();
};

interface TestResult {
    label: string;
    passed: boolean;
    failedCase?: string;
}

export const Learn = () => {
    const { mod, topic } = useParams();
    const [activeLang, setActiveLang] = useState<LangKey>('Python');
    const [activeTab, setActiveTab] = useState('Theory');
    const [hintsRevealed, setHintsRevealed] = useState<number[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [testResults, setTestResults] = useState<TestResult[] | null>(null);
    const [speed, setSpeed] = useState('1x');
    const speedNum = parseFloat(speed) || 1;
    const [status, setStatus] = useState<'Idle' | 'Running' | 'Done'>('Idle');
    const [code, setCode] = useState<Record<LangKey, string | null>>({ 'C++': null, Java: null, Python: null, C: null });
    const [visPlaying, setVisPlaying] = useState(false);

    // Resolve topic data
    const topicData = useMemo(() => topics.find(t => t.id === topic), [topic]);
    const content = useMemo(() => getTopicContent(topic ?? ''), [topic]);

    // Module topics for progress
    const moduleTopics = useMemo(() => topics.filter(t => t.moduleId === mod), [mod]);
    const topicIndex = useMemo(() => moduleTopics.findIndex(t => t.id === topic), [moduleTopics, topic]);

    const getCode = (lang: LangKey) => code[lang] ?? content.starterCode[lang];

    const handleLangSwitch = (l: LangKey) => {
        setActiveLang(l);
        setTestResults(null);
    };

    const handleRun = () => {
        setStatus('Running');
        setVisPlaying(true);
        setTimeout(() => setStatus('Done'), 2000);
    };

    const handleReset = () => {
        setCode(prev => ({ ...prev, [activeLang]: content.starterCode[activeLang] }));
        setStatus('Idle');
        setTestResults(null);
        setVisPlaying(false);
    };

    const handleSubmit = () => {
        setSubmitting(true);
        setTestResults(null);

        // Simulate a brief "compiling" delay then validate
        setTimeout(() => {
            const userCode = getCode(activeLang);
            const validation = content.validate(userCode, activeLang);

            // Run each test case through the same validator
            const results: TestResult[] = content.testCases.map(tc => {
                const r = content.validate(userCode, activeLang);
                return { label: tc.label, passed: r.passed, failedCase: r.failedCase };
            });

            // If overall validation fails, mark all as failed with the reason
            if (!validation.passed) {
                setTestResults(results.map(r => ({ ...r, passed: false, failedCase: validation.failedCase })));
            } else {
                setTestResults(results.map(r => ({ ...r, passed: true })));
            }

            setSubmitting(false);
        }, 1200);
    };

    const allPassed = testResults !== null && testResults.every(r => r.passed);

    return (
        <div className="h-[calc(100vh-64px)] w-full bg-[#0D1117] flex flex-col overflow-hidden text-text-1">
            {/* TOP BAR */}
            <header className="h-10 shrink-0 border-b border-white/5 flex items-center justify-between px-4 bg-brand-900/50">
                <div className="flex items-center gap-4 text-sm font-medium">
                    <Link to="/courses" className="flex items-center gap-1 text-text-2 hover:text-white transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Back to Courses
                    </Link>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2 text-text-2">
                        <span className="capitalize">{topicData?.moduleName ?? mod?.replace(/-/g, ' ')}</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-white capitalize">{topicData?.title ?? topic?.replace(/-/g, ' ')}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-text-2 font-medium">
                        Topic {topicIndex + 1} of {moduleTopics.length}
                    </span>
                    <div className="w-24 h-1.5 bg-brand-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-brand-500 to-purple"
                            style={{ width: `${moduleTopics.length ? ((topicIndex + 1) / moduleTopics.length) * 100 : 0}%` }}
                        />
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <div className="flex-1 min-h-0">
                <PanelGroup direction="horizontal">

                    {/* LEFT PANEL: EDITOR */}
                    <Panel defaultSize={28} minSize={20} className="flex flex-col bg-[#0D1117] relative">
                        <div className="flex items-center gap-1 p-2 border-b border-white/5 overflow-x-auto hide-scrollbar">
                            {LANGS.map(l => (
                                <button
                                    key={l}
                                    onClick={() => handleLangSwitch(l)}
                                    className={cn(
                                        "px-3 py-1 text-xs font-mono rounded-full transition-all relative whitespace-nowrap",
                                        activeLang === l ? "text-white" : "text-text-2 hover:text-white"
                                    )}
                                >
                                    {activeLang === l && (
                                        <motion.div layoutId="lang-tab" className="absolute inset-0 bg-brand-700/80 rounded-full -z-10 border border-white/10" />
                                    )}
                                    {l}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeLang}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                                    className="absolute inset-0 pt-4"
                                >
                                    <Editor
                                        height="100%"
                                        theme="vs-dark"
                                        language={monacoLang(activeLang)}
                                        value={getCode(activeLang)}
                                        onChange={(v) => setCode(prev => ({ ...prev, [activeLang]: v ?? '' }))}
                                        options={{
                                            fontFamily: '"Fira Code", monospace',
                                            fontSize: 13,
                                            lineHeight: 1.7,
                                            minimap: { enabled: false },
                                            scrollBeyondLastLine: false,
                                            smoothScrolling: true,
                                            padding: { top: 16 },
                                            renderLineHighlight: 'none',
                                        }}
                                    />
                                    {status === 'Running' && (
                                        <div className="absolute top-[86px] left-0 w-full h-[22px] bg-amber/10 border-l-4 border-amber pointer-events-none z-10" />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="p-3 border-t border-white/5 flex items-center gap-3 bg-[#0D1117]">
                            <button onClick={handleRun} className="flex-1 bg-gradient-to-r from-green to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold py-2 rounded-btn flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98]">
                                <Play className="w-4 h-4 fill-white" /> Run Code
                            </button>
                            <button onClick={handleReset} className="px-4 py-2 rounded-btn font-medium text-text-2 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2 focus:outline-none">
                                <RotateCcw className="w-4 h-4" /> Reset
                            </button>
                        </div>
                    </Panel>

                    <VerticalResizeHandle />

                    {/* CENTER PANEL: VISUALIZATION */}
                    <Panel defaultSize={44} minSize={30} className="flex flex-col relative overflow-hidden bg-[#080C10]">
                        <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

                        <div className="p-4 relative z-10">
                            <h2 className="text-white text-xl font-bold tracking-tight bg-brand-900/50 inline-block px-3 py-1 rounded backdrop-blur-md border border-white/5">
                                {topicData?.title ?? topic?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            </h2>
                        </div>

                        {/* Topic-specific animation */}
                        <div className="flex-1 flex items-center justify-center relative z-10 px-4 pb-24">
                            <TopicVisualizer
                                topicId={topic ?? ''}
                                topicTitle={topicData?.title ?? ''}
                                playing={visPlaying}
                                speed={speedNum}
                            />
                        </div>

                        {/* Playback Controls */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass rounded-full px-5 py-2.5 flex items-center justify-center gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 z-20 w-[90%] max-w-lg">
                            <div className="absolute -top-[13px] left-0 w-full h-[2px] bg-brand-800 rounded-full overflow-hidden">
                                <motion.div className="h-full bg-brand-500"
                                    animate={{ width: visPlaying ? '100%' : '0%' }}
                                    transition={{ duration: visPlaying ? 30 / speedNum : 0, ease: 'linear' }} />
                            </div>

                            <div className="flex gap-1">
                                <button onClick={() => { setVisPlaying(false); }} className="text-text-2 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all active:scale-90">
                                    <SkipBack className="w-4 h-4" />
                                </button>
                                <button onClick={() => setVisPlaying(false)} className="text-text-2 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all active:scale-90">
                                    <Rewind className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setVisPlaying(p => !p)}
                                    className="text-white bg-brand-600 hover:bg-brand-500 p-2 rounded-full transition-all active:scale-90 mx-1"
                                >
                                    {visPlaying
                                        ? <Pause className="w-4 h-4 fill-white" />
                                        : <Play className="w-4 h-4 fill-white" />
                                    }
                                </button>
                                <button onClick={() => setVisPlaying(true)} className="text-text-2 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all active:scale-90">
                                    <FastForward className="w-4 h-4" />
                                </button>
                                <button onClick={() => setVisPlaying(true)} className="text-text-2 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all active:scale-90">
                                    <SkipForward className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="w-px h-5 bg-white/10" />

                            <div className="flex bg-brand-900 rounded-full p-0.5 border border-white/5 relative">
                                {SPEEDS.map(s => (
                                    <button key={s} onClick={() => setSpeed(s)} className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full relative z-10 transition-colors", speed === s ? "text-white" : "text-text-2 hover:text-white")}>
                                        {speed === s && <motion.div layoutId="speed-pill" className="absolute inset-0 bg-brand-700/80 rounded-full -z-10" />}
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Panel>

                    <VerticalResizeHandle />

                    {/* RIGHT PANEL: INFO + CHALLENGE */}
                    <Panel defaultSize={28} minSize={20} className="flex flex-col bg-[#0D1117] border-l border-white/5">
                        <div className="flex items-center gap-1 p-2 border-b border-white/5">
                            {TABS.map(t => (
                                <button
                                    key={t}
                                    onClick={() => setActiveTab(t)}
                                    className={cn(
                                        "flex-1 py-1.5 text-xs font-medium rounded transition-all relative text-center",
                                        activeTab === t ? "text-white bg-white/5" : "text-text-2 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {activeTab === t && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-cta-gradient rounded-t-full" />}
                                    {t}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                                >
                                    {activeTab === 'Theory' && (
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="text-2xl font-bold tracking-tight mb-2">
                                                    <GradientText>{topicData?.title ?? 'Topic'}</GradientText>
                                                </h2>
                                                <p className="text-sm text-text-2 leading-relaxed">{content.theory.description}</p>
                                            </div>

                                            <div className="pl-4 border-l-4 border-brand-500 py-1 bg-brand-500/5 rounded-r">
                                                <h4 className="text-sm font-bold text-brand-300 mb-1">Time Complexity</h4>
                                                <p className="text-xs text-text-2 font-mono"><span className="text-white">{content.theory.timeComplexity}</span></p>
                                            </div>

                                            <div className="pl-4 border-l-4 border-amber py-1 bg-amber/5 rounded-r">
                                                <h4 className="text-sm font-bold text-amber mb-1">Space Complexity</h4>
                                                <p className="text-xs text-text-2 font-mono"><span className="text-white">{content.theory.spaceComplexity}</span></p>
                                            </div>

                                            <div>
                                                <h3 className="text-white font-bold mb-3">How it works</h3>
                                                <p className="text-sm text-text-2 leading-relaxed">{content.theory.howItWorks}</p>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'Hints' && (
                                        <div className="space-y-4">
                                            <p className="text-sm text-text-2 mb-4">Stuck? Reveal hints progressively.</p>
                                            {content.hints.map((hint, i) => (
                                                <div key={i} className="border border-white/10 rounded-card overflow-hidden bg-brand-900/50">
                                                    {hintsRevealed.includes(i) ? (
                                                        <div className="p-4 text-sm text-text-2 leading-relaxed">{hint}</div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setHintsRevealed(p => [...p, i])}
                                                            className="w-full p-4 flex items-center justify-between text-sm font-bold text-brand-300 hover:bg-brand-800 transition-colors"
                                                        >
                                                            Reveal Hint {i + 1} <Eye className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'Challenge' && (
                                        <div className="space-y-5">
                                            <div className="glass p-4 rounded-card border border-brand-500/20 bg-brand-500/5">
                                                <h3 className="font-bold text-white mb-2">Problem Statement</h3>
                                                <p className="text-sm text-text-2 leading-relaxed">{content.challenge.statement}</p>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-bold text-brand-300 mb-2">Example</h4>
                                                <div className="bg-[#080C10] border border-white/5 p-3 rounded text-xs font-mono text-text-2">
                                                    <p><span className="text-white">Input:</span> {content.challenge.example.input}</p>
                                                    <p><span className="text-white">Output:</span> {content.challenge.example.output}</p>
                                                </div>
                                            </div>

                                            {/* Test Cases */}
                                            <div>
                                                <h4 className="text-sm font-bold text-text-2 mb-2">Test Cases ({content.testCases.length})</h4>
                                                <div className="space-y-1.5">
                                                    {content.testCases.map((tc, i) => {
                                                        const result = testResults?.[i];
                                                        return (
                                                            <div key={i} className={cn(
                                                                "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono transition-all",
                                                                result === undefined
                                                                    ? "bg-brand-900/40 border-white/5 text-text-2"
                                                                    : result.passed
                                                                        ? "bg-green/10 border-green/30 text-green"
                                                                        : "bg-rose/10 border-rose/30 text-rose"
                                                            )}>
                                                                {result === undefined
                                                                    ? <span className="w-3 h-3 rounded-full border border-white/20 inline-block flex-shrink-0" />
                                                                    : result.passed
                                                                        ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                                                                        : <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                                                }
                                                                <span className="flex-1 truncate">{tc.label}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleSubmit}
                                                disabled={submitting}
                                                className="w-full bg-cta-gradient py-3 rounded-btn text-white font-bold tracking-wide hover:shadow-glow transition-shadow disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center gap-2"
                                            >
                                                {submitting ? (
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : 'Submit Solution'}
                                            </button>

                                            {/* Overall result banner */}
                                            <AnimatePresence>
                                                {testResults !== null && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                        className={cn(
                                                            "p-3 rounded-lg flex items-start gap-3 text-sm font-bold border",
                                                            allPassed
                                                                ? "bg-green/10 text-green border-green/30"
                                                                : "bg-rose/10 text-rose border-rose/30"
                                                        )}
                                                    >
                                                        {allPassed
                                                            ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                                            : <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                                        }
                                                        <div>
                                                            <p>{allPassed ? 'All test cases passed!' : 'Some test cases failed.'}</p>
                                                            {!allPassed && testResults.find(r => !r.passed)?.failedCase && (
                                                                <p className="text-xs font-normal mt-1 opacity-80">
                                                                    {testResults.find(r => !r.passed)?.failedCase}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </Panel>

                </PanelGroup>
            </div>

            {/* BOTTOM STATUS BAR */}
            <footer className="h-9 shrink-0 bg-[#080C10] border-t border-white/5 flex items-center justify-between px-4 text-[10px] font-mono text-text-2 tracking-wide">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green" /> {activeLang} Ready
                    </span>
                    <span className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full transition-colors",
                            status === 'Idle' ? "bg-text-2"
                                : status === 'Running' ? "bg-amber shadow-[0_0_8px_#F59E0B] animate-pulse"
                                    : "bg-green shadow-[0_0_8px_#10B981]"
                        )} />
                        {status}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span>{topicData?.difficulty ?? ''}</span>
                    <div className="hidden sm:flex items-center gap-2">
                        <div className="w-24 h-1 bg-brand-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green" style={{ width: `${moduleTopics.length ? ((topicIndex + 1) / moduleTopics.length) * 100 : 0}%` }} />
                        </div>
                        {topicIndex + 1}/{moduleTopics.length} topics
                    </div>
                </div>
            </footer>
        </div>
    );
};

const VerticalResizeHandle = () => (
    <PanelResizeHandle className="w-[1px] hover:w-1 bg-white/5 hover:bg-brand-500 focus-visible:bg-brand-500 cursor-col-resize transition-colors outline-none z-30" />
);
