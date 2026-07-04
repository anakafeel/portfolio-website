"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Wider than deep so the floor spans the full viewport on wide screens. */
const GRID_X = 42;
const GRID_Z = 22;
const SPACING = 1.1;
const VOXEL_COUNT = GRID_X * GRID_Z;
/** Wave height snaps to this step so motion reads as blocky, not smooth. */
const VOXEL_STEP = 0.25;
/** Animation ticks at 8 fps for a deliberate low-frame-rate retro feel. */
const TICK_RATE = 8;

interface ThemeColors {
  accent: string;
  accentAlt: string;
  background: string;
}

const FALLBACK_COLORS: ThemeColors = {
  accent: "#ff2d78",
  accentAlt: "#00e5ff",
  background: "#0a0a12",
};

function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>(FALLBACK_COLORS);

  useEffect(() => {
    const read = () => {
      const style = getComputedStyle(document.documentElement);
      const get = (name: string, fallback: string) =>
        style.getPropertyValue(name).trim() || fallback;
      setColors({
        accent: get("--color-accent", FALLBACK_COLORS.accent),
        accentAlt: get("--color-accent-alt", FALLBACK_COLORS.accentAlt),
        background: get("--color-background", FALLBACK_COLORS.background),
      });
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

interface VoxelFieldProps {
  colors: ThemeColors;
  animate: boolean;
}

function VoxelField({ colors, animate }: VoxelFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lowColor = useMemo(() => new THREE.Color(colors.accent), [colors]);
  const highColor = useMemo(() => new THREE.Color(colors.accentAlt), [colors]);
  const scratch = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = animate
      ? Math.floor(clock.getElapsedTime() * TICK_RATE) / TICK_RATE
      : 0;
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
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <fog attach="fog" args={[colors.background, 12, 32]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 10, 6]} intensity={1.4} />
      <VoxelField colors={colors} animate={!reducedMotion} />
    </Canvas>
  );
}
