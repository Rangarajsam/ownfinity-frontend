import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ownfinity-products.s3.ap-south-1.amazonaws.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
