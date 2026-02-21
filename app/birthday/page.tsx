'use client';

import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import { motion } from "motion/react";
import { useEffect, useState } from 'react';
import { images } from "@/data";

interface FloatingElement {
  id: number;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  delay: number;
  duration: number;
}

export default function BirthdayPage() {
  

  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [mounted, setMounted] = useState(false);

  const decorativeElements = [
    '🎈', '🎂', '🎁', '🎀', '🌸', '⭐', '💖', '🦋', '🎉', '🍰',
    '💝', '🎊', '🌹', '✨', '🥳', '💫', '🌠', '🎇', '❤️', '💕'
  ];

  useEffect(() => {
    setMounted(true);
    const elements: FloatingElement[] = decorativeElements.map((emoji, index) => ({
      id: index,
      emoji: emoji,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.8 + Math.random() * 0.8,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    }));

    setFloatingElements(elements);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-6xl animate-pulse">🎂</div>
      </div>
    );
  }

  return (
    <Modal>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Floating Emojis */}
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute pointer-events-none z-10"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span
              className="text-2xl md:text-3xl opacity-80 drop-shadow-lg"
              style={{
                display: 'block',
                transform: `scale(${element.scale})`
              }}
            >
              {element.emoji}
            </span>
          </motion.div>
        ))}

        {/* Main Content */}
        <div className="relative z-20 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-2xl"
          >
            {/* Birthday Card */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 dark:border-gray-700/50 text-center">
              {/* Profile Image */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-r from-pink-500 to-rose-500 p-1 shadow-2xl">
                    <img
                      src="https://res.cloudinary.com/djwzwq4cu/image/upload/v1760720992/Snapchat-1941403825_ycuajv.jpg"
                      alt="pihu"
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-lg shadow-lg animate-bounce">
                    🎂
                  </div>
                </div>
              </div>

              {/* Birthday Text */}
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Happy Birthday
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-rose-600 dark:text-rose-400 font-semibold mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                My Universe — pihu 💖
              </motion.p>

              {/* Message */}
              <motion.p
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Today is all about you — the most special person in my life.
                Every smile of yours makes my world brighter, every word from you feels like a melody.
                This website is my small way of showing how deeply you're loved, cared for, and cherished… always.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex justify-center"
              >
                <ModalTrigger className="group relative bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center space-x-3">
                  <span>💝 Click for a Special Wish!</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xl"
                  >
                    ✨
                  </motion.span>
                </ModalTrigger>
              </motion.div>

              {/* Decorative Elements */}
              <div className="flex justify-center space-x-4 mt-8">
                {["🎈", "🎁", "🌸", "⭐", "💫"].map((emoji, index) => (
                  <motion.span
                    key={index}
                    className="text-2xl opacity-70"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                      duration: 3,
                      delay: index * 0.5,
                      repeat: Infinity
                    }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Custom CSS */}
        <style jsx>{`
                    @keyframes float {
                        0%, 100% {
                            transform: translateY(0px);
                        }
                        50% {
                            transform: translateY(-20px);
                        }
                    }
                    .animate-float {
                        animation: float 3s ease-in-out infinite;
                    }
                    .animation-delay-2000 {
                        animation-delay: 2s;
                    }
                    .animation-delay-4000 {
                        animation-delay: 4s;
                    }
                `}</style>
      </div>

      {/* Modal Content */}
      <ModalBody>
        <ModalContent>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {/* Modal Header */}
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg"
              >
                💌
              </motion.div>
              <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold mb-2">
                I have one small question for you… 💫
              </h4>
              <h3 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Do you love me? 💖
              </h3>
            </div>

            {/* Image Gallery */}
            <motion.div
              className="flex justify-center items-center gap-3 mb-8 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {images.map((image, idx) => (
                <motion.div
                  key={"images" + idx}
                  style={{
                    rotate: Math.random() * 20 - 10,
                  }}
                  whileHover={{
                    scale: 1.15,
                    rotate: 0,
                    zIndex: 100,
                  }}
                  whileTap={{
                    scale: 1.1,
                    rotate: 0,
                    zIndex: 100,
                  }}
                  className="rounded-2xl p-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-white/20 dark:border-neutral-700/50 shadow-lg shrink-0 overflow-hidden"
                >
                  <img
                    src={image}
                    alt="Beautiful moments"
                    className="rounded-xl h-16 w-16 md:h-24 md:w-24 lg:h-28 lg:w-28 object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Hint Text */}
            <motion.div
              className="py-4 text-center text-neutral-500 dark:text-neutral-400 text-sm max-w-sm mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-lg">😉</span>
                <span className="text-lg">✨</span>
              </div>
              Your answer decides the next surprise...
            </motion.div>
          </motion.div>
        </ModalContent>

        <ModalFooter className="gap-4 justify-center mt-6">
          <motion.button
            onClick={() => (window.location.href = "/us")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 min-w-28"
          >
            <span>Yes</span>
            <span className="text-xl">💘</span>
          </motion.button>

          <motion.button
            whileHover={{
              x: [0, -8, 8, -8, 8, 0],
              transition: { duration: 0.5 }
            }}
            className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-2xl font-semibold text-lg shadow-lg cursor-not-allowed opacity-60 flex items-center space-x-2 min-w-28"
          >
            <span>No</span>
            <span className="text-xl">😢</span>
          </motion.button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
}