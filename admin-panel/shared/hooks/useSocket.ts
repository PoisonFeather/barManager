import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useSocket(onNewData?: () => void) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Dacă API_URL e relativ (ex. '/api' în producție), conectăm socket-ul
    // direct la originea curentă (window.location.origin), fără prefix /api.
    // Nginx va proxy-ui /socket.io/ → backend:3001.
    //
    // Dacă e URL absolut (ex. 'http://localhost:3001' în dev), conectăm direct la el.
    const isRelative = API_URL.startsWith('/');
    const socketHost = isRelative
      ? (typeof window !== 'undefined' ? window.location.origin : '')
      : API_URL;

    const s: Socket = io(socketHost, {
      path: '/socket.io',    // path-ul standard Socket.IO — Nginx sa proxy-uieze /socket.io/
      transports: ['polling', 'websocket'], // polling first, then upgrade
    });

    setSocket(s);

    s.on('connect', () => console.log('🔌 Socket conectat:', s.id));
    s.on('connect_error', (err) => console.error('❌ Socket error:', err.message));

    if (onNewData) {
      s.on('new-data', (data) => {
        console.log('📡 Semnal primit:', data);
        if (data.type === "TABLE_INACTIVE") {
          // If we are on the dashboard, we intercept this and prompt the server.
          const action = window.confirm(`Masa ${data.tableNumber} e inactivă dincolo de limita setată (${data.inactiveMinutes} min).\n\nApasă OK pentru a extinde timerul (clientul mai ramane la masa).\nApasă Cancel pentru a o închide manual.`);
          if (action) {
            const token = localStorage.getItem("token");
            if (token) {
              fetch(`${socketHost}/dashboard/tables/${data.tableId}/extend-timer`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }
              }).catch(console.error);
            }
          } else {
             // In fact here we could call close-table or prompt for payment, 
             // but usually they will click Cancel and close it nicely manually from the TableCard ui.
             alert(`Te rog localizează Masa ${data.tableNumber} pe ecran și închide-o (selectează metoda de plată).`);
          }
        }
        onNewData();
      });
    }

    return () => {
      s.disconnect();
    };
  }, []); // [] ca să nu se reconecteze la fiecare render

  return { socket };
}