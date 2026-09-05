"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useTransition } from "react";
import Environment from "./Environment";
import City from "./City";
import WaterTank from "./WaterTank";
import PumpStation from "./PumpStation";
import Pipelines from "./Pipelines";
import Valve, { ValveState } from "./Valve";
import StreetLights from "./StreetLights";
import Wards from "./Wards";
import WaterParticles from "./WaterParticles";
import AnomalyZone from "./AnomalyZone";
import CameraController from "./CameraController";

export type DigitalTwinMode = "CITY" | "WATER" | "LIGHTING" | "AI" | "ENERGY" | "NIGHT";

interface DigitalTwinProps {
  sceneIndex: number;
  setSceneIndex: (idx: number) => void;
  isDemoRunning: boolean;
  activeMode?: DigitalTwinMode;
  onObjectSelect?: (meta: { type: string; id: string; details: any }) => void;
}

export default function DigitalTwin({
  sceneIndex,
  setSceneIndex,
  isDemoRunning,
  activeMode = "CITY",
  onObjectSelect,
}: DigitalTwinProps) {
  const [, startTransition] = useTransition();

  // Coordinated Digital Twin Telemetry States
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [valveV2State, setValveV2State] = useState<ValveState>("OPEN");

  // Anomaly sequence management based on current cinematic scene
  const isAnomalyActive = sceneIndex === 4 || sceneIndex === 5;
  const isValveClosed = sceneIndex >= 6 || valveV2State === "CLOSED";
  const flowRate = isValveClosed ? 0 : isAnomalyActive ? 5.7 : 3.0;

  const currentMode: DigitalTwinMode =
    sceneIndex >= 7 ? "NIGHT" : sceneIndex === 2 || sceneIndex === 3 ? "WATER" : activeMode;

  return (
    <div className="relative w-full h-full bg-[#05060a]">
      <Canvas
        camera={{ position: [0, 480, 750], fov: 42 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMappingExposure: 1.1,
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Environment mode={currentMode} />

          <CameraController
            sceneIndex={sceneIndex}
            setSceneIndex={setSceneIndex}
            isDemoRunning={isDemoRunning}
          />

          {/* Urban Infrastructure */}
          <City mode={currentMode} />

          {/* Water Distribution Digital Twin Hierarchy */}
          <WaterTank
            level={78}
            highlight={sceneIndex === 2}
            onClick={() =>
              onObjectSelect?.({
                type: "TANK",
                id: "T-01",
                details: { level: "78%", volume: "936,000 L", quality: "Optimal" },
              })
            }
          />

          <PumpStation
            highlight={sceneIndex === 2}
            onClick={() =>
              onObjectSelect?.({
                type: "PUMP",
                id: "PS-01",
                details: { status: "Online", power: "32 kW", rpm: 2900 },
              })
            }
          />

          <Pipelines mode={currentMode} leakActive={isAnomalyActive} />

          <WaterParticles flowRate={flowRate} isIsolated={isValveClosed} />

          {/* Distribution Control Valves */}
          <Valve
            id="V1"
            name="VALVE V1 (WARD 01)"
            position={[-110, -3, 0]}
            state="OPEN"
            onClick={(id) => onObjectSelect?.({ type: "VALVE", id, details: { state: "OPEN" } })}
          />
          <Valve
            id="V2"
            name="VALVE V2 (WARD 02)"
            position={[0, -3, 0]}
            state={isValveClosed ? "CLOSED" : isAnomalyActive ? "WARNING" : "OPEN"}
            onClick={(id) => {
              startTransition(() => {
                setValveV2State((prev) => (prev === "OPEN" ? "CLOSED" : "OPEN"));
              });
              onObjectSelect?.({
                type: "VALVE",
                id,
                details: { state: valveV2State, zone: "Ward 02 Central" },
              });
            }}
          />
          <Valve
            id="V3"
            name="VALVE V3 (WARD 03)"
            position={[110, -3, 0]}
            state="OPEN"
            onClick={(id) => onObjectSelect?.({ type: "VALVE", id, details: { state: "OPEN" } })}
          />

          {/* Ward Geographies and Anomaly Hotspot */}
          <Wards
            activeWard={selectedWard}
            onSelectWard={(wId) => {
              setSelectedWard(wId);
              onObjectSelect?.({
                type: "WARD",
                id: wId,
                details: { sensors: 16, status: "Active Monitoring" },
              });
            }}
          />

          <AnomalyZone active={isAnomalyActive} />

          {/* Street Lighting Network */}
          <StreetLights active={currentMode === "NIGHT" || currentMode === "LIGHTING"} />
        </Suspense>
      </Canvas>
    </div>
  );
}