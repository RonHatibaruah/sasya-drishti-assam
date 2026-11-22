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
  Cpu,
  ExternalLink,
  Layers,
  Image as ImageIcon
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
  const [activeSection, setActiveSection] = useState<'overview' | 'architecture' | 'ai_models' | 'walkthrough' | 'diagrams'>('overview');

  if (!isOpen) return null;

  const ALL_DIAGRAMS = [
    { id: 1, title: 'Figure 1: Operational Paradigm Shift (Conventional vs. SasyaDrishti)', src: '/proposal_diagrams/diagram_1_paradigm_shift.png', desc: 'Comparison of conventional cloud-blind, paper-delayed estimation against SasyaDrishti all-weather multi-source AI fusion.' },
    { id: 2, title: 'Figure 2: All-Weather Remote Sensing: SAR Radar Cloud Penetration Physics', src: '/proposal_diagrams/diagram_2_monsoon_sar_physics.png', desc: 'C-band (5.6 cm) microwave radar penetration through 80% monsoon clouds, with VH biomass volume scattering and VV flood mapping.' },
    { id: 3, title: 'Figure 3: Smallholder Parcel Resolution Stack (Space-borne to 3.5cm Drone)', src: '/proposal_diagrams/diagram_3_smallholder_resolution_stack.png', desc: 'Resolution hierarchy resolving fragmented Assam Bigha holdings and sub-meter micro-bund boundaries (Ali).' },
    { id: 4, title: 'Figure 4: SasyaDrishti 4-Tier End-to-End Enterprise Architecture', src: '/proposal_diagrams/diagram_4_enterprise_system_architecture.png', desc: 'Ingestion Gateway, Preprocessing Pipeline, Hybrid AI + WOFOST Biophysical Engine, and Edge Delivery Tier.' },
    { id: 5, title: 'Figure 5: Digital CCE Moisture Normalization & AI Recalibration Loop', src: '/proposal_diagrams/diagram_5_cce_moisture_normalization_loop.png', desc: 'Mobile-first field cut logger with 14% storage equilibrium moisture formula feeding dynamic AI model recalibration.' },
    { id: 6, title: 'Figure 6: 12-Month Indicative Gantt Roadmap & Cropping Milestones', src: '/proposal_diagrams/diagram_6_indicative_gantt_roadmap.png', desc: '5-phase development timeline synchronized with Assam Kharif Sali paddy and Rabi mustard harvesting cycles.' },
    { id: 7, title: 'Figure 7: Tamper-Proof Digital Crop Yield Certificate Trust Architecture', src: '/proposal_diagrams/diagram_7_verifiable_certificate_flow.png', desc: 'End-to-end cryptographic SHA-256 hashing and scannable QR verification for FCI/AFCSCL MSP quotas and PMFBY claims.' }
  ];

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

          <button
            onClick={() => setActiveSection('diagrams')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'diagrams'
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            5. Visual Infographics Gallery ({ALL_DIAGRAMS.length})
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

              {/* Embedded Infographic Figure 1 */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-stone-900">Figure 1: Operational Paradigm Shift</span>
                  <a href="/proposal_diagrams/diagram_1_paradigm_shift.png" target="_blank" rel="noreferrer" className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                    <span>Fullscreen</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <img src="/proposal_diagrams/diagram_1_paradigm_shift.png" alt="Paradigm Shift Diagram" className="w-full rounded-lg border border-stone-200" />
              </div>
            </div>
          )}

          {/* 2. Architecture */}
          {activeSection === 'architecture' && (
            <div className="space-y-4">
              <h4 className="font-bold text-stone-900 text-sm">
                4-Tier Multi-Sensor Fusion Pipeline
              </h4>

              {/* Embedded Infographic Figure 2 */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-stone-900">Figure 2: Sentinel-1 SAR Radar Cloud Penetration Physics</span>
                  <a href="/proposal_diagrams/diagram_2_monsoon_sar_physics.png" target="_blank" rel="noreferrer" className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                    <span>Fullscreen</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <img src="/proposal_diagrams/diagram_2_monsoon_sar_physics.png" alt="Monsoon SAR Radar Physics" className="w-full rounded-lg border border-stone-200" />
              </div>

              {/* Embedded Infographic Figure 4 */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-stone-900">Figure 4: 4-Tier End-to-End Enterprise Architecture</span>
                  <a href="/proposal_diagrams/diagram_4_enterprise_system_architecture.png" target="_blank" rel="noreferrer" className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                    <span>Fullscreen</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <img src="/proposal_diagrams/diagram_4_enterprise_system_architecture.png" alt="Enterprise System Architecture" className="w-full rounded-lg border border-stone-200" />
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

              {/* Embedded Infographic Figure 5 */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs text-stone-900">Figure 5: CCE Moisture Normalization &amp; Calibration Loop</span>
                  <a href="/proposal_diagrams/diagram_5_cce_moisture_normalization_loop.png" target="_blank" rel="noreferrer" className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                    <span>Fullscreen</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <img src="/proposal_diagrams/diagram_5_cce_moisture_normalization_loop.png" alt="CCE Moisture Normalization" className="w-full rounded-lg border border-stone-200" />
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

          {/* 5. Complete Diagrams Gallery */}
          {activeSection === 'diagrams' && (
            <div className="space-y-6">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2 mb-1">
                  <ImageIcon className="w-4 h-4 text-amber-800" />
                  <span>Official NESFIC-D-12 Infographics &amp; Architecture Diagrams</span>
                </h4>
                <p className="text-stone-700 text-xs">
                  These 7 high-resolution diagrams are embedded directly in the official proposal submission dossier to visually articulate every phase of the crop yield estimation pipeline.
                </p>
              </div>

              <div className="space-y-6">
                {ALL_DIAGRAMS.map((d) => (
                  <div key={d.id} className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <div>
                        <h5 className="font-bold text-xs text-stone-900">{d.title}</h5>
                        <p className="text-[11px] text-stone-500">{d.desc}</p>
                      </div>
                      <a
                        href={d.src}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs bg-white hover:bg-stone-100 text-stone-800 px-3 py-1.5 rounded-lg border border-stone-300 font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <span>Open Full Size</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <img src={d.src} alt={d.title} className="w-full rounded-lg border border-stone-200 shadow-2xs" />
                  </div>
                ))}
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
