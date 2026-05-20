import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { cn } from '../lib/utils';
import { BSTVisualizer } from '../components/visualizers/BSTVisualizer';
import { LinkedListVisualizer } from '../components/visualizers/LinkedListVisualizer';
import { SortingRaceVisualizer } from '../components/visualizers/SortingRaceVisualizer';
import { Play, RotateCcw, Share2, Plus, X, ChevronUp, Copy, Check, Sun, Moon } from 'lucide-react';

type Language = 'cpp' | 'java' | 'python' | 'c';
type VisTab = 'bst' | 'linkedlist' | 'sort';

const LANG_LABELS: Record<Language, string> = { cpp: 'C++', java: 'Java', python: 'Python', c: 'C' };

const STARTER_CODE: Record<Language, string> = {
    python: `# Python Playground — CodeViz
def fibonacci(n):
    """Return the nth Fibonacci number."""
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

# Test it out
for i in range(10):
    print(f"fib({i}) = {fibonacci(i)}")`,

    cpp: `// C++ Playground — CodeViz (BinarySearchTree.cpp)
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int x) : val(x), left(nullptr), right(nullptr) {}
};

// Insert a node into the BST
Node* insert(Node* root, int val) {
    if (root == nullptr) {
        return new Node(val);
    }
    if (val < root->val) {
        root->left = insert(root->left, val);
    } else {
        root->right = insert(root->right, val);
    }
    return root;
}

// Inorder traversal
void inorder(Node* root) {
    if (root != nullptr) {
        inorder(root->left);
        cout << root->val << " ";
        inorder(root->right);
    }
}

int main() {
    Node* root = nullptr;
    
    // Build a sample binary search tree matching the landing page animation
    root = insert(root, 10);
    insert(root, 5);
    insert(root, 15);

    cout << "Binary Search Tree Inorder Traversal:" << endl;
    inorder(root);
    cout << endl;

    return 0;
}`,

    java: `// Java Playground — CodeViz
public class Main {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        int a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            int tmp = a + b;
            a = b; b = tmp;
        }
        return b;
    }

    public static void main(String[] args) {
        System.out.println("Fibonacci Sequence:");
        for (int i = 0; i < 10; i++) {
            System.out.println("fib(" + i + ") = " + fibonacci(i));
        }
    }
}`,

    c: `// C Playground — CodeViz
#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1, tmp;
    for (int i = 2; i <= n; i++) {
        tmp = a + b; a = b; b = tmp;
    }
    return b;
}

int main() {
    printf("Fibonacci Sequence:\\n");
    for (int i = 0; i < 10; i++) {
        printf("fib(%d) = %d\\n", i, fibonacci(i));
    }
    return 0;
}`
};

const SNIPPETS = [
    { name: 'Fibonacci', lang: 'python', desc: 'Recursive & iterative' },
    { name: 'Bubble Sort', lang: 'cpp', desc: 'Classic O(n²)' },
    { name: 'Binary Search', lang: 'python', desc: 'O(log n)' },
    { name: 'Linked List', lang: 'java', desc: 'Insert & delete' },
    { name: 'Stack Ops', lang: 'cpp', desc: 'Push/pop' },
    { name: 'Factorial', lang: 'c', desc: 'Recursive' },
];

const LANG_RUNTIME: Record<Language, string> = {
    python: 'Python 3.12',
    cpp: 'G++ 14 (C++17)',
    java: 'OpenJDK 21',
    c: 'GCC 13 (C11)',
};

const JUDGE0_LANGMAP: Record<Language, number> = {
    python: 71, // Python (3.8.1)
    cpp: 54,    // C++ (GCC 9.2.0)
    java: 62,   // Java (OpenJDK 13.0.1)
    c: 50       // C (GCC 9.2.0)
};

