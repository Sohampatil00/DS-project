import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { 
    Play, 
    RotateCcw, 
    ChevronLeft, 
    Eye, 
    CheckCircle2, 
    ChevronRight, 
    XCircle, 
    FastForward, 
    Rewind, 
    SkipBack, 
    SkipForward, 
    Pause,
    BookOpen,
    Activity,
    Terminal as TerminalIcon,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { GradientText } from '../components/GradientText';
import { topics } from '../data/topics';
import { getTopicContent } from '../data/topicContent';
import type { LangKey } from '../data/topicContent';
import { TopicVisualizer, VisualizerContext } from '../components/visualizers/TopicVisualizer';
import { useNarration } from '../hooks/useNarration';
import type { VoiceProfile } from '../hooks/useNarration';
import { NarrationControls } from '../components/NarrationControls';
import { getIndianNarration } from '../lib/hinglishTranslator';

const LANGS: LangKey[] = ['C++', 'Java', 'Python', 'C'];
const SPEEDS = ['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x'];

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
    const [activeLang, setActiveLang] = useState<LangKey>('C++');
    const [hintsRevealed, setHintsRevealed] = useState<number[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [testResults, setTestResults] = useState<TestResult[] | null>(null);
    const [speed, setSpeed] = useState('1x');
    const speedNum = parseFloat(speed) || 1;
    const [status, setStatus] = useState<'Idle' | 'Running' | 'Done'>('Idle');
    const [code, setCode] = useState<Record<LangKey, string | null>>({ 'C++': null, Java: null, Python: null, C: null });
    const [visPlaying, setVisPlaying] = useState(false);

    const [activeStep, setActiveStep] = useState(0);
    const [narrationEnabled, setNarrationEnabled] = useState(() => {
        const saved = localStorage.getItem('narration_enabled');
        return saved ? saved === 'true' : true;
    });
    const [narrationVoice, setNarrationVoice] = useState<VoiceProfile>(() => {
        const saved = localStorage.getItem('narration_voice');
        return (saved as VoiceProfile) || 'hinglish-classroom';
    });

    // Progressive Reveal & Lock States
    const [theoryRead, setTheoryRead] = useState(false);
    const [simulationUnlocked, setSimulationUnlocked] = useState(false);
    const [simulationInteracted, setSimulationInteracted] = useState(false);
    const [practiceUnlocked, setPracticeUnlocked] = useState(false);

    // Interactive Terminal Console Simulator States
    const [consoleInput, setConsoleInput] = useState('');
    const [consoleOutput, setConsoleOutput] = useState('');
    const [consoleActiveTab, setConsoleActiveTab] = useState<'instructions' | 'console'>('instructions');
    const [lastInputInjected, setLastInputInjected] = useState(false);

    // Layout Section Refs for Steppers & Scroll Sync
    const theoryRef = useRef<HTMLDivElement>(null);
    const simulationRef = useRef<HTMLDivElement>(null);
    const practiceRef = useRef<HTMLDivElement>(null);

    // Reset states on topic change
    useEffect(() => {
        setActiveStep(0);
        setHintsRevealed([]);
        setTestResults(null);
        setStatus('Idle');
        setVisPlaying(false);
        setTheoryRead(false);
        setSimulationUnlocked(false);
        setSimulationInteracted(false);
        setPracticeUnlocked(false);
        setConsoleInput('');
        setConsoleOutput('');
        setConsoleActiveTab('instructions');
    }, [topic]);

    // Resolve topic data
    const topicData = useMemo(() => topics.find(t => t.id === topic), [topic]);
    const content = useMemo(() => getTopicContent(topic ?? ''), [topic]);

    // Auto-unlock practice once user interacts with visualizer
    useEffect(() => {
        if (activeStep > 0 || visPlaying) {
            setSimulationInteracted(true);
            setPracticeUnlocked(true);
        }
    }, [activeStep, visPlaying]);

    // Scroll observation for unlocking sections automatically
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.id === 'section-theory') {
                        setTheoryRead(true);
                        setSimulationUnlocked(true);
                    }
                }
            });
        }, observerOptions);

        const theoryEl = document.getElementById('section-theory');
        if (theoryEl) observer.observe(theoryEl);

        return () => {
            if (theoryEl) observer.unobserve(theoryEl);
        };
    }, [topic]);

    // Hook up narration
    const rawNarrationText = content.narrationSteps?.[activeStep];
    const narrationText = narrationVoice === 'hinglish-classroom' && topic
        ? getIndianNarration(topic, activeStep, rawNarrationText ?? '')
        : rawNarrationText;
    const { isSpeaking, isSupported } = useNarration(
        narrationText,
        visPlaying,
        speedNum,
        narrationEnabled,
        narrationVoice
    );

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
        setConsoleActiveTab('console');
        setVisPlaying(true);
        
        const compileCmd = activeLang === 'C++' ? 'g++ -std=c++20 main.cpp -o main' 
                           : activeLang === 'C' ? 'gcc main.c -o main'
                           : activeLang === 'Java' ? 'javac Main.java'
                           : 'python3 -m py_compile main.py';
                           
        setConsoleOutput(`[info] Compiling workspace...\n$ ${compileCmd}\n`);
        
        setTimeout(() => {
            const userCode = getCode(activeLang);
            const validation = content.validate(userCode, activeLang);
            
            let stdoutResult = '';
            let isCodeValid = true;
            let buildError = '';

            // Standard syntax checks per language to make compiler output authentic!
            if (activeLang === 'C++' && !userCode.includes('main')) {
                isCodeValid = false;
                buildError = `main.cpp: In function 'int main()':\nerror: expected ';' or '}' in compile scope`;
            } else if (activeLang === 'Java' && !userCode.includes('public class Main')) {
                isCodeValid = false;
                buildError = `Main.java:1: error: class Main is public, should be declared in a file named Main.java`;
            } else if (activeLang === 'C' && !userCode.includes('main')) {
                isCodeValid = false;
                buildError = `main.c: In function 'main':\nerror: undefined reference to 'main'`;
            }

            if (!isCodeValid) {
                setConsoleOutput(prev => prev + 
                    `[compile_error] Build failed.\n\n${buildError}\n`
                );
                setStatus('Idle');
                return;
            }

            // Parse consoleInput or fallback to sample case
            const inputs = consoleInput.trim().split(/\s+/);
            
            // Mock output generator based on the active topic's challenge
            if (topic === 'input-output') {
                const num1 = parseInt(inputs[0]) || 0;
                const num2 = parseInt(inputs[1]) || 0;
                if (!userCode.includes('+') && !userCode.includes('sum')) {
                    stdoutResult = `${num1} ${num2}\n[warning] Program ran but did not perform addition.`;
                } else {
                    stdoutResult = `${num1 + num2}`;
                }
            } else if (topic === 'control-statements') {
                const num = parseInt(inputs[0]);
                if (isNaN(num)) {
                    stdoutResult = `[stderr] Error: Invalid integer input.`;
                } else if (num > 0) {
                    stdoutResult = `Positive`;
                } else if (num < 0) {
                    stdoutResult = `Negative`;
                } else {
                    stdoutResult = `Zero`;
                }
            } else if (topic === 'loops') {
                const num = parseInt(inputs[0]);
                if (isNaN(num) || num < 2) {
                    stdoutResult = ``;
                } else {
                    const evens = [];
                    for (let i = 2; i <= num; i += 2) evens.push(i);
                    stdoutResult = evens.join(' ');
                }
            } else if (topic === 'arrays') {
                const size = parseInt(inputs[0]) || 0;
                const arr = inputs.slice(1).map(Number).filter(n => !isNaN(n));
                if (arr.length === 0) {
                    stdoutResult = `0`;
                } else {
                    stdoutResult = `${Math.max(...arr.slice(0, size))}`;
                }
            } else if (topic === 'arrays-strings') {
                const str = inputs[0] || '';
                const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
                const isPalindrome = cleanStr === cleanStr.split('').reverse().join('');
                stdoutResult = isPalindrome ? 'true' : 'false';
            } else if (topic === 'pointers') {
                stdoutResult = `Before: 5\nAfter: 10\nAddress: 0x7ffd9b85c1ac`;
            } else if (topic === 'by-value-vs-by-reference') {
                stdoutResult = `By value: a=3, b=7 (unchanged)\nBy reference: a=7, b=3 (swapped)`;
            } else if (topic === 'c-install-guide') {
                stdoutResult = `Setup Complete!`;
            } else if (topic === 'variables') {
                stdoutResult = `age: 25\nheight: 5.9\nname: Alice`;
            } else if (topic === 'data-types') {
                stdoutResult = `int: 4 bytes\nfloat: 4 bytes\ndouble: 8 bytes\nchar: 1 byte\nbool: 1 byte`;
            } else if (topic === 'syntax') {
                stdoutResult = `Name: Soham\nFavorite: C++`;
            } else if (topic === 'operators') {
                stdoutResult = `Sum: 13\nDiff: 7\nProduct: 30\nQuotient: 3\nRemainder: 1`;
            } else if (topic === 'type-casting') {
                stdoutResult = `int 7 -> double 7.0\ndouble 3.99 -> int 3`;
            } else if (topic === 'what-is-data-structure-static-dynamic') {
                stdoutResult = `Static: [1, 2, 3]\nDynamic: [10, 20, 30, 40]`;
            } else {
                stdoutResult = validation.passed ? (content.challenge.example.output) : `[stderr] Output mismatch. Verification failed.`;
            }

            setConsoleOutput(prev => prev + 
                `[info] Compilation successful.\n` +
                `[info] Executing process...\n` +
                `-----------------------------------------\n` +
                `${stdoutResult}\n` +
                `-----------------------------------------\n` +
                `[info] Process exited with status 0 (0x0)`
            );
            
            setVisPlaying(true);
            setSimulationInteracted(true);
            setPracticeUnlocked(true);
            setStatus('Done');
        }, 1200);
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
        <div className="min-h-screen w-full bg-[#0D1117] flex flex-col text-text-1 overflow-x-hidden selection:bg-brand-500/30 selection:text-white relative">
            {/* FLOATING SIDEBAR STEPPER (TIMELINE) */}
            <div className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-6 z-40 bg-[#080C10]/70 backdrop-blur-md border border-borderAdaptive/5 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-48 transition-all">
                <h4 className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#475569] mb-1">Topic Progress</h4>
                
                <button 
                    onClick={() => theoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    className="flex items-center gap-3 text-left group"
                >
                    <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold font-mono transition-all",
                        theoryRead 
                            ? "bg-green border-green text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                            : "bg-[#090D16] border-borderAdaptive/20 text-[#475569] group-hover:border-brand-500 group-hover:text-brand-300"
                    )}>
                        {theoryRead ? "✓" : "1"}
                    </div>
                    <div className="flex flex-col">
                        <span className={cn("text-xs font-bold transition-colors", theoryRead ? "text-text-1" : "text-text-2 group-hover:text-brand-300")}>Concept</span>
                        <span className="text-[8px] text-[#475569] uppercase font-mono">Theory</span>
                    </div>
                </button>

                <div className="w-px h-6 bg-borderAdaptive/10 ml-2.5 -my-2" />

                <button 
                    onClick={() => {
                        if (simulationUnlocked) {
                            simulationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }}
                    disabled={!simulationUnlocked}
                    className={cn(
                        "flex items-center gap-3 text-left group",
                        !simulationUnlocked && "opacity-40 cursor-not-allowed"
                    )}
                >
                    <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold font-mono transition-all",
                        simulationInteracted 
                            ? "bg-purple border-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                            : simulationUnlocked
                                ? "bg-[#090D16] border-purple/40 text-purple-300 group-hover:border-purple group-hover:text-purple"
                                : "bg-[#090D16] border-borderAdaptive/20 text-[#475569]"
                    )}>
                        {simulationInteracted ? "✓" : "2"}
                    </div>
                    <div className="flex flex-col">
                        <span className={cn("text-xs font-bold transition-colors", simulationUnlocked ? "text-text-1" : "text-text-2")}>Simulation</span>
                        <span className="text-[8px] text-[#475569] uppercase font-mono">Visualizer</span>
                    </div>
                </button>

                <div className="w-px h-6 bg-borderAdaptive/10 ml-2.5 -my-2" />

                <button 
                    onClick={() => {
                        if (practiceUnlocked) {
                            practiceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }}
                    disabled={!practiceUnlocked}
                    className={cn(
                        "flex items-center gap-3 text-left group",
                        !practiceUnlocked && "opacity-40 cursor-not-allowed"
                    )}
                >
                    <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-bold font-mono transition-all",
                        allPassed 
                            ? "bg-green border-green text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                            : practiceUnlocked
                                ? "bg-[#090D16] border-green/40 text-green group-hover:border-green group-hover:text-green"
                                : "bg-[#090D16] border-borderAdaptive/20 text-[#475569]"
                    )}>
                        {allPassed ? "✓" : "3"}
                    </div>
                    <div className="flex flex-col">
                        <span className={cn("text-xs font-bold transition-colors", practiceUnlocked ? "text-text-1" : "text-text-2")}>Practice</span>
                        <span className="text-[8px] text-[#475569] uppercase font-mono">Challenge</span>
                    </div>
                </button>
            </div>

            {/* STICKY TOP BAR */}
            <header className="sticky top-0 z-50 h-14 shrink-0 border-b border-borderAdaptive/5 flex items-center justify-between px-6 bg-[#0D1117]/85 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-4 text-sm font-medium">
                    <Link to="/courses" className="flex items-center gap-1.5 text-text-2 hover:text-text-1 transition-colors">
                        <ChevronLeft className="w-4 h-4" /> Back to Courses
                    </Link>
                    <div className="w-px h-4 bg-borderAdaptive/10" />
                    <div className="flex items-center gap-2 text-text-2">
                        <span className="capitalize">{topicData?.moduleName ?? mod?.replace(/-/g, ' ')}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-text-1 capitalize font-bold">{topicData?.title ?? topic?.replace(/-/g, ' ')}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-text-2 font-medium hidden sm:inline">
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

            {/* SCROLLABLE MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto px-6 py-12 space-y-24">
                    
                    {/* SECTION 1: THEORY */}
                    <section id="section-theory" ref={theoryRef} className="space-y-8 scroll-mt-20">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400">
                                <BookOpen className="w-4 h-4 text-brand-400" />
                                Concept Overview
                            </div>
                            <h2 className="text-4xl font-extrabold tracking-tight">
                                <GradientText>{topicData?.title ?? 'Topic'}</GradientText>
                            </h2>
                            <p className="text-base text-text-2 leading-relaxed max-w-3xl">
                                {content.theory.description}
                            </p>
                        </div>

                        {/* Complexity Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-5 border border-brand-500/10 rounded-2xl bg-brand-950/20 shadow-[0_4px_20px_rgba(59,130,246,0.05)] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-300 mb-2">Time Complexity</h4>
                                <p className="text-xl font-mono font-bold text-text-1">{content.theory.timeComplexity}</p>
                            </div>

                            <div className="p-5 border border-amber/15 rounded-2xl bg-amber/5 shadow-[0_4px_20px_rgba(245,158,11,0.05)] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-amber/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <h4 className="text-xs font-bold uppercase tracking-wider text-amber mb-2">Space Complexity</h4>
                                <p className="text-xl font-mono font-bold text-text-1">{content.theory.spaceComplexity}</p>
                            </div>
                        </div>

                        {/* Detailed "How it works" */}
                        <div className="p-6 border border-borderAdaptive/5 rounded-2xl bg-[#090D16]/50 space-y-3">
                            <h3 className="text-lg font-bold text-text-1 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-brand-400" />
                                How it works
                            </h3>
                            <p className="text-sm text-text-2 leading-relaxed whitespace-pre-line">
                                {content.theory.howItWorks}
                            </p>
                        </div>

                        {/* Proceed to Simulation Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => {
                                    setTheoryRead(true);
                                    setSimulationUnlocked(true);
                                    setTimeout(() => {
                                        simulationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }, 100);
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-brand-600 to-purple hover:from-brand-500 hover:to-purple-500 text-white font-bold text-sm rounded-2xl flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.25)] transition-all active:scale-[0.98] group"
                            >
                                Got the Concept! Proceed to Simulation
                                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </section>

                    {/* SECTION 2: ANIMATED VISUALIZATION */}
                    <section id="section-simulation" ref={simulationRef} className="space-y-8 scroll-mt-20 relative">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple">
                                <Activity className="w-4 h-4 text-purple" />
                                Interactive Simulation
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight">Interactive Visualizer</h3>
                            <p className="text-sm text-text-2 max-w-2xl">
                                Step through the algorithm visualizer in real-time. Turn on voice narration to hear explanations synced perfectly with the animation steps.
                            </p>
                        </div>

                        <div className="relative rounded-3xl overflow-hidden min-h-[400px]">
                            {/* Glassmorphic Lock Overlay */}
                            <AnimatePresence>
                                {!simulationUnlocked && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-[#0D1117]/85 backdrop-blur-xl border border-borderAdaptive/10 rounded-3xl"
                                    >
                                        <div className="p-4 bg-brand-500/10 rounded-full border border-brand-500/20 mb-4 animate-pulse">
                                            <Activity className="w-8 h-8 text-brand-400" />
                                        </div>
                                        <h4 className="text-xl font-bold mb-2">Simulation Locked</h4>
                                        <p className="text-sm text-text-2 max-w-sm mb-6">
                                            Read the conceptual overview of the topic above or click below to unlock this interactive real-time visualizer.
                                        </p>
                                        <button 
                                            onClick={() => {
                                                setTheoryRead(true);
                                                setSimulationUnlocked(true);
                                            }}
                                            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] active:scale-95"
                                        >
                                            Unlock Simulation
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Main visualizer block with absolute blur if locked */}
                            <div className={cn("transition-all duration-500", !simulationUnlocked && "blur-md pointer-events-none select-none opacity-40")}>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Panel: Simulation Canvas (2/3 width on large screens) */}
                                    <div className="lg:col-span-2 flex flex-col border border-borderAdaptive/10 rounded-3xl bg-[#080C10] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden relative group">
                                        {/* Accent lights */}
                                        <div className="absolute -top-[150px] -left-[150px] w-[300px] h-[300px] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
                                        <div className="absolute -bottom-[150px] -right-[150px] w-[300px] h-[300px] rounded-full bg-purple/10 blur-[120px] pointer-events-none" />
                                        
                                        <div className="absolute inset-0 pointer-events-none opacity-[0.1] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
                                        
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-borderAdaptive/5 bg-brand-950/20">
                                            <h4 className="text-sm font-bold text-brand-300">
                                                {topicData?.title ?? topic?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Simulation
                                            </h4>
                                            <span className="text-[10px] font-mono text-text-2 bg-brand-900 px-2 py-0.5 rounded border border-borderAdaptive/5">
                                                Step {activeStep + 1} of {content.narrationSteps?.length ?? 6}
                                            </span>
                                        </div>

                                        <div className="min-h-[350px] flex-1 flex items-center justify-center relative p-8">
                                            <VisualizerContext.Provider value={{ step: activeStep, setStep: setActiveStep }}>
                                                <TopicVisualizer
                                                    topicId={topic ?? ''}
                                                    topicTitle={topicData?.title ?? ''}
                                                    playing={visPlaying && (!narrationEnabled || !isSpeaking)}
                                                    speed={speedNum}
                                                    onStepChange={(s) => {
                                                        setActiveStep(s);
                                                        setSimulationInteracted(true);
                                                        setPracticeUnlocked(true);
                                                    }}
                                                />
                                            </VisualizerContext.Provider>
                                        </div>

                                        {/* Control Bar inside visualizer card */}
                                        <div className="px-6 py-4 border-t border-borderAdaptive/5 bg-brand-950/40 flex flex-wrap items-center justify-between gap-4 mt-auto">
                                            {/* Playback Controls */}
                                            <div className="flex items-center gap-1.5 bg-brand-950/60 px-3 py-1 rounded-full border border-borderAdaptive/5">
                                                <button onClick={() => { setActiveStep(0); setSimulationInteracted(true); setPracticeUnlocked(true); }} className="text-text-2 hover:text-text-1 p-1 rounded transition-colors active:scale-95" title="Jump to start">
                                                    <SkipBack className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => { setActiveStep(s => Math.max(0, s - 1)); setSimulationInteracted(true); setPracticeUnlocked(true); }} className="text-text-2 hover:text-text-1 p-1 rounded transition-colors active:scale-95" title="Previous step">
                                                    <Rewind className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setVisPlaying(p => !p);
                                                        setSimulationInteracted(true);
                                                        setPracticeUnlocked(true);
                                                    }}
                                                    className="text-text-1 bg-brand-600 hover:bg-brand-500 p-1.5 rounded-full transition-all active:scale-90 mx-1 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                                    title={visPlaying ? "Pause simulation" : "Play simulation"}
                                                >
                                                    {visPlaying
                                                        ? <Pause className="w-3.5 h-3.5 fill-white text-white" />
                                                        : <Play className="w-3.5 h-3.5 fill-white text-white" />
                                                    }
                                                </button>
                                                <button onClick={() => { setActiveStep(s => Math.min((content.narrationSteps?.length ?? 6) - 1, s + 1)); setSimulationInteracted(true); setPracticeUnlocked(true); }} className="text-text-2 hover:text-text-1 p-1 rounded transition-colors active:scale-95" title="Next step">
                                                    <FastForward className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => { setActiveStep((content.narrationSteps?.length ?? 6) - 1); setSimulationInteracted(true); setPracticeUnlocked(true); }} className="text-text-2 hover:text-text-1 p-1 rounded transition-colors active:scale-95" title="Jump to end">
                                                    <SkipForward className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {/* Narration Controls */}
                                            <div className="flex items-center gap-3">
                                                <NarrationControls
                                                    isSpeaking={isSpeaking}
                                                    isSupported={isSupported}
                                                    enabled={narrationEnabled}
                                                    onToggle={() => setNarrationEnabled(prev => {
                                                        localStorage.setItem('narration_enabled', String(!prev));
                                                        return !prev;
                                                    })}
                                                    voiceProfile={narrationVoice}
                                                    onVoiceChange={(voice) => {
                                                        localStorage.setItem('narration_voice', voice);
                                                        setNarrationVoice(voice);
                                                    }}
                                                />
                                            </div>

                                            {/* Speed Controller */}
                                            <div className="flex bg-brand-950/60 rounded-full p-0.5 border border-borderAdaptive/5 relative">
                                                {SPEEDS.map(s => (
                                                    <button key={s} onClick={() => setSpeed(s)} className={cn("px-2.5 py-1 text-[10px] font-bold rounded-full relative z-10 transition-colors", speed === s ? "text-text-1" : "text-text-2 hover:text-text-1")}>
                                                        {speed === s && <motion.div layoutId="speed-pill" className="absolute inset-0 bg-brand-700/80 rounded-full -z-10" />}
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Panel: Narration & Lesson Steps (1/3 width on large screens) */}
                                    <div className="border border-borderAdaptive/10 rounded-3xl bg-[#080C10]/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[500px] lg:h-auto max-h-[600px]">
                                        <div className="px-6 py-4 border-b border-borderAdaptive/5 bg-brand-950/20 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-brand-400" />
                                                <h4 className="text-sm font-bold text-brand-300">Explanation Steps</h4>
                                            </div>
                                            <span className="text-[9px] uppercase font-mono bg-brand-900/60 border border-brand-500/10 px-2 py-0.5 rounded text-brand-400">
                                                Interactive
                                            </span>
                                        </div>
                                        
                                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                            {content.narrationSteps && content.narrationSteps.length > 0 ? (
                                                content.narrationSteps.map((stepText, idx) => {
                                                    const isActive = activeStep === idx;
                                                    const isHinglish = narrationVoice === 'hinglish-classroom' && topic;
                                                    const stepDisplay = isHinglish
                                                        ? getIndianNarration(topic ?? '', idx, stepText)
                                                        : stepText;

                                                    return (
                                                        <button
                                                            key={idx}
                                                            onClick={() => {
                                                                setActiveStep(idx);
                                                                setSimulationInteracted(true);
                                                                setPracticeUnlocked(true);
                                                                if (!visPlaying) {
                                                                    setVisPlaying(true);
                                                                }
                                                            }}
                                                            className={cn(
                                                                "w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex gap-3 group relative overflow-hidden",
                                                                isActive
                                                                    ? "bg-brand-500/10 border-brand-500/30 shadow-[0_0_20px_rgba(59,130,246,0.08)]"
                                                                    : "bg-transparent border-borderAdaptive/5 hover:border-brand-500/20 hover:bg-brand-950/10"
                                                            )}
                                                        >
                                                            {/* Glowing active bar */}
                                                            {isActive && (
                                                                <motion.div 
                                                                    layoutId="active-indicator"
                                                                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-500 to-purple rounded-r-full"
                                                                />
                                                            )}
                                                            
                                                            {/* Step Badge */}
                                                            <div className={cn(
                                                                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 border transition-all",
                                                                isActive
                                                                    ? "bg-brand-500/20 border-brand-500 text-brand-300"
                                                                    : "bg-brand-950/60 border-borderAdaptive/10 text-text-2 group-hover:border-brand-500/40 group-hover:text-brand-300"
                                                            )}>
                                                                {idx + 1}
                                                            </div>

                                                            {/* Step Text & Speaking Wave */}
                                                            <div className="flex-1 space-y-1">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <span className={cn(
                                                                        "text-[10px] uppercase font-mono tracking-wider font-bold transition-colors",
                                                                        isActive ? "text-brand-400" : "text-[#475569] group-hover:text-brand-400/60"
                                                                    )}>
                                                                        Step {idx + 1}
                                                                    </span>
                                                                    
                                                                    {isActive && isSpeaking && narrationEnabled && (
                                                                        <div className="flex items-center gap-0.5 h-3 shrink-0" title="Narrator is speaking">
                                                                            <span className="w-0.5 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                                                            <span className="w-0.5 h-3 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                                                            <span className="w-0.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <p className={cn(
                                                                    "text-xs leading-relaxed transition-colors",
                                                                    isActive ? "text-text-1 font-medium" : "text-text-2 group-hover:text-text-1"
                                                                )}>
                                                                    {stepDisplay}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 select-none font-mono">
                                                    <div className="w-12 h-12 rounded-2xl bg-brand-500/5 border border-brand-500/10 flex items-center justify-center text-lg text-brand-400 shadow-lg animate-pulse">
                                                        ℹ️
                                                    </div>
                                                    <p className="text-xs text-text-1 font-bold">Interactive Canvas Active</p>
                                                    <p className="text-[10px] text-text-2 leading-relaxed max-w-[200px]">
                                                        This advanced topic uses real-time dynamic simulation controls directly on the canvas.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Proceed to Practice Workspace */}
                        {simulationUnlocked && (
                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={() => {
                                        setSimulationInteracted(true);
                                        setPracticeUnlocked(true);
                                        setTimeout(() => {
                                            practiceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }, 100);
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-purple to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm rounded-2xl flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all active:scale-[0.98] group"
                                >
                                    Concept Visualized! Open Practice Challenge
                                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        )}
                    </section>

                    {/* SECTION 3: PRACTICE CHALLENGE */}
                    <section id="section-practice" ref={practiceRef} className="space-y-8 scroll-mt-20 relative">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green">
                                <TerminalIcon className="w-4 h-4 text-green" />
                                Hands-on Practice
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight">Practice Challenge</h3>
                            <p className="text-sm text-text-2 max-w-2xl">
                                Apply what you've learned. Read the statement below, select your preferred programming language, implement your solution in the editor, and verify it against our test suite.
                            </p>
                        </div>

                        <div className="relative rounded-3xl overflow-hidden min-h-[500px]">
                            {/* Glassmorphic Lock Overlay */}
                            <AnimatePresence>
                                {!practiceUnlocked && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-[#0D1117]/85 backdrop-blur-xl border border-borderAdaptive/10 rounded-3xl"
                                    >
                                        <div className="p-4 bg-purple/10 rounded-full border border-purple/20 mb-4 animate-pulse">
                                            <TerminalIcon className="w-8 h-8 text-purple-400" />
                                        </div>
                                        <h4 className="text-xl font-bold mb-2">Practice Workspace Locked</h4>
                                        <p className="text-sm text-text-2 max-w-sm mb-6">
                                            Step through or play the interactive visualizer simulation above to unlock the coding playground environment.
                                        </p>
                                        <button 
                                            onClick={() => {
                                                setSimulationInteracted(true);
                                                setPracticeUnlocked(true);
                                            }}
                                            className="px-6 py-2.5 bg-purple hover:bg-purple/80 text-white font-bold text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] active:scale-95"
                                        >
                                            Unlock Coding Workspace
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Workspace container blurred if locked */}
                            <div className={cn("transition-all duration-500 space-y-8", !practiceUnlocked && "blur-md pointer-events-none select-none opacity-40")}>
                                {/* Problem statement card */}
                                <div className="border-l-4 border-brand-500 p-6 rounded-r-2xl bg-brand-950/10 border border-y-borderAdaptive/5 border-r-borderAdaptive/5 space-y-4 shadow-lg">
                                    <h4 className="font-extrabold text-text-1 text-lg">Problem Statement</h4>
                                    <p className="text-sm text-text-2 leading-relaxed">{content.challenge.statement}</p>
                                    
                                    {/* Example terminal box with Input injecter */}
                                    <div className="bg-[#080C10] border border-borderAdaptive/5 p-4 rounded-xl text-xs font-mono text-text-2 space-y-3 shadow-inner relative">
                                        <div className="flex items-center justify-between border-b border-borderAdaptive/5 pb-1.5 mb-1.5">
                                            <div className="flex items-center gap-1.5 text-[10px] text-[#475569]">
                                                <span className="w-2 h-2 rounded-full bg-[#1E293B]" />
                                                <span>Sample Case Example</span>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    setConsoleInput(content.challenge.example.input === '(none)' ? '' : content.challenge.example.input);
                                                    setConsoleActiveTab('console');
                                                    setLastInputInjected(true);
                                                    setTimeout(() => setLastInputInjected(false), 1500);
                                                }}
                                                className="text-[10px] font-bold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1 bg-brand-950/40 px-2 py-0.5 rounded border border-brand-500/10 active:scale-95"
                                            >
                                                📥 Input to Compiler
                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            <p><span className="text-text-1 font-bold">Input:</span> {content.challenge.example.input}</p>
                                            <p><span className="text-text-1 font-bold">Output:</span> {content.challenge.example.output}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Progressive Hints */}
                                {content.hints.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569]">Stuck? progressive hints</h4>
                                        <div className="grid grid-cols-1 gap-3">
                                            {content.hints.map((hint, i) => (
                                                <div key={i} className="border border-borderAdaptive/10 rounded-xl overflow-hidden bg-brand-950/20">
                                                    {hintsRevealed.includes(i) ? (
                                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 text-xs text-text-2 leading-relaxed">
                                                            <span className="font-bold text-brand-300">Hint {i + 1}: </span> {hint}
                                                        </motion.div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setHintsRevealed(p => [...p, i])}
                                                            className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-brand-300 hover:bg-brand-900/50 transition-colors"
                                                        >
                                                            Reveal Hint {i + 1} <Eye className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Coding Workspace Layout (Editor + Terminal Console) */}
                                <div className="border border-borderAdaptive/5 rounded-2xl bg-[#090D16] overflow-hidden shadow-2xl flex flex-col">
                                    {/* Editor Tabs Header */}
                                    <div className="flex items-center justify-between p-3 border-b border-borderAdaptive/5 bg-[#0A0E17]">
                                        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar">
                                            {LANGS.map(l => (
                                                <button
                                                    key={l}
                                                    onClick={() => handleLangSwitch(l)}
                                                    className={cn(
                                                        "px-3.5 py-1 text-xs font-mono rounded-full transition-all relative whitespace-nowrap",
                                                        activeLang === l ? "text-text-1" : "text-text-2 hover:text-text-1"
                                                    )}
                                                >
                                                    {activeLang === l && (
                                                        <motion.div layoutId="lang-tab" className="absolute inset-0 bg-brand-700/80 rounded-full -z-10 border border-borderAdaptive/10" />
                                                    )}
                                                    {l}
                                                </button>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-mono text-[#475569]">{activeLang} workspace</span>
                                    </div>

                                    {/* Monaco Editor Container */}
                                    <div className="h-[360px] relative bg-[#090D16]">
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
                                                    <div className="absolute top-[86px] left-0 w-full h-[22px] bg-amber/10 border-l-4 border-amber pointer-events-none z-10 animate-pulse" />
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>

                                    {/* TERMINAL / PLAYGROUND CONSOLE */}
                                    <div className="border-t border-borderAdaptive/5 bg-[#05080E] flex flex-col h-[240px]">
                                        {/* Terminal Tabs Header */}
                                        <div className="flex items-center justify-between px-4 py-1.5 border-b border-borderAdaptive/5 bg-[#070A11]">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-mono font-bold text-[#475569] uppercase tracking-wider">Terminal</span>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => setConsoleActiveTab('instructions')} 
                                                        className={cn(
                                                            "px-3 py-1 text-xs font-mono transition-colors font-bold", 
                                                            consoleActiveTab === 'instructions' ? "text-brand-400 border-b-2 border-brand-400" : "text-[#475569] hover:text-text-2"
                                                        )}
                                                    >
                                                        Problem Details
                                                    </button>
                                                    <button 
                                                        onClick={() => setConsoleActiveTab('console')} 
                                                        className={cn(
                                                            "px-3 py-1 text-xs font-mono transition-all font-bold flex items-center gap-1.5 relative", 
                                                            consoleActiveTab === 'console' ? "text-brand-400 border-b-2 border-brand-400" : "text-[#475569] hover:text-text-2"
                                                        )}
                                                    >
                                                        Console Input/Output
                                                        {lastInputInjected && (
                                                            <span className="absolute -top-1 -right-2 flex h-2.5 w-2.5">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-rose/60 hover:bg-rose transition-colors cursor-pointer" />
                                                <span className="w-2.5 h-2.5 rounded-full bg-amber/60 hover:bg-amber transition-colors cursor-pointer" />
                                                <span className="w-2.5 h-2.5 rounded-full bg-green/60 hover:bg-green transition-colors cursor-pointer" />
                                            </div>
                                        </div>

                                        {/* Terminal Tab Contents */}
                                        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto select-text custom-scrollbar">
                                            {consoleActiveTab === 'instructions' ? (
                                                <div className="text-[#94A3B8] space-y-2">
                                                    <p className="text-brand-300 font-bold">Topic Challenge: {topicData?.title}</p>
                                                    <p className="leading-relaxed text-[11px]">{content.challenge.statement}</p>
                                                    <div className="text-[#475569] text-[9px] mt-2 italic">
                                                        * Write your solution program in the workspace above. Click "Run Code" to compile and run with custom terminal inputs.
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-[160px]">
                                                    {/* Input Terminal */}
                                                    <div className="flex flex-col h-full bg-[#030508] border border-borderAdaptive/5 rounded-lg p-2.5 relative">
                                                        <div className="text-[10px] text-[#475569] border-b border-borderAdaptive/5 pb-1 mb-2 flex items-center justify-between">
                                                            <span>stdin (Standard Input)</span>
                                                            <span className="text-[8px] bg-brand-950/40 px-1 rounded text-brand-400">customizable</span>
                                                        </div>
                                                        <textarea
                                                            value={consoleInput}
                                                            onChange={(e) => setConsoleInput(e.target.value)}
                                                            placeholder="Type input values here... (e.g., 3 7)"
                                                            className="flex-1 w-full bg-transparent resize-none outline-none border-none text-text-1 font-mono text-xs placeholder-[#475569] custom-scrollbar"
                                                        />
                                                    </div>

                                                    {/* Output Terminal */}
                                                    <div className="flex flex-col h-full bg-[#030508] border border-borderAdaptive/5 rounded-lg p-2.5 relative text-text-2">
                                                        <div className="text-[10px] text-[#475569] border-b border-borderAdaptive/5 pb-1 mb-2">
                                                            <span>stdout / stderr (Standard Output)</span>
                                                        </div>
                                                        <div className="flex-1 whitespace-pre-wrap overflow-y-auto select-all text-xs font-mono font-normal custom-scrollbar">
                                                            {consoleOutput ? (
                                                                <span className={cn(
                                                                    consoleOutput.includes('[compile_error]') ? "text-rose" : "text-[#E2E8F0]"
                                                                )}>{consoleOutput}</span>
                                                            ) : (
                                                                <span className="text-[#475569] italic">Run program to see compilation logs and terminal results...</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Coding Control Footer */}
                                    <div className="p-4 border-t border-borderAdaptive/5 bg-brand-950/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
                                        {/* Buttons */}
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            <button onClick={handleRun} className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-green to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold text-sm rounded-xl flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98]">
                                                <Play className="w-4 h-4 fill-white text-white" /> Run Code
                                            </button>
                                            <button onClick={handleReset} className="px-4 py-2.5 rounded-xl text-sm font-medium text-text-2 hover:text-white hover:bg-borderAdaptive/5 transition-colors flex items-center gap-2 focus:outline-none">
                                                <RotateCcw className="w-4 h-4" /> Reset
                                            </button>
                                        </div>
                                        
                                        <button
                                            onClick={handleSubmit}
                                            disabled={submitting}
                                            className="w-full sm:w-auto px-8 py-2.5 bg-cta-gradient rounded-xl text-white text-sm font-bold tracking-wide hover:shadow-glow transition-shadow disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center gap-2"
                                        >
                                            {submitting ? (
                                                <div className="w-4 h-4 border-2 border-borderAdaptive/30 border-t-white rounded-full animate-spin" />
                                            ) : 'Submit Solution'}
                                        </button>
                                    </div>
                                </div>

                                {/* Test Cases Checklist & Banner Results */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                    {/* Test Cases List */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569]">Validation Cases</h4>
                                        <div className="space-y-2">
                                            {content.testCases.map((tc, i) => {
                                                const result = testResults?.[i];
                                                return (
                                                    <div key={i} className={cn(
                                                        "flex items-center gap-3 px-4 py-3 rounded-xl border text-xs font-mono transition-all group/vcase",
                                                        result === undefined
                                                            ? "bg-brand-900/20 border-borderAdaptive/5 text-text-2"
                                                            : result.passed
                                                                ? "bg-green/10 border-green/30 text-green"
                                                                : "bg-rose/10 border-rose/30 text-rose"
                                                    )}>
                                                        {result === undefined
                                                            ? <span className="w-3.5 h-3.5 rounded-full border border-borderAdaptive/20 inline-block flex-shrink-0" />
                                                            : result.passed
                                                                ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                                                : <XCircle className="w-4 h-4 flex-shrink-0" />
                                                        }
                                                        <span className="flex-1 truncate">{tc.label}</span>
                                                        <button
                                                            onClick={() => {
                                                                setConsoleInput(tc.input === '(none)' ? '' : tc.input);
                                                                setConsoleActiveTab('console');
                                                                setLastInputInjected(true);
                                                                setTimeout(() => setLastInputInjected(false), 1500);
                                                            }}
                                                            className="opacity-0 group-hover/vcase:opacity-100 focus/vcase:opacity-100 text-[9px] font-bold text-brand-400 hover:text-brand-300 transition-all bg-brand-950/60 border border-brand-500/20 px-2 py-0.5 rounded"
                                                        >
                                                            📥 Inject Input
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Overall Result Banner */}
                                    <div className="flex flex-col justify-end">
                                        <AnimatePresence>
                                            {testResults !== null && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                    className={cn(
                                                        "p-5 rounded-2xl flex items-start gap-3.5 text-sm font-bold border h-fit shadow-lg",
                                                        allPassed
                                                            ? "bg-green/10 text-green border-green/30"
                                                            : "bg-rose/10 text-rose border-rose/30"
                                                    )}
                                                >
                                                    {allPassed
                                                        ? <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5 text-green" />
                                                        : <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5 text-rose" />
                                                    }
                                                    <div className="space-y-1">
                                                        <h5 className="text-base font-extrabold">{allPassed ? 'Congratulations!' : 'Validation failed'}</h5>
                                                        <p className="text-xs font-normal opacity-90">{allPassed ? 'All test cases passed cleanly! Your code handles the topic logic fully.' : 'Some test cases failed. Review your code and check custom error logs.'}</p>
                                                        {!allPassed && testResults.find(r => !r.passed)?.failedCase && (
                                                            <div className="bg-[#080C10] border border-borderAdaptive/5 p-2 rounded-lg text-xs font-mono font-normal mt-2 text-rose bg-rose/5 border-rose/10 max-h-[80px] overflow-y-auto">
                                                                {testResults.find(r => !r.passed)?.failedCase}
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            {/* STICKY BOTTOM STATUS BAR */}
            <footer className="sticky bottom-0 z-40 h-9 shrink-0 bg-[#080C10] border-t border-borderAdaptive/5 flex items-center justify-between px-6 text-[10px] font-mono text-text-2 tracking-wide backdrop-blur-md">
                <div className="flex items-center gap-6">
                    <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green" /> {activeLang} Active
                    </span>
                    <span className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full transition-colors",
                            status === 'Idle' ? "bg-text-2"
                                : status === 'Running' ? "bg-amber shadow-[0_0_8px_#F59E0B] animate-pulse"
                                    : "bg-green shadow-[0_0_8px_#10B981]"
                        )} />
                        Compiler Status: {status}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span>Difficulty: <span className="text-brand-300 font-bold uppercase">{topicData?.difficulty ?? 'Beginner'}</span></span>
                </div>
            </footer>
        </div>
    );
};
