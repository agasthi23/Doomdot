import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { MathUtils } from 'three';
import type { Group } from 'three';
import { COLORS } from '../theme';
import Robot, { type Brain } from './Robot.tsx';

const LIME = COLORS.primary;
const MIN_WIDTH = 768;
const FOLLOW = 7;
const POP = 0.8;
const WAVE = 1.6;
const FLY = 1.4;

type Mouse = { x: number; y: number };
type RobotTarget = { x: number; y: number; scale: number; visible: boolean };
export type Stage = 'hidden' | 'intro' | 'free';

export function RobotAnchor({
  x = '85%',
  y = '50%',
  scale = 0.5,
  perch,
}: {
  x?: string;
  y?: string;
  scale?: number;
  perch?: [number, number];
}) {
  return (
    <div
      aria-hidden="true"
      data-robot-anchor
      data-robot-scale={scale}
      data-robot-perch={perch ? perch.join(',') : undefined}
      style={{
        position: 'absolute',
        left: perch ? `${perch[0] * 100}%` : x,
        top: perch ? `${perch[1] * 100}%` : y,
        width: 1,
        height: 1,
        pointerEvents: 'none',
      }}
    />
  );
}

const easeOutBack = (value: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(value - 1, 3) + c1 * Math.pow(value - 1, 2);
};

