import { Html } from "@react-three/drei";

interface WardsProps {
  activeWard?: string | null;
  onSelectWard?: (wardId: string) => void;
}

export default function Wards({ activeWard, onSelectWard }: WardsProps) {
  const wards = [
    {
      id: "WARD_01",
      name: "WARD 01 - NORTH COMMERCIAL",
      pos: [-110, 0, 80],
      color: "#388bfd",
      status: "NOMINAL",
    },
    {
      id: "WARD_02",
      name: "WARD 02 - RESIDENTIAL CENTRAL",
      pos: [0, 0, 80],
      color: "#f85149",
      status: "INCIDENT AREA",
    },
    {
      id: "WARD_03",
      name: "WARD 03 - EAST INDUSTRIAL",
      pos: [110, 0, 80],
      color: "#388bfd",
      status: "NOMINAL",
    },
  ];

  return (
    <group>
      {wards.map((ward) => {
        const isSelected = activeWard === ward.id;
        return (
          <group key={ward.id} position={ward.pos as [number, number, number]}>
            {/* Zone Boundary Footprint */}
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, 0.04, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectWard?.(ward.id);
              }}
            >
              <planeGeometry args={[90, 110]} />
              <meshBasicMaterial
                color={ward.color}
                transparent
                opacity={isSelected ? 0.22 : 0.07}
                wireframe={false}
              />
            </mesh>

            {/* Boundary Perimeter Lines */}
            <lineSegments position={[0, 0.05, 0]}>
              <edgesGeometry args={[new THREE.BoxGeometry(90, 0.1, 110)]} />
              <lineBasicMaterial color={ward.color} transparent opacity={0.6} />
            </lineSegments>

            {/* Spatial Floating Telemetry Placard */}
            <Html position={[0, 24, -40]} center distanceFactor={340}>
              <div
                onClick={() => onSelectWard?.(ward.id)}
                className={`cursor-pointer font-mono px-3 py-1.5 rounded backdrop-blur-md border transition-all duration-300 select-none ${
                  isSelected
                    ? "bg-[#161b22]/95 border-white text-white shadow-2xl scale-105"
                    : "bg-[#0d1117]/80 border-white/20 text-gray-300 hover:border-white/50"
                }`}
              >
                <div className="text-[10px] tracking-wider font-bold text-gray-400">DISTRIBUTION SECTOR</div>
                <div className="text-xs font-semibold">{ward.name}</div>
                <div className="text-[10px] mt-0.5 flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: ward.status === "NOMINAL" ? "#3fb950" : "#d73a49" }}
                  />
                  <span>{ward.status}</span>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}