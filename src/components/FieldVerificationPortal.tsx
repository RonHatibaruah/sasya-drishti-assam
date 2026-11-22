import React, { useState } from 'react';
import { 
  Plane, 
  CheckCircle2, 
  FileCheck2, 
  Scale, 
  ShieldCheck
} from 'lucide-react';
import { DroneMission, CropCuttingExperiment, CropParcelRecord } from '../types/cropYield';
import { calculateCceYield } from '../services/cropYieldEngine';

interface FieldVerificationPortalProps {
  missions: DroneMission[];
  cceRecords: CropCuttingExperiment[];
  parcels: CropParcelRecord[];
  onAddMission: (mission: DroneMission) => void;
  onAddCceRecord: (record: CropCuttingExperiment) => void;
}

export const FieldVerificationPortal: React.FC<FieldVerificationPortalProps> = ({
  missions,
  cceRecords,
  parcels,
  onAddMission,
  onAddCceRecord
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'CCE' | 'DRONE'>('CCE');

  // New CCE Form state
  const [selectedParcelId, setSelectedParcelId] = useState<string>(parcels[0]?.id || '');
  const [officerName, setOfficerName] = useState<string>('Bhaben Kalita (ADO Sonapur)');
  const [freshCutWeight, setFreshCutWeight] = useState<number>(7.6);
  const [dryGrainWeight, setDryGrainWeight] = useState<number>(7.1);
  const [grainMoisture, setGrainMoisture] = useState<number>(14.2);
  const [cceSuccessMsg, setCceSuccessMsg] = useState<string>('');

  // New Drone Mission Form state
  const [droneTitle, setDroneTitle] = useState<string>('');
  const [droneDistrict, setDroneDistrict] = useState<string>('Kamrup Metro');
  const [droneCircle, setDroneCircle] = useState<string>('Sonapur');
  const [droneVillage, setDroneVillage] = useState<string>('Khetri Gaon');
  const [droneAreaBighas, setDroneAreaBighas] = useState<number>(150);
  const [droneAltitude, setDroneAltitude] = useState<number>(90);
  const [droneSensor, setDroneSensor] = useState<'MULTISPECTRAL_5BAND' | 'RGB_4K' | 'THERMAL_MULTISPECTRAL'>('MULTISPECTRAL_5BAND');
  const [droneSuccessMsg, setDroneSuccessMsg] = useState<string>('');

  const targetParcel = parcels.find(p => p.id === selectedParcelId) || parcels[0];
  const previewCalculatedYield = calculateCceYield(dryGrainWeight, grainMoisture);

  const handleCceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetParcel) return;

    const newCce: CropCuttingExperiment = {
      id: `CCE-2026-${targetParcel.circle.substring(0, 2).toUpperCase()}-${String(cceRecords.length + 1).padStart(2, '0')}`,
      parcelId: targetParcel.id,
      dagNumber: targetParcel.dagNumber,
      village: targetParcel.village,
      circle: targetParcel.circle,
      district: targetParcel.district,
      officerName,
      date: new Date().toISOString().split('T')[0],
      quadrantSizeMeters: '5m x 5m (25 sq.m)',
      freshCutWeightKg: Number(freshCutWeight),
      dryGrainWeightKg: Number(dryGrainWeight),
      grainMoisturePercent: Number(grainMoisture),
      calculatedYieldKgHa: previewCalculatedYield,
      geotagLat: targetParcel.coordinates[0]?.[0] || 26.1150,
      geotagLng: targetParcel.coordinates[0]?.[1] || 91.9860,
      photoUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=400',
      status: 'VERIFIED',
      mspProcurementForecastQuintals: Number(((previewCalculatedYield * targetParcel.areaHectares) / 100).toFixed(1))
    };

    onAddCceRecord(newCce);
    setCceSuccessMsg(`CCE Logged Successfully for Dag #${targetParcel.dagNumber}! Calibrated Yield: ${previewCalculatedYield} kg/ha.`);
    setTimeout(() => setCceSuccessMsg(''), 4000);
  };

  const handleDroneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMission: DroneMission = {
      id: `DRONE-AS-2026-${String(missions.length + 1).padStart(2, '0')}`,
      title: droneTitle || `${droneCircle} Pilot Cluster Multispectral UAV Scan`,
      pilotName: 'ASSAC UAV Cell / Regional Fleet Operator',
      agency: 'Directorate of Agriculture, Assam',
      district: droneDistrict,
      circle: droneCircle,
      village: droneVillage,
      targetAreaBighas: Number(droneAreaBighas),
      flightAltitudeMeters: Number(droneAltitude),
      sensorType: droneSensor,
      batteryLevel: 100,
      status: 'SCHEDULED',
      scheduledDate: new Date().toISOString().split('T')[0],
      cloudCoverAvoidancePercent: 100
    };

    onAddMission(newMission);
    setDroneSuccessMsg(`Drone Survey Mission Dispatched: ${newMission.id} for ${droneAreaBighas} Bighas in ${droneVillage}!`);
    setDroneTitle('');
    setTimeout(() => setDroneSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Mode Switcher */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Plane className="w-5 h-5 text-amber-800" />
            <span>Field Intelligence, CCE &amp; UAV Drone Operations</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Synchronizing Crop Cutting Experiments (CCE) ground truth with high-resolution drone flight missions
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-stone-100 p-1 rounded-lg border border-stone-200">
          <button
            onClick={() => setActiveSubTab('CCE')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'CCE'
                ? 'bg-[#2d1b11] text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Crop Cutting Experiments (CCE)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('DRONE')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'DRONE'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>UAV Drone Missions ({missions.length})</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'CCE' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CCE Entry Form */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="border-b border-stone-200 pb-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-800" />
                <span>Log Digital Crop Cutting Experiment (CCE)</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Standard 5m &times; 5m quadrant harvest cut under PMFBY guidelines
              </p>
            </div>

            {cceSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{cceSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleCceSubmit} className="space-y-3.5 text-xs">
              
              <div>
                <label className="text-stone-700 font-semibold block mb-1">Select Target Dag / Parcel:</label>
                <select
                  value={selectedParcelId}
                  onChange={(e) => setSelectedParcelId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-hidden focus:border-amber-800 font-medium cursor-pointer"
                >
                  {parcels.map(p => (
                    <option key={p.id} value={p.id}>
                      Dag #{p.dagNumber} &bull; {p.village} ({p.farmerName}) - {p.cropType.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">Extension Officer / Supervisor:</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-hidden focus:border-amber-800 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 font-semibold block mb-1">Fresh Cut (kg/25m²):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={freshCutWeight}
                    onChange={(e) => setFreshCutWeight(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-hidden focus:border-amber-800 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-semibold block mb-1">Dry Grain (kg/25m²):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={dryGrainWeight}
                    onChange={(e) => setDryGrainWeight(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-hidden focus:border-amber-800 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">Grain Moisture (%):</label>
                <input
                  type="number"
                  step="0.1"
                  value={grainMoisture}
                  onChange={(e) => setGrainMoisture(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-hidden focus:border-amber-800 font-mono"
                  required
                />
                <span className="text-[10px] text-stone-500 block mt-0.5">Optimal storage benchmark: 14.0%</span>
              </div>

              {/* Real-time Calculation Preview */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-center space-y-1">
                <span className="text-[11px] text-amber-900 font-semibold uppercase tracking-wider block">Calibrated Yield Preview</span>
                <div className="text-xl font-black text-stone-900 font-mono">
                  {previewCalculatedYield} <span className="text-xs font-normal text-stone-600">kg/ha</span>
                </div>
                <div className="text-[11px] text-stone-600">
                  Satellite Prediction: <span className="font-mono font-bold text-amber-900">{targetParcel?.estimatedYieldKgHa || 0} kg/ha</span>
                  {' '}&bull;{' '}
                  Variance: <span className="font-mono font-semibold text-amber-700">
                    {Math.abs(Math.round(((previewCalculatedYield - (targetParcel?.estimatedYieldKgHa || 0)) / previewCalculatedYield) * 100))}%
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2d1b11] hover:bg-amber-900 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit &amp; Seal Ground-Truth Cut</span>
              </button>

            </form>
          </div>

          {/* CCE Records Register */}
          <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Verified Field Crop Cutting Experiments Register</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Audited ground-truth samples used to dynamically calibrate AI regression weights
                </p>
              </div>
              <span className="text-xs font-mono bg-amber-50 text-amber-900 border border-amber-200 font-bold px-2 py-0.5 rounded">
                {cceRecords.length} Completed Cuts
              </span>
            </div>

            <div className="space-y-3">
              {cceRecords.map((cce) => (
                <div 
                  key={cce.id} 
                  className="bg-stone-50 border border-stone-200 rounded-xl p-4 hover:border-amber-300 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">Dag #{cce.dagNumber}</span>
                      <span className="text-stone-400 text-xs">&bull;</span>
                      <span className="text-xs font-medium text-stone-700">{cce.village}, {cce.circle} ({cce.district})</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                        {cce.id}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 flex items-center gap-2">
                      <span>Supervisor: <b className="text-stone-900">{cce.officerName}</b></span>
                      <span>&bull;</span>
                      <span>Cut Date: {cce.date}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 pt-1">
                      <span>Dry Weight: <b className="font-mono text-stone-900">{cce.dryGrainWeightKg} kg</b></span>
                      <span>&bull;</span>
                      <span>Moisture: <b className="font-mono text-stone-900">{cce.grainMoisturePercent}%</b></span>
                      <span>&bull;</span>
                      <span>GPS: <b className="font-mono text-amber-900">{cce.geotagLat.toFixed(4)}, {cce.geotagLng.toFixed(4)}</b></span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-stone-200 text-center shrink-0 w-full md:w-auto shadow-2xs">
                    <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider block">Calibrated Yield</span>
                    <span className="text-lg font-black text-stone-900 font-mono block">
                      {cce.calculatedYieldKgHa} kg/ha
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono block">
                      MSP Forecast: {cce.mspProcurementForecastQuintals} Q
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      ) : (
        /* Drone Missions View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Drone Dispatch Form */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="border-b border-stone-200 pb-3">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Plane className="w-4 h-4 text-amber-800" />
                <span>Schedule New UAV Drone Survey</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Deploy multispectral drone over cloudy or high-value agricultural clusters
              </p>
            </div>

            {droneSuccessMsg && (
              <div className="bg-amber-50 border border-amber-300 text-amber-900 text-xs p-3 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-medium">{droneSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleDroneSubmit} className="space-y-3 text-xs">
              
              <div>
                <label className="text-stone-700 font-semibold block mb-1">Mission Title / Focus Area:</label>
                <input
                  type="text"
                  placeholder="e.g. Sonapur Ripening Stage Multispectral Scan"
                  value={droneTitle}
                  onChange={(e) => setDroneTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-hidden focus:border-amber-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-700 font-semibold block mb-1">Target District:</label>
                  <select
                    value={droneDistrict}
                    onChange={(e) => setDroneDistrict(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-hidden focus:border-amber-800 font-medium cursor-pointer"
                  >
                    <option value="Kamrup Metro">Kamrup Metro</option>
                    <option value="Nagaon">Nagaon</option>
                    <option value="Barpeta">Barpeta</option>
                    <option value="Golaghat">Golaghat</option>
                    <option value="Darrang">Darrang</option>
                  </select>
                </div>
                <div>
                  <label className="text-stone-700 font-semibold block mb-1">Target Circle:</label>
                  <input
                    type="text"
                    value={droneCircle}
                    onChange={(e) => setDroneCircle(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-hidden focus:border-amber-800 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-700 font-semibold block mb-1">Target Area (Bighas):</label>
                  <input
                    type="number"
                    value={droneAreaBighas}
                    onChange={(e) => setDroneAreaBighas(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-hidden focus:border-amber-800 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-stone-700 font-semibold block mb-1">Flight Altitude (m):</label>
                  <input
                    type="number"
                    value={droneAltitude}
                    onChange={(e) => setDroneAltitude(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-hidden focus:border-amber-800 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-700 font-semibold block mb-1">Sensor Payload:</label>
                <select
                  value={droneSensor}
                  onChange={(e) => setDroneSensor(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-hidden focus:border-amber-800 font-medium cursor-pointer"
                >
                  <option value="MULTISPECTRAL_5BAND">MicaSense RedEdge (5-Band Multispectral, 3.5 cm/px)</option>
                  <option value="RGB_4K">High-Res RGB 4K (Canopy Structure &amp; Gaps)</option>
                  <option value="THERMAL_MULTISPECTRAL">Thermal + Multispectral (Water Stress)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2d1b11] hover:bg-amber-900 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Plane className="w-4 h-4" />
                <span>Dispatch UAV Flight Mission</span>
              </button>

            </form>
          </div>

          {/* Active Drone Missions List */}
          <div className="lg:col-span-2 bg-white border border-stone-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-amber-800" />
                  <span>UAV Drone Fleet Telemetry &amp; Orthomosaic Queue</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Centimeter-level aerial crop stress, plant count, and biomass validation
                </p>
              </div>
              <span className="text-xs font-mono bg-amber-50 text-amber-900 border border-amber-200 font-bold px-2 py-0.5 rounded">
                Fleet Status: ACTIVE
              </span>
            </div>

            <div className="space-y-3">
              {missions.map((mission) => (
                <div 
                  key={mission.id} 
                  className="bg-stone-50 border border-stone-200 rounded-xl p-4 hover:border-amber-300 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">{mission.title}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                        {mission.id}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600">
                      Pilot: <b className="text-stone-900">{mission.pilotName}</b> &bull; {mission.village}, {mission.circle} ({mission.district})
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 pt-1">
                      <span>Target Area: <b className="font-mono text-stone-900">{mission.targetAreaBighas} Bighas</b></span>
                      <span>&bull;</span>
                      <span>Altitude: <b className="font-mono text-stone-900">{mission.flightAltitudeMeters}m</b></span>
                      <span>&bull;</span>
                      <span>Sensor: <b className="text-amber-900">{mission.sensorType.replace('_', ' ')}</b></span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full font-mono ${
                      mission.status === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : mission.status === 'PROCESSING'
                        ? 'bg-amber-50 text-amber-800 border border-amber-300 animate-pulse'
                        : 'bg-amber-50 text-amber-800 border border-amber-300'
                    }`}>
                      {mission.status}
                    </span>
                    <span className="text-[10px] text-stone-500 block mt-1 font-mono">
                      Battery: {mission.batteryLevel}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
export default FieldVerificationPortal;
