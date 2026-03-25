import { useEffect, useRef, useState } from "react";

export function useAudioAlerts(tableGroups: any[]) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevTotalAlerts = useRef(0);

  useEffect(() => {
    audioRef.current = new Audio("/ding.mp3");
    audioRef.current.load();
  }, []);

  const enableAudio = () => {
    audioRef.current?.play().then(() => {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      setIsAudioEnabled(true);
    }).catch(err => console.error("Eroare deblocare audio:", err));
  };

  useEffect(() => {
    if (!tableGroups || tableGroups.length === 0 || !isAudioEnabled) return;

    const currentTotal = tableGroups.reduce((acc, group) => {
      return acc + (group.pending_items?.length || 0) + (group.active_requests?.length || 0);
    }, 0);

    // DING! doar dacă avem ceva nou
    if (currentTotal > prevTotalAlerts.current && prevTotalAlerts.current !== 0) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log("Audio blocat:", e));
      }
    }
    prevTotalAlerts.current = currentTotal;
  }, [tableGroups, isAudioEnabled]);

  return { isAudioEnabled, enableAudio };
}