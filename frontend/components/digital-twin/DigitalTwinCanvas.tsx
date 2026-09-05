"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CameraController from "./CameraController";
import ProceduralCity from "./ProceduralCity";
import WaterInfrastructure from "./WaterInfrastructure";
import StreetLights from "./StreetLights";

export default function DigitalTwinCanvas({ 
  sceneIndex, 
  setSceneIndex, 
  isDemoRunning, 
  anomalyActive, 
  setAnomalyActive 
}: any) {
  
  // Lighting transitions based on scene (Day to Night)
  const isNight = sceneIndex >= 7;

  return (
    <Canvas
      camera={{ position: [0, 500, 1000], fov: 45 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      <color attach="background" args={[isNight ? "#050508" : "#111114"]} />
      
      <fog attach="fog" args={[isNight ? "#050508" : "#111114", 200, 1500]} />

      <ambientLight intensity={isNight ? 0.15 : 0.6} />
      <directionalLight 
        position={[100, 200, 50]} 
        intensity={isNight ? 0.2 : 1.2} 
        castShadow 
      />

      <Suspense fallback={null}>
        <CameraController 
          sceneIndex={sceneIndex} 
          setSceneIndex={setSceneIndex}
          isDemoRunning={isDemoRunning}
          setAnomalyActive={setAnomalyActive}
        />
        
        <ProceduralCity isNight={isNight} />
        
        <WaterInfrastructure 
          anomalyActive={anomalyActive} 
          highlight={sceneIndex >= 2 && sceneIndex <= 6} 
        />
        
        <StreetLights active={isNight} />
      </Suspense>
    </Canvas>
  );
}