"use client";

import { useEffect, useState } from "react";

interface VerseData {
  text: string;
  reference: string;
}

interface CachedVerse {
  verse: VerseData;
  expiresAt: number; // Timestamp
}

export default function VerseOfTheDay() {
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerse = async () => {
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
        if (stored) {
          setVerse(JSON.parse(stored));
          setLoading(false);
          return;
        }

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

        const newVerse: VerseData = {
          text: data.text.trim(),
          reference: data.reference,
        };

        localStorage.setItem(storageKey, JSON.stringify(newVerse));
        setVerse(newVerse);

      } catch (error) {
        console.error("Error fetching verse:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerse();
  }, []);

  return (
    <div className="w-full text-center mt-8 mb-12">
      <h1 className="text-4xl font-bold mb-8">Verse of the Day</h1>
      <div className="min-h-[120px] flex flex-col items-center justify-center">
        {loading ? (
           <div className="animate-pulse space-y-4 w-full max-w-2xl">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mx-auto mt-4"></div>
          </div>
        ) : verse ? (
          <div className="max-w-3xl mx-auto px-4 animate-in fade-in duration-700">
            <blockquote className="text-2xl md:text-3xl font-serif italic leading-relaxed text-gray-800 dark:text-gray-200 mb-6">
              &ldquo;{verse.text}&rdquo;
            </blockquote>
            <cite className="text-lg font-medium text-gray-600 dark:text-gray-400 not-italic">
              — {verse.reference}
            </cite>
          </div>
        ) : (
           <div className="text-red-500">Failed to load verse.</div>
        )}
      </div>
    </div>
  );
}
