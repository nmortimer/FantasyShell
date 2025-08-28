/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  experimental: {},
  env: {
    NEXT_PUBLIC_DATA_PROVIDER: process.env.DATA_PROVIDER || 'mock',
  },
};

export default nextConfig;
