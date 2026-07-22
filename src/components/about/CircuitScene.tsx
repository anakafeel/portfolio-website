// src/components/about/CircuitScene.tsx
"use client";

import { Suspense, useMemo, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";

import { useThemeColors, usePrefersReducedMotion } from "@/lib/three/sceneHooks";

const MODEL_URL = "/models/circuit/electronic-components.glb";

/**
 * Board-space positions of the 4 components the probe visits, one per
 * STORY_BEATS entry, in order: SPAWN POINT, SKILL TREE, SIDE QUESTS,
 * CURRENT QUEST. Verified against the real glTF node transforms in
 * public/models/circuit/electronic-components.glb.
 */
const WAYPOINTS: THREE.Vector3[] = [
  new THREE.Vector3(0, 1.71, 0), // "Cube"
  new THREE.Vector3(20, 1.71, -5), // "pci-e card"
  new THREE.Vector3(15, 1.71, -15), // "microchip 1"
  new THREE.Vector3(20, 1.71, -15), // "microchip 1.001"
];

/** Camera sits above/behind each waypoint, looking down at the component. */
const CAMERA_OFFSET = new THREE.Vector3(-4, 6, 8);

function buildCameraCurve(): THREE.CatmullRomCurve3 {
  const points = WAYPOINTS.map((p) => p.clone().add(CAMERA_OFFSET));
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.2);
}

function buildLookCurve(): THREE.CatmullRomCurve3 {
  const points = WAYPOINTS.map((p) => p.clone());
  return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.2);
}

interface RigProps {
  progressRef: RefObject<number>;
  accentColor: string;
}

/**
 * Camera rig: moves along a hand-authored path driven by `progressRef`.
 * The diagnostic probe is a child of this group, so it rides along for
 * free — no separate tween needed for the probe itself. The probe's tip
 * is accent-colored per the approved spec, so it must track the active
 * theme's `--color-accent` rather than a fixed hex (Global Constraints:
 * no hardcoded hex in new UI chrome outside the theme-color hooks).
 */
function Rig({ progressRef, accentColor }: RigProps) {
  const { camera } = useThree();
  const cameraCurve = useMemo(buildCameraCurve, []);
  const lookCurve = useMemo(buildLookCurve, []);

  useFrame(() => {
    const t = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);
    camera.position.copy(cameraCurve.getPointAt(t));
    camera.lookAt(lookCurve.getPointAt(t));
  });

  return (
    // `<primitive object={camera}>` makes the group a real Three.js child of
    // the camera (not just a React sibling), so it inherits the camera's
    // world matrix every frame and rides along with zero extra tweening —
    // a plain JSX sibling here would sit at a fixed world-space position
    // and never move as the rig dollies through the board.
    <primitive object={camera}>
      <group position={[0, -0.6, -1.4]}>
        {/* Diagnostic probe body (neutral shell, not theme-reactive) */}
        <mesh>
          <boxGeometry args={[0.35, 0.2, 0.5]} />
          <meshStandardMaterial color="#16162a" />
        </mesh>
        {/* Glowing tip: tracks the active theme's accent color */}
        <mesh position={[0, -0.05, 0.35]}>
          <coneGeometry args={[0.08, 0.3, 8]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2}
          />
        </mesh>
        <pointLight
          color={accentColor}
          intensity={1.5}
          distance={3}
          position={[0, -0.05, 0.5]}
        />
      </group>
    </primitive>
  );
}

function Board() {
  const { scene } = useGLTF(MODEL_URL);
  return <primitive object={scene} />;
}

/** On-theme loading readout shown in place of the board while the GLB fetches. */
function BoardLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <p className="font-pixel text-[10px] text-accent-alt motion-safe:animate-blink">
        {"> "}CALIBRATING... {Math.round(progress)}%
      </p>
    </Html>
  );
}

interface CircuitSceneProps {
  progressRef: RefObject<number>;
}

export default function CircuitScene({ progressRef }: CircuitSceneProps) {
  const colors = useThemeColors();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <color attach="background" args={[colors.background]} />
      <fog attach="fog" args={[colors.background, 15, 45]} />
      <ambientLight intensity={0.9} />
      <directionalLight
        position={[5, 20, 10]}
        intensity={1.6}
        color={colors.accentAlt}
      />
      <Suspense fallback={<BoardLoader />}>
        <Board />
      </Suspense>
      <Rig progressRef={progressRef} accentColor={colors.accent} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
