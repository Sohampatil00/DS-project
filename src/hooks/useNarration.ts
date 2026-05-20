import { useEffect, useRef, useState } from 'react';

// Keep a global list of utterances to prevent Chrome garbage collection
if (typeof window !== 'undefined') {
    (window as any)._activeUtterances = (window as any)._activeUtterances || [];
}

export type VoiceProfile = 'hinglish-classroom' | 'indian-english' | 'soft-uk' | 'natural-us' | 'auto';

export const useNarration = (
    text: string | undefined,
    playing: boolean,
    speed: number,
    enabled: boolean,
    voiceProfile: VoiceProfile = 'auto'
) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synthRef = useRef<SpeechSynthesis | null>(
        typeof window !== 'undefined' ? window.speechSynthesis : null
    );

    useEffect(() => {
        const synth = synthRef.current;
        if (!synth) return;

        const shouldSpeak = playing && enabled && !!text;

        // Cancel any active speaking when state/text changes
        synth.cancel();

        if (!shouldSpeak) {
            setIsSpeaking(false);
            return;
        }

        // Instantly set speaking to true to pause the animation and avoid race conditions or flickering
        setIsSpeaking(true);

        const speak = () => {
            // Clean HTML tags or special characters if any
            const cleanText = text!.replace(/<\/?[^>]+(>|$)/g, "").replace(/[✓✗]/g, "");
            const utterance = new SpeechSynthesisUtterance(cleanText);

            // Set speech rate to match playback speed
            utterance.rate = speed;
            
            // Adjust pitch to make it softer and warmer.
            // A standard pitch of 0.98 - 1.0 sounds less robotic and gentler.
            utterance.pitch = (voiceProfile === 'hinglish-classroom' || voiceProfile === 'indian-english') ? 0.98 : 1.0;
            utterance.volume = voiceProfile === 'hinglish-classroom' ? 0.95 : 0.9; // 90-95% volume for a softer, more comfortable auditory experience

            // Keep reference globally to prevent GC in Chrome/Edge
            if (typeof window !== 'undefined') {
                (window as any)._activeUtterances.push(utterance);
                // Limit the size of active utterances array to avoid leaks
                if ((window as any)._activeUtterances.length > 20) {
                    (window as any)._activeUtterances.shift();
                }
            }

            const cleanGlobalRef = () => {
                if (typeof window !== 'undefined') {
                    const idx = (window as any)._activeUtterances.indexOf(utterance);
                    if (idx > -1) {
                        (window as any)._activeUtterances.splice(idx, 1);
                    }
                }
            };

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => {
                setIsSpeaking(false);
                cleanGlobalRef();
            };
            utterance.onerror = (e) => {
                console.warn("SpeechSynthesis error:", e);
                setIsSpeaking(false);
                cleanGlobalRef();
            };

            // Match voices dynamically based on selected profile
            const voices = synth.getVoices();
            let selectedVoice: SpeechSynthesisVoice | undefined;

            const isHindiVoice = (v: SpeechSynthesisVoice) => {
                const name = v.name.toLowerCase();
                const lang = v.lang.toLowerCase().replace('_', '-');
                return lang === 'hi-in' || 
                       lang.startsWith('hi') || 
                       name.includes('hindi') || 
                       name.includes('kalpana') || 
                       name.includes('hemant');
            };

            const isIndianVoice = (v: SpeechSynthesisVoice) => {
                const name = v.name.toLowerCase();
                const lang = v.lang.toLowerCase().replace('_', '-');
                return lang === 'en-in' || 
                       (lang.startsWith('en') && (
                           name.includes('india') || 
                           name.includes('heera') || 
                           name.includes('neerja') || 
                           name.includes('raveena') || 
                           name.includes('veena') || 
                           name.includes('ravi')
                       ));
            };

            const isUKVoice = (v: SpeechSynthesisVoice) => {
                const name = v.name.toLowerCase();
                const lang = v.lang.toLowerCase().replace('_', '-');
                return lang === 'en-gb' || 
                       (lang.startsWith('en') && (
                           name.includes('uk') || 
                           name.includes('united kingdom') || 
                           name.includes('hazel') || 
                           name.includes('susan') || 
                           name.includes('george') || 
                           name.includes('serena')
                       ));
            };

            const isUSVoice = (v: SpeechSynthesisVoice) => {
                const name = v.name.toLowerCase();
                const lang = v.lang.toLowerCase().replace('_', '-');
                return lang === 'en-us' || 
                       (lang.startsWith('en') && (
                           name.includes('us') || 
                           name.includes('united states') || 
                           name.includes('natural') || 
                           name.includes('zira') || 
                           name.includes('david') || 
                           name.includes('samantha')
                       ));
            };

            if (voiceProfile === 'hinglish-classroom') {
                selectedVoice = 
                    voices.find(v => isHindiVoice(v) && v.name.toLowerCase().includes('natural')) ||
                    voices.find(v => isHindiVoice(v) && v.name.toLowerCase().includes('google')) ||
                    voices.find(v => isHindiVoice(v) && v.name.toLowerCase().includes('microsoft')) ||
                    voices.find(v => isHindiVoice(v)) ||
                    voices.find(v => isIndianVoice(v) && v.name.toLowerCase().includes('natural')) ||
                    voices.find(v => isIndianVoice(v)) ||
                    voices.find(v => isUKVoice(v)) ||
                    voices.find(v => isUSVoice(v));
            } else if (voiceProfile === 'indian-english') {
                selectedVoice = 
                    voices.find(v => isIndianVoice(v) && v.name.toLowerCase().includes('natural')) ||
                    voices.find(v => isIndianVoice(v) && v.name.toLowerCase().includes('google')) ||
                    voices.find(v => isIndianVoice(v) && v.name.toLowerCase().includes('microsoft')) ||
                    voices.find(v => isIndianVoice(v)) ||
                    // Fallbacks widely understood in India
                    voices.find(v => isUKVoice(v)) ||
                    voices.find(v => isUSVoice(v));
            } else if (voiceProfile === 'soft-uk') {
                selectedVoice = 
                    voices.find(v => isUKVoice(v) && v.name.toLowerCase().includes('natural')) ||
                    voices.find(v => isUKVoice(v) && v.name.toLowerCase().includes('google')) ||
                    voices.find(v => isUKVoice(v)) ||
                    voices.find(v => isIndianVoice(v)) ||
                    voices.find(v => isUSVoice(v));
            } else if (voiceProfile === 'natural-us') {
                selectedVoice = 
                    voices.find(v => isUSVoice(v) && v.name.toLowerCase().includes('natural')) ||
                    voices.find(v => isUSVoice(v) && v.name.toLowerCase().includes('google')) ||
                    voices.find(v => isUSVoice(v)) ||
                    voices.find(v => isUKVoice(v));
            }

            // Fallback if 'auto' or no voice matched the selected profile
            if (!selectedVoice) {
                selectedVoice = 
                    voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('natural')) ||
                    voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google')) ||
                    voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('microsoft')) ||
                    voices.find(v => v.lang.startsWith('en'));
            }

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            // Ensure the speech synthesis engine is not in a stuck/paused state
            if (synth.paused) {
                synth.resume();
            }
            synth.speak(utterance);
        };

        // Web Speech API voices are often loaded dynamically
        if (synth.getVoices().length === 0) {
            synth.onvoiceschanged = () => {
                // Re-verify conditions since voice-change may fire later
                if (synth.getVoices().length > 0) {
                    speak();
                }
            };
        } else {
            speak();
        }

        return () => {
            synth.cancel();
            setIsSpeaking(false);
        };
    }, [text, playing, speed, enabled, voiceProfile]);

    return {
        isSpeaking,
        isSupported: typeof window !== 'undefined' && !!window.speechSynthesis
    };
};