function Mover({
  mouse,
  brain,
  stage,
  onLanded,
}: {
  mouse: RefObject<Mouse>;
  brain: RefObject<Brain>;
  stage: Stage;
  onLanded?: () => void;
}) {
  const group = useRef<Group>(null);
  const current = useRef({ x: 0, y: 0, scale: 1, ready: false });
  const target = useRef<RobotTarget>({ x: 0, y: 0, scale: 1, visible: false });
  const prevTarget = useRef({ x: 0, y: 0, scale: 1 });
  const introStart = useRef<number | null>(null);
  const landed = useRef(false);

  useEffect(() => {
    const updateTarget = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const perches = Array.from(document.querySelectorAll<HTMLElement>('[data-robot-anchor]'))
        .map((anchor) => {
          const byPerch = anchor.dataset.robotPerch;
          const bounds = anchor.getBoundingClientRect();
          const inView =
            bounds.left < viewportWidth + 120 &&
            bounds.right > -120 &&
            bounds.top < viewportHeight + 120 &&
            bounds.bottom > -120;

          if (!inView) return null;

          const cx = bounds.left + bounds.width / 2;
          const cy = bounds.top + bounds.height / 2;
          const scale = Number.parseFloat(anchor.dataset.robotScale ?? '1') || 1;

          const perch = byPerch
            ? byPerch.split(',').map((value) => Number.parseFloat(value))
            : null;

          return {
            x: perch ? viewportWidth * perch[0] : cx,
            y: perch ? viewportHeight * perch[1] : cy,
            scale,
          };
        })
        .filter((anchor): anchor is { x: number; y: number; scale: number } => !!anchor);

      let next = {
        x: viewportWidth * 0.8,
        y: viewportHeight * 0.4,
        scale: 0.6,
      };

      if (perches.length > 0) {
        const closest = perches.reduce((best, anchor) => {
          const bestDistance = Math.hypot(best.x - viewportWidth / 2, best.y - viewportHeight / 2);
          const anchorDistance = Math.hypot(anchor.x - viewportWidth / 2, anchor.y - viewportHeight / 2);
          return anchorDistance < bestDistance ? anchor : best;
        }, perches[0]);

        next = closest;
      }

      const unitsPerPixel =
        (2 * Math.tan(MathUtils.degToRad(45 / 2)) * 8) / viewportHeight;
      const clampedX = Math.min(Math.max(next.x, viewportWidth * 0.18), viewportWidth * 0.82);
      const clampedY = Math.min(Math.max(next.y, viewportHeight * 0.18), viewportHeight * 0.82);

      const nextX = (clampedX - viewportWidth / 2) * unitsPerPixel;
      const nextY = -(clampedY - viewportHeight / 2) * unitsPerPixel;
      const nextScale = next.scale;

      const moved = Math.hypot(nextX - prevTarget.current.x, nextY - prevTarget.current.y) > 0.25;
      if (moved) {
        brain.current.cue = 'hop';
      }
      prevTarget.current = { x: nextX, y: nextY, scale: nextScale };

      target.current.x = nextX;
      target.current.y = nextY;
      target.current.scale = nextScale;
      target.current.visible = true;
    };

    updateTarget();
    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget);
    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
    };
  }, [brain]);

  useFrame((state, delta) => {
    const robot = group.current;
    if (!robot) return;

    if (stage === 'hidden') {
      robot.visible = false;
      brain.current.wave = 0;
      brain.current.moving = 0;
      return;
    }

    const destination = target.current;
    if (!destination.visible) {
      robot.visible = false;
      return;
    }
    robot.visible = true;

    const targetX = destination.x;
    const targetY = destination.y;
    const targetScale = destination.scale;
    const position = current.current;

    if (stage === 'intro' && !landed.current) {
      if (introStart.current === null) introStart.current = state.clock.elapsedTime;
      const elapsed = state.clock.elapsedTime - introStart.current;
      const startY = 0.2;
      const startScale = 1.15;

      let x = 0;
      let y = startY;
      let scale = startScale;
      let lean = 0;

      if (elapsed < POP) {
        scale = startScale * Math.max(0, easeOutBack(elapsed / POP));
        brain.current.wave = 0;
      } else if (elapsed < POP + WAVE) {
        brain.current.wave = Math.min(1, (elapsed - POP) / 0.25);
        y = startY + Math.sin((elapsed - POP) * 3) * 0.06;
      } else if (elapsed < POP + WAVE + FLY) {
        const progress = (elapsed - POP - WAVE) / FLY;
        const easedProgress = progress * progress * (3 - 2 * progress);
        brain.current.wave = Math.max(0, 1 - progress * 4);
        x = MathUtils.lerp(0, targetX, easedProgress);
        y = MathUtils.lerp(startY, targetY, easedProgress) + Math.sin(Math.PI * progress) * 1.2;
        scale = MathUtils.lerp(startScale, targetScale, easedProgress);
        lean = -Math.sin(Math.PI * progress) * 0.35;
      } else {
        landed.current = true;
        brain.current.wave = 0;
        x = targetX;
        y = targetY;
        scale = targetScale;
        onLanded?.();
      }

      position.x = x;
      position.y = y;
      position.scale = scale;
      position.ready = true;
      robot.position.set(x, y, 0);
      robot.scale.setScalar(scale);
      robot.rotation.z = MathUtils.lerp(robot.rotation.z, lean, 0.2);
      return;
    }

    if (!position.ready) {
      position.x = targetX;
      position.y = targetY;
      position.scale = targetScale;
      position.ready = true;
    }

    const movement = Math.hypot(targetX - position.x, targetY - position.y);
    const smoothing = 1 - Math.exp(-delta * FOLLOW);
    const deltaX = targetX - position.x;
    const deltaY = targetY - position.y;
    position.x += deltaX * smoothing;
    position.y += deltaY * smoothing;
    position.scale += (targetScale - position.scale) * smoothing;

    const cycle = state.clock.elapsedTime % 12;
    const waveIn = MathUtils.smoothstep(cycle, 6.2, 6.6);
    const waveOut = 1 - MathUtils.smoothstep(cycle, 8, 8.4);
    brain.current.wave = waveIn * waveOut;
    brain.current.moving = Math.min(1, movement / 1.25);
    const jump = Math.sin(Math.PI * MathUtils.smoothstep(cycle, 3.7, 4.5)) * 0.3;
    const stretch = 1 + MathUtils.clamp(Math.abs(deltaY) * 0.05, 0, 0.18);
    robot.position.set(position.x, position.y + jump, 0);
    robot.scale.set(
      position.scale / Math.sqrt(stretch),
      position.scale * stretch,
      position.scale,
    );
    robot.rotation.z = MathUtils.lerp(
      robot.rotation.z,
      MathUtils.clamp(-deltaX * 0.25, -0.5, 0.5),
      smoothing,
    );
  });

  return (
    <group ref={group}>
      <Robot mouse={mouse} brain={brain} />
    </group>
  );
}

export default function RobotCompanion({
  stage = 'free',
  onLanded,
}: {
  stage?: Stage;
  onLanded?: () => void;
}) {
  const mouse = useRef<Mouse>({ x: 0, y: 0 });
  const brain = useRef<Brain>({ wave: 0, cue: 'hi', moving: 0 });
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      mouse.current.x = (event.clientX - centerX) / centerX;
      mouse.current.y = -((event.clientY - centerY) / centerY);
    };
    const handleResize = () => setWide(window.innerWidth >= MIN_WIDTH);

    handleResize();
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!wide) return null;

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 1]}
      frameloop="always"
      gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
      style={{
        willChange: 'transform, opacity',
        position: 'fixed',
        inset: 0,
        zIndex: stage === 'free' ? 50 : 101, // Raised z-index so it stays visible over team section cards
        pointerEvents: 'none',
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.0} />
      <pointLight position={[-4, 0, 2]} intensity={3} color={LIME} />
      <Mover mouse={mouse} brain={brain} stage={stage} onLanded={onLanded} />
    </Canvas>
  );
}