"use client";

import { useState, useEffect } from "react";

export default function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Start animation shortly after mount
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to finish before removing from DOM
    setTimeout(() => setShouldRender(false), 1000);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-2xl px-6 py-10 transform transition-transform duration-[1000ms] ease-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
        <div className="max-w-5xl mx-auto relative">
            <button
                onClick={handleClose}
                className="absolute -top-2 -right-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Close Welcome Banner"
            >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        My Daily Devotional
                    </h2>
                    <p className="text-xl font-serif italic text-gray-700 dark:text-gray-300">
                        "Your daily walk with God, enriched by technology."
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Welcome to a digital sanctuary designed to focus your heart and mind. 
                        We combine the timeless wisdom of Scripture with modern tools to offer 
                        deep, personalized insights for your daily journey.
                    </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-widest text-xs">
                        Key Features
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-start gap-3">
                            <span className="text-lg">🌅</span>
                            <span><strong>Daily Refresh:</strong> Start every morning with a curated verse and local weather.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-lg">🤖</span>
                            <span><strong>AI Insights:</strong> Dive deeper with Context, Life Application, and Guided Prayer.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-lg">📖</span>
                            <span><strong>Study Mode:</strong> Read full chapters distraction-free.</span>
                        </li>
                         <li className="flex items-start gap-3">
                            <span className="text-lg">📺</span>
                            <span><strong>Sermons:</strong> Watch curated messages to inspire your faith.</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="mt-8 text-center md:text-left">
                <button 
                    onClick={handleClose}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-all shadow-lg hover:shadow-blue-500/30"
                >
                    Get Started
                </button>
            </div>
        </div>
    </div>
  );
}