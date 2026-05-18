import React from 'react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export const GlassCard = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof motion.div>>(({ className, children, ...props }, ref) => {
    return (
        <motion.div
            ref={ref}
            className={cn("glass rounded-card p-6", className)}
            {...props}
        >
            {children}
        </motion.div>
    );
});
GlassCard.displayName = "GlassCard";
