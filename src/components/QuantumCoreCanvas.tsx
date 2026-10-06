import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface QuantumCoreCanvasProps {
  isHovered?: boolean;
  className?: string;
}

// 1. Core 3D Scene Component: Wireframe Icosahedron + Dark Glass + Orbiting Nodes
const IcosahedronScene: React.FC<{
  isHovered: boolean;
  scrollRotation: React.MutableRefObject<{ x: number; y: number; z: number }>;
}> = ({ isHovered, scrollRotation }) => {
  const masterGroupRef = useRef<THREE.Group>(null);
  const icosahedronRef = useRef<THREE.Group>(null);
  const innerGlassRef = useRef<THREE.Mesh>(null);
  const innerCoreGlowRef = useRef<THREE.Mesh>(null);

  // References for the 4 orbiting node spheres
  const node1Ref = useRef<THREE.Group>(null);
  const node2Ref = useRef<THREE.Group>(null);
  const node3Ref = useRef<THREE.Group>(null);
  const node4Ref = useRef<THREE.Group>(null);

  // Ring geometries and radiuses
  const ring1Radius = 1.75;
  const ring2Radius = 2.05;
  const ring3Radius = 2.35;
  const ring4Radius = 2.65;

  // Icosahedron Geometries
  // Low-frequency faceted icosahedron for iconic triangular cybernetic panels
  const outerIcoGeo = useMemo(() => new THREE.IcosahedronGeometry(1.35, 1), []);
  const outerEdgesGeo = useMemo(() => new THREE.EdgesGeometry(outerIcoGeo, 15), [outerIcoGeo]);
  
  // Inner dark glass mesh - slightly smaller to sit snugly inside the wireframe cage
  const innerGlassGeo = useMemo(() => new THREE.IcosahedronGeometry(1.28, 1), []);
  
  // Central glowing core orb
  const innerOrbGeo = useMemo(() => new THREE.IcosahedronGeometry(0.48, 1), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const { pointer } = state;

    // A. Master Group: Slight mouse-follow rotation + GSAP Scroll-linked rotation
    if (masterGroupRef.current) {
      // Mouse-follow target with soft damping
      const targetMouseX = pointer.x * 0.35;
      const targetMouseY = -pointer.y * 0.25;

      // Combine base slow rotation, mouse follow, and GSAP scroll rotation
      masterGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.y,
        t * 0.12 + targetMouseX + scrollRotation.current.y,
        0.05
      );
      masterGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.x,
        targetMouseY + scrollRotation.current.x,
        0.05
      );
      masterGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        masterGroupRef.current.rotation.z,
        scrollRotation.current.z,
        0.05
      );
    }

    // B. Icosahedron tumble & subtle breathing scale
    if (icosahedronRef.current) {
      icosahedronRef.current.rotation.y = t * 0.25;
      icosahedronRef.current.rotation.x = Math.sin(t * 0.4) * 0.18;
      
      const hoverScale = isHovered ? 1.05 : 1.0;
      const pulse = hoverScale * (1 + Math.sin(t * 2.2) * 0.015);
      icosahedronRef.current.scale.set(pulse, pulse, pulse);
    }

    // C. Central glowing core pulse inside the dark glass
    if (innerCoreGlowRef.current) {
      const corePulse = 1 + Math.sin(t * 3.8) * 0.12;
      innerCoreGlowRef.current.scale.set(corePulse, corePulse, corePulse);
      innerCoreGlowRef.current.rotation.y = -t * 0.6;
    }

    // D. 4 Orbiting Glowing Node Spheres along their respective tilted rings
    // Node 1 (Speed: 1.1)
    if (node1Ref.current) {
      const a1 = t * 1.1;
      node1Ref.current.position.set(
        Math.cos(a1) * ring1Radius,
        Math.sin(a1) * ring1Radius,
        0
      );
    }

    // Node 2 (Speed: -0.85, offset)
    if (node2Ref.current) {
      const a2 = -t * 0.85 + 1.4;
      node2Ref.current.position.set(
        Math.cos(a2) * ring2Radius,
        Math.sin(a2) * ring2Radius,
        0
      );
    }

    // Node 3 (Speed: 1.35, offset)
    if (node3Ref.current) {
      const a3 = t * 1.35 + 2.8;
      node3Ref.current.position.set(
        Math.cos(a3) * ring3Radius,
        Math.sin(a3) * ring3Radius,
        0
      );
    }

    // Node 4 (Speed: -1.05, offset)
    if (node4Ref.current) {
      const a4 = -t * 1.05 + 4.2;
      node4Ref.current.position.set(
        Math.cos(a4) * ring4Radius,
        Math.sin(a4) * ring4Radius,
        0
      );
    }
  });

  return (
    <group ref={masterGroupRef}>
      {/* ============================================================== */}
      {/* 1. CENTRAL WIREFRAME ICOSAHEDRON & DARK GLASS INNER MESH        */}
      {/* ============================================================== */}
      <group ref={icosahedronRef}>
        {/* Dark Glass Inner Mesh (Physical material with transmission & dark tint) */}
        <mesh ref={innerGlassRef} geometry={innerGlassGeo}>
          <meshPhysicalMaterial
            color="#040a02"
            emissive="#020801"
            transmission={0.86}
            roughness={0.16}
            metalness={0.25}
            ior={1.55}
            thickness={1.6}
            specularIntensity={1.5}
            specularColor="#B6FF1A"
            transparent={true}
            opacity={0.88}
            depthWrite={true}
          />
        </mesh>

        {/* Outer Wireframe Mesh with Emissive Lime (#B6FF1A) */}
        <mesh geometry={outerIcoGeo}>
          <meshBasicMaterial
            color="#B6FF1A"
            wireframe={true}
            transparent={true}
            opacity={0.85}
          />
        </mesh>

        {/* Emissive Lime (#B6FF1A) Edges Geometry for sharp laser definition */}
        <lineSegments geometry={outerEdgesGeo}>
          <lineBasicMaterial
            color="#B6FF1A"
            transparent={true}
            opacity={0.95}
            linewidth={1.8}
          />
        </lineSegments>

        {/* Glowing Vertex Nodes at the Icosahedron vertices */}
        <points geometry={outerIcoGeo}>
          <pointsMaterial
            size={0.065}
            color="#B6FF1A"
            transparent={true}
            opacity={0.95}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Inner Glowing Core within the Dark Glass */}
        <mesh ref={innerCoreGlowRef} geometry={innerOrbGeo}>
          <meshBasicMaterial
            color="#B6FF1A"
            wireframe={true}
            transparent={true}
            opacity={0.8}
          />
        </mesh>

        {/* High-intensity Point Lights for Bloom activation */}
        <pointLight color="#B6FF1A" intensity={4.8} distance={3.8} />
        <pointLight color="#00f3ff" intensity={2.0} distance={2.5} />
      </group>

      {/* ============================================================== */}
      {/* 2. FOUR TILTED RINGS WITH ORBITING GLOWING NODE SPHERES        */}
      {/* ============================================================== */}
      
      {/* Ring 1 (Tilted: [Math.PI / 3, 0.25, 0]) */}
      <group rotation={[Math.PI / 3, 0.25, 0]}>
        {/* Wireframe Torus Ring */}
        <mesh>
          <torusGeometry args={[ring1Radius, 0.012, 16, 90]} />
          <meshBasicMaterial color="#B6FF1A" transparent={true} opacity={0.45} />
        </mesh>
        
        {/* Orbiting Glowing Node 1 */}
        <group ref={node1Ref}>
          <mesh>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshBasicMaterial color="#B6FF1A" />
          </mesh>
          <pointLight color="#B6FF1A" intensity={3.5} distance={1.2} />
        </group>
      </group>

      {/* Ring 2 (Tilted: [-Math.PI / 3.5, 0.45, 0]) */}
      <group rotation={[-Math.PI / 3.5, 0.45, 0]}>
        <mesh>
          <torusGeometry args={[ring2Radius, 0.012, 16, 90]} />
          <meshBasicMaterial color="#B6FF1A" transparent={true} opacity={0.4} />
        </mesh>

        {/* Orbiting Glowing Node 2 */}
        <group ref={node2Ref}>
          <mesh>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshBasicMaterial color="#B6FF1A" />
          </mesh>
          <pointLight color="#B6FF1A" intensity={3.5} distance={1.2} />
        </group>
      </group>

      {/* Ring 3 (Tilted: [Math.PI / 5, -0.4, 0.3]) */}
      <group rotation={[Math.PI / 5, -0.4, 0.3]}>
        <mesh>
          <torusGeometry args={[ring3Radius, 0.012, 16, 90]} />
          <meshBasicMaterial color="#B6FF1A" transparent={true} opacity={0.35} />
        </mesh>

        {/* Orbiting Glowing Node 3 */}
        <group ref={node3Ref}>
          <mesh>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshBasicMaterial color="#B6FF1A" />
          </mesh>
          <pointLight color="#B6FF1A" intensity={3.5} distance={1.2} />
        </group>
      </group>

      {/* Ring 4 (Tilted: [-Math.PI / 6, -0.3, -0.4]) */}
      <group rotation={[-Math.PI / 6, -0.3, -0.4]}>
        <mesh>
          <torusGeometry args={[ring4Radius, 0.012, 16, 90]} />
          <meshBasicMaterial color="#B6FF1A" transparent={true} opacity={0.3} />
        </mesh>

        {/* Orbiting Glowing Node 4 */}
        <group ref={node4Ref}>
          <mesh>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshBasicMaterial color="#B6FF1A" />
          </mesh>
          <pointLight color="#B6FF1A" intensity={3.5} distance={1.2} />
        </group>
      </group>
    </group>
  );
};

