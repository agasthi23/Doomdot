import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Edges } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================================
// 1. CLEAN LOW-POLY 3D GEOMETRIC ROBOT MESH (True 3D Spatial Volume)
// ============================================================================
const CleanLowPolyRobot: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Low-poly clean geometries
  const headGeo = useMemo(() => new THREE.IcosahedronGeometry(0.85, 1), []); // Clean 20-sided polygon head
  const visorGeo = useMemo(() => new THREE.BoxGeometry(0.85, 0.35, 0.45), []); // Sleek geometric visor
  const earGeo = useMemo(() => new THREE.CylinderGeometry(0.22, 0.22, 0.14, 6), []); // Hexagonal low-poly ear modules
  const neckGeo = useMemo(() => new THREE.CylinderGeometry(0.28, 0.35, 0.22, 6), []);
  const chestGeo = useMemo(() => new THREE.DodecahedronGeometry(0.8, 0), []); // Clean 12-sided faceted chest
  const shoulderGeo = useMemo(() => new THREE.OctahedronGeometry(0.25, 0), []);
  const coreGeo = useMemo(() => new THREE.OctahedronGeometry(0.32, 0), []); // Internal floating energy crystal
  const thrusterGeo = useMemo(() => new THREE.ConeGeometry(0.45, 0.5, 6, 1, true), []); // Hexagonal thruster base

  // Pre-calculate key vertex points for glowing nodes
  const headVertices = useMemo(() => {
    // Unique vertex positions for head nodes
    const pos = headGeo.attributes.position.array as Float32Array;
    return pos;
  }, [headGeo]);

  const chestVertices = useMemo(() => {
    const pos = chestGeo.attributes.position.array as Float32Array;
    return pos;
  }, [chestGeo]);

  useFrame((state) => {
    const { pointer } = state;
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Smooth 3D rotational tilt following the cursor
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.55 + t * 0.15,
        0.06
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.y * 0.35,
        0.06
      );
    }

    if (headRef.current) {
      // Direct head gaze tracking
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        pointer.x * 0.4,
        0.08
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        -pointer.y * 0.25,
        0.08
      );
    }

    // Floating internal core pulsing
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.8;
      coreRef.current.rotation.y = t * 1.1;
      const s = 1 + Math.sin(t * 3) * 0.08;
      coreRef.current.scale.set(s, s, s);
    }

    // Single clean orbital data ring
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
      ringRef.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.8) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.05, 0]}>
      {/* ============================================================== */}
      {/* A. ROBOT HEAD ASSEMBLY (Clean low-poly icosahedron)             */}
      {/* ============================================================== */}
      <group ref={headRef} position={[0, 0.95, 0]}>
        {/* Low-Poly Faceted Helmet with 3D Depth Sorting */}
        <mesh geometry={headGeo}>
          {/* Dark solid material so front edges physically occlude back edges! */}
          <meshStandardMaterial
            color="#040903"
            roughness={0.4}
            metalness={0.8}
            depthWrite={true}
            depthTest={true}
          />
          {/* Crisp, thin 1px glowing neon green wireframe edges */}
          <Edges threshold={10} color="#A8FF00" />
        </mesh>

        {/* Small glowing circular nodes at key vertices */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[headVertices, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.045}
            color="#A8FF00"
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Geometric Angular Visor */}
        <mesh geometry={visorGeo} position={[0, 0.04, 0.58]}>
          <meshStandardMaterial
            color="#020803"
            roughness={0.2}
            metalness={0.9}
            depthWrite={true}
          />
          <Edges threshold={15} color="#00f3ff" />
        </mesh>

        {/* Visor Digital Eye Markers (Two clean angular nodes) */}
        <mesh position={[-0.22, 0.04, 0.82]}>
          <boxGeometry args={[0.12, 0.035, 0.02]} />
          <meshBasicMaterial color="#A8FF00" />
        </mesh>
        <mesh position={[0.22, 0.04, 0.82]}>
          <boxGeometry args={[0.12, 0.035, 0.02]} />
          <meshBasicMaterial color="#A8FF00" />
        </mesh>

        {/* Hexagonal Ear Modules (Clean Low-Poly) */}
        <mesh geometry={earGeo} position={[-0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#050e04" roughness={0.5} />
          <Edges threshold={15} color="#A8FF00" />
        </mesh>
        <mesh geometry={earGeo} position={[0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#050e04" roughness={0.5} />
          <Edges threshold={15} color="#A8FF00" />
        </mesh>

        {/* Top Antenna Node */}
        <group position={[0, 0.95, 0]}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.03, 0.22, 6]} />
            <meshBasicMaterial color="#23430C" />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <octahedronGeometry args={[0.07, 0]} />
            <meshBasicMaterial color="#A8FF00" />
          </mesh>
        </group>
      </group>

      {/* Neck Joint */}
      <mesh geometry={neckGeo} position={[0, 0.35, 0]}>
        <meshStandardMaterial color="#020601" />
        <Edges threshold={20} color="#23430C" />
      </mesh>

      {/* ============================================================== */}
      {/* B. ROBOT TORSO & CORE (Structured Faceted Dodecahedron)        */}
      {/* ============================================================== */}
      <group position={[0, -0.42, 0]}>
        {/* Faceted Body Shell with Occlusion */}
        <mesh geometry={chestGeo}>
          <meshStandardMaterial
            color="#040903"
            roughness={0.4}
            metalness={0.85}
            depthWrite={true}
            depthTest={true}
          />
          {/* Crisp 1px neon green wireframe edges */}
          <Edges threshold={12} color="#A8FF00" />
        </mesh>

        {/* Chest Key Vertex Nodes */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[chestVertices, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.045}
            color="#A8FF00"
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Internal Floating Energy Crystal (Cyan & Lime glow) */}
        <mesh ref={coreRef} geometry={coreGeo}>
          <meshBasicMaterial color="#00f3ff" wireframe={true} />
        </mesh>
        <pointLight color="#00f3ff" intensity={2.5} distance={1.8} />
        <pointLight color="#A8FF00" intensity={2.0} distance={2.2} />

        {/* Low-Poly Shoulder Joints */}
        <mesh geometry={shoulderGeo} position={[-0.95, 0.22, 0]}>
          <meshStandardMaterial color="#030802" />
          <Edges threshold={15} color="#A8FF00" />
        </mesh>
        <mesh geometry={shoulderGeo} position={[0.95, 0.22, 0]}>
          <meshStandardMaterial color="#030802" />
          <Edges threshold={15} color="#A8FF00" />
        </mesh>

        {/* Clean Single Concentric Data Ring */}
        <mesh ref={ringRef} position={[0, 0, 0]}>
          <ringGeometry args={[1.35, 1.37, 48]} />
          <meshBasicMaterial color="#A8FF00" side={THREE.DoubleSide} transparent opacity={0.65} />
        </mesh>

        {/* Lower Thruster / Base Joint */}
        <mesh geometry={thrusterGeo} position={[0, -0.75, 0]} rotation={[Math.PI, 0, 0]}>
          <meshStandardMaterial color="#030802" />
          <Edges threshold={15} color="#23430C" />
        </mesh>
      </group>

      {/* ============================================================== */}
      {/* C. SUBTLE VOLUMETRIC BLOOM/GLOW SPHERE BEHIND MESH             */}
      {/* ============================================================== */}
      <mesh position={[0, 0.2, -0.6]}>
        <sphereGeometry args={[1.5, 24, 24]} />
        <meshBasicMaterial
          color="#A8FF00"
          transparent={true}
          opacity={0.04}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[0, 0.2, -0.4]}>
        <sphereGeometry args={[1.0, 20, 20]} />
        <meshBasicMaterial
          color="#00f3ff"
          transparent={true}
          opacity={0.03}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// ============================================================================
// 2. SUBTLE DIGITAL PARTICLES AROUND THE MESH
// ============================================================================
const AmbientParticles: React.FC<{ count?: number }> = ({ count = 65 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4.5;
    }
    return [pos];
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#A8FF00"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ============================================================================
// 3. TRANSPARENT BORDERLESS CANVAS CONTAINER
// ============================================================================
export const Mascot3DCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full relative select-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 38, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ 
          alpha: true, 
          antialias: true, 
          powerPreference: 'high-performance'
        }}
      >
        {/* Ambient Dark Tech Base Light */}
        <ambientLight intensity={0.4} />

        {/* Directional Lights to define 3D form & bevels */}
        <directionalLight position={[4, 5, 4]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-4, -2, -3]} intensity={2.0} color="#A8FF00" />
        <directionalLight position={[0, 4, -4]} intensity={1.5} color="#00f3ff" />

        {/* Smooth floating motion with spring physics */}
        <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.4}>
          <CleanLowPolyRobot />
        </Float>

        <AmbientParticles count={75} />

        {/* OrbitControls with restrained tilt for subtle user interaction */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.7}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};
