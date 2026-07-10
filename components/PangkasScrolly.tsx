/* eslint-disable react/no-unknown-property */
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function PangkasScrolly() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  const [activeSlide, setActiveSlide] = useState(0); // For handling text slide states
  const scrollProgress = useRef(0);
  const lerpProgress = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const trigger = triggerRef.current;
    const container = containerRef.current;
    if (!trigger || !container) return;

    // Create ScrollTrigger to track progress and pin the container (bypasses sticky CSS bugs)
    const st = ScrollTrigger.create({
      trigger: trigger,
      start: "top top",
      end: "bottom bottom",
      pin: container,
      pinSpacing: true,
      scrub: true,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
        
        // Map progress to active text slide (aligned with strict non-overlapping 3D process windows)
        if (self.progress < 0.25) {
          setActiveSlide(0); // Arrival
        } else if (self.progress >= 0.25 && self.progress < 0.60) {
          setActiveSlide(1); // 3D Plastic waste ("From")
        } else if (self.progress >= 0.60 && self.progress < 0.95) {
          setActiveSlide(2); // Products ("To this")
        } else {
          setActiveSlide(3); // Fade out to back to normal info
        }
      }
    });

    // ── THREE.JS SETUP ──
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    
    // Explicitly compute non-zero dimensions
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 15);

    // Optimize renderer settings for max framerate on all devices
    const isHighDPI = typeof window !== "undefined" && window.devicePixelRatio > 1.5;
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: !isHighDPI, // Disable antialiasing on high-DPI displays (saves huge GPU fill-rate)
      alpha: true,
      powerPreference: "high-performance", // Force discrete/high-performance GPU
      precision: "mediump",                // Use medium precision for faster shader compilation and run
      stencil: false                       // Disable stencil buffer (saves memory and bandwidth)
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfc673f, 3); // Coral
    dirLight1.position.set(5, 10, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xdff122, 2.5); // Neon yellow/lime
    dirLight2.position.set(-5, -5, 2);
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0x114d43, 2); // Teal
    dirLight3.position.set(0, 5, -5);
    scene.add(dirLight3);

    // Helper Group for Waste Models
    const wasteGroup = new THREE.Group();
    scene.add(wasteGroup);

    // Optimized: Use MeshStandardMaterial with opacity instead of MeshPhysicalMaterial with transmission
    // This avoids heavy multi-pass screen texture copying and runs 10x faster on lower-end devices
    const plasticMaterial = (color: number) => new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.35,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide
    });

    // 1. Procedural Bottle Model
    const bottleGroup = new THREE.Group();
    const bodyGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.8, 16);
    const body = new THREE.Mesh(bodyGeo, plasticMaterial(0x114d43)); // teal bottle
    bottleGroup.add(body);
    
    const neckGeo = new THREE.ConeGeometry(0.6, 0.5, 16, 1, true);
    const neck = new THREE.Mesh(neckGeo, plasticMaterial(0x114d43));
    neck.position.y = 1.15;
    bottleGroup.add(neck);

    const capGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16);
    const cap = new THREE.Mesh(capGeo, plasticMaterial(0xfc673f)); // coral cap
    cap.position.y = 1.5;
    bottleGroup.add(cap);

    bottleGroup.position.set(-3.5, 1.5, 0);
    wasteGroup.add(bottleGroup);

    // 2. Procedural Cup Model
    const cupGroup = new THREE.Group();
    const cupGeo = new THREE.CylinderGeometry(0.7, 0.5, 1.4, 16, 1, true); // Open cylinder
    const cup = new THREE.Mesh(cupGeo, plasticMaterial(0xdff122)); // neon yellow cup
    cupGroup.add(cup);
    
    const rimGeo = new THREE.TorusGeometry(0.7, 0.05, 8, 24);
    const rim = new THREE.Mesh(rimGeo, plasticMaterial(0xdff122));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.7;
    cupGroup.add(rim);

    cupGroup.position.set(3.5, 1.8, -1);
    wasteGroup.add(cupGroup);

    // 3. Procedural Jug/Canister Model
    const jugGroup = new THREE.Group();
    const jugBodyGeo = new THREE.BoxGeometry(1.2, 1.6, 0.8);
    const jugBody = new THREE.Mesh(jugBodyGeo, plasticMaterial(0xeef4f6)); // frosty white
    jugGroup.add(jugBody);

    const jugNeckGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 12);
    const jugNeck = new THREE.Mesh(jugNeckGeo, plasticMaterial(0xeef4f6));
    jugNeck.position.set(-0.3, 0.95, 0);
    jugGroup.add(jugNeck);

    const jugCapGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.1, 12);
    const jugCap = new THREE.Mesh(jugCapGeo, plasticMaterial(0xfc673f)); // coral cap
    jugCap.position.set(-0.3, 1.15, 0);
    jugGroup.add(jugCap);

    jugGroup.position.set(-2.5, -2, -1);
    wasteGroup.add(jugGroup);

    // 4. Procedural Box Container
    const containerItem = new THREE.Group();
    const contBodyGeo = new THREE.CylinderGeometry(0.9, 0.8, 1.0, 16);
    const contBody = new THREE.Mesh(contBodyGeo, plasticMaterial(0xfc673f)); // coral box
    containerItem.add(contBody);

    const lidGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.15, 16);
    const lid = new THREE.Mesh(lidGeo, plasticMaterial(0xdff122)); // neon lid
    lid.position.y = 0.55;
    containerItem.add(lid);

    containerItem.position.set(3.0, -1.8, 0);
    wasteGroup.add(containerItem);

    // 5. Procedural Plastic Spoon
    const spoonGroup = new THREE.Group();
    const handleGeo = new THREE.BoxGeometry(0.1, 1.3, 0.05);
    const handle = new THREE.Mesh(handleGeo, plasticMaterial(0xeef4f6)); // frosty white
    spoonGroup.add(handle);
    const headGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const head = new THREE.Mesh(headGeo, plasticMaterial(0xeef4f6));
    head.scale.set(1, 1.5, 0.35); // flatten/stretch spoon head
    head.position.y = 0.75;
    spoonGroup.add(head);
    spoonGroup.position.set(-1.5, 3.0, -2);
    wasteGroup.add(spoonGroup);

    // 6. Procedural Plastic Pouch
    const pouchGroup = new THREE.Group();
    const pouchGeo = new THREE.CylinderGeometry(0.55, 0.55, 1.2, 16);
    const pouch = new THREE.Mesh(pouchGeo, plasticMaterial(0xfc673f)); // coral pouch
    pouch.scale.set(1.0, 1.0, 0.15); // squished flat pouch
    pouchGroup.add(pouch);
    pouchGroup.position.set(1.5, -3.0, -1.5);
    wasteGroup.add(pouchGroup);

    // 7. Procedural Plastic Lid / Clamshell
    const lidGroup = new THREE.Group();
    const trayGeo = new THREE.BoxGeometry(1.2, 0.18, 1.0);
    const tray = new THREE.Mesh(trayGeo, plasticMaterial(0xdff122)); // neon lid
    lidGroup.add(tray);
    lidGroup.position.set(0, 1.5, -3);
    wasteGroup.add(lidGroup);

    // Save initial coordinates of 7 models (scattered across the viewport)
    const initialPositions = [
      { x: -3.8, y: 1.8, z: 0 },     // Bottle (Top Left)
      { x: 3.8, y: 2.0, z: -1 },     // Cup (Top Right)
      { x: -3.6, y: -1.6, z: -1 },   // Canister (Bottom Left)
      { x: 3.6, y: -1.8, z: 0 },     // Box Container (Bottom Right)
      { x: -2.0, y: -0.4, z: -1.5 }, // Spoon (Mid Left)
      { x: 2.0, y: 0.4, z: -1.2 },   // Pouch (Mid Right)
      { x: 0, y: 1.8, z: -2 }        // Clamshell (Top Center)
    ];

    // ── PLASTIC BITS (3D INSTANCED FLAKES) ──
    const bitsCount = 350;
    
    // Flat box geometry representing tiny shredded flakes with sharp corners
    const flakeGeometry = new THREE.BoxGeometry(0.18, 0.18, 0.05);
    const flakeMaterial = new THREE.MeshStandardMaterial({
      roughness: 0.35,
      metalness: 0.1,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });

    const instancedBits = new THREE.InstancedMesh(flakeGeometry, flakeMaterial, bitsCount);
    scene.add(instancedBits);

    // Save colors and meta for swirling vortex animations
    const colorPalette = [
      new THREE.Color(0xfc673f), // Coral
      new THREE.Color(0xdff122), // Neon Lime
      new THREE.Color(0x114d43), // Teal
      new THREE.Color(0xeef4f6)  // Frost
    ];

    const particleMeta: { 
      speed: number; 
      phase: number; 
      radius: number; 
      rotSpeedX: number; 
      rotSpeedY: number; 
      rotSpeedZ: number; 
    }[] = [];

    for (let i = 0; i < bitsCount; i++) {
      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      instancedBits.setColorAt(i, c);

      particleMeta.push({
        speed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        radius: 3.5 + Math.random() * 5.0,
        rotSpeedX: (Math.random() - 0.5) * 4.0,
        rotSpeedY: (Math.random() - 0.5) * 4.0,
        rotSpeedZ: (Math.random() - 0.5) * 2.0
      });
    }
    instancedBits.instanceColor!.needsUpdate = true;

    // ── THE RECYCLED PRODUCTS (TILES) ──
    const tilesGroup = new THREE.Group();
    scene.add(tilesGroup);

    // Helper: Create Terrazzo Speckled Canvas Texture
    const createTerrazzoTexture = () => {
      const size = 512;
      const canvasTex = document.createElement("canvas");
      canvasTex.width = size;
      canvasTex.height = size;
      const cCtx = canvasTex.getContext("2d");
      if (cCtx) {
        cCtx.fillStyle = "#2c2a2b"; // dark grey terrazzo body
        cCtx.fillRect(0, 0, size, size);
        
        // Draw random colored specs/flakes
        const colorsHex = ["#fc673f", "#dff122", "#114d43", "#eef4f6", "#555253"];
        for (let i = 0; i < 400; i++) {
          cCtx.fillStyle = colorsHex[Math.floor(Math.random() * colorsHex.length)];
          cCtx.beginPath();
          const x = Math.random() * size;
          const y = Math.random() * size;
          const r = 2 + Math.random() * 8;
          // draw polygonal specs
          cCtx.moveTo(x, y);
          cCtx.lineTo(x + r * (Math.random() - 0.5), y + r * (Math.random() - 0.5));
          cCtx.lineTo(x + r * (Math.random() - 0.5), y + r * (Math.random() - 0.5));
          cCtx.closePath();
          cCtx.fill();
        }
      }
      return new THREE.CanvasTexture(canvasTex);
    };

    const tileTexture = createTerrazzoTexture();
    const tileMat = new THREE.MeshStandardMaterial({
      map: tileTexture,
      roughness: 0.4,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    // Create 6 floating products of varied shapes
    const geometries = [
      new THREE.BoxGeometry(2.0, 2.0, 0.15),                                // Square tile
      new THREE.BoxGeometry(1.5, 2.6, 0.15),                                // Rectangle tile
      new THREE.CylinderGeometry(1.1, 1.1, 0.15, 6),                        // Hexagon paver
      new THREE.CylinderGeometry(1.0, 1.0, 0.15, 32),                       // Round disc
      new THREE.CylinderGeometry(1.2, 1.2, 0.15, 3),                        // Triangle tile
      new THREE.CylinderGeometry(1.15, 1.15, 0.15, 8)                       // Octagon paver
    ];

    // Orient cylinders to lie flat facing the camera
    geometries.forEach(geo => {
      if (geo instanceof THREE.CylinderGeometry) {
        geo.rotateX(Math.PI / 2);
      }
    });

    const productPositions = [
      { x: -3.8, y: 1.8, z: -1 },    // Square tile (Top Left)
      { x: 3.8, y: 2.0, z: 0 },      // Rectangle plank (Top Right)
      { x: -3.6, y: -1.8, z: -0.5 }, // Hex paver (Bottom Left)
      { x: 3.6, y: -2.0, z: -1 },    // Round disc (Bottom Right)
      { x: -1.8, y: 0.2, z: -2 },    // Triangle tile (Mid Left)
      { x: 1.8, y: -0.2, z: -1.5 }   // Octagon paver (Mid Right)
    ];

    const tiles: THREE.Mesh[] = [];

    for (let i = 0; i < 6; i++) {
      const tile = new THREE.Mesh(geometries[i], tileMat);
      const init = productPositions[i];
      tile.position.set(init.x, init.y, init.z);
      tilesGroup.add(tile);
      tiles.push(tile);
    }
    tilesGroup.scale.set(0.01, 0.01, 0.01);
    tilesGroup.position.set(0, 0, 0);

    // Resize Handler
    const onResize = () => {
      if (!canvas || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── INTERSECTION OBSERVER OPTIMIZATION ──
    // Suspends WebGL rendering and physics updates when the component is off-screen.
    // Drops GPU/CPU workload to 0% when looking at other sections, completely resolving lag.
    let isInViewport = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    observer.observe(trigger);

    // ── ANIMATION RENDER LOOP ──
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Early exit if the canvas container is not in the active viewport
      if (!isInViewport) return;

      const time = clock.getElapsedTime();

      // Lerp progress to make transitions extremely smooth
      lerpProgress.current += (scrollProgress.current - lerpProgress.current) * 0.08;
      const p = lerpProgress.current;

      // ── SCENE ANIMATIONS BASED ON LERP PROGRESS ──

      // Scene 1 to 2: 3D Plastic models scale and visibility (Strict active window: p < 0.60)
      if (p < 0.60) {
        wasteGroup.visible = true;
        
        let wasteScale = 0;
        if (p < 0.35) {
          wasteScale = gsap.utils.mapRange(0.20, 0.35, 0.01, 1.8, p);
        } else if (p >= 0.35 && p < 0.48) {
          wasteScale = 1.8;
        } else {
          wasteScale = gsap.utils.mapRange(0.48, 0.60, 1.8, 0.01, p);
        }
        wasteScale = Math.max(0.01, Math.min(1.8, wasteScale));
        wasteGroup.scale.set(wasteScale, wasteScale, wasteScale);
        
        // Float waste models dynamically, SLOWLY, and organically (non-uniform)
        wasteGroup.children.forEach((child, idx) => {
          const init = initialPositions[idx];
          if (!init) return;
          
          // Unique frequencies and amplitudes for organic, non-uniform motion
          const speedY = 0.12 + ((idx * 0.04) % 0.14);
          const speedX = 0.08 + ((idx * 0.05) % 0.12);
          const ampY = 0.5 + ((idx * 0.12) % 0.5);
          const ampX = 0.6 + ((idx * 0.18) % 0.6);
          const phaseY = idx * 1.7;
          const phaseX = idx * 2.3;

          child.position.y = init.y + Math.sin(time * speedY + phaseY) * ampY;
          child.position.x = init.x + Math.cos(time * speedX + phaseX) * ampX;
          
          // Unique 3D rotational drift
          child.rotation.y += 0.003 + ((idx * 0.002) % 0.006);
          child.rotation.x += 0.002 + ((idx * 0.001) % 0.004);
          child.rotation.z += 0.001 + ((idx * 0.001) % 0.003);
        });
      } else {
        wasteGroup.visible = false;
      }

      // Disabled intermediate bits stage to match direct From-To layout
      instancedBits.visible = false;

      // Scene 2 to 3: Manufactured Products (Strict active window: 0.60 <= p < 0.98)
      if (p >= 0.60 && p < 0.98) {
        tilesGroup.visible = true;
        
        let tileScale = 0;
        if (p < 0.72) {
          tileScale = gsap.utils.mapRange(0.60, 0.72, 0.01, 1.0, p);
        } else if (p >= 0.72 && p < 0.88) {
          tileScale = 1.0;
        } else {
          tileScale = gsap.utils.mapRange(0.88, 0.98, 1.0, 0.01, p);
        }
        tileScale = Math.max(0.01, Math.min(1.0, tileScale));
        tilesGroup.scale.set(tileScale, tileScale, tileScale);

        // Rotate and float 6 individual product tiles dynamically (scattered, on-screen)
        tiles.forEach((tile, idx) => {
          const init = productPositions[idx];
          if (!init) return;
          tile.position.y = init.y + Math.sin(time * 0.25 + idx * 1.2) * 0.5;
          tile.position.x = init.x + Math.cos(time * 0.18 + idx * 2.0) * 0.7;
          tile.rotation.y = time * 0.18 + idx * Math.PI / 4;
          tile.rotation.x = Math.PI / 6 + Math.sin(time * 0.22 + idx) * 0.12;
        });
      } else {
        tilesGroup.visible = false;
      }

      // Fade out canvas and grid overlay at the end of the sequence to merge into next section
      let fadeOutOpacity = 1.0;
      if (p > 0.90) {
        fadeOutOpacity = gsap.utils.mapRange(0.90, 0.98, 1.0, 0.0, p);
        fadeOutOpacity = Math.max(0.0, Math.min(1.0, fadeOutOpacity));
      }
      if (canvasRef.current) canvasRef.current.style.opacity = fadeOutOpacity.toString();
      if (gridRef.current) gridRef.current.style.opacity = fadeOutOpacity.toString();

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      st.kill();
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      
      // Cleanup Three resources
      scene.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh) && !(obj instanceof THREE.Points)) return;
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      tileTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={triggerRef} className="relative w-full h-[300vh] z-10 bg-carbon">
      {/* Viewport container (pinned dynamically via GSAP ScrollTrigger) */}
      <div ref={containerRef} className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Three.js Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
        
        {/* Technical overlay grid */}
        <div ref={gridRef} className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-10" />

        {/* Text Slides Container (Fixed collapsed height bug) */}
        <div className="absolute inset-0 z-20 w-full h-full flex items-center justify-center pointer-events-none">
          
          {/* SLIDE 1: PANGKAS / Reborn From Filth */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center transition-all duration-[800ms] ease-out"
            style={{ 
              opacity: activeSlide === 0 ? 1 : 0,
              transform: activeSlide === 0 ? "translateY(0)" : "translateY(-40px)",
              pointerEvents: activeSlide === 0 ? "auto" : "none"
            }}
          >
            <div className="max-w-5xl w-full flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-lime/10 border border-lime/20 text-lime text-[11px] tracking-[0.25em] uppercase font-mono mb-8">
                Circular Construction Materials
              </div>
              <h2 className="font-anton text-[60px] md:text-[9vw] lg:text-[120px] tracking-[0.03em] leading-[1.0] uppercase text-frost">
                PANG<span className="text-lime">KAS</span>
              </h2>
              <p className="text-[14px] md:text-[20px] tracking-[0.16em] uppercase text-mauve/80 mt-6 font-mono">
                Reborn From Filth
              </p>
              <div className="mt-16 animate-bounce text-frost/30 text-[11px] font-mono tracking-[0.2em] uppercase">
                Scroll Down to Begin
              </div>
            </div>
          </div>

          {/* SLIDE 2: Post-Consumer Waste */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center transition-all duration-[800ms] ease-out"
            style={{ 
              opacity: activeSlide === 1 ? 1 : 0,
              transform: activeSlide === 1 ? "translateY(0)" : activeSlide < 1 ? "translateY(40px)" : "translateY(-40px)",
              pointerEvents: activeSlide === 1 ? "auto" : "none"
            }}
          >
            <div className="max-w-xl w-full flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-coral/10 border border-coral/20 text-coral text-[10px] tracking-[0.2em] uppercase font-mono mb-6">
                From
              </div>
              <h3 className="font-anton text-[36px] md:text-[50px] tracking-[0.03em] uppercase text-frost mb-4">
                Post-Consumer Waste
              </h3>
              <p className="text-[14px] md:text-[16px] leading-[1.8] text-frost/50 font-light">
                We source raw, locally discarded post-consumer plastics directly from landfill-bound streams, creating immediate circular supply chain value.
              </p>
            </div>
          </div>

          {/* SLIDE 3: Manufactured Products */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center transition-all duration-[800ms] ease-out"
            style={{ 
              opacity: activeSlide === 2 ? 1 : 0,
              transform: activeSlide === 2 ? "translateY(0)" : activeSlide < 2 ? "translateY(40px)" : "translateY(-40px)",
              pointerEvents: activeSlide === 2 ? "auto" : "none"
            }}
          >
            <div className="max-w-xl w-full flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal/20 border border-teal/30 text-lime text-[10px] tracking-[0.2em] uppercase font-mono mb-6">
                To this
              </div>
              <h3 className="font-anton text-[36px] md:text-[50px] tracking-[0.03em] uppercase text-frost mb-4">
                End Product
              </h3>
              <p className="text-[14px] md:text-[16px] leading-[1.8] text-frost/50 font-light mb-8">
                Final high-performance circular materials are manufactured, yielding durable pavers, composite tiles, and customized structural outputs.
              </p>
              
              {/* Product Features Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 justify-center w-full max-w-lg mt-2">
                <div className="flex items-center justify-center gap-2 px-3 py-2 bg-teal/10 border border-teal/20 rounded-lg text-frost text-[11px] font-mono tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime shadow-[0_0_8px_#dff122]" />
                  Heat Insulating
                </div>
                <div className="flex items-center justify-center gap-2 px-3 py-2 bg-teal/10 border border-teal/20 rounded-lg text-frost text-[11px] font-mono tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime shadow-[0_0_8px_#dff122]" />
                  Crack Resistant
                </div>
                <div className="flex items-center justify-center gap-2 px-3 py-2 bg-teal/10 border border-teal/20 rounded-lg text-frost text-[11px] font-mono tracking-wider uppercase col-span-2 sm:col-span-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime shadow-[0_0_8px_#dff122]" />
                  Wet Conditions
                </div>
                <div className="flex items-center justify-center gap-2 px-3 py-2 bg-teal/10 border border-teal/20 rounded-lg text-frost text-[11px] font-mono tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime shadow-[0_0_8px_#dff122]" />
                  Durable
                </div>
                <div className="flex items-center justify-center gap-2 px-3 py-2 bg-teal/10 border border-teal/20 rounded-lg text-frost text-[11px] font-mono tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime shadow-[0_0_8px_#dff122]" />
                  Lightweight
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 4: Fade Out Transition */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-[800ms] ease-out opacity-0 pointer-events-none"
            style={{ 
              opacity: activeSlide === 3 ? 1 : 0,
              transform: activeSlide === 3 ? "translateY(0)" : "translateY(40px)"
            }}
          >
            {/* Empty block to let canvas dissolve and naturally transition to details below */}
          </div>

        </div>

      </div>
    </div>
  );
}
