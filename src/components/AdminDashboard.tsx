import React, { useState } from 'react';
import { 
  Sliders, 
  Database, 
  Users, 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  UserPlus, 
  Save, 
  TrendingUp,
  Cpu,
  Target,
  Download,
  AlertTriangle,
  Building,
  Key,
  Layers,
  Search,
  Send,
  Zap,
  BarChart3,
  Lock,
  ArrowRight
} from 'lucide-react';
import { ModelCalibrationConfig, CropParcelRecord, AuditLogEntry } from '../types/cropYield';
import { DEFAULT_MODEL_CONFIG } from '../services/cropYieldEngine';

interface AdminDashboardProps {
  parcels: CropParcelRecord[];
  modelConfig: ModelCalibrationConfig;
  onUpdateModelConfig: (newConfig: ModelCalibrationConfig) => void;
  onRecalculateAllParcels: () => void;
}

type AdminSubTab = 'models' | 'pipelines' | 'cce-quota' | 'procurement' | 'hierarchy' | 'audit';

interface DepartmentOfficer {
  id: string;
  name: string;
  role: 'ASSAC_SCIENTIST' | 'DAO' | 'ADO' | 'DRONE_PILOT' | 'KRISHI_SAHAYAK';
  district: string;
  circle: string;
  status: 'ACTIVE' | 'ON_FIELD' | 'OFFLINE';
  lastActive: string;
  digitalKeyId: string;
}

interface CceTargetQuota {
  circle: string;
  district: string;
  historicalYieldVar: number; // sigma
  permissibleError: number;   // E
  calculatedQuota: number;    // n = Z^2 * sigma^2 / E^2
  completedCuts: number;
  assignedAdo: string;
  status: 'PENDING' | 'DISPATCHED' | 'IN_PROGRESS' | 'COMPLETED';
}

interface SiloStorageUnit {
  id: string;
  name: string;
  district: string;
  agency: 'FCI' | 'AFCSCL' | 'ASWC';
  totalCapacityMt: number;
  currentStockMt: number;
  projectedHarvestIntakeMt: number;
}

const INITIAL_OFFICERS: DepartmentOfficer[] = [
  {
    id: 'OFF-01',
    name: 'Dr. P. K. Goswami',
    role: 'ASSAC_SCIENTIST',
    district: 'Statewide HQ',
    circle: 'ASSAC Dispur',
    status: 'ACTIVE',
    lastActive: 'Just now',
    digitalKeyId: 'RSA-4096-AS-001'
  },
  {
    id: 'OFF-02',
    name: 'Bhaben Kalita',
    role: 'DAO',
    district: 'Kamrup Metro',
    circle: 'Guwahati Circle',
    status: 'ACTIVE',
    lastActive: '12 mins ago',
    digitalKeyId: 'RSA-4096-AS-002'
  },
  {
    id: 'OFF-03',
    name: 'Dipankar Sarma',
    role: 'ADO',
    district: 'Kamrup Metro',
    circle: 'Sonapur',
    status: 'ON_FIELD',
    lastActive: '45 mins ago',
    digitalKeyId: 'ECDSA-256-AS-003'
  },
  {
    id: 'OFF-04',
    name: 'Anurag Sharma',
    role: 'DRONE_PILOT',
    district: 'Kamrup Metro',
    circle: 'Sonapur Cluster',
    status: 'ON_FIELD',
    lastActive: '20 mins ago',
    digitalKeyId: 'DGCA-UIN-PL-004'
  },
  {
    id: 'OFF-05',
    name: 'Mukesh Talukdar',
    role: 'ADO',
    district: 'Barpeta',
    circle: 'Baghbar',
    status: 'ACTIVE',
    lastActive: '1 hour ago',
    digitalKeyId: 'ECDSA-256-AS-005'
  }
];

