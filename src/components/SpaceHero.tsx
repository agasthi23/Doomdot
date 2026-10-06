import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Stars, Text3D, useTexture } from '@react-three/drei';
import {
  AdditiveBlending,
  BackSide,
  Color,
  MathUtils,
  Vector3,
} from 'three';
import type { Group, Mesh } from 'three';

const LIME = '#B6FF1A';
const GLOW = '#6fb7ff';
const WORD = 'DOOMDOT';

function Letter({ char, x, delay }: { char: string; x: number; delay: number }) {
  const ref = useRef<Group>(null);
  const start = useMemo(
    () => new Vector3((Math.random() - 0.5) * 16, 4 + Math.random() * 3, -12 - Math.random() * 6),
    [],
  );

  useFrame((state) => {
    if (!ref.current) return;

    const t = MathUtils.clamp((state.clock.elapsedTime - delay) / 2.4, 0, 1);
    const easeOut = 1 - Math.pow(1 - t, 3);
    ref.current.position.set(
      MathUtils.lerp(start.x, x, easeOut),
      MathUtils.lerp(start.y, 1.4, easeOut),
      MathUtils.lerp(start.z, 0, easeOut),
    );
    ref.current.rotation.set((1 - easeOut) * 3, (1 - easeOut) * 4, 0);
  });

  return (
    <group ref={ref}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.7}
          height={0.14}
          curveSegments={8}
          bevelEnabled
          bevelSize={0.01}
          bevelThickness={0.02}
        >
          {char}
          <meshStandardMaterial
            color="#e8ffc2"
            metalness={0.6}
            roughness={0.3}
            emissive={LIME}
            emissiveIntensity={0.12}
          />
        </Text3D>
      </Center>
    </group>
  );
}

function Earth() {
  const [day, lights] = useTexture([
    '/textures/earth_atmos_2048.jpg',
    '/textures/earth_lights_2048.png',
  ]);
  const earth = useRef<Mesh>(null);
  const uniforms = useMemo(() => ({ glowColor: { value: new Color(GLOW) } }), []);

  useFrame((_, delta) => {
    if (earth.current) earth.current.rotation.y += delta * 0.02;
  });

  return (
    <group position={[0, -7.8, -2]}>
      <mesh ref={earth}>
        <sphereGeometry args={[6, 96, 96]} />
        <meshStandardMaterial
          map={day}
          emissiveMap={lights}
          emissive="#ffbb66"
          emissiveIntensity={1.2}
          roughness={1}
        />
      </mesh>
      <mesh scale={1.12}>
        <sphereGeometry args={[6, 96, 96]} />
        <shaderMaterial
          uniforms={uniforms}
          side={BackSide}
          blending={AdditiveBlending}
          transparent
          depthWrite={false}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`}
          fragmentShader={`
            uniform vec3 glowColor;
            varying vec3 vNormal;
            void main() {
              float i = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
              gl_FragColor = vec4(glowColor, 1.0) * clamp(i, 0.0, 1.0) * 1.5;
            }`}
        />
      </mesh>
    </group>
  );
}

function Rig() {
  useFrame((state) => {
    state.camera.position.x += (state.pointer.x * 0.5 - state.camera.position.x) * 0.03;
    state.camera.position.y += (state.pointer.y * 0.3 - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function SpaceHero() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 1.5]}>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[-5, 4, 6]} intensity={2.5} />
      <Stars radius={60} depth={40} count={3000} factor={3} fade speed={0.5} />
      <Suspense fallback={null}>
        <Earth />
        {WORD.split('').map((char, index) => (
          <Letter
            key={`${char}-${index}`}
            char={char}
            x={(index - (WORD.length - 1) / 2) * 1.25}
            delay={index * 0.15}
          />
        ))}
      </Suspense>
      <Rig />
    </Canvas>
  );
}
