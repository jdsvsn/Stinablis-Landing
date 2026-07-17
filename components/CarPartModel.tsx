"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader, STLLoader } from "three-stdlib";
import { Sun, Moon } from "lucide-react";

interface CarPartModelProps {
  uploadedFile: File | null;
}

export default function CarPartModel({ uploadedFile }: CarPartModelProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLightMode, setIsLightMode] = useState(true);
  const [loading, setLoading] = useState(true);

  // Refs to allow communication between the mount effect and the upload handler
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rotationGroupRef = useRef<THREE.Group | null>(null);
  const targetZoomRef = useRef<{ value: number } | null>(null);

  // 1. Initial Scene Setup & GLTF loading
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2);
    dirLight1.position.set(5, 10, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xfc673f, 1.5); // Coral accent light
    dirLight2.position.set(-5, -5, 2);
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0x114d43, 1.5); // Teal accent light
    dirLight3.position.set(0, 5, -5);
    scene.add(dirLight3);

    // Wrapper group for screen positioning (centered horizontally, lowered vertically)
    const positionWrapper = new THREE.Group();
    positionWrapper.position.x = 0;
    positionWrapper.position.y = -2.0;
    scene.add(positionWrapper);

    // Group that will actually rotate
    const rotationGroup = new THREE.Group();
    rotationGroupRef.current = rotationGroup;
    positionWrapper.add(rotationGroup);

    // Load custom GLB placeholder model
    const loader = new GLTFLoader();
    loader.load(
      '/Big Wing.glb',
      (gltf) => {
        // If a custom file was already uploaded in the meantime, skip loading the GLB placeholder
        if (uploadedFile) return;

        const model = gltf.scene;

        // Calculate the bounding box of the raw model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Shift the model's geometry so its visual center becomes its local (0,0,0) pivot
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;

        // Calculate scale to fit within bounding box
        const maxDim = Math.max(size.x, size.y, size.z);
        const isMobile = window.innerWidth < 768;
        const targetScale = isMobile ? 7.0 : 9.5;
        const scale = targetScale / maxDim;
        
        // Scale the model
        model.scale.set(scale, scale, scale);

        // Add the centered model to the rotation group
        rotationGroup.add(model);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error("Error loading GLB model:", error);
        setLoading(false);
      }
    );

    // Initial tilt
    rotationGroup.rotation.x = Math.PI / 8;
    rotationGroup.rotation.y = -Math.PI / 6;

    // Interaction (Mouse/Touch Rotation)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let targetRotation = { x: Math.PI / 8, y: -Math.PI / 6 };
    const targetZoomObj = { value: 15 };
    targetZoomRef.current = targetZoomObj;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const deltaMove = {
        x: clientX - previousMousePosition.x,
        y: clientY - previousMousePosition.y
      };

      targetRotation.y += deltaMove.x * 0.01;
      targetRotation.x += deltaMove.y * 0.01;

      // Clamp X rotation to prevent flipping upside down completely
      targetRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotation.x));

      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault(); // Prevent browser default scroll
      e.stopPropagation(); // Stop propagation to Lenis / parent scroll listeners
      const zoomSpeed = 0.015;
      targetZoomObj.value += e.deltaY * zoomSpeed;
      // Clamp zoom distance to prevent clipping or getting too far
      targetZoomObj.value = Math.max(5, Math.min(30, targetZoomObj.value));
    };

    mount.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    
    mount.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);
    mount.addEventListener("wheel", onWheel, { passive: false });

    // Resize handler
    let currentWidth = mount.clientWidth;
    let currentHeight = mount.clientHeight;
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === currentWidth && h === currentHeight) return;
      currentWidth = w;
      currentHeight = h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth interpolation towards target rotation
      rotationGroup.rotation.y += (targetRotation.y - rotationGroup.rotation.y) * 0.1;
      rotationGroup.rotation.x += (targetRotation.x - rotationGroup.rotation.x) * 0.1;

      // Smooth interpolation towards target zoom
      camera.position.z += (targetZoomObj.value - camera.position.z) * 0.08;

      // Auto-rotate slowly when not interacting
      if (!isDragging) {
        targetRotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      mount.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      mount.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      mount.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);

      // Recursive cleanup for Three.js objects
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        
        if (object.geometry) {
          object.geometry.dispose();
        }

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // 2. Effect for handling file uploads (client-side STL loading & model swapping)
  useEffect(() => {
    if (!uploadedFile || !rotationGroupRef.current) return;

    setLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      if (!arrayBuffer) {
        setLoading(false);
        return;
      }

      try {
        const loader = new STLLoader();
        const geometry = loader.parse(arrayBuffer);

        // Center geometry pivot point locally
        geometry.computeBoundingBox();
        const box = geometry.boundingBox!;
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);

        // Center geometry locally so local rotation pivot is at center of volume
        geometry.center();

        // Calculate scale to fit viewport bounding box
        const maxDim = Math.max(size.x, size.y, size.z);
        const isMobile = window.innerWidth < 768;
        const targetScale = isMobile ? 7.0 : 9.5;
        const scale = targetScale / maxDim;

        // Create standard metallic material that responds beautifully to lighting
        const material = new THREE.MeshStandardMaterial({
          color: 0x90a4ae,
          metalness: 0.8,
          roughness: 0.25,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(scale, scale, scale);

        // Clear existing children meshes inside rotationGroup
        const group = rotationGroupRef.current;
        if (!group) {
          setLoading(false);
          return;
        }
        while (group.children.length > 0) {
          const child = group.children[0];
          group.remove(child);

          child.traverse((obj) => {
            if (!(obj instanceof THREE.Mesh)) return;
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
              if (Array.isArray(obj.material)) {
                obj.material.forEach((m) => m.dispose());
              } else {
                obj.material.dispose();
              }
            }
          });
        }

        // Reset targetZoom to default
        if (targetZoomRef.current) {
          targetZoomRef.current.value = 15;
        }

        // Add custom STL model to group
        group.add(mesh);
        setLoading(false);
      } catch (err) {
        console.error("Error parsing STL:", err);
        setLoading(false);
      }
    };

    reader.onerror = () => {
      console.error("Error reading file");
      setLoading(false);
    };

    reader.readAsArrayBuffer(uploadedFile);
  }, [uploadedFile]);

  return (
    <div className={`relative w-full h-full cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden border flex items-center justify-center group transition-colors duration-500 ${isLightMode ? 'bg-frost border-carbon/10' : 'bg-carbon/50 border-white/5'}`}>
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <span className="w-6 h-6 border-2 border-coral border-t-transparent rounded-full animate-spin"></span>
        </div>
      )}

      <div className={`absolute top-4 left-4 z-10 backdrop-blur-md px-3 py-1.5 rounded-full border text-[10px] uppercase tracking-widest flex items-center gap-2 pointer-events-none transition-colors duration-500 ${isLightMode ? 'bg-white/50 border-black/10 text-carbon' : 'bg-black/40 border-white/10 text-white/70'}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" />
        Interactive 3D Preview
      </div>
      


      {/* Light/Dark mode switcher */}
      <button 
        onClick={() => setIsLightMode(!isLightMode)}
        className={`absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${isLightMode ? 'bg-white/50 border-black/10 text-carbon hover:bg-white/80' : 'bg-black/40 border-white/10 text-white hover:bg-black/60'}`}
        aria-label="Toggle Background Color"
      >
        {isLightMode ? <Moon size={16} /> : <Sun size={16} />}
      </button>

      <div className="absolute inset-0 pointer-events-none flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`text-xs tracking-widest uppercase font-mono ${isLightMode ? 'text-carbon/40' : 'text-white/20'}`}>
          {uploadedFile ? "Drag to rotate STL" : "Drag to rotate"}
        </div>
      </div>
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}