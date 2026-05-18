import { create } from 'zustand';
import type { Difficulty, Language, ModuleId } from '../data/topics';

interface CourseState {
    searchQuery: string;
    setSearchQuery: (q: string) => void;

    difficulties: Difficulty[];
    toggleDifficulty: (d: Difficulty) => void;

    languages: Language[];
    toggleLanguage: (l: Language) => void;

    modules: ModuleId[];
    toggleModule: (m: ModuleId) => void;

    resetFilters: () => void;

    view: 'grid' | 'list';
    setView: (v: 'grid' | 'list') => void;

    sort: 'recommended' | 'newest' | 'popular';
    setSort: (s: 'recommended' | 'newest' | 'popular') => void;
}

export const useCourseStore = create<CourseState>((set) => ({
    searchQuery: '',
    setSearchQuery: (q) => set({ searchQuery: q }),

    difficulties: [],
    toggleDifficulty: (d) => set((state) => ({
        difficulties: state.difficulties.includes(d)
            ? state.difficulties.filter((x) => x !== d)
            : [...state.difficulties, d]
    })),

    languages: [],
    toggleLanguage: (l) => set((state) => ({
        languages: state.languages.includes(l)
            ? state.languages.filter((x) => x !== l)
            : [...state.languages, l]
    })),

    modules: [],
    toggleModule: (m) => set((state) => ({
        modules: state.modules.includes(m)
            ? state.modules.filter((x) => x !== m)
            : [...state.modules, m]
    })),

    resetFilters: () => set({ difficulties: [], languages: [], modules: [], searchQuery: '' }),

    view: 'grid',
    setView: (v) => set({ view: v }),

    sort: 'recommended',
    setSort: (s) => set({ sort: s }),
}));
