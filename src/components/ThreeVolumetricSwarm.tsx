import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeVolumetricSwarm: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050607, 0.0018);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 3000);
    camera.position.z = 900;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Particle Swarm Geometry (Automotive / Kinetic Vortex style matching Image 2)
    const particleCount = 4200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    const limeColor = new THREE.Color(0xb8e351);
    const darkGreenColor = new THREE.Color(0x23430c);
    const whiteColor = new THREE.Color(0xffffff);
    const brightTealColor = new THREE.Color(0x6ee7b7);

    for (let i = 0; i < particleCount; i++) {
      // Create a swirling vortex / galaxy disk distribution with depth
      const radius = 80 + Math.pow(Math.random(), 1.6) * 750;
      const angle = Math.random() * Math.PI * 2;
      const armOffset = (i % 3) * ((Math.PI * 2) / 3);
      const spiral = angle + (radius / 180) * 1.2 + armOffset;

      const x = Math.cos(spiral) * radius + (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 420 * Math.exp(-radius / 800);
      const z = Math.sin(spiral) * radius * 0.9 + (Math.random() - 0.5) * 120;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      speeds[i] = 0.002 + (1 / (radius + 100)) * 1.8;

      // Color distribution: dense glowing cyber lime, white highlights, deep forest matrix
      const rand = Math.random();
      let c = limeColor;
      if (rand < 0.25) c = whiteColor;
      else if (rand < 0.45) c = brightTealColor;
      else if (rand < 0.75) c = limeColor;
      else c = darkGreenColor;

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Shader / Circular blurred texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.3, 'rgba(184,227,81,0.8)');
      gradient.addColorStop(0.7, 'rgba(35,67,12,0.2)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 6.5,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // Inner glowing ring
    const ringGeo = new THREE.TorusGeometry(320, 1.2, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xb8e351,
      transparent: true,
      opacity: 0.2,
      wireframe: true,
    });
    const torus = new THREE.Mesh(ringGeo, ringMat);
    torus.rotation.x = Math.PI / 3;
    scene.add(torus);

    // Mouse & Scroll Parallax State
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (e.clientX - halfW) * 0.7;
      mouseY = (e.clientY - halfH) * 0.7;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth camera interpolation with mouse & scroll
      targetCameraX = mouseX * 0.75;
      targetCameraY = -mouseY * 0.75 + (scrollY * 0.15);

      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.position.z = 900 - Math.min(300, scrollY * 0.35); // 3D flight forward on scroll!
      camera.lookAt(0, 0, 0);

      // Rotate particle vortex
      particleSystem.rotation.y = time * 0.09;
      particleSystem.rotation.x = Math.sin(time * 0.04) * 0.12;

      torus.rotation.z = time * 0.05;
      torus.rotation.y = time * 0.03;

      // Pulsate subtle particle positions
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // subtle breathing ripple along y
        posArray[i3 + 1] = originalPositions[i3 + 1] + Math.sin(time * 2 + originalPositions[i3] * 0.01) * 8;
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`pointer-events-none absolute inset-0 w-full h-full z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};
