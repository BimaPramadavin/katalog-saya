/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Ini mengizinkan semua gambar dari supabase
      },
    ],
  },
};

export default nextConfig;