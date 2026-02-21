"use client";

import { memories } from "@/data";
import { useState, useEffect, useRef } from "react";

export default function GalleryPage() {
   

    const [mounted, setMounted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [showPlayPrompt, setShowPlayPrompt] = useState(false);
    const [selectedMemory, setSelectedMemory] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const userInteracted = useRef(false);
    const touchStartRef = useRef<number>(0);

    const backgroundMusic = "https://res.cloudinary.com/djwzwq4cu/video/upload/v1760723055/Dil_Tu_Jaan_Tu_sgwicp.mp4";

    useEffect(() => {
        setMounted(true);
        
        // Initialize audio immediately
        audioRef.current = new Audio(backgroundMusic);
        audioRef.current.loop = true;
        audioRef.current.volume = volume;
        audioRef.current.preload = "auto";

        // More aggressive auto-play attempt for mobile
        const tryAutoPlay = async () => {
            if (audioRef.current) {
                try {
                    // Set a small timeout to ensure audio is ready
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

        // Wait a bit longer for mobile
        setTimeout(tryAutoPlay, 1000);

        // Enhanced interaction detection for mobile
        const handleUserInteraction = async (event: Event) => {
            if (!userInteracted.current && audioRef.current && !isPlaying) {
                console.log("👆 User interaction detected");
                userInteracted.current = true;
                setShowPlayPrompt(false);
                
                // Add a small delay to ensure the interaction is registered
                await new Promise(resolve => setTimeout(resolve, 100));
                
                try {
                    // Reset audio and play
                    audioRef.current.currentTime = 0;
                    await audioRef.current.play();
                    setIsPlaying(true);
                    console.log("✅ Play successful after interaction");
                } catch (error) {
                    console.log("❌ Play failed after interaction:", error);
                    // If still failing, show manual play button
                    setShowPlayPrompt(true);
                }
            }
        };

        // Add comprehensive event listeners for mobile
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
                once: false, // Don't remove after first interaction
                passive: true 
            });
        });

        // Additional touch event handling for mobile
        const handleTouchStart = (e: TouchEvent) => {
            touchStartRef.current = e.timeStamp;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            // Only trigger if it's a quick tap (not a scroll)
            if (e.timeStamp - touchStartRef.current < 300 && !userInteracted.current) {
                handleUserInteraction(e);
            }
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            events.forEach(event => {
                document.removeEventListener(event, handleUserInteraction);
            });
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
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

    const openModal = (memory: any) => {
        setSelectedMemory(memory);
        setIsModalOpen(true);
        // Mark interaction for audio
        if (!userInteracted.current) {
            userInteracted.current = true;
            togglePlayPause();
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedMemory(null), 300);
    };

    const goToNext = () => {
        const currentIndex = memories.findIndex(m => m.img === selectedMemory.img);
        const nextIndex = (currentIndex + 1) % memories.length;
        setSelectedMemory(memories[nextIndex]);
    };

    const goToPrev = () => {
        const currentIndex = memories.findIndex(m => m.img === selectedMemory.img);
        const prevIndex = (currentIndex - 1 + memories.length) % memories.length;
        setSelectedMemory(memories[prevIndex]);
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isModalOpen) return;
            
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            } else if (e.key === 'ArrowLeft') {
                goToPrev();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, selectedMemory]);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                <div className="text-6xl animate-pulse">💖</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 py-12 px-4 sm:px-6 lg:px-8">
            {/* Enhanced Play Prompt Overlay for Mobile */}
            {showPlayPrompt && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 touch-manipulation">
                    <div className="bg-white/95 dark:bg-gray-800/95 rounded-3xl p-6 max-w-md w-full mx-4 text-center shadow-2xl border border-white/20">
                        <div className="text-6xl mb-4 animate-bounce">🎵</div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                            Background Music
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg leading-relaxed">
                            Tap anywhere on the screen to start the romantic background music 💖
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            (Mobile users: Try tapping on an image or empty space)
                        </p>
                        <button
                            onClick={togglePlayPause}
                            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-4 rounded-2xl font-semibold hover:scale-105 active:scale-95 transition-transform text-lg w-full touch-manipulation"
                        >
                            Start Music Now 🎶
                        </button>
                    </div>
                </div>
            )}

            {/* Enhanced Music Player Controls */}
            <div className="fixed top-4 right-4 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-3 shadow-2xl border border-white/20 dark:border-gray-700/50 touch-manipulation">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={togglePlayPause}
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-transform duration-300 touch-manipulation"
                    >
                        {isPlaying ? (
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        )}
                    </button>

                    <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-16 sm:w-20 accent-pink-500 touch-manipulation"
                        />
                    </div>

                    {/* Enhanced Music Status Indicator */}
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} transition-colors duration-300`}></div>
                </div>
                
                {/* Mobile Status Text */}
                <div className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">
                    {isPlaying ? "Playing 🎵" : "Tap to play"}
                </div>
            </div>

            {/* Mobile-friendly play button in main content */}
            {!isPlaying && !showPlayPrompt && (
                <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-30 touch-manipulation">
                    <button
                        onClick={togglePlayPause}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center space-x-2 touch-manipulation animate-pulse"
                    >
                        <span className="text-sm sm:text-base">Play Music</span>
                        <span>🎶</span>
                    </button>
                </div>
            )}

            {/* Image Modal */}
            {isModalOpen && selectedMemory && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-2 touch-manipulation">
                    <div className="relative max-w-4xl max-h-[90vh] w-full bg-white/95 dark:bg-gray-800/95 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-3 right-3 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-2xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={goToPrev}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-2xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={goToNext}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-2xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Modal Content */}
                        <div className="flex flex-col lg:flex-row h-full">
                            {/* Image Section */}
                            <div className="lg:w-2/3 p-4 flex items-center justify-center">
                                <div className="relative w-full h-64 sm:h-80 lg:h-[400px] rounded-2xl overflow-hidden">
                                    <img
                                        src={selectedMemory.img}
                                        alt="Memory"
                                        className="w-full h-full object-contain lg:object-cover rounded-2xl shadow-2xl"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${selectedMemory.color} opacity-10 rounded-2xl`} />
                                </div>
                            </div>

                            {/* Text Section */}
                            <div className="lg:w-1/3 p-4 lg:p-6 flex flex-col justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
                                <div className="text-center lg:text-left">
                                    {/* Memory Number */}
                                    <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                            #{memories.findIndex(m => m.img === selectedMemory.img) + 1}
                                        </div>
                                        <div className="text-2xl">{selectedMemory.emoji}</div>
                                    </div>

                                    {/* Short Text */}
                                    <h3 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-3">
                                        {selectedMemory.text}
                                    </h3>

                                    {/* Full Description */}
                                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-4">
                                        {selectedMemory.fullText}
                                    </p>

                                    {/* Navigation Dots */}
                                    <div className="flex justify-center lg:justify-start space-x-2 mt-6">
                                        {memories.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedMemory(memories[index])}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 touch-manipulation ${
                                                    memories[index].img === selectedMemory.img
                                                        ? 'bg-pink-500 scale-125'
                                                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-pink-300'
                                                }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Keyboard Hint */}
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                                        💡 Use arrow keys to navigate • Tap outside to close
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce animation-delay-1000"></div>
                <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-bounce animation-delay-2000"></div>
            </div>

            {/* Header */}
            <div className="text-center mb-12 relative z-10">
                <div className="animate-fade-in">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
                        <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent">
                            Our Story
                        </span>
                        <br />
                        <span className="text-2xl md:text-4xl text-gray-600 dark:text-gray-300 font-light mt-4 block">
                            in moments that take my breath away 💫
                        </span>
                    </h1>
                </div>

                {/* Auto-play Instructions */}
                {!isPlaying && !showPlayPrompt && (
                    <div className="bg-yellow-100 border border-yellow-400 rounded-2xl p-3 max-w-md mx-auto mb-6 animate-pulse">
                        <p className="text-yellow-800 text-sm text-center">
                            💡 <strong>Tap the "Play Music" button below to start background music</strong>
                        </p>
                    </div>
                )}

                {/* Decorative Hearts */}
                <div className="flex justify-center space-x-4 mt-8">
                    {["💖", "🫶", "💘", "💝", "💕"].map((heart, index) => (
                        <span
                            key={index}
                            className="text-2xl md:text-3xl animate-pulse hover:scale-110 transition-transform duration-300"
                            style={{ animationDelay: `${index * 0.2}s` }}
                        >
                            {heart}
                        </span>
                    ))}
                </div>
            </div>

            {/* Memories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto relative z-10">
                {memories.map((memory, idx) => (
                    <div
                        key={idx}
                        className="group cursor-pointer animate-fade-in-up touch-manipulation"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                        onClick={() => openModal(memory)}
                    >
                        {/* Memory Card */}
                        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-gray-700/50 transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/25 hover:scale-105 active:scale-95">
                            
                            {/* Image Container */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={memory.img}
                                    alt={`Memory ${idx + 1}`}
                                    className="w-full h-64 sm:h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                
                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-t ${memory.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                                
                                {/* Emoji Badge */}
                                <div className="absolute top-3 right-3 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-lg shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                    {memory.emoji}
                                </div>
                                
                                {/* Number Badge */}
                                <div className="absolute top-3 left-3 w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white font-bold text-xs shadow-lg">
                                    #{idx + 1}
                                </div>

                                {/* Hover Sparkle Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                                    <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-300 rounded-full animate-ping animation-delay-300"></div>
                                    <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-green-300 rounded-full animate-ping animation-delay-600"></div>
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="p-4">
                                <p className="text-base font-medium text-gray-700 dark:text-gray-200 text-center leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 line-clamp-2">
                                    {memory.text}
                                </p>
                            </div>

                            {/* Hover Effect Border */}
                            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${memory.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />
                        </div>

                        {/* Floating Hearts Container */}
                        <div className="relative h-0">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute text-pink-400 text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-bounce"
                                    style={{
                                        left: `${20 + i * 30}%`,
                                        bottom: '0%',
                                        animationDelay: `${i * 0.3}s`
                                    }}
                                >
                                    💖
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Message */}
            <div className="text-center mt-12 relative z-10 animate-fade-in">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 max-w-2xl mx-auto border border-white/20 dark:border-gray-700/50 shadow-2xl hover:shadow-2xl hover:shadow-pink-500/25 transition-all duration-500">
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
                        Every moment with you is a treasure 🎁
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        Here's to countless more memories, more laughter, and more love. 
                        You make every day feel like a celebration. Happy Birthday, my love! 🎂💝
                    </p>
                    
                    {/* Music Status */}
                    <div className="flex items-center justify-center space-x-2 mt-6">
                        <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {isPlaying ? "Music is playing 🎵" : "Tap to play music 🎶"}
                        </span>
                    </div>
                    
                    {/* Animated Hearts */}
                    <div className="flex justify-center space-x-2 mt-6">
                        {["💕", "💖", "💗", "💓", "💞"].map((heart, index) => (
                            <span
                                key={index}
                                className="text-2xl animate-pulse hover:scale-125 transition-transform duration-300"
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                {heart}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
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
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                .animation-delay-300 {
                    animation-delay: 0.3s;
                }
                .animation-delay-600 {
                    animation-delay: 0.6s;
                }
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
}