/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_SERVER: 'http://localhost:3000',
    AVATAR_STORE: 'uploads/avatars',
    ATTENDANCE_STORE: 'uploads/attendances',
    JWT_SECRET: 'JWT_PASS',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

module.exports = nextConfig;
