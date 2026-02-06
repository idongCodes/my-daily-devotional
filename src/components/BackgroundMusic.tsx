"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    // Function to initialize the player
    const initPlayer = () => {
      if (playerRef.current) return; // Already initialized

      playerRef.current = new window.YT.Player("youtube-player-hidden", {
        height: "0",
        width: "0",
        videoId: "U3Skc4MQlqU",
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          modestbranding: 1,
          playlist: "U3Skc4MQlqU", // Required for looping single video
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(15); // Set low volume (15%)
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    };

    // Check if API is already ready
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Define global callback
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };

      // Load script if not present
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }
    }

    return () => {
        // Optional cleanup
    };
  }, []);

  const togglePlay = () => {
    if (!playerRef.current) return;
    const state = playerRef.current.getPlayerState();
    if (state === window.YT.PlayerState.PLAYING) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden container for the YouTube iframe */}
      <div id="youtube-player-hidden" className="hidden" />

      {/* Control Button */}
      <button
        onClick={togglePlay}
        className={`
            group flex items-center justify-center w-12 h-12 rounded-full shadow-xl 
            backdrop-blur-md border border-gray-200 dark:border-gray-700
            transition-all duration-300 ease-in-out
            ${isPlaying ? 'bg-white/80 dark:bg-gray-900/80 text-blue-600 dark:text-blue-400 animate-pulse-slow' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}
            hover:scale-110 hover:bg-white dark:hover:bg-gray-700
        `}
        aria-label={isPlaying ? "Pause Background Music" : "Play Background Music"}
        title={isPlaying ? "Pause Music" : "Play Music"}
      >
        {isPlaying ? (
           <div className="flex gap-1">
             <span className="block w-1 h-4 bg-current rounded-full animate-music-bar-1"></span>
             <span className="block w-1 h-4 bg-current rounded-full animate-music-bar-2"></span>
             <span className="block w-1 h-4 bg-current rounded-full animate-music-bar-3"></span>
           </div>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      
      {/* Tooltip / Label */}
      <div className={`
        absolute right-full mr-3 px-3 py-1 rounded-lg bg-black/80 text-white text-xs font-medium whitespace-nowrap
        transition-all duration-300 transform origin-right
        ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
      `}>
        {isPlaying ? 'Pause Music' : 'Play Music'}
      </div>
      
      <style jsx global>{`
        @keyframes music-bar {
          0%, 100% { height: 8px; }
          50% { height: 16px; }
        }
        .animate-music-bar-1 { animation: music-bar 1s infinite ease-in-out; }
        .animate-music-bar-2 { animation: music-bar 1s infinite ease-in-out 0.2s; }
        .animate-music-bar-3 { animation: music-bar 1s infinite ease-in-out 0.4s; }
      `}</style>
    </div>
  );
}
