import { useState } from "react";
import { Html } from "@react-three/drei";

export type ValveState = "OPEN" | "CLOSED" | "WARNING";

interface ValveProps {
  id: string;
  name: string;
  position: [number, number, number];
  state: ValveState;
  onClick?: (id: string) => void;
}

export default function Valve({ id, name, position, state, onClick }: ValveProps) {
  const [hovered, setHovered] = useState(false);

  const statusColor = state === "OPEN" ? "#2ea043" : state === "CLOSED" ? "#58a6ff" : "#d73a49";

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Valve Cast Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[6, 6, 6]} />
        <meshStandardMaterial color="#30363d" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Mechanical Flange Collars */}
      {[-3.2, 3.2].map((z, idx) => (
        <mesh key={idx} position={[0, 0, z]}>
          <cylinderGeometry args={[3.8, 3.8, 0.8, 20]} />
          <meshStandardMaterial color="#484f58" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Actuator Bonnet / Yoke */}
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[1.2, 1.5, 4, 16]} />
        <meshStandardMaterial color="#21262d" />
      </mesh>

      {/* Electric Actuator Head */}
      <mesh position={[0, 8.5, 0]} castShadow>
        <cylinderGeometry args={[2.5, 2.5, 3.5, 24]} />
        <meshStandardMaterial color="#161b22" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Status LED Beacon Ring */}
      <mesh position={[0, 10.5, 0]}>
        <torusGeometry args={[1.2, 0.35, 16, 32]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={3}
        />
      </mesh>

      {hovered && (
        <Html position={[0, 14, 0]} center distanceFactor={220}>
          <div className="bg-[#0d1117]/95 border border-white/20 p-2.5 rounded font-mono text-[11px] text-white shadow-xl pointer-events-none whitespace-nowrap">
            <div className="font-bold flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: statusColor }}
              />
              {name}
            </div>
            <div className="text-gray-400 mt-1">STATUS: <span className="text-white font-bold">{state}</span></div>
            <div className="text-gray-400">ACTUATOR: <span className="text-white">MODBUS RS-485</span></div>
          </div>
        </Html>
      )}
    </group>
  );
}