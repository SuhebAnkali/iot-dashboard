import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";

export default function CameraController({ 
  sceneIndex, 
  setSceneIndex, 
  isDemoRunning, 
  setAnomalyActive 
}: any) {
  const { camera, scene } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (!isDemoRunning) return;

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" }
    });

    switch (sceneIndex) {
      case 1: // SCENE 01: Wide aerial view approaching city
        tl.to(camera.position, { x: 0, y: 300, z: 600, duration: 6 })
          .to(targetRef.current, { x: 0, y: 0, z: 0, duration: 6 }, "<")
          .call(() => setSceneIndex(2), [], "+=2");
        break;

      case 2: // SCENE 02: Water Tank Focus
        tl.to(camera.position, { x: -150, y: 80, z: 150, duration: 4 })
          .to(targetRef.current, { x: -200, y: 20, z: 0, duration: 4 }, "<")
          .call(() => setSceneIndex(3), [], "+=3");
        break;

      case 3: // SCENE 03: Wards Distribution
        tl.to(camera.position, { x: 0, y: 150, z: 300, duration: 5 })
          .to(targetRef.current, { x: 0, y: 0, z: -100, duration: 5 }, "<")
          .call(() => setSceneIndex(4), [], "+=2");
        break;

      case 4: // SCENE 04 & 05: Anomaly at Ward 02
        setAnomalyActive(true);
        tl.to(camera.position, { x: 50, y: 40, z: 80, duration: 4, ease: "power3.out" })
          .to(targetRef.current, { x: 100, y: 0, z: -50, duration: 4, ease: "power3.out" }, "<")
          .call(() => setSceneIndex(5), [], "+=1") // AI UI triggers
          .call(() => setSceneIndex(6), [], "+=4");
        break;

      case 6: // SCENE 06: Automated Response
        setAnomalyActive(false); // Valve V2 closes
        tl.to(camera.position, { x: 80, y: 60, z: 120, duration: 3 })
          .call(() => setSceneIndex(7), [], "+=2");
        break;

      case 7: // SCENE 07 & 08: Lighting / Dusk to Night
        tl.to(camera.position, { x: 0, y: 400, z: 500, duration: 6 })
          .to(targetRef.current, { x: 0, y: 0, z: 0, duration: 6 }, "<")
          .call(() => setSceneIndex(8), [], "+=3")
          .call(() => setSceneIndex(9), [], "+=2"); // Transition to Command Center
        break;
    }
  }, [sceneIndex, isDemoRunning]);

  useFrame(() => {
    camera.lookAt(targetRef.current);
  });

  return null;
}