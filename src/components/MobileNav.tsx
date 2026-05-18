import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, PlayCircle, User } from 'lucide-react';
import { cn } from '../lib/utils';

const tabs = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Courses', path: '/courses', icon: BookOpen },
    { label: 'Play', path: '/playground', icon: PlayCircle },
    { label: 'Profile', path: '/profile', icon: User },
];

export const MobileNav: React.FC = () => {
    const { pathname } = useLocation();
    const isAuth = ['/login', '/signup', '/onboarding'].some((p) => pathname.startsWith(p));
    if (isAuth) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-14 z-40 md:hidden glass border-t border-white/5 flex items-center px-2">
            {tabs.map(({ label, path, icon: Icon }) => {
                const active = path === '/' ? pathname === '/' : pathname.startsWith(path);
                return (
                    <NavLink key={path} to={path} className="flex-1 flex flex-col items-center justify-center gap-0.5 relative">
                        {active && (
                            <motion.div layoutId="mobile-nav-pill"
                                className="absolute inset-x-2 inset-y-1 rounded-full"
                                style={{ background: 'rgba(37,99,235,0.15)' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                        )}
                        <Icon
                            className={cn('w-5 h-5 relative z-10 transition-colors', active ? 'text-brand-300' : 'text-text-2')}
                            strokeWidth={active ? 2 : 1.5}
                        />
                        <AnimatePresence>
                            {active && (
                                <motion.span initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                                    className="text-[9px] font-bold text-brand-300 relative z-10">
                                    {label}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </NavLink>
                );
            })}
        </nav>
    );
};
