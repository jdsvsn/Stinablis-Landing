"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticleBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Particles
    const count = 1500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i]     = (Math.random() - 0.5) * 20; // X: -10 to 10
      positions[i + 1] = (Math.random() - 0.5) * 20; // Y: -10 to 10
      positions[i + 2] = (Math.random() - 0.5) * 10; // Z: -5 to 5
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
      blending: THREE.AdditiveBlending,
      opacity: 0.6,
      transparent: true,
    });

    const points = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(points);

    // Grid
    const grid = new THREE.GridHelper(40, 40, 0x4444ff, 0x222222);
    grid.rotation.x = Math.PI / 2;
    const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
    gridMaterials.forEach((m) => {
      m.transparent = true;
      m.opacity = 0.05;
    });
    scene.add(grid);

    // Mouse tracking
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    // Scroll tracking
    const onScroll = () => {
      camera.position.y = window.scrollY * -0.002;
    };

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);

    // Animation loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Lerp mouse
      const smoothing = 0.05;
      currentX += (targetX - currentX) * smoothing;
      currentY += (targetY - currentY) * smoothing;

      points.rotation.y = currentX * 0.3;
      points.rotation.x = currentY * 0.3;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-[-1]"
      style={{
        mixBlendMode: "screen",
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}