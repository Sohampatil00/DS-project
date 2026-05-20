import { useEffect, useMemo, useRef } from 'react';
import { ArrowRight, Search, Grid, List as ListIcon, ChevronDown, X, Check, } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCourseStore } from '../store/useCourseStore';
import { topics as allTopics, type Difficulty, type Language, type ModuleId } from '../data/topics';
import { GlassCard } from '../components/GlassCard';
import { Badge } from '../components/Badge';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const DIFFS: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
const LANGS: Language[] = ['C++', 'Java', 'Python', 'C'];
const MODS: { id: ModuleId; name: string; color: string }[] = [
    { id: 'prerequisite', name: 'Prerequisites', color: 'bg-brand-500' },
    { id: 'beginner', name: 'Beginner DSA', color: 'bg-green' },
    { id: 'oop', name: 'OOP', color: 'bg-purple' },
    { id: 'data-structures', name: 'Data Structures', color: 'bg-amber' },
    { id: 'advanced-ds', name: 'Advanced DS', color: 'bg-rose' }
];

export const Courses = () => {
    const store = useCourseStore();
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement !== searchInputRef.current) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
                store.setSearchQuery('');
                searchInputRef.current?.blur();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [store]);

    const filteredTopics = useMemo(() => {
        return allTopics.filter(t => {
            if (store.searchQuery && !t.title.toLowerCase().includes(store.searchQuery.toLowerCase())) return false;
            if (store.difficulties.length > 0 && !store.difficulties.includes(t.difficulty)) return false;
            if (store.modules.length > 0 && !store.modules.includes(t.moduleId)) return false;
            if (store.languages.length > 0 && !store.languages.some(l => t.languages.includes(l))) return false;
            return true;
        });
    }, [store]);

    const activeFiltersCount = store.difficulties.length + store.languages.length + store.modules.length;

    return (
        <div className="max-w-[1600px] mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 items-start">
            {/* SIDEBAR */}
            <aside className="w-full lg:w-[280px] shrink-0 sticky top-24 z-20">
                <GlassCard className="p-5 flex flex-col gap-6 bg-brand-900/80 backdrop-blur-3xl border border-borderAdaptive/10 shadow-layer">

                    {/* Search */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-2 group-focus-within:text-brand-300 group-focus-within:animate-spin-slow transition-colors" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search topics (/ to focus)"
                            value={store.searchQuery}
                            onChange={(e) => store.setSearchQuery(e.target.value)}
                            className="w-full bg-brand-800/50 border border-borderAdaptive/5 rounded-input py-2 pl-9 pr-8 text-sm text-text-1 placeholder:text-text-2 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-all font-sans"
                        />
                        <AnimatePresence>
                            {store.searchQuery && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => store.setSearchQuery('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text-2 hover:text-text-1"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Difficulty */}
                    <div>
                        <h4 className="text-xs font-bold text-text-2 tracking-wider uppercase mb-3">Difficulty</h4>
                        <div className="flex flex-wrap gap-2">
                            {DIFFS.map(d => {
                                const active = store.difficulties.includes(d);
                                return (
                                    <button
                                        key={d}
                                        onClick={() => store.toggleDifficulty(d)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all relative overflow-hidden",
                                            active ? "text-text-1 shadow-glow border-transparent" : "text-text-2 border border-borderAdaptive/10 hover:border-borderAdaptive/20 bg-brand-800/30 hover:bg-brand-800/80"
                                        )}
                                    >
                                        {active && <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-purple opacity-80" />}
                                        <span className="relative z-10 flex items-center gap-1.5">
                                            {d} {d === 'Beginner' ? '🟢' : d === 'Intermediate' ? '🟡' : '🔴'}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Language */}
                    <div>
                        <h4 className="text-xs font-bold text-text-2 tracking-wider uppercase mb-3">Language</h4>
                        <div className="flex flex-col gap-2">
                            {LANGS.map(l => {
                                const active = store.languages.includes(l);
                                return (
                                    <label key={l} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={cn(
                                            "w-4 h-4 rounded border flex items-center justify-center transition-all",
                                            active ? "bg-brand-500 border-brand-500" : "border-borderAdaptive/20 bg-brand-800/50 group-hover:border-borderAdaptive/40"
                                        )}>
                                            {active && <Check className="w-3 h-3 text-text-1" strokeWidth={3} />}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={active} onChange={() => store.toggleLanguage(l)} />
                                        <span className={cn("text-sm font-medium transition-colors font-mono", active ? "text-text-1" : "text-text-2 group-hover:text-text-1")}>{l}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Module */}
                    <div>
                        <h4 className="text-xs font-bold text-text-2 tracking-wider uppercase mb-3">Module</h4>
                        <div className="flex flex-col gap-2">
                            {MODS.map(m => {
                                const active = store.modules.includes(m.id);
                                const count = allTopics.filter(t => t.moduleId === m.id).length;
                                return (
                                    <button
                                        key={m.id}
                                        onClick={() => store.toggleModule(m.id)}
                                        className={cn(
                                            "flex items-center justify-between px-3 py-2 rounded-input text-sm font-medium transition-all text-left",
                                            active ? "bg-brand-800/80 text-text-1" : "hover:bg-brand-800/50 text-text-2 hover:text-text-1"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-2 h-2 rounded-full", m.color, active ? "shadow-[0_0_8px_currentColor]" : "opacity-70")} />
                                            {m.name}
                                        </div>
                                        <span className="text-xs bg-brand-900 px-1.5 py-0.5 rounded text-text-2">{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="pt-4 border-t border-borderAdaptive/5 mt-auto">
                        <AnimatePresence>
                            {activeFiltersCount > 0 && (
                                <motion.button
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    onClick={store.resetFilters}
                                    className="text-xs text-rose hover:text-rose/80 font-medium w-full text-left mb-2 transition-colors"
                                >
                                    Reset filters
                                </motion.button>
                            )}
                        </AnimatePresence>
                        <p className="text-xs text-text-2 font-medium">48 topics • Always free</p>
                    </div>

                </GlassCard>
            </aside>

            {/* MAIN GRID */}
            <main className="flex-1 w-full min-w-0 pb-20">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex flex-col">
                        <h1 className="text-2xl sm:text-3xl font-bold text-text-1 tracking-tight">Course<span className="text-brand-300">Catalog</span></h1>
                        <p className="text-text-2 text-sm mt-1">Showing <span className="text-text-1 font-bold">{filteredTopics.length}</span> topics</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="glass p-1 rounded-input flex items-center">
                            <button
                                onClick={() => store.setView('grid')}
                                className={cn("p-1.5 rounded transition-all", store.view === 'grid' ? "bg-borderAdaptive/10 text-text-1 shadow-sm" : "text-text-2 hover:text-text-1 hover:bg-borderAdaptive/5")}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => store.setView('list')}
                                className={cn("p-1.5 rounded transition-all", store.view === 'list' ? "bg-borderAdaptive/10 text-text-1 shadow-sm" : "text-text-2 hover:text-text-1 hover:bg-borderAdaptive/5")}
                            >
                                <ListIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <button className="glass px-3 py-1.5 rounded-input text-sm font-medium flex items-center gap-2 hover:bg-borderAdaptive/5 transition-colors">
                            Recommended <ChevronDown className="w-4 h-4 text-text-2" />
                        </button>
                    </div>
                </div>

                {/* ACTIVE CHIPS (Mobile/Top) */}
                <AnimatePresence>
                    {activeFiltersCount > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-wrap gap-2 mb-6"
                        >
                            {[...store.difficulties, ...store.languages].map(f => (
                                <span key={f} className="pl-3 pr-1 py-1 rounded-full bg-brand-800 text-xs font-medium text-text-1 flex items-center gap-1 border border-borderAdaptive/5">
                                    {f}
                                    <button onClick={() => {
                                        if (store.difficulties.includes(f as any)) store.toggleDifficulty(f as any);
                                        if (store.languages.includes(f as any)) store.toggleLanguage(f as any);
                                    }} className="p-0.5 hover:bg-borderAdaptive/10 rounded-full transition-colors"><X className="w-3 h-3 text-text-2 hover:text-text-1" /></button>
                                </span>
                            ))}
                            {store.modules.map(m => {
                                const label = MODS.find(x => x.id === m)?.name;
                                return (
                                    <span key={m} className="pl-3 pr-1 py-1 rounded-full bg-brand-800 text-xs font-medium text-text-1 flex items-center gap-1 border border-borderAdaptive/5">
                                        {label}
                                        <button onClick={() => store.toggleModule(m)} className="p-0.5 hover:bg-borderAdaptive/10 rounded-full transition-colors"><X className="w-3 h-3 text-text-2 hover:text-text-1" /></button>
                                    </span>
                                )
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* TOPICS GRID */}
                <motion.div
                    layout
                    className={cn(
                        "grid gap-4",
                        store.view === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                    )}
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredTopics.map((topic, i) => {

                            return (
                                <motion.div
                                    layout
                                    key={topic.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: Math.min(i * 0.04, 0.4), duration: 0.3 }}
                                >
                                    <Link to={`/learn/${topic.moduleId}/${topic.id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-card">
                                        <GlassCard className={cn(
                                            "group h-full relative overflow-hidden flex flex-col p-5 hover:-translate-y-2 transition-all duration-300 cursor-pointer bg-brand-900/60 hover:bg-brand-800/80 border-borderAdaptive/5",
                                            store.view === 'list' && "sm:flex-row sm:items-center sm:gap-6",
                                            `hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]`
                                        )}>

                                            {/* Left accent bar */}
                                            <div className={cn(
                                                "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
                                                MODS.find(m => m.id === topic.moduleId)?.color,
                                                `group-hover:shadow-[0_0_15px_currentColor]`
                                            )} />

                                            <div className={cn("flex flex-col flex-1", store.view === 'list' && "sm:flex-row sm:items-center sm:w-full")}>
                                                {/* Tags Top */}
                                                <div className={cn("flex justify-between items-start mb-3", store.view === 'list' && "sm:mb-0 sm:w-1/4 sm:flex-col sm:gap-2")}>
                                                    <Badge variant={topic.moduleId === 'prerequisite' ? 'blue' : topic.moduleId === 'beginner' ? 'green' : topic.moduleId === 'oop' ? 'purple' : topic.moduleId === 'data-structures' ? 'amber' : 'rose'} className="border-none bg-opacity-20 backdrop-blur-md">
                                                        {topic.moduleName}
                                                    </Badge>
                                                    <Badge variant="blue" className="bg-transparent border-borderAdaptive/10 text-text-2 group-hover:border-borderAdaptive/20 transition-colors">
                                                        {topic.difficulty}
                                                    </Badge>
                                                </div>

                                                {/* Title */}
                                                <div className={cn("mb-3", store.view === 'list' && "sm:mb-0 sm:w-1/3 sm:px-4")}>
                                                    <h3 className="text-lg font-bold text-text-1 group-hover:text-brand-300 transition-colors tracking-tight line-clamp-2">{topic.title}</h3>
                                                </div>

                                                {/* Langs */}
                                                <div className={cn("flex flex-wrap gap-1.5 mb-4", store.view === 'list' && "sm:mb-0 sm:w-1/4")}>
                                                    {topic.languages.map(l => (
                                                        <span key={l} className="px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-brand-800 text-text-2 group-hover:bg-brand-900/50 group-hover:text-text-1 transition-colors border border-borderAdaptive/5">
                                                            {l}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Footer Meta & CTA */}
                                                <div className={cn("mt-auto pt-4 border-t border-borderAdaptive/5 flex flex-col gap-4", store.view === 'list' && "sm:mt-0 sm:pt-0 sm:border-none sm:w-1/6 sm:flex-row sm:items-center sm:justify-end")}>
                                                    <div className={cn("flex items-center gap-3 text-xs font-mono text-text-2", store.view === 'list' && "hidden lg:flex")}>
                                                        <span className="flex items-center gap-1">⏱ {topic.durationMin}m</span>
                                                        <span className="opacity-50">•</span>
                                                        <span>{topic.conceptsCount} concepts</span>
                                                    </div>

                                                    <div className={cn(
                                                        "w-full py-2.5 rounded-btn glass text-sm font-bold text-text-1 flex justify-center items-center gap-2 transition-all duration-300 relative overflow-hidden",
                                                        `group-hover:${MODS.find(m => m.id === topic.moduleId)?.color.replace('bg-', 'bg-[')}group-hover:]` // using standard classes is safer
                                                    )}>
                                                        <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity", MODS.find(m => m.id === topic.moduleId)?.color)} />
                                                        <span className="relative z-10 group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">Start Learning <ArrowRight className="w-4 h-4" /></span>
                                                    </div>
                                                </div>
                                            </div>

                                        </GlassCard>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {filteredTopics.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="col-span-full py-20 flex flex-col items-center justify-center text-center px-4"
                        >
                            <div className="w-16 h-16 rounded-full bg-brand-800 flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-text-2" />
                            </div>
                            <h3 className="text-xl font-bold text-text-1 mb-2">No topics found</h3>
                            <p className="text-text-2 mb-6">We couldn't find anything matching your current filters.</p>
                            <button
                                onClick={store.resetFilters}
                                className="bg-brand-500 hover:bg-brand-500/90 text-white px-6 py-2 rounded-btn font-medium transition-colors"
                            >
                                Clear all filters
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </main>
        </div>
    );
};
