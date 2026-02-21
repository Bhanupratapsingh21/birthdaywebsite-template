"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface NavigationBarProps {
    hiddenRoutes?: string[];
}

export default function NavigationBar({ hiddenRoutes = ["/", "/birthday"] }: NavigationBarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState("");
    const [isVisible, setIsVisible] = useState(true);

    const navigationItems = [
        {
            path: "/us",
            label: "Our Memories",
            emoji: "📸",
            color: "from-pink-500 to-rose-500"
        },
        {
            path: "/myfavsinger", 
            label: "Her Voice",
            emoji: "🎵",
            color: "from-purple-500 to-blue-500"
        },
        {
            path: "/wordsforyou",
            label: "My Letter",
            emoji: "💌",
            color: "from-orange-500 to-red-500"
        }
    ];

    // Hide navbar on specified routes
    useEffect(() => {
        setIsVisible(!hiddenRoutes.includes(pathname));
    }, [pathname, hiddenRoutes]);

    const handleNavigation = (path: string) => {
        setActiveTab(path);
        router.push(path);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-2">
                <div className="flex items-center space-x-2">
                    {navigationItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            className={`
                                relative group flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300
                                ${activeTab === item.path 
                                    ? `bg-gradient-to-r text-white shadow-lg scale-105 ${item.color}`
                                    : `text-gray-600 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600/50 hover:scale-105`
                                }
                            `}
                        >
                            <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                                {item.emoji}
                            </span>
                            
                            <span className="font-semibold hidden md:block text-lg whitespace-nowrap">
                                {item.label}
                            </span>

                            {activeTab === item.path && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}