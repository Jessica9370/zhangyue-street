import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cos.ap-beijing.myqcloud.com",
      },
      {
        protocol: "https",
        hostname: "*.myqcloud.com",
      },
    ],
  },
};

export default nextConfig;
