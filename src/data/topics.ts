export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Language = 'C++' | 'Java' | 'Python' | 'C';
export type ModuleId = 'fundamentals' | 'oop' | 'data-structures' | 'advanced-ds';

export interface Topic {
    id: string;
    title: string;
    moduleId: ModuleId;
    moduleName: string;
    moduleColor: string;
    difficulty: Difficulty;
    languages: Language[];
    durationMin: number;
    conceptsCount: number;
}

const allLanguages: Language[] = ['C++', 'Java', 'Python', 'C'];

const fundamentals: string[] = [
    'Intro to Programming', 'Variables & Data Types', 'Operators & Expressions', 'Input/Output',
    'Control Flow — Conditionals', 'Control Flow — Loops', 'Functions & Scope', 'Recursion',
    'Arrays 1D & 2D', 'Strings', 'Pointers & References', 'Dynamic Memory Allocation', 'File I/O'
];

const oop: string[] = [
    'Classes & Objects', 'Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction',
    'Constructors & Destructors', 'Static Members & Methods', 'Operator Overloading',
    'Templates & Generics', 'Exception Handling', 'Design Patterns'
];

const dataStructures: string[] = [
    'Arrays & Dynamic Arrays', 'Linked Lists', 'Stack', 'Queue', 'Hash Tables',
    'Binary Tree', 'Binary Search Tree', 'Heaps & Priority Queue', 'Graphs Basics',
    'Sorting Algorithms', 'Searching Algorithms', 'Trie'
];

const advancedDs: string[] = [
    'AVL Tree', 'Red-Black Tree', 'B-Trees & B+ Trees', 'Segment Tree', 'Fenwick Tree',
    'Union-Find', 'Advanced Graph Algorithms', 'Advanced Trie', 'Skip List',
    'Sparse Table', 'DP on Data Structures', 'Bloom Filter'
];

const createTopics = (list: string[], moduleId: ModuleId, moduleName: string, moduleColor: string, defaultDiff: Difficulty): Topic[] => {
    return list.map((title, i) => ({
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title,
        moduleId,
        moduleName,
        moduleColor,
        difficulty: i < list.length / 3 ? 'Beginner' : i < (list.length * 2) / 3 ? defaultDiff : (defaultDiff === 'Advanced' ? 'Advanced' : 'Intermediate'),
        languages: allLanguages,
        durationMin: 30 + (i % 3) * 15,
        conceptsCount: 8 + (i % 4) * 2,
    }));
};

export const topics: Topic[] = [
    ...createTopics(fundamentals, 'fundamentals', 'Fundamentals', 'brand-500', 'Beginner'),
    ...createTopics(oop, 'oop', 'OOP', 'green', 'Intermediate'),
    ...createTopics(dataStructures, 'data-structures', 'Data Structures', 'amber', 'Intermediate'),
    ...createTopics(advancedDs, 'advanced-ds', 'Advanced DS', 'purple', 'Advanced')
];
