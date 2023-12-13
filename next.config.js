/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_SERVER: 'https://timekeeping-api.onrender.com',
    AVATAR_STORE: 'uploads/avatars',
    ATTENDANCE_STORE: 'uploads/attendances',
    JWT_SECRET: 'JWT_PASS',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
