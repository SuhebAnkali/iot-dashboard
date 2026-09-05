import { useState } from "react";
import { Html } from "@react-three/drei";

interface PumpStationProps {
  onClick?: () => void;
  highlight?: boolean;
}

export default function PumpStation({ onClick, highlight = false }: PumpStationProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={[-150, 0, -120]}
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
      {/* Foundation Concrete Pad */}
      <mesh position={[0, 1.5, 0]} receiveShadow>
        <boxGeometry args={[48, 3, 32]} />
        <meshStandardMaterial color="#21262d" roughness={0.9} />
      </mesh>

      {/* Building Shelter Enclosure */}
      <mesh position={[0, 14, 0]} castShadow>
        <boxGeometry args={[44, 22, 28]} />
        <meshStandardMaterial
          color="#161b22"
          transparent
          opacity={0.5}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Twin High-Capacity Booster Pumps */}
      {[-10, 10].map((xOffset, idx) => (
        <group key={idx} position={[xOffset, 4, 0]}>
          {/* Motor Housing */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[-4, 2, 0]} castShadow>
            <cylinderGeometry args={[2.5, 2.5, 7, 24]} />
            <meshStandardMaterial color="#1f6feb" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Volute / Pump Casing */}
          <mesh position={[2, 2, 0]} castShadow>
            <cylinderGeometry args={[3.8, 3.8, 3.2, 24]} />
            <meshStandardMaterial color="#30363d" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Discharge Flange */}
          <mesh position={[2, 5, 0]}>
            <cylinderGeometry args={[1.5, 1.5, 3, 16]} />
            <meshStandardMaterial color="#8b949e" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}

      {(hovered || highlight) && (
        <Html position={[0, 28, 0]} center distanceFactor={260}>
          <div className="bg-[#0d1117]/90 border border-cyan-500/50 backdrop-blur-md px-3 py-2 rounded font-mono text-xs text-white whitespace-nowrap shadow-2xl pointer-events-none">
            <div className="text-cyan-400 font-bold">PUMP STATION PS-01</div>
            <div className="text-[11px] text-gray-400 mt-0.5">DUAL PARALLEL VARIABLE SPEED</div>
            <div className="text-[11px] mt-1 text-emerald-400">HEAD PRESSURE: 4.8 BAR</div>
          </div>
        </Html>
      )}
    </group>
  );
}