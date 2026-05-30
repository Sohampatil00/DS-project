import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Terminal, Cpu, CheckCircle2, XCircle, Sparkles, Layers, 
    Code, Keyboard, Monitor, ChevronRight, HelpCircle, Info
} from 'lucide-react';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { BSTVisualizer } from './BSTVisualizer';
import { SortingRaceVisualizer } from './SortingRaceVisualizer';

export const VisualizerContext = React.createContext<{
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
} | null>(null);

// ─── Shared hook: step through an array of frames ────────────────────────────
function useSteps(count: number, playing: boolean, msPerStep: number) {
    const ctx = React.useContext(VisualizerContext);
    const [localStep, setLocalStep] = React.useState(0);
    
    const step = ctx ? ctx.step : localStep;
    const setStep = ctx ? ctx.setStep : setLocalStep;

    React.useEffect(() => {
        // When VisualizerContext is provided, the parent owns step advancement
        // (narration-driven or its own timer). We only self-advance for
        // standalone usage (no context).
        if (!playing || ctx) return;
        const id = setInterval(() => {
            setStep(s => (s + 1) % count);
        }, msPerStep);
        return () => clearInterval(id);
    }, [playing, msPerStep, count, setStep, !!ctx]);

    // reset local step only if not controlled
    React.useEffect(() => {
        if (!ctx) {
            setLocalStep(0);
        }
    }, [count, !!ctx]);

    return [step, setStep] as const;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. InstallGuideVis (C++ Installation Guide) — Pipeline & Colorful Terminal
// ─────────────────────────────────────────────────────────────────────────────
const InstallGuideVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const frames = [
        { title: 'Environment Setup', cmd: '', out: 'Welcome to C++ Setup! Let\'s install g++ compiler.', stepInfo: 'Init Setup' },
        { title: 'Download Compiler', cmd: 'curl -LO https://msys2.org/msys2-x86_64-latest.exe', out: 'Downloading MSYS2 installer...\n  100% 124MB [===================>] 12MB/s', stepInfo: 'Download' },
        { title: 'Install g++', cmd: 'pacman -S --noconfirm mingw-w64-x86_64-gcc', out: 'resolving dependencies...\ninstalling mingw-w64-x86_64-gcc-13.2.0...\n[OK] Added g++ compiler successfully!', stepInfo: 'Install Compiler' },
        { title: 'Verify path', cmd: 'g++ --version', out: 'g++ (Rev1, Built by MSYS2 project) 13.2.0\nCopyright (C) 2023 Free Software Foundation, Inc.', stepInfo: 'Verify PATH' },
        { title: 'Create main.cpp', cmd: 'cat <<EOF > hello.cpp\n#include <iostream>\nint main() { std::cout << "Setup Complete!"; }\nEOF', out: 'File "hello.cpp" written successfully.', stepInfo: 'Write Code' },
        { title: 'Compile source', cmd: 'g++ hello.cpp -o hello', out: 'Compiling hello.cpp...\nLinking execution binaries...', stepInfo: 'Compile & Link' },
        { title: 'Run executable', cmd: './hello', out: 'Setup Complete!\n\nProcess returned 0 (0x0)', stepInfo: 'Run Program' },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(2200 / speed));
    const cur = frames[step];

    useEffect(() => {
        onStepChange?.(step);
    }, [step, onStepChange]);

    const [typedOut, setTypedOut] = useState('');
    useEffect(() => {
        setTypedOut('');
        if (!cur.out) return;
        let index = 0;
        const intervalTime = Math.max(5, Math.round(12 / speed));
        const timer = setInterval(() => {
            setTypedOut((prev) => prev + cur.out.charAt(index));
            index++;
            if (index >= cur.out.length) {
                clearInterval(timer);
            }
        }, intervalTime);
        return () => clearInterval(timer);
    }, [step, cur.out, speed]);

    // Pipeline phases
    const pipelines = ['Setup', 'Download', 'Install', 'Verify', 'Write', 'Compile', 'Run'];

    return (
        <div className="w-full max-w-md bg-[#090d1a] border-2 border-brand-500/40 rounded-2xl overflow-hidden shadow-[0_0_60px_-15px_rgba(59,130,246,0.5)] select-none font-mono">
            {/* Build pipeline status bar at the top */}
            <div className="bg-slate-950 px-4 py-2.5 border-b border-brand-500/20 flex items-center justify-between gap-1">
                <span className="text-[7.5px] font-bold text-slate-500 uppercase shrink-0">PIPELINE:</span>
                <div className="flex-1 flex justify-between items-center px-1">
                    {pipelines.map((p, idx) => {
                        const active = idx === step;
                        const done = idx < step;
                        return (
                            <div key={p} className="flex items-center flex-1 last:flex-none">
                                <motion.div 
                                    animate={{ 
                                        scale: active ? 1.2 : 1,
                                        backgroundColor: active ? '#3b82f6' : done ? '#10b981' : '#1e293b',
                                        boxShadow: active ? '0 0 10px #3b82f6' : done ? '0 0 8px #10b981' : 'none'
                                    }}
                                    className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] text-[#090d1a] font-extrabold"
                                >
                                    {done ? '✓' : idx + 1}
                                </motion.div>
                                {idx < pipelines.length - 1 && (
                                    <div className={`h-0.5 flex-1 mx-1 ${done ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Terminal Top Window Frame */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-brand-500/10">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-extrabold text-slate-300">MinGW64 Compiler Console</span>
                </div>
                <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                </div>
            </div>

            {/* Terminal output stream */}
            <div className="p-5 space-y-4 min-h-[230px] max-h-[230px] overflow-y-auto custom-scrollbar text-[11px] relative bg-slate-950/90">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-brand-500/5 via-transparent to-transparent" />
                
                <div className="space-y-3.5">
                    {frames.slice(0, step + 1).map((f, idx) => {
                        const isCurrent = idx === step;
                        return (
                            <motion.div key={idx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                                {f.cmd && (
                                    <div className="flex gap-2 items-center text-cyan-400 font-bold">
                                        <ChevronRight className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                                        <span>$</span>
                                        <span className="text-slate-100 font-medium">{f.cmd}</span>
                                        {!isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0 animate-bounce" />}
                                    </div>
                                )}
                                <div className="pl-5">
                                    {isCurrent ? (
                                        <div className="text-emerald-400 whitespace-pre-wrap leading-relaxed border-l-2 border-emerald-500/40 pl-3 bg-emerald-950/20 py-1 rounded">
                                            {typedOut}
                                            {playing && <span className="inline-block w-1.5 h-3 bg-emerald-400 ml-0.5 animate-ping" />}
                                        </div>
                                    ) : (
                                        <div className="text-slate-500 whitespace-pre-wrap pl-3 border-l border-slate-900 leading-relaxed font-light">{f.out}</div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Explanatory helper box */}
            <div className="bg-slate-900/80 px-4 py-3 border-t border-brand-500/20 flex items-center justify-between text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5 text-brand-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>Status:</span>
                    <span className="font-extrabold text-slate-100 uppercase">{cur.title}</span>
                </div>
                <div className="bg-brand-950 text-brand-400 px-2 py-0.5 rounded border border-brand-500/20 font-black">
                    {cur.stepInfo}
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. VariablesVis (Variables memory cells) — RAM write beams & stacks
// ─────────────────────────────────────────────────────────────────────────────
const VariablesVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const vars = [
        { name: 'none', type: 'none', value: '', addr: '', desc: 'Memory space is reserved. Variables are not yet declared.' },
        { name: 'age', type: 'int', value: '25', addr: '0x7ffd04', desc: '4 Bytes allocated for age, value set to 25.' },
        { name: 'height', type: 'float', value: '5.9f', addr: '0x7ffd08', desc: '4 Bytes allocated for height, value set to 5.9.' },
        { name: 'name', type: 'string', value: '"Alice"', addr: '0x7ffd0c', desc: 'String variable name allocated, value set to "Alice".' },
        { name: 'cout', type: 'ostream', value: 'stdout', addr: '0x7ffd04', desc: 'cout reads from memory and prints: age: 25, height: 5.9, name: Alice.' },
        { name: 'all', type: 'summary', value: 'done', addr: '', desc: 'Variables are stored with a name, type, value, and memory address.' }
    ];
    const [step] = useSteps(vars.length, playing, Math.round(2000 / speed));
    const cur = vars[step] || vars[0];

    useEffect(() => {
        onStepChange?.(step);
    }, [step, onStepChange]);

    return (
        <div className="w-full max-w-md flex flex-col gap-4 select-none font-mono">
            {/* Memory Header with status badge */}
            <div className="flex flex-col gap-2 bg-gradient-to-r from-slate-900 via-[#0a0f1d] to-slate-900 p-3.5 rounded-2xl border border-brand-500/20 shadow-lg">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-cyan-400 animate-spin" /> 
                        <span className="font-extrabold text-slate-200">RAM STACK VISUALIZER</span>
                    </div>
                    <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 text-[9px] font-black">ACTIVE</span>
                </div>
                <div className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-900/60 min-h-[46px] flex items-center">
                    {cur.desc}
                </div>
            </div>
            
            {/* Contiguous memory cells */}
            <div className="flex flex-col gap-3 relative">
                {[
                    { name: 'age', type: 'int', addr: '0x7ffd04', size: '4 Bytes', color: '#3B82F6', gradient: 'from-blue-500/20 to-indigo-500/10', values: ['(garbage)', '25', '25', '25', '25', '25'] },
                    { name: 'height', type: 'float', addr: '0x7ffd08', size: '4 Bytes', color: '#F59E0B', gradient: 'from-amber-500/20 to-orange-500/10', values: ['(garbage)', '(garbage)', '5.9f', '5.9f', '5.9f', '5.9f'] },
                    { name: 'name', type: 'string', addr: '0x7ffd0c', size: '32 Bytes', color: '#10B981', gradient: 'from-emerald-500/20 to-teal-500/10', values: ['(garbage)', '(garbage)', '(garbage)', '"Alice"', '"Alice"', '"Alice"'] }
                ].map((v, index) => {
                    const cellVal = v.values[step] || '(garbage)';
                    const isActive = cur.name === v.name || (cur.name === 'all') || (cur.name === 'cout');
                    const isGarbage = cellVal.includes('garbage');
                    const justAllocated = (v.name === 'age' && step === 1) || (v.name === 'height' && step === 2) || (v.name === 'name' && step === 3);
                    
                    return (
                        <motion.div
                            key={v.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                borderColor: isActive ? v.color : 'rgba(255,255,255,0.05)',
                                backgroundColor: isActive ? '#0d1527' : '#020617',
                                boxShadow: justAllocated ? `0 0 25px -4px ${v.color}` : 'none'
                            }}
                            className="flex items-center border rounded-xl px-4 py-3 relative overflow-hidden group shadow"
                        >
                            {/* Color wash block inside active cells */}
                            {isActive && (
                                <div className={`absolute inset-0 bg-gradient-to-r ${v.gradient} opacity-20 pointer-events-none`} />
                            )}
                            
                            {/* Write sweep neon rainbow beam */}
                            {justAllocated && (
                                <motion.div 
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '180%' }}
                                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                                    className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-cyan-400 to-transparent skew-x-12 pointer-events-none"
                                />
                            )}
                            
                            {/* Byte size tag */}
                            <span 
                                className="absolute right-4 top-1 text-[7px] font-black uppercase"
                                style={{ color: isActive ? v.color : '#475569' }}
                            >
                                {v.size}
                            </span>
                            
                            <span className="text-[10px] text-slate-500 w-16 shrink-0 font-medium">{v.addr}</span>
                            <span className="text-[10px] w-14 shrink-0 font-extrabold" style={{ color: v.color }}>{v.type}</span>
                            <span className="text-xs font-extrabold text-slate-200 flex-1">{v.name}</span>
                            
                            {/* Value bubble */}
                            <div className="relative">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={cellVal}
                                        initial={{ scale: 0.5, y: -5, opacity: 0 }}
                                        animate={{ scale: 1, y: 0, opacity: 1 }}
                                        exit={{ scale: 0.5, y: 5, opacity: 0 }}
                                        className={`text-xs font-black px-2.5 py-1 rounded-lg border ${
                                            isGarbage 
                                                ? 'text-rose-500/40 border-rose-950/20 bg-rose-950/5 italic' 
                                                : 'border-slate-800 bg-slate-950 text-slate-100 shadow-md'
                                        }`}
                                        style={{ color: isGarbage ? undefined : v.color }}
                                    >
                                        {cellVal}
                                    </motion.span>
                                </AnimatePresence>

                                {/* cout reading dots */}
                                {cur.name === 'cout' && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: [1, 2, 0], opacity: [0.8, 1, 0], x: [0, 80] }}
                                        transition={{ repeat: Infinity, duration: 1.5, delay: index * 0.2 }}
                                        className="absolute -right-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full z-20 shadow-[0_0_8px_currentColor]"
                                        style={{ color: v.color, backgroundColor: 'currentColor' }}
                                    />
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            
            {/* Variable Lifecycle Legend */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-900 flex justify-between gap-3 text-[9px] text-slate-500">
                <span className="font-bold shrink-0">MEM GLOSSARY:</span>
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Garbage (Old uninitialized memory)</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-500" /> Declared (RAM space address allocated)</span>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. DataTypesVis (Visual size & alignment representations) — RAM byte grid
// ─────────────────────────────────────────────────────────────────────────────
const DataTypesVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const types = [
        { name: 'int', bytes: 4, color: '#3B82F6', val: ['4', '2', '\0', '\0'], desc: '4 Bytes. Store integer numeric values up to ~2 billion.' },
        { name: 'float', bytes: 4, color: '#F59E0B', val: ['3', '.', '1', '4'], desc: '4 Bytes. Floating point representation, utilizes IEEE 754 format.' },
        { name: 'double', bytes: 8, color: '#EC4899', val: ['2', '.', '7', '1', '8', '2', '8', '\0'], desc: '8 Bytes. Double precision float, fits 15 decimal digits.' },
        { name: 'char', bytes: 1, color: '#10B981', val: ["'Z'"], desc: '1 Byte. Store single letters/characters using ASCII code values.' },
        { name: 'bool', bytes: 1, color: '#A78BFA', val: ['T'], desc: '1 Byte. Holds true (1) or false (0). Uses full byte due to addressing limits.' }
    ];
    const [step] = useSteps(7, playing, Math.round(2000 / speed));

    useEffect(() => {
        onStepChange?.(step);
    }, [step, onStepChange]);

    return (
        <div className="w-full max-w-md flex flex-col gap-5 select-none font-mono">
            {/* Header info text */}
            <div className="h-16 text-center flex flex-col justify-center bg-slate-900/60 p-3.5 rounded-2xl border border-brand-500/20 backdrop-blur shadow-lg">
                <AnimatePresence mode="wait">
                    {step === 0 ? (
                        <motion.span key="start" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-slate-400 leading-normal">
                            RAM sizing scales: each primitive datatype occupies a predefined number of RAM slots (Bytes).
                        </motion.span>
                    ) : step === 6 ? (
                        <motion.span key="sizeof" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-brand-400 font-extrabold">
                            Use the <code className="bg-brand-950 px-1.5 py-0.5 rounded text-amber-400">sizeof(...)</code> operator to retrieve the size in bytes on your system.
                        </motion.span>
                    ) : (
                        <motion.div key={step} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-[11px] text-slate-300">
                            <span className="font-black uppercase px-2 py-0.5 rounded-lg mr-2" style={{ color: '#090d1a', backgroundColor: types[step - 1]?.color }}>
                                {types[step - 1]?.name}
                            </span>
                            {types[step - 1]?.desc}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Byte Cells Grid */}
            <div className="flex flex-col gap-3">
                {types.map((t, idx) => {
                    const isActive = step === idx + 1;
                    const isPassed = step > idx + 1;
                    const finalStep = step === 6;
                    const shouldDisplay = isActive || isPassed || finalStep;
                    
                    return (
                        <div key={t.name} className="flex items-center gap-4">
                            <motion.span 
                                animate={{
                                    color: isActive ? t.color : '#64748B',
                                    scale: isActive ? 1.05 : 1
                                }}
                                className="w-16 text-xs font-black transition-all text-left uppercase"
                            >
                                {t.name}
                            </motion.span>
                            
                            <div className="flex-1 h-10 bg-slate-950 border border-slate-900 rounded-xl overflow-hidden flex relative shadow-inner">
                                {isActive && (
                                    <motion.div 
                                        animate={{ opacity: [0.1, 0.25, 0.1] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="absolute inset-0 pointer-events-none"
                                        style={{ backgroundColor: t.color }}
                                    />
                                )}
                                
                                {Array.from({ length: t.bytes }).map((_, bIdx) => (
                                    <motion.div
                                        key={bIdx}
                                        initial={{ scaleY: 0 }}
                                        animate={{
                                            scaleY: shouldDisplay ? 1 : 0,
                                            backgroundColor: isActive ? `${t.color}35` : isPassed || finalStep ? 'rgba(30,41,59,0.4)' : 'transparent',
                                            borderColor: isActive ? t.color : isPassed || finalStep ? 'rgba(30,41,59,0.8)' : 'transparent',
                                        }}
                                        transition={{ delay: bIdx * 0.05, duration: 0.25 }}
                                        className="flex-1 h-full border-r border-slate-900/60 flex flex-col items-center justify-center text-[8px] relative"
                                    >
                                        {shouldDisplay && (
                                            <>
                                                <span className="font-bold text-[7px] opacity-40" style={{ color: isActive ? t.color : '#475569' }}>B{bIdx + 1}</span>
                                                {isActive && t.val[bIdx] && (
                                                    <motion.span 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="text-[10px] font-black text-slate-100 mt-0.5"
                                                    >
                                                        {t.val[bIdx]}
                                                    </motion.span>
                                                )}
                                            </>
                                        )}
                                    </motion.div>
                                ))}
                                
                                {shouldDisplay && (
                                    <motion.span
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                                        style={{ color: isActive ? t.color : '#64748B' }}
                                    >
                                        {t.bytes} {t.bytes === 1 ? 'BYTE' : 'BYTES'}
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Bit Breakdown Explainer Banner */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-900 text-[9px] text-slate-500 leading-normal flex gap-2">
                <Info className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>
                    <strong>BIT BREAKDOWN:</strong> Each RAM byte (B) represents 8 individual transistors (bits) inside your device hardware chips. Thus, an <strong>int (4B)</strong> contains 32 binary bits.
                </span>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. IOStreamVis (cin >> / cout << streams) — Stream Flow particles
// ─────────────────────────────────────────────────────────────────────────────
const IOStreamVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const frames = [
        { label: 'Standard Streams Ready: Let\'s input and output data.', active: '' },
        { label: 'Include iostream header: standard input & output streams initialized.', active: '' },
        { label: 'cin extraction: waiting for user input "3" and "7" from keyboard.', active: 'cin' },
        { label: 'Memory allocated: variables a = 3, b = 7 stored in RAM.', active: 'mem' },
        { label: 'ALU execution: a + b computed inside ALU, result is 10.', active: 'alu' },
        { label: 'cout insertion: push value 10 to standard output stream.', active: 'cout' },
        { label: 'Output displayed: value 10 printed to the terminal screen.', active: 'stdout' },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(2200 / speed));
    const cur = frames[step] || frames[0];

    useEffect(() => {
        onStepChange?.(step);
    }, [step, onStepChange]);

    return (
        <div className="w-full max-w-md flex flex-col items-center gap-6 select-none font-mono">
            {/* Visual Streams Flow */}
            <div className="w-full flex items-center justify-between relative px-2.5 py-6 bg-slate-950/40 rounded-2xl border border-slate-900/60 shadow-inner">
                
                {/* Keyboard / Input */}
                <motion.div 
                    animate={{
                        borderColor: cur.active === 'cin' ? '#3B82F6' : 'rgba(255,255,255,0.06)',
                        backgroundColor: cur.active === 'cin' ? 'rgba(59,130,246,0.15)' : '#020617',
                        scale: cur.active === 'cin' ? 1.05 : 1
                    }}
                    className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 shadow-lg relative group"
                >
                    <Keyboard className="w-4 h-4 text-slate-500 mb-1 group-hover:text-brand-400 transition-colors" />
                    <span className="text-[7px] text-[#475569] uppercase font-bold">KEYBOARD</span>
                    <span className="text-[10px] font-black text-slate-100 mt-0.5">3 &amp; 7</span>
                </motion.div>
                
                {/* Arrow to cin */}
                <div className="flex-1 h-3 relative flex items-center justify-center mx-1">
                    <div className="absolute inset-0 bg-[#1E293B]/20 rounded-full" />
                    {cur.active === 'cin' && (
                        <div className="absolute inset-0 overflow-hidden rounded-full">
                            <motion.div
                                initial={{ x: '-100%' }} animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 1.2 / speed, ease: 'linear' }}
                                className="w-8 h-full bg-gradient-to-r from-transparent via-brand-500 to-transparent shadow-[0_0_10px_#3b82f6]"
                            />
                            <motion.div 
                                initial={{ x: -30 }} animate={{ x: 30 }}
                                transition={{ repeat: Infinity, duration: 1.2 / speed, ease: 'linear' }}
                                className="absolute top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-brand-500 text-[8px] font-black text-[#020617] flex items-center justify-center shadow-lg"
                            >
                                3
                            </motion.div>
                        </div>
                    )}
                    <span className="absolute -top-4 text-[8px] text-brand-400 font-black">cin &gt;&gt;</span>
                </div>

                {/* RAM / ALU Execution box */}
                <motion.div 
                    animate={{
                        borderColor: cur.active === 'mem' || cur.active === 'alu' ? '#F59E0B' : 'rgba(255,255,255,0.06)',
                        backgroundColor: cur.active === 'mem' || cur.active === 'alu' ? 'rgba(245,158,11,0.1)' : '#020617',
                        scale: cur.active === 'mem' || cur.active === 'alu' ? 1.03 : 1
                    }}
                    className="w-32 h-24 border-2 rounded-2xl flex flex-col justify-center px-3.5 gap-1.5 relative shadow-lg"
                >
                    <span className="absolute -top-3.5 left-3 text-[8px] text-amber-500 font-extrabold bg-[#090d1a] px-1.5 rounded">RAM MEMORY</span>
                    
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-[#475569]">int a:</span>
                        <motion.span key={step >= 3 ? '3' : 'g'} animate={{ scale: step >= 3 ? [1, 1.2, 1] : 1 }} className="font-black text-slate-100">{step >= 3 ? '3' : '(garbage)'}</motion.span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-[#475569]">int b:</span>
                        <motion.span key={step >= 3 ? '7' : 'g'} animate={{ scale: step >= 3 ? [1, 1.2, 1] : 1 }} className="font-black text-slate-100">{step >= 3 ? '7' : '(garbage)'}</motion.span>
                    </div>
                    
                    {/* ALU gear logic */}
                    {step >= 4 && (
                        <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-[#020617] font-black text-[8px] px-2 py-0.5 rounded shadow-lg flex items-center gap-1 border border-[#020617]"
                        >
                            <Cpu className="w-2.5 h-2.5 animate-spin" /> ALU: SUM=10
                        </motion.div>
                    )}
                </motion.div>

                {/* Arrow to cout */}
                <div className="flex-1 h-3 relative flex items-center justify-center mx-1">
                    <div className="absolute inset-0 bg-[#1E293B]/20 rounded-full" />
                    {cur.active === 'cout' && (
                        <div className="absolute inset-0 overflow-hidden rounded-full">
                            <motion.div
                                initial={{ x: '-100%' }} animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 1.2 / speed, ease: 'linear' }}
                                className="w-8 h-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_10px_#10b981]"
                            />
                            <motion.div 
                                initial={{ x: -30 }} animate={{ x: 30 }}
                                transition={{ repeat: Infinity, duration: 1.2 / speed, ease: 'linear' }}
                                className="absolute top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-emerald-500 text-[8px] font-black text-[#020617] flex items-center justify-center shadow-lg"
                            >
                                10
                            </motion.div>
                        </div>
                    )}
                    <span className="absolute -top-4 text-[8px] text-emerald-400 font-black">cout &lt;&lt;</span>
                </div>

                {/* Terminal / stdout */}
                <motion.div 
                    animate={{
                        borderColor: cur.active === 'stdout' ? '#10B981' : 'rgba(255,255,255,0.06)',
                        backgroundColor: cur.active === 'stdout' ? 'rgba(16,185,129,0.15)' : '#020617',
                        scale: cur.active === 'stdout' ? 1.05 : 1
                    }}
                    className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 shadow-lg relative group"
                >
                    <Monitor className="w-4 h-4 text-slate-500 mb-1 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-[7px] text-[#475569] uppercase font-bold">MONITOR</span>
                    <span className="text-[11px] font-extrabold text-emerald-400 mt-0.5">{step >= 6 ? '10' : ''}</span>
                </motion.div>
            </div>

            {/* Extraction vs Insertion Explainer Card */}
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-900 flex justify-between gap-3 text-[9px] text-slate-500">
                <div className="flex flex-col gap-1">
                    <span className="font-black text-slate-400">STREAM DIRECTIVES KEY:</span>
                    <span>🔴 <code>cin &gt;&gt;</code>: Extraction Operator pulls data FROM stream INTO your RAM slots.</span>
                    <span>🟢 <code>cout &lt;&lt;</code>: Insertion Operator pushes data FROM RAM slots OUT into monitor stream.</span>
                </div>
            </div>

            {/* Label and description */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-center text-slate-300 bg-slate-900/60 border border-brand-500/10 px-4 py-2.5 rounded-2xl max-w-sm"
                >
                    {cur.label}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. SyntaxVis (C++ Program anatomical analysis) — Line carets & syntax themes
// ─────────────────────────────────────────────────────────────────────────────
const SyntaxVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const frames = [
        { highlightIdx: -1, label: 'Let\'s break down standard C++ file syntax structure.', note: 'Overview', desc: 'Overview of main.cpp' },
        { highlightIdx: 0, label: 'Imports preprocessor directives to access functions like std::cout.', note: '#include', desc: 'Preprocesses dependencies.' },
        { highlightIdx: 1, label: 'Avoids prefixing objects with std:: namespace context.', note: 'using namespace', desc: 'Bypasses std:: typing.' },
        { highlightIdx: 2, label: 'Every operating execution starts from main() function entry.', note: 'int main()', desc: 'Entry point function.' },
        { highlightIdx: 3, label: 'Indicates boundary blocks where block routines reside.', note: 'Braces block', desc: 'Code scope borders.' },
        { highlightIdx: 4, label: 'Insertion operator (<<) pushes variables to stdout streams.', note: 'cout statement', desc: 'Writes standard output.' },
        { highlightIdx: 5, label: 'Compiler reads double slash as comments and ignores them.', note: 'Comments', desc: 'Code documentation.' },
        { highlightIdx: 6, label: 'Returns success code 0 back to base operating system.', note: 'Return statement', desc: 'Exits successfully.' },
    ];
    
    // Map frame highlightIdx to line index array
    const lineHighlightMap: Record<number, number[]> = {
        [-1]: [],
        0: [0],
        1: [1],
        2: [2],
        3: [2, 6],
        4: [4],
        5: [3],
        6: [5]
    };

    const [step] = useSteps(frames.length, playing, Math.round(2300 / speed));
    const cur = frames[step];

    useEffect(() => {
        onStepChange?.(step);
    }, [step, onStepChange]);

    const renderSyntaxHighlighted = (line: string) => {
        if (line.includes('#include')) {
            return (
                <span>
                    <span className="text-pink-500">#include</span>{' '}
                    <span className="text-emerald-400">&lt;iostream&gt;</span>
                </span>
            );
        }
        if (line.includes('using namespace')) {
            return (
                <span>
                    <span className="text-purple-500">using namespace</span>{' '}
                    <span className="text-slate-100 font-semibold">std</span>
                    <span className="text-slate-400">;</span>
                </span>
            );
        }
        if (line.includes('int main')) {
            return (
                <span>
                    <span className="text-brand-400 font-semibold">int</span>{' '}
                    <span className="text-amber-400 font-bold">main</span>
                    <span className="text-slate-200">() {'{'}</span>
                </span>
            );
        }
        if (line.includes('cout')) {
            return (
                <span className="pl-4">
                    <span className="text-brand-400 font-bold">cout</span>{' '}
                    <span className="text-amber-500">&lt;&lt;</span>{' '}
                    <span className="text-emerald-400">"Name: Soham"</span>{' '}
                    <span className="text-amber-500">&lt;&lt;</span>{' '}
                    <span className="text-purple-500 font-bold">endl</span>
                    <span className="text-slate-400">;</span>
                </span>
            );
        }
        if (line.includes('return 0')) {
            return (
                <span className="pl-4">
                    <span className="text-pink-500">return</span>{' '}
                    <span className="text-purple-400 font-bold">0</span>
                    <span className="text-slate-400">;</span>
                </span>
            );
        }
        if (line.trim() === '}') {
            return <span className="text-slate-200">{'}'}</span>;
        }
        if (line.includes('//')) {
            return <span className="pl-4 text-slate-500 italic font-light">{line.trim()}</span>;
        }
        return <span>{line}</span>;
    };

    const codeLines = [
        { line: '#include <iostream>', comment: '// Header import' },
        { line: 'using namespace std;', comment: '// Scope namespace' },
        { line: 'int main() {', comment: '// Entry point' },
        { line: '    // Print output to console', comment: '// Documentation' },
        { line: '    cout << "Name: Soham" << endl;', comment: '// Console write' },
        { line: '    return 0;', comment: '// Exit status success' },
        { line: '}', comment: '// Scope end' }
    ];

    const currentHighlights = lineHighlightMap[cur.highlightIdx] || [];

    return (
        <div className="w-full max-w-md flex flex-col gap-4 select-none font-mono">
            {/* Editor Console */}
            <div className="bg-[#020617] border border-brand-500/20 rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-brand-500/5 via-transparent to-transparent pointer-events-none" />
                
                <div className="px-4 py-3 bg-slate-900/60 flex items-center justify-between border-b border-brand-500/10 text-[10px] text-slate-400 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-cyan-400" />
                        <span className="font-extrabold text-slate-200">main.cpp</span>
                    </div>
                    <span className="text-brand-400 font-extrabold uppercase bg-brand-950 px-2 py-0.5 rounded border border-brand-500/15 text-[9px]">{cur.note}</span>
                </div>
                
                <div className="p-4 space-y-1.5 text-xs relative">
                    {/* Brackets indicator bar */}
                    {cur.highlightIdx === 3 && (
                        <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: '70px' }}
                            className="absolute left-10 top-[65px] w-0.5 border-l border-dashed border-brand-400/50 pointer-events-none animate-pulse-glow"
                        />
                    )}

                    {codeLines.map((lineObj, idx) => {
                        const isHighlighted = currentHighlights.includes(idx);
                        
                        return (
                            <motion.div
                                key={idx}
                                animate={{
                                    backgroundColor: isHighlighted ? 'rgba(59,130,246,0.1)' : 'transparent',
                                    x: isHighlighted ? 6 : 0
                                }}
                                transition={{ duration: 0.2 }}
                                className="px-2 py-1 rounded flex justify-between gap-4 relative group"
                            >
                                {isHighlighted && (
                                    <motion.div 
                                        layoutId="syntaxCaret"
                                        className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-1 h-3.5 bg-brand-500 rounded"
                                    />
                                )}
                                
                                <div className="flex gap-3">
                                    <span className="text-[9px] text-[#475569] w-4 text-right shrink-0">{idx + 1}</span>
                                    <div className="font-semibold text-slate-300">
                                        {renderSyntaxHighlighted(lineObj.line)}
                                    </div>
                                </div>
                                <span className="text-[9px] text-slate-600 group-hover:text-slate-400 transition-colors shrink-0">{lineObj.comment}</span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            
            {/* Trace Info Explainer Callout */}
            {cur.highlightIdx !== -1 && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-950/80 p-3 rounded-2xl border border-slate-900 text-[10px] text-slate-400 flex items-start gap-2 shadow-inner"
                >
                    <HelpCircle className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <div>
                        <span className="font-extrabold text-slate-300 block mb-0.5">{cur.note} explanation:</span>
                        <span>{cur.label}</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. DSClassificationVis (Data structures classifications) — Tree connections
// ─────────────────────────────────────────────────────────────────────────────
const DSClassificationVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const frames = [
        { label: 'Data structures: systematic methods of arranging variables in memory.', activeNode: 'root' },
        { label: 'Broad classification: Linear vs Non-Linear structures.', activeNode: 'linear-nonlinear' },
        { label: 'Linear structures: sequential elements (Arrays, Linked Lists, Stacks, Queues).', activeNode: 'linear' },
        { label: 'Non-Linear structures: hierarchical or networked nodes (Trees, Graphs).', activeNode: 'nonlinear' },
        { label: 'Static data structures: fixed-length memory allocated consecutively (Arrays).', activeNode: 'static' },
        { label: 'Dynamic data structures: grows and shrinks in heap memory (Vectors).', activeNode: 'dynamic' },
        { label: 'Algorithmic efficiency: select the right structure to maximize performance.', activeNode: 'root' },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(2300 / speed));
    const cur = frames[step] || frames[0];

    useEffect(() => {
        onStepChange?.(step);
    }, [step, onStepChange]);

    const treeNodes = [
        { id: 'root', label: 'Data Structures', x: '50%', y: '12%', color: '#60A5FA', icon: '📦', shape: '[ val ]' },
        { id: 'linear', label: 'Linear', x: '25%', y: '40%', color: '#3B82F6', parent: 'root', icon: '🔗', shape: '[0]→[1]' },
        { id: 'nonlinear', label: 'Non-Linear', x: '75%', y: '40%', color: '#EC4899', parent: 'root', icon: '🌳', shape: 'O=(A)=' },
        { id: 'static', label: 'Static (Array)', x: '12%', y: '75%', color: '#F59E0B', parent: 'linear', icon: '💾', shape: '[3|1|4]' },
        { id: 'dynamic', label: 'Dynamic (Vector)', x: '38%', y: '75%', color: '#10B981', parent: 'linear', icon: '⚡', shape: '[3|1|+]' },
        { id: 'tree', label: 'Tree / Graph', x: '75%', y: '75%', color: '#A78BFA', parent: 'nonlinear', icon: '🕸️', shape: '(A)➔(B)' }
    ];

    const isActive = (nId: string) => {
        if (cur.activeNode === 'root' && nId === 'root') return true;
        if (cur.activeNode === 'linear-nonlinear' && (nId === 'root' || nId === 'linear' || nId === 'nonlinear')) return true;
        if (cur.activeNode === 'linear' && (nId === 'linear' || nId === 'static' || nId === 'dynamic')) return true;
        if (cur.activeNode === 'nonlinear' && (nId === 'nonlinear' || nId === 'tree')) return true;
        if (cur.activeNode === 'static' && nId === 'static') return true;
        if (cur.activeNode === 'dynamic' && nId === 'dynamic') return true;
        return false;
    };

    return (
        <div className="w-full max-w-md flex flex-col gap-6 select-none font-mono items-center">
            {/* SVG Tree Frame */}
            <div className="w-full h-56 bg-[#020617] border border-brand-500/20 rounded-2xl relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.02),transparent_70%)]" />
                
                <svg className="absolute inset-0 w-full h-full">
                    {/* connectors */}
                    {treeNodes.filter(n => n.parent).map(n => {
                        const parent = treeNodes.find(p => p.id === n.parent);
                        const isConnActive = isActive(n.id) && isActive(parent!.id);
                        
                        return (
                            <g key={n.id}>
                                <motion.line
                                    x1={parent!.x} y1={parent!.y}
                                    x2={n.x} y2={n.y}
                                    stroke={isConnActive ? '#60A5FA' : '#1e293b'}
                                    strokeWidth={isConnActive ? 2.5 : 1}
                                    animate={{ 
                                        opacity: isActive(n.id) ? 1 : 0.1,
                                        strokeDasharray: isConnActive ? '4,4' : '0,0'
                                    }}
                                />
                                {isConnActive && (
                                    <motion.line
                                        x1={parent!.x} y1={parent!.y}
                                        x2={n.x} y2={n.y}
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        strokeDasharray="5,15"
                                        animate={{ strokeDashoffset: [-20, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 / speed, ease: 'linear' }}
                                    />
                                )}
                            </g>
                        );
                    })}
                </svg>
                
                {/* Render nodes */}
                {treeNodes.map(n => {
                    const active = isActive(n.id);
                    return (
                        <motion.div
                            key={n.id}
                            style={{ left: n.x, top: n.y, transform: 'translate(-50%, -50%)' }}
                            animate={{
                                scale: active ? 1.05 : 0.85,
                                opacity: active ? 1 : 0.2,
                                borderColor: active ? n.color : '#1E293B',
                                backgroundColor: active ? '#0c1221' : '#020617',
                                boxShadow: active ? `0 0 18px -4px ${n.color}60` : 'none'
                            }}
                            className="absolute px-3 py-1.5 border rounded-xl text-[9px] font-bold text-center z-10 select-none flex flex-col items-center gap-0.5 bg-[#020617]"
                        >
                            <div className="flex items-center gap-1">
                                <span className="text-[10px]">{n.icon}</span>
                                <span style={{ color: active ? n.color : '#64748B' }}>{n.label}</span>
                            </div>
                            {/* Shape indicator representing datatype allocation layout */}
                            {active && (
                                <motion.span 
                                    initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                                    className="text-[7px] text-slate-500 font-extrabold"
                                >
                                    {n.shape}
                                </motion.span>
                            )}
                        </motion.div>
                    );
                })}
            </div>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-slate-300 bg-slate-900/60 border border-brand-500/10 px-4 py-2.5 rounded-2xl max-w-sm backdrop-blur-sm shadow-md"
                >
                    {cur.label}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. ConditionalsVis (Flowchart branches) — Flow decision diamond
// ─────────────────────────────────────────────────────────────────────────────
const ConditionalsVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const frames = [
        { label: 'Conditionals: program decides action path via criteria check.', active: 'intro' },
        { label: 'We read an integer from the user. Let\'s evaluate n = -5.', active: 'check' },
        { label: 'Evaluating first branch: is -5 > 0 ? (No → Skip branch)', active: 'pos' },
        { label: 'Evaluating second branch: is -5 < 0 ? (Yes → Enter branch)', active: 'neg' },
        { label: 'Execute branch block: print "Negative" and bypass all remaining options.', active: 'exec' },
        { label: 'Execution complete: program selected exactly one path through the branches.', active: 'out' },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(2200 / speed));
    const cur = frames[step] || frames[0];

    useEffect(() => {
        onStepChange?.(step);
    }, [step, onStepChange]);

    const branches = [
        { cond: 'n > 0', label: 'Positive', color: '#10B981', stepIdx: 2, success: false },
        { cond: 'n < 0', label: 'Negative', color: '#EF4444', stepIdx: 3, success: true },
        { cond: 'else', label: 'Zero', color: '#F59E0B', stepIdx: 4, success: false }
    ];

    return (
        <div className="w-full max-w-md flex flex-col items-center gap-6 select-none font-mono">
            <div className="flex gap-4 items-center justify-center w-full relative min-h-[170px] py-4 bg-slate-950/20 border border-slate-900 rounded-2xl px-3">
                
                {/* Flowchart Decision Diamond Symbol */}
                <motion.div 
                    animate={{
                        borderColor: step >= 1 ? '#3B82F6' : 'rgba(255,255,255,0.06)',
                        backgroundColor: step >= 1 ? 'rgba(59,130,246,0.1)' : '#020617',
                        boxShadow: step === 1 ? '0 0 25px rgba(59,130,246,0.3)' : 'none'
                    }}
                    className="w-20 h-20 border-2 rounded flex flex-col items-center justify-center text-xs relative rotate-45"
                >
                    <div className="-rotate-45 flex flex-col items-center text-[10px]">
                        <span className="text-[7.5px] text-slate-400 font-extrabold uppercase mb-0.5">CHECK:</span>
                        <span className="font-extrabold text-slate-100 text-xs">n = -5</span>
                    </div>
                </motion.div>
                
                {/* connecting flowline */}
                <div className="w-10 h-0.5 relative">
                    <div className="absolute inset-0 bg-[#1E293B]" />
                    {step >= 1 && (
                        <motion.div 
                            initial={{ x: '-100%' }} animate={{ x: '100%' }}
                            transition={{ repeat: Infinity, duration: 1 / speed, ease: 'linear' }}
                            className="absolute inset-y-0 w-3 bg-brand-500"
                        />
                    )}
                </div>
                
                {/* Branches blocks */}
                <div className="flex flex-col gap-3 text-[10px]">
                    {branches.map(b => {
                        const isChecking = step === b.stepIdx;
                        const isTaken = b.success && step >= 3;
                        const isSkipped = !b.success && step >= b.stepIdx;
                        
                        return (
                            <motion.div
                                key={b.label}
                                animate={{
                                    borderColor: isChecking ? '#3b82f6' : isTaken ? '#10B981' : isSkipped ? '#334155' : '#1E293B',
                                    backgroundColor: isChecking ? 'rgba(59,130,246,0.06)' : isTaken ? 'rgba(16,185,129,0.08)' : '#020617',
                                    opacity: isChecking || isTaken ? 1 : 0.3,
                                    scale: isChecking || isTaken ? 1.03 : 1
                                }}
                                className="px-3.5 py-2 border-2 rounded-xl flex gap-5 items-center justify-between min-w-[170px] relative overflow-hidden bg-[#020617]"
                            >
                                {isChecking && (
                                    <motion.div 
                                        animate={{ x: [-150, 150] }}
                                        transition={{ repeat: Infinity, duration: 1.5 / speed }}
                                        className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-brand-500/20 to-transparent pointer-events-none"
                                    />
                                )}
                                
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-extrabold text-slate-200">{b.cond}</span>
                                    <span className="text-[7.5px] text-[#475569] uppercase font-bold">Branch</span>
                                </div>
                                
                                {/* evaluation badges */}
                                <span 
                                    className={`px-1.5 py-0.5 rounded text-[8.5px] font-black border flex items-center justify-center min-w-[20px] ${
                                        isTaken 
                                            ? 'bg-emerald-950 border-emerald-500 text-emerald-400' 
                                            : isSkipped 
                                                ? 'bg-rose-950 border-rose-500/30 text-rose-500' 
                                                : isChecking 
                                                    ? 'bg-slate-900 border-brand-500 text-brand-400 animate-ping'
                                                    : 'bg-slate-950 border-slate-900 text-slate-700'
                                    }`}
                                >
                                    {isTaken ? 'TRUE' : isSkipped ? 'FALSE' : isChecking ? '?' : '·'}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            
            {/* Output console alert */}
            {step >= 4 && (
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    className="px-4 py-2 border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg"
                >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Output Console: "Negative"
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-slate-300 bg-slate-900/60 border border-brand-500/10 px-4 py-2.5 rounded-2xl max-w-sm backdrop-blur-sm"
                >
                    {cur.label}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. LoopVis (Loop iterations) — Progress ring & timeline track
// ─────────────────────────────────────────────────────────────────────────────
const LoopVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const frames = [
        { label: 'Loops let us repeat code without writing it multiple times.', i: '?', condition: 'Ready', out: [] },
        { label: 'A for loop has three parts: initialization, condition, and update.', i: '?', condition: 'Ready', out: [] },
        { label: 'We start with i equals 2. This is our initialization.', i: 2, condition: 'Initialized', out: [] },
        { label: 'The condition checks: is i less than or equal to n? If yes, we enter the loop body.', i: 2, condition: '2 <= 10 ? True', out: [] },
        { label: 'We print the value of i, which is 2. The update step adds 2 to i. Now i is 4.', i: 4, condition: '4 <= 10 ? True', out: [2] },
        { label: 'We check again: is 4 <= 10? Yes! Print 4. Update: i becomes 6.', i: 6, condition: '6 <= 10 ? True', out: [2, 4] },
        { label: 'This continues: print 6, 8, and 10. When i becomes 12, the condition checks as False.', i: 12, condition: '12 <= 10 ? False', out: [2, 4, 6, 8, 10] },
        { label: 'Condition checked as False. The loop terminates.', i: 12, condition: 'End of Loop', out: [2, 4, 6, 8, 10] },
        { label: 'The loop ran 5 times, printing all even numbers from 2 to 10.', i: 12, condition: 'Finished', out: [2, 4, 6, 8, 10] },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(2000 / speed));
    const cur = frames[step] || frames[0];

    useEffect(() => {
        onStepChange?.(step);
    }, [step, onStepChange]);

    const iterationCount = cur.out.length;
    const progressPercent = Math.min(100, (iterationCount / 5) * 100);
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    return (
        <div className="w-full max-w-md flex flex-col items-center gap-5 select-none font-mono">
            
            {/* Loop progress trace timeline header */}
            <div className="flex justify-between w-full max-w-sm px-2 text-[8px] text-slate-500 border-b border-slate-900 pb-2">
                <span className="font-extrabold uppercase">LOOP EXECUTION STAGES:</span>
                <div className="flex gap-1.5 items-center">
                    {Array.from({ length: 5 }).map((_, idx) => {
                        const active = idx < iterationCount;
                        const isCurrent = idx === iterationCount && step >= 3 && step < 6;
                        return (
                            <motion.span
                                key={idx}
                                animate={{
                                    scale: isCurrent ? 1.3 : 1,
                                    backgroundColor: active ? '#10B981' : isCurrent ? '#3B82F6' : '#1E293B',
                                    boxShadow: active ? '0 0 8px #10b981' : 'none'
                                }}
                                className="w-2.5 h-2.5 rounded-full"
                            />
                        );
                    })}
                </div>
            </div>

            {/* Loop Variable & Conditions */}
            <div className="flex gap-4 w-full max-w-sm">
                
                {/* Loop Variable Card */}
                <div className="border-2 border-brand-500/20 bg-[#020617] p-3 rounded-2xl flex flex-col items-center flex-1 relative overflow-hidden shadow-lg">
                    <span className="text-[8px] text-[#475569] uppercase font-bold">Counter (i)</span>
                    <motion.span 
                        key={cur.i} 
                        initial={{ scale: 0.5, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }} 
                        className="text-4xl font-black text-slate-100 my-1 font-mono"
                    >
                        {cur.i}
                    </motion.span>
                    <span className="text-[7.5px] font-black text-brand-400 bg-brand-950 px-1.5 py-0.5 rounded border border-brand-500/10">VARIABLE</span>
                </div>
                
                {/* Iteration circle radial progress */}
                <div className="border-2 border-slate-800 bg-[#020617] p-3 rounded-2xl flex flex-col items-center flex-1 justify-center relative shadow-lg">
                    <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r={radius} stroke="#1e293b" strokeWidth="4" fill="transparent" />
                        <motion.circle 
                            cx="32" cy="32" r={radius} stroke="#10b981" strokeWidth="4" fill="transparent"
                            strokeDasharray={circumference}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 0.4 }}
                        />
                    </svg>
                    <span className="absolute text-[10px] font-extrabold text-slate-200">
                        {iterationCount}/5
                    </span>
                    <span className="text-[7px] text-[#475569] uppercase font-bold mt-1">Iter Scale</span>
                </div>

                {/* Condition Card */}
                <motion.div 
                    animate={{
                        borderColor: cur.condition.includes('True') ? '#10B981' : cur.condition.includes('False') ? '#EF4444' : '#F59E0B20'
                    }}
                    className="border-2 bg-[#020617] p-3 rounded-2xl flex flex-col items-center flex-1 shadow-lg"
                >
                    <span className="text-[8px] text-[#475569] uppercase font-bold">i &lt;= 10</span>
                    <motion.span 
                        key={cur.condition} 
                        initial={{ opacity: 0, y: -4 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className={`text-[9px] font-black mt-3.5 px-2 py-0.5 rounded border ${
                            cur.condition.includes('True') 
                                ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400' 
                                : cur.condition.includes('False') 
                                    ? 'bg-rose-950 border-rose-500/50 text-rose-500' 
                                    : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                    >
                        {cur.condition}
                    </motion.span>
                </motion.div>
            </div>

            {/* Loop iteration states history table */}
            {step >= 2 && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="w-full max-w-sm border border-slate-900 bg-slate-950/60 p-3 rounded-2xl flex flex-col gap-1 text-[9px] text-slate-500"
                >
                    <span className="font-extrabold text-slate-400 uppercase block mb-1">Iteration Stack Trace:</span>
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between border-b border-slate-900/60 pb-0.5 font-bold">
                            <span>Step Counter</span>
                            <span>Condition</span>
                            <span>Operation</span>
                        </div>
                        {Array.from({ length: iterationCount + (step >= 3 && step < 6 ? 1 : 0) }).map((_, idx) => {
                            const isNew = idx === iterationCount;
                            const val = (idx + 1) * 2;
                            return (
                                <motion.div 
                                    key={idx}
                                    initial={isNew ? { opacity: 0, x: -5 } : undefined}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex justify-between leading-normal ${isNew ? 'text-brand-400 font-bold' : ''}`}
                                >
                                    <span>i = {val}</span>
                                    <span>{val} &lt;= 10 ? True</span>
                                    <span>Print({val})</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}

            {/* Console output display */}
            <div className="w-full max-w-sm bg-[#020617] border border-slate-900 rounded-2xl p-4 flex flex-col gap-1.5 min-h-[64px] shadow-inner relative">
                <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                    <span className="text-[8px] text-[#475569] uppercase font-bold flex items-center gap-1">
                        <Terminal className="w-3 h-3 text-slate-500" /> Console stdout
                    </span>
                    {iterationCount > 0 && (
                        <span className="text-[7.5px] text-emerald-500 font-black bg-emerald-950 border border-emerald-500/20 px-2 py-0.5 rounded">
                            {iterationCount} EVENS PRINTED
                        </span>
                    )}
                </div>
                <div className="flex gap-2.5 text-sm font-extrabold text-emerald-400 items-center pl-1">
                    {cur.out.map((val, idx) => (
                        <motion.span 
                            key={idx} 
                            initial={{ scale: 0, y: 10 }} 
                            animate={{ scale: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className="bg-emerald-950/20 border border-emerald-500/20 px-2.5 py-0.5 rounded text-xs"
                        >
                            {val}
                        </motion.span>
                    ))}
                    {playing && step < frames.length - 1 && (
                        <span className="w-1.5 h-3.5 bg-emerald-400 animate-pulse inline-block" />
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-slate-300 bg-slate-900/60 border border-brand-500/10 px-4 py-2.5 rounded-2xl max-w-sm backdrop-blur-sm">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. ArrayVis (Max element linear scan) — Pointer carets & Gold Crown
// ─────────────────────────────────────────────────────────────────────────────
const ArrayVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const arr = [3, 1, 4, 1, 5];
    const frames = [
        { label: 'An array stores multiple values of the same type in consecutive memory locations.', curIdx: -1, max: 3 },
        { label: 'We declare an array of integers. Each element lives next to the other in memory.', curIdx: -1, max: 3 },
        { label: 'We read 5 values: 3, 1, 4, 1, 5. They go into indices 0 through 4.', curIdx: -1, max: 3 },
        { label: 'To find the maximum, we start by assuming the first element is the largest (max = 3).', curIdx: 0, max: 3 },
        { label: 'Compare elements: arr[1] (1) < 3 (no change). arr[2] (4) > 3 → Update max to 4!', curIdx: 2, max: 4 },
        { label: 'Compare elements: arr[3] (1) < 4 (no change). arr[4] (5) > 4 → Update max to 5!', curIdx: 4, max: 5 },
        { label: 'We have scanned the entire array. The maximum value is 5.', curIdx: -1, max: 5 },
        { label: 'Array random access is O(1). Finding the max element requires O(n) linear scan.', curIdx: -1, max: 5 },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(2100 / speed));
    const cur = frames[step] || frames[0];

    useEffect(() => {
        onStepChange?.(step);
    }, [step, onStepChange]);

    return (
        <div className="w-full max-w-md flex flex-col items-center gap-6 select-none font-mono">
            {/* Array contiguous blocks */}
            <div className="flex gap-2 relative pt-8 pb-3 min-h-[90px] w-full justify-center bg-slate-950/20 px-2 py-4 border border-slate-900 rounded-2xl shadow-inner">
                {arr.map((val, idx) => {
                    const isScanning = cur.curIdx === idx;
                    const isMax = cur.max === val && step >= 3;
                    const isScanned = step >= 3 && idx < cur.curIdx;
                    
                    return (
                        <div key={idx} className="flex flex-col items-center gap-1.5 relative">
                            {/* Scanning cursor pointing down */}
                            {isScanning && (
                                <motion.div 
                                    layoutId="arrayScanPointer"
                                    className="absolute -top-7 text-xs font-black text-amber-500 animate-bounce"
                                >
                                    ▼
                                </motion.div>
                            )}
                            
                            <motion.div
                                animate={{
                                    y: isScanning ? -8 : 0,
                                    borderColor: isScanning ? '#F59E0B' : isMax ? '#10B981' : 'rgba(255,255,255,0.06)',
                                    backgroundColor: isScanning ? 'rgba(245,158,11,0.1)' : isMax ? 'rgba(16,185,129,0.1)' : '#020617',
                                    scale: isScanning ? 1.08 : 1,
                                    opacity: isScanned ? 0.45 : 1
                                }}
                                className="w-12 h-12 border-2 rounded-xl flex flex-col items-center justify-center text-xs relative overflow-hidden group shadow"
                            >
                                {/* Byte Offset */}
                                <span className="text-[6px] text-slate-500 absolute top-0.5 font-bold">+{idx * 4}B</span>
                                
                                <span className="font-extrabold mt-1.5" style={{ color: isScanning ? '#F59E0B' : isMax ? '#10B981' : '#94A3B8' }}>{val}</span>
                                
                                {/* Gold Crown Badge 👑 on active max cell */}
                                {isMax && (
                                    <motion.span 
                                        initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}
                                        className="absolute top-0.5 right-0.5 text-[8px]"
                                    >
                                        👑
                                    </motion.span>
                                )}
                            </motion.div>
                            <span className="text-[8px] text-[#475569] font-bold">idx [{idx}]</span>
                            <span className="text-[7px] text-brand-500/60 font-semibold">0x20{idx * 4}</span>
                        </div>
                    );
                })}
            </div>

            {/* comparison status traces */}
            <div className="flex gap-4 items-center">
                {/* Max tracker card */}
                <motion.div 
                    animate={{
                        borderColor: step >= 3 ? '#10B981' : 'rgba(255,255,255,0.06)'
                    }}
                    className="px-4 py-2 border-2 bg-[#020617] rounded-2xl flex flex-col items-center shadow-lg min-w-[120px]"
                >
                    <span className="text-[8px] text-[#475569] uppercase font-bold">Current Max</span>
                    <div className="flex gap-1 items-baseline">
                        <motion.span 
                            key={cur.max} 
                            initial={{ scale: 0.6 }} animate={{ scale: 1 }}
                            className="font-extrabold text-2xl text-emerald-400"
                        >
                            {step >= 3 ? cur.max : '?'}
                        </motion.span>
                        {step >= 3 && <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />}
                    </div>
                </motion.div>
                
                {/* Code statement execution bubble (understanding booster!) */}
                {cur.curIdx !== -1 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-[#0c1325] border-2 border-brand-500/20 p-2.5 rounded-xl text-[10px] text-slate-300 max-w-[200px]"
                    >
                        <span className="text-brand-400 font-extrabold uppercase block mb-1">REAL-TIME CODE TRACE:</span>
                        <div className="font-bold flex items-center gap-1.5 leading-normal bg-slate-950 p-1.5 rounded border border-slate-900 text-[9.5px]">
                            <code>if ({arr[cur.curIdx]} &gt; {cur.max})</code>
                        </div>
                        <div className="text-[9px] mt-1.5 text-slate-400 font-semibold">
                            {arr[cur.curIdx] > cur.max ? (
                                <span className="text-emerald-400 font-extrabold">Evaluates to TRUE! Update Max ✓</span>
                            ) : (
                                <span className="text-slate-500">Evaluates to FALSE. Keep Max ✗</span>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>

            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-slate-300 bg-slate-900/60 border border-brand-500/10 px-4 py-2.5 rounded-2xl max-w-sm backdrop-blur-sm">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. StringVis (Palindrome check) — Mirror line & matching pointers
// ─────────────────────────────────────────────────────────────────────────────
const StringVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const text = 'racecar';
    const frames = [
        { label: 'String "racecar" as char array ending with "\\0".', left: -1, right: -1, match: true },
        { label: 'Compare index 0 ("r") and index 6 ("r"). Match!', left: 0, right: 6, match: true },
        { label: 'Compare index 1 ("a") and index 5 ("a"). Match!', left: 1, right: 5, match: true },
        { label: 'Compare index 2 ("c") and index 4 ("c"). Match!', left: 2, right: 4, match: true },
        { label: 'Pointers meet at index 3 ("e"). Loop complete.', left: 3, right: 3, match: true },
        { label: 'Confirmed! "racecar" is a Palindrome.', left: -1, right: -1, match: true, final: true },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(2100 / speed));
    const cur = frames[step];

    useEffect(() => {
        onStepChange?.(step);
    }, [step, onStepChange]);

    return (
        <div className="w-full max-w-md flex flex-col items-center gap-6 select-none font-mono">
            {/* Palindrome array board */}
            <div className="flex gap-2 items-end justify-center relative p-5 bg-slate-950/20 border border-slate-900 rounded-2xl shadow-inner min-h-[100px] w-full">
                
                {/* Mirror indicator line in step >= 1 */}
                {step >= 1 && step < 5 && (
                    <motion.div 
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 0.35, scaleY: 1 }}
                        className="absolute inset-y-2 left-[46.5%] w-0.5 bg-gradient-to-b from-brand-500 via-emerald-500 to-transparent pointer-events-none"
                    />
                )}
                
                {Array.from(text).map((char, idx) => {
                    const isL = cur.left === idx;
                    const isR = cur.right === idx;
                    const active = isL || isR;
                    const matchedPair = step >= 2 && (idx < cur.left || idx > cur.right || cur.left === -1);
                    
                    return (
                        <div key={idx} className="flex flex-col items-center gap-1.5 relative">
                            {/* Pointer arrows pointing down */}
                            <span className="text-[9px] text-[#475569] font-black h-4 flex items-center">
                                {isL && isR ? (
                                    <motion.span animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="text-amber-500 font-extrabold">L=R</motion.span>
                                ) : isL ? (
                                    <motion.span animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="text-brand-400 font-extrabold">L➔</motion.span>
                                ) : isR ? (
                                    <motion.span animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="text-brand-400 font-extrabold">➔R</motion.span>
                                ) : '·'}
                            </span>
                            
                            <motion.div
                                animate={{
                                    borderColor: active ? '#3B82F6' : matchedPair ? '#10B981' : 'rgba(255,255,255,0.06)',
                                    backgroundColor: active ? 'rgba(59,130,246,0.1)' : matchedPair ? 'rgba(16,185,129,0.05)' : '#020617',
                                    scale: active ? 1.06 : 1,
                                }}
                                className={`w-10 h-10 border-2 rounded-xl flex items-center justify-center text-xs font-black relative`}
                                style={{
                                    boxShadow: cur.final ? '0 0 18px -3px #10b981' : 'none'
                                }}
                            >
                                <span className={active ? 'text-slate-100' : matchedPair ? 'text-emerald-400' : 'text-slate-500'}>{char}</span>
                                {matchedPair && (
                                    <span className="absolute bottom-0.5 right-0.5 text-[6px] text-emerald-500">✓</span>
                                )}
                            </motion.div>
                            <span className="text-[7px] text-[#475569] font-bold">[{idx}]</span>
                        </div>
                    );
                })}
                
                {/* Null terminator */}
                <div className="flex flex-col items-center gap-1.5 opacity-35 relative">
                    <span className="text-[9px] text-transparent h-4">·</span>
                    <div className="w-10 h-10 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-[10px] text-slate-600 bg-slate-950 shadow-sm font-semibold">
                        \0
                    </div>
                    <span className="text-[7px] text-[#475569] font-bold">[7]</span>
                </div>
            </div>

            {/* Connecting indices matching tracer */}
            {step >= 1 && step < 5 && cur.left !== -1 && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[9px] text-[#475569] uppercase font-bold flex gap-4 border border-slate-900 bg-slate-950/40 p-2.5 rounded-2xl items-center shadow-inner"
                >
                    <div className="flex items-center gap-1 text-slate-300">
                        <span className="bg-slate-900 border border-slate-800 w-5 h-5 rounded flex items-center justify-center text-[10px] font-black text-brand-400">"{text[cur.left]}"</span>
                        <span>at L[{cur.left}]</span>
                    </div>
                    <span className="text-emerald-500 font-black">==</span>
                    <div className="flex items-center gap-1 text-slate-300">
                        <span className="bg-slate-900 border border-slate-800 w-5 h-5 rounded flex items-center justify-center text-[10px] font-black text-brand-400">"{text[cur.right]}"</span>
                        <span>at R[{cur.right}]</span>
                    </div>
                    <span className="bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[8px] font-black">EQUAL ✓</span>
                </motion.div>
            )}

            {/* complete banner */}
            {cur.final && (
                <motion.div 
                    initial={{ scale: 0.8, rotate: -2, opacity: 0 }} 
                    animate={{ scale: 1, rotate: 0, opacity: 1 }} 
                    className="px-4 py-2.5 border-2 border-emerald-500 bg-emerald-950/20 text-emerald-400 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg"
                >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" /> Confirmed Palindrome! "racecar"
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-slate-300 bg-slate-900/60 border border-brand-500/10 px-4 py-2.5 rounded-2xl max-w-sm backdrop-blur-sm">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 11. PointerVis (Pointer dereferencing) — Value beams & byte layouts
// ─────────────────────────────────────────────────────────────────────────────
const PointerVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const frames = [
        { label: 'Pointers store memory addresses of other variables.', active: '', xVal: 5, pVal: 'nullptr' },
        { label: 'Integer variable x allocated at memory address 0x7ffd04.', active: 'x', xVal: 5, pVal: 'nullptr' },
        { label: 'Pointer variable p declared at address 0x7ffd80.', active: 'p', xVal: 5, pVal: 'nullptr' },
        { label: 'Initialize p = &x. p now holds address 0x7ffd04.', active: 'link', xVal: 5, pVal: '0x7ffd04' },
        { label: 'Accessing *p dereferences it, reading the value inside x (5).', active: 'deref', xVal: 5, pVal: '0x7ffd04' },
        { label: 'Execute: *p = 10. Modifies the value inside x through the pointer!', active: 'write', xVal: 10, pVal: '0x7ffd04' },
        { label: 'Complete! Dereferenced write successful.', active: '', xVal: 10, pVal: '0x7ffd04' },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(2100 / speed));
    const cur = frames[step];

    useEffect(() => {
        onStepChange?.(step);
    }, [step, onStepChange]);

    const isLinked = cur.pVal !== 'nullptr';
    const isDeref = cur.active === 'deref';
    const isWrite = cur.active === 'write';

    return (
        <div className="w-full max-w-md flex flex-col items-center gap-6 select-none font-mono">
            
            {/* Pointer RAM simulation space */}
            <div className="flex gap-12 items-center justify-center relative w-full px-5 py-8 bg-slate-950/20 border border-slate-900 rounded-2xl shadow-inner min-h-[140px]">
                
                {/* Pointer Card p */}
                <motion.div
                    animate={{
                        borderColor: cur.active === 'p' || cur.active === 'link' ? '#3B82F6' : 'rgba(255,255,255,0.06)',
                        backgroundColor: cur.active === 'p' || cur.active === 'link' ? 'rgba(59,130,246,0.1)' : '#020617',
                        scale: cur.active === 'p' || cur.active === 'link' ? 1.04 : 1
                    }}
                    className="border-2 p-3.5 rounded-2xl flex flex-col items-center min-w-[110px] shadow-lg relative z-10"
                >
                    <span className="text-[7px] text-[#475569] font-bold">ADDRESS: 0x7ffd80</span>
                    <span className="text-[10px] font-extrabold text-brand-400 mt-0.5">p (int*)</span>
                    
                    {/* Monospace pointer value cells */}
                    <motion.div 
                        key={cur.pVal} 
                        initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                        className="text-[10px] font-bold text-slate-100 bg-slate-950 px-2 py-1 rounded border border-slate-900/60 mt-2 flex items-center gap-1 shadow-inner font-mono"
                    >
                        {cur.pVal}
                    </motion.div>
                    <span className="text-[7px] text-slate-500 font-extrabold mt-1.5 uppercase">4-Byte Pointer</span>
                </motion.div>

                {/* Animated connecting dashed SVG line */}
                {isLinked && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        <defs>
                            <marker id="ptrArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
                            </marker>
                        </defs>
                        <motion.line
                            x1="145" y1="50%"
                            x2="245" y2="50%"
                            stroke="#10B981"
                            strokeWidth={2}
                            markerEnd="url(#ptrArrow)"
                            animate={{
                                strokeDasharray: isDeref || isWrite ? '4,4' : '0,0',
                                opacity: isLinked ? 1 : 0.2
                            }}
                        />
                        {/* Flow particle value beam */}
                        {(isDeref || isWrite) && (
                            <motion.circle 
                                r="4"
                                fill={isWrite ? '#EF4444' : '#10B981'}
                                animate={{
                                    cx: isWrite ? [245, 145] : [145, 245],
                                    cy: ['50%', '50%'],
                                    opacity: [0.2, 1, 0.2]
                                }}
                                transition={{ repeat: Infinity, duration: 1.2 / speed, ease: 'easeInOut' }}
                            />
                        )}
                    </svg>
                )}

                {/* Target Variable Card x */}
                <motion.div
                    animate={{
                        borderColor: cur.active === 'x' || isWrite ? '#10B981' : 'rgba(255,255,255,0.06)',
                        backgroundColor: cur.active === 'x' || isWrite ? 'rgba(16,185,129,0.1)' : '#020617',
                        scale: cur.active === 'x' || isWrite ? 1.04 : 1
                    }}
                    className="border-2 p-3.5 rounded-2xl flex flex-col items-center min-w-[110px] shadow-lg relative z-10"
                >
                    <span className="text-[7px] text-[#475569] font-bold">ADDRESS: 0x7ffd04</span>
                    <span className="text-[10px] font-extrabold text-emerald-400 mt-0.5">x (int)</span>
                    
                    {/* Monospace value cell */}
                    <motion.div 
                        key={cur.xVal} 
                        initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                        className="text-2xl font-black text-slate-100 bg-slate-950/80 border border-slate-900/60 px-3 py-0.5 rounded shadow-inner mt-1 text-center font-mono"
                    >
                        {cur.xVal}
                    </motion.div>
                    
                    <div className="flex gap-0.5 mt-2">
                        {Array.from({ length: 4 }).map((_, bIdx) => (
                            <span key={bIdx} className="w-1.5 h-1.5 rounded bg-slate-800" />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Dereferencing pointer explainer card (understanding booster!) */}
            {(isDeref || isWrite) && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`px-3 py-2.5 border rounded-xl text-[10px] font-semibold flex items-start gap-2 shadow-md ${
                        isWrite 
                            ? 'bg-rose-950/30 border-rose-500/30 text-rose-400' 
                            : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400'
                    }`}
                >
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold block uppercase text-[9.5px]">
                            {isWrite ? 'DEREFERENCE WRITE (*p = 10)' : 'DEREFERENCE READ (*p)'}
                        </span>
                        <span>
                            {isWrite 
                                ? 'Compiler accesses address 0x7ffd04 inside pointer variable p, then overwrites x from 5 to 10.' 
                                : 'Compiler opens address 0x7ffd04 stored in p and retrieves its physical integer content.'}
                        </span>
                    </div>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-slate-300 bg-slate-900/60 border border-brand-500/10 px-4 py-2.5 rounded-2xl max-w-sm backdrop-blur-sm">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 12. RefValueVis (Pass by Value vs Pass by Reference Swap) — Stack frames
// ─────────────────────────────────────────────────────────────────────────────
const RefValueVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const frames = [
        { label: 'There are two ways to pass arguments to a function: by value and by reference.', mode: 'intro', valL: [3, 7], valR: [3, 7] },
        { label: 'By value: the function receives a COPY. We call swapByValue with a=3 and b=7.', mode: 'copy-value', valL: [3, 7], valR: [3, 7] },
        { label: 'Inside the function, the clones/copies are swapped inside its stack frame.', mode: 'swapping-value', valL: [7, 3], valR: [3, 7] },
        { label: 'Function ends, clones deleted. Original Main values remain completely unchanged!', mode: 'fail-value', valL: [3, 7], valR: [3, 7] },
        { label: 'By reference: the function receives the ORIGINAL variables using references (int&).', mode: 'copy-ref', valL: [3, 7], valR: [3, 7] },
        { label: 'Inside the function, we swap the actual values directly in the original locations.', mode: 'swapping-ref', valL: [3, 7], valR: [7, 3] },
        { label: 'The swap succeeds! Back in main, a is now 7 and b is now 3.', mode: 'success-ref', valL: [3, 7], valR: [7, 3] },
        { label: 'Use pass-by-reference when functions need to modify arguments or to avoid copying large objects.', mode: 'success-ref', valL: [3, 7], valR: [7, 3] },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(2300 / speed));
    const cur = frames[step] || frames[0];

    useEffect(() => {
        onStepChange?.(step);
    }, [step, onStepChange]);

    const isByValue = step >= 1 && step <= 3;
    const isByRef = step >= 4;

    return (
        <div className="w-full max-w-lg flex flex-col items-center gap-5 select-none font-mono">
            {/* Visual panels separated by VS Divider */}
            <div className="flex gap-4 w-full relative">
                
                {/* Left Panel: By Value */}
                <motion.div 
                    animate={{
                        borderColor: isByValue ? '#3B82F6' : 'rgba(255,255,255,0.06)',
                        boxShadow: isByValue ? '0 0 30px -10px rgba(59,130,246,0.15)' : 'none'
                    }}
                    className="flex-1 border-2 bg-slate-950/40 rounded-2xl p-4 flex flex-col items-center relative gap-3.5 transition-all"
                >
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                        isByValue ? 'bg-brand-950 border-brand-500 text-brand-400' : 'bg-slate-900 border-slate-800 text-[#475569]'
                    }`}>
                        PASS BY VALUE
                    </span>
                    
                    {/* Main frame values */}
                    <div className="flex flex-col gap-1 w-full bg-[#020617] border border-slate-900 rounded-xl p-2.5 items-center">
                        <span className="text-[7px] text-slate-500 font-extrabold mb-1">main() STACK FRAME</span>
                        <div className="flex gap-3 justify-center w-full">
                            <div className="flex flex-col items-center flex-1">
                                <span className="text-[7px] text-[#475569] font-bold">int a</span>
                                <div className="w-9 h-9 border border-slate-800 rounded-lg flex items-center justify-center text-xs font-bold text-slate-300 bg-slate-950">
                                    3
                                </div>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                                <span className="text-[7px] text-[#475569] font-bold">int b</span>
                                <div className="w-9 h-9 border border-slate-800 rounded-lg flex items-center justify-center text-xs font-bold text-slate-300 bg-slate-950">
                                    7
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Function scope helper frame */}
                    <AnimatePresence>
                        {(cur.mode === 'copy-value' || cur.mode === 'swapping-value') && (
                            <motion.div 
                                initial={{ opacity: 0, y: 15, scale: 0.95 }} 
                                animate={{ opacity: 1, y: 0, scale: 1 }} 
                                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                                className="border border-brand-500/20 bg-brand-500/5 p-3 rounded-xl w-full flex flex-col items-center relative"
                            >
                                {cur.mode === 'copy-value' && (
                                    <div className="absolute top-[-10px] text-[7px] bg-brand-500 text-[#020617] px-1 py-0.5 rounded font-black shadow-md">
                                        CLONING COPIES
                                    </div>
                                )}
                                
                                <span className="text-[8px] text-brand-400 font-extrabold uppercase mb-2">swap(int x, int y)</span>
                                
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[7px] text-slate-500">copy x</span>
                                        <motion.div 
                                            animate={{ x: cur.mode === 'swapping-value' ? 18 : 0 }} 
                                            className="w-8 h-8 border border-brand-500/40 rounded-lg flex items-center justify-center text-[10px] font-bold text-brand-400 bg-slate-950"
                                        >
                                            {cur.valL[0]}
                                        </motion.div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[7px] text-slate-500">copy y</span>
                                        <motion.div 
                                            animate={{ x: cur.mode === 'swapping-value' ? -18 : 0 }} 
                                            className="w-8 h-8 border border-brand-500/40 rounded-lg flex items-center justify-center text-[10px] font-bold text-brand-400 bg-slate-950"
                                        >
                                            {cur.valL[1]}
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    
                    {cur.mode === 'fail-value' && (
                        <motion.div 
                            initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                            className="text-[9px] text-rose-500 bg-rose-950/20 border border-rose-500/30 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1.5 shadow"
                        >
                            <XCircle className="w-3.5 h-3.5 text-rose-500" /> Copies Swapped, main UNCHANGED
                        </motion.div>
                    )}
                </motion.div>

                {/* Right Panel: By Reference */}
                <motion.div 
                    animate={{
                        borderColor: isByRef ? '#10B981' : 'rgba(255,255,255,0.06)',
                        boxShadow: isByRef ? '0 0 30px -10px rgba(16,185,129,0.15)' : 'none'
                    }}
                    className="flex-1 border-2 bg-slate-950/40 rounded-2xl p-4 flex flex-col items-center relative gap-3.5 transition-all"
                >
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                        isByRef ? 'bg-emerald-950 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-[#475569]'
                    }`}>
                        PASS BY REFERENCE
                    </span>
                    
                    {/* Main original values */}
                    <div className="flex flex-col gap-1 w-full bg-[#020617] border border-slate-900 rounded-xl p-2.5 items-center relative">
                        <span className="text-[7px] text-slate-500 font-extrabold mb-1">main() STACK FRAME</span>
                        <div className="flex gap-3 justify-center w-full">
                            <div className="flex flex-col items-center flex-1">
                                <span className="text-[7px] text-[#475569] font-bold">int a</span>
                                <motion.div 
                                    animate={{ borderColor: cur.mode.includes('ref') ? '#10B981' : '#1e293b' }} 
                                    className="w-9 h-9 border rounded-lg flex items-center justify-center text-xs font-bold text-slate-100 bg-slate-950"
                                >
                                    <motion.span key={cur.valR[0]} initial={{ scale: 0.6 }} animate={{ scale: 1 }}>{cur.valR[0]}</motion.span>
                                </motion.div>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                                <span className="text-[7px] text-[#475569] font-bold">int b</span>
                                <motion.div 
                                    animate={{ borderColor: cur.mode.includes('ref') ? '#10B981' : '#1e293b' }} 
                                    className="w-9 h-9 border rounded-lg flex items-center justify-center text-xs font-bold text-slate-100 bg-slate-950"
                                >
                                    <motion.span key={cur.valR[1]} initial={{ scale: 0.6 }} animate={{ scale: 1 }}>{cur.valR[1]}</motion.span>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Function scope referencing */}
                    <AnimatePresence>
                        {(cur.mode === 'copy-ref' || cur.mode === 'swapping-ref') && (
                            <motion.div 
                                initial={{ opacity: 0, y: 15, scale: 0.95 }} 
                                animate={{ opacity: 1, y: 0, scale: 1 }} 
                                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                                className="border border-emerald-500/20 bg-emerald-500/5 p-3 rounded-xl w-full flex flex-col items-center relative"
                            >
                                <div className="absolute top-[-10px] text-[7px] bg-emerald-500 text-[#020617] px-1 py-0.5 rounded font-black shadow-md">
                                    DIRECT ADDRESS ALIASES
                                </div>
                                
                                <span className="text-[8px] text-emerald-400 font-extrabold uppercase mb-1">swap(int&amp; x, int&amp; y)</span>
                                <span className="text-[7px] text-slate-500 text-center leading-normal">(references original main variables directly)</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {cur.mode.includes('success') && (
                        <motion.div 
                            initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                            className="text-[9px] text-emerald-400 bg-emerald-950/20 border border-emerald-500/30 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1.5 shadow"
                        >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Swap succeeds directly!
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Pass by Value vs Reference comparison scale table */}
            <div className="w-full border border-slate-900 bg-slate-950/60 p-3 rounded-2xl flex flex-col gap-1.5 text-[9px] text-slate-500">
                <span className="font-extrabold text-slate-400 uppercase">SWAP LOGIC COMPARISON SUMMARY:</span>
                <div className="flex gap-4">
                    <span className="flex items-center gap-1">🔴 Value copies swap inside isolated helper local function, originals unedited.</span>
                    <span className="flex items-center gap-1">🟢 Reference (int&) operates on original memory slot addresses, swap succeeds.</span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-slate-300 bg-slate-900/60 border border-brand-500/10 px-4 py-2.5 rounded-2xl max-w-sm backdrop-blur-sm">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 13. StructVis (Structure memory template) — Alignment margins & blueprints
// ─────────────────────────────────────────────────────────────────────────────
const StructVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const frames = [
        { label: 'A Struct groups related variables of different types under one custom name.', active: 'blueprint', values: ['', '', ''] },
        { label: 'Define a Student struct with three members: name, age, and grade.', active: 'blueprint', values: ['', '', ''] },
        { label: 'Think of a struct as a blueprint. It describes the format, but does not allocate memory yet.', active: 'blueprint', values: ['', '', ''] },
        { label: 'Instantiate Student s. The compiler allocates contiguous stacked segments in memory.', active: 'alloc', values: ['(garbage)', '(garbage)', '(garbage)'] },
        { label: 'Use the dot operator to assign values: s.name = "Alice", s.age = 20, s.grade = \'A\'.', active: 'done', values: ['"Alice"', '20', "'A'"] },
        { label: 'The dot operator writes each member at its fixed offset from the base address (+0, +32, +36).', active: 'done', values: ['"Alice"', '20', "'A'"] },
        { label: 'Structs are the foundation of compound datatypes and object-oriented programming classes.', active: 'done', values: ['"Alice"', '20', "'A'"] },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(2200 / speed));
    const cur = frames[step] || frames[0];

    useEffect(() => {
        onStepChange?.(step);
    }, [step, onStepChange]);

    const isBlueprint = step <= 2;
    const isAllocated = step >= 3;

    return (
        <div className="w-full max-w-md flex flex-col items-center gap-5 select-none font-mono">
            
            {/* Memory blueprint template space */}
            <div className="border-2 border-brand-500/10 bg-[#020617] rounded-2xl w-full p-4.5 flex flex-col relative gap-3.5 shadow-2xl">
                
                {/* Blueprint vs Allocation status labels */}
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                    <span className="text-[10px] text-brand-400 font-extrabold uppercase">
                        struct Student s;
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black border ${
                        isBlueprint 
                            ? 'bg-slate-950 border-slate-800 text-slate-500' 
                            : 'bg-emerald-950 border-emerald-500/30 text-emerald-400'
                    }`}>
                        {isBlueprint ? 'BLUEPRINT ONLY (0 BYTES)' : 'ALLOCATED IN RAM (40B TOTAL)'}
                    </span>
                </div>
                
                <div className="flex flex-col gap-3">
                    {[
                        { label: 's.name', offset: '+0 Bytes', type: 'string (32B)', color: '#60A5FA', valIdx: 0 },
                        { label: 's.age', offset: '+32 Bytes', type: 'int (4B)', color: '#F59E0B', valIdx: 1 },
                        { label: 's.grade', offset: '+36 Bytes', type: 'char (1B)', color: '#10B981', valIdx: 2 }
                    ].map((member, index) => {
                        const cellVal = cur.values[member.valIdx];
                        const isGarbage = cellVal === '(garbage)';
                        
                        return (
                            <motion.div
                                key={member.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    borderColor: isBlueprint ? 'rgba(255,255,255,0.06)' : member.color,
                                    backgroundColor: isBlueprint ? '#020617' : `${member.color}08`,
                                    borderStyle: isBlueprint ? 'dashed' : 'solid'
                                }}
                                transition={{ delay: index * 0.1 }}
                                className="border-2 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs relative overflow-hidden group bg-[#020617]"
                            >
                                {/* Write sweep beam on allocation/writing values */}
                                {step === 4 && (
                                    <motion.div 
                                        initial={{ x: '-100%' }} animate={{ x: '150%' }}
                                        transition={{ duration: 0.6, delay: index * 0.15 }}
                                        className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                                    />
                                )}
                                
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-extrabold text-slate-100">{member.label}</span>
                                    <span className="text-[8px] text-[#475569] uppercase font-bold">{member.type} · offset: {member.offset}</span>
                                </div>
                                
                                <AnimatePresence mode="wait">
                                    {isAllocated && (
                                        <motion.span 
                                            key={cellVal}
                                            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                            className={`font-bold px-2 py-0.5 rounded bg-slate-950 border ${
                                                isGarbage 
                                                    ? 'text-slate-600 border-slate-900 italic' 
                                                    : 'border-slate-800 shadow-inner'
                                            }`}
                                            style={{ color: isGarbage ? undefined : member.color }}
                                        >
                                            {cellVal}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                    
                    {/* Visual Padding Alignment margin representation */}
                    {isAllocated && (
                        <motion.div 
                            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                            className="border-2 border-dashed border-amber-500/20 bg-amber-500/5 rounded-xl px-4 py-1.5 flex items-center justify-between text-[10px] text-amber-500/60"
                        >
                            <span>Alignment padding gap</span>
                            <span className="bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded text-[8px] font-bold text-slate-500 uppercase">3 BYTES PADDING</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Struct memory layout block diagram for alignment explaining */}
            {isAllocated && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="w-full border border-slate-900 bg-slate-950/60 p-3 rounded-2xl flex flex-col gap-1.5 text-[9px] text-slate-500 leading-normal"
                >
                    <span className="font-extrabold text-slate-400 uppercase">STRUCT RAM BOUNDARY ALIGNMENT:</span>
                    <span>Most 32-bit/64-bit CPUs read memory in 4-byte packages. To maximize speed, the compiler pads the <strong>char (1B)</strong> with 3 unused bytes, aligning the struct size to a fast 40-byte grid boundary.</span>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-slate-300 bg-slate-900/60 border border-brand-500/10 px-4 py-2.5 rounded-2xl max-w-sm backdrop-blur-sm">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 14. STLComplexityVis (STL containers & Big-O curves) — Push/pop & capacity
// ─────────────────────────────────────────────────────────────────────────────
const STLComplexityVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const [activeTab, setActiveTab] = useState<'stl' | 'complexity'>('stl');
    const [subTab, setSubTab] = useState<'vector' | 'stack' | 'queue' | 'map'>('vector');
    
    // Auto toggle tabs if playing is on
    const frames = [
        { label: 'The STL provides ready-made data containers so you do not need to build them from scratch.', activeSub: 'vector', tab: 'stl' },
        { label: 'A vector is a dynamic array. We push_back 10, 20, and 30. It grows and doubles capacity when full.', activeSub: 'vector', tab: 'stl' },
        { label: 'Vector access by index is O(1), and push_back is amortized O(1). Very efficient!', activeSub: 'vector', tab: 'stl' },
        { label: 'A map stores key-value pairs sorted by key. We insert a maps to 1, and b maps to 2.', activeSub: 'map', tab: 'stl' },
        { label: 'Map operations like insert and lookup take O(log N) because it uses a balanced red-black tree internally.', activeSub: 'map', tab: 'stl' },
        { label: 'For faster lookups, use unordered_map which uses hashing for O(1) average time.', activeSub: 'map', tab: 'complexity' },
        { label: 'STL containers all share common methods: size(), empty(), begin(), end(). Learn one, and patterns apply to all.', activeSub: 'vector', tab: 'complexity' }
    ];
    
    const [step] = useSteps(frames.length, playing, Math.round(2400 / speed));
    const cur = frames[step] || frames[0];

    useEffect(() => {
        onStepChange?.(step);
    }, [step, onStepChange]);

    useEffect(() => {
        if (cur) {
            setActiveTab(cur.tab as 'stl' | 'complexity');
            if (cur.tab === 'stl') {
                setSubTab(cur.activeSub as 'vector' | 'stack' | 'queue' | 'map');
            }
        }
    }, [step, cur]);

    // Vector capacity simulation
    const vectorCapacity = subTab === 'vector' && step >= 2 ? 4 : 2;
    const vectorElements = [10, 20, 30];

    return (
        <div className="w-full max-w-md flex flex-col items-center gap-5 select-none font-mono">
            {/* Header selector tab */}
            <div className="flex bg-slate-900/60 p-1 border border-brand-500/10 rounded-full text-[10px] w-fit shadow-lg backdrop-blur-sm">
                <button
                    onClick={() => setActiveTab('stl')}
                    className={`px-4 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition-all ${
                        activeTab === 'stl' ? 'bg-brand-500 text-[#020617] shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <Layers className="w-3.5 h-3.5" />
                    STL Containers
                </button>
                <button
                    onClick={() => setActiveTab('complexity')}
                    className={`px-4 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition-all ${
                        activeTab === 'complexity' ? 'bg-brand-500 text-[#020617] shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <Cpu className="w-3.5 h-3.5" />
                    Big-O Curves
                </button>
            </div>

            {/* Main Interactive Display Panel */}
            <div className="w-full h-48 bg-[#020617] border border-brand-500/10 rounded-2xl p-4 flex flex-col justify-center relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.02),transparent_70%)]" />
                
                {activeTab === 'stl' ? (
                    <div className="flex flex-col gap-4 items-center">
                        <div className="flex gap-2.5 text-[9px] border-b border-slate-900 pb-2 w-full justify-center">
                            {(['vector', 'stack', 'queue', 'map'] as const).map(t => (
                                <span 
                                    key={t} 
                                    className={`px-2 py-0.5 rounded border transition-colors ${
                                        subTab === t 
                                            ? 'text-brand-300 font-extrabold bg-brand-950 border-brand-500/30' 
                                            : 'text-[#475569] border-transparent'
                                    }`}
                                >
                                    {t.toUpperCase()}
                                </span>
                            ))}
                        </div>
                        
                        {/* Tab displays */}
                        {subTab === 'vector' && (
                            <div className="flex flex-col gap-2 items-center">
                                <div className="flex gap-2">
                                    {Array.from({ length: vectorCapacity }).map((_, idx) => {
                                        const filled = idx < vectorElements.length;
                                        return (
                                            <motion.div
                                                key={idx}
                                                animate={{ 
                                                    borderColor: filled ? '#3B82F6' : '#1E293B',
                                                    scale: filled ? [0.9, 1.05, 1] : 1
                                                }}
                                                className="w-10 h-10 border-2 rounded-xl flex items-center justify-center text-xs font-black bg-[#020617]/50 shadow"
                                            >
                                                {filled ? vectorElements[idx] : ''}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                                <span className="text-[8px] text-[#475569] font-bold uppercase mt-1">
                                    Size: 3 / Capacity: {vectorCapacity} (Double capacity triggers dynamic allocations)
                                </span>
                            </div>
                        )}
                        {subTab === 'stack' && (
                            <div className="flex flex-col gap-1 w-24 border-b-4 border-x-4 border-pink-500/80 rounded-b px-2 py-1.5 items-center h-28 justify-end bg-pink-500/5">
                                {[30, 20, 10].map((v, i) => (
                                    <motion.div
                                        key={v}
                                        initial={{ y: -60, opacity: 0 }} 
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.15, type: 'spring' }}
                                        className="w-full text-center py-1 border border-pink-500/30 bg-pink-950/20 rounded-lg text-[9px] font-black text-pink-400"
                                    >
                                        {v}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                        {subTab === 'queue' && (
                            <div className="flex gap-2 items-center h-20">
                                <span className="text-[8px] text-[#475569] font-black">FRONT</span>
                                <div className="flex border-y-2 border-emerald-500/80 p-2 rounded-xl gap-2 bg-emerald-500/5">
                                    {[10, 20, 30].map((v, i) => (
                                        <motion.div 
                                            key={v} 
                                            initial={{ x: 30, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="w-8 h-8 rounded-lg border border-emerald-500/30 flex items-center justify-center text-[10px] text-emerald-400 font-extrabold bg-[#020617] shadow-sm"
                                        >
                                            {v}
                                        </motion.div>
                                    ))}
                                </div>
                                <span className="text-[8px] text-[#475569] font-black">REAR</span>
                            </div>
                        )}
                        {subTab === 'map' && (
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="flex gap-3">
                                    {[{ k: 'a', v: '1' }, { k: 'b', v: '2' }].map((node) => (
                                        <motion.div 
                                            key={node.k} 
                                            initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                                            className="border-2 border-brand-500/20 bg-brand-950/10 px-3 py-2 rounded-xl flex flex-col items-center text-[10px]"
                                        >
                                            <span className="text-brand-300 font-black">Key: "{node.k}"</span>
                                            <span className="text-slate-400">Val: {node.v}</span>
                                        </motion.div>
                                    ))}
                                </div>
                                <span className="text-[8px] text-[#475569] font-bold uppercase mt-1">
                                    Tree Balanced Indexes | Search complexity: O(log N)
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    // Complexity Charts Grid drawing using stroke dash arrays
                    <div className="w-full h-full relative flex items-center justify-center bg-slate-950/20">
                        <svg className="w-full h-full text-slate-800">
                            <line x1="10%" y1="10%" x2="10%" y2="85%" stroke="#1e293b" strokeWidth={1.5} />
                            <line x1="10%" y1="85%" x2="95%" y2="85%" stroke="#1e293b" strokeWidth={1.5} />
                            
                            {/* O(1) */}
                            <motion.line 
                                x1="10%" y1="75%" x2="90%" y2="75%" stroke="#10B981" strokeWidth={2} strokeDasharray="3,3"
                                initial={{ strokeDashoffset: 50 }} animate={{ strokeDashoffset: 0 }}
                                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                            />
                            <text x="91%" y="76%" fill="#10B981" className="text-[8px] font-black">O(1)</text>

                            {/* O(log N) */}
                            <motion.path 
                                d="M 40 120 Q 120 100 360 90" fill="none" stroke="#F59E0B" strokeWidth={2}
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5 }}
                            />
                            <text x="91%" y="64%" fill="#F59E0B" className="text-[8px] font-black">O(log N)</text>

                            {/* O(N) */}
                            <motion.line 
                                x1="10%" y1="85%" x2="90%" y2="35%" stroke="#3B82F6" strokeWidth={2}
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5 }}
                            />
                            <text x="91%" y="37%" fill="#3B82F6" className="text-[8px] font-black">O(N)</text>

                            {/* O(N^2) */}
                            <motion.path 
                                d="M 40 135 Q 150 120 220 15" fill="none" stroke="#EF4444" strokeWidth={2.5}
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5 }}
                            />
                            <text x="52%" y="15%" fill="#EF4444" className="text-[8px] font-black">O(N²)</text>
                        </svg>
                    </div>
                )}
            </div>

            {/* Big-O Cheat Sheet (understanding booster!) */}
            {activeTab === 'complexity' && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="w-full border border-slate-900 bg-slate-950/60 p-3 rounded-2xl flex flex-col gap-1.5 text-[9px] text-slate-500 leading-normal"
                >
                    <span className="font-extrabold text-slate-400 uppercase">Complexity Cheat Sheet:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                        <span className="text-emerald-400 font-bold">O(1): Constant (Instant speed)</span>
                        <span className="text-amber-500 font-bold">O(log N): Logarithmic (Fast search)</span>
                        <span className="text-blue-400 font-bold">O(N): Linear scan (Moderate)</span>
                        <span className="text-rose-500 font-bold">O(N²): Quadratic (Slow loops)</span>
                    </div>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-slate-300 bg-slate-900/60 border border-brand-500/10 px-4 py-2.5 rounded-2xl max-w-sm backdrop-blur-sm">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 15. Default & Router
// ─────────────────────────────────────────────────────────────────────────────
const DefaultVis: React.FC<{ topicTitle: string }> = ({ topicTitle }) => (
    <div className="flex flex-col items-center justify-center gap-4 text-center px-6 font-mono">
        <div className="w-16 h-16 rounded-2xl bg-brand-700/20 border border-brand-500/30 flex items-center justify-center text-2xl font-mono text-brand-300 shadow-xl animate-pulse">
            {'</'}
        </div>
        <p className="text-sm font-bold text-text-1">{topicTitle}</p>
        <p className="text-xs text-text-2 leading-relaxed max-w-[220px]">
            Press ▶ Play to animate, or write your solution and click Run Code.
        </p>
    </div>
);

export type VisProps = { playing: boolean; speed: number; topicId: string; topicTitle: string };

export const TopicVisualizer: React.FC<VisProps & { onStepChange?: (s: number) => void }> = ({ playing, speed, topicId, topicTitle, onStepChange }) => {
    // Prerequisite
    if (topicId === 'c-install-guide')                        return <InstallGuideVis   playing={playing} speed={speed} onStepChange={onStepChange} />;
    if (topicId === 'variables')                              return <VariablesVis      playing={playing} speed={speed} onStepChange={onStepChange} />;
    if (topicId === 'data-types')                             return <DataTypesVis      playing={playing} speed={speed} onStepChange={onStepChange} />;
    if (topicId === 'input-output')                           return <IOStreamVis       playing={playing} speed={speed} onStepChange={onStepChange} />;
    if (topicId === 'syntax')                                 return <SyntaxVis         playing={playing} speed={speed} onStepChange={onStepChange} />;
    
    // Beginner DSA
    if (topicId === 'what-is-data-structure-static-dynamic')   return <DSClassificationVis playing={playing} speed={speed} onStepChange={onStepChange} />;
    if (topicId === 'control-statements')                      return <ConditionalsVis   playing={playing} speed={speed} onStepChange={onStepChange} />;
    if (topicId === 'loops')                                  return <LoopVis           playing={playing} speed={speed} onStepChange={onStepChange} />;
    if (topicId === 'arrays')                                 return <ArrayVis          playing={playing} speed={speed} onStepChange={onStepChange} />;
    if (topicId === 'arrays-strings')                         return <StringVis         playing={playing} speed={speed} onStepChange={onStepChange} />;
    if (topicId === 'pointers')                               return <PointerVis        playing={playing} speed={speed} onStepChange={onStepChange} />;
    if (topicId === 'by-value-vs-by-reference')               return <RefValueVis       playing={playing} speed={speed} onStepChange={onStepChange} />;
    if (topicId === 'structures')                             return <StructVis         playing={playing} speed={speed} onStepChange={onStepChange} />;
    if (topicId === 'stl-complexity')                         return <STLComplexityVis  playing={playing} speed={speed} onStepChange={onStepChange} />;
    
    // Fallback to old mappings for OOP and DS modules
    if (topicId === 'linked-lists')                            return <LinkedListVisualizer isPlaying={playing} speed={speed} />;
    if (topicId === 'binary-search-tree')                      return <BSTVisualizer />;
    if (topicId === 'sorting-algorithms')                      return <SortingRaceVisualizer />;
    
    return <DefaultVis topicTitle={topicTitle} />;
};
