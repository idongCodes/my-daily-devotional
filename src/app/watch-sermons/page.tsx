"use client";

import React, { useEffect, useState } from 'react';

interface Video {
  id: string;
  title: string;
  date: string;
}

export default function WatchSermons() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

      // Mock Data Fallback (Used if no API key is provided)
      const mockVideos: Video[] = [
        {
          id: "tE1CjTjJgGk", // Example Video ID
          title: "Waiting on God | Dr. Charles Stanley",
          date: "2023-10-15T10:00:00Z"
        },
        {
          id: "P0_yT5-yV_Y",
          title: "When You Feel Like Giving Up | Dr. Tony Evans",
          date: "2023-10-08T10:00:00Z"
        },
        {
          id: "video3",
          title: "Finding Peace in the Storm (Mock)",
          date: "2023-10-01T10:00:00Z"
        }
      ];

      if (!apiKey || !channelId) {
        console.warn("YouTube API Key or Channel ID missing. Using mock data.");
        setVideos(mockVideos);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=9&type=video`
        );

        if (!res.ok) {
           const errData = await res.json();
           throw new Error(errData.error?.message || "Failed to fetch videos");
        }

        const data = await res.json();
        
        const formattedVideos = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          date: item.snippet.publishedAt,
        }));

        setVideos(formattedVideos);
      } catch (err: any) {
        console.error("YouTube API Error:", err);
        setError("Unable to load latest sermons. Please check configuration.");
        // Fallback to mock data on error so UI isn't broken
        setVideos(mockVideos); 
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 pt-12 max-w-7xl mx-auto w-full">
      <h1 className="text-4xl font-bold mb-8 text-center">Watch Live Sermons</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 text-center max-w-2xl">
        Stay connected with the latest messages and sermons.
      </p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col space-y-4">
              <div className="bg-gray-200 dark:bg-gray-800 h-56 rounded-xl w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {videos.map((video) => (
            <div key={video.id} className="flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-transform hover:scale-[1.02] duration-200">
              {/* Video Embed */}
              <div className="relative w-full pt-[56.25%] bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: video.title }}>
                   {/* dangerouslySetInnerHTML needed because YouTube API returns HTML entities like &#39; */}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-auto">
                  {new Date(video.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
       
       {error && (
         <div className="mt-12 text-center p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
           <p>{error}</p>
         </div>
       )}
    </div>
  );
}