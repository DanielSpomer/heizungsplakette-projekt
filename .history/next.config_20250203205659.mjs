/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Entfernen Sie die 'appDir' Option, da sie in Next.js 14 nicht mehr benötigt wird
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://copecart.com https://*.copecart.com https://cdn.copecart.com; connect-src 'self' https://api.copecart.com; frame-src https://checkout.copecart.com;",
          },
        ],
      },
    ];
  },
}

export default nextConfig