"use client";

import { useMemo, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { useThemeColors, usePrefersReducedMotion } from "@/lib/three/sceneHooks";

/**
 * Board-space target positions the camera visits, one per STORY_BEATS
 * entry, in order: SPAWN POINT (CPU), SKILL TREE (RAM), SIDE QUESTS (GPU),
 * CURRENT QUEST (full-build overview, centroid of all 4 parts including
 * the PSU at (7, 1.5, 3) so the finale actually frames the whole build).
 * Matches the part positions in <Parts> below exactly — verified via a
 * headless Three.js render before committing these numbers (see
 * docs/superpowers/specs/2026-07-22-about-pc-build-scroll-redesign-design.md).
 */
const WAYPOINTS: THREE.Vector3[] = [
  new THREE.Vector3(0, 0.85, 0), // CPU
  new THREE.Vector3(2.55, 2.0, 0), // RAM (midpoint of both sticks)
  new THREE.Vector3(-2, 0.95, -5), // GPU
  new THREE.Vector3(1.89, 1.33, -0.5), // full-build overview (centroid of CPU/RAM/GPU/PSU)
];

/**
 * Camera offset per waypoint (added to the matching WAYPOINTS entry
 * before building the dolly curve). Each of the first 3 has a distinct
 * azimuth so the viewing angle actually changes between stops — a shared
 * offset here previously dwarfed the ~3-7 unit deltas between waypoints,
 * making all 3 inspection stops look nearly identical. The last pulls back
 * further so the whole build (including the PSU) is visible at once for
 * the final beat; verified via headless Three.js frustum projection that
 * all 4 parts land within the camera's NDC bounds at that offset.
 */
const CAMERA_OFFSETS: THREE.Vector3[] = [
  new THREE.Vector3(-4, 5, 7), // CPU: front-left
  new THREE.Vector3(6, 4, 5), // RAM: front-right
  new THREE.Vector3(-6, 4, -7), // GPU: back-left
  new THREE.Vector3(13, 15, 19), // full-build overview pull-back
];

function buildCameraCurve(): THREE.CatmullRomCurve3 {
  const points = WAYPOINTS.map((p, i) => p.clone().add(CAMERA_OFFSETS[i]));
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
 * free — no separate tween needed for the probe itself. Identical to the
 * previous CircuitScene's rig; only the curve-building functions above
 * changed to use per-waypoint camera offsets.
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
    // and never move as the rig dollies through the scene.
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

const MOTHERBOARD_COLOR = "#123321";
const CHIP_COLOR = "#2a2a2a";
const HEATSINK_COLOR = "#888888";
const RAM_BODY_COLOR = "#1a1a2e";
const GPU_BODY_COLOR = "#1c1c1c";
const FAN_COLOR = "#333333";
const PSU_COLOR = "#222222";
const HEATSINK_FIN_HEIGHTS = [1.4, 1.6, 1.8];
const RAM_STICK_X = [2.2, 2.9];
const GPU_FAN_X = [-4, 0];

interface PartsProps {
  accentColor: string;
}

/**
 * The PC build itself: motherboard, CPU + heatsink, 2 RAM sticks, GPU with
 * dual fans, and a PSU with a glowing rear fan. Base colors are fixed
 * neutrals — this is static scene geometry, not UI chrome (same exception
 * the previous CC0 board's baked-in materials had, see Global
 * Constraints). Only the RGB accents (RAM light bar, PSU fan) track the
 * live theme's accent color, matching the probe tip.
 */
function Parts({ accentColor }: PartsProps) {
  return (
    <group>
      {/* Motherboard */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[12, 0.6, 13]} />
        <meshStandardMaterial color={MOTHERBOARD_COLOR} />
      </mesh>

      {/* CPU */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[3, 0.5, 3]} />
        <meshStandardMaterial color={CHIP_COLOR} />
      </mesh>

      {/* Heatsink fins */}
      {HEATSINK_FIN_HEIGHTS.map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[2.2, 0.15, 2.2]} />
          <meshStandardMaterial color={HEATSINK_COLOR} />
        </mesh>
      ))}

      {/* RAM sticks + RGB light bars */}
      {RAM_STICK_X.map((x) => (
        <group key={x}>
          <mesh position={[x, 2.0, 0]}>
            <boxGeometry args={[0.5, 2.8, 1.1]} />
            <meshStandardMaterial color={RAM_BODY_COLOR} />
          </mesh>
          <mesh position={[x, 3.48, 0]}>
            <boxGeometry args={[0.55, 0.15, 1.15]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      ))}

      {/* GPU + dual fans */}
      <mesh position={[-2, 0.95, -5]}>
        <boxGeometry args={[7, 0.7, 3]} />
        <meshStandardMaterial color={GPU_BODY_COLOR} />
      </mesh>
      {GPU_FAN_X.map((x) => (
        <mesh key={x} position={[x, 1.38, -5]}>
          <cylinderGeometry args={[1.1, 1.1, 0.15, 16]} />
          <meshStandardMaterial color={FAN_COLOR} />
        </mesh>
      ))}

      {/* PSU + glowing rear fan */}
      <mesh position={[7, 1.5, 3]}>
        <boxGeometry args={[3, 3, 4]} />
        <meshStandardMaterial color={PSU_COLOR} />
      </mesh>
      <mesh position={[7, 1.5, 5.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 16]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

interface PCBuildSceneProps {
  progressRef: RefObject<number>;
}

/**
 * Scroll-driven PC-build inspection sequence: vertical scroll drives a
 * camera dolly past a procedurally-built CPU/RAM/GPU/motherboard/PSU
 * while a diagnostic probe rides along, parented to the camera. Mount
 * only on desktop with motion + WebGL available — StoryStage handles
 * that gate and the vertical fallback.
 */
export default function PCBuildScene({ progressRef }: PCBuildSceneProps) {
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
      <Parts accentColor={colors.accent} />
      <Rig progressRef={progressRef} accentColor={colors.accent} />
    </Canvas>
  );
}
