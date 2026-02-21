"use client";

import { voiceNotes } from "@/data";
import { useState, useEffect, useRef } from "react";

export default function VoiceNotesPage() {
    const [mounted, setMounted] = useState(false);
    const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
    const [progress, setProgress] = useState<number[]>(Array(voiceNotes.length).fill(0));
    const [durations, setDurations] = useState<string[]>(Array(voiceNotes.length).fill("0:00"));
    const [currentTimes, setCurrentTimes] = useState<string[]>(Array(voiceNotes.length).fill("0:00"));
    const [isLooping, setIsLooping] = useState(false);
    const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);


    // Format time from seconds to MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        setMounted(true);

        // Initialize audio elements
        voiceNotes.forEach((note, index) => {
            audioRefs.current[index] = new Audio(note.audioUrl);

            // Set initial duration when metadata loads
            audioRefs.current[index]!.addEventListener('loadedmetadata', () => {
                const newDurations = [...durations];
                newDurations[index] = formatTime(audioRefs.current[index]!.duration);
                setDurations(newDurations);
            });

            // Update progress and current time
            audioRefs.current[index]!.addEventListener('timeupdate', () => {
                if (audioRefs.current[index]) {
                    const audio = audioRefs.current[index]!;
                    const newProgress = [...progress];
                    const newCurrentTimes = [...currentTimes];

                    newProgress[index] = (audio.currentTime / audio.duration) * 100;
                    newCurrentTimes[index] = formatTime(audio.currentTime);

                    setProgress(newProgress);
                    setCurrentTimes(newCurrentTimes);
                }
            });

            // Handle audio end
            audioRefs.current[index]!.addEventListener('ended', () => {
                if (isLooping && currentPlaying === index) {
                    audioRefs.current[index]!.currentTime = 0;
                    audioRefs.current[index]!.play();
                } else {
                    setCurrentPlaying(null);
                    const newProgress = [...progress];
                    const newCurrentTimes = [...currentTimes];
                    newProgress[index] = 0;
                    newCurrentTimes[index] = "0:00";
                    setProgress(newProgress);
                    setCurrentTimes(newCurrentTimes);
                }
            });
        });

        return () => {
            // Cleanup
            voiceNotes.forEach((_, index) => {
                if (audioRefs.current[index]) {
                    audioRefs.current[index]!.pause();
                    audioRefs.current[index] = null;
                }
            });
        };
    }, []);

    const togglePlay = async (index: number) => {
        // Stop currently playing audio
        if (currentPlaying !== null && currentPlaying !== index) {
            audioRefs.current[currentPlaying]!.pause();
            audioRefs.current[currentPlaying]!.currentTime = 0;
            const newProgress = [...progress];
            const newCurrentTimes = [...currentTimes];
            newProgress[currentPlaying] = 0;
            newCurrentTimes[currentPlaying] = "0:00";
            setProgress(newProgress);
            setCurrentTimes(newCurrentTimes);
        }

        if (currentPlaying === index) {
            // Pause current audio
            audioRefs.current[index]!.pause();
            setCurrentPlaying(null);
        } else {
            // Play new audio
            try {
                await audioRefs.current[index]!.play();
                setCurrentPlaying(index);
            } catch (error) {
                console.log("Play failed:", error);
            }
        }
    };

    const handleProgressClick = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
        if (audioRefs.current[index]) {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const newTime = percent * audioRefs.current[index]!.duration;
            audioRefs.current[index]!.currentTime = newTime;

            const newProgress = [...progress];
            const newCurrentTimes = [...currentTimes];
            newProgress[index] = percent * 100;
            newCurrentTimes[index] = formatTime(newTime);
            setProgress(newProgress);
            setCurrentTimes(newCurrentTimes);
        }
    };

    const toggleLoop = () => {
        setIsLooping(!isLooping);
        if (currentPlaying !== null) {
            audioRefs.current[currentPlaying]!.loop = !isLooping;
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 flex items-center justify-center">
                <div className="text-6xl animate-pulse">🎵</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 py-12 px-4 sm:px-6 lg:px-8">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float animation-delay-4000"></div>
            </div>

            {/* Header */}
            <div className="text-center mb-16 relative z-10">
                <div className="animate-fade-in">
                    {/* Profile Image */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 p-1 shadow-2xl">
                                <img
                                    src="https://res.cloudinary.com/djwzwq4cu/image/upload/v1760720527/IMG-20250720-WA0024_jvuqjv.jpg"
                                    alt="Her Beautiful Smile"
                                    className="w-full h-full rounded-2xl object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg animate-pulse">
                                🎵
                            </div>
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6">
                        <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            Her Voice
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-purple-600 dark:text-purple-400 font-light mb-8">
                        Precious voice notes that make my heart sing 🎶
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center space-x-8 mt-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</div>
                            <div className="text-sm text-purple-500 dark:text-purple-300">Voice Notes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">28</div>
                            <div className="text-sm text-pink-500 dark:text-pink-300">Times Played</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">∞</div>
                            <div className="text-sm text-blue-500 dark:text-blue-300">In My Heart</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Voice Notes Grid */}
            <div className="max-w-4xl mx-auto relative z-10 space-y-6">
                {voiceNotes.map((note, index) => (
                    <div
                        key={note.id}
                        className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500"
                    >
                        <div className="flex flex-col lg:flex-row">
                            {/* Image Section */}
                            <div className="lg:w-1/3 p-6 flex items-center justify-center">
                                <div className="relative w-full h-48 rounded-2xl overflow-hidden">
                                    <img
                                        src={note.image}
                                        alt={note.title}
                                        className="w-full h-full object-cover rounded-2xl transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${note.color} opacity-20 rounded-2xl`} />
                                    <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-xl shadow-lg">
                                        {note.icon}
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="lg:w-2/3 p-6 lg:p-8">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                            {note.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                                            {note.description}
                                        </p>

                                        {/* Metadata */}
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                            <div className="flex items-center space-x-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                </svg>
                                                <span>{durations[index]}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                </svg>
                                                <span>{note.mood}</span>
                                            </div>
                                        </div>

                                        {/* Progress Bar with Time */}
                                        <div className="mb-4">
                                            <div
                                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 cursor-pointer group/progress"
                                                onClick={(e) => handleProgressClick(index, e)}
                                            >
                                                <div
                                                    className={`h-full rounded-full bg-gradient-to-r ${note.color} transition-all duration-100 relative`}
                                                    style={{ width: `${progress[index]}%` }}
                                                >
                                                    {/* Progress Handle */}
                                                    <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200 ${currentPlaying === index ? 'opacity-100' : ''
                                                        }`} />
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                                <span>{currentTimes[index]}</span>
                                                <span>{durations[index]}</span>
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() => togglePlay(index)}
                                                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300 ${currentPlaying === index
                                                    ? 'bg-gradient-to-r from-red-500 to-pink-500'
                                                    : `bg-gradient-to-r ${note.color}`
                                                    }`}
                                            >
                                                {currentPlaying === index ? (
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                )}
                                            </button>

                                            <div className="flex items-center space-x-4">
                                                {/* Loop Button */}
                                                <button
                                                    onClick={toggleLoop}
                                                    className={`p-3 rounded-xl transition-all duration-300 ${isLooping && currentPlaying === index
                                                        ? 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30'
                                                        : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                                        }`}
                                                    title="Loop"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Message */}
            <div className="text-center mt-16 relative z-10">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 max-w-2xl mx-auto border border-white/20 dark:border-gray-700/50 shadow-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Every word from you is a melody 🎶
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        These voice notes are my most treasured possessions. Each one carries your love,
                        your laughter, and the beautiful sound of your voice that I could listen to forever.
                        Thank you for sharing these precious moments with me. 💝
                    </p>

                    {/* Currently Playing Indicator */}
                    {currentPlaying !== null && (
                        <div className="flex items-center justify-center space-x-2 mt-6 p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                            <span className="font-semibold">
                                Now Playing: {voiceNotes[currentPlaying].title}
                            </span>
                        </div>
                    )}
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
                        transform: translateY(-20px);
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

/*

*/