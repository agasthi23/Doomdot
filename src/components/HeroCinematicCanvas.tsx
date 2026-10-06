import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroCinematicCanvasProps {
  introTrigger: number; // Increment to re-trigger the cinematic intro
  activeModeIndex: number;
}

export const HeroCinematicCanvas: React.FC<HeroCinematicCanvasProps> = ({
  introTrigger,
  activeModeIndex,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050607, 0.00085);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 4000);
    camera.position.z = 850;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 4. Main Stage Group
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // =========================================================================
    // A. WHOLE-PAGE LUMINOUS DUST & PARTICLE FIELD (1,600+ particles)
    // =========================================================================
    const dustCount = 1800;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustVelocities = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    const lime = new THREE.Color(0xb8e351);
    const forest = new THREE.Color(0x23430c);
    const teal = new THREE.Color(0x4ade80);
    const white = new THREE.Color(0xffffff);

    for (let i = 0; i < dustCount; i++) {
      // Spread across the entire hero width, height and depth
      dustPositions[i * 3] = (Math.random() - 0.5) * 2600;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 1600;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 1200;

      dustVelocities[i * 3] = (Math.random() - 0.5) * 0.4;
      dustVelocities[i * 3 + 1] = 0.2 + Math.random() * 0.5; // gentle upward drift
      dustVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      const pick = Math.random();
      const c = pick > 0.6 ? lime : pick > 0.3 ? forest : pick > 0.15 ? teal : white;
      dustColors[i * 3] = c.r;
      dustColors[i * 3 + 1] = c.g;
      dustColors[i * 3 + 2] = c.b;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 4.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const dustSystem = new THREE.Points(dustGeo, dustMat);
    stageGroup.add(dustSystem);

    // =========================================================================
    // B. CENTRAL 3D KINETIC ROTATING TECH SPHERE (As in the reference video!)
    // =========================================================================
    const sphereGroup = new THREE.Group();
    // Position slightly offset towards center-right for perfect balance with left text
    const isMobile = width < 768;
    sphereGroup.position.set(isMobile ? 0 : 260, isMobile ? -60 : 0, 0);
    stageGroup.add(sphereGroup);

    // B1. Dark Segmented Inner Core Ball (Metallic/textured feel)
    const innerBallGeo = new THREE.SphereGeometry(140, 36, 36);
    const innerBallMat = new THREE.MeshBasicMaterial({
      color: 0x050a03,
      wireframe: false,
    });
    const innerBall = new THREE.Mesh(innerBallGeo, innerBallMat);
    sphereGroup.add(innerBall);

    // B2. Outer Geodesic Wireframe Lattice (Like the futuristic sphere in video)
    const wireGeo = new THREE.IcosahedronGeometry(148, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xb8e351,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    sphereGroup.add(wireMesh);

    // B3. Glowing Vertex Energy Nodes on the Sphere
    const vertexGeo = new THREE.IcosahedronGeometry(148, 2);
    const vertexMat = new THREE.PointsMaterial({
      color: 0xb8e351,
      size: 7,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const vertexNodes = new THREE.Points(vertexGeo, vertexMat);
    sphereGroup.add(vertexNodes);

    // B4. Multi-Axis Concentric Orbital Rings (Kinetic Gyroscope)
    const createRing = (radius: number, color: number, tiltX: number, tiltY: number) => {
      const ringGeo = new THREE.RingGeometry(radius, radius + 2.5, 96);
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

    const ring1 = createRing(195, 0xb8e351, Math.PI / 3, 0.2);
    const ring2 = createRing(230, 0x23430c, -Math.PI / 4, 0.4);
    const ring3 = createRing(265, 0xb8e351, Math.PI / 6, -0.3);
    sphereGroup.add(ring1);
    sphereGroup.add(ring2);
    sphereGroup.add(ring3);

    // =========================================================================
    // C. 3D FLOATING KINETIC SHARDS & CRYSTALS (From video timestamps 00:08)
    // =========================================================================
    const shardsGroup = new THREE.Group();
    stageGroup.add(shardsGroup);

    const shardGeometries = [
      new THREE.TetrahedronGeometry(18),
      new THREE.OctahedronGeometry(22),
      new THREE.IcosahedronGeometry(16),
      new THREE.ConeGeometry(12, 28, 4),
    ];
    const shardWireMat = new THREE.MeshBasicMaterial({
      color: 0xb8e351,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const shardSolidMat = new THREE.MeshBasicMaterial({
      color: 0x091406,
      transparent: true,
      opacity: 0.75,
    });

    interface KineticShard {
      mesh: THREE.Group;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      orbitRadius: number;
      orbitSpeed: number;
      orbitAngle: number;
      baseY: number;
    }

    const kineticShards: KineticShard[] = [];
    const shardCount = 20;

    for (let i = 0; i < shardCount; i++) {
      const group = new THREE.Group();
      const geo = shardGeometries[i % shardGeometries.length];

      const solidMesh = new THREE.Mesh(geo, shardSolidMat);
      const wireMesh = new THREE.Mesh(geo, shardWireMat);
      group.add(solidMesh);
      group.add(wireMesh);

      // Distribute in a wide orbit around the centerpiece
      const orbitRadius = 320 + Math.random() * 500;
      const orbitAngle = (i / shardCount) * Math.PI * 2;
      const baseY = (Math.random() - 0.5) * 450;
      const z = (Math.random() - 0.5) * 350;

      const originX = sphereGroup.position.x + Math.cos(orbitAngle) * orbitRadius;
      const originY = sphereGroup.position.y + baseY;
      group.position.set(originX, originY, z);

      shardsGroup.add(group);

      kineticShards.push({
        mesh: group,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.03,
        rotSpeedZ: (Math.random() - 0.5) * 0.02,
        orbitRadius,
        orbitSpeed: 0.003 + Math.random() * 0.004,
        orbitAngle,
        baseY,
      });
    }

    // =========================================================================
    // D. INTERACTIVE MOUSE DRAG & ROTATIONAL MOMENTUM (Like in Video 2!)
    // =========================================================================
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velocityX = 0.01;
    let velocityY = 0.005;
    let mouseParallaxX = 0;
    let mouseParallaxY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseParallaxX = normX * 0.25;
      mouseParallaxY = normY * 0.25;

      if (!isDragging) return;

      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      velocityX = deltaX * 0.006;
      velocityY = deltaY * 0.006;
      sphereGroup.rotation.y += velocityX;
      sphereGroup.rotation.x += velocityY;
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
      velocityX = deltaX * 0.006;
      velocityY = deltaY * 0.006;
      sphereGroup.rotation.y += velocityX;
      sphereGroup.rotation.x += velocityY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // =========================================================================
    // E. CINEMATIC INTRO ANIMATION CONTROLLER (Opening News/Movie Segment)
    // =========================================================================
    let introStartTime = performance.now();
    const introDuration = 1800; // ms

    const triggerIntroAnimation = () => {
      introStartTime = performance.now();
      // Reset positions for cinematic swoop
      camera.position.z = 1400;
      sphereGroup.scale.set(0.01, 0.01, 0.01);
      sphereGroup.rotation.y = -Math.PI;
      velocityX = 0.08;
    };

    triggerIntroAnimation();

    // =========================================================================
    // F. MAIN RENDER & ANIMATION LOOP
    // =========================================================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const now = performance.now();

      // Intro interpolation curve (elastic cinematic ease-out)
      const introProgress = Math.min(1, (now - introStartTime) / introDuration);
      const easeOutBack = 1 + 2.4 * Math.pow(introProgress - 1, 3) + 1.4 * Math.pow(introProgress - 1, 2);
      const easedIntro = Math.min(1.05, Math.max(0, easeOutBack));

      // Swoop camera into position during intro
      if (introProgress < 1) {
        camera.position.z = 1400 - (1400 - 850) * Math.min(1, introProgress * 1.2);
        const scaleVal = Math.max(0.01, Math.min(1, easedIntro));
        sphereGroup.scale.set(scaleVal, scaleVal, scaleVal);
      } else {
        camera.position.z = 850;
        sphereGroup.scale.set(1, 1, 1);
      }

      // Parallax smooth interpolation
      stageGroup.rotation.y += (mouseParallaxX - stageGroup.rotation.y) * 0.035;
      stageGroup.rotation.x += (-mouseParallaxY - stageGroup.rotation.x) * 0.035;

      // 1. Continuous Rotation with Momentum Damping (Video 2 interaction)
      if (!isDragging) {
        velocityX *= 0.96;
        velocityY *= 0.96;
        sphereGroup.rotation.y += 0.007 + velocityX;
        sphereGroup.rotation.x += 0.003 + velocityY;
      }

      // 2. Gyroscope Rings Rotation
      ring1.rotation.z += 0.014;
      ring2.rotation.z -= 0.009;
      ring3.rotation.z += 0.018;

      // 3. Heartbeat Energy Pulse
      const pulse = 1 + Math.sin(elapsed * 2.4) * 0.025;
      wireMesh.scale.set(pulse, pulse, pulse);
      vertexNodes.scale.set(pulse, pulse, pulse);

      // 4. Update Luminous Whole-Page Dust Field
      const positions = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
        // Apply drift velocity
        positions[i * 3] += dustVelocities[i * 3];
        positions[i * 3 + 1] += dustVelocities[i * 3 + 1];
        positions[i * 3 + 2] += dustVelocities[i * 3 + 2];

        // Wrap around boundaries across the whole screen
        if (positions[i * 3 + 1] > 800) positions[i * 3 + 1] = -800;
        if (positions[i * 3] > 1300) positions[i * 3] = -1300;
        if (positions[i * 3] < -1300) positions[i * 3] = 1300;
        if (positions[i * 3 + 2] > 600) positions[i * 3 + 2] = -600;
        if (positions[i * 3 + 2] < -600) positions[i * 3 + 2] = 600;
      }
      dustGeo.attributes.position.needsUpdate = true;

      // 5. Update Orbiting Kinetic Shards
      kineticShards.forEach((s) => {
        s.orbitAngle += s.orbitSpeed;
        const targetX = sphereGroup.position.x + Math.cos(s.orbitAngle) * s.orbitRadius;
        const targetY = sphereGroup.position.y + s.baseY + Math.sin(elapsed + s.orbitAngle) * 25;
        const targetZ = Math.sin(s.orbitAngle) * (s.orbitRadius * 0.65);

        s.mesh.position.set(targetX, targetY, targetZ);
        s.mesh.rotation.x += s.rotSpeedX;
        s.mesh.rotation.y += s.rotSpeedY;
        s.mesh.rotation.z += s.rotSpeedZ;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      const mobile = width < 768;
      sphereGroup.position.set(mobile ? 0 : 260, mobile ? -60 : 0, 0);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [introTrigger, activeModeIndex]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing overflow-hidden z-0"
      title="Click and drag anywhere to rotate 3D kinetic cyber core"
    />
  );
};
