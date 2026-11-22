import React, { useState } from 'react';
import { 
  Plane, 
  Cpu, 
  Camera, 
  Compass, 
  Layers, 
  ShieldCheck, 
  Gauge, 
  BatteryCharging, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Download,
  Info,
  Sliders,
  ChevronRight,
  ExternalLink,
  Wifi,
  Wind
} from 'lucide-react';

interface SensorSpec {
  id: string;
  name: string;
  bands: string[];
  resolutionGsd: string;
  spectralRange: string;
  weightGrams: number;
  primaryUse: string;
  bestSuitedFor: string;
}

const SENSOR_PAYLOADS: SensorSpec[] = [
  {
    id: 'micasense-rededge-p',
    name: 'MicaSense RedEdge-P (5-Band Multispectral + Pan)',
    bands: ['Blue (475nm)', 'Green (560nm)', 'Red (668nm)', 'RedEdge (717nm)', 'NIR (842nm)', 'Panchromatic (Pan-sharpened)'],
    resolutionGsd: '2.0 cm/px at 60m AGL (Pan-sharpened)',
    spectralRange: '400 nm - 900 nm',
    weightGrams: 350,
    primaryUse: 'Early Chlorophyll & Nitrogen deficiency detection, NDRE, high-resolution smallholder parcel boundary mapping',
    bestSuitedFor: 'Kharif Sali paddy vegetative tillering and grain filling stages'
  },
  {
    id: 'altum-pt',
    name: 'MicaSense Altum-PT (Multispectral + Radiometric Thermal LWIR)',
    bands: ['5 Multispectral Bands', 'High-Res Pan Band', 'Thermal Infrared LWIR (8 - 14 µm, FLIR Boson 640x512)'],
    resolutionGsd: '1.2 cm/px Pan / 17 cm/px Thermal at 60m AGL',
    spectralRange: '400 nm - 14,000 nm',
    weightGrams: 460,
    primaryUse: 'Crop Water Stress Index (CWSI), soil moisture deficit, stomatal closure & transpiration monitoring',
    bestSuitedFor: 'Summer Boro paddy irrigation efficiency and post-flood salvage assessment'
  },
  {
    id: 'zenmuse-p1',
    name: 'Full-Frame 45MP RGB Photogrammetry (Zenmuse P1 / Sony RX1R II)',
    bands: ['True Color RGB (3-Band Bayer Filter)'],
    resolutionGsd: '0.8 cm/px at 60m AGL',
    spectralRange: 'Visible (400 - 700 nm)',
    weightGrams: 800,
    primaryUse: 'Centimeter-grade Digital Elevation Models (DEM), 3D point clouds, micro-bund cadastral edge delineation',
    bestSuitedFor: 'Dharitree cadastral map reconciliation and 5m x 5m CCE quadrant boundary placement'
  },
  {
    id: 'livox-avia-lidar',
    name: 'Miniaturized Aerial LiDAR (Livox Avia / Hesai Pandar40P)',
    bands: ['905 nm NIR Laser Scanner (Tri-Return Pulses)'],
    resolutionGsd: '240,000 points/sec, 2 cm vertical accuracy',
    spectralRange: 'Active Pulsed Laser (905 nm)',
    weightGrams: 498,
    primaryUse: 'Dense canopy penetration to measure true ground topography and standing crop height (Canopy Height Model)',
    bestSuitedFor: 'Flooded char areas and dense mature Sali rice lodging analysis'
  }
];

