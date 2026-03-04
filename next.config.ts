import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: true
  },
  i18n: {
    locales: ["he"],
    defaultLocale: "he"
  }
};

export default nextConfig;
