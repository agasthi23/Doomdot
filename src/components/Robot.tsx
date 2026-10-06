import { Float, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { RefObject } from 'react';
import { AdditiveBlending, MathUtils } from 'three';
import type { Group, Mesh } from 'three';

const LIME = '#B8E351';

type Mouse = { x: number; y: number };

export default function Robot({
  mouse,
  wave,
}: {
  mouse: RefObject<Mouse>;
  wave?: RefObject<number>;
}) {
  const head = useRef<Group>(null);
  const eyeLeft = useRef<Mesh>(null);
  const eyeRight = useRef<Mesh>(null);
  const armLeft = useRef<Group>(null);
  const armRight = useRef<Group>(null);
  const glow = useRef<Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const pointer = mouse.current;

    if (head.current) {
      head.current.rotation.y = MathUtils.lerp(head.current.rotation.y, pointer.x * 0.5, 0.08);
      head.current.rotation.x = MathUtils.lerp(head.current.rotation.x, -pointer.y * 0.3, 0.08);
    }

    const blink = time % 4 > 3.88 ? 0.1 : 1;
    eyeLeft.current?.scale.set(1, 1.4 * blink, 0.6);
    eyeRight.current?.scale.set(1, 1.4 * blink, 0.6);

    if (armLeft.current) armLeft.current.rotation.z = 0.35 + Math.sin(time * 2) * 0.12;
    if (armRight.current) {
      const waveAmount = wave?.current ?? 0;
      armRight.current.rotation.z = MathUtils.lerp(
        -0.35 - Math.sin(time * 2 + 1) * 0.12,
        2.4 + Math.sin(time * 11) * 0.35,
        waveAmount,
      );
    }
    if (glow.current) glow.current.scale.setScalar(1 + Math.sin(time * 2.5) * 0.08);
  });

  const white = { color: '#e9efe6', roughness: 0.25, metalness: 0.1 } as const;

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.5}>
      <group scale={1.3} position={[0, 0.1, 0]}>
        <group ref={head} position={[0, 0.5, 0]}>
          <RoundedBox args={[1, 0.8, 0.85]} radius={0.28} smoothness={4}>
            <meshStandardMaterial {...white} />
          </RoundedBox>
          <RoundedBox
            args={[0.8, 0.5, 0.1]}
            radius={0.18}
            smoothness={4}
            position={[0, 0.02, 0.42]}
          >
            <meshStandardMaterial color="#050805" roughness={0.1} metalness={0.6} />
          </RoundedBox>
          <mesh ref={eyeLeft} position={[-0.2, 0.04, 0.49]}>
            <sphereGeometry args={[0.09, 24, 24]} />
            <meshBasicMaterial color={LIME} toneMapped={false} />
          </mesh>
          <mesh ref={eyeRight} position={[0.2, 0.04, 0.49]}>
            <sphereGeometry args={[0.09, 24, 24]} />
            <meshBasicMaterial color={LIME} toneMapped={false} />
          </mesh>
          {[-0.55, 0.55].map((x) => (
            <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.12, 0.12, 0.14, 24]} />
              <meshStandardMaterial color={LIME} emissive={LIME} emissiveIntensity={1.2} />
            </mesh>
          ))}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.25, 12]} />
            <meshStandardMaterial {...white} />
          </mesh>
          <mesh position={[0, 0.67, 0]}>
            <sphereGeometry args={[0.07, 24, 24]} />
            <meshBasicMaterial color={LIME} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.67, 0]}>
            <sphereGeometry args={[0.16, 24, 24]} />
            <meshBasicMaterial
              color={LIME}
              transparent
              opacity={0.2}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>

        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.28, 0.35, 8, 16]} />
          <meshStandardMaterial {...white} />
        </mesh>
        <mesh position={[0, -0.2, 0.27]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color={LIME} toneMapped={false} />
        </mesh>
        <group ref={armLeft} position={[-0.38, -0.12, 0]}>
          <mesh position={[0, -0.15, 0]}>
            <capsuleGeometry args={[0.08, 0.22, 6, 12]} />
            <meshStandardMaterial {...white} />
          </mesh>
        </group>
        <group ref={armRight} position={[0.38, -0.12, 0]}>
          <mesh position={[0, -0.15, 0]}>
            <capsuleGeometry args={[0.08, 0.22, 6, 12]} />
            <meshStandardMaterial {...white} />
          </mesh>
        </group>
        <mesh ref={glow} position={[0, -0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.4, 32]} />
          <meshBasicMaterial
            color={LIME}
            transparent
            opacity={0.3}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </Float>
  );
}
