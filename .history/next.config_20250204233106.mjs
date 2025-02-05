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
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.stripe.com; connect-src 'self' https://*.stripe.com; frame-src https://*.stripe.com;"
          },
        ],
      },
    ]
  },
  // ... other configurations
};