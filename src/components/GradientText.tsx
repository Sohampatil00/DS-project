import React from 'react';
import { cn } from '../lib/utils';

interface GradientTextProps {
    children: React.ReactNode;
    className?: string;
    animate?: boolean;
}

export const GradientText: React.FC<GradientTextProps> = ({ children, className, animate = true }) => {
    return (
        <span className={cn(
            "text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-purple to-amber bg-[length:200%_auto]",
            animate && "animate-gradient",
            className
        )}>
            {children}
        </span>
    );
};
