import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ToastContainer } from './Toast';
import { MobileNav } from './MobileNav';
import { useStore } from '../store/useStore';

export const Layout: React.FC = () => {
    const theme = useStore((state) => state.theme);

    useEffect(() => {
        // We start dark by default. Adding 'light' class flips CSS variables.
        if (theme === 'light') {
            document.documentElement.classList.add('light');
        } else {
            document.documentElement.classList.remove('light');
        }
    }, [theme]);

    return (
        <div className="min-h-screen flex flex-col font-sans text-text-1 selection:bg-brand-500/30 overflow-x-hidden"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
            <ToastContainer />
            <Navbar />
            <main className="flex-grow pt-16 pb-14 md:pb-0"
                style={{ backgroundColor: 'var(--bg-primary)' }}>
                <Outlet />
            </main>
            <Footer />
            <MobileNav />
        </div>
    );
};
