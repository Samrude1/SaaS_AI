import type { NextConfig } from "next";

const nextConfig: import("next").NextConfig = {
  output: 'export',  // This exports static HTML/JS files
  images: {
    unoptimized: true  // Required for static export
  },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

