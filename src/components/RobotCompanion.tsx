import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { MathUtils } from 'three';
import type { Group, PerspectiveCamera } from 'three';
import Robot from './Robot.tsx';

const LIME = '#B8E351';
const MIN_WIDTH = 768;
const REACH = 0.35;
const FOLLOW = 7;
const POP = 0.8;
const WAVE = 1.6;
const FLY = 1.4;

type Mouse = { x: number; y: number };
export type Stage = 'hidden' | 'intro' | 'free';

export function RobotAnchor({
  x = '85%',
  y = '50%',
  scale = 0.5,
}: {
  x?: string;
  y?: string;
  scale?: number;
}) {
  return (
    <div
      aria-hidden="true"
      data-robot-anchor
      data-robot-scale={scale}
      style={{
        position: 'absolute',
        left: x,
        top: y,
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
  wave,
  stage,
  onLanded,
}: {
  mouse: RefObject<Mouse>;
  wave: RefObject<number>;
  stage: Stage;
  onLanded?: () => void;
}) {
  const group = useRef<Group>(null);
  const current = useRef({ x: 0, y: 0, scale: 1, ready: false });
  const introStart = useRef<number | null>(null);
  const landed = useRef(false);

  useFrame((state, delta) => {
    const robot = group.current;
    if (!robot) return;

    if (stage === 'hidden') {
      robot.visible = false;
      wave.current = 0;
      return;
    }

    const anchors = Array.from(document.querySelectorAll<HTMLElement>('[data-robot-anchor]'));
    if (anchors.length === 0) {
      robot.visible = false;
      return;
    }
    robot.visible = true;

    const viewportWidth = state.size.width;
    const viewportHeight = state.size.height;
    let weightSum = 0;
    let pixelX = 0;
    let pixelY = 0;
    let targetScale = 0;

    for (const anchor of anchors) {
      const bounds = anchor.getBoundingClientRect();
      const anchorX = bounds.left + bounds.width / 2;
      const anchorY = bounds.top + bounds.height / 2;
      const scale = Number.parseFloat(anchor.dataset.robotScale ?? '1') || 1;
      const distance = Math.abs(anchorY - viewportHeight / 2) / (viewportHeight * REACH);
      const weight = 1 / (1 + Math.pow(distance, 4));

      weightSum += weight;
      pixelX += anchorX * weight;
      pixelY += anchorY * weight;
      targetScale += scale * weight;
    }

    pixelX /= weightSum;
    pixelY /= weightSum;
    targetScale /= weightSum;

    const camera = state.camera as PerspectiveCamera;
    const unitsPerPixel =
      (2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.position.z) / viewportHeight;
    const targetX = (pixelX - viewportWidth / 2) * unitsPerPixel;
    const targetY = -(pixelY - viewportHeight / 2) * unitsPerPixel;
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
        wave.current = 0;
      } else if (elapsed < POP + WAVE) {
        wave.current = Math.min(1, (elapsed - POP) / 0.25);
        y = startY + Math.sin((elapsed - POP) * 3) * 0.06;
      } else if (elapsed < POP + WAVE + FLY) {
        const progress = (elapsed - POP - WAVE) / FLY;
        const easedProgress = progress * progress * (3 - 2 * progress);
        wave.current = Math.max(0, 1 - progress * 4);
        x = MathUtils.lerp(0, targetX, easedProgress);
        y =
          MathUtils.lerp(startY, targetY, easedProgress) +
          Math.sin(Math.PI * progress) * 1.2;
        scale = MathUtils.lerp(startScale, targetScale, easedProgress);
        lean = -Math.sin(Math.PI * progress) * 0.35;
      } else {
        landed.current = true;
        wave.current = 0;
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

    const smoothing = 1 - Math.exp(-delta * FOLLOW);
    const deltaX = targetX - position.x;
    const deltaY = targetY - position.y;
    position.x += deltaX * smoothing;
    position.y += deltaY * smoothing;
    position.scale += (targetScale - position.scale) * smoothing;

    const stretch = 1 + MathUtils.clamp(Math.abs(deltaY) * 0.05, 0, 0.18);
    robot.position.set(position.x, position.y, 0);
    robot.scale.set(
      position.scale / Math.sqrt(stretch),
      position.scale * stretch,
      position.scale,
    );
    robot.rotation.z = MathUtils.lerp(
      robot.rotation.z,
      MathUtils.clamp(-deltaX * 0.25, -0.5, 0.5),
      0.1,
    );
  });

  return (
    <group ref={group}>
      <Robot mouse={mouse} wave={wave} />
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
  const wave = useRef(0);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
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
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: stage === 'free' ? 10 : 101,
        pointerEvents: 'none',
      }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <pointLight position={[-4, 0, 2]} intensity={30} color={LIME} />
      <Mover mouse={mouse} wave={wave} stage={stage} onLanded={onLanded} />
    </Canvas>
  );
}
