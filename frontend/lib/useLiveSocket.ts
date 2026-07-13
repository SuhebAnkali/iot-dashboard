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

  // Supports either backend naming style.
  deviceOnline?: boolean;
  device_online?: boolean;
}

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws';

const RECONNECT_DELAY_MS = 3000;
const ALERT_DEDUPLICATION_MS = 10000;

/**
 * Subscribes to the backend WebSocket feed.
 *
 * - Automatically reconnects when the backend WebSocket disconnects.
 * - Shows the ESP32 offline notification only once.
 * - Shows a recovery notification when the ESP32 reconnects.
 * - Prevents repeated identical alert notifications.
 */
export function useLiveSocket() {
  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const [connected, setConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const hardwareOfflineRef = useRef(false);
  const hasReceivedHardwareStateRef = useRef(false);

  const lastAlertRef = useRef<{
    message: string;
    shownAt: number;
  } | null>(null);

  useEffect(() => {
    let disposed = false;

    function clearReconnectTimer() {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    }

    function scheduleReconnect() {
      if (disposed || reconnectTimerRef.current) {
        return;
      }

      reconnectTimerRef.current = setTimeout(() => {
        reconnectTimerRef.current = null;

        if (!disposed) {
          connect();
        }
      }, RECONNECT_DELAY_MS);
    }

    function markHardwareOffline() {
      // Do nothing when the hardware was already reported offline.
      if (hardwareOfflineRef.current) {
        return;
      }

      hardwareOfflineRef.current = true;
      hasReceivedHardwareStateRef.current = true;

      toast.error(
        'ESP32 hardware is offline. Showing the last known cloud data.',
        {
          id: 'esp32-hardware-status',
          icon: '⚠️',
          duration: 5000,
        }
      );
    }

    function markHardwareOnline() {
      const wasOffline = hardwareOfflineRef.current;

      hardwareOfflineRef.current = false;

      /*
       * Show the recovery message only when the hardware had previously
       * been reported offline. This prevents an unnecessary popup when
       * the page first loads and the ESP32 is already online.
       */
      if (wasOffline && hasReceivedHardwareStateRef.current) {
        toast.success(
          'ESP32 connected. Live sensor data is now available.',
          {
            id: 'esp32-hardware-status',
            icon: '✅',
            duration: 4000,
          }
        );
      }

      hasReceivedHardwareStateRef.current = true;
    }

    function showAlertOnce(
      message: string,
      severity?: string
    ) {
      const now = Date.now();
      const previousAlert = lastAlertRef.current;

      const isRepeatedAlert =
        previousAlert?.message === message &&
        now - previousAlert.shownAt <
          ALERT_DEDUPLICATION_MS;

      if (isRepeatedAlert) {
        return;
      }

      lastAlertRef.current = {
        message,
        shownAt: now,
      };

      toast.error(message, {
        id: `device-alert-${message}`,
        icon: severity === 'critical' ? '🚨' : '⚠️',
        duration: 5000,
      });
    }

    function processStatus(deviceStatus: DeviceStatus) {
     const hardwareOnline =
        deviceStatus.deviceOnline === true ||
        deviceStatus.device_online === true;

      const correctedStatus: DeviceStatus = {
        ...deviceStatus,
        deviceOnline: hardwareOnline,
        device_online: hardwareOnline,
      };

      setStatus(correctedStatus);

     if (hardwareOnline) {
        markHardwareOnline();
      } else {
        markHardwareOffline();
      }
    }
    function connect() {
      if (
        disposed ||
        socketRef.current?.readyState === WebSocket.OPEN ||
        socketRef.current?.readyState === WebSocket.CONNECTING
      ) {
        return;
      }

      clearReconnectTimer();

      const ws = new WebSocket(WS_URL);
      socketRef.current = ws;

      ws.onopen = () => {
        if (disposed) {
          ws.close();
          return;
        }

        setConnected(true);
      };

      ws.onclose = () => {
        if (socketRef.current === ws) {
          socketRef.current = null;
        }

        if (disposed) {
          return;
        }

        setConnected(false);
        scheduleReconnect();
      };

      ws.onerror = () => {
        /*
         * onclose handles the reconnection. Calling close here avoids
         * maintaining a broken socket.
         */
        ws.close();
      };

      ws.onmessage = (event) => {
        if (disposed) {
          return;
        }

        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'status' && msg.data) {
            processStatus(msg.data as DeviceStatus);
            return;
          }

          if (msg.type === 'alert' && msg.message) {
            showAlertOnce(msg.message, msg.severity);
            return;
          }

          if (msg.type === 'device_offline') {
            markHardwareOffline();
            return;
          }

          if (
            msg.type === 'device_online' ||
            msg.type === 'device_connected'
          ) {
            markHardwareOnline();
          }
        } catch {
          // Ignore malformed WebSocket messages.
        }
      };
    }

    connect();

    return () => {
      disposed = true;
      clearReconnectTimer();

      const socket = socketRef.current;
      socketRef.current = null;

      if (socket) {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
        socket.close();
      }
    };
  }, []);

  return {
    status,
    connected,
  };
}