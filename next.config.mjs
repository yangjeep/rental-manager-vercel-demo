/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['react'],
  },
  async headers() {
    const headers = []
    // Add X-Robots-Tag noindex on demo
    if (process.env.DEMO_NOINDEX === 'true') {
      headers.push({
        source: '/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      });
    }
    return headers;
  },
};
export default nextConfig;
