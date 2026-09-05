import { useState } from "react";
import { Html } from "@react-three/drei";

interface WaterTankProps {
  level?: number; // percentage
  onClick?: () => void;
  highlight?: boolean;
}

export default function WaterTank({ level = 78, onClick, highlight = false }: WaterTankProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={[-220, 0, -160]}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Structural Support Columns */}
      {[-12, 12].map((x) =>
        [-12, 12].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 35, z]} castShadow>
            <cylinderGeometry args={[1.2, 1.6, 70, 16]} />
            <meshStandardMaterial color="#30363d" metalness={0.8} roughness={0.3} />
          </mesh>
        ))
      )}

      {/* Center Water Downcomer Shaft */}
      <mesh position={[0, 35, 0]} castShadow>
        <cylinderGeometry args={[4, 4, 70, 24]} />
        <meshStandardMaterial
          color={highlight || hovered ? "#388bfd" : "#484f58"}
          emissive={highlight || hovered ? "#1f6feb" : "#000000"}
          emissiveIntensity={0.6}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Catwalk Platform */}
      <mesh position={[0, 68, 0]}>
        <cylinderGeometry args={[26, 26, 1.8, 32]} />
        <meshStandardMaterial color="#21262d" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Main Elevated Reservoir Body */}
      <mesh position={[0, 88, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[22, 22, 38, 48]} />
        <meshStandardMaterial
          color="#f0f6fc"
          metalness={0.5}
          roughness={0.25}
        />
      </mesh>

      {/* Tank Conical Cap */}
      <mesh position={[0, 110, 0]} castShadow>
        <coneGeometry args={[23, 7, 48]} />
        <meshStandardMaterial color="#8b949e" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* 3D Telemetry Tooltip */}
      {(hovered || highlight) && (
        <Html position={[0, 122, 0]} center distanceFactor={280}>
          <div className="bg-[#0d1117]/90 border border-[#388bfd]/60 backdrop-blur-md px-3 py-2 rounded font-mono text-xs text-white whitespace-nowrap shadow-2xl pointer-events-none">
            <div className="text-[#58a6ff] font-bold tracking-wider">PRIMARY RESERVOIR T-01</div>
            <div className="flex justify-between gap-4 mt-1 text-[11px]">
              <span className="text-gray-400">CAPACITY:</span>
              <span>1,200,000 L</span>
            </div>
            <div className="flex justify-between gap-4 text-[11px]">
              <span className="text-gray-400">STORAGE LEVEL:</span>
              <span className="text-[#3fb950] font-bold">{level}%</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}