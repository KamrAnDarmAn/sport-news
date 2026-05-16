import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // remotePatterns: {
    //  [new URL("source.unsplash.com")]
    // },
  },
  async rewrites() {
    return [{ source: "/article/:slug", destination: "/articles/:slug" }];
  },
};

export default nextConfig;
