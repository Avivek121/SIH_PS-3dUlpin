import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { 
  Layers, X, Download, Eye, FileText, CheckCircle, AlertTriangle, 
  Compass, Maximize2, RotateCcw, ZoomIn, ZoomOut, Search, MapPin, 
  ShieldCheck, ArrowUpRight, BarChart3, Info, Sparkles
} from 'lucide-react';
import { ulpinApi } from '../api/ulpin';
import { propertiesApi } from '../api/properties';
import { useMapStore } from '../store/mapStore';
import CertificateModal from '../components/certificate/CertificateModal';

interface BuildingData {
  id: string;
  building_id: string;
  name: string;
  parcel_id: string;
  floors: number;
  height: number;
  type: string;
  year: number;
  x: number;
  z: number;
  width: number;
  depth: number;
  color: string;
}

const DEMO_BUILDINGS: BuildingData[] = [
  { id: 'b01', building_id: 'B01', name: 'Saheed Residency', parcel_id: 'P001', floors: 4, height: 12, type: 'Residential', year: 2018, x: -30, z: -20, width: 14, depth: 12, color: '#3b82f6' },
  { id: 'b02', building_id: 'B02', name: 'Nagar Heights', parcel_id: 'P001', floors: 6, height: 18, type: 'Residential', year: 2020, x: -10, z: -22, width: 15, depth: 14, color: '#6366f1' },
  { id: 'b03', building_id: 'B03', name: 'Jaydev Tower', parcel_id: 'P002', floors: 8, height: 24, type: 'Mixed Use', year: 2019, x: 20, z: -10, width: 18, depth: 16, color: '#8b5cf6' },
  { id: 'b04', building_id: 'B04', name: 'Vihar Commercial Complex', parcel_id: 'P002', floors: 5, height: 15, type: 'Commercial', year: 2021, x: 42, z: -12, width: 16, depth: 14, color: '#f59e0b' },
  { id: 'b05', building_id: 'B05', name: 'Nayapalli Villa', parcel_id: 'P003', floors: 3, height: 9, type: 'Residential', year: 2015, x: -40, z: 25, width: 12, depth: 10, color: '#10b981' },
  { id: 'b06', building_id: 'B06', name: 'CSP Business Center', parcel_id: 'P004', floors: 10, height: 30, type: 'Commercial', year: 2022, x: 25, z: 30, width: 22, depth: 18, color: '#f97316' },
  { id: 'b07', building_id: 'B07', name: 'CSP Mixed Use', parcel_id: 'P004', floors: 7, height: 21, type: 'Mixed Use', year: 2017, x: 50, z: 28, width: 16, depth: 15, color: '#ec4899' },
  { id: 'b08', building_id: 'B08', name: 'Patia Premium Apartments', parcel_id: 'P005', floors: 9, height: 27, type: 'Residential', year: 2023, x: -15, z: 45, width: 20, depth: 16, color: '#06b6d4' },
];

