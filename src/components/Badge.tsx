import React from 'react';
import { cn } from '../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'green' | 'blue' | 'purple' | 'amber' | 'gradient';
}

export const Badge: React.FC<BadgeProps> = ({ children, className, variant = 'blue', ...props }) => {
    const variants = {
        green: "bg-green/10 text-green border-green/20",
        blue: "bg-brand-500/10 text-brand-300 border-brand-500/20",
        purple: "bg-purple/10 text-purple border-purple/20",
        amber: "bg-amber/10 text-amber border-amber/20",
        gradient: "bg-free-gradient text-white border-white/20",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};
