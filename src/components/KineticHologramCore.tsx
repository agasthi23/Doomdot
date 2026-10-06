import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface KineticHologramCoreProps {
  className?: string;
  interactive?: boolean;
}

export const KineticHologramCore: React.FC<KineticHologramCoreProps> = ({
  className = '',
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 380;
    let height = container.clientHeight || 380;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Group holding the entire rotating system
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Inner Glowing Wireframe Polyhedron (Video 1 & 2)
    const innerGeo = new THREE.IcosahedronGeometry(1.25, 2);
    const innerWireMat = new THREE.MeshBasicMaterial({
      color: 0xb8e351,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerWireMat);
    coreGroup.add(innerMesh);

    // 2. Vertex Glowing Points on the Polyhedron
    const vertexPointsGeo = new THREE.IcosahedronGeometry(1.25, 2);
    const pointMat = new THREE.PointsMaterial({
      color: 0xb8e351,
      size: 0.065,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const vertexPoints = new THREE.Points(vertexPointsGeo, pointMat);
    coreGroup.add(vertexPoints);

    // 3. Central Energy Sphere
    const coreBallGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const coreBallMat = new THREE.MeshBasicMaterial({
      color: 0x122409,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const coreBall = new THREE.Mesh(coreBallGeo, coreBallMat);
    coreGroup.add(coreBall);

    // 4. Concentric Orbital Rings (Multi-axis rotation like Video 1 & 2)
    const createRing = (radius: number, color: number, tiltX: number, tiltY: number, dashed: boolean = false) => {
      const ringGeo = new THREE.RingGeometry(radius, radius + 0.02, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      return ring;
    };

    const ring1 = createRing(1.7, 0xb8e351, Math.PI / 3, 0.2);
    const ring2 = createRing(2.0, 0x23430c, -Math.PI / 4, 0.5);
    const ring3 = createRing(2.25, 0xb8e351, Math.PI / 6, -0.4);
    coreGroup.add(ring1);
    coreGroup.add(ring2);
    coreGroup.add(ring3);

    // 5. Orbiting Kinetic Shards / Polyhedra (like in Video 2)
    const shardsGroup = new THREE.Group();
    coreGroup.add(shardsGroup);
    const shardGeos = [
      new THREE.TetrahedronGeometry(0.12),
      new THREE.OctahedronGeometry(0.14),
      new THREE.IcosahedronGeometry(0.1),
    ];
    const shardMat = new THREE.MeshBasicMaterial({
      color: 0xb8e351,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });

    const shards: THREE.Mesh[] = [];
    const shardCount = 14;
    for (let i = 0; i < shardCount; i++) {
      const geo = shardGeos[i % shardGeos.length];
      const shard = new THREE.Mesh(geo, shardMat);
      const dist = 1.9 + Math.random() * 0.7;
      const angle = (i / shardCount) * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * 1.5;
      shard.position.set(Math.cos(angle) * dist, elevation, Math.sin(angle) * dist);
      shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      shards.push(shard);
      shardsGroup.add(shard);
    }

    // 6. Ambient Particle Cloud Dust
    const dustCount = 120;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = 1.4 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      dustPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dustPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dustPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xb8e351,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    coreGroup.add(dustParticles);

    // Interactive Drag & Momentum Tracking (like in Video 2!)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velocityX = 0.005;
    let velocityY = 0.003;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) {
        // Subtle mouse hovering parallax
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotationY = normX * 0.4;
        targetRotationX = normY * 0.4;
        return;
      }
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      velocityX = deltaX * 0.008;
      velocityY = deltaY * 0.008;
      coreGroup.rotation.y += velocityX;
      coreGroup.rotation.x += velocityY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      velocityX = deltaX * 0.008;
      velocityY = deltaY * 0.008;
      coreGroup.rotation.y += velocityX;
      coreGroup.rotation.x += velocityY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    if (interactive) {
      container.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      container.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd);
    }

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Inertia / continuous spin
      if (!isDragging) {
        velocityX *= 0.95;
        velocityY *= 0.95;
        coreGroup.rotation.y += 0.006 + velocityX;
        coreGroup.rotation.x += 0.003 + velocityY;

        // Subtle return towards target tilt
        coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.02;
      }

      // Counter-rotate rings for multi-dimensional gyroscope effect
      ring1.rotation.z += 0.012;
      ring2.rotation.z -= 0.008;
      ring3.rotation.z += 0.015;

      // Pulse inner core scale
      const pulse = 1 + Math.sin(elapsed * 2.2) * 0.035;
      innerMesh.scale.set(pulse, pulse, pulse);
      vertexPoints.scale.set(pulse, pulse, pulse);

      // Rotate shards around center
      shardsGroup.rotation.y -= 0.004;
      shards.forEach((s, idx) => {
        s.rotation.x += 0.015 * (idx % 2 === 0 ? 1 : -1);
        s.rotation.y += 0.02;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 380;
      height = container.clientHeight || 380;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        container.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive]);

  return (
    <div
      ref={mountRef}
      className={`relative cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Click and drag to rotate kinetic 3D hologram core"
    />
  );
};
