
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Star, MonitorPlay, LayoutTemplate, MousePointerClick, Trophy, Code2, Waypoints, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { GradientText } from '../components/GradientText';
import { GlassCard } from '../components/GlassCard';
import { Badge } from '../components/Badge';
import { AnimatedCounter } from '../components/AnimatedCounter';

export const Landing = () => {
    const { scrollYProgress } = useScroll();
    const heroCardY = useTransform(scrollYProgress, [0, 1], [0, 100]);

    return (
        <div className="flex flex-col w-full">
            {/* SECTION 1: HERO */}
            <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden py-20 lg:py-0">
                <div className="absolute inset-0 bg-hero-gradient opacity-40 mix-blend-screen animate-gradient bg-[length:200%_200%]" />

                {/* Animated noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cfilter id=\\"noiseFilter\\"%3E%3CfeTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.65\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"%3E%3C/feTurbulence%3E%3C/filter%3E%3Crect width=\\"100%25\\" height=\\"100%25\\" filter=\\"url(%23noiseFilter)\\"/%3E%3C/svg%3E")' }} />

                {/* Floating background tokens */}
                {['const', 'function', 'return', '{...}', '=>', 'class', 'struct'].map((token, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-brand-300/10 font-mono text-xl md:text-3xl font-bold select-none pointer-events-none"
                        initial={{ y: Math.random() * 100, x: Math.random() * 100, opacity: 0 }}
                        animate={{
                            y: [Math.random() * window.innerHeight, Math.random() * -100],
                            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                            opacity: [0, 0.07, 0]
                        }}
                        transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, ease: "linear" }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    >
                        {token}
                    </motion.div>
                ))}

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Left Content */}
                    <div className="flex flex-col items-start gap-6">
                        <Badge variant="green" className="animate-shimmer bg-[length:200%_auto] text-sm px-3 py-1">
                            <SparklesIcon className="w-3.5 h-3.5 mr-1" /> 100% Free
                        </Badge>
                        <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold leading-[1.1] tracking-tight">
                            <span className="text-white block">Learn to Code —</span>
                            <GradientText>See It Come to Life</GradientText>
                        </h1>
                        <p className="text-xl text-text-2 max-w-lg leading-relaxed">
                            Step through every algorithm with live animations.
                            Switch between C++, Java, Python & C instantly. Always free.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
                            <button className="w-full sm:w-auto bg-cta-gradient px-8 py-4 rounded-btn text-base font-semibold text-white hover:shadow-glow transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group">
                                Start Learning Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full sm:w-auto glass px-8 py-4 rounded-btn text-base font-semibold text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                <Play className="w-4 h-4 fill-white" /> Watch 60s Demo
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10 w-full">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-brand-900 bg-brand-700 flex items-center justify-center text-xs font-bold z-${10 - i}`}>
                                        {['S', 'J', 'A', 'M', 'K'][i - 1]}
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex gap-1 text-amber">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber" />)}
                                </div>
                                <span className="text-sm text-text-2 font-medium">Loved by <AnimatedCounter end={50000} suffix="+" /> students</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Card */}
                    <motion.div
                        style={{ y: heroCardY }}
                        className="relative lg:h-[600px] flex items-center perspective-[1000px]"
                    >
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full relative preserve-3d rotate-y-[-5deg] rotate-x-[5deg]"
                        >
                            <div className="absolute inset-0 bg-brand-500/20 blur-[100px] rounded-full" />
                            <GlassCard className="relative p-0 overflow-hidden border border-white/20 shadow-glow bg-brand-800/80 backdrop-blur-2xl">
                                {/* Mock UI window */}
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-brand-900/50">
                                    <div className="w-3 h-3 rounded-full bg-rose/80" />
                                    <div className="w-3 h-3 rounded-full bg-amber/80" />
                                    <div className="w-3 h-3 rounded-full bg-green/80" />
                                    <div className="mx-auto text-xs text-text-2 font-mono">BinarySearchTree.py</div>
                                </div>
                                <div className="grid grid-cols-5 h-[350px]">
                                    {/* Code Panel */}
                                    <div className="col-span-2 border-r border-white/10 p-4 font-mono text-[10px] leading-relaxed text-brand-300">
                                        <p className="text-purple">def <span className="text-brand-300">insert</span><span className="text-white">(self, val):</span></p>
                                        <p className="pl-4">if not self.root:</p>
                                        <p className="pl-8 text-green">self.root = Node(val)</p>
                                        <p className="pl-8">return</p>
                                        <p className="pl-4 mt-2 text-text-2"># Live execution step</p>
                                        <p className="pl-4 bg-brand-500/20 text-white rounded px-1 -mx-1"><span className="animate-pulse mr-1">|</span>curr = self.root</p>
                                        <p className="pl-4">while curr:</p>
                                        <p className="pl-8">if val {'<'} curr.val:</p>
                                        <p className="pl-12">...</p>
                                    </div>
                                    {/* Visualizer Panel */}
                                    <div className="col-span-3 p-4 flex flex-col items-center justify-center relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-900/50 to-transparent">
                                        {/* Mock BST */}
                                        <div className="relative w-full h-full flex flex-col items-center justify-center pt-8">
                                            <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-brand-700 flex items-center justify-center font-bold text-sm z-10 mb-8 mt-2 transition-colors duration-500">10</div>

                                            <div className="absolute top-[80px] left-[35%] w-0.5 h-12 bg-white/20 -rotate-[35deg]" />
                                            <div className="absolute top-[80px] right-[35%] w-0.5 h-12 bg-white/20 rotate-[35deg]" />

                                            <div className="flex gap-16">
                                                <div className="w-10 h-10 rounded-full border-2 border-brand-500 bg-brand-500/20 flex items-center justify-center font-bold text-sm z-10 relative">
                                                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full bg-brand-500 blur-md -z-10" />
                                                    5
                                                </div>
                                                <div className="w-10 h-10 rounded-full border-2 border-white/20 bg-brand-800 flex items-center justify-center font-bold text-sm z-10">15</div>
                                            </div>

                                            {/* Inserting 7 animation */}
                                            <motion.div
                                                className="absolute top-4 right-1/4 w-8 h-8 rounded-full bg-green flex items-center justify-center font-bold text-xs shadow-glow"
                                                animate={{ y: [0, 120], x: [0, -50], opacity: [0, 1, 1] }}
                                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                            >
                                                7
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* SECTION 2: FREE MODEL BANNER */}
            <section className="w-full bg-green/10 border-y border-green/20 py-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-free-gradient opacity-5" />
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-around items-center gap-6">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green flex-shrink-0" />
                        <span className="text-lg font-medium text-white">All 48 topics free</span>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-green/20" />
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green flex-shrink-0" />
                        <span className="text-lg font-medium text-white">All 4 languages free</span>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-green/20" />
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green flex-shrink-0" />
                        <span className="text-lg font-medium text-white">No credit card ever</span>
                    </div>
                </div>
            </section>

            {/* SECTION 3: FEATURES */}
            <section className="py-24 max-w-7xl mx-auto px-6 w-full">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Everything you need. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">Nothing to pay.</span></h2>
                    <p className="text-text-2 text-lg">Master computer science concepts through an immersive visual environment.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: LayoutTemplate, title: "Visual Execution Engine", desc: "Watch every line execute with live diagrams", color: "theme('colors.brand.500')" },
                        { icon: Code2, title: "4 Languages, 1 Platform", desc: "C++, Java, Python, C — switch instantly", color: "theme('colors.purple.500')" },
                        { icon: MousePointerClick, title: "Interactive Diagrams", desc: "Drag nodes. Rewind steps. Own the concept.", color: "theme('colors.amber.500')" },
                        { icon: Trophy, title: "Gamified Progress", desc: "XP, streaks, badges, and leaderboards", color: "theme('colors.green.500')" },
                        { icon: MonitorPlay, title: "In-Browser IDE", desc: "Full playground with visualizer. Zero setup.", color: "theme('colors.rose.500')" },
                        { icon: Waypoints, title: "Smart Learning Path", desc: "Prerequisite-gated topics. Learn in order.", color: "theme('colors.brand.300')" }
                    ].map((feature, i) => (
                        <GlassCard key={i} className="group hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center shrink-0 border border-white/10" style={{ background: `radial-gradient(circle at top left, ${feature.color}40, transparent)`, color: feature.color }}>
                                <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-brand-300 transition-colors">{feature.title}</h3>
                            <p className="text-text-2 text-sm leading-relaxed">{feature.desc}</p>
                        </GlassCard>
                    ))}
                </div>
            </section>

            {/* SECTION 4: MODULES */}
            <section className="py-24 bg-brand-800/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-12">
                        <div>
                            <h2 className="text-4xl font-bold mb-4">4 modules. 48 topics. <span className="text-green">Completely free.</span></h2>
                            <p className="text-text-2 text-lg">From basic arrays to advanced graph algorithms.</p>
                        </div>
                        <button className="text-brand-300 font-medium hover:text-white transition-colors flex items-center gap-2">
                            View full curriculum <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "Basics & Arrays", color: "bg-blue-500", diff: "Beginner", count: "12 topics", time: "~5hr", samples: ["Two Pointers", "Sliding Window", "Prefix Sum"] },
                            { name: "Linked Lists & Trees", color: "bg-green-500", diff: "Intermediate", count: "14 topics", time: "~8hr", samples: ["Reversal", "BST Traversal", "LCA"] },
                            { name: "Graphs & Tries", color: "bg-amber-500", diff: "Advanced", count: "12 topics", time: "~10hr", samples: ["BFS/DFS", "Dijkstra", "Topological Sort"] },
                            { name: "Dynamic Programming", color: "bg-purple-500", diff: "Expert", count: "10 topics", time: "~12hr", samples: ["Knapsack", "LCS", "Matrix DP"] }
                        ].map((mod, i) => (
                            <GlassCard key={i} className="relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 flex flex-col h-full hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                                <div className={`absolute top-0 left-0 w-full h-1 ${mod.color} group-hover:w-2 group-hover:h-full transition-all duration-300`} />
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <h3 className="text-xl font-bold text-white leading-tight pr-2">{mod.name}</h3>
                                    <Badge variant={mod.diff === 'Beginner' ? 'blue' : mod.diff === 'Intermediate' ? 'green' : mod.diff === 'Advanced' ? 'amber' : 'purple'}>{mod.diff}</Badge>
                                </div>
                                <div className="text-sm text-text-2 mb-6 font-mono flex items-center gap-2">
                                    <span>{mod.count}</span> <span className="opacity-50">•</span> <span>{mod.time}</span>
                                </div>
                                <div className="flex-grow">
                                    <ul className="flex flex-col gap-2 text-sm text-text-2 mb-8">
                                        {mod.samples.map(sample => (
                                            <li key={sample} className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${mod.color}`} /> {sample}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button className="w-full py-2.5 rounded-input glass hover:bg-white/10 text-white font-medium text-sm transition-colors mt-auto relative z-10 flex items-center justify-center gap-2">
                                    Explore Free <ArrowRight className="w-4 h-4" />
                                </button>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 5: HOW IT WORKS */}
            <section className="py-24 max-w-4xl mx-auto px-6 w-full">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Master algorithms in <GradientText>3 simple steps</GradientText></h2>
                </div>

                <div className="relative pl-8 md:pl-0">
                    {/* Vertical timeline line */}
                    <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-px bg-white/10 md:-translate-x-1/2" />

                    {[
                        { step: "1", title: "Sign up free", desc: "No trial. No credit card. Just create an account and start learning immediately." },
                        { step: "2", title: "Pick a topic", desc: "Browse 48 modules. Filter by language, data structure, or difficulty level." },
                        { step: "3", title: "Learn visually", desc: "Step through code execution line by line while variables and diagrams update in real-time." }
                    ].map((item, i) => (
                        <div key={i} className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 mb-16 last:mb-0 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                            <div className={`flex-1 ${i % 2 !== 0 ? 'md:text-right' : ''} pt-2 md:pt-0`}>
                                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-text-2 text-base leading-relaxed">{item.desc}</p>
                            </div>

                            <div className="absolute left-0 md:relative md:left-auto md:-translate-x-0 -translate-x-[2.25rem] w-12 h-12 rounded-full border-4 border-brand-900 bg-cta-gradient flex items-center justify-center text-white font-bold text-lg z-10 shrink-0 outline outline-1 outline-white/10">
                                {item.step}
                            </div>

                            <div className="flex-1 w-full hidden md:block" />
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 6: SOCIAL PROOF */}
            <section className="py-24 bg-brand-800/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="flex justify-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-amber text-amber" />)}
                        </div>
                        <h2 className="text-4xl font-bold mb-4">Loved by <span className="text-white">developers</span> worldwide</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { quote: "The visual execution engine completely changed how I understand dynamic programming. I finally get it now.", author: "Sarah J.", role: "CS Student" },
                            { quote: "Being able to instantly switch between Java and Python while the animation plays is mind-blowing.", author: "Mike T.", role: "Junior Dev" },
                            { quote: "I can't believe this entire platform is completely free. It's better than courses I've paid hundreds for.", author: "Elena R.", role: "Self-Taught" }
                        ].map((testimonial, i) => (
                            <GlassCard key={i} className="flex flex-col justify-between">
                                <p className="text-text-1 text-lg mb-8 relative z-10">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-3 mt-auto">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-purple p-0.5">
                                        <div className="w-full h-full bg-brand-900 rounded-full flex items-center justify-center text-xs font-bold">{testimonial.author[0]}</div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-sm">{testimonial.author}</div>
                                        <div className="text-brand-300 text-xs">{testimonial.role}</div>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 7: CTA BANNER */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-700/40 via-brand-900 to-brand-900" />
                <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">Start learning today. <br /><GradientText>It's free forever.</GradientText></h2>
                    <p className="text-xl text-text-2 mb-10 leading-relaxed">No hidden costs. No premium locks. Just code.</p>
                    <button className="bg-cta-gradient px-10 py-5 rounded-btn text-lg font-bold text-white hover:shadow-glow transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group mx-auto">
                        Create Free Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="mt-6 text-sm text-text-2 font-medium flex items-center justify-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-green" /> Join 50,000+ learners already on CodeViz
                    </p>
                </div>
            </section>
        </div>
    );
};

// Simple Sparkles icon helper to use inside Badges
function SparklesIcon(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
        </svg>
    );
}
