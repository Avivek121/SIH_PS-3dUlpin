import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Glasses, Eye, Sparkles, Sliders, Maximize, RotateCcw, 
  Layers, MapPin, Building, ShieldCheck, Ruler, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ARVRViewerPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [mode, setMode] = useState<'ar' | 'vr'>('ar');
  const [measurementActive, setMeasurementActive] = useState<boolean>(true);
  const [selectedUnit, setSelectedUnit] = useState<string>('Unit 402 (Apartment 2BHK)');

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(mode === 'ar' ? 0x080e1e : 0x020617);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 1.6, 5); // Eye height 1.6m

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Grid Floor
    const grid = new THREE.GridHelper(20, 20, 0x38bdf8, 0x1e293b);
    grid.position.y = 0;
    scene.add(grid);

    // 3D Interior Apartment Model (Walls, Floor Slab, Ceiling)
    const roomGroup = new THREE.Group();

    // Floor Slab
    const floorGeo = new THREE.PlaneGeometry(12, 10);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    roomGroup.add(floor);

    // Walls with holographic AR wireframes
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(12, 3.0), wallMat);
    backWall.position.set(0, 1.5, -5);
    roomGroup.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 3.0), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-6, 1.5, 0);
    roomGroup.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 3.0), wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(6, 1.5, 0);
    roomGroup.add(rightWall);

    // Unit Partition Boxes
    const livingRoomGeo = new THREE.BoxGeometry(5.5, 2.9, 4.5);
    const livingMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.6 });
    const living = new THREE.Mesh(livingRoomGeo, livingMat);
    living.position.set(-2.8, 1.45, -2.2);
    roomGroup.add(living);

    const bedroomGeo = new THREE.BoxGeometry(5.5, 2.9, 4.5);
    const bedMat = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.6 });
    const bed = new THREE.Mesh(bedroomGeo, bedMat);
    bed.position.set(2.8, 1.45, -2.2);
    roomGroup.add(bed);

    // Laser Measurement Lines
    const laserPoints = [
      new THREE.Vector3(-2.8, 0.1, -2.2),
      new THREE.Vector3(2.8, 0.1, -2.2),
    ];
    const laserGeo = new THREE.BufferGeometry().setFromPoints(laserPoints);
    const laserMat = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 });
    const laserLine = new THREE.Line(laserGeo, laserMat);
    roomGroup.add(laserLine);

    scene.add(roomGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2, 20);
    pointLight.position.set(0, 2.5, 0);
    scene.add(pointLight);

    // Mouse Look / Orbit
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = { radius: 6, theta: 0, phi: Math.PI / 2 - 0.1 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      spherical.theta -= deltaX * 0.006;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi + deltaY * 0.006));
    };

    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(2, Math.min(15, spherical.radius + e.deltaY * 0.02));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let animationFrameId: number;
    const target = new THREE.Vector3(0, 1.5, 0);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      camera.position.x = target.x + spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = target.y + spherical.radius * Math.cos(spherical.phi);
      camera.position.z = target.z + spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(target);

      laserLine.visible = measurementActive;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mode, measurementActive]);

  return (
    <div className="absolute inset-0 flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Header */}
      <div className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/90 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/explorer?building=B03')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Exit to Vertical Explorer
          </button>
          <div className="h-4 w-px bg-slate-700"></div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <Glasses className="w-4 h-4 text-purple-400" /> WebXR Augmented & Virtual Reality Spatial Inspection
            </h1>
            <span className="text-[11px] text-slate-400 font-mono">Unit 402 • Jaydev Tower (OD-BBSR-W12-P002-B03-F04-U02)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700 flex gap-1">
            <button 
              onClick={() => setMode('ar')} 
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                mode === 'ar' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              AR Mode
            </button>
            <button 
              onClick={() => setMode('vr')} 
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                mode === 'vr' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              VR Walkthrough
            </button>
          </div>

          <button 
            onClick={() => setMeasurementActive(!measurementActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              measurementActive ? 'bg-red-600/20 text-red-400 border-red-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" /> Laser Tape: 5.6m Span
          </button>
        </div>
      </div>

      {/* 3D WebXR Viewport */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* AR Spatial HUD Overlays */}
        <div className="absolute top-4 left-4 z-10 bg-slate-900/85 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-3 max-w-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Sparkles className="w-4 h-4" /> Volumetric Space HUD
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Target Space:</span>
              <span className="font-bold text-white">Unit 402</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Clear Floor Height:</span>
              <span className="font-mono text-emerald-400 font-bold">2.90m Verified</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Carpet Area:</span>
              <span className="font-mono text-white">125.0 m²</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Encroachment:</span>
              <span className="font-mono text-emerald-400 font-bold">0.0m (Zero Diff)</span>
            </div>
          </div>
        </div>

        {/* 3D Canvas */}
        <div ref={containerRef} className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-slate-700/80 text-xs text-slate-300 font-mono pointer-events-none">
            Click + Drag to Look Around • Scroll to Step Forward/Back
          </div>
        </div>
      </div>
    </div>
  );
}

