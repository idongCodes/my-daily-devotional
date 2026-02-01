import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/my-daily-devotional",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
