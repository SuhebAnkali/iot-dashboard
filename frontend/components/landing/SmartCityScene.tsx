'use client';

import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';

type SceneMode = 'city' | 'water' | 'lighting' | 'infrastructure' | 'night';

type BuildingConfig = {
  position: [number, number, number];
  size: [number, number, number];
  tint: string;
};

type ModeVisuals = {
  background: string;
  fog: string;
  ambient: number;
  directional: number;
  buildingOpacity: number;
  buildingEmissive: number;
  roadGlow: number;
  pipeGlow: number;
  pipeOpacity: number;
  undergroundOpacity: number;
  lightGlow: number;
  lightConeOpacity: number;
  groundOpacity: number;
  markerBoost: number;
};

const modeButtons: SceneMode[] = [
  'city',
  'water',
  'lighting',
  'infrastructure',
  'night',
];

const buildingLayouts: BuildingConfig[] = [
  { position: [-9, 1.8, -10], size: [2.4, 3.6, 2.1], tint: '#132235' },
  { position: [-5.8, 2.4, -10.2], size: [2.1, 4.8, 2.3], tint: '#16283e' },
  { position: [-2.8, 1.5, -10], size: [1.8, 3, 2], tint: '#14263a' },
  { position: [4.5, 2.1, -10.2], size: [2.5, 4.2, 2.2], tint: '#15293f' },
  { position: [8.2, 1.7, -9.6], size: [2.3, 3.4, 2], tint: '#132236' },
  { position: [11.2, 2.8, -10.1], size: [1.9, 5.6, 2.3], tint: '#182a42' },
  { position: [-11.2, 2.3, -5.2], size: [2, 4.6, 2.1], tint: '#15263b' },
  { position: [-8, 1.6, -4.9], size: [2.4, 3.2, 2], tint: '#122133' },
  { position: [8.2, 2.5, -4.8], size: [2.2, 5, 2.2], tint: '#14263d' },
  { position: [11.3, 1.8, -5], size: [2.1, 3.6, 2], tint: '#172b41' },
  { position: [-11.4, 2, 4.7], size: [2.2, 4, 2], tint: '#14253a' },
  { position: [-8.1, 1.5, 5], size: [2.5, 3, 2.2], tint: '#122235' },
  { position: [8.1, 2.2, 4.8], size: [2.1, 4.4, 2], tint: '#172a41' },
  { position: [11.1, 1.6, 5.2], size: [2, 3.2, 2.2], tint: '#15273d' },
  { position: [-9.4, 2.3, 10], size: [2.2, 4.6, 2.1], tint: '#15263d' },
  { position: [-5.9, 1.8, 10.3], size: [2.1, 3.6, 2], tint: '#132237' },
  { position: [4.4, 2.6, 10.2], size: [2.4, 5.2, 2.1], tint: '#172b42' },
  { position: [8, 1.9, 9.8], size: [2.2, 3.8, 2.1], tint: '#13243a' },
  { position: [11.3, 2.4, 10.1], size: [2, 4.8, 2.2], tint: '#182c43' },
];

const streetLights: [number, number, number][] = [
  [-11.5, 0, -1.5],
  [-7.5, 0, -1.5],
  [-3.5, 0, -1.5],
  [0.5, 0, -1.5],
  [4.5, 0, -1.5],
  [8.5, 0, -1.5],
  [-1.5, 0, -11.5],
  [-1.5, 0, -7.5],
  [-1.5, 0, -3.5],
  [-1.5, 0, 4.5],
  [-1.5, 0, 8.5],
  [-1.5, 0, 12.5],
];

const treePositions: [number, number, number][] = [
  [-13, 0, -8],
  [-13, 0, 7],
  [13, 0, -7],
  [13, 0, 8],
  [-6.5, 0, -13],
  [6.5, 0, -13],
  [-7, 0, 13],
  [6.5, 0, 13],
  [2.4, 0, 6.2],
  [5.4, 0, 6.8],
  [7.4, 0, 6.2],
];

const wardLabels = [
  { text: 'Ward 01', position: [7.5, 1.2, -7.2] as [number, number, number] },
  { text: 'Ward 02', position: [8.8, 1.2, 0.3] as [number, number, number] },
  { text: 'Ward 03', position: [7.2, 1.2, 7.8] as [number, number, number] },
];

