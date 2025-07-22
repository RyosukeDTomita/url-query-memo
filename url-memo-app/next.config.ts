import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/url-query-memo',
  assetPrefix: '/url-query-memo/',
  images: {
    unoptimized: true,
  },
  devIndicators: false,
};

export default nextConfig;
