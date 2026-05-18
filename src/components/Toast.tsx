import React from 'react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useStore();

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={cn(
                            "pointer-events-auto flex items-center gap-3 glass px-4 py-3 rounded-card min-w-[300px] shadow-layer transition-colors",
                            toast.type === 'success' && "border-green/30 bg-green/5",
                            toast.type === 'error' && "border-rose/30 bg-rose/5",
                            toast.type === 'info' && "border-brand-300/30 bg-brand-300/5",
                        )}
                    >
                        {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green flex-shrink-0" />}
                        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose flex-shrink-0" />}
                        {toast.type === 'info' && <Info className="w-5 h-5 text-brand-300 flex-shrink-0" />}
                        <p className="flex-1 text-sm font-medium text-text-1">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-text-2 hover:text-text-1 transition-colors flex-shrink-0"
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
