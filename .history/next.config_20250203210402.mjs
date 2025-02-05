/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://copecart.com https://*.copecart.com https://cdn.copecart.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.copecart.com; frame-src https://checkout.copecart.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;