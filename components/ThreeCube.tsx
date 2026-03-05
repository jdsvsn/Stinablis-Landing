"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCube() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Cube geometry
    const geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4);

    // Edges
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);

    // Glow cube
    const glowEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.45, 1.45, 1.45));
    const glowMaterial = new THREE.LineBasicMaterial({
      color: 0x9966ff,
      transparent: true,
      opacity: 0.25,
    });
    const glowWireframe = new THREE.LineSegments(glowEdges, glowMaterial);

    // Outer glow
    const outerEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.52, 1.52, 1.52));
    const outerMaterial = new THREE.LineBasicMaterial({
      color: 0x6644cc,
      transparent: true,
      opacity: 0.15,
    });
    const outerWireframe = new THREE.LineSegments(outerEdges, outerMaterial);

    const group = new THREE.Group();
    group.add(wireframe);
    group.add(glowWireframe);
    group.add(outerWireframe);
    scene.add(group);

    // Scroll tracking
let targetScroll = window.scrollY;
let currentScroll = window.scrollY;
const onScroll = () => { targetScroll = window.scrollY; };
window.addEventListener("scroll", onScroll);

    // Resize handler
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Animation
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      // Smooth scroll interpolation
currentScroll += (targetScroll - currentScroll) * 0.05;

const scrollProgress = currentScroll / (document.body.scrollHeight - window.innerHeight || 1);
group.rotation.x = scrollProgress * Math.PI * 4;
group.rotation.y = scrollProgress * Math.PI * 6;
group.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      edges.dispose();
      lineMaterial.dispose();
      glowEdges.dispose();
      glowMaterial.dispose();
      outerEdges.dispose();
      outerMaterial.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}