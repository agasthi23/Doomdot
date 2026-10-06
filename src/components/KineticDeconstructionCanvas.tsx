import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

interface KineticDeconstructionCanvasProps {
  explodedProgress: number; // 0 = Assembled, 1 = Full Exploded View
  activeStage: number; // 0: Core Assembly, 1: Exploded Metrics, 2: Macro Zoom, 3: Full System
  cameraZoom?: number;
}

// 1. Procedural 3D Exploded Panel Component (1 of 4 quadrants)
const ExplodedShellQuadrant: React.FC<{
  targetOffset: [number, number, number];
  rotationOffset: [number, number, number];
  explodedProgress: number;
  label: string;
  wireColor?: string;
}> = ({ targetOffset, rotationOffset, explodedProgress, wireColor = '#A8FF00' }) => {
  const meshRef = useRef<THREE.Group>(null);

  // Curved quarter-sphere shell geometry
  const shellGeo = useMemo(() => {
    // Sphere with phi/theta spanning a single quarter quadrant
    return new THREE.SphereGeometry(1.2, 28, 20, 0, Math.PI, 0, Math.PI / 2);
  }, []);

  const edgeGeo = useMemo(() => {
    return new THREE.EdgesGeometry(shellGeo, 20);
  }, [shellGeo]);

  useFrame(() => {
    if (!meshRef.current) return;
    // Smooth lerp based on explodedProgress
    const p = explodedProgress;
    meshRef.current.position.x = THREE.MathUtils.lerp(0, targetOffset[0], p);
    meshRef.current.position.y = THREE.MathUtils.lerp(0, targetOffset[1], p);
    meshRef.current.position.z = THREE.MathUtils.lerp(0, targetOffset[2], p);

    meshRef.current.rotation.x = THREE.MathUtils.lerp(0, rotationOffset[0], p);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(0, rotationOffset[1], p);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(0, rotationOffset[2], p);
  });

  return (
    <group ref={meshRef}>
      {/* Dark Metallic Chrome Shell */}
      <mesh geometry={shellGeo}>
        <meshStandardMaterial
          color="#080c06"
          metalness={0.92}
          roughness={0.18}
          envMapIntensity={1.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glowing Neon Green Seams / Wireframe Edges */}
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial
          color={wireColor}
          transparent={true}
          opacity={0.85}
          linewidth={1.5}
        />
      </lineSegments>

      {/* Vertex Highlight Node on the quadrant corner */}
      <mesh position={[0.8, 0.8, 0.8]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#A8FF00" />
      </mesh>
    </group>
  );
};

// 2. The Internal Glowing Energy Core & Gyroscope
const InternalReactorCore: React.FC<{ explodedProgress: number }> = ({ explodedProgress }) => {
  const coreRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.6;
      coreRef.current.rotation.x = Math.sin(t * 0.4) * 0.2;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 1.2;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.9;
  });

  return (
    <group ref={coreRef}>
      {/* Central Pulsating Energy Orb */}
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#051406" />
      </mesh>

      {/* Outer Wireframe Luminous Lattice */}
      <mesh>
        <icosahedronGeometry args={[0.62, 2]} />
        <meshBasicMaterial color="#A8FF00" wireframe={true} transparent opacity={0.9} />
      </mesh>

      {/* Deep Cyan Internal Light Spark */}
      <mesh>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshBasicMaterial color="#00f3ff" />
      </mesh>

      {/* Glowing Point Light casting through the exploded seams */}
      <pointLight color="#A8FF00" intensity={4.5 * (0.6 + explodedProgress * 0.8)} distance={3.5} />
      <pointLight color="#00f3ff" intensity={2.5} distance={2.5} />

      {/* Gyroscope Rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.85, 0.018, 16, 48]} />
        <meshBasicMaterial color="#A8FF00" transparent opacity={0.75} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[-Math.PI / 4, 0.4, 0]}>
        <torusGeometry args={[0.98, 0.018, 16, 48]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.65} />
      </mesh>
    </group>
  );
};

// 3. Dynamic Laser Leader Lines connecting to HUD coordinates
const DynamicLeaderLines: React.FC<{ explodedProgress: number }> = ({ explodedProgress }) => {
  const linesRef = useRef<THREE.LineSegments>(null);

  const linePositions = useMemo(() => {
    // 4 lines from exploded quadrant anchors to outer viewport HUD badges
    return new Float32Array([
      // Top-Left: Top-left panel -> Top-Left HUD
      -1.2, 1.2, 0.8,   -2.4, 1.8, 0,
      // Top-Right: Top-right panel -> Top-Right HUD
      1.2, 1.2, 0.8,    2.4, 1.8, 0,
      // Bottom-Left: Bottom-left panel -> Bottom-Left HUD
      -1.2, -1.2, 0.8,  -2.4, -1.6, 0,
      // Bottom-Right: Bottom-right panel -> Bottom-Right HUD
      1.2, -1.2, 0.8,   2.4, -1.6, 0,
    ]);
  }, []);

  useFrame(() => {
    if (!linesRef.current) return;
    const mat = linesRef.current.material as THREE.LineBasicMaterial;
    // Lines become prominent as the object explodes
    mat.opacity = THREE.MathUtils.lerp(0.05, 0.65, explodedProgress);
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        color="#A8FF00"
        transparent={true}
        opacity={0.1}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
};

// 4. Subtle Orbiting Star Dust
const StarDust: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const [positions] = useMemo(() => {
    const pos = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return [pos];
  }, []);

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

// 5. Main Exploded Assembly Scene Group with Cursor Interaction
const KineticAssemblyGroup: React.FC<{
  explodedProgress: number;
  activeStage: number;
}> = ({ explodedProgress }) => {
  const sceneGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const { pointer } = state;
    const t = state.clock.getElapsedTime();

    if (sceneGroupRef.current) {
      // Continuous smooth rotation + mouse cursor velocity tracking (like the basketball video!)
      sceneGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.y,
        pointer.x * 0.6 + t * 0.15,
        0.05
      );
      sceneGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.x,
        -pointer.y * 0.35,
        0.05
      );
    }
  });

  return (
    <group ref={sceneGroupRef}>
      {/* 4 Exploded Shell Quadrants (Representing the 4 Founding Architects) */}
      
      {/* 1. Top-Left Quadrant */}
      <ExplodedShellQuadrant
        targetOffset={[-0.95, 0.95, 0.6]}
        rotationOffset={[-0.2, -0.3, 0.2]}
        explodedProgress={explodedProgress}
        label="AGASTHI SILVA // WEB ARCHITECT"
      />

      {/* 2. Top-Right Quadrant */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <ExplodedShellQuadrant
          targetOffset={[0.95, 0.95, 0.6]}
          rotationOffset={[-0.2, 0.3, -0.2]}
          explodedProgress={explodedProgress}
          label="GAVIN RANASINGHE // CLOUD ARCHITECT"
        />
      </group>

      {/* 3. Bottom-Left Quadrant */}
      <group rotation={[Math.PI, 0, 0]}>
        <ExplodedShellQuadrant
          targetOffset={[-0.95, -0.95, 0.6]}
          rotationOffset={[0.2, -0.3, -0.2]}
          explodedProgress={explodedProgress}
          label="THAMIDU SAMARASINGHE // AI ARCHITECT"
        />
      </group>

      {/* 4. Bottom-Right Quadrant */}
      <group rotation={[Math.PI, Math.PI / 2, 0]}>
        <ExplodedShellQuadrant
          targetOffset={[0.95, -0.95, 0.6]}
          rotationOffset={[0.2, 0.3, 0.2]}
          explodedProgress={explodedProgress}
          label="ODHISHA RATHNAYAKA // CS & SECURITY"
        />
      </group>

      {/* Central Glowing Energy Reactor Core (Revealed on Explosion!) */}
      <InternalReactorCore explodedProgress={explodedProgress} />

      {/* Dynamic Laser Leader Lines connecting components to HUD */}
      <DynamicLeaderLines explodedProgress={explodedProgress} />

      {/* Ambient Star Dust Particles */}
      <StarDust />
    </group>
  );
};

export const KineticDeconstructionCanvas: React.FC<KineticDeconstructionCanvasProps> = ({
  explodedProgress,
  activeStage,
}) => {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        
        {/* Crisp Studio Key Lights */}
        <directionalLight position={[4, 5, 4]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-4, 3, -3]} intensity={2.8} color="#A8FF00" />
        <directionalLight position={[0, -4, 2]} intensity={1.5} color="#00f3ff" />

        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.35}>
          <KineticAssemblyGroup
            explodedProgress={explodedProgress}
            activeStage={activeStage}
          />
        </Float>

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
