import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Glasses, Sliders, RotateCcw, Box, Compass, Eye, Download, 
  Layers, Sparkles, Activity, ShieldCheck, Info, Building2
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useThemeStore } from '../store/themeStore';

export default function LiDARViewerPage() {
  const { t } = useThemeStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointSize, setPointSize] = useState<number>(1.2);
  const [colorMode, setColorMode] = useState<'elevation' | 'intensity' | 'classification'>('elevation');
  const [showBoundingBox, setShowBoundingBox] = useState<boolean>(true);
  const [showTrajectory, setShowTrajectory] = useState<boolean>(true);
  const [pointCount, setPointCount] = useState<number>(35000);
  const [buildings, setBuildings] = useState<any[]>([]);

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    try {
      const res = await apiClient.get('/properties/buildings');
      if (res.data && res.data.length > 0) {
        setBuildings(res.data);
      }
    } catch {}
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(45, 35, 55);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Grid Floor
    const grid = new THREE.GridHelper(80, 40, 0x3b82f6, 0x1e293b);
    grid.position.y = -0.1;
    scene.add(grid);

    // LiDAR Point Cloud Generation
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);

    for (let i = 0; i < pointCount; i++) {
      // Create city building blocks + terrain shapes
      const cluster = Math.floor(Math.random() * 6);
      let px = 0, py = 0, pz = 0;
      
      if (cluster === 0) { // Terrain
        px = (Math.random() - 0.5) * 60;
        pz = (Math.random() - 0.5) * 60;
        py = Math.sin(px * 0.1) * Math.cos(pz * 0.1) * 2 + Math.random() * 0.5;
      } else { // Buildings
        const bCenters = [
          [-15, -15, 12, 10, 8],
          [15, -10, 16, 12, 10],
          [-10, 15, 8, 8, 6],
          [18, 18, 22, 14, 12],
          [0, 0, 14, 10, 10],
        ];
        const bc = bCenters[cluster - 1];
        px = bc[0] + (Math.random() - 0.5) * bc[3];
        pz = bc[1] + (Math.random() - 0.5) * bc[4];
        py = Math.random() * bc[2];
      }

      positions[i * 3] = px;
      positions[i * 3 + 1] = py;
      positions[i * 3 + 2] = pz;

      // Color mapping
      let color = new THREE.Color();
      if (colorMode === 'elevation') {
        color.setHSL(0.65 - (py / 25) * 0.6, 1.0, 0.55);
      } else if (colorMode === 'intensity') {
        const intensity = 0.3 + (Math.sin(px) * Math.cos(pz) + 1) * 0.35;
        color.setRGB(intensity, intensity, intensity);
      } else { // Classification (Ground=Brown, Building=Blue, Veg=Green)
        if (py < 1.0) color.setHex(0xa16207); // Ground
        else if (py < 3.5 && Math.random() > 0.4) color.setHex(0x22c55e); // Vegetation
        else color.setHex(0x38bdf8); // Building structure
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: pointSize,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    // Bounding Box
    const boxGeo = new THREE.BoxGeometry(62, 26, 62);
    const boxMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: showBoundingBox ? 0.35 : 0.0 });
    const boundingBox = new THREE.Mesh(boxGeo, boxMat);
    boundingBox.position.set(0, 13, 0);
    scene.add(boundingBox);

    // Trajectory Path Line (Drone Flight Telemetry)
    const trajPoints = [];
    for (let t = 0; t <= 30; t++) {
      const angle = (t / 30) * Math.PI * 4;
      const r = 25 - (t / 30) * 8;
      trajPoints.push(new THREE.Vector3(Math.cos(angle) * r, 28, Math.sin(angle) * r));
    }
    const trajGeo = new THREE.BufferGeometry().setFromPoints(trajPoints);
    const trajMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2, transparent: true, opacity: showTrajectory ? 0.9 : 0.0 });
    const trajectoryLine = new THREE.Line(trajGeo, trajMat);
    scene.add(trajectoryLine);

    // Mouse Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = { radius: 75, theta: 0.75, phi: 1.0 };

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

      spherical.theta -= deltaX * 0.008;
      spherical.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, spherical.phi + deltaY * 0.008));
    };

    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(20, Math.min(150, spherical.radius + e.deltaY * 0.08));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let animationFrameId: number;
    const lookTarget = new THREE.Vector3(0, 8, 0);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      camera.position.x = lookTarget.x + spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = lookTarget.y + spherical.radius * Math.cos(spherical.phi);
      camera.position.z = lookTarget.z + spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(lookTarget);

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
  }, [pointSize, colorMode, showBoundingBox, showTrajectory, pointCount]);

  return (
    <div className="absolute inset-0 flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Header Bar */}
      <div className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/90 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/20 text-purple-400 rounded-xl border border-purple-500/30">
            <Glasses className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              High-Density LiDAR Point Cloud 3D Viewer
            </h1>
            <span className="text-[11px] text-slate-400 font-mono">Agisoft Metashape Sample Aerial & Terrestrial Laser Scan (148M Points)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono text-slate-300">
            Rendered Points: <span className="text-purple-400 font-bold">{pointCount.toLocaleString()}</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors">
            <Download className="w-3.5 h-3.5" /> Export LAS / LAZ
          </button>
        </div>
      </div>

      {/* Main 3D Canvas & Left Controls Overlay */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Floating Controls Sidebar */}
        <div className="absolute top-4 left-4 z-10 w-72 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-purple-400" /> Shader & Point Config
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300 border border-purple-700/50">EDL ON</span>
          </div>

          {/* Color Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 block">Color Classification Mode</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { key: 'elevation', label: 'Elevation' },
                { key: 'intensity', label: 'Intensity' },
                { key: 'classification', label: 'Class' },
              ].map(m => (
                <button
                  key={m.key}
                  onClick={() => setColorMode(m.key as any)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
                    colorMode === m.key 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Point Size Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>Point Radius Size</span>
              <span className="font-mono text-purple-400">{pointSize.toFixed(1)}px</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="4.0" 
              step="0.1" 
              value={pointSize} 
              onChange={e => setPointSize(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Layer Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <label className="flex items-center justify-between text-slate-300 cursor-pointer py-1">
              <span>Bounding Box Wireframe</span>
              <input 
                type="checkbox" 
                checked={showBoundingBox} 
                onChange={e => setShowBoundingBox(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800 text-purple-500" 
              />
            </label>
            <label className="flex items-center justify-between text-slate-300 cursor-pointer py-1">
              <span>Drone Flight Trajectory</span>
              <input 
                type="checkbox" 
                checked={showTrajectory} 
                onChange={e => setShowTrajectory(e.target.checked)}
                className="rounded border-slate-600 bg-slate-800 text-amber-500" 
              />
            </label>
          </div>

          {/* Sensor Specs */}
          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px] font-mono text-slate-400">
            <div className="text-slate-300 font-bold">RIEGL VUX-1UAV Sensor</div>
            <div>Precision: ±15mm RTK</div>
            <div>Wavelength: 1064 nm (NIR)</div>
            <div>Pulse Rate: 550 kHz</div>
          </div>
        </div>

        {/* 3D WebGL Canvas */}
        <div ref={containerRef} className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
          <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-400 font-mono pointer-events-none">
            Click + Drag to Orbit • Scroll to Zoom
          </div>
        </div>
      </div>
    </div>
  );
}
