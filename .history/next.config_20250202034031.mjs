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
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' https://cdn.copecart.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://api.copecart.com;"
          }
        ]
      }
    ]
  }
}
  experimental: {
    // Entfernen Sie die 'appDir' Option, da sie in Next.js 14 nicht mehr benötigt wird
  }


export default nextConfig