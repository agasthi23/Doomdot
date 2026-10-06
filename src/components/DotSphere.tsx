import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, Color } from 'three';
import type { Group, ShaderMaterial } from 'three';

const LIME = '#B8E351';
const COUNT = 4000;
const RADIUS = 2.1;
const SHELL_OPACITY = 0.55;

function Shell() {
  const group = useRef<Group>(null);
  const material = useRef<ShaderMaterial>(null);

  const positions = useMemo(() => {
    const result = new Float32Array(COUNT * 3);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let index = 0; index < COUNT; index += 1) {
      const y = 1 - (index / (COUNT - 1)) * 2;
      const ringRadius = Math.sqrt(1 - y * y);
      const angle = goldenAngle * index;

      result[index * 3] = Math.cos(angle) * ringRadius * RADIUS;
      result[index * 3 + 1] = y * RADIUS;
      result[index * 3 + 2] = Math.sin(angle) * ringRadius * RADIUS;
    }

    return result;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 38 },
      uAlpha: { value: SHELL_OPACITY },
      uColor: { value: new Color(LIME) },
    }),
    [],
  );

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x = 0.35;
    }

    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          vertexShader={`
            uniform float uTime;
            uniform float uSize;
            varying float vWave;
            void main() {
              vec3 p = position;
              float wave = sin(p.y * 3.0 - uTime * 1.5);
              vWave = 0.5 + 0.5 * wave;
              p *= 1.0 + 0.05 * wave;
              vec4 mv = modelViewMatrix * vec4(p, 1.0);
              gl_PointSize = uSize * (0.6 + 0.8 * vWave) / -mv.z;
              gl_Position = projectionMatrix * mv;
            }`}
          fragmentShader={`
            uniform vec3 uColor;
            uniform float uAlpha;
            varying float vWave;
            void main() {
              float d = length(gl_PointCoord - 0.5);
              if (d > 0.5) discard;
              float a = 1.0 - smoothstep(0.0, 0.5, d);
              gl_FragColor = vec4(uColor, a * (0.3 + 0.7 * vWave) * uAlpha);
            }`}
        />
      </points>
    </group>
  );
}

function Rig() {
  useFrame((state) => {
    state.camera.position.x += (state.pointer.x * 0.6 - state.camera.position.x) * 0.03;
    state.camera.position.y += (state.pointer.y * 0.4 - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function DotSphere({ className = '' }: { className?: string }) {
  return (
    <div className={`relative h-full w-full select-none bg-transparent ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        className="!bg-transparent"
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} />
        <pointLight position={[-4, 0, 2]} intensity={30} color={LIME} />
        <Shell />
        <Rig />
      </Canvas>
    </div>
  );
}