const pipeRoutes = {
  trunk: [
    new THREE.Vector3(-10.6, -1.05, -8.4),
    new THREE.Vector3(-7.5, -1.05, -5.2),
    new THREE.Vector3(-2.6, -1.05, -6.4),
    new THREE.Vector3(0.5, -1.05, -2.5),
  ],
  ward01: [
    new THREE.Vector3(0.5, -1.05, -2.5),
    new THREE.Vector3(3.2, -1.05, -4.2),
    new THREE.Vector3(6.2, -1.05, -6.8),
    new THREE.Vector3(9.8, -1.05, -7.2),
  ],
  ward02: [
    new THREE.Vector3(0.5, -1.05, -2.5),
    new THREE.Vector3(3.4, -1.05, -1.0),
    new THREE.Vector3(6.5, -1.05, 0.1),
    new THREE.Vector3(10.1, -1.05, 0.4),
  ],
  ward03: [
    new THREE.Vector3(0.5, -1.05, -2.5),
    new THREE.Vector3(3.1, -1.05, 2.0),
    new THREE.Vector3(5.8, -1.05, 5.6),
    new THREE.Vector3(9.5, -1.05, 7.8),
  ],
};

const vehiclePaths = [
  [
    new THREE.Vector3(-13, 0.18, 0),
    new THREE.Vector3(-3, 0.18, 0),
    new THREE.Vector3(13, 0.18, 0),
  ],
  [
    new THREE.Vector3(-1.2, 0.18, -13),
    new THREE.Vector3(-1.2, 0.18, -2),
    new THREE.Vector3(-1.2, 0.18, 13),
  ],
  [
    new THREE.Vector3(13, 0.18, -6.4),
    new THREE.Vector3(2.8, 0.18, -6.4),
    new THREE.Vector3(-6.5, 0.18, -6.4),
  ],
];

const utilityLinePoints = [
  [
    [-12.4, 1.8, 11.7],
    [-6.5, 2.1, 11.9],
    [-0.8, 2.2, 12],
    [5.8, 2.1, 11.9],
    [12.6, 1.9, 11.6],
  ],
  [
    [12.4, 1.8, -11.8],
    [7.2, 2, -11.6],
    [1.8, 2.2, -11.5],
    [-4.8, 2.05, -11.8],
    [-11.8, 1.85, -12],
  ],
];

