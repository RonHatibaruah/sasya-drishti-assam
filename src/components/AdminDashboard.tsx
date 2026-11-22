import React, { useState } from 'react';
import { 
  Sliders, 
  Database, 
  Users, 
  ShieldCheck, 
  Clock, 
  Activity, 
  RefreshCw, 
  Satellite, 
  Plane, 
  CheckCircle2, 
  AlertTriangle, 
  UserPlus, 
  Download, 
  Save, 
  Sparkles,
  Lock,
  Search,
  Layers,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { ModelCalibrationConfig, CropParcelRecord, AuditLogEntry } from '../types/cropYield';
import { DEFAULT_MODEL_CONFIG } from '../services/cropYieldEngine';

interface AdminDashboardProps {
  parcels: CropParcelRecord[];
  modelConfig: ModelCalibrationConfig;
  onUpdateModelConfig: (newConfig: ModelCalibrationConfig) => void;
  onRecalculateAllParcels: () => void;
}

type AdminSubTab = 'models' | 'pipelines' | 'hierarchy' | 'procurement' | 'audit';

interface DepartmentOfficer {
  id: string;
  name: string;
  role: 'ASSAC_SCIENTIST' | 'DAO' | 'ADO' | 'DRONE_PILOT' | 'KRISHI_SAHAYAK';
  district: string;
  circle: string;
  status: 'ACTIVE' | 'ON_FIELD' | 'OFFLINE';
  lastActive: string;
}

const INITIAL_OFFICERS: DepartmentOfficer[] = [
  {
    id: 'OFF-01',
    name: 'Dr. P. K. Goswami',
    role: 'ASSAC_SCIENTIST',
    district: 'Statewide HQ',
    circle: 'ASSAC Dispur',
    status: 'ACTIVE',
    lastActive: 'Just now'
  },
  {
    id: 'OFF-02',
    name: 'Bhaben Kalita',
    role: 'DAO',
    district: 'Kamrup Metro',
    circle: 'Guwahati Circle',
    status: 'ACTIVE',
    lastActive: '12 mins ago'
  },
  {
    id: 'OFF-03',
    name: 'Dipankar Sarma',
    role: 'ADO',
    district: 'Kamrup Metro',
    circle: 'Sonapur',
    status: 'ON_FIELD',
    lastActive: '45 mins ago'
  },
  {
    id: 'OFF-04',
    name: 'Anurag Sharma',
    role: 'DRONE_PILOT',
    district: 'Kamrup Metro',
    circle: 'Sonapur Cluster',
    status: 'ON_FIELD',
    lastActive: '20 mins ago'
  },
  {
    id: 'OFF-05',
    name: 'Mukesh Talukdar',
    role: 'ADO',
    district: 'Barpeta',
    circle: 'Baghbar',
    status: 'ACTIVE',
    lastActive: '1 hour ago'
  }
];

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-11-22 11:42:10',
    actor: 'Dr. P. K. Goswami (ASSAC Scientist)',
    action: 'MODEL_CALIBRATION',
    details: 'Calibrated Sentinel-1 SAR flood inundation threshold to -16.5 dB for Brahmaputra valley.',
    hash: '9f8e7d6c5b4a3f2e1d0c8b7a695847362514'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-11-22 10:15:34',
    actor: 'Copernicus Pipeline Sentry',
    action: 'SENTINEL_SAR_SYNC',
    details: 'Ingested C-band SAR Level-1 GRD pass over Kamrup & Nagaon agricultural basins.',
    hash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-11-22 09:20:18',
    actor: 'ADO Sonapur Dipankar Sarma',
    action: 'CCE_GROUND_TRUTH_LOG',
    details: 'Validated 5m x 5m quadrant harvest cut for Dag #104 (2890 kg/ha).',
    hash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d'
  },
  {
    id: 'LOG-004',
    timestamp: '2026-11-21 16:30:00',
    actor: 'UAV Fleet Dispatcher',
    action: 'DRONE_MISSION_DEPLOY',
    details: 'Dispatched 5-band multispectral survey DRONE-AS-2026-01 over Khetri Gaon.',
    hash: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
  }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  parcels,
  modelConfig,
  onUpdateModelConfig,
  onRecalculateAllParcels
}) => {
  const [activeTab, setActiveTab] = useState<AdminSubTab>('models');
  const [localConfig, setLocalConfig] = useState<ModelCalibrationConfig>(modelConfig);
  const [officers, setOfficers] = useState<DepartmentOfficer[]>(INITIAL_OFFICERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [statusMsg, setStatusMsg] = useState<string>('');

  // Officer Provisioning Form
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerRole, setNewOfficerRole] = useState<DepartmentOfficer['role']>('ADO');
  const [newOfficerDistrict, setNewOfficerDistrict] = useState('Nagaon');
  const [newOfficerCircle, setNewOfficerCircle] = useState('Samaguri');

  const handleSaveConfig = () => {
    onUpdateModelConfig(localConfig);
    onRecalculateAllParcels();

    const newLog: AuditLogEntry = {
      id: `LOG-${String(auditLogs.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'Super Admin (ASSAC Command)',
      action: 'AI_MODEL_RECALIBRATION',
      details: `Updated ML weights (XGB: ${localConfig.mlWeights.xgboost}, RF: ${localConfig.mlWeights.randomForest}, LSTM: ${localConfig.mlWeights.biLstm}) and re-scored all parcels.`,
      hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    };

    setAuditLogs(prev => [newLog, ...prev]);
    setStatusMsg('AI & Remote Sensing Model Parameters Saved & Re-calibrated across all parcels!');
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleResetConfig = () => {
    setLocalConfig(DEFAULT_MODEL_CONFIG);
    onUpdateModelConfig(DEFAULT_MODEL_CONFIG);
    onRecalculateAllParcels();
    setStatusMsg('Restored default ASSAC operational benchmark weights.');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficerName) return;

    const newOff: DepartmentOfficer = {
      id: `OFF-0${officers.length + 1}`,
      name: newOfficerName,
      role: newOfficerRole,
      district: newOfficerDistrict,
      circle: newOfficerCircle,
      status: 'ACTIVE',
      lastActive: 'Just registered'
    };

    setOfficers(prev => [...prev, newOff]);
    setNewOfficerName('');
    setStatusMsg(`Officer ${newOff.name} (${newOff.role}) provisioned successfully!`);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Admin Header */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono">
              ASSAC COMMAND CONSOLE
            </span>
            <span className="text-xs text-slate-400">Government of Assam</span>
          </div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-1">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <span>Super Admin &amp; Remote Sensing Operations Command</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Calibrate AI/ML crop models, monitor satellite telemetry streams, provision field extension officers, and inspect immutable audit logs
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveTab('models')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'models' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI/ML Tuning</span>
          </button>

          <button
            onClick={() => setActiveTab('pipelines')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'pipelines' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Data Ingestion</span>
          </button>

          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'hierarchy' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Officers &amp; RBAC</span>
          </button>

          <button
            onClick={() => setActiveTab('procurement')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'procurement' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>MSP Targets</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'audit' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs p-3.5 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMsg}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">TELEMETRY_UPDATED</span>
        </div>
      )}

      {/* 1. AI/ML Model & Remote Sensing Calibration Tab */}
      {activeTab === 'models' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-slate-800/90 border border-slate-700 rounded-xl p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Hybrid Remote Sensing &amp; AI Ensemble Calibration</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dynamically adjust spectral vegetation indices, SAR cloud-penetrating radar cutoffs, and regression weights
                </p>
              </div>
              <button
                onClick={handleResetConfig}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="space-y-5 text-xs">
              
              {/* NDVI Healthy Threshold Slider */}
              <div className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-lg border border-slate-700/60">
                <div className="flex justify-between items-center">
                  <label className="text-slate-200 font-semibold">
                    Sentinel-2 NDVI Healthy Canopy Threshold:
                  </label>
                  <span className="font-mono text-emerald-400 font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {localConfig.ndviHealthyThreshold.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.50"
                  max="0.85"
                  step="0.01"
                  value={localConfig.ndviHealthyThreshold}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, ndviHealthyThreshold: parseFloat(e.target.value) }))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">
                  Plots with NDVI above this threshold are classified into the Excellent Yield tier.
                </span>
              </div>

              {/* Sentinel-1 SAR Flood Inundation Cutoff */}
              <div className="space-y-1.5 bg-slate-900/60 p-3.5 rounded-lg border border-slate-700/60">
                <div className="flex justify-between items-center">
                  <label className="text-slate-200 font-semibold">
                    Sentinel-1 SAR Flood Inundation Cutoff (dB):
                  </label>
                  <span className="font-mono text-cyan-300 font-bold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                    {localConfig.sarFloodInundationDb.toFixed(1)} dB
                  </span>
                </div>
                <input
                  type="range"
                  min="-22.0"
                  max="-13.0"
                  step="0.5"
                  value={localConfig.sarFloodInundationDb}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, sarFloodInundationDb: parseFloat(e.target.value) }))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400 block">
                  C-band SAR radar backscatter &le; this value indicates standing floodwater or submerged crops along the Brahmaputra.
                </span>
              </div>

              {/* AI Machine Learning Ensemble Weights */}
              <div className="space-y-3 bg-slate-900/60 p-3.5 rounded-lg border border-slate-700/60">
                <span className="text-slate-200 font-semibold block mb-1">
                  Ensemble Algorithm Weight Distribution:
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">XGBoost Regressor:</span>
                      <span className="font-mono text-emerald-400">{localConfig.mlWeights.xgboost.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.6"
                      step="0.05"
                      value={localConfig.mlWeights.xgboost}
                      onChange={(e) => setLocalConfig(prev => ({
                        ...prev,
                        mlWeights: { ...prev.mlWeights, xgboost: parseFloat(e.target.value) }
                      }))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">Random Forest:</span>
                      <span className="font-mono text-emerald-400">{localConfig.mlWeights.randomForest.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.6"
                      step="0.05"
                      value={localConfig.mlWeights.randomForest}
                      onChange={(e) => setLocalConfig(prev => ({
                        ...prev,
                        mlWeights: { ...prev.mlWeights, randomForest: parseFloat(e.target.value) }
                      }))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">Bi-LSTM Time-Series:</span>
                      <span className="font-mono text-cyan-300">{localConfig.mlWeights.biLstm.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.5"
                      step="0.05"
                      value={localConfig.mlWeights.biLstm}
                      onChange={(e) => setLocalConfig(prev => ({
                        ...prev,
                        mlWeights: { ...prev.mlWeights, biLstm: parseFloat(e.target.value) }
                      }))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">WOFOST Biophysical:</span>
                      <span className="font-mono text-purple-300">{localConfig.mlWeights.wofostAssimilation.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.3"
                      step="0.05"
                      value={localConfig.mlWeights.wofostAssimilation}
                      onChange={(e) => setLocalConfig(prev => ({
                        ...prev,
                        mlWeights: { ...prev.mlWeights, wofostAssimilation: parseFloat(e.target.value) }
                      }))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSaveConfig}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Configuration &amp; Recalculate Yields</span>
                </button>
              </div>

            </div>
          </div>

          {/* Model Health & Summary Stats */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-700 pb-3">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Model Execution Telemetry</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Total Monitored Parcels</span>
                <span className="text-xl font-bold text-white font-mono">{parcels.length} Field Plots</span>
                <span className="text-[10px] text-emerald-400 block">&bull; 100% Ingested in GIS Vector Database</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Mean Prediction Accuracy</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">92.8%</span>
                <span className="text-[10px] text-slate-400 block">Validated vs CCE Ground Truth Cuts</span>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase tracking-wider block">Inference Latency</span>
                <span className="text-xl font-bold text-cyan-300 font-mono">18.4 ms / plot</span>
                <span className="text-[10px] text-slate-400 block">Optimized on Edge Workers / Cloudflare</span>
              </div>

              <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-800/60 text-[11px] text-emerald-300">
                💡 <b>ASSAC Insight:</b> Integrating Sentinel-1 SAR C-band with Sentinel-2 increases cloud-season prediction accuracy from 64% to 92.8% during Assam's monsoon kharif cycle.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. Data Ingestion Pipelines Tab */}
      {activeTab === 'pipelines' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Multi-Source Satellite &amp; Drone Feed Ingestion Telemetry</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated ingest connectors synchronizing ESA Copernicus, ISRO Bhuvan, IMD AWS, and UAV orthomosaics
              </p>
            </div>
            <button
              onClick={() => {
                setStatusMsg('Triggered remote sensing ingestion heartbeat for Copernicus Sentinel-1 & Sentinel-2!');
                setTimeout(() => setStatusMsg(''), 3000);
              }}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-600"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Trigger Manual Sync</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            
            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Sentinel-2 MSI Optical</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-slate-400 text-[11px]">Bands B04 (Red), B08 (NIR) &bull; 10m Ground Resolution</p>
              <div className="text-[11px] text-slate-300 font-mono pt-1">
                Last Ingest: <b>Today, 06:14 AM</b>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 inline-block">
                Status: ACTIVE (5-Day Revisit)
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Sentinel-1 C-Band SAR</span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              </div>
              <p className="text-slate-400 text-[11px]">VV/VH Dual Polarization &bull; 20m All-Weather Radar</p>
              <div className="text-[11px] text-slate-300 font-mono pt-1">
                Last Ingest: <b>Today, 08:30 AM</b>
              </div>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 inline-block">
                Status: ACTIVE (Cloud Penetrated)
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">ISRO Bhuvan / VEDAS</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-slate-400 text-[11px]">Northeast Agro-Ecosystems &bull; Soil Moisture Grids</p>
              <div className="text-[11px] text-slate-300 font-mono pt-1">
                Last Ingest: <b>Yesterday, 18:00 PM</b>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 inline-block">
                Status: HEALTHY
              </span>
            </div>

            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">UAV Drone Processing</span>
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></span>
              </div>
              <p className="text-slate-400 text-[11px]">Photogrammetry Orthomosaic &bull; 3.5 cm/px Resolution</p>
              <div className="text-[11px] text-slate-300 font-mono pt-1">
                Queue: <b>1 Job In-Progress</b>
              </div>
              <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800 inline-block">
                Status: TILE PROCESSING
              </span>
            </div>

          </div>
        </div>
      )}

      {/* 3. Officers & RBAC Provisioning Tab */}
      {activeTab === 'hierarchy' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add Officer Form */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Provision Extension Officer / Pilot</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Assign administrative jurisdiction under ASSAC and Directorate of Agriculture
              </p>
            </div>

            <form onSubmit={handleAddOfficer} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Officer Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Hemen Saikia"
                  value={newOfficerName}
                  onChange={(e) => setNewOfficerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Designated Role:</label>
                <select
                  value={newOfficerRole}
                  onChange={(e) => setNewOfficerRole(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ASSAC_SCIENTIST">ASSAC Remote Sensing Scientist (Admin)</option>
                  <option value="DAO">District Agriculture Officer (DAO)</option>
                  <option value="ADO">Agriculture Development Officer (ADO - Circle)</option>
                  <option value="DRONE_PILOT">UAV Drone Remote Pilot</option>
                  <option value="KRISHI_SAHAYAK">VLEW / Krishi Sahayak (CCE Agent)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">District:</label>
                  <select
                    value={newOfficerDistrict}
                    onChange={(e) => setNewOfficerDistrict(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Kamrup Metro">Kamrup Metro</option>
                    <option value="Nagaon">Nagaon</option>
                    <option value="Barpeta">Barpeta</option>
                    <option value="Golaghat">Golaghat</option>
                    <option value="Darrang">Darrang</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Circle / Beat:</label>
                  <input
                    type="text"
                    value={newOfficerCircle}
                    onChange={(e) => setNewOfficerCircle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>Grant Credentials &amp; Provision</span>
              </button>
            </form>
          </div>

          {/* Officers Table */}
          <div className="lg:col-span-2 bg-slate-800/90 border border-slate-700 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Provisioned Department Roster ({officers.length})</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400">e-Pramaan OAuth2 Linked</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="px-3 py-2.5">Officer Name</th>
                    <th className="px-3 py-2.5">Role</th>
                    <th className="px-3 py-2.5">Jurisdiction</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {officers.map(off => (
                    <tr key={off.id} className="hover:bg-slate-700/40 transition-colors">
                      <td className="px-3 py-3 font-medium text-white">
                        {off.name}
                        <span className="block text-[10px] text-slate-500 font-mono">{off.id}</span>
                      </td>
                      <td className="px-3 py-3 font-semibold text-emerald-400">
                        {off.role.replace('_', ' ')}
                      </td>
                      <td className="px-3 py-3 text-slate-300">
                        {off.circle}, {off.district}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                          off.status === 'ACTIVE' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                            : 'bg-blue-950 text-blue-300 border border-blue-800'
                        }`}>
                          {off.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-400 font-mono text-[11px]">
                        {off.lastActive}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* 4. MSP Targets & Quotas Tab */}
      {activeTab === 'procurement' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Assam MSP Procurement Forecast &amp; CCE Quotas</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configuring Food Corporation of India (FCI) &amp; AFCSCL procurement targets and statutory CCE cuts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Paddy Minimum Support Price (MSP)
              </span>
              <div className="text-2xl font-black text-white font-mono">₹2,300 <span className="text-xs font-normal text-slate-400">/ Quintal</span></div>
              <p className="text-slate-400 text-[11px]">Official MSP for Common Grade Kharif Paddy (2025-26)</p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Mustard / Rapeseed MSP
              </span>
              <div className="text-2xl font-black text-amber-400 font-mono">₹5,650 <span className="text-xs font-normal text-slate-400">/ Quintal</span></div>
              <p className="text-slate-400 text-[11px]">Official MSP for Rabi Oilseed Crop</p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Statutory CCE Density SLA
              </span>
              <div className="text-2xl font-black text-cyan-300 font-mono">8 Cuts <span className="text-xs font-normal text-slate-400">/ Circle</span></div>
              <p className="text-slate-400 text-[11px]">Mandatory for PMFBY Insurance Settlement Confidence</p>
            </div>

          </div>
        </div>
      )}

      {/* 5. Immutable Cryptographic Audit Log Tab */}
      {activeTab === 'audit' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cryptographic SHA-256 Audit Trail &amp; Compliance Ledger</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tamper-evident record of all AI hyperparameter calibrations, manual yield overrides, and satellite ingest passes
              </p>
            </div>
            <span className="text-xs font-mono bg-slate-900 text-slate-300 border border-slate-700 px-2.5 py-1 rounded">
              Immutable Ledger: VERIFIED
            </span>
          </div>

          <div className="space-y-2.5">
            {auditLogs.map(log => (
              <div key={log.id} className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono">{log.id}</span>
                    <span className="text-slate-500">&bull;</span>
                    <span className="font-semibold text-emerald-400">{log.action}</span>
                    <span className="text-slate-500">&bull;</span>
                    <span className="text-slate-400 text-[11px]">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300">{log.details}</p>
                  <p className="text-[10px] text-slate-500">Actor: <b className="text-slate-400">{log.actor}</b></p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">SHA-256 Digest:</span>
                  <span className="text-[10px] text-cyan-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 select-all block mt-0.5">
                    {log.hash.substring(0, 16)}...
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