const HARDWARE_BOM = [
  { item: 'Hybrid VTOL UAV Airframe (SkyEye-Assam)', specs: 'Carbon fiber composite, 2.4m wingspan, 120-min endurance, 80 km/h cruise', vendor: 'Make in India / Type Certified', status: 'Field Ready' },
  { item: 'Precision Heavy-Lift Quadcopter (SasyaRotor-6)', specs: 'Foldable arms, 42-min flight time, IP55 rainproof, 15 m/s wind tolerance', vendor: 'DGCA Certified OEM', status: 'Operational' },
  { item: 'MicaSense RedEdge-P Multispectral Sensor', specs: 'Calibrated reflectance panel (CRP), Downwelling Light Sensor (DLS 2)', vendor: 'AgEagle / MicaSense', status: 'Calibrated' },
  { item: 'Dual-Frequency D-RTK 2 GNSS Base Station', specs: 'Multi-constellation (GPS, GLONASS, BeiDou, Galileo), 1cm + 1ppm accuracy', vendor: 'Survey Grade RTK', status: 'Locked' },
  { item: 'Toughbook G2 Rugged Ground Station Tablet', specs: 'MIL-STD-810H, 1000 nit sunlight viewable, dual hot-swappable batteries', vendor: 'Panasonic Enterprise', status: 'Active' },
  { item: 'High-Capacity Solid-State Li-Po Batteries', specs: '6S 22,000mAh smart batteries, integrated BMS with telemetry logging', vendor: 'Tattu Enterprise Series', status: '100% Health' },
  { item: 'Edge Photogrammetry Workstation', specs: 'NVIDIA RTX 4090 (24GB VRAM), 64GB DDR5 RAM, WebODM / Pix4D Docker engine', vendor: 'Assam State Data Center', status: 'Online' }
];

