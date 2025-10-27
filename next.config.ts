/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // разрешаем любые субдомены supabase.co
      },
    ],
  },
}

module.exports = nextConfig;
