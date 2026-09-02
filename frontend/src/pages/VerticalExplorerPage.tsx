import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { 
  Layers, Box, Eye, CheckCircle, ShieldCheck, Download, FileText, 
  ArrowLeft, Sliders, RotateCw, ZoomIn, ZoomOut, ChevronRight, Home, Sparkles, AlertCircle
} from 'lucide-react';
import CertificateModal from '../components/certificate/CertificateModal';

interface UnitInfo {
  unit_number: string;
  unit_id: string;
  type: string;
  area: number;
  owner: string;
  status: 'Registered' | 'Pending';
  validation: 'Verified' | 'Flagged' | 'Pending';
  color: string;
}

const FLOOR_UNITS: Record<number, UnitInfo[]> = {
  0: [
    { unit_number: 'G01', unit_id: 'U01', type: 'Commercial Shop', area: 110, owner: 'Odisha Housing Board', status: 'Registered', validation: 'Verified', color: '#3b82f6' },
    { unit_number: 'G02', unit_id: 'U02', type: 'Convenience Store', area: 95, owner: 'Municipal Corp', status: 'Registered', validation: 'Verified', color: '#10b981' },
    { unit_number: 'G03', unit_id: 'U03', type: 'ATM & Kiosk', area: 45, owner: 'State Bank', status: 'Registered', validation: 'Verified', color: '#f59e0b' },
  ],
  1: [
    { unit_number: '101', unit_id: 'U01', type: 'Apartment 3BHK', area: 135, owner: 'Sunita Sharma', status: 'Registered', validation: 'Verified', color: '#3b82f6' },
    { unit_number: '102', unit_id: 'U02', type: 'Apartment 2BHK', area: 105, owner: 'Priya Mohanty', status: 'Registered', validation: 'Verified', color: '#6366f1' },
    { unit_number: '103', unit_id: 'U03', type: 'Apartment 2BHK', area: 105, owner: 'Vikram Singh', status: 'Registered', validation: 'Verified', color: '#8b5cf6' },
    { unit_number: '104', unit_id: 'U04', type: 'Apartment 3BHK', area: 135, owner: 'Ananya Das', status: 'Registered', validation: 'Verified', color: '#ec4899' },
  ],
  2: [
    { unit_number: '201', unit_id: 'U01', type: 'Apartment 3BHK', area: 135, owner: 'Sanjay Mishra', status: 'Registered', validation: 'Verified', color: '#3b82f6' },
    { unit_number: '202', unit_id: 'U02', type: 'Apartment 2BHK', area: 105, owner: 'Kavita Rath', status: 'Registered', validation: 'Verified', color: '#6366f1' },
    { unit_number: '203', unit_id: 'U03', type: 'Apartment 2BHK', area: 105, owner: 'Amit Pradhan', status: 'Registered', validation: 'Verified', color: '#8b5cf6' },
    { unit_number: '204', unit_id: 'U04', type: 'Apartment 3BHK', area: 135, owner: 'Deepak Behera', status: 'Registered', validation: 'Verified', color: '#ec4899' },
  ],
  3: [
    { unit_number: '301', unit_id: 'U01', type: 'Apartment 3BHK', area: 135, owner: 'Meera Nayak', status: 'Registered', validation: 'Verified', color: '#3b82f6' },
    { unit_number: '302', unit_id: 'U02', type: 'Apartment 2BHK', area: 105, owner: 'Rajesh Patel', status: 'Registered', validation: 'Verified', color: '#6366f1' },
    { unit_number: '303', unit_id: 'U03', type: 'Apartment 2BHK', area: 105, owner: 'Bikram Sahoo', status: 'Registered', validation: 'Verified', color: '#8b5cf6' },
    { unit_number: '304', unit_id: 'U04', type: 'Apartment 3BHK', area: 135, owner: 'Pooja Jena', status: 'Registered', validation: 'Verified', color: '#ec4899' },
  ],
  4: [
    { unit_number: '401', unit_id: 'U01', type: 'Apartment 3BHK', area: 135, owner: 'Debasis Rout', status: 'Registered', validation: 'Verified', color: '#3b82f6' },
    { unit_number: '402', unit_id: 'U02', type: 'Apartment 2BHK (Premium)', area: 125, owner: 'Rajesh Kumar Patel', status: 'Registered', validation: 'Verified', color: '#38bdf8' },
    { unit_number: '403', unit_id: 'U03', type: 'Apartment 2BHK', area: 105, owner: 'Smita Mohapatra', status: 'Registered', validation: 'Verified', color: '#8b5cf6' },
    { unit_number: '404', unit_id: 'U04', type: 'Apartment 3BHK', area: 135, owner: 'Alok Panda', status: 'Registered', validation: 'Verified', color: '#ec4899' },
  ],
  5: [
    { unit_number: '501', unit_id: 'U01', type: 'Apartment 3BHK', area: 135, owner: 'Ranjan Barik', status: 'Registered', validation: 'Verified', color: '#3b82f6' },
    { unit_number: '502', unit_id: 'U02', type: 'Apartment 2BHK', area: 105, owner: 'Monalisa Dash', status: 'Registered', validation: 'Verified', color: '#6366f1' },
    { unit_number: '503', unit_id: 'U03', type: 'Apartment 2BHK', area: 105, owner: 'Subrat Tripathy', status: 'Registered', validation: 'Verified', color: '#8b5cf6' },
    { unit_number: '504', unit_id: 'U04', type: 'Apartment 3BHK', area: 135, owner: 'Gitanjali Senapati', status: 'Registered', validation: 'Verified', color: '#ec4899' },
  ],
  6: [
    { unit_number: '601', unit_id: 'U01', type: 'Penthouse Suite', area: 240, owner: 'Tapan Mohanty', status: 'Registered', validation: 'Verified', color: '#f59e0b' },
    { unit_number: '602', unit_id: 'U02', type: 'Penthouse Suite', area: 240, owner: 'Sujata Patnaik', status: 'Registered', validation: 'Verified', color: '#06b6d4' },
  ]
};