export const Playground: React.FC = () => {
    const [lang, setLang] = useState<Language>('cpp');
    const [code, setCode] = useState(STARTER_CODE.cpp);
    const [output, setOutput] = useState<{ type: string; text: string }[]>([]);
    const [running, setRunning] = useState(false);
    const [execTime, setExecTime] = useState<number | null>(null);
    const [snippetOpen, setSnippetOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [visTab, setVisTab] = useState<VisTab>('sort');
    const [darkEditor, setDarkEditor] = useState(true);
    const [fontSize, setFontSize] = useState(14);

    const switchLang = (l: Language) => {
        setLang(l);
        setCode(STARTER_CODE[l]);
        setOutput([]);
        setExecTime(null);
    };

    const runCode = async () => {
        setRunning(true);
        setOutput([{ type: 'system', text: `> Compiling & Running on Judge0...` }]);
        const start = Date.now();

        try {
            const apiUrl = import.meta.env.VITE_JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
            const apiKey = import.meta.env.VITE_JUDGE0_API_KEY;
            const apiHost = import.meta.env.VITE_JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';
            
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (apiKey) {
                headers['x-rapidapi-key'] = apiKey;
                headers['x-rapidapi-host'] = apiHost;
            }

            const response = await fetch(`${apiUrl}/submissions?base64_encoded=true&wait=true`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    language_id: JUDGE0_LANGMAP[lang],
                    source_code: btoa(unescape(encodeURIComponent(code)))
                })
            });

            if (!response.ok) {
                // Determine if it was an API key missing error vs server issue
                if (response.status === 401 || response.status === 403) {
                    throw new Error(`API Key missing or invalid. Set VITE_JUDGE0_API_KEY in your .env file.`);
                }
                throw new Error(`Execution failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            const newOutput: { type: string; text: string }[] = [{ type: 'system', text: `> Running ${LANG_RUNTIME[lang]}...` }];
            
            const decodeBase64 = (str: string | null) => str ? decodeURIComponent(escape(atob(str))) : '';

            if (data.compile_output) {
                newOutput.push({ type: 'stderr', text: decodeBase64(data.compile_output) });
            }
            if (data.stdout) {
                // Just append lines directly
                const outLines = decodeBase64(data.stdout).split('\n');
                outLines.forEach(l => { newOutput.push({ type: 'stdout', text: l }) });
            }
            if (data.stderr) {
                const errLines = decodeBase64(data.stderr).split('\n');
                errLines.forEach(l => { newOutput.push({ type: 'stderr', text: l }) });
            }

            // Exited safely or Error indicator
            if (data.status?.description) {
                newOutput.push({ 
                    type: data.status.id <= 3 ? 'system' : 'stderr', 
                    text: `[Status: ${data.status.description}]` 
                });
            }

            setOutput(newOutput);
            setExecTime(data.time ? Math.round(parseFloat(data.time) * 1000) : Date.now() - start);
        } catch (err: any) {
            setOutput(prev => [...prev, { type: 'stderr', text: err.message || 'Network error accessing Judge0' }]);
            setExecTime(Date.now() - start);
        } finally {
            setRunning(false);
        }
    };

    const handleCopyShare = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="h-[calc(100vh-64px)] w-full flex flex-col bg-[#0D1117] overflow-hidden text-text-1">

            {/* ── TOP BAR ── */}
            <div className="flex items-center gap-2 px-3 h-[52px] shrink-0 border-b border-borderAdaptive/5 glass overflow-x-auto hide-scrollbar">
                {/* Lang tabs */}
                <div className="flex items-center gap-1 p-1 bg-brand-900 rounded-full border border-borderAdaptive/5 mr-2">
                    {(Object.keys(LANG_LABELS) as Language[]).map((l) => (
                        <button key={l} onClick={() => switchLang(l)}
                            className={cn('relative px-3 py-1 text-xs font-mono rounded-full transition-all',
                                lang === l ? 'text-text-1' : 'text-text-2 hover:text-text-1')}>
                            {lang === l && <motion.div layoutId="pg-lang" className="absolute inset-0 bg-gradient-to-r from-brand-700 to-brand-500 rounded-full -z-10" />}
                            {LANG_LABELS[l]}
                        </button>
                    ))}
                </div>

                <div className="w-px h-5 bg-borderAdaptive/10 mr-1" />

                {/* Run */}
                <button onClick={runCode} disabled={running}
                    className="flex items-center gap-1.5 bg-green/90 hover:bg-green text-white px-4 py-1.5 rounded-btn text-xs font-bold transition-colors disabled:opacity-50 flex-shrink-0">
                    {running ? <div className="w-3 h-3 border-2 border-borderAdaptive/30 border-t-white rounded-full animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    Run
                </button>

                <button onClick={() => setCode(STARTER_CODE[lang])}
                    className="text-text-2 hover:text-text-1 px-2 py-1.5 text-xs rounded-btn hover:bg-borderAdaptive/5 transition-colors flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>

                <button onClick={() => setShareOpen(true)}
                    className="text-text-2 hover:text-text-1 px-2 py-1.5 text-xs rounded-btn hover:bg-borderAdaptive/5 transition-colors flex items-center gap-1 flex-shrink-0">
                    <Share2 className="w-3.5 h-3.5" /> Share
                </button>

                <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setFontSize((f) => Math.min(f + 1, 20))} className="text-text-2 hover:text-text-1 text-xs px-1 font-bold">A+</button>
                    <button onClick={() => setFontSize((f) => Math.max(f - 1, 10))} className="text-text-2 hover:text-text-1 text-xs px-1">A-</button>
                    <button onClick={() => setDarkEditor((d) => !d)} className="text-text-2 hover:text-text-1 transition-colors p-1 rounded">
                        {darkEditor ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <span className="px-2 py-0.5 bg-green/20 border border-green/30 rounded-full text-green text-[10px] font-bold">Free Playground</span>
                </div>
            </div>

            {/* ── MAIN AREA ── */}
            <div className="flex flex-1 min-h-0">
                {/* Editor (58%) */}
                <div className="flex flex-col" style={{ width: '58%' }}>
                    <div className="flex items-center gap-1 px-3 py-1.5 border-b border-borderAdaptive/5 bg-brand-900/30 text-xs text-text-2 font-mono">
                        <span className="px-2 py-0.5 bg-brand-800 rounded-t text-text-1 border-t border-l border-r border-borderAdaptive/10">
                            untitled-1.{lang === 'cpp' ? 'cpp' : lang === 'c' ? 'c' : lang === 'java' ? 'java' : 'py'}
                        </span>
                        <button className="ml-1 text-text-2 hover:text-white p-0.5"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex-1 min-h-0">
                        <Editor
                            height="100%"
                            theme={darkEditor ? 'vs-dark' : 'vs'}
                            language={lang}
                            value={code}
                            onChange={(v) => setCode(v ?? '')}
                            options={{
                                fontFamily: '"Fira Code", monospace',
                                fontSize,
                                lineHeight: 1.7,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                smoothScrolling: true,
                                padding: { top: 12 },
                                renderLineHighlight: 'line',
                            }}
                        />
                    </div>
                </div>

                {/* Right column (42%) */}
                <div className="flex flex-col border-l border-borderAdaptive/5" style={{ width: '42%' }}>
                    {/* Output Console (top 45%) */}
                    <div className="flex flex-col border-b border-borderAdaptive/5" style={{ height: '45%' }}>
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-borderAdaptive/5 bg-brand-900/20">
                            <span className="text-xs font-bold text-text-2 uppercase tracking-widest">Output</span>
                            <div className="flex items-center gap-2">
                                {execTime && (
                                    <span className="text-[10px] font-mono text-amber border border-amber/20 bg-amber/5 rounded px-1.5 py-0.5">⚡ {execTime}ms</span>
                                )}
                                <button onClick={() => { setOutput([]); setExecTime(null); }} className="text-text-2 hover:text-text-1 text-xs">Clear</button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar" style={{ background: '#080C10' }}>
                            {output.length === 0 && !running && (
                                <span className="text-text-2 text-xs font-mono">{'> '}<span className="animate-pulse">_</span></span>
                            )}
                            {output.map((line, i) => (
                                <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className={cn('text-xs font-mono leading-relaxed',
                                        line.type === 'stdout' ? 'text-text-1' :
                                            line.type === 'stderr' ? 'text-rose' : 'text-text-2')}>
                                    {line.text}
                                </motion.p>
                            ))}
                        </div>
                    </div>

                    {/* Live Visualizer (bottom 55%) */}
                    <div className="flex flex-col flex-1 min-h-0">
                        <div className="flex items-center justify-between px-3 py-1.5 border-b border-borderAdaptive/5 bg-brand-900/20 flex-shrink-0">
                            <span className="text-xs font-bold text-text-2 uppercase tracking-widest">Visualizer</span>
                            <div className="flex items-center gap-1">
                                {(['bst', 'linkedlist', 'sort'] as VisTab[]).map((t) => (
                                    <button key={t} onClick={() => setVisTab(t)}
                                        className={cn('px-2 py-0.5 text-[10px] font-bold rounded transition-all',
                                            visTab === t ? 'bg-brand-700 text-text-1' : 'text-text-2 hover:text-text-1 hover:bg-brand-800')}>
                                        {t === 'bst' ? 'BST' : t === 'linkedlist' ? 'LL' : 'Sort'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar" style={{ background: '#080C10' }}>
                            {visTab === 'bst' && <BSTVisualizer />}
                            {visTab === 'linkedlist' && <LinkedListVisualizer isPlaying={false} />}
                            {visTab === 'sort' && <SortingRaceVisualizer />}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── SNIPPET DRAWER ── */}
            <div className="shrink-0 border-t border-borderAdaptive/5">
                <button onClick={() => setSnippetOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-4 py-2 text-text-2 hover:text-text-1 hover:bg-borderAdaptive/3 transition-colors text-xs font-bold">
                    <span className="flex items-center gap-2">⊞ Snippets</span>
                    <ChevronUp className={cn('w-4 h-4 transition-transform', snippetOpen ? '' : 'rotate-180')} />
                </button>
                <AnimatePresence>
                    {snippetOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 120, opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }} className="overflow-hidden">
                            <div className="flex gap-3 px-4 pb-3 overflow-x-auto hide-scrollbar">
                                {SNIPPETS.map((s) => (
                                    <button key={s.name} onClick={() => { setCode(STARTER_CODE[s.lang as Language] ?? STARTER_CODE.python); setSnippetOpen(false); }}
                                        className="flex-shrink-0 w-32 glass rounded-card p-2.5 flex flex-col gap-1 text-left hover:border-brand-500/30 border border-borderAdaptive/5 transition-all hover:-translate-y-0.5">
                                        <p className="text-xs font-bold text-text-1">{s.name}</p>
                                        <p className="text-[10px] text-text-2">{s.desc}</p>
                                        <span className="text-[10px] font-mono text-brand-300 border border-brand-500/20 bg-brand-500/5 px-1 rounded self-start">{s.lang}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── SHARE MODAL ── */}
            <AnimatePresence>
                {shareOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-brand-900/80 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setShareOpen(false)}>
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass rounded-card p-8 border border-borderAdaptive/10 w-full max-w-md shadow-2xl">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-lg font-bold text-text-1">Share Playground</h2>
                                <button onClick={() => setShareOpen(false)} className="text-text-2 hover:text-text-1"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="flex items-center gap-2 mb-5">
                                <div className="flex-1 bg-brand-900 border border-borderAdaptive/10 rounded-input px-3 py-2 text-xs font-mono text-text-2">
                                    codeviz.io/play/abc123
                                </div>
                                <button onClick={handleCopyShare} className="flex items-center gap-1.5 px-3 py-2 bg-brand-500 text-white text-xs font-bold rounded-btn hover:bg-brand-500/80 transition-all">
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <div className="flex gap-3 mb-5">
                                <button className="flex-1 py-2 glass rounded-btn text-xs font-bold text-text-2 hover:text-white border border-borderAdaptive/10 transition-colors">
                                    Open in New Tab
                                </button>
                            </div>
                            <p className="text-xs text-text-2 text-center">Shared playgrounds are view-only.</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