const INITIAL_CCE_QUOTAS: CceTargetQuota[] = [
  { circle: 'Sonapur', district: 'Kamrup Metro', historicalYieldVar: 280, permissibleError: 75, calculatedQuota: 54, completedCuts: 18, assignedAdo: 'Dipankar Sarma', status: 'IN_PROGRESS' },
  { circle: 'Baghbar', district: 'Barpeta', historicalYieldVar: 420, permissibleError: 90, calculatedQuota: 83, completedCuts: 12, assignedAdo: 'Mukesh Talukdar', status: 'IN_PROGRESS' },
  { circle: 'Kaliabor', district: 'Nagaon', historicalYieldVar: 310, permissibleError: 70, calculatedQuota: 75, completedCuts: 32, assignedAdo: 'Jatin Bora', status: 'IN_PROGRESS' },
  { circle: 'Bokakhat', district: 'Golaghat', historicalYieldVar: 260, permissibleError: 80, calculatedQuota: 41, completedCuts: 41, assignedAdo: 'Prabin Saikia', status: 'COMPLETED' },
  { circle: 'Mangaldai', district: 'Darrang', historicalYieldVar: 340, permissibleError: 85, calculatedQuota: 62, completedCuts: 0, assignedAdo: 'Animesh Deka', status: 'DISPATCHED' },
  { circle: 'Silchar', district: 'Cachar', historicalYieldVar: 390, permissibleError: 95, calculatedQuota: 65, completedCuts: 0, assignedAdo: 'Debasish Roy', status: 'PENDING' }
];

