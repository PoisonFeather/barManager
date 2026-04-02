import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ În Next.js 15/16, aceasta este o proprietate de bază, NU experimentală
  allowedDevOrigins: ['192.168.0.180','192.168.0.52', 'localhost:3000','andreis-macbook.tailc8a975.ts.net'],
  
  /* alte opțiuni aici, dar NU în interiorul "experimental" */
};

export default nextConfig;