const PARCELS = [
  { id: 'P001', name: 'Plot 12, Saheed Nagar', x: -20, z: -20, width: 45, depth: 35, color: '#3b82f6', zone: 'Residential Zone A' },
  { id: 'P002', name: 'Plot 45, Jaydev Vihar', x: 30, z: -10, width: 50, depth: 40, color: '#8b5cf6', zone: 'Commercial Corridor' },
  { id: 'P003', name: 'Plot 8, Nayapalli', x: -40, z: 25, width: 35, depth: 30, color: '#10b981', zone: 'Low-density Residential' },
  { id: 'P004', name: 'Plot 22, Chandrasekharpur', x: 38, z: 30, width: 55, depth: 45, color: '#f59e0b', zone: 'High-Tech District' },
  { id: 'P005', name: 'Plot 67, Patia', x: -15, z: 45, width: 45, depth: 35, color: '#06b6d4', zone: 'Mixed Development' },
];

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(DEMO_BUILDINGS[2]); // Default B03
  const [selectedFloor, setSelectedFloor] = useState<number>(4);
  const [selectedUnit, setSelectedUnit] = useState<string>('402');
  const [panelOpen, setPanelOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'3d' | 'top' | 'lidar'>('3d');
  const [showCertModal, setShowCertModal] = useState(false);
  
  // Layer toggles
  const [layers, setLayers] = useState({
    parcels: true,
    buildings: true,
    floors: true,
    units: true,
    lidar: false,
    roads: true,
    terrain: true,
    underground: false,
  });

  const queryULPIN = searchParams.get('ulpin');

  // Handle ULPIN query search from URL
  useEffect(() => {
    if (queryULPIN) {
      // Parse query e.g. OD-BBSR-W12-P001-B03-F04-U02
      const matchedBuilding = DEMO_BUILDINGS.find(b => queryULPIN.includes(b.building_id)) || DEMO_BUILDINGS[2];
      setSelectedBuilding(matchedBuilding);
      
      const floorMatch = queryULPIN.match(/F(\d+)/);
      if (floorMatch) {
        setSelectedFloor(parseInt(floorMatch[1], 10));
      }
      
      const unitMatch = queryULPIN.match(/U(\d+)/);
      if (unitMatch) {
        setSelectedUnit(unitMatch[1].length === 2 ? `${selectedFloor}${unitMatch[1]}` : unitMatch[1]);
      }
      setPanelOpen(true);
    }
  }, [queryULPIN]);

  // Three.js Interactive 3D GIS Viewer Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    scene.fog = new THREE.FogExp2(0x0f172a, 0.005);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(60, 50, 75);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(100, 150, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    const blueLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
    blueLight.position.set(-80, 50, -80);
    scene.add(blueLight);

    // Terrain Grid / Ground
    const gridHelper = new THREE.GridHelper(250, 50, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = -0.1;
    scene.add(gridHelper);

    const groundGeo = new THREE.PlaneGeometry(300, 300);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: 0x090d16, 
      roughness: 0.9, 
      metalness: 0.1 
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Roads Group
    const roadsGroup = new THREE.Group();
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    
    // Main Roads
    const road1 = new THREE.Mesh(new THREE.PlaneGeometry(300, 8), roadMat);
    road1.rotation.x = -Math.PI / 2;
    road1.position.set(0, 0.05, 5);
    roadsGroup.add(road1);

    const road2 = new THREE.Mesh(new THREE.PlaneGeometry(8, 300), roadMat);
    road2.rotation.x = -Math.PI / 2;
    road2.position.set(0, 0.05, 0);
    roadsGroup.add(road2);
    scene.add(roadsGroup);

    // Parcels Group
    const parcelsGroup = new THREE.Group();
    PARCELS.forEach(p => {
      const pGeo = new THREE.PlaneGeometry(p.width, p.depth);
      const pMat = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(p.color), 
        transparent: true, 
        opacity: 0.12, 
        side: THREE.DoubleSide 
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.rotation.x = -Math.PI / 2;
      pMesh.position.set(p.x, 0.08, p.z);
      parcelsGroup.add(pMesh);

      // Boundary Line
      const edges = new THREE.EdgesGeometry(pGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color(p.color), linewidth: 2 });
      const line = new THREE.LineSegments(edges, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(p.x, 0.1, p.z);
      parcelsGroup.add(line);
    });
    scene.add(parcelsGroup);

    // Buildings Group & Raycasting Meshes
    const buildingsGroup = new THREE.Group();
    const buildingMeshes: THREE.Mesh[] = [];

    DEMO_BUILDINGS.forEach(b => {
      const bGeo = new THREE.BoxGeometry(b.width, b.height, b.depth);
      const isSelected = selectedBuilding?.building_id === b.building_id;
      
      const bMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x60a5fa : new THREE.Color(b.color),
        roughness: 0.3,
        metalness: 0.4,
        transparent: true,
        opacity: 0.85,
        wireframe: false
      });

      const mesh = new THREE.Mesh(bGeo, bMat);
      mesh.position.set(b.x, b.height / 2, b.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { buildingData: b };
      buildingsGroup.add(mesh);
      buildingMeshes.push(mesh);

      // Floor Lines
      const floorHeight = b.height / b.floors;
      for (let f = 1; f < b.floors; f++) {
        const floorGeo = new THREE.BoxGeometry(b.width + 0.1, 0.1, b.depth + 0.1);
        const floorMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
        const floorMesh = new THREE.Mesh(floorGeo, floorMat);
        floorMesh.position.set(b.x, f * floorHeight, b.z);
        buildingsGroup.add(floorMesh);
      }

      // Edges for sharp architectural look
      const edges = new THREE.EdgesGeometry(bGeo);
      const edgeMat = new THREE.LineBasicMaterial({ 
        color: isSelected ? 0x93c5fd : 0x475569, 
        linewidth: isSelected ? 2 : 1 
      });
      const edgeLine = new THREE.LineSegments(edges, edgeMat);
      edgeLine.position.copy(mesh.position);
      buildingsGroup.add(edgeLine);
    });
    scene.add(buildingsGroup);

    // LiDAR Point Cloud (12,000 points)
    const pointsCount = 12000;
    const pointsGeo = new THREE.BufferGeometry();
    const pointsPos = new Float32Array(pointsCount * 3);
    const pointsCol = new Float32Array(pointsCount * 3);

    for (let i = 0; i < pointsCount; i++) {
      const px = (Math.random() - 0.5) * 180;
      const pz = (Math.random() - 0.5) * 180;
      const py = Math.max(0, Math.sin(px * 0.05) * Math.cos(pz * 0.05) * 8 + Math.random() * 15);
      
      pointsPos[i * 3] = px;
      pointsPos[i * 3 + 1] = py;
      pointsPos[i * 3 + 2] = pz;

      // Color by height (elevation palette)
      const color = new THREE.Color().setHSL(0.6 - (py / 30) * 0.5, 1.0, 0.55);
      pointsCol[i * 3] = color.r;
      pointsCol[i * 3 + 1] = color.g;
      pointsCol[i * 3 + 2] = color.b;
    }
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(pointsPos, 3));
    pointsGeo.setAttribute('color', new THREE.BufferAttribute(pointsCol, 3));

    const pointsMat = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: layers.lidar ? 0.9 : 0.0
    });
    const lidarCloud = new THREE.Points(pointsGeo, pointsMat);
    scene.add(lidarCloud);

    // Target animation coordinates
    let targetCameraPos = new THREE.Vector3(60, 50, 75);
    let targetLookAt = new THREE.Vector3(0, 5, 0);
    const currentLookAt = new THREE.Vector3(0, 5, 0);

    if (selectedBuilding) {
      targetLookAt = new THREE.Vector3(selectedBuilding.x, selectedBuilding.height / 2, selectedBuilding.z);
      targetCameraPos = new THREE.Vector3(
        selectedBuilding.x + 35,
        selectedBuilding.height + 25,
        selectedBuilding.z + 35
      );
    }

    // Mouse Interaction / Orbit Controls emulation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = { radius: 100, theta: 0.8, phi: 1.0 };

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
      spherical.radius = Math.max(20, Math.min(200, spherical.radius + e.deltaY * 0.1));
    };

    // Raycaster for building selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(buildingMeshes);

      if (intersects.length > 0) {
        const hitBuilding = intersects[0].object.userData.buildingData as BuildingData;
        setSelectedBuilding(hitBuilding);
        setPanelOpen(true);
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', onClick);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Visibility updates from state
      parcelsGroup.visible = layers.parcels;
      buildingsGroup.visible = layers.buildings;
      roadsGroup.visible = layers.roads;
      pointsMat.opacity = layers.lidar ? 0.9 : 0.0;

      // Update camera smooth movement
      if (selectedBuilding && !isDragging) {
        targetLookAt.set(selectedBuilding.x, selectedBuilding.height / 2, selectedBuilding.z);
      }
      
      if (isDragging) {
        camera.position.x = targetLookAt.x + spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
        camera.position.y = targetLookAt.y + spherical.radius * Math.cos(spherical.phi);
        camera.position.z = targetLookAt.z + spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      } else {
        camera.position.lerp(targetCameraPos, 0.04);
      }

      currentLookAt.lerp(targetLookAt, 0.05);
      camera.lookAt(currentLookAt);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [selectedBuilding, layers]);

  const activeULPIN = selectedBuilding 
    ? `OD-BBSR-W12-${selectedBuilding.parcel_id}-${selectedBuilding.building_id}-F${selectedFloor.toString().padStart(2, '0')}-U${selectedUnit.slice(-2).padStart(2, '0')}`
    : 'OD-BBSR-W12-P002-B03-F04-U02';

  return (
    <div className="absolute inset-0 flex flex-col bg-slate-950 font-sans overflow-hidden">
      {/* Top Map Header & Controls Bar */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-3">
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700/80 shadow-2xl flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
          <div>
            <div className="text-xs font-semibold text-slate-200">Bhubaneswar Ward 12 Digital Twin</div>
            <div className="text-[11px] text-slate-400 font-mono">20.2961° N, 85.8245° E • 3D GIS Active</div>
          </div>
        </div>

        {/* View Mode Presets */}
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 flex gap-1 shadow-2xl">
          <button 
            onClick={() => setViewMode('3d')} 
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === '3d' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            3D Globe
          </button>
          <button 
            onClick={() => { setViewMode('lidar'); setLayers(l => ({ ...l, lidar: !l.lidar })); }} 
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${layers.lidar ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            LiDAR Cloud
          </button>
        </div>
      </div>

      {/* 3D Map WebGL Canvas */}
      <div ref={containerRef} className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing" id="cesium-container">
        {/* Navigation Compass & Zoom Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          {!panelOpen && (
            <button 
              onClick={() => setPanelOpen(true)}
              className="p-3 bg-slate-900/90 backdrop-blur-md hover:bg-blue-600 text-white rounded-xl border border-slate-700 shadow-xl transition-all"
              title="Open Property Panel"
            >
              <Layers className="w-5 h-5 text-blue-400" />
            </button>
          )}
        </div>
      </div>

      {/* Layer Controls Bar - Bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl px-6 py-3.5 flex items-center gap-5 shadow-2xl max-w-3xl overflow-x-auto">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-r border-slate-700 pr-4">
          <Layers className="w-4 h-4 text-blue-400" /> Layers
        </div>
        {[
          { key: 'parcels', label: 'Parcels' },
          { key: 'buildings', label: '3D Buildings' },
          { key: 'floors', label: 'Floors' },
          { key: 'units', label: 'Units' },
          { key: 'lidar', label: 'LiDAR' },
          { key: 'roads', label: 'Roads' },
          { key: 'terrain', label: 'Terrain' },
        ].map((item) => (
          <label key={item.key} className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white transition-colors text-xs font-medium whitespace-nowrap">
            <input 
              type="checkbox" 
              checked={layers[item.key as keyof typeof layers]} 
              onChange={() => setLayers(l => ({ ...l, [item.key]: !l[item.key as keyof typeof layers] }))}
              className="rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900 w-3.5 h-3.5" 
            />
            {item.label}
          </label>
        ))}
      </div>

      {/* Right Slide-Over Property Information Panel */}
      {panelOpen && selectedBuilding && (
        <div className="absolute top-0 right-0 w-[420px] h-full bg-slate-900/95 backdrop-blur-2xl shadow-[-15px_0_40px_rgba(0,0,0,0.6)] z-30 flex flex-col border-l border-slate-800 animate-in slide-in-from-right duration-300">
          {/* Panel Header */}
          <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-100 text-base">Property Space</h2>
                <span className="text-xs text-slate-400">SIH 2026 Verified Record</span>
              </div>
            </div>
            <button 
              onClick={() => setPanelOpen(false)} 
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-slate-200">
            {/* 3D ULPIN Code Header Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/40 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">Official 3D ULPIN</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  VERIFIED
                </span>
              </div>
              <div className="text-base font-mono font-extrabold text-white tracking-wide break-all select-all bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                {activeULPIN}
              </div>
              <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
                <span>Format: State-City-Ward-Parcel-Bldg-Floor-Unit</span>
              </div>
            </div>

            {/* Hierarchical Space Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> Spatial Hierarchy
              </h3>
              
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block mb-1">Building</span>
                  <span className="font-bold text-white text-sm">{selectedBuilding.name} ({selectedBuilding.building_id})</span>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block mb-1">Parcel ID</span>
                  <span className="font-bold text-white text-sm">{selectedBuilding.parcel_id}</span>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block mb-1">Selected Floor</span>
                  <span className="font-bold text-blue-400 text-sm">Floor {selectedFloor} of {selectedBuilding.floors}</span>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 block mb-1">Unit Number</span>
                  <span className="font-bold text-emerald-400 text-sm">Unit {selectedUnit}</span>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-blue-400" /> Ownership & Specifications
              </h3>
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Owner Name</span>
                  <span className="font-semibold text-white">Rajesh Kumar Patel</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Property Type</span>
                  <span className="font-semibold text-white">{selectedBuilding.type} Space</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Carpet Area</span>
                  <span className="font-semibold text-white">125.0 m² (1,345 sq.ft)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">Building Height</span>
                  <span className="font-semibold text-white">{selectedBuilding.height}m ({selectedBuilding.floors} Storeys)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Registration Status</span>
                  <span className="font-bold text-emerald-400">Registered with Authority</span>
                </div>
              </div>
            </div>

            {/* Validation & Discrepancy Analysis */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> AI Spatial Validation
              </h3>
              <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-3.5 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-300">LiDAR 3D Volume Matched</div>
                  <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    Terrestrial LiDAR scan matches municipal cadastral records within 0.8% deviation. Zero encroachments detected.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="p-5 border-t border-slate-800 bg-slate-900 space-y-2.5">
            <button 
              onClick={() => navigate(`/explorer?building=${selectedBuilding.building_id}&floor=${selectedFloor}&unit=${selectedUnit}`)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-2.5 rounded-xl shadow-lg transition-all text-xs"
            >
              <Eye className="w-4 h-4" /> Open Vertical Building Explorer
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/registry-history')}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 rounded-xl border border-slate-700 transition-colors text-xs"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" /> Registry History
              </button>
              <button 
                onClick={() => setShowCertModal(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2 rounded-xl border border-slate-700 transition-colors text-xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" /> Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official 3D ULPIN Title Certificate Modal */}
      <CertificateModal 
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        ulpin={activeULPIN}
        buildingName={selectedBuilding ? `${selectedBuilding.name} (${selectedBuilding.building_id})` : 'Jaydev Tower (B03)'}
        floorNumber={selectedFloor}
        unitNumber={selectedUnit}
        ownerName="Rajesh Kumar Patel"
        areaSqm={125.0}
        propertyType={selectedBuilding ? `${selectedBuilding.type} Apartment Space` : 'Residential Apartment Space'}
      />
    </div>
  );
}
