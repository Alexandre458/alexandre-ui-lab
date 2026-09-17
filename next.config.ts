import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  trailingSlash: true,
  turbopack: { root: process.cwd() },
};

export default nextConfig;
