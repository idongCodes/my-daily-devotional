"use client";

import { useEffect, useState } from "react";

interface ChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterReference: string;
}

interface ChapterData {
  reference: string;
  verses: {
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }[];
  text: string;
}

export default function ChapterModal({ isOpen, onClose, chapterReference }: ChapterModalProps) {
  const [data, setData] = useState<ChapterData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Animation states
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      // Small delay to allow mount before triggering transition
      requestAnimationFrame(() => {
        setIsVisible(true);
      });

      if (chapterReference) {
        setLoading(true);
        setError(null);
        
        fetch(`https://bible-api.com/${encodeURIComponent(chapterReference)}`)
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch chapter");
            return res.json();
          })
          .then((data) => {
            setData(data);
          })
          .catch((err) => {
            console.error(err);
            setError("Could not load chapter content.");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 1000); // Match duration-1000
      return () => clearTimeout(timer);
    }
  }, [isOpen, chapterReference]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-1000 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`} 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-1000 ease-in-out transform ${
          isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-8"
        }`}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {data ? data.reference : "Loading..."}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 md:p-10 space-y-6">
          {loading ? (
            <div className="space-y-4 animate-pulse">
               {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
               ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : data ? (
            <div className="prose dark:prose-invert max-w-none">
              {data.verses.map((verse) => (
                <span key={verse.verse} className="leading-8 text-lg">
                  <sup className="text-xs font-bold text-blue-500 mr-1 select-none">{verse.verse}</sup>
                  <span className="text-gray-800 dark:text-gray-200">
                    {verse.text.trim()}{" "}
                  </span>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}