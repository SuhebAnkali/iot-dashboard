'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import TankGauge from '@/components/TankGauge';
import FlowChart, { HistoryPoint } from '@/components/FlowChart';
import WardConsumption from '@/components/WardConsumption';
import StreetLightCard from '@/components/StreetLightCard';
import ValveControl from '@/components/ValveControl';
import AlertBanner from '@/components/AlertBanner';
import ExportButtons from '@/components/ExportButtons';
import { useAuth } from '@/context/AuthContext';
import { useLiveSocket } from '@/lib/useLiveSocket';
import { apiGet } from '@/lib/api';

interface Ward {
  ward_number: number;
  ward_name: string;
}

export default function DashboardPage() {
  const { isOperator } = useAuth();
  const { status, connected } = useLiveSocket();
  const [wards, setWards] = useState<Ward[]>([]);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [fallbackStatus, setFallbackStatus] = useState<any>(null);

  useEffect(() => {
    apiGet('/api/device/wards').then(setWards).catch(() => {});
    apiGet('/api/device/history?hours=6').then(setHistory).catch(() => {});
    apiGet('/api/device/status').then(setFallbackStatus).catch(() => {});

    const interval = setInterval(() => {
      apiGet('/api/device/history?hours=6').then(setHistory).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const live = status || fallbackStatus;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-base">
        <Navbar connected={connected} />
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold text-white">Live Dashboard</h2>
              <p className="gauge-label mt-1">
                {isOperator ? 'Operator Mode — full hardware control' : 'User Mode — read-only monitoring'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ExportButtons />
              <Link href="/dashboard/schedule" className="rounded-lg border border-panel-border px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-signal-cyan hover:text-signal-cyan">
                Schedules →
              </Link>
            </div>
          </div>

          {live && <AlertBanner leakDetected={live.leakDetected ?? live.leak_detected} dryTank={live.dryTank ?? live.dry_tank} />}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            <TankGauge levelMl={live?.tankLevelMl ?? live?.tank_level_ml ?? 0} dryTank={live?.dryTank ?? live?.dry_tank ?? false} />

            <div className="panel-card p-6">
              <span className="gauge-label">Flow Rate</span>
              <p className="mt-3 font-mono text-4xl font-bold text-signal-cyan">
                {(live?.flowRateLpm ?? live?.flow_rate_lpm ?? 0).toFixed?.(2) ?? '0.00'}
                <span className="ml-1 text-sm text-slate-500">L/min</span>
              </p>
              <p className="mt-2 text-xs text-slate-500">YF-S201 flow sensor @ tank outlet</p>
            </div>

            <StreetLightCard isOn={live?.streetLight ?? live?.street_light ?? false} />

            <div className="lg:col-span-2">
              <FlowChart history={history} />
            </div>

            <WardConsumption
              wards={wards}
              consumption={{
                ward1Ml: live?.ward1Ml ?? live?.ward1_ml ?? 0,
                ward2Ml: live?.ward2Ml ?? live?.ward2_ml ?? 0,
                ward3Ml: live?.ward3Ml ?? live?.ward3_ml ?? 0,
              }}
              activeWard={live?.activeWard ?? live?.active_ward ?? 0}
            />

            <div className="lg:col-span-3">
              <ValveControl wards={wards} activeWard={live?.activeWard ?? live?.active_ward ?? 0} />
            </div>
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
