import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Commented out for Vercel
  // basePath: "/my-daily-devotional", // Removed for Vercel deployment
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
