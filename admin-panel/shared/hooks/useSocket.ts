import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useSocket(onNewData: () => void) {
  useEffect(() => {
    // 1. Inițializăm conexiunea
    const socket: Socket = io(SOCKET_URL);

    // 2. Ascultăm evenimentul pe care l-am definit în Backend
    socket.on('new-data', (data) => {
      console.log('📡 Semnal primit prin Socket:', data);
      onNewData(); // Executăm funcția de refresh
    });

    // 3. Cleanup: Închidem socket-ul când barmanul pleacă de pe pagină
    return () => {
      socket.disconnect();
    };
  }, [onNewData]);
}