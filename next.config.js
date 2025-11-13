/** @type {import('next').NextConfig} */
const nextConfig = {
  // OpenNext Cloudflare adapter (@opennextjs/cloudflare) will handle the build
  // No output: 'export' needed - OpenNext handles runtime configuration
  images: {
    unoptimized: true, // Cloudflare Pages handles image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;

