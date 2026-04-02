import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useSocket(onNewData?: () => void) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Dacă SOCKET_URL este o rută relativă (ex. '/api'), înseamnă că folosim proxy-ul Next.js 
    // pe același domeniu. Trimitem 'undefined' ca să se conecteze la origin-ul curent pe ROOT namespace, nu pe namespace-ul '/api'.
    const isRelative = SOCKET_URL.startsWith('/');
    const s: Socket = io(isRelative ? undefined : SOCKET_URL, {
      path: isRelative ? '/api/socket' : '/socket.io'
    });
    
    setSocket(s);

    s.on('connect', () => console.log('🔌 Conectat la Socket Server pe ROOT'));

    if (onNewData) {
      s.on('new-data', (data) => {
        console.log('📡 Semnal primit:', data);
        onNewData();
      });
    }

    return () => {
      s.disconnect();
    };
  }, []); // [] ca să nu se reconecteze la fiecare render

  return { socket };
}