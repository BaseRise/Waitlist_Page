"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";

function FloatingShape({ position, color, speed }: { position: [number, number, number], color: string, speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // useFrame optimized for performance
  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Rotation logic
    meshRef.current.rotation.x = Math.cos(t / 4) * speed * 0.2;
    meshRef.current.rotation.y = Math.sin(t / 4) * speed * 0.2;

    // Mouse interaction with smoothing
    const { x, y } = state.mouse;
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, position[0] + x * 2, 0.1);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1] + y * 2, 0.1);
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          metalness={0.6}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.8}
          wireframe
        />
      </mesh>
    </Float>
  );
}

export default function Scene3D() {
  return (
    <div className="h-[50vh] w-full absolute top-0 left-0 z-0 pointer-events-none">
      <Canvas
        shadows={false} // Shadows off for performance
        dpr={[1, 1.5]}  // Limit pixel ratio for non-GPU laptops
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />

        {/* Basic Lights (No Environment Map) */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#2563eb" />
        <pointLight position={[-10, -10, -10]} intensity={1.5} color="#9333ea" />

        <group>
          <FloatingShape position={[0, 1, 0]} color="#2563eb" speed={0.5} />
          <FloatingShape position={[-4, -1, -2]} color="#9333ea" speed={0.4} />
          <FloatingShape position={[4, 0, -2]} color="#00c6ff" speed={0.6} />
        </group>
      </Canvas>

      {/* Visual Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/10 via-[#050505]/60 to-[#050505] z-10" />
    </div>
  );
}