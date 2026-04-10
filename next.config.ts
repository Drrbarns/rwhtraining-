import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Bypass Vercel image optimization endpoint so public assets
    // load directly even when optimization billing is unavailable.
    unoptimized: true,
  },
};

export default nextConfig;
