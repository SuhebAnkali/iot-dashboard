import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function ProceduralCity({ isNight }: { isNight: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const buildingCount = 1000;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useMemo(() => {
    if (!meshRef.current) return;
    
    let i = 0;
    for (let x = -20; x < 20; x++) {
      for (let z = -25; z < 25; z++) {
        // Skip center for infrastructure
        if (Math.abs(x) < 4 && Math.abs(z) < 4) continue;

        const height = 10 + Math.random() * 40;
        dummy.position.set(x * 25, height / 2, z * 25);
        dummy.scale.set(15, height, 15);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i++, dummy.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2000, 2000]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* Buildings Instanced Mesh */}
      <instancedMesh 
        ref={meshRef} 
        args={[undefined, undefined, buildingCount]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry />
        <meshStandardMaterial 
          color={isNight ? "#0a0a0f" : "#2a2a2a"} 
          roughness={0.7} 
          metalness={0.2}
        />
      </instancedMesh>
    </group>
  );
}