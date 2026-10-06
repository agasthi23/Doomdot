import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Activity, Cpu, RotateCcw, Maximize2 } from 'lucide-react';
import { sound } from '../utils/audio.ts';
import { DoomLogo } from './DoomLogo.tsx';

export const KineticCyberCore: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeMode, setActiveMode] = useState<'hologram' | 'stream' | 'logo'>('hologram');
  const [fps, setFps] = useState(60);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // 3D Canvas animation loop for Hologram mode
  useEffect(() => {
    if (activeMode !== 'hologram') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 280);

    let angleX = 0;
    let angleY = 0;
    let targetAngleX = 0;
    let targetAngleY = 0;
    let isHovered = false;

    // Generate 3D nodes for an interconnected sphere / icosahedron core
    const nodeCount = 36;
    const radius = Math.min(width, height) * 0.32;
    const nodes: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      nodes.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
      });
    }

    // Outer orbital rings particles
    const ringParticles: { angle: number; speed: number; r: number; yOffset: number }[] = [];
    for (let i = 0; i < 28; i++) {
      ringParticles.push({
        angle: (i / 28) * Math.PI * 2,
        speed: 0.015 + Math.random() * 0.01,
        r: radius * (1.3 + Math.random() * 0.25),
        yOffset: (Math.random() - 0.5) * 20,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - width / 2;
      const my = e.clientY - rect.top - height / 2;
      targetAngleY = (mx / width) * 2.2;
      targetAngleX = (-my / height) * 2.2;
      setCoords({ x: Math.round(mx), y: Math.round(my) });
    };

    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => {
      isHovered = false;
      targetAngleX = 0;
      targetAngleY = 0;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 400;
      height = canvas.height = canvas.parentElement?.clientHeight || 280;
    };
    window.addEventListener('resize', handleResize);

    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const render = (time: number) => {
      frameCount++;
      if (time - lastFpsUpdate > 600) {
        setFps(Math.round((frameCount * 1000) / (time - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = time;
      }

      ctx.clearRect(0, 0, width, height);

      // Continuous automatic rotation + mouse tilt damping
      const autoRotateSpeed = isHovered ? 0.008 : 0.016;
      angleY += (targetAngleY - angleY) * 0.06 + autoRotateSpeed;
      angleX += (targetAngleX - angleX) * 0.06;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Center of canvas
      const cx = width / 2;
      const cy = height / 2;

      // Project 3D nodes to 2D
      const projected = nodes.map((node) => {
        // Rotate around Y
        const x1 = node.x * cosY + node.z * sinY;
        const z1 = -node.x * sinY + node.z * cosY;
        // Rotate around X
        const y2 = node.y * cosX - z1 * sinX;
        const z2 = node.y * sinX + z1 * cosX;

        // Perspective factor
        const fov = 380;
        const scale = fov / (fov + z2);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2,
          scale,
        };
      });

      // Draw connecting glowing laser meshes
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius * 0.85) {
            const alpha = Math.max(0.08, 0.45 * (1 - dist / (radius * 0.85)));
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.strokeStyle = `rgba(184, 227, 81, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw orbiting planetary ring
      for (let i = 0; i < ringParticles.length; i++) {
        const rp = ringParticles[i];
        rp.angle += rp.speed;

        const rx = rp.r * Math.cos(rp.angle);
        const rz = rp.r * Math.sin(rp.angle);
        const ry = rp.yOffset + Math.sin(rp.angle * 2) * 12;

        const x1 = rx * cosY + rz * sinY;
        const z1 = -rx * sinY + rz * cosY;
        const y2 = ry * cosX - z1 * sinX;
        const z2 = ry * sinX + z1 * cosX;

        const fov = 380;
        const scale = fov / (fov + z2);
        const px = cx + x1 * scale;
        const py = cy + y2 * scale;

        ctx.beginPath();
        ctx.arc(px, py, 1.8 * scale, 0, Math.PI * 2);
        ctx.fillStyle = z2 > 0 ? '#B8E351' : '#65a30d';
        ctx.globalAlpha = z2 > 0 ? 0.9 : 0.4;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#B8E351';
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      // Draw nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        ctx.beginPath();
        const size = Math.max(1.5, 3.2 * p.scale);
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = p.z > 0 ? '#D2F874' : '#23430C';
        ctx.shadowBlur = p.z > 0 ? 10 : 0;
        ctx.shadowColor = '#B8E351';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Central glowing energy core
      const pulseSize = 14 + Math.sin(time * 0.004) * 4;
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, pulseSize * 2.5);
      grad.addColorStop(0, 'rgba(184, 227, 81, 0.7)');
      grad.addColorStop(0.5, 'rgba(35, 67, 12, 0.3)');
      grad.addColorStop(1, 'rgba(5, 6, 7, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, pulseSize * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeMode]);

  return (
    <div className="relative rounded-2xl border border-[#23430C] bg-[#070b04]/90 backdrop-blur-md p-4 shadow-2xl lime-glow overflow-hidden select-none">
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanlines opacity-25 pointer-events-none" />

      {/* Top HUD Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#23430C] text-xs font-mono relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B8E351] animate-pulse shadow-[0_0_8px_#B8E351]" />
          <span className="text-white font-bold tracking-wider text-[11px]">
            {activeMode === 'hologram' && 'KINETIC 3D GEOMETRIC CORE // GLSL'}
            {activeMode === 'stream' && 'LIVE RUNTIME PIPELINE // SUB-40MS'}
            {activeMode === 'logo' && 'DOOMDOT NEON LIQUID GLASS EMBLEM'}
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-black/80 rounded p-0.5 border border-[#23430C]">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveMode('hologram');
            }}
            className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
              activeMode === 'hologram'
                ? 'bg-[#1b2f0a] text-[#B8E351] font-bold border border-[#23430C]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            3D Core
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveMode('stream');
            }}
            className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
              activeMode === 'stream'
                ? 'bg-[#1b2f0a] text-[#B8E351] font-bold border border-[#23430C]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Stream
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveMode('logo');
            }}
            className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
              activeMode === 'logo'
                ? 'bg-[#1b2f0a] text-[#B8E351] font-bold border border-[#23430C]'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Logo
          </button>
        </div>
      </div>

      {/* Main Kinetic Visual Canvas Container */}
      <div className="relative aspect-video rounded-xl overflow-hidden border border-[#23430C] bg-gradient-to-b from-[#050804] to-black flex items-center justify-center">
        {/* Mode 1: 3D Kinetic Hologram Canvas */}
        {activeMode === 'hologram' && (
          <div className="relative w-full h-full cursor-grab active:cursor-grabbing">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Corner Crosshairs */}
            <div className="absolute top-2 left-2 text-[10px] font-mono text-[#B8E351] pointer-events-none opacity-80">
              [+0.842]
            </div>
            <div className="absolute top-2 right-2 text-[10px] font-mono text-zinc-400 pointer-events-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8E351]" />
              <span>{fps} FPS LOCKED</span>
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-zinc-400 pointer-events-none">
              VECTOR MESH: 36 NODES
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-[#B8E351] pointer-events-none">
              ROTATING · HOVER TO TILT
            </div>
          </div>
        )}

        {/* Mode 2: Live Code & Telemetry Stream */}
        {activeMode === 'stream' && (
          <div className="w-full h-full p-4 font-mono text-xs text-left overflow-hidden space-y-2 bg-[#040603]">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-[#23430C] pb-1">
              <span className="text-[#B8E351]">system_orchestration.ts</span>
              <span className="text-emerald-400">LATENCY: 18ms</span>
            </div>
            <div className="text-zinc-400 text-[11px] space-y-1">
              <div><span className="text-[#B8E351]">import</span> {'{'} ClusterMesh, WebGLPipeline {'}'} <span className="text-[#B8E351]">from</span> <span className="text-white">&apos;@doomdot/engine&apos;</span>;</div>
              <div><span className="text-white font-bold">const</span> node = <span className="text-[#B8E351]">new</span> ClusterMesh({'{'} workers: 8, targetFps: 60 {'}'});</div>
              <div className="text-[#B8E351]">await node.bindShaders([&apos;frag.glsl&apos;, &apos;vert.glsl&apos;]);</div>
              <div className="text-zinc-500">// 140k req/sec peak concurrent state mutations</div>
              <div className="text-white">node.streamTelemetry((packet) =&gt; {'{'}</div>
              <div className="pl-4 text-emerald-400">console.log(`[OK] $&#123;packet.id&#125; $&#123;packet.latency&#125;ms`);</div>
              <div className="text-white">{'}'});</div>
            </div>
            <div className="pt-1 text-[10px] text-zinc-500 border-t border-[#23430C]/60 flex justify-between">
              <span>MEMORY: 24.2 MB</span>
              <span className="text-[#B8E351]">BUILD: PASSING</span>
            </div>
          </div>
        )}

        {/* Mode 3: Official Glowing Liquid Glass Logo */}
        {activeMode === 'logo' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            <div className="transition-transform duration-300 hover:scale-105">
              <DoomLogo variant="badge" size="md" />
            </div>
            <span className="text-zinc-400 text-[11px] font-mono tracking-wider mt-2">
              Cyber Lime Liquid Glass Mark
            </span>
          </div>
        )}
      </div>

      {/* Bottom Telemetry Ticker / Live Speed Indicators */}
      <div className="mt-3 pt-3 border-t border-[#23430C] grid grid-cols-3 gap-2 text-left font-mono text-[11px]">
        <div className="bg-[#050804] p-2 rounded border border-[#23430C]">
          <span className="text-zinc-500 text-[9px] block uppercase">Runtime Ops</span>
          <span className="text-white font-bold tabular-nums">140k / sec</span>
        </div>
        <div className="bg-[#050804] p-2 rounded border border-[#23430C]">
          <span className="text-zinc-500 text-[9px] block uppercase">Frame Budget</span>
          <span className="text-[#B8E351] font-bold tabular-nums">16.6ms (60fps)</span>
        </div>
        <div className="bg-[#050804] p-2 rounded border border-[#23430C]">
          <span className="text-zinc-500 text-[9px] block uppercase">Squad State</span>
          <span className="text-emerald-400 font-bold">4/4 Active</span>
        </div>
      </div>
    </div>
  );
};
