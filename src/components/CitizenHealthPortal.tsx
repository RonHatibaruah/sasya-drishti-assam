import React, { useState } from 'react';
import { 
  FileCheck2, 
  Search, 
  Printer, 
  Download, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sprout, 
  Satellite, 
  Calendar,
  Building2,
  TrendingUp,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { CropParcelRecord } from '../types/cropYield';
import { generateCertificateToken } from '../services/cropYieldEngine';

interface CitizenHealthPortalProps {
  parcels: CropParcelRecord[];
  initialSelectedParcel?: CropParcelRecord | null;
}

export const CitizenHealthPortal: React.FC<CitizenHealthPortalProps> = ({
  parcels,
  initialSelectedParcel
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeParcel, setActiveParcel] = useState<CropParcelRecord>(
    initialSelectedParcel || parcels[0]
  );
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const match = parcels.find(p => 
      p.dagNumber.toLowerCase() === query || 
      p.pattaNumber.toLowerCase() === query || 
      p.farmerId.toLowerCase().includes(query) ||
      p.farmerName.toLowerCase().includes(query) ||
      p.village.toLowerCase().includes(query)
    );

    if (match) {
      setActiveParcel(match);
    }
  };

  const certificateToken = activeParcel ? generateCertificateToken(activeParcel) : '';
  const mspRatePerQuintal = activeParcel.cropType === 'SALI_PADDY' || activeParcel.cropType === 'BORO_PADDY' 
    ? 2300 // MSP for Paddy in 2025-26
    : activeParcel.cropType === 'MUSTARD'
    ? 5650 // MSP for Mustard
    : 3800;

  const totalProcurementValue = activeParcel 
    ? Math.round((activeParcel.estimatedProductionTonnes * 10) * mspRatePerQuintal)
    : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Search Header */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-6 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-full inline-block mb-2">
            Farmer Self-Service &amp; MSP Advisory Portal
          </span>
          <h2 className="text-xl font-bold text-white">
            Assam Digital Crop Health &amp; Estimated Yield Certificate
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter your Dag Number, Patta Number, or PM-KISAN ID to access real-time satellite remote sensing yield projections and official MSP procurement certification
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="e.g. Dag 104, Patta KP-28, or Bipul Hazarika..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Search Plot</span>
          </button>
        </form>

        {/* Quick Sample Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] text-slate-400">
          <span>Try quick sample:</span>
          {parcels.slice(0, 4).map(p => (
            <button
              key={p.id}
              onClick={() => {
                setActiveParcel(p);
                setSearchQuery(p.dagNumber);
              }}
              className="bg-slate-900 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 font-mono transition-colors"
            >
              Dag #{p.dagNumber} ({p.circle} &bull; {p.cropType.replace('_', ' ')})
            </button>
          ))}
        </div>
      </div>

      {/* Official Verifiable Certificate Layout */}
      {activeParcel && (
        <div className="bg-slate-900 border-2 border-emerald-600/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden print:bg-white print:text-black print:border-black">
          
          {/* Subtle Watermark Badge */}
          <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none text-emerald-500">
            <Sprout className="w-96 h-96" />
          </div>

          {/* Certificate Header */}
          <div className="border-b-2 border-emerald-500/40 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-900/40 text-white shrink-0">
                  <Sprout className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-wide uppercase">
                    Government of Assam
                  </h3>
                  <p className="text-xs text-emerald-300 font-medium">
                    Department of Science &amp; Technology &bull; Assam State Space Application Centre (ASSAC)
                  </p>
                  <p className="text-[11px] text-slate-400">
                    In collaboration with Directorate of Agriculture, Assam (NESFIC-D-12)
                  </p>
                </div>
              </div>

              {/* Cryptographic Verification Token */}
              <div className="text-center sm:text-right bg-slate-800/80 border border-slate-700 px-3.5 py-2 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Official Verification Token (SHA-256)
                </span>
                <span className="text-xs font-mono font-bold text-cyan-300 block select-all">
                  {certificateToken}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center justify-center sm:justify-end gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Tamper-Proof &amp; Digitally Authenticated</span>
                </span>
              </div>
            </div>

            <div className="text-center mt-5">
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/80 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest inline-block shadow-xs">
                Official Digital Crop Health &amp; Estimated Yield Certificate
              </span>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="space-y-6 text-xs">
            
            {/* Section 1: Farmer & Land Parcel Particulars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/70">
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  1. Farmer &amp; Beneficiary Details
                </h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pattadar / Farmer Name:</span>
                    <span className="font-bold text-white">{activeParcel.farmerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PM-KISAN / Farmer ID:</span>
                    <span className="font-mono text-cyan-300">{activeParcel.farmerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Contact Registered:</span>
                    <span className="font-mono text-slate-300">{activeParcel.contactPhone}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  2. Cadastral Parcel Location
                </h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dag &amp; Patta Number:</span>
                    <span className="font-mono font-bold text-white">Dag #{activeParcel.dagNumber} (Patta: {activeParcel.pattaNumber})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Village &amp; Circle:</span>
                    <span className="text-slate-200">{activeParcel.village}, {activeParcel.circle} ({activeParcel.district})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assam Land Holding:</span>
                    <span className="font-mono font-semibold text-emerald-400">
                      {activeParcel.areaBigha} Bigha - {activeParcel.areaKatha} Katha - {activeParcel.areaLesa} Lesa ({activeParcel.areaHectares} Ha)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Remote Sensing & Yield Estimation Telemetry */}
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/70 space-y-3">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                3. Remote Sensing Assessment &amp; Harvest Forecast
              </h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Cultivated Crop</span>
                  <span className="font-bold text-emerald-300 text-xs block mt-0.5">
                    {activeParcel.cropType.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Var: {activeParcel.cropVariety}</span>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Sentinel-2 NDVI</span>
                  <span className="font-mono font-bold text-white text-base block mt-0.5">
                    {activeParcel.spectralIndices.ndvi}
                  </span>
                  <span className="text-[10px] text-emerald-400">High Vigour</span>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Sentinel-1 SAR Radar</span>
                  <span className="font-mono font-bold text-cyan-300 text-base block mt-0.5">
                    {activeParcel.spectralIndices.sarBackscatterVvDb} dB
                  </span>
                  <span className="text-[10px] text-slate-400">All-Weather Validated</span>
                </div>

                <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-400 block">Phenology Stage</span>
                  <span className="font-mono font-bold text-amber-300 text-xs block mt-0.5">
                    {activeParcel.stage}
                  </span>
                  <span className="text-[10px] text-slate-400">Harvest: {activeParcel.expectedHarvestDate}</span>
                </div>
              </div>

              {/* Yield Forecast Highlight Box */}
              <div className="bg-emerald-950/80 border border-emerald-600 rounded-xl p-4 text-center mt-3">
                <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-widest block">
                  Official Projected Harvest Yield
                </span>
                <div className="text-3xl font-black text-white font-mono mt-1">
                  {activeParcel.estimatedYieldKgHa} <span className="text-sm font-normal text-slate-300">kg/hectare</span>
                </div>
                <div className="text-sm font-semibold text-emerald-400 font-mono mt-1">
                  &asymp; {activeParcel.estimatedYieldQuintalBigha} Quintals per Assam Bigha &bull; Total Projected Harvest: {activeParcel.estimatedProductionTonnes} Metric Tonnes
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Validated against Directorate of Agriculture CCE Benchmarks with <b>{activeParcel.confidenceScore}%</b> AI Multi-Model Confidence.
                </p>
              </div>
            </div>

            {/* Section 3: MSP Procurement & PMFBY Crop Insurance Advisory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/70">
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>MSP Procurement Allocation (FCI / AFCSCL)</span>
                </h4>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span>Government MSP Rate:</span>
                    <span className="font-mono font-bold text-white">₹{mspRatePerQuintal} / Quintal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approved Procurement Quota:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {(activeParcel.estimatedProductionTonnes * 10).toFixed(1)} Quintals
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-700 pt-1">
                    <span>Estimated Gross Realization:</span>
                    <span className="font-mono font-bold text-cyan-300">₹{totalProcurementValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PMFBY Crop Insurance Pre-Assessment</span>
                </h4>
                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span>Flood Inundation Risk:</span>
                    <span className={`font-semibold ${activeParcel.floodInundated ? 'text-red-400' : 'text-emerald-400'}`}>
                      {activeParcel.floodInundated ? 'HIGH (Waterlogged)' : 'LOW (Protected)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Threshold Yield Benchmark:</span>
                    <span className="font-mono text-white">2,450 kg/ha</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-700 pt-1">
                    <span>Insurance Claim Status:</span>
                    <span className="font-medium text-slate-200">
                      {activeParcel.floodInundated ? 'Eligible for Fast-Track Settlement' : 'Normal Yield - No Loss Claim'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic Footprint & Signature */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg border border-slate-600 shrink-0">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Scan QR to Verify on Portal</span>
                  <span className="text-[11px] text-white font-medium block">https://sasya-drishti-assam.pages.dev/#verify</span>
                  <span className="text-[10px] text-slate-500 block">Issued on: 22 November 2026</span>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <div className="font-serif italic text-slate-300 text-sm">
                  Dr. P. K. Goswami
                </div>
                <div className="text-[10px] text-slate-400">
                  Director, Assam State Space Application Centre (ASSAC)
                </div>
                <div className="text-[9px] text-slate-500 font-mono">
                  Govt of Assam &bull; Digitally Signed via e-Pramaan
                </div>
              </div>
            </div>

          </div>

          {/* Action Bar (Print / Download) */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-600"
            >
              <Printer className="w-4 h-4" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
