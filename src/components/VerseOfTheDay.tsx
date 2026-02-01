"use client";

import { useEffect, useState, useRef } from "react";
import ChapterModal from "./ChapterModal";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface VerseData {
  text: string;
  reference: string;
  context?: string; // Added context field
}

export default function VerseOfTheDay() {
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [contextLoading, setContextLoading] = useState(false);
  const [contextError, setContextError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Ref to track if we've already started the fetch to prevent double-firing in Strict Mode
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchVerseAndContext = async () => {
      try {
        // Calculate the "Effective Date" in ET (changes at 7am ET)
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/New_York',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          hour12: false
        });
        
        const parts = formatter.formatToParts(now);
        const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || '0');
        
        const year = getPart('year');
        const month = getPart('month');
        const day = getPart('day');
        const hour = getPart('hour');

        // Logic: If hour < 7, it belongs to "yesterday"
        let effectiveDate = new Date(Date.UTC(year, month - 1, day));
        if (hour < 7) {
          effectiveDate.setDate(effectiveDate.getDate() - 1);
        }
        const dateKey = effectiveDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
        const storageKey = `votd_${dateKey}`;

        // Check Cache
        const stored = localStorage.getItem(storageKey);
        let currentVerse: VerseData | null = null;

        if (stored) {
          const parsed = JSON.parse(stored);
          currentVerse = parsed;
        } else {
           // Cleanup old keys
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('votd_') && key !== storageKey) {
                    localStorage.removeItem(key);
                }
            }

            // Fetch new verse
            const res = await fetch("https://bible-api.com/?random=verse");
            if (!res.ok) throw new Error("Failed to fetch verse");
            const data = await res.json();

            currentVerse = {
              text: data.text.trim(),
              reference: data.reference,
            };
        }

        if (currentVerse) {
            setVerse(currentVerse);
            setLoading(false); // Main verse loaded

            // Now check/fetch context if missing
            if (!currentVerse.context) {
                setContextLoading(true);
                setContextError(null);

                const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

                if (!apiKey) {
                   setContextError("AI Service not configured (API Key missing).");
                   setContextLoading(false);
                   return;
                }

                try {
                    const genAI = new GoogleGenerativeAI(apiKey);
                    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                    const prompt = `Provide a detailed, spiritual, and historical context for the Bible verse: ${currentVerse.reference} - "${currentVerse.text}". Explain its meaning and application for a daily devotional. Keep the tone encouraging and instructional. Limit the response to around 500 words.`;
                    
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    const summary = response.text();

                    currentVerse.context = summary;
                    // Update state
                    setVerse({ ...currentVerse });
                    // Update cache
                    localStorage.setItem(storageKey, JSON.stringify(currentVerse));

                } catch (err: any) {
                    console.error("Gemini Client Error:", err);
                    const errMsg = err.message || "Failed to load context.";
                    
                    if (errMsg.includes("429") || errMsg.includes("Too Many Requests")) {
                       setContextError("AI Service is busy (Rate Limit). Please try again later.");
                    } else {
                       setContextError("Temporarily unavailable.");
                    }
                }
                setContextLoading(false);
            } else {
                 if (!stored) {
                    localStorage.setItem(storageKey, JSON.stringify(currentVerse));
                 }
            }
        }

      } catch (error) {
        console.error("Error fetching verse:", error);
      } finally {
        setLoading(false);
        setContextLoading(false);
      }
    };

    fetchVerseAndContext();
  }, []);

  return (
    <div className="w-full text-center mt-8 mb-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">Verse of the Day</h1>
      <div className="min-h-[120px] flex flex-col items-center justify-center w-full">
        {loading ? (
           <div className="animate-pulse space-y-4 w-full max-w-2xl">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mx-auto mt-4"></div>
          </div>
        ) : verse ? (
          <div className="max-w-3xl mx-auto px-4 animate-in fade-in duration-700 flex flex-col items-center">
            <blockquote className="text-2xl md:text-3xl font-serif italic leading-relaxed text-gray-800 dark:text-gray-200 mb-6 text-center">
              &ldquo;{verse.text}&rdquo;
            </blockquote>
            <cite className="text-lg font-medium text-gray-600 dark:text-gray-400 not-italic block mb-4">
              — {verse.reference}
            </cite>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wider bg-transparent border-none cursor-pointer mb-12"
            >
              Read Full Chapter
            </button>
            
            {/* Context Section */}
            <div className="w-full text-left max-w-3xl border-t border-gray-200 dark:border-gray-800 pt-8">
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">The Context</h3>
                {contextLoading ? (
                    <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/6"></div>
                    </div>
                ) : verse.context ? (
                    <p className="text-gray-700 dark:text-gray-300 leading-7 whitespace-pre-line">
                        {verse.context}
                        <br />
                        <span className="text-xs text-gray-400 mt-2 block italic">Summary by Gemini AI</span>
                    </p>
                ) : (
                    <p className="text-gray-500 italic text-sm">
                        {contextError || "AI Context unavailable."}
                    </p>
                )}
            </div>

          </div>
        ) : (
           <div className="text-red-500">Failed to load verse.</div>
        )}
      </div>

      {verse && (
        <ChapterModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          chapterReference={verse.reference.split(':')[0]} 
        />
      )}
    </div>
  );
}
