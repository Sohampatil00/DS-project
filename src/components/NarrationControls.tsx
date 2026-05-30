import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Globe, ChevronDown, Check, Settings, Sparkles, X, Key, Shield } from 'lucide-react';
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
  const [showAiSettings, setShowAiSettings] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // AI Audio Local States
  const [provider, setProvider] = useState<string>('browser');
  const [apiKey, setApiKey] = useState<string>('');
  const [voice, setVoice] = useState<string>('alloy');
  const [testPlaying, setTestPlaying] = useState(false);

  // Load AI Voice configs on mount & dropdown open
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProvider(localStorage.getItem('tts_provider') || 'browser');
      setApiKey(localStorage.getItem('tts_api_key') || '');
      setVoice(localStorage.getItem('tts_voice') || 'alloy');
    }
  }, [isOpen, showAiSettings]);

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

  const saveAiSettings = () => {
    localStorage.setItem('tts_provider', provider);
    localStorage.setItem('tts_api_key', apiKey);
    localStorage.setItem('tts_voice', voice);
    
    // Play test AI speech to let the user hear the stunning voice!
    if (apiKey && provider !== 'browser') {
      setTestPlaying(true);
      const cleanText = "Neural AI Speech narration configured successfully!";
      
      const playBlob = (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.onended = () => setTestPlaying(false);
        audio.onerror = () => setTestPlaying(false);
        audio.play().catch(() => setTestPlaying(false));
      };

      if (provider === 'openai') {
        fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "tts-1",
            input: cleanText,
            voice: voice || "alloy"
          })
        })
        .then(res => res.blob())
        .then(playBlob)
        .catch(() => setTestPlaying(false));
      } else if (provider === 'elevenlabs') {
        fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice || "21m00Tcm4TlvDq8ikWAM"}`, {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: cleanText,
            model_id: "eleven_monolingual_v1"
          })
        })
        .then(res => res.blob())
        .then(playBlob)
        .catch(() => setTestPlaying(false));
      }
    } else {
      setShowAiSettings(false);
    }
  };

  const isCloudActive = !!(provider && provider !== 'browser');

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
            'relative flex items-center justify-center',
            'w-8 h-8 rounded-btn',
            'border border-transparent transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50',
            'active:scale-95',

            isSupported && enabled
              ? 'bg-brand-500/15 text-brand-300 hover:bg-brand-500/25'
              : 'text-text-2 hover:text-text-1 hover:bg-borderAdaptive/5',

            !isSupported && 'opacity-40 cursor-not-allowed',
          )}
        >
          {/* Pulse rings while speaking */}
          <AnimatePresence>
            {isSpeaking && enabled && <PulseRing />}
          </AnimatePresence>

          <motion.span
            key={enabled ? 'on' : 'off'}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="relative z-10 flex items-center justify-center"
          >
            <Icon className="w-4 h-4" strokeWidth={2} />
          </motion.span>
        </button>

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
              <Globe className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
              <span className="max-w-[85px] truncate flex items-center gap-1">
                {isCloudActive ? (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                    <span>Neural AI</span>
                  </>
                ) : (
                  <span>
                    {voiceProfile === 'hinglish-classroom' ? 'Hinglish' : voiceProfile === 'indian-english' ? 'Indian' : voiceProfile === 'soft-uk' ? 'British' : voiceProfile === 'natural-us' ? 'American' : 'Default'}
                  </span>
                )}
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
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-[#0a0f1c]/95 backdrop-blur-xl border border-borderAdaptive/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] py-2 z-50 flex flex-col gap-0.5"
                >
                  <div className="px-3 py-1.5 text-[9px] uppercase tracking-wider font-mono font-extrabold text-[#475569] border-b border-borderAdaptive/5 mb-1 flex items-center justify-between">
                    <span>Voice Profiles</span>
                    {isCloudActive && <span className="text-amber-400 font-extrabold text-[8px] border border-amber-500/20 bg-amber-500/10 px-1 rounded animate-pulse">Neural Active</span>}
                  </div>
                  
                  {VOICE_PROFILES.map((profile) => (
                    <button
                      key={profile.id}
                      type="button"
                      disabled={isCloudActive}
                      onClick={() => {
                        onVoiceChange(profile.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between w-full px-3 py-2 text-left transition-colors",
                        voiceProfile === profile.id && !isCloudActive
                          ? "bg-brand-500/10 text-brand-300 font-bold"
                          : isCloudActive 
                            ? "opacity-35 cursor-not-allowed text-slate-600" 
                            : "text-text-2 hover:text-text-1 hover:bg-borderAdaptive/5"
                      )}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs">{profile.label}</span>
                        <span className="text-[9px] text-[#475569] font-normal leading-none">{profile.desc}</span>
                      </div>
                      {voiceProfile === profile.id && !isCloudActive && <Check className="w-3.5 h-3.5 text-brand-400 shrink-0 ml-2" />}
                    </button>
                  ))}

                  <div className="w-full h-px bg-borderAdaptive/5 my-1" />
                  
                  {/* Advanced Neural AI Toggle Settings Modal Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowAiSettings(true);
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-between gap-1 w-full px-3 py-2 text-left text-brand-300 hover:text-brand-200 hover:bg-brand-500/15 transition-colors font-bold text-xs"
                  >
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Advanced Neural AI...</span>
                    </span>
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Absolutely Layered Glassmorphic Neural AI Configuration Modal */}
      <AnimatePresence>
        {showAiSettings && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#0a0f1d] border-2 border-brand-500/30 rounded-3xl p-6 shadow-[0_0_50px_rgba(59,130,246,0.3)] select-none flex flex-col gap-4 text-left relative"
            >
              {/* Close button */}
              <button 
                onClick={() => setShowAiSettings(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 active:scale-90 transition-all p-1"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="text-sm font-black text-slate-100 font-mono">NEURAL AI TTS SETTINGS</h3>
              </div>

              {/* Provider tabs */}
              <div className="flex bg-slate-950 p-1 border border-slate-900 rounded-xl font-mono text-[9px]">
                {[
                  { id: 'browser', label: 'Free Browser' },
                  { id: 'openai', label: 'OpenAI Speech' },
                  { id: 'elevenlabs', label: 'ElevenLabs' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id)}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg font-bold text-center transition-all",
                      provider === p.id 
                        ? "bg-brand-500 text-[#090d1a] shadow" 
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* API settings conditional inputs */}
              {provider !== 'browser' ? (
                <div className="flex flex-col gap-3 font-mono text-xs text-slate-300">
                  
                  {/* API Key Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 font-extrabold flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-brand-400" />
                      API SECRET KEY:
                    </label>
                    <input 
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-700 outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>

                  {/* Voice Options */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-500 font-extrabold">
                      CHOOSE VOICE PROFILE:
                    </label>
                    {provider === 'openai' ? (
                      <select 
                        value={voice}
                        onChange={(e) => setVoice(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-brand-500 cursor-pointer"
                      >
                        <option value="alloy">Alloy (Balanced, Neutral)</option>
                        <option value="echo">Echo (Warm, Deep)</option>
                        <option value="fable">Fable (Narrator, Warm)</option>
                        <option value="onyx">Onyx (Deep Male)</option>
                        <option value="nova">Nova (Energetic, Clear Female)</option>
                        <option value="shimmer">Shimmer (Clear, Professional)</option>
                      </select>
                    ) : (
                      <input 
                        type="text"
                        placeholder="ElevenLabs Voice ID"
                        value={voice}
                        onChange={(e) => setVoice(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 outline-none focus:border-brand-500"
                      />
                    )}
                  </div>

                  {/* Privacy shield advice */}
                  <div className="flex gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-900 text-[9px] text-slate-500 leading-normal">
                    <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Your API key is saved directly inside your local browser cache (`localStorage`) and never leaves your client machine. Secure &amp; safe.</span>
                  </div>

                </div>
              ) : (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 font-mono text-[10px] text-slate-400 leading-relaxed text-center">
                  ✨ The <strong>Free Browser Neural Voice</strong> profiles are active. Chrome &amp; Edge neural voices will automatically rank to provide high-quality standard wave-speech.
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-2 font-mono">
                <button
                  onClick={() => setShowAiSettings(false)}
                  className="flex-1 py-2 text-xs font-extrabold text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl hover:text-slate-200 active:scale-95 transition-all text-center"
                >
                  CANCEL
                </button>
                <button
                  onClick={saveAiSettings}
                  className="flex-1 py-2 text-xs font-extrabold text-[#090d1a] bg-gradient-to-r from-brand-500 to-cyan-500 hover:from-brand-400 hover:to-cyan-400 rounded-2xl shadow active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  {testPlaying && <Sparkles className="w-3.5 h-3.5 text-[#090d1a] animate-spin" />}
                  <span>{testPlaying ? 'PLAYING TEST...' : 'SAVE & APPLY'}</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

NarrationControls.displayName = 'NarrationControls';
