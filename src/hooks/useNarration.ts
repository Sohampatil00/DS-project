import { useEffect, useRef, useState } from 'react';

// Keep a global list of utterances to prevent Chrome garbage collection
if (typeof window !== 'undefined') {
    (window as any)._activeUtterances = (window as any)._activeUtterances || [];
}

export const useNarration = (
    text: string | undefined,
    playing: boolean,
    speed: number,
    enabled: boolean
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
            utterance.pitch = 1.05; // Slightly pleasant pitch

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

            // Try to find a premium English voice
            const voices = synth.getVoices();
            const preferredVoice = 
                voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('natural')) ||
                voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('google')) ||
                voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('microsoft')) ||
                voices.find(v => v.lang.startsWith('en'));

            if (preferredVoice) {
                utterance.voice = preferredVoice;
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
    }, [text, playing, speed, enabled]);

    return {
        isSpeaking,
        isSupported: typeof window !== 'undefined' && !!window.speechSynthesis
    };
};
