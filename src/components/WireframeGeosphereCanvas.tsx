import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 1. Clean Wireframe Geosphere with Vertex Nodes & Gyroscope Rings
const WireframeGeosphereConstruct: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const outerSphereRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  // Geometries
  const outerGeo = useMemo(() => new THREE.IcosahedronGeometry(1.35, 2), []);
  const innerGeo = useMemo(() => new THREE.IcosahedronGeometry(0.7, 1), []);
  const centerOrbGeo = useMemo(() => new THREE.SphereGeometry(0.35, 24, 24), []);

  // Pre-calculate vertex positions for glowing node points
  const vertexPositions = useMemo(() => {
    return outerGeo.attributes.position.array as Float32Array;
  }, [outerGeo]);

  useFrame((state) => {
    const { pointer } = state;
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Continuous smooth rotation with cursor parallax tilt
      groupRef.current.rotation.y = t * 0.2 + pointer.x * 0.45;
      groupRef.current.rotation.x = -pointer.y * 0.3;
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.08;
    }

    // Outer Geosphere pulse
    if (outerSphereRef.current) {
      const pulse = 1 + Math.sin(t * 2.5) * 0.02;
      outerSphereRef.current.scale.set(pulse, pulse, pulse);
    }

    // Inner Core counter-rotation
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -t * 0.4;
      innerCoreRef.current.rotation.x = Math.sin(t * 0.5) * 0.3;
    }

    // Multi-axis gyroscope rings
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.8;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.6;
    if (ring3Ref.current) ring3Ref.current.rotation.x = t * 0.9;
  });

  return (
    <group ref={groupRef}>
      {/* ============================================================== */}
      {/* A. OUTER WIREFRAME GEOSPHERE (Thin Glowing Neon Green Lines)    */}
      {/* ============================================================== */}
      <mesh ref={outerSphereRef} geometry={outerGeo}>
        <meshBasicMaterial
          color="#A8FF00"
          wireframe={true}
          transparent={true}
          opacity={0.7}
        />
      </mesh>

      {/* Glowing Circular Vertex Nodes at all intersections */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[vertexPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#A8FF00"
          transparent={true}
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* ============================================================== */}
      {/* B. INNER WIREFRAME CORE (Cyan & Lime Luminous Energy)           */}
      {/* ============================================================== */}
      <mesh ref={innerCoreRef} geometry={innerGeo}>
        <meshBasicMaterial
          color="#00f3ff"
          wireframe={true}
          transparent={true}
          opacity={0.8}
        />
      </mesh>

      {/* Internal Luminous Energy Center Sphere */}
      <mesh geometry={centerOrbGeo}>
        <meshBasicMaterial
          color="#A8FF00"
          transparent={true}
          opacity={0.9}
        />
      </mesh>

      {/* Core Point Lights */}
      <pointLight color="#A8FF00" intensity={3.5} distance={3.5} />
      <pointLight color="#00f3ff" intensity={2.0} distance={2.5} />

      {/* ============================================================== */}
      {/* C. MULTI-AXIS CONCENTRIC GYROSCOPE RINGS                       */}
      {/* ============================================================== */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0.2, 0]}>
        <ringGeometry args={[1.75, 1.77, 64]} />
        <meshBasicMaterial
          color="#A8FF00"
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.65}
        />
      </mesh>

      <mesh ref={ring2Ref} rotation={[-Math.PI / 4, 0.4, 0]}>
        <ringGeometry args={[2.05, 2.07, 64]} />
        <meshBasicMaterial
          color="#00f3ff"
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.5}
        />
      </mesh>

      <mesh ref={ring3Ref} rotation={[Math.PI / 6, -0.3, 0]}>
        <ringGeometry args={[2.35, 2.37, 64]} />
        <meshBasicMaterial
          color="#A8FF00"
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};

// 2. Subtle Orbiting Star Dust
const StarDustParticles: React.FC<{ count?: number }> = ({ count = 90 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5.5;
    }
    return [pos];
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.025;
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
        transparent={true}
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// 3. Main Transparent Canvas Component (No clipping, completely borderless)
export const WireframeGeosphereCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full h-full relative select-none bg-transparent ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        className="!bg-transparent"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 5, 4]} intensity={2.0} color="#ffffff" />
        <directionalLight position={[-4, -3, -3]} intensity={2.5} color="#A8FF00" />
        <directionalLight position={[0, 4, -4]} intensity={1.8} color="#00f3ff" />

        <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.4}>
          <WireframeGeosphereConstruct />
        </Float>

        <StarDustParticles count={100} />

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
