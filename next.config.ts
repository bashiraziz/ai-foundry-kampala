import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  serverExternalPackages: ["@better-auth/kysely-adapter", "kysely"],
  logging: { fetches: { fullUrl: false } },
};
export default nextConfig;
