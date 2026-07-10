'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export interface DeviceStatus {
  tankLevelMl: number;
  flowRateLpm: number;
  ward1Ml: number;
  ward2Ml: number;
  ward3Ml: number;
  activeWard: number;
  streetLight: boolean;
  leakDetected: boolean;
  dryTank: boolean;
  timestamp: string;
  stale?: boolean;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws';

/**
 * Subscribes to the backend's live telemetry WebSocket feed and
 * auto-reconnects on disconnect. Surfaces alert toasts for leak/dry-tank.
 */
export function useLiveSocket() {
  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let retryTimer: ReturnType<typeof setTimeout>;

    function connect() {
      const ws = new WebSocket(WS_URL);
      socketRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        retryTimer = setTimeout(connect, 3000);
      };
      ws.onerror = () => ws.close();

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'status') setStatus(msg.data);
          if (msg.type === 'alert') {
            toast.error(msg.message, { icon: msg.severity === 'critical' ? '🚨' : '⚠️' });
          }
          if (msg.type === 'device_offline') {
            toast.error('ESP32 device unreachable — showing last known data.');
          }
        } catch {
          // ignore malformed frames
        }
      };
    }

    connect();
    return () => {
      clearTimeout(retryTimer);
      socketRef.current?.close();
    };
  }, []);

  return { status, connected };
}
