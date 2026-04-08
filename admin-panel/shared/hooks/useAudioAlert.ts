import { useEffect, useRef, useState } from "react";

export function useAudioAlerts(tableGroups: any[]) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const prevTotalAlerts = useRef(0);
  const hasInitialized = useRef(false);

  // Generează un beep scurt și clar via Web Audio API
  const playBeep = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Re-pornește contextul dacă e suspendat (tab inactiv, etc.)
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);         // La 880Hz (A5)
    oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15); // Coboară la A4

    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4); // Fade out

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  };

  // Activare audio la click — creează AudioContext dintr-un user gesture (obligatoriu)
  const enableAudio = () => {
    try {
      audioCtxRef.current = new AudioContext();
      // Cântăm un beep silențios ca să deblocăm contextul
      playBeep();
      setIsAudioEnabled(true);
    } catch (err) {
      console.error("Web Audio API indisponibilă:", err);
    }
  };

  useEffect(() => {
    if (!tableGroups || !isAudioEnabled) return;

    const currentTotal = tableGroups.reduce((acc, group) => {
      return acc + (group.pending_items?.length || 0) + (group.active_requests?.length || 0);
    }, 0);

    if (!hasInitialized.current) {
      // Prima rulare — salvăm totalul fără să alertăm
      prevTotalAlerts.current = currentTotal;
      hasInitialized.current = true;
      return;
    }

    if (currentTotal > prevTotalAlerts.current) {
      playBeep();
    }

    prevTotalAlerts.current = currentTotal;
  }, [tableGroups, isAudioEnabled]);

  return { isAudioEnabled, enableAudio };
}