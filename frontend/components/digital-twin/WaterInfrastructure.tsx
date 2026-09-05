import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WaterInfrastructure({ anomalyActive, highlight }: any) {
  const particlesRef = useRef<THREE.Points>(null);

  // Pipe material with digital-twin blue glow
  const pipeMaterial = new THREE.MeshStandardMaterial({
    color: "#0044ff",
    emissive: "#0088ff",
    emissiveIntensity: highlight ? 2 : 0.5,
    transparent: true,
    opacity: 0.8,
  });

  const anomalyMaterial = new THREE.MeshStandardMaterial({
    color: "#ff0000",
    emissive: "#ff3300",
    emissiveIntensity: anomalyActive ? 4 : 0.5,
  });

  // Simple particle animation for water flow
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      const speed = anomalyActive ? 15 : 5; // Faster flow during anomaly
      particlesRef.current.rotation.x = time * (speed / 10);
    }
  });

  return (
    <group>
      {/* Main RTC Water Tank */}
      <mesh position={[-200, 40, 0]} castShadow>
        <cylinderGeometry args={[30, 30, 80, 32]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Main Distribution Line */}
      <mesh position={[-100, -5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[4, 4, 200, 16]} />
        <primitive object={pipeMaterial} attach="material" />
      </mesh>

      {/* Ward 01 Valve & Pipe */}
      <mesh position={[0, -5, 50]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 100, 16]} />
        <primitive object={pipeMaterial} attach="material" />
      </mesh>

      {/* Ward 02 Valve & Pipe (Anomaly Target) */}
      <mesh position={[100, -5, -50]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 100, 16]} />
        <primitive object={anomalyActive ? anomalyMaterial : pipeMaterial} attach="material" />
      </mesh>
    </group>
  );
}