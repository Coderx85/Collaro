import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  logging: {
    incomingRequests: true,
    browserToTerminal: true,
    fetches: {
      fullUrl: true,
    },
    serverFunctions: true,
  },
  serverExternalPackages: ["pino"],
  turbopack: {
    root: process.cwd(),
  }
};

export default nextConfig;
