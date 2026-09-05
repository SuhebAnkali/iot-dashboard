import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AnomalyZoneProps {
  active: boolean;
}

export default function AnomalyZone({ active }: AnomalyZoneProps) {
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const sprayParticlesRef = useRef<THREE.Points>(null);

  const particleCount = 80;

  const [particlePositions] = useRef(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = Math.random() * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return [pos];
  }).current();

  useFrame((state, delta) => {
    if (!active) return;

    // Subtle thermal warning pulse expansion
    if (pulseRingRef.current) {
      const scale = 1 + (Math.sin(state.clock.getElapsedTime() * 4) + 1) * 0.4;
      pulseRingRef.current.scale.set(scale, scale, 1);
    }

    // Micro-spray leak plume animation
    if (sprayParticlesRef.current) {
      const positions = sprayParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const yIndex = i * 3 + 1;
        positions[yIndex] += delta * 6;
        if (positions[yIndex] > 8) {
          positions[yIndex] = 0;
        }
      }
      sprayParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!active) return null;

  return (
    <group position={[0, -4, 40]}>
      {/* Ground Subsurface Acoustic Pulse Ring */}
      <mesh ref={pulseRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[4, 5.5, 32]} />
        <meshBasicMaterial color="#f85149" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Localized Spray Dispersion */}
      <points ref={sprayParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.6}
          color="#a5d6ff"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Subtle Critical Heat Plume Indicator */}
      <pointLight position={[0, 2, 0]} distance={25} intensity={2.5} color="#d73a49" />
    </group>
  );
}