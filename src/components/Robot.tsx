import { Float, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { RefObject } from 'react';
import { AdditiveBlending, MathUtils } from 'three';
import type { Group, Mesh } from 'three';
import { COLORS } from '../theme';

const LIME = COLORS.primary;

type Mouse = { x: number; y: number };

export type Cue = 'hi' | 'hop' | 'spin' | 'nod' | 'look' | 'wiggle';
export type Brain = { wave: number; cue: Cue | null; moving: number };
export type MouseRef = RefObject<Mouse>;

const LENGTH: Record<Cue, number> = { hi: 1.9, hop: 0.9, spin: 1.3, nod: 1.1, look: 2.2, wiggle: 1.5 };
const IDLE: Cue[] = ['hi', 'hop', 'spin', 'nod', 'look', 'wiggle'];
const IDLE_EVERY = [5, 10];

const bell = (u: number) => Math.min(1, u * 6, (1 - u) * 6);
const smooth = (u: number) => u * u * (3 - 2 * u);

export default function Robot({ mouse, brain }: { mouse: MouseRef; brain: RefObject<Brain> }) {
  const rig = useRef<Group>(null);
  const head = useRef<Group>(null);
  const eyeL = useRef<Mesh>(null);
  const eyeR = useRef<Mesh>(null);
  const armL = useRef<Group>(null);
  const armR = useRef<Group>(null);
  const glow = useRef<Mesh>(null);

  const action = useRef<{ name: Cue; t0: number } | null>(null);
  const nextIdle = useRef(IDLE_EVERY[0]);
  const lastIdle = useRef<Cue | null>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const b = brain.current;
    const { x, y } = mouse.current;

    if (b.cue) {
      action.current = { name: b.cue, t0: t };
      b.cue = null;
    } else if (!action.current && t > nextIdle.current && b.moving < 0.1) {
      const pool = IDLE.filter((c) => c !== lastIdle.current);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      lastIdle.current = pick;
      action.current = { name: pick, t0: t };
    }

    let name: Cue | null = null;
    let u = 0;
    if (action.current) {
      u = (t - action.current.t0) / LENGTH[action.current.name];
      if (u >= 1) {
        action.current = null;
        nextIdle.current = t + IDLE_EVERY[0] + Math.random() * (IDLE_EVERY[1] - IDLE_EVERY[0]);
        u = 0;
      } else {
        name = action.current.name;
      }
    }

    let jump = 0;
    let squash = 1;
    let spin = 0;
    let tilt = 0;
    let nodX = 0;
    let lookY = 0;
    let raiseR = b.wave;
    let raiseL = 0;

    switch (name) {
      case 'hop':
        if (u < 0.2) {
          squash = 1 - 0.18 * Math.sin((u / 0.2) * Math.PI);
        } else if (u < 0.8) {
          const k = (u - 0.2) / 0.6;
          jump = 0.75 * Math.sin(k * Math.PI);
          squash = 1 + 0.1 * Math.sin(k * Math.PI);
          raiseL = raiseR = Math.sin(k * Math.PI);
        } else {
          squash = 1 - 0.18 * Math.sin(((u - 0.8) / 0.2) * Math.PI);
        }
        break;
      case 'spin':
        spin = Math.PI * 2 * smooth(u);
        jump = 0.25 * Math.sin(u * Math.PI);
        break;
      case 'hi':
        raiseR = Math.max(raiseR, bell(u));
        tilt = Math.sin(u * Math.PI) * 0.1;
        break;
      case 'nod':
        nodX = Math.sin(u * Math.PI * 4) * 0.28 * bell(u);
        break;
      case 'look':
        lookY = Math.sin(u * Math.PI * 2) * 0.7 * bell(u);
        break;
      case 'wiggle':
        tilt = Math.sin(u * Math.PI * 8) * 0.14 * bell(u);
        raiseL = raiseR = Math.max(raiseR, bell(u));
        break;
    }

    if (rig.current) {
      rig.current.position.y = 0.1 + jump;
      rig.current.rotation.y = spin;
      rig.current.rotation.z = tilt;
      const sxz = 1.3 / Math.sqrt(squash);
      rig.current.scale.set(sxz, 1.3 * squash, sxz);
    }
    if (head.current) {
      head.current.rotation.y = MathUtils.lerp(head.current.rotation.y, x * 0.5 + lookY, 0.1);
      head.current.rotation.x = MathUtils.lerp(head.current.rotation.x, -y * 0.3 + nodX, 0.15);
    }

    const blink = t % 4 > 3.88 ? 0.1 : 1;
    eyeL.current?.scale.set(1, 1.4 * blink, 0.6);
    eyeR.current?.scale.set(1, 1.4 * blink, 0.6);

    const flap = b.moving * Math.sin(t * 14) * 0.25;
    if (armL.current) {
      armL.current.rotation.z = MathUtils.lerp(0.35 + Math.sin(t * 2) * 0.12 + flap, -2.4 - Math.sin(t * 11) * 0.35, raiseL);
    }
    if (armR.current) {
      armR.current.rotation.z = MathUtils.lerp(-0.35 - Math.sin(t * 2 + 1) * 0.12 - flap, 2.4 + Math.sin(t * 11) * 0.35, raiseR);
    }
    if (glow.current) {
      glow.current.position.y = -0.82 - jump / 1.3;
      glow.current.scale.setScalar((1 + Math.sin(t * 2.5) * 0.08) * (1 - 0.35 * Math.min(1, jump / 0.75)));
    }
  });

  const white = { color: '#e9efe6', roughness: 0.25, metalness: 0.1 } as const;

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.5}>
      <group ref={rig} scale={1.3} position={[0, 0.1, 0]}>
        <group ref={head} position={[0, 0.5, 0]}>
          <RoundedBox args={[1, 0.8, 0.85]} radius={0.28} smoothness={4}>
            <meshStandardMaterial {...white} />
          </RoundedBox>
          <RoundedBox args={[0.8, 0.5, 0.1]} radius={0.18} smoothness={4} position={[0, 0.02, 0.42]}>
            <meshStandardMaterial color="#050805" roughness={0.1} metalness={0.6} />
          </RoundedBox>
          <mesh ref={eyeL} position={[-0.2, 0.04, 0.49]}>
            <sphereGeometry args={[0.09, 24, 24]} />
            <meshBasicMaterial color={LIME} toneMapped={false} />
          </mesh>
          <mesh ref={eyeR} position={[0.2, 0.04, 0.49]}>
            <sphereGeometry args={[0.09, 24, 24]} />
            <meshBasicMaterial color={LIME} toneMapped={false} />
          </mesh>
          {[-0.55, 0.55].map((ex) => (
            <mesh key={ex} position={[ex, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.12, 0.12, 0.14, 24]} />
              <meshStandardMaterial color={LIME} emissive={LIME} emissiveIntensity={1.2} />
            </mesh>
          ))}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.25, 12]} />
            <meshStandardMaterial {...white} />
          </mesh>
          <mesh position={[0, 0.67, 0]}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial color={LIME} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.67, 0]}>
            <sphereGeometry args={[0.16, 12, 12]} />
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
        <group ref={armL} position={[-0.38, -0.12, 0]}>
          <mesh position={[0, -0.15, 0]}>
            <capsuleGeometry args={[0.08, 0.22, 6, 12]} />
            <meshStandardMaterial {...white} />
          </mesh>
        </group>
        <group ref={armR} position={[0.38, -0.12, 0]}>
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