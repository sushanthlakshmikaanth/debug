import type { NextConfig } from "next";
import path from "node:path";
import fs from "node:fs";

// Optional loader — only include if it exists
const loaderPath = path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js');
const LOADER = fs.existsSync(loaderPath) ? loaderPath : undefined;

const nextConfig: NextConfig = {
  // Image optimization: whitelist only trusted domains
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'example.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Add more trusted domains as needed
    ],
  },

  // File tracing for serverless deployments (Vercel)
  outputFileTracingRoot: path.resolve(__dirname),

  // TypeScript & ESLint strict checks enabled for production
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },

  // Turbopack loader (conditionally enabled)
  turbopack: LOADER
    ? {
        rules: {
          "*.{jsx,tsx}": { loaders: [LOADER] },
        },
      }
    : undefined,

  // Optional: other production optimizations
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