const INITIAL_SILOS: SiloStorageUnit[] = [
  { id: 'SILO-01', name: 'Changsari Modern Silo Complex', district: 'Kamrup Metro', agency: 'FCI', totalCapacityMt: 50000, currentStockMt: 22000, projectedHarvestIntakeMt: 24500 },
  { id: 'SILO-02', name: 'Nagaon Central Warehousing Godown', district: 'Nagaon', agency: 'ASWC', totalCapacityMt: 45000, currentStockMt: 18500, projectedHarvestIntakeMt: 28000 },
  { id: 'SILO-03', name: 'Barpeta Road State Warehouse', district: 'Barpeta', agency: 'AFCSCL', totalCapacityMt: 35000, currentStockMt: 14000, projectedHarvestIntakeMt: 19500 },
  { id: 'SILO-04', name: 'Dergaon FCI Storage Depot', district: 'Golaghat', agency: 'FCI', totalCapacityMt: 25000, currentStockMt: 8000, projectedHarvestIntakeMt: 14200 },
  { id: 'SILO-05', name: 'Mangaldai Food Grain Buffer Silo', district: 'Darrang', agency: 'AFCSCL', totalCapacityMt: 30000, currentStockMt: 11000, projectedHarvestIntakeMt: 16800 }
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
  const [cceQuotas, setCceQuotas] = useState<CceTargetQuota[]>(INITIAL_CCE_QUOTAS);
  const [silos, setSilos] = useState<SiloStorageUnit[]>(INITIAL_SILOS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [auditSearchQuery, setAuditSearchQuery] = useState<string>('');
  const [isSimulatingSync, setIsSimulatingSync] = useState<boolean>(false);

  // Officer Provisioning Form
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerRole, setNewOfficerRole] = useState<DepartmentOfficer['role']>('ADO');
  const [newOfficerDistrict, setNewOfficerDistrict] = useState('Nagaon');
  const [newOfficerCircle, setNewOfficerCircle] = useState('Samaguri');

  // Model Checkpoint Presets
  const applyPreset = (presetName: string) => {
    let preset: ModelCalibrationConfig;
    if (presetName === 'monsoon-sali') {
      preset = {
        ...localConfig,
        sarBiomassCoefficient: 1.65,
        ndviHealthyThreshold: 0.60,
        mlWeights: { xgboost: 0.45, randomForest: 0.25, biLstm: 0.20, wofostAssimilation: 0.10 },
        sarFloodInundationDb: -16.5,
        opticalCloudMaskTolerancePercent: 75
      };
    } else if (presetName === 'flood-recovery') {
      preset = {
        ...localConfig,
        sarBiomassCoefficient: 1.80,
        ndviHealthyThreshold: 0.55,
        mlWeights: { xgboost: 0.40, randomForest: 0.20, biLstm: 0.30, wofostAssimilation: 0.10 },
        sarFloodInundationDb: -15.0,
        opticalCloudMaskTolerancePercent: 85
      };
    } else {
      // summer boro
      preset = {
        ...localConfig,
        sarBiomassCoefficient: 1.25,
        ndviHealthyThreshold: 0.70,
        mlWeights: { xgboost: 0.40, randomForest: 0.35, biLstm: 0.15, wofostAssimilation: 0.10 },
        sarFloodInundationDb: -18.0,
        opticalCloudMaskTolerancePercent: 40
      };
    }

    setLocalConfig(preset);
    onUpdateModelConfig(preset);
    onRecalculateAllParcels();
    setStatusMsg(`Applied Checkpoint: ${presetName.toUpperCase()}! Model weights recalculated.`);
    setTimeout(() => setStatusMsg(''), 4000);
  };

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
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleTriggerSatelliteSync = () => {
    setIsSimulatingSync(true);
    setTimeout(() => {
      setIsSimulatingSync(false);
      const newLog: AuditLogEntry = {
        id: `LOG-${String(auditLogs.length + 1).padStart(3, '0')}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        actor: 'Copernicus STAC Sentry',
        action: 'SENTINEL_SAR_SYNC',
        details: 'Ingested Sentinel-1 C-Band pass (VV/VH dB) for Brahmaputra Basin. Processed with 7x7 Lee Speckle Filter.',
        hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      };
      setAuditLogs(prev => [newLog, ...prev]);
      setStatusMsg('Satellite Data Streams Synchronized: Sentinel-1 & 2 tiles processed successfully.');
      setTimeout(() => setStatusMsg(''), 4000);
    }, 1800);
  };

  const handleDispatchCceQuota = (circle: string) => {
    setCceQuotas(prev => prev.map(q => q.circle === circle ? { ...q, status: 'DISPATCHED' } : q));
    const newLog: AuditLogEntry = {
      id: `LOG-${String(auditLogs.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'District Agriculture Command',
      action: 'CCE_TARGET_DISPATCH',
      details: `Dispatched seasonal harvest cut quota for ${circle} Circle to field ADO team.`,
      hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    };
    setAuditLogs(prev => [newLog, ...prev]);
    setStatusMsg(`CCE Harvest Cut Quota Dispatched for ${circle}!`);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficerName.trim()) return;

    const newOfficer: DepartmentOfficer = {
      id: `OFF-${String(officers.length + 1).padStart(2, '0')}`,
      name: newOfficerName.trim(),
      role: newOfficerRole,
      district: newOfficerDistrict,
      circle: newOfficerCircle,
      status: 'ACTIVE',
      lastActive: 'Just now',
      digitalKeyId: `RSA-4096-AS-${String(officers.length + 1).padStart(3, '0')}`
    };

    setOfficers(prev => [...prev, newOfficer]);
    setNewOfficerName('');
    setStatusMsg(`Officer ${newOfficer.name} provisioned with role ${newOfficer.role}!`);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleExportAuditLogs = () => {
    const headers = ['ID,Timestamp,Actor,Action,Details,SHA-256 Hash\n'];
    const rows = auditLogs.map(l => `"${l.id}","${l.timestamp}","${l.actor}","${l.action}","${l.details}","${l.hash}"\n`);
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SasyaDrishti_Audit_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredLogs = auditLogs.filter(l => 
    l.actor.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
    l.action.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
    l.details.toLowerCase().includes(auditSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Admin Header */}
      <div className="bg-white rounded-xl shadow-xs border border-amber-900/10 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                State Operations Command Center
              </span>
              <span className="bg-stone-100 text-stone-700 border border-stone-300 px-2.5 py-0.5 rounded text-xs font-semibold">
                প্ৰশাসনিক নিয়ন্ত্ৰণ কেন্দ্ৰ
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Super Admin Console &amp; Model Governance
            </h1>
            <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
              Enterprise administration console for ASSAC scientists, agricultural economists, and state administrators. 
              Calibrate all-weather SAR flood cutoffs, dynamic CCE sampling quotas, and MSP silo storage logistics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTriggerSatelliteSync}
              disabled={isSimulatingSync}
              className="inline-flex items-center space-x-2 bg-amber-800 hover:bg-amber-900 text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isSimulatingSync ? 'animate-spin' : ''}`} />
              <span>{isSimulatingSync ? 'Syncing Copernicus...' : 'Force Satellite Ingest Sync'}</span>
            </button>
            <div className="px-3.5 py-2 bg-amber-50 border border-amber-200/80 rounded-lg text-xs text-amber-900 font-mono">
              <span className="font-bold">Access Level:</span> State Super Admin
            </div>
          </div>
        </div>

        {/* Status Notification Banner */}
        {statusMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-stone-200 bg-white rounded-t-xl px-4 pt-2 overflow-x-auto shadow-2xs">
        <button
          onClick={() => setActiveTab('models')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'models'
              ? 'border-amber-800 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>AI / ML Model Tuning</span>
        </button>

        <button
          onClick={() => setActiveTab('pipelines')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'pipelines'
              ? 'border-amber-800 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Satellite Ingestion Sentries</span>
        </button>

        <button
          onClick={() => setActiveTab('cce-quota')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'cce-quota'
              ? 'border-amber-800 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>CCE Circle Quota Dispatcher</span>
        </button>

        <button
          onClick={() => setActiveTab('procurement')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'procurement'
              ? 'border-amber-800 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>MSP &amp; Silo Storage Logistics</span>
        </button>

        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'hierarchy'
              ? 'border-amber-800 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Officer RBAC &amp; Key Vault</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center space-x-2 py-3 px-4 border-b-2 text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'audit'
              ? 'border-amber-800 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Cryptographic Audit Ledger</span>
        </button>
      </div>

      {/* SUB-TAB 1: AI / ML MODEL TUNING */}
      {activeTab === 'models' && (
        <div className="bg-white rounded-b-xl shadow-xs border border-amber-900/10 p-6 sm:p-8 space-y-8">
          
          {/* Checkpoint Presets */}
          <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-stone-900 block">Assam Seasonal Model Presets</span>
              <span className="text-[11px] text-stone-500">Quick-load tuned hyperparameters for specific monsoon and cropping windows.</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset('monsoon-sali')}
                className="px-3 py-1.5 bg-white border border-stone-300 hover:border-amber-800 hover:bg-amber-50 rounded text-xs font-medium text-stone-800 transition-all cursor-pointer"
              >
                Kharif Sali Monsoon Baseline
              </button>
              <button
                type="button"
                onClick={() => applyPreset('flood-recovery')}
                className="px-3 py-1.5 bg-white border border-stone-300 hover:border-amber-800 hover:bg-amber-50 rounded text-xs font-medium text-stone-800 transition-all cursor-pointer"
              >
                Post-Flood Resilience Tuning
              </button>
              <button
                type="button"
                onClick={() => applyPreset('summer-boro')}
                className="px-3 py-1.5 bg-white border border-stone-300 hover:border-amber-800 hover:bg-amber-50 rounded text-xs font-medium text-stone-800 transition-all cursor-pointer"
              >
                Summer Boro Irrigated High-Yield
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column: Remote Sensing Fusion Weights */}
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-2">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-800" />
                  Remote Sensing Layer Weighting
                </h3>
                <p className="text-xs text-stone-500">Configure contribution ratio of C-Band SAR radar vs optical Sentinel-2.</p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-800">Sentinel-1 SAR Biomass Coefficient</span>
                  <span className="font-mono font-bold text-amber-900">{localConfig.sarBiomassCoefficient}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.2"
                  step="0.05"
                  value={localConfig.sarBiomassCoefficient}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, sarBiomassCoefficient: parseFloat(e.target.value) }))}
                  className="w-full accent-amber-800 cursor-pointer"
                />
                <span className="text-[10px] text-stone-500">Cross-polarization VH volume scattering multiplier for dense rice canopy biomass.</span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-800">Sentinel-2 Optical NDVI Healthy Threshold</span>
                  <span className="font-mono font-bold text-amber-900">{localConfig.ndviHealthyThreshold}</span>
                </div>
                <input
                  type="range"
                  min="0.45"
                  max="0.85"
                  step="0.05"
                  value={localConfig.ndviHealthyThreshold}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, ndviHealthyThreshold: parseFloat(e.target.value) }))}
                  className="w-full accent-amber-800 cursor-pointer"
                />
                <span className="text-[10px] text-stone-500">Vegetation index threshold determining normal vs robust vegetative vigor.</span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-800">SAR Flood Inundation Cutoff Threshold</span>
                  <span className="font-mono font-bold text-amber-900">{localConfig.sarFloodInundationDb} dB</span>
                </div>
                <input
                  type="range"
                  min="-22.0"
                  max="-12.0"
                  step="0.5"
                  value={localConfig.sarFloodInundationDb}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, sarFloodInundationDb: parseFloat(e.target.value) }))}
                  className="w-full accent-amber-800 cursor-pointer"
                />
                <span className="text-[10px] text-stone-500">VV backscatter below this threshold flags specular standing water &amp; flood damage.</span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-800">Optical Cloud Mask Tolerance Cutoff</span>
                  <span className="font-mono font-bold text-amber-900">{localConfig.opticalCloudMaskTolerancePercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={localConfig.opticalCloudMaskTolerancePercent}
                  onChange={(e) => setLocalConfig(prev => ({ ...prev, opticalCloudMaskTolerancePercent: parseInt(e.target.value) }))}
                  className="w-full accent-amber-800 cursor-pointer"
                />
                <span className="text-[10px] text-stone-500">Switches automatically to 100% SAR backscatter when cloud cover exceeds this percentage.</span>
              </div>
            </div>

            {/* Right Column: AI / ML Ensemble Stacking */}
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-2">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-800" />
                  Hybrid Ensemble Model Stacking
                </h3>
                <p className="text-xs text-stone-500">Fine-tune weights across gradient boosting, random forest, and deep LSTM models.</p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-800">Extreme Gradient Boosting (XGBoost)</span>
                  <span className="font-mono font-bold text-amber-900">{Math.round(localConfig.mlWeights.xgboost * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={localConfig.mlWeights.xgboost}
                  onChange={(e) => setLocalConfig(prev => ({
                    ...prev,
                    mlWeights: { ...prev.mlWeights, xgboost: parseFloat(e.target.value) }
                  }))}
                  className="w-full accent-amber-800 cursor-pointer"
                />
                <span className="text-[10px] text-stone-500">Regularized gradient boosted regression on tabular vegetation &amp; weather features.</span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-800">Random Forest Regressor</span>
                  <span className="font-mono font-bold text-amber-900">{Math.round(localConfig.mlWeights.randomForest * 100)}%</span>
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
                  className="w-full accent-amber-800 cursor-pointer"
                />
                <span className="text-[10px] text-stone-500">Multi-tree bagging resistant to localized soil and micro-topography outliers.</span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-800">Bidirectional LSTM Deep Neural Network</span>
                  <span className="font-mono font-bold text-amber-900">{Math.round(localConfig.mlWeights.biLstm * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.5"
                  step="0.05"
                  value={localConfig.mlWeights.biLstm}
                  onChange={(e) => setLocalConfig(prev => ({
                    ...prev,
                    mlWeights: { ...prev.mlWeights, biLstm: parseFloat(e.target.value) }
                  }))}
                  className="w-full accent-amber-800 cursor-pointer"
                />
                <span className="text-[10px] text-stone-500">Models multi-temporal 6-day SAR backscatter sequence over 120-day growth cycles.</span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-800">WOFOST Biophysical Assimilation Weight</span>
                  <span className="font-mono font-bold text-amber-900">{Math.round(localConfig.mlWeights.wofostAssimilation * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.4"
                  step="0.05"
                  value={localConfig.mlWeights.wofostAssimilation}
                  onChange={(e) => setLocalConfig(prev => ({
                    ...prev,
                    mlWeights: { ...prev.mlWeights, wofostAssimilation: parseFloat(e.target.value) }
                  }))}
                  className="w-full accent-amber-800 cursor-pointer"
                />
                <span className="text-[10px] text-stone-500">Constrains statistical estimations within biological physiological limits.</span>
              </div>

            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              onClick={handleResetConfig}
              className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleSaveConfig}
              className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Apply Parameters &amp; Recalibrate Parcels</span>
            </button>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: SATELLITE INGESTION SENTRIES */}
      {activeTab === 'pipelines' && (
        <div className="bg-white rounded-b-xl shadow-xs border border-amber-900/10 p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-base font-bold text-stone-900">Earth Observation Data Pipelines &amp; Constellation Telemetry</h2>
            <p className="text-xs text-stone-500">Live operational status of orbital sensor feeds serving Assam's 35 agricultural districts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900">Sentinel-1A/1C (SAR)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-stone-600">ESA Copernicus • C-Band Dual Pol (VV/VH)</p>
              <div className="text-[10px] font-mono text-stone-500 space-y-0.5 pt-1">
                <div>Repeat: 6-day cycle</div>
                <div>Status: Ingesting Level-1 GRD</div>
                <div>Last Pass: 14 hours ago (Orbit #29481)</div>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900">Sentinel-2A/2B/2C (MSI)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-stone-600">ESA Copernicus • 13 Optical Bands (10m)</p>
              <div className="text-[10px] font-mono text-stone-500 space-y-0.5 pt-1">
                <div>Repeat: 5-day cycle</div>
                <div>Status: Level-2A BOA Surface Refl.</div>
                <div>Cloud Mask: SCL Scene Class active</div>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900">ISRO RISAT-1B / EOS-04</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-[11px] text-stone-600">ISRO Bhuvan / VEDAS • C-Band SAR</p>
              <div className="text-[10px] font-mono text-stone-500 space-y-0.5 pt-1">
                <div>Source: National Remote Sensing Ctr</div>
                <div>Status: Synced with ASSAC Dispur</div>
                <div>Mode: High-Res Circular Pol (FRS-1)</div>
              </div>
            </div>

            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-900">IMD AWS Weather Grids</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-[11px] text-stone-600">India Meteorological Dept • 0.25 deg</p>
              <div className="text-[10px] font-mono text-stone-500 space-y-0.5 pt-1">
                <div>Rainfall, Temp, Solar Radiation</div>
                <div>Status: Daily automated ingest</div>
                <div>Stations: 42 AWS in Assam</div>
              </div>
            </div>

          </div>

          <div className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-xl flex items-center justify-between text-xs text-amber-950">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-800" />
              <span>
                <strong>Automated Preprocessing:</strong> Doppler Terrain Correction (SRTM 30m) &amp; 7x7 Lee Speckle Filter are automatically executed on raw SAR granules before ML inference.
              </span>
            </div>
            <span className="font-mono font-bold text-amber-900">Latency: 18.4 ms</span>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CCE CIRCLE QUOTA DISPATCHER */}
      {activeTab === 'cce-quota' && (
        <div className="bg-white rounded-b-xl shadow-xs border border-amber-900/10 p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-stone-900">Crop Cutting Experiment (CCE) Target Quota Dispatcher</h2>
              <p className="text-xs text-stone-500">
                Statistically determined CCE sample sizes based on formula: <code className="bg-stone-100 px-1 py-0.5 rounded text-amber-900 font-mono">n = (Z^2 * σ^2) / E^2</code> (95% Confidence Interval).
              </p>
            </div>
            <span className="text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded">
              Total Target: 379 Physical Cuts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2d1b11] text-white">
                <tr>
                  <th className="py-3 px-4 font-semibold">Circle &amp; District</th>
                  <th className="py-3 px-4 font-semibold">Variance (σ)</th>
                  <th className="py-3 px-4 font-semibold">Permissible Error (E)</th>
                  <th className="py-3 px-4 font-semibold">Required Quota (n)</th>
                  <th className="py-3 px-4 font-semibold">Progress</th>
                  <th className="py-3 px-4 font-semibold">Assigned ADO</th>
                  <th className="py-3 px-4 font-semibold">Dispatch Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {cceQuotas.map((q, idx) => {
                  const progressPct = Math.round((q.completedCuts / q.calculatedQuota) * 100);
                  return (
                    <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {q.circle} <span className="text-stone-500 font-normal">({q.district})</span>
                      </td>
                      <td className="py-3 px-4 text-stone-600 font-mono">{q.historicalYieldVar} kg/ha</td>
                      <td className="py-3 px-4 text-stone-600 font-mono">&plusmn;{q.permissibleError} kg/ha</td>
                      <td className="py-3 px-4 font-bold text-amber-900 font-mono">{q.calculatedQuota} cuts</td>
                      <td className="py-3 px-4">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[10px] text-stone-600">
                            <span>{q.completedCuts} logged</span>
                            <span className="font-semibold">{progressPct}%</span>
                          </div>
                          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${progressPct >= 100 ? 'bg-emerald-600' : 'bg-amber-600'}`} 
                              style={{ width: `${Math.min(100, progressPct)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-700 font-medium">{q.assignedAdo}</td>
                      <td className="py-3 px-4">
                        {q.status === 'COMPLETED' ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Completed</span>
                          </span>
                        ) : q.status === 'IN_PROGRESS' || q.status === 'DISPATCHED' ? (
                          <button
                            onClick={() => handleDispatchCceQuota(q.circle)}
                            className="inline-flex items-center space-x-1 text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Re-Dispatch</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDispatchCceQuota(q.circle)}
                            className="inline-flex items-center space-x-1 text-white bg-amber-800 hover:bg-amber-900 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            <span>Dispatch Target</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: MSP & SILO STORAGE LOGISTICS */}
      {activeTab === 'procurement' && (
        <div className="bg-white rounded-b-xl shadow-xs border border-amber-900/10 p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-stone-900">Minimum Support Price (MSP) &amp; Silo Storage Allocation</h2>
              <p className="text-xs text-stone-500">
                Logistics planning for Food Corporation of India (FCI) &amp; Assam Food and Civil Supplies Corporation Ltd (AFCSCL).
              </p>
            </div>
            <span className="text-xs font-mono font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1 rounded">
              MSP Benchmark: ₹2,320 / Quintal (Sali Common Paddy)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {silos.map((silo) => {
              const totalRequired = silo.currentStockMt + silo.projectedHarvestIntakeMt;
              const utilizationPct = Math.round((totalRequired / silo.totalCapacityMt) * 100);
              const isOverCapacity = utilizationPct > 90;

              return (
                <div key={silo.id} className="bg-stone-50 border border-stone-200 p-5 rounded-xl space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-900 font-bold bg-amber-100 px-1.5 py-0.5 rounded">
                        {silo.agency} • {silo.district}
                      </span>
                      <h3 className="text-xs font-bold text-stone-900 mt-1.5">{silo.name}</h3>
                    </div>
                    {isOverCapacity ? (
                      <span className="text-[10px] font-semibold bg-red-100 text-red-800 border border-red-300 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Cap Warning
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded">
                        Available
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs text-stone-600">
                      <span>Total Silo Capacity:</span>
                      <span className="font-mono font-bold text-stone-900">{silo.totalCapacityMt.toLocaleString()} MT</span>
                    </div>
                    <div className="flex justify-between text-xs text-stone-600">
                      <span>Existing Stock:</span>
                      <span className="font-mono text-stone-700">{silo.currentStockMt.toLocaleString()} MT</span>
                    </div>
                    <div className="flex justify-between text-xs text-stone-600">
                      <span>Projected Intake:</span>
                      <span className="font-mono font-bold text-amber-900">+{silo.projectedHarvestIntakeMt.toLocaleString()} MT</span>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] font-semibold mb-1">
                        <span className="text-stone-700">Storage Utilization</span>
                        <span className={isOverCapacity ? 'text-red-700 font-bold' : 'text-stone-800'}>
                          {utilizationPct}%
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isOverCapacity ? 'bg-red-600' : utilizationPct > 70 ? 'bg-amber-600' : 'bg-emerald-600'}`} 
                          style={{ width: `${Math.min(100, utilizationPct)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: OFFICER RBAC & KEY VAULT */}
      {activeTab === 'hierarchy' && (
        <div className="bg-white rounded-b-xl shadow-xs border border-amber-900/10 p-6 sm:p-8 space-y-6">
          <div className="border-b border-stone-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-stone-900">Role-Based Access Control (RBAC) &amp; Digital Signing Key Vault</h2>
              <p className="text-xs text-stone-500">Authorized personnel credentials for certificate issuance, model recalibration, and CCE logging.</p>
            </div>
            <span className="text-xs font-mono font-semibold bg-stone-100 text-stone-800 border border-stone-300 px-2.5 py-1 rounded">
              PKI Cryptographic Authentication
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Officer List */}
            <div className="lg:col-span-2 overflow-x-auto border border-stone-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#2d1b11] text-white">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Officer Name</th>
                    <th className="py-2.5 px-3 font-semibold">Role</th>
                    <th className="py-2.5 px-3 font-semibold">Jurisdiction</th>
                    <th className="py-2.5 px-3 font-semibold">Digital Key ID</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {officers.map((officer) => (
                    <tr key={officer.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3 px-3 font-bold text-stone-900">{officer.name}</td>
                      <td className="py-3 px-3">
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          {officer.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-600">{officer.circle}, {officer.district}</td>
                      <td className="py-3 px-3 font-mono text-stone-500 text-[10px] flex items-center gap-1">
                        <Key className="w-3 h-3 text-amber-700" />
                        {officer.digitalKeyId}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          officer.status === 'ACTIVE' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : officer.status === 'ON_FIELD'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {officer.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Provision New Officer Form */}
            <form onSubmit={handleAddOfficer} className="bg-stone-50 border border-stone-200 p-5 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-amber-800" />
                Provision Department Officer
              </h3>

              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Himanta Barman"
                  value={newOfficerName}
                  onChange={(e) => setNewOfficerName(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">Assigned Role</label>
                <select
                  value={newOfficerRole}
                  onChange={(e) => setNewOfficerRole(e.target.value as any)}
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-amber-800"
                >
                  <option value="ASSAC_SCIENTIST">ASSAC Scientist (Super Admin)</option>
                  <option value="DAO">District Agriculture Officer (DAO)</option>
                  <option value="ADO">Agriculture Development Officer (ADO)</option>
                  <option value="DRONE_PILOT">Certified UAV Drone Pilot</option>
                  <option value="KRISHI_SAHAYAK">Krishi Sahayak (Field Cut)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">Assam District</label>
                <select
                  value={newOfficerDistrict}
                  onChange={(e) => setNewOfficerDistrict(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-amber-800"
                >
                  <option value="Kamrup Metro">Kamrup Metro</option>
                  <option value="Nagaon">Nagaon</option>
                  <option value="Barpeta">Barpeta</option>
                  <option value="Golaghat">Golaghat</option>
                  <option value="Darrang">Darrang</option>
                  <option value="Cachar">Cachar</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1">Circle / Jurisdiction</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kaliabor Circle"
                  value={newOfficerCircle}
                  onChange={(e) => setNewOfficerCircle(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-800 hover:bg-amber-900 text-white py-2 rounded text-xs font-semibold transition-colors mt-2 cursor-pointer"
              >
                Issue Digital Key &amp; Provision Officer
              </button>
            </form>

          </div>
        </div>
      )}

      {/* SUB-TAB 6: CRYPTOGRAPHIC AUDIT LEDGER */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-b-xl shadow-xs border border-amber-900/10 p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-base font-bold text-stone-900">Cryptographic System Audit Log &amp; Tamper-Evident Ledger</h2>
              <p className="text-xs text-stone-500">Every operational action is hashed with SHA-256 to ensure absolute evidentiary auditability.</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter audit logs..."
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 rounded text-xs text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-amber-800"
                />
              </div>
              <button
                onClick={handleExportAuditLogs}
                className="inline-flex items-center space-x-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2d1b11] text-white">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                  <th className="py-2.5 px-3 font-semibold">Actor / System</th>
                  <th className="py-2.5 px-3 font-semibold">Action</th>
                  <th className="py-2.5 px-3 font-semibold">Operational Details</th>
                  <th className="py-2.5 px-3 font-semibold">SHA-256 Digest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px] whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-3 font-semibold text-stone-900">{log.actor}</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded text-[10px] font-mono">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600">{log.details}</td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-amber-900">
                      {log.hash.substring(0, 16)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
export default AdminDashboard;
