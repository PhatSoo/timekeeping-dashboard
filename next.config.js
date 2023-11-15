/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_SERVER: 'http://192.168.1.237:3000',
    JWT_SECRET: 'JWT_PASS',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
    ],
  },
};

module.exports = nextConfig;
