/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.copecart.com https://*.copecart.com;
              style-src 'self' 'unsafe-inline' https://cdn.copecart.com https://*.copecart.com;
              img-src 'self' data: https://cdn.copecart.com https://*.copecart.com;
              font-src 'self' https://cdn.copecart.com https://*.copecart.com;
              connect-src 'self' https://api.copecart.com https://*.copecart.com;
              frame-src 'self' https://cdn.copecart.com https://*.copecart.com;
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  }
}

export default nextConfig