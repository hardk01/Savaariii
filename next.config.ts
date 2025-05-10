import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Disable React strict mode (not recommended for production)
  images: {
    domains: [process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, "") || "example.com"],
  },
  typescript: {
    ignoreBuildErrors: true, // Suppress TypeScript build errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Suppress ESLint warnings during builds
  },
};

export default nextConfig;
