import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface NarrationControlsProps {
  /** Whether the synthesiser is currently speaking */
  isSpeaking: boolean;
  /** Whether the browser supports SpeechSynthesis */
  isSupported: boolean;
  /** Whether narration is currently enabled */
  enabled: boolean;
  /** Callback to toggle narration on/off */
  onToggle: () => void;
  /** Optional extra class names */
  className?: string;
}

// ──────────────────────────────────────────────
// Pulse ring (shown around the icon while speaking)
// ──────────────────────────────────────────────

const PulseRing: React.FC = () => (
  <motion.span
    className="absolute inset-0 rounded-full border border-brand-500/40"
    initial={{ scale: 1, opacity: 0.6 }}
    animate={{ scale: 1.55, opacity: 0 }}
    transition={{
      duration: 1.2,
      repeat: Infinity,
      ease: 'easeOut',
    }}
    aria-hidden
  />
);

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────

export const NarrationControls: React.FC<NarrationControlsProps> = ({
  isSpeaking,
  isSupported,
  enabled,
  onToggle,
  className,
}) => {
  const tooltipText = !isSupported
    ? 'Speech not supported'
    : enabled
      ? 'Disable narration'
      : 'Toggle narration';

  const Icon = enabled ? Volume2 : VolumeX;

  return (
    <div className={cn('relative group', className)}>
      {/* Button */}
      <button
        type="button"
        onClick={onToggle}
        disabled={!isSupported}
        aria-label={tooltipText}
        className={cn(
          // Base
          'relative flex items-center justify-center',
          'w-8 h-8 rounded-btn',
          'border transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50',
          'active:scale-95',

          // Enabled / disabled visual treatment
          isSupported && enabled
            ? 'bg-brand-500/15 border-brand-500/30 text-brand-300 hover:bg-brand-500/25'
            : 'bg-brand-800 border-borderAdaptive/10 text-text-2 hover:text-text-1 hover:bg-borderAdaptive/5',

          // Browser unsupported → dim & disallow
          !isSupported && 'opacity-40 cursor-not-allowed hover:bg-brand-800',
        )}
      >
        {/* Pulse rings while speaking */}
        <AnimatePresence>
          {isSpeaking && enabled && <PulseRing />}
        </AnimatePresence>

        {/* Icon with a subtle scale bump on state change */}
        <motion.span
          key={enabled ? 'on' : 'off'}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="relative z-10 flex items-center justify-center"
        >
          <Icon className="w-4 h-4" strokeWidth={2} />
        </motion.span>
      </button>

      {/* Tooltip */}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2',
          'whitespace-nowrap rounded-md px-2 py-1',
          'bg-brand-800 border border-borderAdaptive/10 shadow-layer',
          'text-[11px] font-medium text-text-2',
          'opacity-0 scale-95 transition-all duration-150',
          'group-hover:opacity-100 group-hover:scale-100',
        )}
      >
        {tooltipText}
      </span>
    </div>
  );
};

NarrationControls.displayName = 'NarrationControls';
