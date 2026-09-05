import * as THREE from "three";

interface PipelinesProps {
  mode: "CITY" | "WATER" | "LIGHTING" | "AI" | "ENERGY" | "NIGHT";
  leakActive?: boolean;
}

export default function Pipelines({ mode, leakActive = false }: PipelinesProps) {
  const isWaterMode = mode === "WATER" || mode === "AI";

  const standardPipeMat = new THREE.MeshStandardMaterial({
    color: "#0969da",
    emissive: "#0053b3",
    emissiveIntensity: isWaterMode ? 1.8 : 0.6,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.9,
  });

  const leakPipeMat = new THREE.MeshStandardMaterial({
    color: "#d73a49",
    emissive: "#cb2431",
    emissiveIntensity: leakActive ? 2.5 : 0.8,
    metalness: 0.7,
    roughness: 0.2,
  });

  return (
    <group position={[0, -4, 0]}>
      {/* Primary Feeder: Tank to Pump Station */}
      <mesh position={[-185, 0, -140]} rotation={[0, Math.PI / 4, Math.PI / 2]}>
        <cylinderGeometry args={[2.5, 2.5, 100, 24]} />
        <primitive object={standardPipeMat} attach="material" />
      </mesh>

      {/* Main Spinal Pipeline */}
      <mesh position={[0, 0, -50]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[3, 3, 320, 32]} />
        <primitive object={standardPipeMat} attach="material" />
      </mesh>

      {/* Lateral Header: Branch to Ward 01 */}
      <mesh position={[-110, 0, 40]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 180, 24]} />
        <primitive object={standardPipeMat} attach="material" />
      </mesh>

      {/* Lateral Header: Branch to Ward 02 (Fault Location) */}
      <mesh position={[0, 0, 40]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 180, 24]} />
        <primitive object={leakActive ? leakPipeMat : standardPipeMat} attach="material" />
      </mesh>

      {/* Lateral Header: Branch to Ward 03 */}
      <mesh position={[110, 0, 40]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 180, 24]} />
        <primitive object={standardPipeMat} attach="material" />
      </mesh>
    </group>
  );
}