// 2. Ambient Particles in Background of the Scene
const AmbientParticleField: React.FC<{ count?: number }> = ({ count = 160 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const lime = new THREE.Color('#B6FF1A');
    const darkLime = new THREE.Color('#23430C');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5.5;

      const c = Math.random() > 0.4 ? lime : darkLime;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors={true}
        transparent={true}
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// 3. Main Exported Canvas Component with GSAP ScrollTrigger & Bloom Post-Processing
export const QuantumCoreCanvas: React.FC<QuantumCoreCanvasProps> = ({
  isHovered = false,
  className = '',
}) => {
  // Ref tracking scroll-linked rotation driven by GSAP ScrollTrigger
  const scrollRotation = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    // Find hero section trigger element
    const heroElement = document.getElementById('about') || document.body;

    // GSAP ScrollTrigger driving 3D rotation across hero scroll
    const trigger = ScrollTrigger.create({
      trigger: heroElement,
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        // Smooth continuous scroll-linked rotation
        const progress = self.progress;
        scrollRotation.current.y = progress * Math.PI * 1.8;
        scrollRotation.current.x = progress * Math.PI * 0.65;
        scrollRotation.current.z = Math.sin(progress * Math.PI) * 0.35;
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div className={`w-full h-full relative select-none bg-transparent ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        className="!bg-transparent"
      >
        {/* Technical Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 5, 4]} intensity={2.4} color="#ffffff" />
        <directionalLight position={[-4, 3, -3]} intensity={3.5} color="#B6FF1A" />
        <directionalLight position={[0, -4, 2]} intensity={1.8} color="#00f3ff" />

        <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.3}>
          <IcosahedronScene
            isHovered={isHovered}
            scrollRotation={scrollRotation}
          />
        </Float>

        <AmbientParticleField count={180} />

        {/* Bloom Post-Processing for emissive lime edges and glowing node spheres */}
        <EffectComposer multisampling={4}>
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.85}
            mipmapBlur={true}
          />
        </EffectComposer>

        {/* Orbit Controls (Restrained tilt, zoom disabled) */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.8}
          maxPolarAngle={Math.PI / 1.7}
          minAzimuthAngle={-Math.PI / 3}
          maxAzimuthAngle={Math.PI / 3}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};
