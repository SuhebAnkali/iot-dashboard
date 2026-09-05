import { useMemo } from "react";
import * as THREE from "three";

export default function Roads() {
  const roadMarkings = useMemo(() => {
    const lines: [number, number, number, number, number, number][] = [];
    // Generate dashed centerlines along central corridors
    for (let i = -400; i <= 400; i += 24) {
      lines.push([0, 0.05, i, 0.4, 0.02, 12]);
      lines.push([i, 0.05, 0, 12, 0.02, 0.4]);
    }
    return lines;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Base Terrain / City Foundation */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
        <planeGeometry args={[1200, 1200]} />
        <meshStandardMaterial color="#0b0e14" roughness={0.9} />
      </mesh>

      {/* Main North-South Dual Carriage Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[32, 1000]} />
        <meshStandardMaterial color="#161b22" roughness={0.85} />
      </mesh>

      {/* Main East-West Axis Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[1000, 32]} />
        <meshStandardMaterial color="#161b22" roughness={0.85} />
      </mesh>

      {/* Sidewalk Ribbons */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[18, 0.03, 0]} receiveShadow>
        <planeGeometry args={[4, 1000]} />
        <meshStandardMaterial color="#21262d" roughness={0.75} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-18, 0.03, 0]} receiveShadow>
        <planeGeometry args={[4, 1000]} />
        <meshStandardMaterial color="#21262d" roughness={0.75} />
      </mesh>

      {/* Road Lane Markings */}
      {roadMarkings.map((pos, idx) => (
        <mesh key={idx} position={[pos[0], pos[1], pos[2]]}>
          <boxGeometry args={[pos[3], pos[4], pos[5]]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
        </mesh>
      ))}

      {/* Green Public Verges */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[120, 0.02, 120]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color="#102a1d" roughness={0.95} />
      </mesh>
    </group>
  );
}