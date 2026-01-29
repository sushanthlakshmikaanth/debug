import type { NextConfig } from "next";
import path from "node:path";

// Only include loader if it exists inside project root
// const LOADER = path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },

  // Must point to project root
  outputFileTracingRoot: path.resolve(__dirname),

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Temporarily disable Turbopack loader for Vercel
  // turbopack: {
  //   rules: {
  //     "*.{jsx,tsx}": { loaders: [LOADER] }
  //   }
  // }
};

export default nextConfig;
