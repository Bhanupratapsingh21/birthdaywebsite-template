"use client";

import { backgroundMusic, letterLines } from "@/data";
import { useState, useEffect, useRef } from "react";

export default function LetterPage() {
    const [mounted, setMounted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [showPlayPrompt, setShowPlayPrompt] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const userInteracted = useRef(false);

  

    useEffect(() => {
        setMounted(true);

        // Initialize audio immediately
        audioRef.current = new Audio(backgroundMusic);
        audioRef.current.loop = true;
        audioRef.current.volume = volume;
        audioRef.current.preload = "auto";

        // Auto-play attempt
        const tryAutoPlay = async () => {
            if (audioRef.current) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    audioRef.current.currentTime = 0;
                    await audioRef.current.play();
                    setIsPlaying(true);
                    userInteracted.current = true;
                    console.log("🎵 Auto-play successful");
                } catch (error) {
                    console.log("❌ Auto-play failed, waiting for user interaction");
                    setShowPlayPrompt(true);
                }
            }
        };

        setTimeout(tryAutoPlay, 1000);

        // Enhanced interaction detection
        const handleUserInteraction = async (event: Event) => {
            if (!userInteracted.current && audioRef.current && !isPlaying) {
                console.log("👆 User interaction detected");
                userInteracted.current = true;
                setShowPlayPrompt(false);

                await new Promise(resolve => setTimeout(resolve, 100));

                try {
                    audioRef.current.currentTime = 0;
                    await audioRef.current.play();
                    setIsPlaying(true);
                    console.log("✅ Play successful after interaction");
                } catch (error) {
                    console.log("❌ Play failed after interaction:", error);
                    setShowPlayPrompt(true);
                }
            }
        };

        // Add event listeners
        const events = [
            'click',
            'touchstart',
            'touchend',
            'keydown',
            'scroll',
            'mousedown',
            'pointerdown'
        ];

        events.forEach(event => {
            document.addEventListener(event, handleUserInteraction, {
                once: false,
                passive: true
            });
        });

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            events.forEach(event => {
                document.removeEventListener(event, handleUserInteraction);
            });
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlayPause = async () => {
        if (audioRef.current) {
            userInteracted.current = true;
            setShowPlayPrompt(false);

            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                try {
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (error) {
                    console.log("❌ Manual play failed:", error);
                }
            }
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20 flex items-center justify-center">
                <div className="text-6xl animate-pulse">💌</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 touch-manipulation">
            {/* Enhanced Play Prompt Overlay */}
            {showPlayPrompt && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 touch-manipulation">
                    <div className="bg-white/95 dark:bg-gray-800/95 rounded-3xl p-6 max-w-md w-full mx-4 text-center shadow-2xl border border-white/20">
                        <div className="text-6xl mb-4 animate-bounce">🎵</div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                            Background Music
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg leading-relaxed">
                            Tap anywhere to start the romantic background music 💖
                        </p>
                        <button
                            onClick={togglePlayPause}
                            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-4 rounded-2xl font-semibold hover:scale-105 active:scale-95 transition-transform text-lg w-full touch-manipulation"
                        >
                            Start Music Now 🎶
                        </button>
                    </div>
                </div>
            )}

            {/* Music Player Controls */}
            <div className="fixed top-4 right-4 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-3 shadow-2xl border border-white/20 dark:border-gray-700/50 touch-manipulation">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={togglePlayPause}
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-transform duration-300 touch-manipulation"
                    >
                        {isPlaying ? (
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>

                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-16 sm:w-20 accent-rose-500 touch-manipulation"
                        />
                    </div>

                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} transition-colors duration-300`}></div>
                </div>

                <div className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">
                    {isPlaying ? "Playing 🎵" : "Tap to play"}
                </div>
            </div>

            {/* Mobile-friendly play button */}
            {!isPlaying && !showPlayPrompt && (
                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30 touch-manipulation">
                    <button
                        onClick={togglePlayPause}
                        className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center space-x-2 touch-manipulation animate-pulse"
                    >
                        <span className="text-sm sm:text-base">Play Music</span>
                        <span>🎶</span>
                    </button>
                </div>
            )}

            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-4000"></div>

                {/* Floating Hearts */}
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute text-pink-300 text-2xl animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${i * 0.7}s`,
                            animationDuration: `${6 + Math.random() * 4}s`
                        }}
                    >
                        {["💖", "💕", "💗", "💓", "💞", "💘", "💝", "🫶"][i]}
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="text-center mb-8 sm:mb-12 relative z-10">
                <div className="animate-fade-in">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-4 sm:mb-6">
                        <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                            To You, My Love
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-rose-600 dark:text-rose-400 font-light mb-6 sm:mb-8">
                        A letter straight from my heart 💌
                    </p>

                    {/* Envelope Icon */}
                    <div className="flex justify-center mb-6 sm:mb-8">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl shadow-2xl animate-bounce">
                            💝
                        </div>
                    </div>

                    {/* Auto-play Instructions */}
                    {!isPlaying && !showPlayPrompt && (
                        <div className="bg-yellow-100 border border-yellow-400 rounded-2xl p-3 max-w-md mx-auto mb-4 animate-pulse">
                            <p className="text-yellow-800 text-sm text-center">
                                💡 <strong>Tap the "Play Music" button to start background music</strong>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Letter Container */}
            <div className="max-w-4xl mx-auto relative z-10 mb-8">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">

                    {/* Letter Header */}
                    <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 sm:p-8 text-center">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                            My Heart's Message
                        </h2>
                        <p className="text-rose-100 text-base sm:text-lg">
                            All my feelings, laid bare for you to read 💫
                        </p>
                    </div>

                    {/* Letter Content - All lines visible */}
                    <div className="p-6 sm:p-8 md:p-12">
                        <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
                            {letterLines.map((line, index) => (
                                <div
                                    key={index}
                                    className={`transition-all duration-500 opacity-100 transform translate-x-0 ${line === "" ? "h-4 sm:h-6" : ""
                                        }`}
                                >
                                    {line === "" ? (
                                        <div className="border-b border-rose-200 dark:border-rose-800 w-16 mx-auto"></div>
                                    ) : (
                                        <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-200 font-medium text-center sm:text-left">
                                            {line}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Romantic Signature */}
                        <div className="text-center mt-8 sm:mt-12 pt-6 border-t border-rose-200 dark:border-rose-800">
                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-lg shadow-lg">
                                    💝
                                </div>
                                <div className="text-center sm:text-left">
                                    <p className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400">
                                        Forever Yours
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                                        With all the love in my heart
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Letter Footer */}
                    <div className="bg-rose-50 dark:bg-rose-900/20 p-4 sm:p-6 text-center border-t border-rose-200 dark:border-rose-800">
                        <p className="text-rose-600 dark:text-rose-400 text-xs sm:text-sm">
                            Written with eternal love • Your baby 
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-4 z-20 flex flex-col space-y-3 touch-manipulation">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-2xl hover:scale-110 active:scale-95 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 touch-manipulation"
                    title="Scroll to Top"
                >
                    ⬆️
                </button>
            </div>

            {/* Footer Message */}
            <div className="text-center mt-8 relative z-10">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 max-w-2xl mx-auto border border-white/20 dark:border-gray-700/50 shadow-2xl">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Every word comes from the deepest part of my soul 🌹
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                        Thank you for being the most amazing person in my life.
                        This letter barely scratches the surface of how much you mean to me.
                        I love you more than words can express. 💖
                    </p>

                    {/* Music Status */}
                    <div className="flex items-center justify-center space-x-2 mt-4">
                        <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {isPlaying ? "Background music is playing 🎵" : "Tap to play romantic music 🎶"}
                        </span>
                    </div>

                    {/* Animated Hearts */}
                    <div className="flex justify-center space-x-2 mt-4">
                        {["💕", "💖", "💗", "💓", "💞"].map((heart, index) => (
                            <span
                                key={index}
                                className="text-xl animate-pulse hover:scale-125 transition-transform duration-300"
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                {heart}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom CSS */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}