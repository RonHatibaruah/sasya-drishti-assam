import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Layers, 
  Satellite, 
  Plane, 
  Waves, 
  TrendingUp,
  FileCheck2,
  AlertTriangle
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
      opacity: 0.65
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
      let fillColor = '#10b981';
      let strokeColor = '#059669';
      let fillOpacity = 0.68;

      if (activeLayer === 'YIELD') {
        if (parcel.yieldGrade === 'EXCELLENT') {
          fillColor = '#059669';
          strokeColor = '#10b981';
        } else if (parcel.yieldGrade === 'NORMAL') {
          fillColor = '#1d4ed8';
          strokeColor = '#3b82f6';
        } else if (parcel.yieldGrade === 'BELOW_AVERAGE') {
          fillColor = '#d97706';
          strokeColor = '#f59e0b';
        } else {
          fillColor = '#dc2626';
          strokeColor = '#ef4444';
        }
      } else if (activeLayer === 'NDVI') {
        if (parcel.spectralIndices.ndvi >= 0.7) fillColor = '#15803d';
        else if (parcel.spectralIndices.ndvi >= 0.5) fillColor = '#65a30d';
        else if (parcel.spectralIndices.ndvi >= 0.35) fillColor = '#ca8a04';
        else fillColor = '#b91c1c';
        strokeColor = '#fde047';
      } else if (activeLayer === 'SAR') {
        if (parcel.spectralIndices.sarBackscatterVvDb <= -16.5 || parcel.floodInundated) {
          fillColor = '#2563eb';
          strokeColor = '#60a5fa';
          fillOpacity = 0.85;
        } else {
          fillColor = '#64748b';
          strokeColor = '#94a3b8';
          fillOpacity = 0.45;
        }
      } else if (activeLayer === 'DRONE') {
        if (parcel.uavSurveyed) {
          fillColor = '#7c3aed';
          strokeColor = '#a78bfa';
          fillOpacity = 0.80;
        } else {
          fillColor = '#475569';
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

      polygon.bindTooltip(`
        <div style="font-family: sans-serif; font-size: 11px;">
          <b>Dag #${parcel.dagNumber}</b> (${parcel.village})<br/>
          Crop: <b>${parcel.cropType.replace('_', ' ')}</b><br/>
          Est. Yield: <b>${parcel.estimatedYieldKgHa} kg/ha</b><br/>
          NDVI: <b>${parcel.spectralIndices.ndvi}</b> | SAR: <b>${parcel.spectralIndices.sarBackscatterVvDb} dB</b>
        </div>
      `, { sticky: true });

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
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        
        {/* Layer Switcher Tabs */}
        <div>
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
            Remote Sensing Layer Overlay:
          </span>
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveLayer('YIELD')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeLayer === 'YIELD'
                  ? 'bg-[#0c2340] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Crop Yield Heatmap</span>
            </button>

            <button
              onClick={() => setActiveLayer('NDVI')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeLayer === 'NDVI'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Satellite className="w-3.5 h-3.5 text-blue-300" />
              <span>Sentinel-2 Optical NDVI</span>
            </button>

            <button
              onClick={() => setActiveLayer('SAR')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeLayer === 'SAR'
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Waves className="w-3.5 h-3.5 text-cyan-300" />
              <span>Sentinel-1 SAR Radar (Flood)</span>
            </button>

            <button
              onClick={() => setActiveLayer('DRONE')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeLayer === 'DRONE'
                  ? 'bg-purple-800 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Plane className="w-3.5 h-3.5 text-purple-300" />
              <span>UAV Drone Pilot Orthomosaics</span>
            </button>
          </div>
        </div>

        {/* District Focus Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600">Map Focus:</span>
          <select
            value={activeDistrictView}
            onChange={(e) => setActiveDistrictView(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 font-medium text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-blue-600 cursor-pointer"
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
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs relative h-[560px]">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Floating Map Legend */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-lg p-3 text-[11px] text-slate-700 shadow-md pointer-events-auto max-w-xs">
            <div className="font-bold text-slate-900 mb-1.5 flex items-center justify-between border-b border-slate-200 pb-1">
              <span>Map Legend ({activeLayer})</span>
              <span className="text-[10px] text-slate-500 font-mono">1:15,000</span>
            </div>
            
            {activeLayer === 'YIELD' && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-emerald-600"></span>
                  <span>Excellent Yield (&gt;2,800 kg/ha)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-blue-700"></span>
                  <span>Normal Benchmark (2,400–2,800 kg/ha)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-amber-500"></span>
                  <span>Below Average (1,800–2,400 kg/ha)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-red-600"></span>
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
                  <span className="w-3 h-3 rounded-sm bg-blue-600"></span>
                  <span>Submerged / Waterlogged (VV &le; -16.5 dB)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-slate-500"></span>
                  <span>Standing Crop / Soil Backscatter (&gt; -15 dB)</span>
                </div>
                <p className="text-[10px] text-blue-900 font-medium mt-1 italic">
                  *Sentinel-1 C-Band SAR penetrates monsoon cloud cover
                </p>
              </div>
            )}

            {activeLayer === 'DRONE' && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-purple-600"></span>
                  <span>UAV Multispectral 5-Band Coverage (3.5 cm/px)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-sm bg-slate-400"></span>
                  <span>Satellite Remote Sensing Only</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Parcel Inspector Sidebar */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between h-[560px] overflow-y-auto">
          {selectedParcel ? (
            <div className="space-y-4">
              
              {/* Header */}
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-blue-800 font-bold uppercase tracking-wider">
                    Assam Cadastral Parcel
                  </span>
                  {selectedParcel.yieldGrade === 'EXCELLENT' && (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      Excellent Yield
                    </span>
                  )}
                  {selectedParcel.yieldGrade === 'NORMAL' && (
                    <span className="bg-blue-50 text-blue-800 border border-blue-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      Normal Yield
                    </span>
                  )}
                  {selectedParcel.yieldGrade === 'STRESSED_CRITICAL' && (
                    <span className="bg-red-50 text-red-700 border border-red-300 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">
                      Flood Inundated
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-blue-950 mt-1">
                  Dag #{selectedParcel.dagNumber} &bull; Patta {selectedParcel.pattaNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedParcel.village}, Circle: {selectedParcel.circle}, {selectedParcel.district}
                </p>
              </div>

              {/* Farmer & Area Details */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 text-[10px] font-medium block">Pattadar / Farmer</span>
                  <span className="font-bold text-slate-900">{selectedParcel.farmerName}</span>
                  <span className="text-[10px] font-mono text-slate-500 block">{selectedParcel.farmerId}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] font-medium block">Assam BKL Area</span>
                  <span className="font-mono font-bold text-blue-900">
                    {selectedParcel.areaBigha}B {selectedParcel.areaKatha}K {selectedParcel.areaLesa}L
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 block">({selectedParcel.areaHectares} Hectares)</span>
                </div>
              </div>

              {/* Crop & Phenology */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Crop &amp; Variety:</span>
                  <span className="font-semibold text-blue-900">{selectedParcel.cropType.replace('_', ' ')} ({selectedParcel.cropVariety})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phenological Stage:</span>
                  <span className="font-mono font-medium text-slate-800">{selectedParcel.stage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Harvest:</span>
                  <span className="font-mono text-slate-800">{selectedParcel.expectedHarvestDate}</span>
                </div>
              </div>

              {/* Spectral & Remote Sensing Telemetry */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                  <Satellite className="w-3.5 h-3.5 text-blue-700" />
                  <span>Remote Sensing Telemetry</span>
                </span>
                
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 font-medium block">NDVI</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      {selectedParcel.spectralIndices.ndvi}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 font-medium block">SAR VV</span>
                    <span className="font-mono font-bold text-blue-800 text-sm">
                      {selectedParcel.spectralIndices.sarBackscatterVvDb} dB
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 font-medium block">LAI</span>
                    <span className="font-mono font-bold text-amber-700 text-sm">
                      {selectedParcel.spectralIndices.lai} m²/m²
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                  <span>Cloud Cover at Capture:</span>
                  <span className="font-mono font-medium text-slate-800">{selectedParcel.spectralIndices.opticalCloudCoverPercent}% (SAR Compensated)</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span>UAV Drone Resolution:</span>
                  <span className="font-mono font-semibold text-purple-700">
                    {selectedParcel.uavSurveyed ? `${selectedParcel.uavResolutionCm} cm/px` : 'Satellite Only'}
                  </span>
                </div>
              </div>

              {/* Yield Prediction Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <span className="text-xs text-blue-900 font-bold uppercase tracking-wider block">Estimated Harvest Yield</span>
                <div className="text-2xl font-black text-blue-950 font-mono mt-0.5">
                  {selectedParcel.estimatedYieldKgHa} <span className="text-xs font-normal text-slate-600">kg/ha</span>
                </div>
                <div className="text-xs font-mono font-semibold text-blue-800 mt-0.5">
                  &asymp; {selectedParcel.estimatedYieldQuintalBigha} Quintals / Assam Bigha ({selectedParcel.estimatedProductionTonnes} MT Total)
                </div>
                <span className="text-[10px] text-slate-500 block mt-1">
                  AI Multi-Model Confidence: <b>{selectedParcel.confidenceScore}%</b>
                </span>
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-sm">
              Click any parcel on the map to inspect remote sensing telemetry and predicted yield.
            </div>
          )}

          {/* Action Buttons */}
          {selectedParcel && (
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <button
                onClick={() => onOpenCertificate && onOpenCertificate(selectedParcel)}
                className="w-full bg-[#0c2340] hover:bg-blue-900 text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Issue Farmer Yield Certificate</span>
              </button>

              <button
                onClick={() => onDispatchDrone && onDispatchDrone(selectedParcel)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-300"
              >
                <Plane className="w-3.5 h-3.5 text-purple-700" />
                <span>Dispatch High-Res Drone Survey</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
