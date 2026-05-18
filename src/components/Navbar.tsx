import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { Badge } from './Badge';

const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Courses', path: '/courses' },
    { name: 'Playground', path: '/playground' }
];

const languages = ['C++', 'Java', 'Python', 'C'];

export const Navbar = () => {
    const { theme, toggleTheme } = useStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeLang, setActiveLang] = useState('Python');

    return (
        <nav className="fixed top-0 w-full h-16 z-40 glass border-b border-white/5 flex items-center justify-between px-4 lg:px-8">
            {/* Left: Logo */}
            <NavLink to="/" className="flex items-center text-2xl tracking-tight">
                <span className="text-white font-bold">Code</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple animate-gradient font-bold">
                    Viz
                </span>
            </NavLink>

            {/* Center: Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => cn(
                            "relative text-sm font-medium transition-colors hover:text-white",
                            isActive ? "text-white" : "text-text-2"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                {link.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500"
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Right: Actions */}
            <div className="hidden md:flex items-center gap-4">
                {/* Language Pill */}
                <div className="flex bg-brand-800/50 p-1 rounded-full relative">
                    {languages.map(lang => (
                        <button
                            key={lang}
                            onClick={() => setActiveLang(lang)}
                            className={cn(
                                "relative px-3 py-1 text-xs font-mono transition-colors rounded-full z-10",
                                activeLang === lang ? "text-white" : "text-text-2 hover:text-white"
                            )}
                        >
                            {activeLang === lang && (
                                <motion.div
                                    layoutId="lang-pill"
                                    className="absolute inset-0 bg-brand-700 rounded-full -z-10"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                            {lang}
                        </button>
                    ))}
                </div>

                <Badge variant="green" className="animate-shimmer bg-[length:200%_auto]">Free Forever</Badge>

                <button onClick={toggleTheme} className="text-text-2 hover:text-white transition-colors relative w-8 h-8 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {theme === 'dark' ? (
                            <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                <Moon className="w-5 h-5" />
                            </motion.div>
                        ) : (
                            <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                <Sun className="w-5 h-5" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>

                <NavLink to="/login" className="text-text-2 hover:text-white text-sm font-medium transition-colors px-2 py-1.5">
                    Log In
                </NavLink>
                <NavLink to="/signup"
                    className="bg-cta-gradient px-4 py-1.5 rounded-btn text-sm font-medium text-white hover:shadow-glow transition-shadow overflow-hidden relative group">
                    <span className="relative z-10">Sign Up Free</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </NavLink>
            </div>

            {/* Mobile Menu Toggle */}
            <button
                className="md:hidden text-text-2 hover:text-white"
                onClick={() => setMobileMenuOpen(true)}
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        className="fixed inset-0 z-50 bg-brand-900/95 flex flex-col p-6"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-purple">CodeViz</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="text-text-2 hover:text-white">
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-6 text-2xl font-medium mt-8">
                            {links.map((link, i) => (
                                <motion.div
                                    key={link.path}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <NavLink
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) => cn("block", isActive ? "text-white" : "text-text-2")}
                                    >
                                        {link.name}
                                    </NavLink>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-auto flex flex-col gap-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-text-2 font-medium">Theme</span>
                                <button onClick={toggleTheme} className="p-2 bg-brand-800 rounded-full text-white">
                                    {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                </button>
                            </div>
                            <button className="w-full bg-cta-gradient py-3 rounded-btn text-white font-medium text-lg text-center">
                                Sign Up Free
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
