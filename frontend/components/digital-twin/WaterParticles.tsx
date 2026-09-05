import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WaterParticlesProps {
  flowRate: number; // in L/min, e.g. 0 to 10
  isIsolated?: boolean;
}

export default function WaterParticles({ flowRate, isIsolated = false }: WaterParticlesProps) {
  const count = 400;
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, offsets] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const offs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      offs[i] = Math.random() * 180; // Distance along branch
      // Lateral jitter inside pipe cross-section
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 1.5;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = -4 + Math.sin(angle) * radius;
      pos[i * 3 + 2] = -50 + offs[i];
    }
    return [pos, offs];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current || isIsolated || flowRate === 0) return;

    const positionsArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const speed = flowRate * 18.0 * delta;

    for (let i = 0; i < count; i++) {
      const zIndex = i * 3 + 2;
      positionsArray[zIndex] += speed;

      // Loop particles back to beginning of pipeline manifold
      if (positionsArray[zIndex] > 130) {
        positionsArray[zIndex] = -50;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.4}
        color="#388bfd"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}