import withBundleAnalyzer from "@next/bundle-analyzer";
import { NextConfig } from "next";

export const withAnalyzer = (sourceConfig: NextConfig): NextConfig => withBundleAnalyzer()(sourceConfig) 
 
const config: NextConfig = withAnalyzer({
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
})

export default config;