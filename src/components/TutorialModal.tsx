import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Sprout, 
  Satellite, 
  Plane, 
  FileCheck2, 
  Sliders, 
  CheckCircle2, 
  ArrowRight, 
  Waves,
  Cpu
} from 'lucide-react';
import { ActiveTab } from './Navbar';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'architecture' | 'ai_models' | 'walkthrough'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-stone-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#2d1b11] px-6 py-4 flex justify-between items-center border-b border-amber-900/60 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-800 text-white border border-amber-600">
              <BookOpen className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  SasyaDrishti Architecture &amp; User Guide
                </h3>
                <span className="text-[10px] bg-amber-950 text-amber-200 border border-amber-700 px-2 py-0.5 rounded-full font-bold">
                  NESFIC-D-12
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-medium">
                Assam State Space Application Centre (ASSAC) &bull; Department of Science &amp; Technology, Govt of Assam
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-amber-200 hover:text-white p-1 rounded-lg hover:bg-amber-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-stone-200 px-6 bg-stone-50 overflow-x-auto">
          <button
            onClick={() => setActiveSection('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'overview'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            1. Problem Context &amp; Solution
          </button>

          <button
            onClick={() => setActiveSection('architecture')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'architecture'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            2. Multi-Tier Data Fusion
          </button>

          <button
            onClick={() => setActiveSection('ai_models')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'ai_models'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            3. AI &amp; Biophysical Modeling
          </button>

          <button
            onClick={() => setActiveSection('walkthrough')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'walkthrough'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            4. Portals &amp; Operations Tour
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
          
          {/* 1. Overview */}
          {activeSection === 'overview' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 mb-1">
                  <Sprout className="w-4 h-4 text-amber-800" />
                  <span>The NESFIC-D-12 Challenge in Assam</span>
                </h4>
                <p className="text-stone-700 text-xs leading-relaxed">
                  Assam's agricultural economy faces four structural hurdles in estimating crop area and yield:
                  <b> persistent monsoon cloud cover</b> (which blinds conventional optical satellites like Sentinel-2 and Landsat for up to 80 days during the critical Kharif Sali paddy vegetative season),
                  <b> smallholder fragmented land holdings</b> (average plot &lt; 0.5 hectare),
                  <b> recurring Brahmaputra flood inundation</b>, and 
                  <b> manual Crop Cutting Experiment (CCE) latency</b> (taking months to compile).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                  <span className="font-bold text-stone-900 block">Traditional Manual Approach</span>
                  <ul className="space-y-1 text-stone-600 list-disc list-inside text-[11px]">
                    <li>Dispersed manual revenue patwari/ADO inspection</li>
                    <li>Delayed yield reports 3–4 months post-harvest</li>
                    <li>Ad-hoc flood loss claims with high dispute rates</li>
                    <li>Impedes timely MSP procurement planning for FCI</li>
                  </ul>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                  <span className="font-bold text-amber-950 block">SasyaDrishti Multi-Source Engine</span>
                  <ul className="space-y-1 text-stone-700 list-disc list-inside text-[11px]">
                    <li><b>100% All-Weather Monitoring:</b> Sentinel-1 C-band SAR radar penetrates cloud cover</li>
                    <li><b>Centimeter UAV Detail:</b> 3.5 cm/px multispectral drone scans for crop stress &amp; density</li>
                    <li><b>Digital CCE Logging:</b> Real-time moisture-corrected ground-truth cuts</li>
                    <li><b>Instant Yield Certification:</b> Cryptographic tokens for MSP and PMFBY claims</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 2. Architecture */}
          {activeSection === 'architecture' && (
            <div className="space-y-4">
              <h4 className="font-bold text-stone-900 text-sm">
                4-Tier Multi-Sensor Fusion Pipeline
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <Waves className="w-4 h-4" />
                    <span>Tier 1: Sentinel-1 C-Band SAR Radar</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Dual-polarization (VV/VH) microwave radar penetrates rain clouds. In flooded rice paddies, cross-polarization VH backscatter directly tracks volume scattering from standing rice canopies to quantify fresh biomass, while co-polarized (VV) detects standing water (&le; -16.5 dB) for real-time flood inundation mapping.
                  </p>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Satellite className="w-4 h-4" />
                    <span>Tier 2: Sentinel-2 Multispectral Optical</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    10m resolution bands compute multi-temporal NDVI, EVI (photosynthetic activity), and NDWI (canopy moisture content) on cloud-free acquisition windows to monitor vegetative vigour.
                  </p>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-900 font-bold">
                    <Plane className="w-4 h-4" />
                    <span>Tier 3: UAV Drone Multispectral Orthomosaics</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Sub-5cm drone flights over pilot agricultural clusters extract Canopy Height Models (CHM), detect micro-level pest stress, and measure plant emergence density.
                  </p>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-800 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tier 4: Field CCE Ground-Truthing</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">
                    Standardized 5m &times; 5m quadrant harvest cuts logged with moisture meter readings dynamically anchor and calibrate machine learning regression weights.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. AI Models */}
          {activeSection === 'ai_models' && (
            <div className="space-y-4">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-800" />
                  <span>Hybrid Machine Learning &amp; Crop Growth Model</span>
                </h4>
                <p className="text-stone-700 text-xs">
                  Rather than relying on black-box predictions, SasyaDrishti uses an ensemble architecture:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
                    <b className="text-stone-900 block mb-0.5 font-bold">XGBoost &amp; Random Forest Regressors (70%)</b>
                    Non-linear regression on multi-temporal NDVI, EVI, and SAR VH backscatter curves trained on 5 years of historical Assam CCE data.
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
                    <b className="text-amber-900 block mb-0.5 font-bold">1D-CNN / Bi-LSTM Time Series (20%)</b>
                    Captures temporal phenological evolution across Sowing &rarr; Tillering &rarr; Panicle Initiation &rarr; Maturity stages.
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs sm:col-span-2">
                    <b className="text-amber-800 block mb-0.5 font-bold">WOFOST / DSSAT Biophysical Crop Growth Assimilation (10%)</b>
                    Integrates daily solar radiation, temperature, and rainfall from Assam Automatic Weather Stations (AWS) to enforce physical biological boundaries on predicted yields.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Walkthrough */}
          {activeSection === 'walkthrough' && (
            <div className="space-y-4">
              <h4 className="font-bold text-stone-900 text-sm">
                Explore the 6 Core Operational Portals
              </h4>

              <div className="space-y-2.5">
                <div 
                  onClick={() => { onClose(); onNavigateTab('dashboard'); }}
                  className="bg-stone-50 hover:bg-amber-50/60 p-3.5 rounded-xl border border-stone-200 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Sprout className="w-5 h-5 text-amber-800" />
                    <div>
                      <span className="font-bold text-stone-900 block">Executive Yield &amp; Acreage Dashboard</span>
                      <span className="text-[11px] text-stone-500">District-level production targets, SAR radar coverage, and flood advisories</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </div>

                <div 
                  onClick={() => { onClose(); onNavigateTab('satellite-gis'); }}
                  className="bg-stone-50 hover:bg-amber-50/60 p-3.5 rounded-xl border border-stone-200 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Satellite className="w-5 h-5 text-amber-800" />
                    <div>
                      <span className="font-bold text-stone-900 block">Satellite &amp; Drone WebGIS Map Viewer</span>
                      <span className="text-[11px] text-stone-500">Interactive GIS layer toggles: Optical NDVI, SAR Radar Flood Mask, UAV Orthomosaics</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </div>

                <div 
                  onClick={() => { onClose(); onNavigateTab('drone-cce'); }}
                  className="bg-stone-50 hover:bg-amber-50/60 p-3.5 rounded-xl border border-stone-200 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Plane className="w-5 h-5 text-amber-800" />
                    <div>
                      <span className="font-bold text-stone-900 block">Drone Missions &amp; Field CCE Logging</span>
                      <span className="text-[11px] text-stone-500">Dispatch UAV flights and record moisture-corrected 5x5m CCE quadrant cuts</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </div>

                <div 
                  onClick={() => { onClose(); onNavigateTab('drone-tech'); }}
                  className="bg-stone-50 hover:bg-amber-50/60 p-3.5 rounded-xl border border-stone-200 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-amber-800" />
                    <div>
                      <span className="font-bold text-stone-900 block">Drone Technology &amp; Specifications</span>
                      <span className="text-[11px] text-stone-500">Airframes (VTOL vs RTK Quad), 5-band multispectral sensors, SfM photogrammetry, and mission simulator</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </div>

                <div 
                  onClick={() => { onClose(); onNavigateTab('farmer-portal'); }}
                  className="bg-stone-50 hover:bg-amber-50/60 p-3.5 rounded-xl border border-stone-200 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileCheck2 className="w-4 h-4 text-amber-800" />
                    <div>
                      <span className="font-bold text-stone-900 block">Farmer Advisory &amp; Digital Yield Certificate</span>
                      <span className="text-[11px] text-stone-500">Search by Dag/Patta, generate verifiable SHA-256 yield certificates for MSP &amp; PMFBY</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </div>

                <div 
                  onClick={() => { onClose(); onNavigateTab('admin-console'); }}
                  className="bg-stone-50 hover:bg-amber-50/60 p-3.5 rounded-xl border border-stone-200 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Sliders className="w-5 h-5 text-amber-800" />
                    <div>
                      <span className="font-bold text-stone-900 block">Super Admin Command Center</span>
                      <span className="text-[11px] text-stone-500">Calibrate ML model weights, monitor satellite data feeds, provision officers, and inspect audit logs</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 px-6 py-3.5 border-t border-stone-200 flex justify-between items-center text-xs">
          <span className="text-stone-500 font-medium">
            Assam State Space Application Centre &bull; NESFIC 2026
          </span>
          <button
            onClick={onClose}
            className="bg-[#2d1b11] hover:bg-amber-900 text-white px-4 py-1.5 rounded-lg font-semibold transition-colors shadow-xs cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
export default TutorialModal;
