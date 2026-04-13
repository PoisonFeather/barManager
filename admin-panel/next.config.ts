import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ În Next.js 15/16, aceasta este o proprietate de bază, NU experimentală
//  allowedDevOrigins: ['192.168.0.180','192.168.0.52', 'localhost:3000','andreis-macbook.tailc8a975.ts.net','indira-cryptogamical-subcandidly.ngrok-free.dev'],

  // mod standalone (reduce dimensiunea la deploy)
 //  output: 'export',
  
  // 🔗 Proxy către Backend
  async rewrites() {
    return {
      // beforeFiles: rulele de socket sunt interceptate ÎNAINTE de rutele Next.js
      // și se aplică și pe path-uri cu trailing slash
      beforeFiles: [
        // Socket.IO — trailing slash explicit (asta trimite Socket.IO client)
        {
          source: '/api/socket/',
          destination: 'http://app:3001/socket.io/',
        },
        {
          source: '/api/socket/:path*',
          destination: 'http://app:3001/socket.io/:path*',
        },
        {
          source: '/socket.io/',
          destination: 'http://app:3001/socket.io/',
        },
        {
          source: '/socket.io/:path*',
          destination: 'http://app:3001/socket.io/:path*',
        },
      ],
      afterFiles: [
        // API general
        {
          source: '/api/:path*',
          destination: 'http://app:3001/:path*',
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
