import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
    ],
  },
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  webpack: (config, { isServer }) => {
    // Mark postgres as external for client-side builds to prevent bundling server-only dependencies
    if (!isServer) {
      config.externals.push("postgres");
    }
    return config;
  },
};

export default nextConfig;
