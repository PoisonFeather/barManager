import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ În Next.js 15/16, aceasta este o proprietate de bază, NU experimentală
//  allowedDevOrigins: ['192.168.0.180','192.168.0.52', 'localhost:3000','andreis-macbook.tailc8a975.ts.net','indira-cryptogamical-subcandidly.ngrok-free.dev'],

  // mod standalone (reduce dimensiunea la deploy)
 //  output: 'export',
  
  // 🔗 Proxy către Backend pentru a rezolva problemele de rețea/Ngrok
  async rewrites() {
    return [
      {
        source: '/api/socket/:path*',
        destination: 'http://app:3001/socket.io/:path*',
      },
      {
        source: '/socket.io/:path*',
        destination: 'http://app:3001/socket.io/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://app:3001/:path*',
      }
    ]
  },
};

export default nextConfig;
