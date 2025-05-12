const nextConfig = {
  async headers() {
    return [
      {
        source: '/images/Heizungsplakette-FavIcon.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.stripe.com; connect-src 'self' https://*.stripe.com https://4kgwz3nrvsnwdrx4.public.blob.vercel-storage.com; frame-src https://*.stripe.com;"
          },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '4kgwz3nrvsnwdrx4.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**', // Or a more specific path if needed
      },
      // You can add other hostnames here if needed
    ],
  },
  // ... other configurations
};

export default nextConfig;