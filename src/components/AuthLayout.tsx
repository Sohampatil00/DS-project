import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at 50% -20%, #1B3A6B 0%, #0F172A 70%)' }}>

            {/* Animated background blobs */}
            {[
                { size: 400, x: '10%', y: '20%', delay: 0, duration: 18 },
                { size: 300, x: '70%', y: '60%', delay: 4, duration: 22 },
                { size: 250, x: '50%', y: '80%', delay: 8, duration: 16 },
                { size: 200, x: '85%', y: '10%', delay: 2, duration: 20 },
            ].map((blob, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        width: blob.size,
                        height: blob.size,
                        left: blob.x,
                        top: blob.y,
                        background: i % 2 === 0
                            ? 'radial-gradient(circle, rgba(37,99,235,0.15), transparent 70%)'
                            : 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                    animate={{
                        x: [0, 30, -20, 10, 0],
                        y: [0, -20, 30, -10, 0],
                        scale: [1, 1.1, 0.95, 1.05, 1],
                    }}
                    transition={{
                        duration: blob.duration,
                        delay: blob.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Grid dot overlay */}
            <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#93C5FD_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative z-10 w-full max-w-[440px]"
                style={{
                    background: 'rgba(15,23,42,0.7)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 24,
                    padding: '40px 36px',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
                }}
            >
                {/* Logo */}
                <Link to="/" className="flex flex-col items-center mb-6 group">
                    <span className="text-3xl font-extrabold tracking-tight">
                        <span className="text-white">Code</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple">Viz</span>
                    </span>
                    <span className="text-text-2 text-sm mt-1 font-medium">Visual Code Learning</span>
                </Link>

                {/* Free badge */}
                <div className="flex justify-center mb-8">
                    <span className="px-3 py-1 bg-green/10 border border-green/30 rounded-full text-green text-xs font-bold">
                        ✨ Free forever — no credit card needed
                    </span>
                </div>

                {children}
            </motion.div>
        </div>
    );
};