export default function VerticalExplorerPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [buildingId, setBuildingId] = useState(searchParams.get('building') || 'B03');
  const [selectedFloor, setSelectedFloor] = useState<number>(parseInt(searchParams.get('floor') || '4', 10));
  const [selectedUnit, setSelectedUnit] = useState<UnitInfo>(FLOOR_UNITS[4][1]); // 402 default
  const [isExploded, setIsExploded] = useState<boolean>(true);
  const [explodeFactor, setExplodeFactor] = useState<number>(1.8);
  const [isolatedFloor, setIsolatedFloor] = useState<boolean>(false);
  const [showCertModal, setShowCertModal] = useState<boolean>(false);

  const currentUnits = FLOOR_UNITS[selectedFloor] || FLOOR_UNITS[4];

  // Three.js 3D Exploded Building Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(30, 24, 35);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(30, 60, 40);
    sun.castShadow = true;
    scene.add(sun);

    const blueLight = new THREE.PointLight(0x38bdf8, 2, 50);
    blueLight.position.set(-20, 20, -20);
    scene.add(blueLight);

    // Grid Base
    const grid = new THREE.GridHelper(50, 30, 0x3b82f6, 0x1e293b);
    grid.position.y = -0.05;
    scene.add(grid);

    // Floor Meshes Group
    const floorsGroup = new THREE.Group();
    const floorMeshes: { group: THREE.Group; floorNum: number }[] = [];
    const totalFloors = 7; // 0 to 6

    for (let f = 0; f < totalFloors; f++) {
      const fGroup = new THREE.Group();
      const isCurrentFloor = f === selectedFloor;
      const unitsForFloor = FLOOR_UNITS[f] || FLOOR_UNITS[4];

      // Base slab
      const slabGeo = new THREE.BoxGeometry(14, 0.3, 12);
      const slabMat = new THREE.MeshStandardMaterial({
        color: isCurrentFloor ? 0x3b82f6 : 0x334155,
        roughness: 0.4,
        metalness: 0.2
      });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      fGroup.add(slab);

      // Slices / Units on this floor
      if (unitsForFloor.length === 4) {
        const positions = [
          [-3.3, 0.8, -2.8],
          [3.3, 0.8, -2.8],
          [-3.3, 0.8, 2.8],
          [3.3, 0.8, 2.8],
        ];
        unitsForFloor.forEach((u, uIdx) => {
          const isSelectedUnit = isCurrentFloor && u.unit_number === selectedUnit.unit_number;
          const uGeo = new THREE.BoxGeometry(6.2, 1.3, 5.2);
          const uMat = new THREE.MeshStandardMaterial({
            color: isSelectedUnit ? 0x38bdf8 : new THREE.Color(u.color),
            roughness: 0.3,
            metalness: 0.4,
            transparent: true,
            opacity: isSelectedUnit ? 0.95 : (isCurrentFloor ? 0.75 : 0.4)
          });
          const uMesh = new THREE.Mesh(uGeo, uMat);
          uMesh.position.set(positions[uIdx][0], positions[uIdx][1], positions[uIdx][2]);
          
          // Edge highlight
          const edges = new THREE.EdgesGeometry(uGeo);
          const edgeMat = new THREE.LineBasicMaterial({
            color: isSelectedUnit ? 0xffffff : 0x64748b,
            linewidth: isSelectedUnit ? 2 : 1
          });
          const edge = new THREE.LineSegments(edges, edgeMat);
          edge.position.copy(uMesh.position);

          fGroup.add(uMesh);
          fGroup.add(edge);
        });
      } else {
        // 2 or 3 commercial / penthouse units
        const uWidth = 13 / unitsForFloor.length;
        unitsForFloor.forEach((u, uIdx) => {
          const isSelectedUnit = isCurrentFloor && u.unit_number === selectedUnit.unit_number;
          const uGeo = new THREE.BoxGeometry(uWidth - 0.4, 1.3, 11);
          const uMat = new THREE.MeshStandardMaterial({
            color: isSelectedUnit ? 0x38bdf8 : new THREE.Color(u.color),
            transparent: true,
            opacity: isSelectedUnit ? 0.95 : 0.6
          });
          const uMesh = new THREE.Mesh(uGeo, uMat);
          const posX = -6.5 + (uIdx + 0.5) * uWidth;
          uMesh.position.set(posX, 0.8, 0);
          fGroup.add(uMesh);
        });
      }

      floorsGroup.add(fGroup);
      floorMeshes.push({ group: fGroup, floorNum: f });
    }

    scene.add(floorsGroup);

    // Mouse Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = { radius: 45, theta: 0.7, phi: 1.1 };

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
      spherical.radius = Math.max(15, Math.min(90, spherical.radius + e.deltaY * 0.05));
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

      // Calculate floor heights with explosion factor
      const spacing = isExploded ? explodeFactor * 2.8 : 1.8;

      floorMeshes.forEach(({ group, floorNum }) => {
        if (isolatedFloor) {
          group.visible = floorNum === selectedFloor;
          group.position.y = 5;
        } else {
          group.visible = true;
          const targetY = floorNum * spacing;
          group.position.y = THREE.MathUtils.lerp(group.position.y, targetY, 0.08);
        }
      });

      // Camera position
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
  }, [selectedFloor, selectedUnit, isExploded, explodeFactor, isolatedFloor]);

  const currentULPIN = `OD-BBSR-W12-P002-${buildingId}-F${selectedFloor.toString().padStart(2, '0')}-${selectedUnit.unit_id}`;

  return (
    <div className="absolute inset-0 flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Header Bar */}
      <div className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/map')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to 3D GIS Map
          </button>
          <div className="h-4 w-px bg-slate-700"></div>
          <div className="flex items-center gap-2">
            <select
              value={buildingId}
              onChange={(e) => {
                setBuildingId(e.target.value);
                setSelectedFloor(4);
                setSelectedUnit(FLOOR_UNITS[4][0]);
              }}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1 text-xs text-white font-bold outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="B01">B01 (Saheed Residency • P001)</option>
              <option value="B02">B02 (Nagar Heights • P001)</option>
              <option value="B03">B03 (Jaydev Tower • P002)</option>
              <option value="B04">B04 (Vihar Commercial • P002)</option>
              <option value="B05">B05 (Nayapalli Villa • P003)</option>
              <option value="B06">B06 (CSP Business • P004)</option>
              <option value="B07">B07 (CSP Mixed Use • P004)</option>
              <option value="B08">B08 (Patia Premium • P005)</option>
            </select>
          </div>
        </div>

        {/* 3D Exploded View Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700 px-4 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400 font-medium">Explosion Spacing:</span>
            <input 
              type="range" 
              min="0.5" 
              max="3.0" 
              step="0.1"
              value={explodeFactor}
              onChange={(e) => {
                setExplodeFactor(parseFloat(e.target.value));
                setIsExploded(true);
                setIsolatedFloor(false);
              }}
              className="w-24 accent-blue-500 cursor-pointer"
            />
            <span className="font-mono text-blue-400 font-bold">{explodeFactor.toFixed(1)}x</span>
          </div>

          <button 
            onClick={() => { setIsExploded(!isExploded); setIsolatedFloor(false); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              isExploded 
                ? 'bg-blue-600 text-white shadow-blue-500/20' 
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            {isExploded ? 'Collapse View' : 'Explode Building'}
          </button>

          <button 
            onClick={() => setIsolatedFloor(!isolatedFloor)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isolatedFloor 
                ? 'bg-purple-600 text-white shadow-purple-500/20' 
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            {isolatedFloor ? 'Show Full Tower' : 'Isolate Floor'}
          </button>
        </div>
      </div>

      {/* Main 3D Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Side: Vertical Floor Selector Stack */}
        <div className="w-64 bg-slate-900/70 backdrop-blur-md border-r border-slate-800 flex flex-col p-4 z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Vertical Floors</span>
            <span className="text-[11px] font-mono text-blue-400">Total: 7</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {[6, 5, 4, 3, 2, 1, 0].map((fNum) => {
              const isSelected = selectedFloor === fNum;
              const label = fNum === 0 ? 'Ground Floor (Commercial)' : fNum === 6 ? 'Floor 6 (Penthouse)' : `Floor ${fNum} (Residential)`;
              return (
                <button
                  key={fNum}
                  onClick={() => {
                    setSelectedFloor(fNum);
                    const units = FLOOR_UNITS[fNum] || FLOOR_UNITS[4];
                    setSelectedUnit(units[0]);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-blue-500 text-white shadow-lg' 
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white">{label}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Elevation: {(fNum * 3.0).toFixed(1)}m • {FLOOR_UNITS[fNum]?.length || 4} Units
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-blue-400 translate-x-1' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: 3D Canvas Visualizer */}
        <div ref={containerRef} className="flex-1 relative cursor-grab active:cursor-grabbing">
          {/* Floating Instructions Overlay */}
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 text-xs text-slate-300 font-mono flex items-center gap-2 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Click + Drag to Orbit • Scroll to Zoom
          </div>
        </div>

        {/* Right Side: Unit & ULPIN Intelligence Panel */}
        <div className="w-96 bg-slate-900/90 backdrop-blur-xl border-l border-slate-800 flex flex-col z-10">
          <div className="p-5 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Home className="w-4 h-4 text-blue-400" /> Units on Floor {selectedFloor}
            </h2>
            <p className="text-xs text-slate-400 mt-1">Select an individual volumetric space unit</p>
          </div>

          <div className="p-5 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
            {/* Units Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {currentUnits.map((u) => {
                const isSelected = selectedUnit.unit_number === u.unit_number;
                return (
                  <button
                    key={u.unit_number}
                    onClick={() => setSelectedUnit(u)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected 
                        ? 'bg-blue-600/30 border-blue-400 shadow-md ring-1 ring-blue-400' 
                        : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-white">Unit {u.unit_number}</span>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: u.color }}></span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{u.type}</div>
                    <div className="text-[11px] font-mono text-blue-300 mt-1">{u.area} m²</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Unit 3D ULPIN Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950/40 border border-blue-500/40 shadow-inner space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Unit 3D ULPIN</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {selectedUnit.validation}
                </span>
              </div>
              <div className="text-sm font-mono font-extrabold text-white break-all bg-slate-950 p-2.5 rounded-lg border border-slate-800 select-all">
                {currentULPIN}
              </div>
            </div>

            {/* Property Intelligence Breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Owner</span>
                  <span className="font-bold text-white">{selectedUnit.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Property Class</span>
                  <span className="font-semibold text-slate-200">{selectedUnit.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Floor Number</span>
                  <span className="font-semibold text-blue-400">Level {selectedFloor} (Z: {(selectedFloor * 3).toFixed(1)}m)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Unit Area</span>
                  <span className="font-semibold text-white">{selectedUnit.area} m² ({Math.round(selectedUnit.area * 10.764)} sq.ft)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="font-bold text-emerald-400">{selectedUnit.status}</span>
                </div>
              </div>

              {/* Spatial Verification badge */}
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-emerald-200 leading-snug">
                  Verified with 3D terrestrial LiDAR. Cadastral floor plan matches volumetric spatial envelope.
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900 space-y-2">
            <button 
              onClick={() => navigate(`/map?ulpin=${currentULPIN}`)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2 rounded-xl text-xs shadow-md transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> Locate in 3D GIS Map
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate(`/ar-vr?building=${buildingId}&floor=${selectedFloor}&unit=${selectedUnit.unit_number}`)}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold py-2 rounded-xl text-xs transition-colors border border-purple-500/30"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AR/VR Mode
              </button>
              <button 
                onClick={() => navigate(`/registry?search=${currentULPIN}`)}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 rounded-xl text-xs transition-colors border border-slate-700"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" /> Registry
              </button>
            </div>
            <button 
              onClick={() => setShowCertModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-medium py-2 rounded-xl text-xs transition-colors border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" /> Official 3D Certificate
            </button>
          </div>
        </div>
      </div>

      {/* Official 3D Title Certificate Modal */}
      <CertificateModal 
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        ulpin={currentULPIN}
        buildingName={`Jaydev Tower (${buildingId})`}
        floorNumber={selectedFloor}
        unitNumber={selectedUnit.unit_number}
        ownerName={selectedUnit.owner}
        areaSqm={selectedUnit.area}
        propertyType={`${selectedUnit.type} (Freehold)`}
      />
    </div>
  );
}
