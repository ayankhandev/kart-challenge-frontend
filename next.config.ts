import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "orderfoodonline.deno.dev",
      },
    ],
  },
};

export default nextConfig;
