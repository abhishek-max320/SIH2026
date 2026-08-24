'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Rotating Agricultural Intelligence Digital Globe with glowing scan rings
function DigitalAgriGlobe() {
  const globeRef = useRef();
  const ringRef1 = useRef();
  const ringRef2 = useRef();
  const particlesRef = useRef();

  // Create point particles representing sensor / farm observation nodes
  const { positions, colors } = useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const orangeColor = new THREE.Color('#FF6B00');
    const greenColor = new THREE.Color('#10B981');
    const amberColor = new THREE.Color('#F59E0B');

    for (let i = 0; i < count; i++) {
      // Golden spiral distribution on sphere surface
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 2.2 + Math.random() * 0.15;

      pos[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      pos[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = i % 5 === 0 ? greenColor : i % 3 === 0 ? amberColor : orangeColor;
      cols[i * 3] = chosenColor.r;
      cols[i * 3 + 1] = chosenColor.g;
      cols[i * 3 + 2] = chosenColor.b;
    }
    return { positions: pos, colors: cols };
  }, []);

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.2;
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x += delta * 0.3;
      ringRef1.current.rotation.y += delta * 0.4;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.y -= delta * 0.35;
      ringRef2.current.rotation.z += delta * 0.25;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group>
      {/* Inner Distorted Crop Energy Sphere */}
      <Sphere ref={globeRef} args={[1.7, 64, 64]}>
        <MeshDistortMaterial
          color="#0D0D0D"
          emissive="#FF6B00"
          emissiveIntensity={0.35}
          roughness={0.2}
          metalness={0.9}
          distort={0.25}
          speed={1.5}
          wireframe={true}
        />
      </Sphere>

      {/* Sensor Node Particle Cloud */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Orbital Scanning Ring 1 (Orange Laser) */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#FF6B00" transparent opacity={0.6} />
      </mesh>

      {/* Orbital Scanning Ring 2 (Amber Laser) */}
      <mesh ref={ringRef2}>
        <torusGeometry args={[2.8, 0.015, 16, 100]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

export default function Hero3DCanvas() {
  return (
    <div className="w-full h-[420px] sm:h-[520px] relative">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#FF7A00" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#10B981" />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
          <DigitalAgriGlobe />
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* Overlay HUD Telemetry */}
      <div className="absolute top-4 left-4 glass-panel px-3 py-1.5 rounded-xl border border-agri-orange/30 text-[10px] font-mono text-agri-orange flex items-center gap-2 pointer-events-none shadow-[0_0_15px_rgba(255,107,0,0.2)]">
        <span className="w-2 h-2 rounded-full bg-agri-orange animate-pulse"></span>
        <span>C++ SPATIAL RADAR ACTIVE</span>
      </div>

      <div className="absolute bottom-4 right-4 glass-panel px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono text-neutral-400 pointer-events-none">
        DRAG TO ROTATE 3D SENSOR GLOBE
      </div>
    </div>
  );
}
