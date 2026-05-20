import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type VoiceProfile = 'hinglish-classroom' | 'indian-english' | 'soft-uk' | 'natural-us' | 'auto';

export interface NarrationControlsProps {
  /** Whether the synthesiser is currently speaking */
  isSpeaking: boolean;
  /** Whether the browser supports SpeechSynthesis */
  isSupported: boolean;
  /** Whether narration is currently enabled */
  enabled: boolean;
  /** Callback to toggle narration on/off */
  onToggle: () => void;
  /** Currently selected voice profile */
  voiceProfile: VoiceProfile;
  /** Callback when voice profile changes */
  onVoiceChange: (voice: VoiceProfile) => void;
  /** Optional extra class names */
  className?: string;
}

const VOICE_PROFILES = [
  { id: 'hinglish-classroom', label: '🏫 Hinglish Classroom', desc: 'Warm local explanation & pronunciation' },
  { id: 'indian-english', label: '🇮🇳 Indian English', desc: 'Clear accent for Indian students' },
  { id: 'soft-uk', label: '🇬🇧 Soft British', desc: 'Gentle, slow & articulate' },
  { id: 'natural-us', label: '🇺🇸 Natural American', desc: 'Standard conversational pace' },
  { id: 'auto', label: '⚙️ System Default', desc: 'Your device default voice' },
] as const;

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
  voiceProfile,
  onVoiceChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tooltipText = !isSupported
    ? 'Speech not supported'
    : enabled
      ? 'Disable narration'
      : 'Toggle narration';

  const Icon = enabled ? Volume2 : VolumeX;

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn('relative flex items-center gap-1 bg-[#090D16]/50 p-0.5 rounded-btn border border-borderAdaptive/5', className)}>
      {/* Toggle Button */}
      <div className="relative group">
        <button
          type="button"
          onClick={onToggle}
          disabled={!isSupported}
          aria-label={tooltipText}
          className={cn(
            // Base
            'relative flex items-center justify-center',
            'w-8 h-8 rounded-btn',
            'border border-transparent transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50',
            'active:scale-95',

            // Enabled / disabled visual treatment
            isSupported && enabled
              ? 'bg-brand-500/15 text-brand-300 hover:bg-brand-500/25'
              : 'text-text-2 hover:text-text-1 hover:bg-borderAdaptive/5',

            // Browser unsupported → dim & disallow
            !isSupported && 'opacity-40 cursor-not-allowed',
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

        {/* Tooltip (only when dropdown is closed) */}
        {!isOpen && (
          <span
            role="tooltip"
            className={cn(
              'pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2',
              'whitespace-nowrap rounded-md px-2 py-1',
              'bg-[#080C10] border border-borderAdaptive/10 shadow-layer',
              'text-[11px] font-medium text-text-2',
              'opacity-0 scale-95 transition-all duration-150',
              'group-hover:opacity-100 group-hover:scale-100 z-50',
            )}
          >
            {tooltipText}
          </span>
        )}
      </div>

      {/* Divider and Voice Dropdown */}
      {isSupported && enabled && (
        <>
          <span className="w-px h-5 bg-borderAdaptive/10 mx-0.5" aria-hidden />

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 h-8 rounded-btn text-xs font-semibold select-none transition-all duration-150',
                isOpen 
                  ? 'bg-brand-500/10 text-brand-300 border border-brand-500/20' 
                  : 'text-text-2 hover:text-text-1 hover:bg-borderAdaptive/5 border border-transparent'
              )}
            >
              <Globe className="w-3.5 h-3.5 text-brand-400" />
              <span className="max-w-[72px] truncate">
                {voiceProfile === 'hinglish-classroom' ? 'Hinglish' : voiceProfile === 'indian-english' ? 'Indian' : voiceProfile === 'soft-uk' ? 'British' : voiceProfile === 'natural-us' ? 'American' : 'Default'}
              </span>
              <ChevronDown className={cn("w-3 h-3 text-text-3 transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-[#0B0F19]/95 backdrop-blur-xl border border-borderAdaptive/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-2 z-50 flex flex-col gap-0.5"
                >
                  <div className="px-3 py-1.5 text-[9px] uppercase tracking-wider font-mono font-extrabold text-[#475569] border-b border-borderAdaptive/5 mb-1">
                    Voice Settings
                  </div>
                  {VOICE_PROFILES.map((profile) => (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => {
                        onVoiceChange(profile.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 text-left transition-colors",
                        voiceProfile === profile.id
                          ? "bg-brand-500/10 text-brand-300 font-bold"
                          : "text-text-2 hover:text-text-1 hover:bg-borderAdaptive/5"
                      )}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs">{profile.label}</span>
                        <span className="text-[9px] text-[#475569] font-normal leading-none">{profile.desc}</span>
                      </div>
                      {voiceProfile === profile.id && <Check className="w-3.5 h-3.5 text-brand-400 shrink-0 ml-2" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

NarrationControls.displayName = 'NarrationControls';
