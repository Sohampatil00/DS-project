import { useEffect, useRef, useState } from 'react';

// Keep a global list of utterances to prevent Chrome garbage collection
if (typeof window !== 'undefined') {
    (window as any)._activeUtterances = (window as any)._activeUtterances || [];
}

export type VoiceProfile = 'hinglish-classroom' | 'indian-english' | 'soft-uk' | 'natural-us' | 'auto';

// Global audio cache to avoid fetching the same audio multiple times
const audioCache: Record<string, string> = {};

export const useNarration = (
    text: string | undefined,
    playing: boolean,
    speed: number,
    enabled: boolean,
    voiceProfile: VoiceProfile = 'auto',
    onEnd?: () => void
) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    // Cloud API Speech States
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const synthRef = useRef<SpeechSynthesis | null>(
        typeof window !== 'undefined' ? window.speechSynthesis : null
    );

    const onEndRef = useRef<(() => void) | undefined>(onEnd);
    useEffect(() => { 
        onEndRef.current = onEnd; 
    }, [onEnd]);

    useEffect(() => {
        const synth = synthRef.current;
        const shouldSpeak = playing && enabled && !!text;

        // 1. Cleanup previous speech sources
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        if (synth) {
            synth.cancel();
        }

        if (!shouldSpeak) {
            setIsSpeaking(false);
            return;
        }

        // 2. Read AI TTS Configurations from Local Storage
        const apiProvider = typeof window !== 'undefined' ? localStorage.getItem('tts_provider') : null;
        const apiKey = typeof window !== 'undefined' ? localStorage.getItem('tts_api_key') : null;
        const apiVoice = typeof window !== 'undefined' ? localStorage.getItem('tts_voice') : null;

        // Clean HTML tags and symbols for clear speech output
        const cleanText = text!.replace(/<\/?[^>]+(>|$)/g, "").replace(/[✓✗]/g, "");

        // 3. Helper to play fetched AI Speech URL
        const playSpeechUrl = (url: string) => {
            const audio = new Audio(url);
            audioRef.current = audio;
            audio.defaultPlaybackRate = speed;
            audio.playbackRate = speed;
            
            audio.onplay = () => setIsSpeaking(true);
            audio.onended = () => {
                setIsSpeaking(false);
                onEndRef.current?.();
            };
            audio.onerror = (e) => {
                console.warn("AI Audio playback error:", e);
                setIsSpeaking(false);
                // Fallback to browser SpeechSynthesis so the student isn't stuck
                speakWithBrowser();
            };
            audio.play().catch((err) => {
                console.warn("AI Audio play failed:", err);
                setIsSpeaking(false);
                speakWithBrowser();
            });
        };

        // 4. Cloud API Fetches
        const speakWithCloudAPI = async () => {
            const cacheKey = `${apiProvider}_${apiVoice}_${speed}_${cleanText}`;
            if (audioCache[cacheKey]) {
                playSpeechUrl(audioCache[cacheKey]);
                return;
            }

            setIsSpeaking(true); // show loader immediately
            try {
                let blob: Blob;
                if (apiProvider === 'openai') {
                    const res = await fetch("https://api.openai.com/v1/audio/speech", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${apiKey}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            model: "tts-1",
                            input: cleanText,
                            voice: apiVoice || "alloy",
                            speed: speed
                        }),
                    });
                    if (!res.ok) throw new Error("OpenAI TTS fetch failed");
                    blob = await res.blob();
                } else if (apiProvider === 'elevenlabs') {
                    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${apiVoice || "21m00Tcm4TlvDq8ikWAM"}`, {
                        method: "POST",
                        headers: {
                            "xi-api-key": apiKey || "",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            text: cleanText,
                            model_id: "eleven_monolingual_v1",
                            voice_settings: {
                                stability: 0.5,
                                similarity_boost: 0.75
                            }
                        }),
                    });
                    if (!res.ok) throw new Error("ElevenLabs TTS fetch failed");
                    blob = await res.blob();
                } else {
                    throw new Error("Unknown provider");
                }

                const url = URL.createObjectURL(blob);
                audioCache[cacheKey] = url;
                playSpeechUrl(url);
            } catch (err) {
                console.warn("AI Cloud Audio generation failed, falling back to browser SpeechSynthesis:", err);
                speakWithBrowser();
            }
        };

        // 5. High-Fidelity Browser Speech Synthesis Fallback (Prioritizing Neural & Online Voices)
        const speakWithBrowser = () => {
            if (!synth) {
                setIsSpeaking(false);
                return;
            }

            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = speed;
            
            // Indian / Hinglish adjustments
            utterance.pitch = (voiceProfile === 'hinglish-classroom' || voiceProfile === 'indian-english') ? 0.98 : 1.0;
            utterance.volume = voiceProfile === 'hinglish-classroom' ? 0.95 : 0.9;

            // Keep reference globally to prevent GC in Chrome/Edge
            if (typeof window !== 'undefined') {
                (window as any)._activeUtterances.push(utterance);
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
                onEndRef.current?.();
            };
            utterance.onerror = (e) => {
                if ((e as any).error === 'interrupted') {
                    cleanGlobalRef();
                    return;
                }
                console.warn("SpeechSynthesis error:", e);
                setIsSpeaking(false);
                cleanGlobalRef();
                onEndRef.current?.();
            };

            const voices = synth.getVoices();
            let selectedVoice: SpeechSynthesisVoice | undefined;

            const isHindiVoice = (v: SpeechSynthesisVoice) => {
                const name = v.name.toLowerCase();
                const lang = v.lang.toLowerCase().replace('_', '-');
                return lang === 'hi-in' || lang.startsWith('hi') || name.includes('hindi') || name.includes('kalpana');
            };

            const isIndianVoice = (v: SpeechSynthesisVoice) => {
                const name = v.name.toLowerCase();
                const lang = v.lang.toLowerCase().replace('_', '-');
                return lang === 'en-in' || (lang.startsWith('en') && (name.includes('india') || name.includes('neerja') || name.includes('raveena') || name.includes('veena')));
            };

            const isUKVoice = (v: SpeechSynthesisVoice) => {
                const name = v.name.toLowerCase();
                const lang = v.lang.toLowerCase().replace('_', '-');
                return lang === 'en-gb' || (lang.startsWith('en') && (name.includes('uk') || name.includes('united kingdom') || name.includes('hazel') || name.includes('serena')));
            };

            const isUSVoice = (v: SpeechSynthesisVoice) => {
                const name = v.name.toLowerCase();
                const lang = v.lang.toLowerCase().replace('_', '-');
                return lang === 'en-us' || (lang.startsWith('en') && (name.includes('us') || name.includes('united states') || name.includes('natural') || name.includes('aria') || name.includes('david')));
            };

            // Smart neural/online voice matching
            if (voiceProfile === 'hinglish-classroom') {
                selectedVoice = 
                    voices.find(v => isHindiVoice(v) && v.name.toLowerCase().includes('online')) ||
                    voices.find(v => isHindiVoice(v) && v.name.toLowerCase().includes('natural')) ||
                    voices.find(v => isHindiVoice(v)) ||
                    voices.find(v => isIndianVoice(v) && v.name.toLowerCase().includes('online')) ||
                    voices.find(v => isIndianVoice(v));
            } else if (voiceProfile === 'indian-english') {
                selectedVoice = 
                    voices.find(v => isIndianVoice(v) && v.name.toLowerCase().includes('online')) ||
                    voices.find(v => isIndianVoice(v) && v.name.toLowerCase().includes('natural')) ||
                    voices.find(v => isIndianVoice(v)) ||
                    voices.find(v => isUKVoice(v) && v.name.toLowerCase().includes('online')) ||
                    voices.find(v => isUSVoice(v) && v.name.toLowerCase().includes('online'));
            } else if (voiceProfile === 'soft-uk') {
                selectedVoice = 
                    voices.find(v => isUKVoice(v) && v.name.toLowerCase().includes('online')) ||
                    voices.find(v => isUKVoice(v) && v.name.toLowerCase().includes('natural')) ||
                    voices.find(v => isUKVoice(v));
            } else if (voiceProfile === 'natural-us') {
                selectedVoice = 
                    voices.find(v => isUSVoice(v) && v.name.toLowerCase().includes('online')) ||
                    voices.find(v => isUSVoice(v) && v.name.toLowerCase().includes('natural')) ||
                    voices.find(v => isUSVoice(v));
            }

            // High-fidelity Online Neural fallback rank list
            if (!selectedVoice) {
                selectedVoice = 
                    voices.find(v => v.name.toLowerCase().includes('online') && v.lang.startsWith('en')) ||
                    voices.find(v => v.name.toLowerCase().includes('natural') && v.lang.startsWith('en')) ||
                    voices.find(v => v.name.toLowerCase().includes('google') && v.lang.startsWith('en')) ||
                    voices.find(v => v.lang.startsWith('en'));
            }

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            if (synth.paused) {
                synth.resume();
            }
            synth.speak(utterance);
        };

        // Determine if we should generate dynamic cloud audio or use local SpeechSynthesis
        const hasAPIKey = apiKey && apiKey.trim().length > 0;
        const useCloud = hasAPIKey && (apiProvider === 'openai' || apiProvider === 'elevenlabs');

        if (useCloud) {
            speakWithCloudAPI();
        } else {
            speakWithBrowser();
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            if (synth) {
                synth.cancel();
            }
            setIsSpeaking(false);
        };
    }, [text, playing, speed, enabled, voiceProfile]);

    return {
        isSpeaking,
        isSupported: typeof window !== 'undefined' && (!!window.speechSynthesis || !!window.Audio)
    };
};
