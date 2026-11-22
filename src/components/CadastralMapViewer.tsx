import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers, 
  Satellite, 
  Plane, 
  Waves, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Eye, 
  FileCheck2,
  TrendingUp,
  Compass,
  Zap
} from 'lucide-react';
import { CropParcelRecord } from '../types/cropYield';
import { kgHaToQuintalsPerBigha } from '../services/cropYieldEngine';

interface CadastralMapViewerProps {
  parcels: CropParcelRecord[];
  onSelectParcel: (parcel: CropParcelRecord) => void;
  selectedParcelId?: string;
  onDispatchDrone?: (parcel: CropParcelRecord) => void;
  onOpenCertificate?: (parcel: CropParcelRecord) => void;
}

export const CadastralMapViewer: React.FC<CadastralMapViewerProps> = ({
  parcels,
  onSelectParcel,
  selectedParcelId,
  onDispatchDrone,
  onOpenCertificate
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeLayer, setActiveLayer] = useState<'YIELD' | 'NDVI' | 'SAR' | 'DRONE'>('YIELD');
  const [selectedParcel, setSelectedParcel] = useState<CropParcelRecord | null>(
    parcels.find(p => p.id === selectedParcelId) || parcels[0] || null
  );
  const [activeDistrictView, setActiveDistrictView] = useState<string>('Kamrup Metro');

  // Filter parcels for map focus
  const displayedParcels = parcels.filter(p => {
    if (activeDistrictView !== 'ALL' && p.district !== activeDistrictView) return false;
    return true;
  });

  // Coordinates for districts
  const districtCenters: Record<string, [number, number]> = {
    'Kamrup Metro': [26.1150, 91.9860],
    'Nagaon': [26.4215, 92.8350],
    'Barpeta': [26.2160, 90.8750],
    'Golaghat': [26.6020, 93.5950],
    'Darrang': [26.4380, 91.8950],
    'Cachar': [24.8320, 92.7950],
    'ALL': [26.2000, 92.4000]
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const center = districtCenters[activeDistrictView] || [26.1150, 91.9860];
    const map = L.map(mapContainerRef.current, {
      center,
      zoom: activeDistrictView === 'ALL' ? 8 : 14,
      zoomControl: true,
      attributionControl: false
    });

    // Basemap: High-Resolution Satellite Imagery (Esri World Imagery)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }).addTo(map);

    // Labels & Borders Overlay
    L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      opacity: 0.6
    }).addTo(map);

    const polygonGroup = L.layerGroup().addTo(map);
    polygonLayerGroupRef.current = polygonGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [activeDistrictView]);

  // Render Polygons when activeLayer or displayedParcels change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = polygonLayerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    displayedParcels.forEach((parcel) => {
      // Determine polygon color based on active layer
      let fillColor = '#10b981'; // default emerald
      let strokeColor = '#059669';
      let fillOpacity = 0.65;

      if (activeLayer === 'YIELD') {
        if (parcel.yieldGrade === 'EXCELLENT') {
          fillColor = '#10b981';
          strokeColor = '#34d399';
        } else if (parcel.yieldGrade === 'NORMAL') {
          fillColor = '#0284c7';
          strokeColor = '#38bdf8';
        } else if (parcel.yieldGrade === 'BELOW_AVERAGE') {
          fillColor = '#d97706';
          strokeColor = '#fbbf24';
        } else {
          fillColor = '#ef4444';
          strokeColor = '#f87171';
        }
      } else if (activeLayer === 'NDVI') {
        // Green colour scale based on NDVI
        if (parcel.spectralIndices.ndvi >= 0.7) fillColor = '#15803d';
        else if (parcel.spectralIndices.ndvi >= 0.5) fillColor = '#65a30d';
        else if (parcel.spectralIndices.ndvi >= 0.35) fillColor = '#ca8a04';
        else fillColor = '#b91c1c';
        strokeColor = '#fde047';
      } else if (activeLayer === 'SAR') {
        // SAR radar backscatter: flooded/standing water has very low backscatter (<-16 dB) -> dark blue/purple
        if (parcel.spectralIndices.sarBackscatterVvDb <= -16.5 || parcel.floodInundated) {
          fillColor = '#3b82f6';
          strokeColor = '#93c5fd';
          fillOpacity = 0.85;
        } else {
          fillColor = '#64748b';
          strokeColor = '#94a3b8';
          fillOpacity = 0.45;
        }
      } else if (activeLayer === 'DRONE') {
        if (parcel.uavSurveyed) {
          fillColor = '#8b5cf6';
          strokeColor = '#c4b5fd';
          fillOpacity = 0.80;
        } else {
          fillColor = '#334155';
          strokeColor = '#64748b';
          fillOpacity = 0.35;
        }
      }

      const polygon = L.polygon(parcel.coordinates, {
        color: strokeColor,
        weight: 2.5,
        fillColor,
        fillOpacity
      });

      // Tooltip
      polygon.bindTooltip(`
        <div style="font-family: sans-serif; font-size: 11px;">
          <b>Dag #${parcel.dagNumber}</b> (${parcel.village})<br/>
          Crop: <b>${parcel.cropType.replace('_', ' ')}</b><br/>
          Est. Yield: <b>${parcel.estimatedYieldKgHa} kg/ha</b><br/>
          NDVI: <b>${parcel.spectralIndices.ndvi}</b> | SAR: <b>${parcel.spectralIndices.sarBackscatterVvDb} dB</b>
        </div>
      `, { sticky: true });

      // Click Handler
      polygon.on('click', () => {
        setSelectedParcel(parcel);
        onSelectParcel(parcel);
      });

      polygon.addTo(group);
    });

  }, [displayedParcels, activeLayer]);

  return (
    <div className="space-y-4">
      
      {/* Map Control Header */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Layer Switcher Tabs */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Remote Sensing Layer Overlay:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveLayer('YIELD')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeLayer === 'YIELD'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Crop Yield Heatmap</span>
            </button>

            <button
              onClick={() => setActiveLayer('NDVI')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeLayer === 'NDVI'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Satellite className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sentinel-2 Optical NDVI</span>
            </button>

            <button
              onClick={() => setActiveLayer('SAR')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeLayer === 'SAR'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Waves className="w-3.5 h-3.5 text-cyan-300" />
              <span>Sentinel-1 SAR Radar (Flood/Water)</span>
            </button>

            <button
              onClick={() => setActiveLayer('DRONE')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeLayer === 'DRONE'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Plane className="w-3.5 h-3.5 text-purple-300" />
              <span>UAV Drone Pilot Orthomosaics</span>
            </button>
          </div>
        </div>

        {/* District Focus Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Map Focus:</span>
          <select
            value={activeDistrictView}
            onChange={(e) => setActiveDistrictView(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="Kamrup Metro">Kamrup Metro (Sonapur)</option>
            <option value="Nagaon">Nagaon (Samaguri)</option>
            <option value="Barpeta">Barpeta (Baghbar Char)</option>
            <option value="Golaghat">Golaghat (Bokakhat)</option>
            <option value="Darrang">Darrang (Sipajhar)</option>
            <option value="Cachar">Cachar (Silchar)</option>
            <option value="ALL">All Assam (Overview)</option>
          </select>
        </div>

      </div>

      {/* Main Map + Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Leaflet Map Container */}
        <div className="lg:col-span-2 bg-slate-800/90 border border-slate-700 rounded-xl overflow-hidden shadow-sm relative h-[560px]">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Floating Map Legend */}
          <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg p-3 text-[11px] text-slate-300 shadow-lg pointer-events-auto max-w-xs">
            <div className="font-semibold text-white mb-1.5 flex items-center justify-between">
              <span>Map Legend ({activeLayer})</span>
              <span className="text-[10px] text-slate-400 font-mono">1:15,000</span>
            </div>
            
            {activeLayer === 'YIELD' && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
                  <span>Excellent Yield (&gt;2,800 kg/ha)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-sky-500"></span>
                  <span>Normal Benchmark (2,400–2,800 kg/ha)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-amber-500"></span>
                  <span>Below Average (1,800–2,400 kg/ha)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-red-500"></span>
                  <span>Stressed / Flood Inundated (&lt;1,800 kg/ha)</span>
                </div>
              </div>
            )}

            {activeLayer === 'NDVI' && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-green-700"></span>
                  <span>Dense Vegetation Vigour (NDVI &gt; 0.70)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-lime-600"></span>
                  <span>Moderate Green Canopy (NDVI 0.50–0.70)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-yellow-600"></span>
                  <span>Early / Stressed Stage (NDVI 0.35–0.50)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-red-700"></span>
                  <span>Non-Vegetated / Bare Soil (NDVI &lt; 0.35)</span>
                </div>
              </div>
            )}

            {activeLayer === 'SAR' && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-blue-500"></span>
                  <span>Submerged / Waterlogged (VV &le; -16.5 dB)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-slate-500"></span>
                  <span>Standing Crop / Soil Backscatter (&gt; -15 dB)</span>
                </div>
                <p className="text-[10px] text-cyan-300 mt-1 italic">
                  *Sentinel-1 C-Band SAR penetrates monsoon cloud cover
                </p>
              </div>
            )}

            {activeLayer === 'DRONE' && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-purple-500"></span>
                  <span>UAV Multispectral 5-Band Coverage (3.5 cm/px)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-slate-600"></span>
                  <span>Satellite Remote Sensing Only</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Parcel Inspector Sidebar */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-sm flex flex-col justify-between h-[560px] overflow-y-auto">
          {selectedParcel ? (
            <div className="space-y-4">
              
              {/* Header */}
              <div className="border-b border-slate-700 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                    Assam Cadastral Parcel
                  </span>
                  {selectedParcel.yieldGrade === 'EXCELLENT' && (
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                      Excellent Yield
                    </span>
                  )}
                  {selectedParcel.yieldGrade === 'NORMAL' && (
                    <span className="bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                      Normal Yield
                    </span>
                  )}
                  {selectedParcel.yieldGrade === 'STRESSED_CRITICAL' && (
                    <span className="bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded text-[10px] font-semibold animate-pulse">
                      Flood Inundated
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  Dag #{selectedParcel.dagNumber} &bull; Patta {selectedParcel.pattaNumber}
                </h3>
                <p className="text-xs text-slate-400">
                  {selectedParcel.village}, Circle: {selectedParcel.circle}, {selectedParcel.district}
                </p>
              </div>

              {/* Farmer & Area Details */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-700/60">
                <div>
                  <span className="text-slate-400 text-[10px] block">Pattadar / Farmer</span>
                  <span className="font-semibold text-white">{selectedParcel.farmerName}</span>
                  <span className="text-[10px] font-mono text-slate-500 block">{selectedParcel.farmerId}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Assam BKL Area</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    {selectedParcel.areaBigha}B {selectedParcel.areaKatha}K {selectedParcel.areaLesa}L
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 block">({selectedParcel.areaHectares} Hectares)</span>
                </div>
              </div>

              {/* Crop & Phenology */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Crop &amp; Variety:</span>
                  <span className="font-medium text-emerald-300">{selectedParcel.cropType.replace('_', ' ')} ({selectedParcel.cropVariety})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phenological Stage:</span>
                  <span className="font-mono text-cyan-300">{selectedParcel.stage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Harvest:</span>
                  <span className="font-mono text-slate-300">{selectedParcel.expectedHarvestDate}</span>
                </div>
              </div>

              {/* Spectral & Remote Sensing Telemetry */}
              <div className="border border-slate-700/80 rounded-lg p-3 bg-slate-900/80 space-y-2">
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
                  <Satellite className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Remote Sensing Telemetry</span>
                </span>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-800 p-2 rounded border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">NDVI</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {selectedParcel.spectralIndices.ndvi}
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2 rounded border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">SAR VV</span>
                    <span className="font-mono font-bold text-cyan-300 text-sm">
                      {selectedParcel.spectralIndices.sarBackscatterVvDb} dB
                    </span>
                  </div>
                  <div className="bg-slate-800 p-2 rounded border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">LAI</span>
                    <span className="font-mono font-bold text-amber-300 text-sm">
                      {selectedParcel.spectralIndices.lai} m²/m²
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Cloud Cover at Capture:</span>
                  <span className="font-mono text-slate-200">{selectedParcel.spectralIndices.opticalCloudCoverPercent}% (SAR Compensated)</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>UAV Drone Resolution:</span>
                  <span className="font-mono text-purple-300">
                    {selectedParcel.uavSurveyed ? `${selectedParcel.uavResolutionCm} cm/px` : 'Satellite Only'}
                  </span>
                </div>
              </div>

              {/* Yield Prediction Box */}
              <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-lg p-3 text-center">
                <span className="text-xs text-emerald-300 uppercase tracking-wider block">Estimated Harvest Yield</span>
                <div className="text-2xl font-black text-white font-mono mt-0.5">
                  {selectedParcel.estimatedYieldKgHa} <span className="text-xs font-normal text-slate-300">kg/ha</span>
                </div>
                <div className="text-xs font-mono text-emerald-400 mt-0.5">
                  &asymp; {selectedParcel.estimatedYieldQuintalBigha} Quintals / Assam Bigha ({selectedParcel.estimatedProductionTonnes} MT Total)
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  AI Multi-Model Confidence: <b>{selectedParcel.confidenceScore}%</b>
                </span>
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-slate-400 text-sm">
              Click any parcel on the map to inspect remote sensing telemetry and predicted yield.
            </div>
          )}

          {/* Action Buttons */}
          {selectedParcel && (
            <div className="pt-3 border-t border-slate-700 space-y-2">
              <button
                onClick={() => onOpenCertificate && onOpenCertificate(selectedParcel)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Issue Farmer Yield Certificate</span>
              </button>

              <button
                onClick={() => onDispatchDrone && onDispatchDrone(selectedParcel)}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-600"
              >
                <Plane className="w-3.5 h-3.5 text-purple-400" />
                <span>Dispatch High-Res Drone Survey</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
