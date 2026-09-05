import { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";

interface StreetLightsProps {
  active: boolean;
}

export default function StreetLights({ active }: StreetLightsProps) {
  const polesMeshRef = useRef<THREE.InstancedMesh>(null);
  const totalLights = 48;

  const lightPositions = useMemo(() => {
    const coords: [number, number, number][] = [];
    // Place poles along North-South arterial avenues
    for (let z = -280; z <= 280; z += 24) {
      coords.push([-22, 0, z]);
      coords.push([22, 0, z]);
    }
    return coords.slice(0, totalLights);
  }, []);

  useLayoutEffect(() => {
    if (!polesMeshRef.current) return;
    const dummy = new THREE.Object3D();

    lightPositions.forEach((pos, i) => {
      dummy.position.set(pos[0], 6, pos[2]);
      dummy.scale.set(0.4, 12, 0.4);
      dummy.updateMatrix();
      polesMeshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    polesMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [lightPositions]);

  return (
    <group>
      {/* Light Poles Instanced Structural Geometry */}
      <instancedMesh ref={polesMeshRef} args={[undefined, undefined, lightPositions.length]}>
        <cylinderGeometry args={[1, 1.2, 1, 12]} />
        <meshStandardMaterial color="#484f58" metalness={0.8} roughness={0.3} />
      </instancedMesh>

      {/* Luminaire Heads with Warm White LEDs */}
      {lightPositions.map((pos, idx) => {
        const isDimmedForEnergySaving = idx >= 42; // 42 Active out of 48
        return (
          <group key={idx} position={[pos[0] > 0 ? pos[0] - 2 : pos[0] + 2, 12, pos[2]]}>
            <mesh>
              <boxGeometry args={[2.5, 0.4, 1]} />
              <meshStandardMaterial
                color={active && !isDimmedForEnergySaving ? "#ffedd5" : "#1e293b"}
                emissive={active && !isDimmedForEnergySaving ? "#ffd166" : "#000000"}
                emissiveIntensity={active ? 2.5 : 0}
              />
            </mesh>

            {/* Optimized Spot illumination for local pavement cone */}
            {active && !isDimmedForEnergySaving && idx % 3 === 0 && (
              <pointLight
                position={[0, -1, 0]}
                distance={45}
                intensity={1.2}
                color="#ffeaa7"
                decay={2}
              />
            )}
          </group>
        );
      })}
    </group>
  );
}