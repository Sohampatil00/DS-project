import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, ArrowRight, CheckCircle2 } from 'lucide-react';
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
        if (!playing) return;
        const id = setInterval(() => {
            setStep(s => (s + 1) % count);
        }, msPerStep);
        return () => clearInterval(id);
    }, [playing, msPerStep, count, setStep]);

    // reset local step only if not controlled
    React.useEffect(() => {
        if (!ctx) {
            setLocalStep(0);
        }
    }, [count, !!ctx]);

    return [step, setStep] as const;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. InstallGuideVis (C++ Installation Guide)
// ─────────────────────────────────────────────────────────────────────────────
const InstallGuideVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const frames = [
        { title: 'Environment Setup', cmd: '', out: 'Welcome to C++ Setup! Let\'s install g++ compiler.', stepInfo: 'Let\'s get started!' },
        { title: 'Download Compiler', cmd: 'curl -LO https://msys2.org/msys2-x86_64-latest.exe', out: 'Downloading MSYS2 installer...\n  100% 124MB [===================>] 12MB/s', stepInfo: 'Downloading MSYS2...' },
        { title: 'Install g++', cmd: 'pacman -S --noconfirm mingw-w64-x86_64-gcc', out: 'resolving dependencies...\ninstalling mingw-w64-x86_64-gcc-13.2.0...\n[OK] Added g++ compiler successfully!', stepInfo: 'Installing g++...' },
        { title: 'Verify path', cmd: 'g++ --version', out: 'g++ (Rev1, Built by MSYS2 project) 13.2.0\nCopyright (C) 2023 Free Software Foundation, Inc.', stepInfo: 'Verifying Path...' },
        { title: 'Create main.cpp', cmd: 'cat <<EOF > hello.cpp\n#include <iostream>\nint main() { std::cout << "Setup Complete!"; }\nEOF', out: 'File "hello.cpp" written successfully.', stepInfo: 'Writing code...' },
        { title: 'Compile source', cmd: 'g++ hello.cpp -o hello', out: 'Compiling hello.cpp...\nLinking execution binaries...', stepInfo: 'Compiling hello.cpp...' },
        { title: 'Run executable', cmd: './hello', out: 'Setup Complete!\n\nProcess returned 0 (0x0)', stepInfo: 'Success! Setup Complete!' },
    ];
    const [step] = useSteps(frames.length, playing, Math.round(2200 / speed));
    const cur = frames[step];

    useEffect(() => {
        onStepChange?.(step);
    }, [step, onStepChange]);

    return (
        <div className="w-full max-w-md bg-[#090D16] border border-brand-500/20 rounded-xl overflow-hidden shadow-2xl select-none font-mono">
            <div className="flex items-center justify-between px-4 py-2 bg-brand-950/80 border-b border-brand-500/10">
                <div className="flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-brand-400" />
                    <span className="text-xs font-bold text-brand-300">MinGW64 Terminal Shell</span>
                </div>
                <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green/60" />
                </div>
            </div>
            <div className="p-4 space-y-3 min-h-[220px] text-xs">
                <div className="text-[10px] text-[#475569]">Last login: Wed May 20 18:52:00 on msys2</div>
                
                {frames.slice(0, step + 1).map((f, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                        {f.cmd && (
                            <div className="flex gap-1 text-brand-300">
                                <span className="text-brand-500 font-bold">$</span>
                                <span>{f.cmd}</span>
                            </div>
                        )}
                        {idx === step ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-emerald-400 whitespace-pre-wrap leading-relaxed border-l-2 border-emerald-500/40 pl-2 bg-emerald-500/5 py-1 rounded"
                            >
                                {f.out}
                            </motion.div>
                        ) : (
                            <div className="text-text-2 opacity-60 whitespace-pre-wrap pl-2">{f.out}</div>
                        )}
                    </motion.div>
                ))}
                
                {playing && step < frames.length - 1 && (
                    <span className="inline-block w-2 h-4 bg-brand-400 animate-pulse" />
                )}
            </div>
            <div className="bg-brand-950/60 px-4 py-2 border-t border-brand-500/10 flex items-center justify-between text-[10px] text-[#475569]">
                <span>Step {step + 1} of {frames.length}</span>
                <span className="text-brand-400 font-bold">{cur.stepInfo}</span>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. VariablesVis (Variables memory cells)
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
        <div className="w-full max-w-md flex flex-col gap-4 select-none">
            <div className="flex items-center justify-between bg-brand-950/40 px-3 py-1.5 rounded-lg border border-brand-500/10 font-mono text-[10px] text-[#475569]">
                <div className="flex items-center gap-1"><Cpu className="w-3 h-3 text-brand-400" /> Stack Segment Memory</div>
                <div>{cur.desc}</div>
            </div>
            
            <div className="flex flex-col gap-2">
                {[
                    { name: 'age', type: 'int', addr: '0x7ffd04', color: '#3B82F6', values: ['(garbage)', '25', '25', '25', '25', '25'] },
                    { name: 'height', type: 'float', addr: '0x7ffd08', color: '#F59E0B', values: ['(garbage)', '(garbage)', '5.9f', '5.9f', '5.9f', '5.9f'] },
                    { name: 'name', type: 'string', addr: '0x7ffd0c', color: '#10B981', values: ['(garbage)', '(garbage)', '(garbage)', '"Alice"', '"Alice"', '"Alice"'] }
                ].map((v) => {
                    const cellVal = v.values[step] || '(garbage)';
                    const isActive = cur.name === v.name;
                    const isGarbage = cellVal.includes('garbage');
                    
                    return (
                        <motion.div
                            key={v.name}
                            animate={{
                                borderColor: isActive ? v.color : '#1E293B',
                                backgroundColor: isActive ? `${v.color}10` : '#090D16'
                            }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-3 border rounded-xl px-4 py-3 shadow-md"
                        >
                            <span className="text-[10px] font-mono text-text-2 w-14 shrink-0">{v.addr}</span>
                            <span className="text-[10px] font-mono w-14 shrink-0" style={{ color: v.color }}>{v.type}</span>
                            <span className="text-xs font-bold text-text-1 flex-1">{v.name}</span>
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={cellVal}
                                    initial={{ scale: 0.5, y: -5, opacity: 0 }}
                                    animate={{ scale: 1, y: 0, opacity: 1 }}
                                    exit={{ scale: 0.5, y: 5, opacity: 0 }}
                                    className={`text-xs font-mono font-bold ${isGarbage ? 'text-text-2 opacity-30 italic' : ''}`}
                                    style={{ color: isGarbage ? undefined : v.color }}
                                >
                                    {cellVal}
                                </motion.span>
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. DataTypesVis (Visual size & alignment representations)
// ─────────────────────────────────────────────────────────────────────────────
const DataTypesVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const types = [
        { name: 'int', bytes: 4, color: '#3B82F6', val: '42', desc: '4 Bytes. Renders integer numeric values up to ~2 billion.' },
        { name: 'float', bytes: 4, color: '#F59E0B', val: '3.14f', desc: '4 Bytes. Floating point representation, utilizes IEEE 754 format.' },
        { name: 'double', bytes: 8, color: '#EC4899', val: '2.71828', desc: '8 Bytes. Double precision float, fits 15 decimal digits.' },
        { name: 'char', bytes: 1, color: '#10B981', val: "'Z'", desc: '1 Byte. Primarily used to store characters, fits ASCII bounds.' },
        { name: 'bool', bytes: 1, color: '#A78BFA', val: 'true', desc: '1 Byte. Holds true (1) or false (0). Uses full byte due to addressing limits.' }
    ];
    const [step] = useSteps(7, playing, Math.round(2000 / speed));

    useEffect(() => {
        onStepChange?.(step);
    }, [step, onStepChange]);

    return (
        <div className="w-full max-w-md flex flex-col gap-5 select-none font-mono">
            <div className="h-10 text-center flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {step === 0 ? (
                        <motion.span key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-[#475569]">
                            C++ Datatypes relative sizes in RAM bytes
                        </motion.span>
                    ) : step === 6 ? (
                        <motion.span key="sizeof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-brand-400">
                            The sizeof operator lets you check exactly how many bytes each type occupies on your system.
                        </motion.span>
                    ) : (
                        <motion.div key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-text-1">
                            <span className="font-bold" style={{ color: types[step - 1]?.color }}>{types[step - 1]?.name.toUpperCase()}</span>: {types[step - 1]?.desc}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <div className="flex flex-col gap-3">
                {types.map((t, idx) => {
                    const isActive = step === idx + 1;
                    const isPassed = step > idx + 1;
                    
                    return (
                        <div key={t.name} className="flex items-center gap-4">
                            <span className="w-16 text-xs text-text-2 font-bold">{t.name}</span>
                            <div className="flex-1 h-9 bg-brand-950/40 border border-brand-500/10 rounded-lg overflow-hidden flex relative">
                                {Array.from({ length: t.bytes }).map((_, bIdx) => (
                                    <motion.div
                                        key={bIdx}
                                        initial={{ scaleY: 0 }}
                                        animate={{
                                            scaleY: (isActive || isPassed) ? 1 : 0,
                                            backgroundColor: isActive ? `${t.color}25` : isPassed ? '#1E293B' : 'transparent',
                                            borderColor: isActive ? t.color : isPassed ? '#334155' : 'transparent',
                                        }}
                                        className="flex-1 h-full border-r border-brand-500/10 flex items-center justify-center text-[10px]"
                                    >
                                        {(isActive || isPassed) && (
                                            <span style={{ color: isActive ? t.color : '#64748B' }}>B{bIdx + 1}</span>
                                        )}
                                    </motion.div>
                                ))}
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold"
                                        style={{ color: t.color }}
                                    >
                                        sizeof() = {t.bytes}
                                    </motion.span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. IOStreamVis (cin >> / cout << streams)
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
            <div className="w-full flex items-center justify-between relative px-2 py-4">
                
                {/* Keyboard / Input */}
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 ${cur.active === 'cin' ? 'border-brand-500 bg-brand-500/10' : 'border-slate-800 bg-[#090D16]'}`}>
                    <span className="text-[9px] text-[#475569]">input</span>
                    <span className="text-sm font-bold text-text-1">3  7</span>
                </div>
                
                {/* Arrow to cin */}
                <div className="flex-1 h-2 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#1E293B]/40 rounded-full" />
                    {cur.active === 'cin' && (
                        <motion.div
                            initial={{ x: -60 }} animate={{ x: 60 }}
                            transition={{ repeat: Infinity, duration: 1.2 / speed, ease: 'linear' }}
                            className="w-3 h-3 rounded-full bg-brand-500 shadow-glow shrink-0"
                        />
                    )}
                    <span className="absolute -top-4 text-[8px] text-brand-400">cin &gt;&gt;</span>
                </div>

                {/* RAM / Execution memory */}
                <div className={`w-28 h-20 border-2 rounded-2xl flex flex-col justify-center px-3 gap-1 relative ${cur.active === 'mem' || cur.active === 'alu' ? 'border-amber bg-amber/5' : 'border-slate-800 bg-[#090D16]'}`}>
                    <span className="absolute -top-3.5 left-3 text-[8px] text-amber">RAM Segment</span>
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-[#475569]">a:</span>
                        <span className="font-bold text-amber">{step >= 3 ? '3' : '(garbage)'}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                        <span className="text-[#475569]">b:</span>
                        <span className="font-bold text-amber">{step >= 3 ? '7' : '(garbage)'}</span>
                    </div>
                    {step >= 4 && (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-amber text-[#090D16] font-bold text-[8px] px-1.5 rounded">
                            SUM = 10
                        </motion.div>
                    )}
                </div>

                {/* Arrow to cout */}
                <div className="flex-1 h-2 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#1E293B]/40 rounded-full" />
                    {cur.active === 'cout' && (
                        <motion.div
                            initial={{ x: -60 }} animate={{ x: 60 }}
                            transition={{ repeat: Infinity, duration: 1.2 / speed, ease: 'linear' }}
                            className="w-3 h-3 rounded-full bg-emerald-500 shadow-glow shrink-0"
                        />
                    )}
                    <span className="absolute -top-4 text-[8px] text-emerald-400">cout &lt;&lt;</span>
                </div>

                {/* Terminal / stdout */}
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border-2 ${cur.active === 'stdout' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-[#090D16]'}`}>
                    <span className="text-[9px] text-[#475569]">stdout</span>
                    <span className="text-sm font-bold text-emerald-400">{step >= 6 ? '10' : ''}</span>
                </div>
            </div>

            {/* Label and description */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-center text-text-2 bg-brand-900/30 border border-brand-500/10 px-4 py-2.5 rounded-xl max-w-sm"
                >
                    {cur.label}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. SyntaxVis (C++ Program anatomical analysis)
// ─────────────────────────────────────────────────────────────────────────────
const SyntaxVis: React.FC<{ playing: boolean; speed: number; onStepChange?: (s: number) => void }> = ({ playing, speed, onStepChange }) => {
    const frames = [
        { highlightIdx: -1, label: 'Let\'s break down standard C++ file syntax structure.', note: 'Overview' },
        { highlightIdx: 0, label: 'Imports preprocessor directives to access functions like std::cout.', note: '#include' },
        { highlightIdx: 1, label: 'Avoids prefixing objects with std:: namespace context.', note: 'using namespace' },
        { highlightIdx: 2, label: 'Every operating execution starts from main() function entry.', note: 'int main()' },
        { highlightIdx: 3, label: 'Indicates boundary blocks where block routines reside.', note: 'Braces block' },
        { highlightIdx: 4, label: 'Insertion operator (<<) pushes variables to stdout streams.', note: 'cout statement' },
        { highlightIdx: 5, label: 'Compiler reads double slash as comments and ignores them.', note: 'Comments' },
        { highlightIdx: 6, label: 'Returns success code 0 back to base operating system.', note: 'Return statement' },
    ];
    const codeLines = [
        { line: '#include <iostream>', comment: '// Header import' },
        { line: 'using namespace std;', comment: '// Scope namespace' },
        { line: 'int main() {', comment: '// Entry point function' },
        { line: '    // Print output to console', comment: '// In-line documentation' },
        { line: '    cout << "Name: Soham" << endl;', comment: '// Prints standard output' },
        { line: '    return 0;', comment: '// Exit code return success' },
        { line: '}', comment: '// End function block' }
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

    return (
        <div className="w-full max-w-md flex flex-col gap-4 select-none font-mono">
            <div className="bg-[#090D16] border border-brand-500/10 rounded-xl overflow-hidden shadow-xl">
                <div className="px-3 py-2 bg-brand-950/60 flex items-center justify-between border-b border-brand-500/10 text-[9px] text-[#475569]">
                    <span>anatomy_main.cpp</span>
                    <span className="text-brand-400 font-bold">{cur.note}</span>
                </div>
                <div className="p-4 space-y-1 text-xs">
                    {codeLines.map((lineObj, idx) => {
                        const isHighlighted = lineHighlightMap[cur.highlightIdx]?.includes(idx);
                        
                        return (
                            <motion.div
                                key={idx}
                                animate={{
                                    backgroundColor: isHighlighted ? '#1E3A8A25' : 'transparent',
                                    color: isHighlighted ? '#60A5FA' : '#94A3B8'
                                }}
                                className="px-2 py-0.5 rounded flex justify-between gap-4"
                            >
                                <span className={idx === 3 ? 'text-emerald-500' : ''}>{lineObj.line}</span>
                                <span className="text-[10px] text-text-2 opacity-40">{lineObj.comment}</span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-text-2 bg-brand-900/35 border border-brand-500/10 px-4 py-2 rounded-xl"
                >
                    {cur.label}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. DSClassificationVis (Data structures classifications)
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
        { id: 'root', label: 'Data Structures', x: '50%', y: '10%', color: '#60A5FA' },
        { id: 'linear', label: 'Linear', x: '25%', y: '40%', color: '#3B82F6', parent: 'root' },
        { id: 'nonlinear', label: 'Non-Linear', x: '75%', y: '40%', color: '#EC4899', parent: 'root' },
        { id: 'static', label: 'Static (Array)', x: '12%', y: '75%', color: '#F59E0B', parent: 'linear' },
        { id: 'dynamic', label: 'Dynamic (Vector)', x: '38%', y: '75%', color: '#10B981', parent: 'linear' },
        { id: 'tree', label: 'Tree / Graph', x: '75%', y: '75%', color: '#A78BFA', parent: 'nonlinear' }
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
            {/* SVG Tree */}
            <div className="w-full h-44 bg-[#090D16] border border-brand-500/10 rounded-xl relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full">
                    {/* Render connectors */}
                    {treeNodes.filter(n => n.parent).map(n => {
                        const parent = treeNodes.find(p => p.id === n.parent);
                        const isConnActive = isActive(n.id) && isActive(parent!.id);
                        return (
                            <motion.line
                                key={n.id}
                                x1={parent!.x} y1={parent!.y}
                                x2={n.x} y2={n.y}
                                stroke={isConnActive ? '#60A5FA' : '#1E293B'}
                                strokeWidth={isConnActive ? 2 : 1}
                                animate={{ opacity: isActive(n.id) ? 1 : 0.2 }}
                            />
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
                                scale: active ? 1.05 : 0.9,
                                opacity: active ? 1 : 0.4,
                                borderColor: active ? n.color : '#1E293B',
                                backgroundColor: active ? `${n.color}15` : '#090D16'
                            }}
                            className="absolute px-2.5 py-1 border rounded-lg text-[9px] font-bold text-center z-10"
                        >
                            <span style={{ color: active ? n.color : '#64748B' }}>{n.label}</span>
                        </motion.div>
                    );
                })}
            </div>
            
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-text-2 bg-brand-900/35 border border-brand-500/10 px-4 py-2 rounded-xl max-w-sm"
                >
                    {cur.label}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. ConditionalsVis (Flowchart branches)
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

    return (
        <div className="w-full max-w-md flex flex-col items-center gap-6 select-none font-mono">
            <div className="flex gap-4 items-center justify-center w-full">
                
                {/* Decision box */}
                <div className={`px-4 py-2.5 border-2 rounded-xl flex flex-col items-center text-xs ${step >= 1 ? 'border-brand-500 bg-brand-500/10' : 'border-slate-800'}`}>
                    <span className="text-[9px] text-text-2">input value</span>
                    <span className="font-bold">n = -5</span>
                </div>
                
                <ArrowRight className="w-4 h-4 text-text-2 opacity-50" />
                
                {/* Branches */}
                <div className="flex flex-col gap-2 text-[10px]">
                    {[
                        { cond: 'n > 0', label: 'Positive', color: '#10B981' },
                        { cond: 'n < 0', label: 'Negative', color: '#F43F5E' },
                        { cond: 'else', label: 'Zero', color: '#F59E0B' }
                    ].map(b => {
                        const active = (b.label === 'Positive' && step === 2) || (b.label === 'Negative' && step >= 3);
                        return (
                            <motion.div
                                key={b.label}
                                animate={{
                                    borderColor: active ? b.color : '#1E293B',
                                    backgroundColor: active ? `${b.color}15` : '#090D16',
                                    opacity: active ? 1 : 0.4
                                }}
                                className="px-3 py-1.5 border rounded-lg flex gap-4 items-center justify-between min-w-[150px]"
                            >
                                <span className="font-bold">{b.cond}</span>
                                <span style={{ color: b.color }}>{b.label}</span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
            
            {step >= 4 && (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="px-4 py-2 border-2 border-emerald-500 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Output: Negative
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-text-2 bg-brand-900/35 border border-brand-500/10 px-4 py-2 rounded-xl max-w-sm"
                >
                    {cur.label}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. LoopVis (Loop iterations)
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

    return (
        <div className="w-full max-w-md flex flex-col items-center gap-5 select-none font-mono">
            {/* Visual Loop Tracker */}
            <div className="flex gap-6 w-full max-w-sm justify-between">
                
                {/* Loop Variable */}
                <div className="border-2 border-brand-500/20 bg-[#090D16] p-4 rounded-2xl flex flex-col items-center flex-1">
                    <span className="text-[9px] text-[#475569]">Counter variable i</span>
                    <motion.span key={cur.i} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-3xl font-bold text-brand-300">{cur.i}</motion.span>
                </div>
                
                {/* Condition Box */}
                <div className="border-2 border-amber/20 bg-[#090D16] p-4 rounded-2xl flex flex-col items-center flex-1">
                    <span className="text-[9px] text-[#475569]">Check condition i &lt;= 10</span>
                    <motion.span key={cur.condition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-amber mt-2">{cur.condition}</motion.span>
                </div>
            </div>

            {/* Print Output */}
            <div className="w-full max-w-sm bg-brand-950/40 border border-brand-500/10 rounded-xl p-3 flex flex-col gap-1 min-h-[56px]">
                <span className="text-[8px] text-[#475569]">Console stdout</span>
                <div className="flex gap-2 text-sm font-bold text-emerald-400">
                    {cur.out.map((val) => (
                        <motion.span key={val} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>{val}</motion.span>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-text-2 bg-brand-900/35 border border-brand-500/10 px-4 py-2 rounded-xl max-w-sm">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. ArrayVis (Max element linear scan)
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
            {/* Visual contiguous cells */}
            <div className="flex gap-2">
                {arr.map((val, idx) => {
                    const isScanning = cur.curIdx === idx;
                    const isMax = cur.max === val && step >= 3;
                    
                    return (
                        <div key={idx} className="flex flex-col items-center gap-1">
                            <motion.div
                                animate={{
                                    y: isScanning ? -10 : 0,
                                    borderColor: isScanning ? '#F59E0B' : isMax ? '#10B981' : '#1E293B',
                                    backgroundColor: isScanning ? '#F59E0B20' : isMax ? '#10B98120' : '#090D16',
                                    scale: isScanning ? 1.08 : 1
                                }}
                                className="w-12 h-12 border-2 rounded-xl flex items-center justify-center text-sm font-bold"
                            >
                                <span style={{ color: isScanning ? '#F59E0B' : isMax ? '#10B981' : '#94A3B8' }}>{val}</span>
                            </motion.div>
                            <span className="text-[8px] text-[#475569]">[{idx}]</span>
                            <span className="text-[8px] text-brand-400">0x20{idx * 4}</span>
                        </div>
                    );
                })}
            </div>

            {/* Max Tracker */}
            <div className="px-4 py-2 border border-brand-500/10 bg-brand-950/20 rounded-xl flex gap-4 text-xs">
                <div>
                    <span className="text-[#475569]">maxVal: </span>
                    <motion.span key={cur.max} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="font-bold text-emerald-400">{step >= 3 ? cur.max : '?'}</motion.span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-text-2 bg-brand-900/35 border border-brand-500/10 px-4 py-2 rounded-xl max-w-sm">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. StringVis (Palindrome check)
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
            <div className="flex gap-1.5 items-end justify-center">
                {Array.from(text).map((char, idx) => {
                    const isL = cur.left === idx;
                    const isR = cur.right === idx;
                    const active = isL || isR;
                    
                    return (
                        <div key={idx} className="flex flex-col items-center gap-1">
                            <span className="text-[8px] text-text-2 opacity-50" style={{ color: active ? '#60A5FA' : undefined }}>
                                {isL && isR ? 'L=R' : isL ? 'L' : isR ? 'R' : '·'}
                            </span>
                            <motion.div
                                animate={{
                                    borderColor: active ? '#60A5FA' : '#1E293B',
                                    backgroundColor: active ? '#60A5FA15' : '#090D16',
                                    scale: active ? 1.05 : 1
                                }}
                                className="w-10 h-10 border-2 rounded-lg flex items-center justify-center text-xs font-bold"
                            >
                                <span className={active ? 'text-brand-300' : 'text-[#64748B]'}>{char}</span>
                            </motion.div>
                            <span className="text-[7px] text-text-2 opacity-40">[{idx}]</span>
                        </div>
                    );
                })}
                {/* Null terminator */}
                <div className="flex flex-col items-center gap-1 opacity-45">
                    <span className="text-[8px] text-transparent">·</span>
                    <div className="w-10 h-10 border border-dashed border-[#1E293B] rounded-lg flex items-center justify-center text-xs text-[#475569] bg-[#090D16]/50">
                        \0
                    </div>
                    <span className="text-[7px] text-text-2 opacity-40">[7]</span>
                </div>
            </div>

            {cur.final && (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="px-4 py-2 border-2 border-green bg-green/10 text-green font-bold text-xs rounded-xl">
                    ✓ Palindrome: true
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-text-2 bg-brand-900/35 border border-brand-500/10 px-4 py-2 rounded-xl max-w-sm">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 11. PointerVis (Pointer addresses & dereferencing)
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

    return (
        <div className="w-full max-w-md flex flex-col items-center gap-6 select-none font-mono">
            <div className="flex gap-14 items-center justify-center relative w-full px-4 py-6">
                
                {/* Pointer p */}
                <motion.div
                    animate={{
                        borderColor: cur.active === 'p' || cur.active === 'link' ? '#60A5FA' : '#1E293B',
                        backgroundColor: cur.active === 'p' || cur.active === 'link' ? '#60A5FA15' : '#090D16'
                    }}
                    className="border-2 p-3 rounded-2xl flex flex-col items-center min-w-[100px] shadow-lg relative z-10"
                >
                    <span className="text-[7px] text-[#475569]">address: 0x7ffd80</span>
                    <span className="text-xs font-bold text-brand-400 mb-1">p (int*)</span>
                    <motion.span key={cur.pVal} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-[10px] font-bold text-[#94A3B8]">
                        {cur.pVal}
                    </motion.span>
                </motion.div>

                {/* Arrow SVG indicator */}
                {cur.pVal !== 'nullptr' && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <defs>
                            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
                            </marker>
                        </defs>
                        <motion.line
                            x1="140" y1="52%"
                            x2="250" y2="52%"
                            stroke="#10B981"
                            strokeWidth={2}
                            markerEnd="url(#arrow)"
                            animate={{
                                strokeDasharray: cur.active === 'deref' || cur.active === 'write' ? '5,5' : '0,0'
                            }}
                        />
                    </svg>
                )}

                {/* Variable x */}
                <motion.div
                    animate={{
                        borderColor: cur.active === 'x' || cur.active === 'write' ? '#10B981' : '#1E293B',
                        backgroundColor: cur.active === 'x' || cur.active === 'write' ? '#10B98115' : '#090D16'
                    }}
                    className="border-2 p-3 rounded-2xl flex flex-col items-center min-w-[100px] shadow-lg relative z-10"
                >
                    <span className="text-[7px] text-[#475569]">address: 0x7ffd04</span>
                    <span className="text-xs font-bold text-emerald-400 mb-1">x (int)</span>
                    <motion.span key={cur.xVal} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-xl font-bold text-[#94A3B8]">
                        {cur.xVal}
                    </motion.span>
                </motion.div>
            </div>

            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-text-2 bg-brand-900/35 border border-brand-500/10 px-4 py-2 rounded-xl max-w-sm">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 12. RefValueVis (Pass by Value vs Pass by Reference Swap)
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

    return (
        <div className="w-full max-w-lg flex flex-col items-center gap-5 select-none font-mono">
            <div className="flex gap-4 w-full">
                
                {/* Left: By Value */}
                <div className="flex-1 border border-brand-500/10 bg-[#090D16]/40 rounded-2xl p-4 flex flex-col items-center relative gap-3">
                    <span className="text-[9px] text-[#475569] font-bold">PASS BY VALUE</span>
                    
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <span className="text-[7px] text-[#475569]">a</span>
                            <div className="w-10 h-10 border border-slate-800 rounded-lg flex items-center justify-center text-xs font-bold text-text-1">
                                3
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[7px] text-[#475569]">b</span>
                            <div className="w-10 h-10 border border-slate-800 rounded-lg flex items-center justify-center text-xs font-bold text-text-1">
                                7
                            </div>
                        </div>
                    </div>
                    
                    {/* Function Scope Frame */}
                    {(cur.mode === 'copy-value' || cur.mode === 'swapping-value') && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="border border-brand-500/35 bg-brand-500/5 p-2.5 rounded-xl w-full flex flex-col items-center">
                            <span className="text-[8px] text-brand-400">swapByValue(int a, int b)</span>
                            <div className="flex gap-3 mt-1.5">
                                <motion.div animate={{ x: cur.mode === 'swapping-value' ? 18 : 0 }} className="w-8 h-8 border border-[#3B82F6] rounded flex items-center justify-center text-[10px] font-bold text-[#3B82F6]">
                                    {cur.valL[0]}
                                </motion.div>
                                <motion.div animate={{ x: cur.mode === 'swapping-value' ? -18 : 0 }} className="w-8 h-8 border border-[#3B82F6] rounded flex items-center justify-center text-[10px] font-bold text-[#3B82F6]">
                                    {cur.valL[1]}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                    
                    {cur.mode === 'fail-value' && (
                        <div className="text-[9px] text-rose font-bold">Unchanged in main</div>
                    )}
                </div>

                {/* Right: By Reference */}
                <div className="flex-1 border border-brand-500/10 bg-[#090D16]/40 rounded-2xl p-4 flex flex-col items-center relative gap-3">
                    <span className="text-[9px] text-[#475569] font-bold">PASS BY REFERENCE</span>
                    
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <span className="text-[7px] text-[#475569]">a</span>
                            <motion.div animate={{ borderColor: cur.mode.includes('ref') ? '#10B981' : '#1E293B' }} className="w-10 h-10 border rounded-lg flex items-center justify-center text-xs font-bold text-text-1">
                                <motion.span key={cur.valR[0]} initial={{ scale: 0.6 }} animate={{ scale: 1 }}>{cur.valR[0]}</motion.span>
                            </motion.div>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[7px] text-[#475569]">b</span>
                            <motion.div animate={{ borderColor: cur.mode.includes('ref') ? '#10B981' : '#1E293B' }} className="w-10 h-10 border rounded-lg flex items-center justify-center text-xs font-bold text-text-1">
                                <motion.span key={cur.valR[1]} initial={{ scale: 0.6 }} animate={{ scale: 1 }}>{cur.valR[1]}</motion.span>
                            </motion.div>
                        </div>
                    </div>

                    {/* Function Scope Frame */}
                    {(cur.mode === 'copy-ref' || cur.mode === 'swapping-ref') && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="border border-emerald-500/35 bg-emerald-500/5 p-2.5 rounded-xl w-full flex flex-col items-center">
                            <span className="text-[8px] text-emerald-400">swapByRef(int&amp; a, int&amp; b)</span>
                            <div className="text-[7px] text-text-2 mt-1">(referencing original addresses)</div>
                        </motion.div>
                    )}

                    {cur.mode.includes('success') && (
                        <div className="text-[9px] text-green font-bold">Successfully swapped!</div>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-text-2 bg-brand-900/35 border border-brand-500/10 px-4 py-2 rounded-xl max-w-sm">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 13. StructVis (Structure memory template)
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

    return (
        <div className="w-full max-w-md flex flex-col items-center gap-5 select-none font-mono">
            {/* Struct Template Box */}
            <div className="border border-brand-500/15 bg-[#090D16] rounded-2xl w-full p-4 flex flex-col relative gap-3">
                <span className="text-[10px] text-brand-400 font-bold">struct Student s;</span>
                
                <div className="flex flex-col gap-2">
                    {[
                        { label: 's.name', offset: '+0 Bytes', type: 'string (32B)', color: '#60A5FA', valIdx: 0 },
                        { label: 's.age', offset: '+32 Bytes', type: 'int (4B)', color: '#F59E0B', valIdx: 1 },
                        { label: 's.grade', offset: '+36 Bytes', type: 'char (1B)', color: '#10B981', valIdx: 2 }
                    ].map(member => {
                        const cellVal = cur.values[member.valIdx];
                        const isActive = cur.active === 'blueprint' || cur.active === 'done' || cur.active === member.label.split('.')[1];
                        const isGarbage = cellVal === '(garbage)';
                        
                        return (
                            <motion.div
                                key={member.label}
                                animate={{
                                    borderColor: isActive ? member.color : '#1E293B',
                                    backgroundColor: isActive ? `${member.color}10` : '#090D16'
                                }}
                                className="border rounded-xl px-4 py-2 flex items-center justify-between text-xs"
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold text-text-1">{member.label}</span>
                                    <span className="text-[8px] text-[#475569]">{member.type} | offset: {member.offset}</span>
                                </div>
                                <span className={`font-mono text-xs ${isGarbage ? 'text-text-2 opacity-30 italic' : ''}`} style={{ color: isGarbage ? undefined : member.color }}>
                                    {step >= 3 ? cellVal : ''}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-text-2 bg-brand-900/35 border border-brand-500/10 px-4 py-2 rounded-xl max-w-sm">
                    {cur.label}
                </motion.p>
            </AnimatePresence>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 14. STLComplexityVis (STL dynamic memory and complexity curves)
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

    // Vector state simulation
    const vectorElements = [10, 20, 30];
    const vectorCapacity = subTab === 'vector' && step >= 2 ? 4 : 2;

    return (
        <div className="w-full max-w-md flex flex-col items-center gap-5 select-none font-mono">
            {/* Header tab toggle */}
            <div className="flex bg-brand-950/60 p-1 border border-brand-500/10 rounded-full text-[10px] w-fit">
                <button
                    onClick={() => setActiveTab('stl')}
                    className={`px-3 py-1 rounded-full ${activeTab === 'stl' ? 'bg-brand-500 text-[#090D16] font-bold' : 'text-[#475569]'}`}
                >
                    STL Containers
                </button>
                <button
                    onClick={() => setActiveTab('complexity')}
                    className={`px-3 py-1 rounded-full ${activeTab === 'complexity' ? 'bg-brand-500 text-[#090D16] font-bold' : 'text-[#475569]'}`}
                >
                    Big-O Curves
                </button>
            </div>

            {/* Content box */}
            <div className="w-full h-44 bg-[#090D16] border border-brand-500/10 rounded-2xl p-4 flex flex-col justify-center relative overflow-hidden">
                {activeTab === 'stl' ? (
                    <div className="flex flex-col gap-3 items-center">
                        <div className="flex gap-2 text-[9px] border-b border-brand-500/5 pb-2 w-full justify-center">
                            {(['vector', 'stack', 'queue', 'map'] as const).map(t => (
                                <span key={t} className={`px-2 py-0.5 rounded ${subTab === t ? 'text-brand-300 font-bold bg-[#1E3A8A25]' : 'text-[#475569]'}`}>
                                    {t.toUpperCase()}
                                </span>
                            ))}
                        </div>
                        
                        {/* Tab displays */}
                        {subTab === 'vector' && (
                            <div className="flex flex-col gap-2 items-center">
                                <div className="flex gap-1.5">
                                    {Array.from({ length: vectorCapacity }).map((_, idx) => {
                                        const filled = idx < vectorElements.length;
                                        return (
                                            <motion.div
                                                key={idx}
                                                animate={{ borderColor: filled ? '#3B82F6' : '#1E293B' }}
                                                className="w-10 h-10 border-2 rounded-lg flex items-center justify-center text-xs font-bold bg-[#090D16]/50"
                                            >
                                                {filled ? vectorElements[idx] : ''}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                                <span className="text-[8px] text-[#475569]">Size: 3 / Capacity: {vectorCapacity} (Double capacity triggers dynamic allocations)</span>
                            </div>
                        )}
                        {subTab === 'stack' && (
                            <div className="flex flex-col gap-1 w-24 border-b-2 border-x-2 border-[#EC4899] rounded-b px-2 py-1 items-center h-24 justify-end">
                                {[30, 20, 10].map((v, i) => (
                                    <motion.div
                                        key={v}
                                        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="w-full text-center py-1 border border-[#EC4899]/30 bg-[#EC4899]/10 rounded text-[10px] font-bold text-[#EC4899]"
                                    >
                                        {v}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                        {subTab === 'queue' && (
                            <div className="flex gap-1 items-center h-20">
                                <span className="text-[8px] text-[#475569] rotate-90 sm:rotate-0">FRONT</span>
                                <div className="flex border-y-2 border-[#10B981] p-1.5 rounded gap-1.5 bg-[#10B981]/5">
                                    {[10, 20, 30].map(v => (
                                        <div key={v} className="w-8 h-8 rounded border border-[#10B981]/30 flex items-center justify-center text-[10px] text-[#10B981] font-bold bg-[#090D16]">
                                            {v}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[8px] text-[#475569] rotate-90 sm:rotate-0">REAR</span>
                            </div>
                        )}
                        {subTab === 'map' && (
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="flex gap-4">
                                    {[{ k: 'a', v: '1' }, { k: 'b', v: '2' }].map(node => (
                                        <div key={node.k} className="border border-brand-500/20 bg-[#1E3A8A10] px-3 py-1.5 rounded-lg flex flex-col items-center text-[10px]">
                                            <span className="text-brand-300 font-bold">Key: "{node.k}"</span>
                                            <span className="text-[#64748B]">Val: {node.v}</span>
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[8px] text-[#475569]">Tree sorted indexes | search complexity: O(log N)</span>
                            </div>
                        )}
                    </div>
                ) : (
                    // Complexity charts drawing
                    <div className="w-full h-full relative flex items-center justify-center">
                        <svg className="w-full h-full text-[#1E293B]">
                            {/* Axis lines */}
                            <line x1="10%" y1="10%" x2="10%" y2="90%" stroke="#334155" strokeWidth={1} />
                            <line x1="10%" y1="90%" x2="95%" y2="90%" stroke="#334155" strokeWidth={1} />
                            
                            {/* O(1) */}
                            <line x1="10%" y1="80%" x2="90%" y2="80%" stroke="#10B981" strokeWidth={1.5} strokeDasharray="3,3" />
                            <text x="92%" y="81%" fill="#10B981" className="text-[8px]">O(1)</text>

                            {/* O(log N) */}
                            <path d="M 40 135 Q 120 120 360 115" fill="none" stroke="#F59E0B" strokeWidth={1.5} />
                            <text x="92%" y="71%" fill="#F59E0B" className="text-[8px]">O(log N)</text>

                            {/* O(N) */}
                            <line x1="10%" y1="90%" x2="90%" y2="40%" stroke="#3B82F6" strokeWidth={1.5} />
                            <text x="92%" y="42%" fill="#3B82F6" className="text-[8px]">O(N)</text>

                            {/* O(N^2) */}
                            <path d="M 40 144 Q 150 135 240 20" fill="none" stroke="#F43F5E" strokeWidth={2} />
                            <text x="56%" y="15%" fill="#F43F5E" className="text-[8px]">O(N²)</text>
                        </svg>
                    </div>
                )}
            </div>

            <AnimatePresence mode="wait">
                <motion.p key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-xs text-center text-text-2 bg-brand-900/35 border border-brand-500/10 px-4 py-2 rounded-xl max-w-sm">
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
            {'</>'}
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
