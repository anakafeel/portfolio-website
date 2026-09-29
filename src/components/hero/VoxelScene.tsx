"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import {
  useThemeColors,
  usePrefersReducedMotion,
  type ThemeColors,
} from "@/lib/three/sceneHooks";

/** Wider than deep so the floor spans the full viewport on wide screens. */
const GRID_X = 42;
const GRID_Z = 22;
const SPACING = 1.1;
const VOXEL_COUNT = GRID_X * GRID_Z;
/** Wave height snaps to this step so motion reads as blocky, not smooth. */
const VOXEL_STEP = 0.25;
/** Animation ticks at 8 fps for a deliberate low-frame-rate retro feel. */
const TICK_RATE = 8;

interface VoxelFieldProps {
  colors: ThemeColors;
  animate: boolean;
}

/*
 * Render loop: the canvas uses frameloop="demand", and this component asks
 * for exactly one frame per 8fps tick via invalidate(). It stops ticking
 * while the hero is scrolled off-screen or the tab is hidden, and never
 * ticks under reduced motion (one static frame). Time comes from a tick
 * counter, not R3F's clock, so a pause resumes where it left off.
 */
function VoxelField({ colors, animate }: VoxelFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lowColor = useMemo(() => new THREE.Color(colors.accent), [colors]);
  const highColor = useMemo(() => new THREE.Color(colors.accentAlt), [colors]);
  const scratch = useMemo(() => new THREE.Color(), []);
  const invalidate = useThree((s) => s.invalidate);
  const canvas = useThree((s) => s.gl.domElement);

  /** Current 8fps tick, and the tick the instance buffers were built for. */
  const tickRef = useRef(0);
  const builtTickRef = useRef(-1);

  // Theme change: rebuild the colours on the next frame.
  useEffect(() => {
    builtTickRef.current = -1;
    invalidate();
  }, [lowColor, highColor, invalidate]);

  useEffect(() => {
    if (!animate) {
      tickRef.current = 0;
      builtTickRef.current = -1;
      invalidate();
      return;
    }

    let onScreen = true;
    let timer = 0;
    const sync = () => {
      const run = onScreen && document.visibilityState === "visible";
      if (run && !timer) {
        timer = window.setInterval(() => {
          tickRef.current += 1;
          invalidate();
        }, 1000 / TICK_RATE);
      } else if (!run && timer) {
        window.clearInterval(timer);
        timer = 0;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? true;
      sync();
    });
    observer.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.clearInterval(timer);
    };
  }, [animate, canvas, invalidate]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Frames can also come from resizes; only rebuild on a new tick.
    const tick = animate ? tickRef.current : 0;
    if (tick === builtTickRef.current) return;
    builtTickRef.current = tick;

    const t = tick / TICK_RATE;
    const halfX = (GRID_X - 1) / 2;
    const halfZ = (GRID_Z - 1) / 2;
    let i = 0;
    for (let gx = 0; gx < GRID_X; gx++) {
      for (let gz = 0; gz < GRID_Z; gz++) {
        const x = (gx - halfX) * SPACING;
        const z = (gz - halfZ) * SPACING;
        const wave =
          Math.sin(gx * 0.55 + t * 1.4) * 0.45 +
          Math.cos(gz * 0.45 + t * 0.9) * 0.45;
        const y = Math.round(wave / VOXEL_STEP) * VOXEL_STEP;

        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);

        const blend = THREE.MathUtils.clamp((y + 1) / 2, 0, 1);
        scratch.lerpColors(lowColor, highColor, blend);
        mesh.setColorAt(i, scratch);
        i++;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, VOXEL_COUNT]}>
      <boxGeometry args={[0.72, 0.72, 0.72]} />
      <meshLambertMaterial toneMapped={false} />
    </instancedMesh>
  );
}

export default function VoxelScene() {
  const colors = useThemeColors();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 7.5, 15], fov: 52, rotation: [-0.5, 0, 0] }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      frameloop="demand"
    >
      <fog attach="fog" args={[colors.background, 12, 32]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 10, 6]} intensity={1.4} />
      <VoxelField colors={colors} animate={!reducedMotion} />
    </Canvas>
  );
}
