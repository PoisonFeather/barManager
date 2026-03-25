import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useSocket(onNewData?: () => void) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s: Socket = io(SOCKET_URL);
    setSocket(s);

    s.on('connect', () => console.log('🔌 Conectat la Socket Server'));

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