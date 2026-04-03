import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ În Next.js 15/16, aceasta este o proprietate de bază, NU experimentală
  allowedDevOrigins: ['192.168.0.180','192.168.0.52', 'localhost:3000','andreis-macbook.tailc8a975.ts.net','indira-cryptogamical-subcandidly.ngrok-free.dev'],
  
  // 🔗 Proxy către Backend pentru a rezolva problemele de rețea/Ngrok
  async rewrites() {
    return [
      {
        source: '/socket.io/:path*',
        destination: 'http://localhost:3001/socket.io/:path*',
      },
      {
        source: '/api/socket',
        destination: 'http://localhost:3001/socket.io/',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*',
      },
      {
        source: '/socket.io/:path*',
        destination: 'http://localhost:3001/socket.io/:path*',
      },
      {
        source: '/socket.io',
        destination: 'http://localhost:3001/socket.io',
      }
    ]
  },
};

export default nextConfig;