export default function SmartCityScene() {
  const [mode, setMode] = useState<SceneMode>('city');

  return (
    <div className="relative h-full min-h-[100svh] w-full bg-[#050b14]">
      <Canvas
        shadows={false}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        className="!absolute inset-0"
      >
        <Scene mode={mode} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(34,211,238,0.08),transparent_25%),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.4))]" />

      <div className="absolute right-4 top-1/2 z-20 -translate-y-1/2 md:right-6">
        <div className="grid gap-2 rounded-[24px] border border-white/10 bg-black/25 p-2 backdrop-blur-xl">
          {modeButtons.map((item) => {
            const active = mode === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={`rounded-xl border px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.22em] transition ${
                  active
                    ? 'border-cyan-400/30 bg-cyan-400/15 text-cyan-300'
                    : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-400/20 hover:text-cyan-200'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-5 right-5 z-20 hidden rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur-xl md:block">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
          Active mode
        </p>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
          {mode}
        </p>
      </div>
    </div>
  );
}

function Scene({ mode }: { mode: SceneMode }) {
  const visuals = useMemo<ModeVisuals>(() => {
    switch (mode) {
      case 'water':
        return {
          background: '#06101a',
          fog: '#08111d',
          ambient: 0.78,
          directional: 1.25,
          buildingOpacity: 0.55,
          buildingEmissive: 0.35,
          roadGlow: 0.08,
          pipeGlow: 2.6,
          pipeOpacity: 1,
          undergroundOpacity: 1,
          lightGlow: 1,
          lightConeOpacity: 0.22,
          groundOpacity: 0.92,
          markerBoost: 1.3,
        };
      case 'lighting':
        return {
          background: '#040a12',
          fog: '#06111a',
          ambient: 0.62,
          directional: 0.9,
          buildingOpacity: 0.78,
          buildingEmissive: 0.55,
          roadGlow: 0.32,
          pipeGlow: 1.1,
          pipeOpacity: 0.72,
          undergroundOpacity: 0.8,
          lightGlow: 1.9,
          lightConeOpacity: 0.36,
          groundOpacity: 0.9,
          markerBoost: 1,
        };
      case 'infrastructure':
        return {
          background: '#06101a',
          fog: '#09121d',
          ambient: 0.76,
          directional: 1.05,
          buildingOpacity: 0.38,
          buildingEmissive: 0.22,
          roadGlow: 0.16,
          pipeGlow: 2.2,
          pipeOpacity: 1,
          undergroundOpacity: 1,
          lightGlow: 1.15,
          lightConeOpacity: 0.2,
          groundOpacity: 0.58,
          markerBoost: 1.15,
        };
      case 'night':
        return {
          background: '#03070d',
          fog: '#040b13',
          ambient: 0.45,
          directional: 0.72,
          buildingOpacity: 0.82,
          buildingEmissive: 0.68,
          roadGlow: 0.28,
          pipeGlow: 1.4,
          pipeOpacity: 0.82,
          undergroundOpacity: 0.82,
          lightGlow: 2.3,
          lightConeOpacity: 0.42,
          groundOpacity: 0.88,
          markerBoost: 1.05,
        };
      case 'city':
      default:
        return {
          background: '#050b14',
          fog: '#07111b',
          ambient: 0.72,
          directional: 1.05,
          buildingOpacity: 0.82,
          buildingEmissive: 0.48,
          roadGlow: 0.14,
          pipeGlow: 1.45,
          pipeOpacity: 0.85,
          undergroundOpacity: 0.88,
          lightGlow: 1.35,
          lightConeOpacity: 0.28,
          groundOpacity: 0.94,
          markerBoost: 1,
        };
    }
  }, [mode]);

  return (
    <>
      <color attach="background" args={[visuals.background]} />
      <fog attach="fog" args={[visuals.fog, 14, 44]} />

      <PerspectiveCamera makeDefault fov={40} position={[18, 11, 18]} />
      <CinematicCamera mode={mode} />

      <ambientLight intensity={visuals.ambient} color="#c5d7ff" />
      <directionalLight
        position={[12, 18, 8]}
        intensity={visuals.directional}
        color="#b7d4ff"
      />
      <pointLight position={[-4, 9, -4]} intensity={0.55} color="#1fd1c1" />
      <pointLight position={[8, 8, 4]} intensity={0.35} color="#4c7eff" />

      <group rotation={[0, -0.34, 0]}>
        <Ground visuals={visuals} />
        <RoadNetwork visuals={visuals} />
        <WardBoundaries />
        <Buildings visuals={visuals} />
        <WaterInfrastructure visuals={visuals} />
        <StreetLighting visuals={visuals} />
        <Trees />
        <UtilityNetwork />
        <DrainageChannel />
        <Vehicles />
        <WardLabels />
        <StatusMarkers visuals={visuals} />
      </group>
    </>
  );
}

function CinematicCamera({ mode }: { mode: SceneMode }) {
  useFrame(({ camera, clock }) => {
    const time = clock.getElapsedTime() * 0.12;

    const focusMap: Record<SceneMode, THREE.Vector3> = {
      city: new THREE.Vector3(0, 0.4, 0),
      water: new THREE.Vector3(-1.5, -0.3, -4.2),
      lighting: new THREE.Vector3(2.5, 0.6, 1.8),
      infrastructure: new THREE.Vector3(1.4, -1.1, -1),
      night: new THREE.Vector3(1, 0.5, 1.5),
    };

    const radiusMap: Record<SceneMode, number> = {
      city: 22,
      water: 18,
      lighting: 20,
      infrastructure: 17,
      night: 21,
    };

    const heightMap: Record<SceneMode, number> = {
      city: 11.5,
      water: 9.5,
      lighting: 10.5,
      infrastructure: 8.8,
      night: 10,
    };

    const focus = focusMap[mode];
    const radius = radiusMap[mode];
    const height = heightMap[mode];

    const desired = new THREE.Vector3(
      Math.cos(time) * radius,
      height + Math.sin(time * 1.7) * 1.3,
      Math.sin(time * 0.9) * 14 + radius * 0.48
    );

    camera.position.lerp(desired, 0.035);
    camera.lookAt(focus);
  });

  return null;
}

function Ground({ visuals }: { visuals: ModeVisuals }) {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.18, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#07111b"
          metalness={0.25}
          roughness={0.92}
          transparent
          opacity={visuals.groundOpacity}
        />
      </mesh>

      <gridHelper
        args={[40, 40, '#1b3f4f', '#0d1b2a']}
        position={[0, -1.12, 0]}
      />
    </group>
  );
}

function RoadNetwork({ visuals }: { visuals: ModeVisuals }) {
  const roads: Array<{ position: [number, number, number]; size: [number, number, number] }> = [
    { position: [0, -1.02, 0], size: [30, 0.06, 4] },
    { position: [-1.5, -1.02, 0], size: [4, 0.06, 30] },
    { position: [4.8, -1.02, -6.5], size: [18, 0.06, 2.6] },
    { position: [4.8, -1.02, 6.5], size: [18, 0.06, 2.6] },
  ];

  const sidewalks: Array<{ position: [number, number, number]; size: [number, number, number] }> = [
    { position: [0, -1.07, 0], size: [31.2, 0.02, 5.1] },
    { position: [-1.5, -1.07, 0], size: [5.1, 0.02, 31.2] },
    { position: [4.8, -1.07, -6.5], size: [19, 0.02, 3.3] },
    { position: [4.8, -1.07, 6.5], size: [19, 0.02, 3.3] },
  ];

  return (
    <group>
      {sidewalks.map((item, index) => (
        <mesh key={`sidewalk-${index}`} position={item.position}>
          <boxGeometry args={item.size} />
          <meshStandardMaterial color="#182433" roughness={0.95} metalness={0.1} />
        </mesh>
      ))}

      {roads.map((item, index) => (
        <mesh key={`road-${index}`} position={item.position}>
          <boxGeometry args={item.size} />
          <meshStandardMaterial
            color="#111827"
            emissive="#f5a623"
            emissiveIntensity={visuals.roadGlow}
            roughness={0.92}
            metalness={0.22}
          />
        </mesh>
      ))}

      <mesh rotation-x={-Math.PI / 2} position={[4.8, -0.985, -6.5]}>
        <planeGeometry args={[18, 2.2]} />
        <meshBasicMaterial color="#f5a623" transparent opacity={visuals.roadGlow * 0.35} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[4.8, -0.985, 6.5]}>
        <planeGeometry args={[18, 2.2]} />
        <meshBasicMaterial color="#f5a623" transparent opacity={visuals.roadGlow * 0.35} />
      </mesh>
    </group>
  );
}

function WardBoundaries() {
  return (
    <group>
      <Line
        points={[
          [1.4, -0.98, -12.5],
          [12.5, -0.98, -12.5],
          [12.5, -0.98, -2],
          [1.4, -0.98, -2],
          [1.4, -0.98, -12.5],
        ]}
        color="#1fd1c1"
        transparent
        opacity={0.45}
        lineWidth={1}
      />
      <Line
        points={[
          [1.4, -0.98, -2],
          [12.5, -0.98, -2],
          [12.5, -0.98, 2.4],
          [1.4, -0.98, 2.4],
          [1.4, -0.98, -2],
        ]}
        color="#1fd1c1"
        transparent
        opacity={0.4}
        lineWidth={1}
      />
      <Line
        points={[
          [1.4, -0.98, 2.4],
          [12.5, -0.98, 2.4],
          [12.5, -0.98, 12.4],
          [1.4, -0.98, 12.4],
          [1.4, -0.98, 2.4],
        ]}
        color="#1fd1c1"
        transparent
        opacity={0.45}
        lineWidth={1}
      />
    </group>
  );
}

function Buildings({ visuals }: { visuals: ModeVisuals }) {
  return (
    <group>
      {buildingLayouts.map((building, index) => (
        <Building key={index} config={building} visuals={visuals} />
      ))}
    </group>
  );
}

function Building({
  config,
  visuals,
}: {
  config: BuildingConfig;
  visuals: ModeVisuals;
}) {
  const [width, height, depth] = config.size;

  return (
    <group position={config.position}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={config.tint}
          roughness={0.72}
          metalness={0.3}
          emissive="#16395f"
          emissiveIntensity={visuals.buildingEmissive}
          transparent
          opacity={visuals.buildingOpacity}
        />
      </mesh>

      <mesh position={[0, height / 2 + 0.04, 0]}>
        <boxGeometry args={[width * 0.88, 0.08, depth * 0.88]} />
        <meshStandardMaterial color="#1d3149" emissive="#1fd1c1" emissiveIntensity={0.08} />
      </mesh>

      <WindowGrid width={width} height={height} depth={depth} />
    </group>
  );
}

function WindowGrid({
  width,
  height,
  depth,
}: {
  width: number;
  height: number;
  depth: number;
}) {
  const rows = Math.max(2, Math.floor(height));
  const cols = Math.max(2, Math.floor(width * 1.4));

  const windows = useMemo(() => {
    const items: Array<{ pos: [number, number, number]; scale: [number, number, number] }> = [];

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = -width * 0.35 + col * ((width * 0.7) / Math.max(cols - 1, 1));
        const y = -height * 0.32 + row * ((height * 0.64) / Math.max(rows - 1, 1));

        items.push({
          pos: [x, y, depth / 2 + 0.03],
          scale: [0.18, 0.16, 0.05],
        });
      }
    }

    return items;
  }, [cols, depth, height, rows, width]);

  return (
    <group>
      {windows.map((window, index) => (
        <mesh key={index} position={window.pos}>
          <boxGeometry args={window.scale} />
          <meshStandardMaterial
            color="#a9dcff"
            emissive="#57c9ff"
            emissiveIntensity={0.48}
            roughness={0.2}
            metalness={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

function WaterInfrastructure({ visuals }: { visuals: ModeVisuals }) {
  const trunkCurve = useMemo(
    () => new THREE.CatmullRomCurve3(pipeRoutes.trunk),
    []
  );
  const ward01Curve = useMemo(
    () => new THREE.CatmullRomCurve3(pipeRoutes.ward01),
    []
  );
  const ward02Curve = useMemo(
    () => new THREE.CatmullRomCurve3(pipeRoutes.ward02),
    []
  );
  const ward03Curve = useMemo(
    () => new THREE.CatmullRomCurve3(pipeRoutes.ward03),
    []
  );

  return (
    <group>
      <group position={[-10.6, -0.65, -8.4]}>
        <mesh>
          <boxGeometry args={[3.4, 1.1, 2.5]} />
          <meshStandardMaterial color="#11314b" roughness={0.7} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[3, 0.35, 2.1]} />
          <meshStandardMaterial
            color="#36c5ff"
            emissive="#1fd1c1"
            emissiveIntensity={0.95 * visuals.pipeGlow}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>

      <group position={[-7.3, -0.25, -5.2]}>
        <mesh>
          <boxGeometry args={[2.2, 1.4, 1.8]} />
          <meshStandardMaterial color="#18293e" roughness={0.75} metalness={0.22} />
        </mesh>
        <mesh position={[0, 0.92, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.45, 18]} />
          <meshStandardMaterial color="#2f6a8a" emissive="#1fd1c1" emissiveIntensity={0.25} />
        </mesh>
      </group>

      <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.15}>
        <group position={[-2.6, -0.1, -6.4]}>
          {[[-0.7, 1.6, -0.7], [0.7, 1.6, -0.7], [-0.7, 1.6, 0.7], [0.7, 1.6, 0.7]].map(
            (pos, index) => (
              <mesh key={index} position={pos as [number, number, number]}>
                <cylinderGeometry args={[0.08, 0.08, 3.1, 10]} />
                <meshStandardMaterial color="#62748a" roughness={0.68} metalness={0.35} />
              </mesh>
            )
          )}
          <mesh position={[0, 3.3, 0]}>
            <cylinderGeometry args={[1.55, 1.55, 2.2, 26]} />
            <meshStandardMaterial color="#173048" roughness={0.62} metalness={0.32} />
          </mesh>
          <mesh position={[0, 4.65, 0]}>
            <cylinderGeometry args={[1.65, 1.65, 0.5, 26]} />
            <meshStandardMaterial
              color="#36c5ff"
              emissive="#1fd1c1"
              emissiveIntensity={0.8 * visuals.pipeGlow}
              transparent
              opacity={0.84}
            />
          </mesh>
        </group>
      </Float>

      <Pipe curve={trunkCurve} visuals={visuals} radius={0.17} />
      <Pipe curve={ward01Curve} visuals={visuals} radius={0.15} />
      <Pipe curve={ward02Curve} visuals={visuals} radius={0.15} />
      <Pipe curve={ward03Curve} visuals={visuals} radius={0.15} />

      <FlowParticles curve={trunkCurve} count={4} color="#5ad7ff" speed={0.12} />
      <FlowParticles curve={ward01Curve} count={3} color="#5ad7ff" speed={0.18} />
      <FlowParticles curve={ward02Curve} count={3} color="#5ad7ff" speed={0.16} />
      <FlowParticles curve={ward03Curve} count={3} color="#5ad7ff" speed={0.14} />

      <ValveNode position={[3.8, -0.84, -4.6]} intensity={visuals.pipeGlow} />
      <ValveNode position={[4.2, -0.84, -0.8]} intensity={visuals.pipeGlow} />
      <ValveNode position={[4.1, -0.84, 3.1]} intensity={visuals.pipeGlow} />
    </group>
  );
}

function Pipe({
  curve,
  visuals,
  radius,
}: {
  curve: THREE.CatmullRomCurve3;
  visuals: ModeVisuals;
  radius: number;
}) {
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 80, radius, 12, false),
    [curve, radius]
  );

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#2fa8d7"
        emissive="#1fd1c1"
        emissiveIntensity={visuals.pipeGlow}
        transparent
        opacity={visuals.pipeOpacity * visuals.undergroundOpacity}
        roughness={0.25}
        metalness={0.48}
      />
    </mesh>
  );
}

function FlowParticles({
  curve,
  count,
  color,
  speed,
}: {
  curve: THREE.CatmullRomCurve3;
  count: number;
  color: string;
  speed: number;
}) {
  const refs = useRef<Array<THREE.Mesh | null>>([]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    refs.current.forEach((mesh, index) => {
      if (!mesh) return;

      const t = (elapsed * speed + index / count) % 1;
      const point = curve.getPointAt(t);
      mesh.position.copy(point);
    });
  });

  return (
    <group>
      {Array.from({ length: count }).map((_, index) => (
        <mesh
          key={index}
          ref={(value) => {
            refs.current[index] = value;
          }}
        >
          <sphereGeometry args={[0.11, 10, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} />
        </mesh>
      ))}
    </group>
  );
}

function ValveNode({
  position,
  intensity,
}: {
  position: [number, number, number];
  intensity: number;
}) {
  return (
    <group position={position}>
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.24, 0.06, 10, 18]} />
        <meshStandardMaterial color="#8cd9ff" emissive="#1fd1c1" emissiveIntensity={0.7 * intensity} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#7be0ff" emissive="#1fd1c1" emissiveIntensity={1.2 * intensity} />
      </mesh>
    </group>
  );
}

function StreetLighting({ visuals }: { visuals: ModeVisuals }) {
  return (
    <group>
      {streetLights.map((position, index) => (
        <StreetLight
          key={index}
          position={position}
          glow={visuals.lightGlow}
          coneOpacity={visuals.lightConeOpacity}
        />
      ))}
    </group>
  );
}

function StreetLight({
  position,
  glow,
  coneOpacity,
}: {
  position: [number, number, number];
  glow: number;
  coneOpacity: number;
}) {
  const bulbRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const pulse = 0.85 + Math.sin(clock.getElapsedTime() * 1.8 + position[0]) * 0.1;
    if (bulbRef.current) {
      const material = bulbRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = glow * pulse;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 1.7, 8]} />
        <meshStandardMaterial color="#6a7788" roughness={0.7} metalness={0.35} />
      </mesh>

      <mesh position={[0.16, 1.62, 0]} rotation-z={-0.45}>
        <cylinderGeometry args={[0.03, 0.03, 0.42, 8]} />
        <meshStandardMaterial color="#6a7788" roughness={0.7} metalness={0.35} />
      </mesh>

      <mesh ref={bulbRef} position={[0.29, 1.47, 0]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#ffca76" emissive="#f5a623" emissiveIntensity={glow} />
      </mesh>

      <mesh position={[0.29, 0.55, 0]} rotation-x={Math.PI}>
        <coneGeometry args={[0.34, 1.15, 16, 1, true]} />
        <meshBasicMaterial color="#f5a623" transparent opacity={coneOpacity} depthWrite={false} />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[0.29, -0.99, 0]}>
        <circleGeometry args={[0.55, 20]} />
        <meshBasicMaterial color="#f5a623" transparent opacity={coneOpacity * 0.45} />
      </mesh>
    </group>
  );
}

function Trees() {
  return (
    <group>
      {treePositions.map((position, index) => (
        <group key={index} position={position}>
          <mesh position={[0, -0.45, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 0.9, 8]} />
            <meshStandardMaterial color="#5b4638" roughness={0.88} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <coneGeometry args={[0.45, 1.1, 8]} />
            <meshStandardMaterial color="#214936" roughness={0.95} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function UtilityNetwork() {
  return (
    <group>
      {[-12.4, -6.2, -0.1, 6.2, 12.4].map((x, index) => (
        <mesh key={index} position={[x, 0.2, 11.8]}>
          <cylinderGeometry args={[0.05, 0.06, 2.2, 8]} />
          <meshStandardMaterial color="#637082" roughness={0.8} metalness={0.2} />
        </mesh>
      ))}

      {utilityLinePoints.map((points, index) => (
        <Line
          key={index}
          points={points as [number, number, number][]}
          color="#7993b3"
          transparent
          opacity={0.65}
          lineWidth={1}
        />
      ))}
    </group>
  );
}

function DrainageChannel() {
  return (
    <group position={[-8.7, -1.04, 7.2]}>
      <mesh>
        <boxGeometry args={[7.5, 0.14, 0.42]} />
        <meshStandardMaterial color="#0e1b27" roughness={0.95} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[7.2, 0.04, 0.2]} />
        <meshStandardMaterial color="#0d5f71" emissive="#0d5f71" emissiveIntensity={0.22} />
      </mesh>
    </group>
  );
}

function Vehicles() {
  const curves = useMemo(
    () => vehiclePaths.map((path) => new THREE.CatmullRomCurve3(path)),
    []
  );

  return (
    <group>
      <MovingVehicle curve={curves[0]} speed={0.045} color="#4c7eff" />
      <MovingVehicle curve={curves[1]} speed={0.036} color="#22c55e" />
      <MovingVehicle curve={curves[2]} speed={0.04} color="#f59e0b" />
    </group>
  );
}

function MovingVehicle({
  curve,
  speed,
  color,
}: {
  curve: THREE.CatmullRomCurve3;
  speed: number;
  color: string;
}) {
  const vehicleRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!vehicleRef.current) return;

    const t = (clock.getElapsedTime() * speed) % 1;
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();

    vehicleRef.current.position.copy(point);
    vehicleRef.current.lookAt(point.clone().add(tangent));
  });

  return (
    <group ref={vehicleRef}>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.65, 0.22, 0.34]} />
        <meshStandardMaterial color="#c7d2e0" roughness={0.5} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.3, 0.16, 0.28]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} roughness={0.4} />
      </mesh>
    </group>
  );
}

function WardLabels() {
  return (
    <group>
      {wardLabels.map((label) => (
        <Text
          key={label.text}
          position={label.position}
          rotation={[-0.45, 0.42, 0]}
          fontSize={0.65}
          color="#d7f8ff"
          anchorX="center"
          anchorY="middle"
        >
          {label.text}
        </Text>
      ))}
    </group>
  );
}

function StatusMarkers({ visuals }: { visuals: ModeVisuals }) {
  return (
    <group>
      <BlinkingMarker position={[-2.6, 5.45, -6.4]} color="#22c55e" boost={visuals.markerBoost} />
      <BlinkingMarker position={[-7.3, 1.4, -5.2]} color="#22c55e" boost={visuals.markerBoost} />
      <BlinkingMarker position={[3.8, -0.2, -4.6]} color="#22c55e" boost={visuals.markerBoost} />
      <BlinkingMarker position={[4.2, -0.2, -0.8]} color="#ef4444" boost={visuals.markerBoost} />
      <BlinkingMarker position={[4.1, -0.2, 3.1]} color="#22c55e" boost={visuals.markerBoost} />
    </group>
  );
}

function BlinkingMarker({
  position,
  color,
  boost,
}: {
  position: [number, number, number];
  color: string;
  boost: number;
}) {
  const markerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!markerRef.current) return;

    const intensity = (0.8 + Math.sin(clock.getElapsedTime() * 2.4 + position[0]) * 0.25) * boost;
    const material = markerRef.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = intensity;
  });

  return (
    <mesh ref={markerRef} position={position}>
      <sphereGeometry args={[0.14, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={boost} />
    </mesh>
  );
}