export const DroneTechShowcase: React.FC = () => {
  // Flight Mission Simulator state
  const [terrainType, setTerrainType] = useState<'char' | 'floodplain' | 'hills'>('floodplain');
  const [selectedSensorId, setSelectedSensorId] = useState<string>('micasense-rededge-p');
  const [altitudeMeters, setAltitudeMeters] = useState<number>(80);
  const [targetBighas, setTargetBighas] = useState<number>(100);

  // Dynamic calculations for mission simulator
  const activeSensor = SENSOR_PAYLOADS.find(s => s.id === selectedSensorId) || SENSOR_PAYLOADS[0];
  
  // GSD calculation based on altitude
  const calculatedGsd = ((altitudeMeters / 60) * (selectedSensorId === 'zenmuse-p1' ? 0.8 : selectedSensorId === 'altum-pt' ? 1.6 : 2.5)).toFixed(1);
  
  // Area in hectares (1 Bigha = 0.13378 Ha)
  const targetHectares = (targetBighas * 0.13378).toFixed(1);
  
  // Speed based on terrain (m/s)
  const flightSpeed = terrainType === 'char' ? 14 : terrainType === 'hills' ? 8 : 11;
  
  // Flight time in minutes
  const flightMinutes = Math.max(8, Math.round((Number(targetHectares) * 1.8 * (100 / altitudeMeters))));
  
  // Battery swaps needed (assuming 30 min operational safety per battery)
  const batterySwaps = Math.floor(flightMinutes / 28);
  
  // Estimated number of photos (75% forward, 70% side overlap)
  const estimatedPhotos = Math.round(Number(targetHectares) * (altitudeMeters <= 70 ? 45 : altitudeMeters <= 90 ? 30 : 20));
  
  // Estimated raw data volume in Gigabytes
  const rawDataGb = ((estimatedPhotos * (selectedSensorId === 'altum-pt' ? 18 : selectedSensorId === 'zenmuse-p1' ? 24 : 12)) / 1024).toFixed(2);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Header Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-amber-900/10 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                NESFIC-D-12 Specialized Hardware &amp; Aerial Tech
              </span>
              <span className="bg-stone-100 text-stone-700 border border-stone-300 px-2.5 py-0.5 rounded text-xs font-semibold">
                ড্ৰোন প্ৰযুক্তি আৰু সংবেদন
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Drone Technology, Payloads &amp; Photogrammetry Pipeline
            </h1>
            <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
              Precision Unmanned Aerial Vehicle (UAV) systems engineered to overcome smallholder plot fragmentation, 
              micro-bund boundary delineation, and localized flood damage across the Brahmaputra and Barak river basins.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#drone-cce"
              className="inline-flex items-center space-x-2 bg-amber-800 hover:bg-amber-900 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plane className="w-4 h-4" />
              <span>Go to Field CCE Dispatcher</span>
            </a>
            <div className="px-3.5 py-2 bg-amber-50 border border-amber-200/80 rounded-lg text-xs text-amber-900 font-mono">
              <span className="font-bold">DGCA NPNT:</span> Type Certified
            </div>
          </div>
        </div>
      </div>

      {/* Visual Resolution Hierarchy Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-amber-900/10 p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-3 border-b border-stone-200 pb-2">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
            <Layers className="w-4 h-4 text-amber-800" />
            <span>Multi-Tier Spatial Resolution Hierarchy: Coarse Satellite to 3.5cm Drone</span>
          </div>
          <a
            href="/proposal_diagrams/diagram_3_smallholder_resolution_stack.png"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View Fullscreen</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <img 
          src="/proposal_diagrams/diagram_3_smallholder_resolution_stack.png" 
          alt="Smallholder Parcel Resolution Stack" 
          className="w-full rounded-lg border border-stone-200 shadow-2xs"
        />
      </div>

      {/* Airframe Architecture: VTOL vs Quadcopter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* VTOL Airframe Card */}
        <div className="bg-white rounded-xl shadow-xs border border-amber-900/10 overflow-hidden hover:border-amber-700/30 transition-all">
          <div className="bg-[#2d1b11] text-white p-5 border-b border-amber-900/40 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-amber-800/80 flex items-center justify-center text-amber-200">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Hybrid VTOL Fixed-Wing Airframe</h2>
                <p className="text-xs text-amber-200/80">SkyEye Assam-VTOL • Riverine Char &amp; Block-Level Surveys</p>
              </div>
            </div>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded text-[11px] font-mono font-semibold">
              120 min Flight Time
            </span>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed">
              Combines the vertical takeoff versatility of a multirotor with the high aerodynamic cruise efficiency of a fixed-wing plane. 
              Eliminates the need for runways in inundated riverine chars and marshy wetlands.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg">
                <span className="text-[11px] text-stone-500 font-medium block">Cruising Speed</span>
                <span className="text-sm font-bold text-stone-900">75 - 90 km/h</span>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg">
                <span className="text-[11px] text-stone-500 font-medium block">Telemetry Link Range</span>
                <span className="text-sm font-bold text-stone-900">45 km (Dual AES-256)</span>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg">
                <span className="text-[11px] text-stone-500 font-medium block">Area Coverage Per Flight</span>
                <span className="text-sm font-bold text-stone-900">800 - 1,200 Bighas</span>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg">
                <span className="text-[11px] text-stone-500 font-medium block">Wind Tolerance</span>
                <span className="text-sm font-bold text-stone-900">Up to 14 m/s (Level 6)</span>
              </div>
            </div>

            <div className="bg-amber-50/60 border border-amber-200/60 p-3.5 rounded-lg space-y-1.5 text-xs text-amber-950">
              <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                Target Deployment Use-Case:
              </div>
              <p className="text-amber-900/90 leading-normal">
                Continuous mapping of entire riverine island agricultural belts (e.g. Baghbar, Barpeta, Majuli char lands) where road connectivity 
                and physical access are severed by monsoon inundation.
              </p>
            </div>
          </div>
        </div>

        {/* Heavy-Lift Quad/Hexacopter Card */}
        <div className="bg-white rounded-xl shadow-xs border border-amber-900/10 overflow-hidden hover:border-amber-700/30 transition-all">
          <div className="bg-[#2d1b11] text-white p-5 border-b border-amber-900/40 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-amber-800/80 flex items-center justify-center text-amber-200">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Precision Multirotor RTK Hexacopter</h2>
                <p className="text-xs text-amber-200/80">SasyaRotor RTK-6 • Smallholder Cadastral Parcel Inspections</p>
              </div>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded text-[11px] font-mono font-semibold">
              Sub-3cm Accuracy
            </span>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed">
              Heavy-lift, ultra-stable multirotor designed for low-altitude (60m AGL) high-resolution inspections. Equipped with dual RTK antennas 
              and magnetic immunity to powerlines, enabling centimeter-level parcel boundary locking.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg">
                <span className="text-[11px] text-stone-500 font-medium block">Flight Duration</span>
                <span className="text-sm font-bold text-stone-900">42 mins with 1.5kg payload</span>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg">
                <span className="text-[11px] text-stone-500 font-medium block">Hovering Precision (RTK)</span>
                <span className="text-sm font-bold text-stone-900">1.0 cm H / 1.5 cm V</span>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg">
                <span className="text-[11px] text-stone-500 font-medium block">Weather Sealing</span>
                <span className="text-sm font-bold text-stone-900">IP55 (Heavy Rain Rated)</span>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-lg">
                <span className="text-[11px] text-stone-500 font-medium block">Obstacle Avoidance</span>
                <span className="text-sm font-bold text-stone-900">6-Direction Millimeter Radar</span>
              </div>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200/60 p-3.5 rounded-lg space-y-1.5 text-xs text-emerald-950">
              <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                Target Deployment Use-Case:
              </div>
              <p className="text-emerald-900/90 leading-normal">
                High-precision 5m x 5m CCE quadrant validation, localized pest outbreak mapping, and resolving disputed smallholder Dag boundaries 
                along narrow field bunds (Ali) in intensive paddy clusters.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Multispectral & Optical Sensor Payloads */}
      <div className="bg-white rounded-xl shadow-xs border border-amber-900/10 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-800" />
              Multispectral, Thermal &amp; LiDAR Payloads
            </h2>
            <p className="text-xs text-stone-600">
              Specialized scientific optical payloads providing sub-decimeter spectral and volumetric vegetation insights.
            </p>
          </div>
          <span className="text-xs font-mono bg-stone-100 text-stone-700 px-3 py-1 rounded border border-stone-300">
            Calibrated Reflectance Panels (CRP)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SENSOR_PAYLOADS.map((sensor) => {
            const isSelected = selectedSensorId === sensor.id;
            return (
              <div 
                key={sensor.id}
                onClick={() => setSelectedSensorId(sensor.id)}
                className={`p-5 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-amber-800 bg-amber-50/30 ring-1 ring-amber-700/50 shadow-xs' 
                    : 'border-stone-200 bg-stone-50/40 hover:bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-bold text-stone-900">{sensor.name}</h3>
                  <span className="text-[11px] font-mono bg-white text-stone-700 border border-stone-200 px-2 py-0.5 rounded shrink-0">
                    {sensor.weightGrams}g
                  </span>
                </div>

                <p className="text-xs text-stone-600 mb-3">{sensor.primaryUse}</p>

                <div className="space-y-1.5 text-xs text-stone-700">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-stone-900">Ground Resolution:</span>
                    <span className="font-mono text-amber-900 font-medium">{sensor.resolutionGsd}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900">Spectral Bands:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sensor.bands.map((b, idx) => (
                        <span key={idx} className="bg-white border border-stone-200 px-1.5 py-0.5 rounded text-[10px] text-stone-600">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-1.5 text-[11px] text-amber-900 font-medium">
                    <span className="font-semibold">Assam Target:</span> {sensor.bestSuitedFor}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Flight Mission & Payload Simulator */}
      <div className="bg-white rounded-xl shadow-xs border border-amber-900/10 p-6 sm:p-8 space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-800" />
              Interactive Flight Mission &amp; Payload Simulator
            </h2>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold">
              Real-Time Telemetry
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Simulate flight parameters for agricultural clusters across different agro-climatic terrains in Assam.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Controls Panel */}
          <div className="space-y-4 bg-stone-50 border border-stone-200 p-5 rounded-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">Mission Parameters</h3>

            {/* Terrain Selection */}
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1.5">Assam Terrain Type</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'floodplain', label: 'Floodplain' },
                  { id: 'char', label: 'Riverine Char' },
                  { id: 'hills', label: 'Terraced Hills' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTerrainType(t.id as any)}
                    className={`py-1.5 text-xs font-medium rounded border text-center transition-all ${
                      terrainType === t.id 
                        ? 'bg-[#2d1b11] text-white border-amber-900' 
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Payload */}
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1.5">Sensor Payload</label>
              <select
                value={selectedSensorId}
                onChange={(e) => setSelectedSensorId(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-amber-800"
              >
                {SENSOR_PAYLOADS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Flight Altitude Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-stone-800">Flight Altitude AGL</span>
                <span className="font-mono font-bold text-amber-900">{altitudeMeters} meters AGL</span>
              </div>
              <input
                type="range"
                min="50"
                max="120"
                step="5"
                value={altitudeMeters}
                onChange={(e) => setAltitudeMeters(Number(e.target.value))}
                className="w-full accent-amber-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500">
                <span>50m (Ultra-HD 1cm)</span>
                <span>80m (Standard)</span>
                <span>120m (DGCA Ceiling)</span>
              </div>
            </div>

            {/* Target Area in Bighas */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold text-stone-800">Target Area</span>
                <span className="font-mono font-bold text-amber-900">{targetBighas} Bighas ({targetHectares} Ha)</span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={targetBighas}
                onChange={(e) => setTargetBighas(Number(e.target.value))}
                className="w-full accent-amber-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500">
                <span>20 Bighas (~2.7 Ha)</span>
                <span>250 Bighas</span>
                <span>500 Bighas (~67 Ha)</span>
              </div>
            </div>

          </div>

          {/* Real-Time Calculated Telemetry Outputs */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-stone-500 block">Ground Sampling Distance (GSD)</span>
                <span className="text-xl font-extrabold text-stone-900 mt-1 block">{calculatedGsd} cm/px</span>
              </div>
              <span className="text-[10px] text-stone-500 mt-2">Delineates 5cm field bunds clearly</span>
            </div>

            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-stone-500 block">Estimated Flight Time</span>
                <span className="text-xl font-extrabold text-amber-900 mt-1 block">{flightMinutes} mins</span>
              </div>
              <span className="text-[10px] text-stone-500 mt-2">At {flightSpeed} m/s cruise velocity</span>
            </div>

            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-stone-500 block">Battery Swaps Required</span>
                <span className="text-xl font-extrabold text-stone-900 mt-1 block">{batterySwaps} {batterySwaps === 1 ? 'Swap' : 'Swaps'}</span>
              </div>
              <span className="text-[10px] text-stone-500 mt-2">30-min buffer per battery set</span>
            </div>

            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-stone-500 block">Total Shutter Exposures</span>
                <span className="text-xl font-extrabold text-stone-900 mt-1 block">{estimatedPhotos} photos</span>
              </div>
              <span className="text-[10px] text-stone-500 mt-2">75% forward / 70% lateral overlap</span>
            </div>

            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-stone-500 block">Raw Multispectral Data</span>
                <span className="text-xl font-extrabold text-amber-900 mt-1 block">{rawDataGb} GB</span>
              </div>
              <span className="text-[10px] text-stone-500 mt-2">16-bit uncompressed GeoTIFF</span>
            </div>

            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-stone-500 block">Photogrammetry Ortho Time</span>
                <span className="text-xl font-extrabold text-stone-900 mt-1 block">~{Math.round(flightMinutes * 1.5)} mins</span>
              </div>
              <span className="text-[10px] text-stone-500 mt-2">Edge GPU SfM dense cloud processing</span>
            </div>

            {/* Simulation Context Banner */}
            <div className="col-span-2 sm:col-span-3 bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-lg flex items-center justify-between text-xs text-amber-950">
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4 text-amber-800 shrink-0" />
                <span>
                  <strong>Telemetry Link:</strong> RTK CORS active with sub-centimeter correction. Ready for mission upload to drone autopilot.
                </span>
              </div>
              <span className="font-mono font-bold text-amber-900">Ready</span>
            </div>

          </div>

        </div>
      </div>

      {/* Photogrammetry & Edge AI Processing Workflow */}
      <div className="bg-white rounded-xl shadow-xs border border-amber-900/10 p-6 sm:p-8 space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-800" />
            Photogrammetry &amp; Edge Processing Workflow
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            From raw drone captures to centimeter-grade cadastral yield maps ingested directly into SasyaDrishti.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2">
            <div className="w-7 h-7 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs font-bold">1</div>
            <h3 className="text-xs font-bold text-stone-900">Raw Capture &amp; DLS Normalization</h3>
            <p className="text-[11px] text-stone-600 leading-normal">
              Corrects for cloud shadows and sunlight shifts using Downwelling Light Sensor (DLS 2) readings during flight.
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2">
            <div className="w-7 h-7 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs font-bold">2</div>
            <h3 className="text-xs font-bold text-stone-900">Structure-from-Motion (SfM)</h3>
            <p className="text-[11px] text-stone-600 leading-normal">
              Extracts millions of tie-points to generate a dense 3D point cloud with sub-centimeter RTK coordinate georeferencing.
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2">
            <div className="w-7 h-7 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs font-bold">3</div>
            <h3 className="text-xs font-bold text-stone-900">DSM &amp; DTM Generation</h3>
            <p className="text-[11px] text-stone-600 leading-normal">
              Calculates Digital Surface Model (crop canopy) minus Digital Terrain Model (bare earth) to yield Canopy Height (CHM).
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2">
            <div className="w-7 h-7 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs font-bold">4</div>
            <h3 className="text-xs font-bold text-stone-900">Spectral Indices (NDRE/NDVI)</h3>
            <p className="text-[11px] text-stone-600 leading-normal">
              Computes RedEdge indices (NDRE) that do not saturate in dense rice canopies, accurately quantifying fresh biomass.
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2">
            <div className="w-7 h-7 rounded-full bg-amber-800 text-white flex items-center justify-center text-xs font-bold">5</div>
            <h3 className="text-xs font-bold text-stone-900">Cadastral Boundary Ingestion</h3>
            <p className="text-[11px] text-stone-600 leading-normal">
              Overlays high-res orthomosaics directly onto Dharitree Dag polygons to adjust CCE harvest yields and detect encroachments.
            </p>
          </div>

        </div>
      </div>

      {/* Hardware Bill of Materials (BOM) Table */}
      <div className="bg-white rounded-xl shadow-xs border border-amber-900/10 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/60">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-800" />
              Hardware Bill of Materials (BOM) &amp; Technical Architecture
            </h2>
            <p className="text-xs text-stone-500">Comprehensive hardware ecosystem specified for Assam State Space Application Centre (ASSAC).</p>
          </div>
          <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded">
            All Components Indian DGCA Compliant
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#2d1b11] text-white">
              <tr>
                <th className="py-3 px-4 font-semibold">Equipment / Component</th>
                <th className="py-3 px-4 font-semibold">Technical Specifications</th>
                <th className="py-3 px-4 font-semibold">OEM / Sourcing Standards</th>
                <th className="py-3 px-4 font-semibold">Field Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {HARDWARE_BOM.map((row, idx) => (
                <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-stone-900">{row.item}</td>
                  <td className="py-3 px-4 text-stone-600">{row.specs}</td>
                  <td className="py-3 px-4 text-stone-500">{row.vendor}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
export default DroneTechShowcase;
