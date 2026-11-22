import React, { useState } from 'react';
import { 
  FileCheck2, 
  Search, 
  Printer, 
  Download, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  Sprout, 
  Satellite, 
  TrendingUp
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
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-5">
          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block mb-2">
            Farmer Self-Service &amp; MSP Advisory Portal
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            Assam Digital Crop Health &amp; Estimated Yield Certificate
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Enter your Dag Number, Patta Number, or PM-KISAN ID to access real-time satellite remote sensing yield projections and official MSP procurement certification
          </p>
        </div>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="e.g. Dag 104, Patta KP-28, or Bipul Hazarika..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:border-amber-800 font-medium"
            />
          </div>
          <button
            type="submit"
            className="bg-[#2d1b11] hover:bg-amber-900 text-white px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <span>Search Plot</span>
          </button>
        </form>

        {/* Quick Sample Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] text-stone-500">
          <span className="font-medium">Try quick sample:</span>
          {parcels.slice(0, 4).map(p => (
            <button
              key={p.id}
              onClick={() => {
                setActiveParcel(p);
                setSearchQuery(p.dagNumber);
              }}
              className="bg-stone-100 hover:bg-amber-50 hover:text-amber-900 text-stone-700 px-2.5 py-1 rounded-md border border-stone-200 font-mono font-medium transition-colors cursor-pointer"
            >
              Dag #{p.dagNumber} ({p.circle} &bull; {p.cropType.replace('_', ' ')})
            </button>
          ))}
        </div>
      </div>

      {/* Official Verifiable Certificate Layout */}
      {activeParcel && (
        <div className="bg-white border-2 border-[#2d1b11] rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden text-stone-800 print:border-black">
          
          {/* Subtle Watermark Badge */}
          <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none text-amber-950">
            <Sprout className="w-96 h-96" />
          </div>

          {/* Certificate Header */}
          <div className="border-b-2 border-amber-900/30 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center space-x-3.5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-amber-900 via-amber-800 to-amber-700 flex items-center justify-center shadow-md text-amber-100 shrink-0">
                  <Sprout className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900 tracking-wide uppercase">
                    Government of Assam
                  </h3>
                  <p className="text-xs text-amber-900 font-bold">
                    Department of Science &amp; Technology &bull; Assam State Space Application Centre (ASSAC)
                  </p>
                  <p className="text-[11px] text-stone-500">
                    In collaboration with Directorate of Agriculture, Assam (NESFIC-D-12)
                  </p>
                </div>
              </div>

              {/* Cryptographic Verification Token */}
              <div className="text-center sm:text-right bg-amber-50/80 border border-amber-200 px-3.5 py-2 rounded-xl">
                <span className="text-[10px] text-stone-600 uppercase tracking-wider block font-bold">
                  Official Verification Token (SHA-256)
                </span>
                <span className="text-xs font-mono font-black text-amber-950 block select-all">
                  {certificateToken}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center justify-center sm:justify-end gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Tamper-Proof &amp; Digitally Authenticated</span>
                </span>
              </div>
            </div>

            <div className="text-center mt-5">
              <span className="bg-[#2d1b11] text-white border border-amber-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-block shadow-xs">
                Official Digital Crop Health &amp; Estimated Yield Certificate
              </span>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="space-y-6 text-xs">
            
            {/* Section 1: Farmer & Land Parcel Particulars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div>
                <h4 className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                  1. Farmer &amp; Beneficiary Details
                </h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Pattadar / Farmer Name:</span>
                    <span className="font-bold text-stone-900">{activeParcel.farmerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">PM-KISAN / Farmer ID:</span>
                    <span className="font-mono font-bold text-amber-900">{activeParcel.farmerId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Contact Registered:</span>
                    <span className="font-mono text-stone-700">{activeParcel.contactPhone}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2">
                  2. Cadastral Parcel Location
                </h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Dag &amp; Patta Number:</span>
                    <span className="font-mono font-bold text-stone-900">Dag #{activeParcel.dagNumber} (Patta: {activeParcel.pattaNumber})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Village &amp; Circle:</span>
                    <span className="text-stone-800 font-medium">{activeParcel.village}, {activeParcel.circle} ({activeParcel.district})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Assam Land Holding:</span>
                    <span className="font-mono font-bold text-amber-900">
                      {activeParcel.areaBigha} Bigha - {activeParcel.areaKatha} Katha - {activeParcel.areaLesa} Lesa ({activeParcel.areaHectares} Ha)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Remote Sensing & Yield Estimation Telemetry */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <h4 className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                3. Remote Sensing Assessment &amp; Harvest Forecast
              </h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
                  <span className="text-[10px] text-stone-500 font-medium block">Cultivated Crop</span>
                  <span className="font-bold text-stone-900 text-xs block mt-0.5">
                    {activeParcel.cropType.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">Var: {activeParcel.cropVariety}</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
                  <span className="text-[10px] text-stone-500 font-medium block">Sentinel-2 NDVI</span>
                  <span className="font-mono font-bold text-emerald-700 text-base block mt-0.5">
                    {activeParcel.spectralIndices.ndvi}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">High Vigour</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
                  <span className="text-[10px] text-stone-500 font-medium block">Sentinel-1 SAR Radar</span>
                  <span className="font-mono font-bold text-amber-900 text-base block mt-0.5">
                    {activeParcel.spectralIndices.sarBackscatterVvDb} dB
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium">All-Weather Validated</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-2xs">
                  <span className="text-[10px] text-stone-500 font-medium block">Phenology Stage</span>
                  <span className="font-mono font-bold text-amber-800 text-xs block mt-0.5">
                    {activeParcel.stage}
                  </span>
                  <span className="text-[10px] text-stone-500">Harvest: {activeParcel.expectedHarvestDate}</span>
                </div>
              </div>

              {/* Yield Forecast Highlight Box */}
              <div className="bg-amber-50/70 border-2 border-amber-800 rounded-xl p-4 text-center mt-3 shadow-2xs">
                <span className="text-[11px] font-bold text-amber-950 uppercase tracking-widest block">
                  Official Projected Harvest Yield
                </span>
                <div className="text-3xl font-black text-stone-900 font-mono mt-1">
                  {activeParcel.estimatedYieldKgHa} <span className="text-sm font-normal text-stone-600">kg/hectare</span>
                </div>
                <div className="text-sm font-bold text-amber-900 font-mono mt-1">
                  &asymp; {activeParcel.estimatedYieldQuintalBigha} Quintals per Assam Bigha &bull; Total Projected Harvest: {activeParcel.estimatedProductionTonnes} Metric Tonnes
                </div>
                <p className="text-[11px] text-stone-600 mt-1">
                  Validated against Directorate of Agriculture CCE Benchmarks with <b>{activeParcel.confidenceScore}%</b> AI Multi-Model Confidence.
                </p>
              </div>
            </div>

            {/* Section 3: MSP Procurement & PMFBY Crop Insurance Advisory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div>
                <h4 className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-800" />
                  <span>MSP Procurement Allocation (FCI / AFCSCL)</span>
                </h4>
                <div className="space-y-1 text-stone-700">
                  <div className="flex justify-between">
                    <span>Government MSP Rate:</span>
                    <span className="font-mono font-bold text-stone-900">₹{mspRatePerQuintal} / Quintal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approved Procurement Quota:</span>
                    <span className="font-mono font-bold text-amber-900">
                      {(activeParcel.estimatedProductionTonnes * 10).toFixed(1)} Quintals
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-stone-200 pt-1">
                    <span>Estimated Gross Realization:</span>
                    <span className="font-mono font-bold text-emerald-700">₹{totalProcurementValue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>PMFBY Crop Insurance Pre-Assessment</span>
                </h4>
                <div className="space-y-1 text-stone-700">
                  <div className="flex justify-between">
                    <span>Flood Inundation Risk:</span>
                    <span className={`font-bold ${activeParcel.floodInundated ? 'text-red-600' : 'text-emerald-700'}`}>
                      {activeParcel.floodInundated ? 'HIGH (Waterlogged)' : 'LOW (Protected)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Threshold Yield Benchmark:</span>
                    <span className="font-mono font-semibold text-stone-900">2,450 kg/ha</span>
                  </div>
                  <div className="flex justify-between border-t border-stone-200 pt-1">
                    <span>Insurance Claim Status:</span>
                    <span className="font-medium text-stone-800">
                      {activeParcel.floodInundated ? 'Eligible for Fast-Track Settlement' : 'Normal Yield - No Loss Claim'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic Footprint & Signature */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-stone-50 rounded-lg border border-stone-300 shrink-0">
                  <QrCode className="w-12 h-12 text-stone-900" />
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase font-mono font-semibold">Scan QR to Verify on Portal</span>
                  <span className="text-[11px] text-amber-900 font-semibold block">https://sasya-drishti-assam.pages.dev/#verify</span>
                  <span className="text-[10px] text-stone-500 block">Issued on: 22 November 2026</span>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <div className="font-serif italic text-stone-900 font-bold text-sm">
                  Dr. P. K. Goswami
                </div>
                <div className="text-[10px] text-stone-600 font-medium">
                  Director, Assam State Space Application Centre (ASSAC)
                </div>
                <div className="text-[9px] text-stone-500 font-mono">
                  Govt of Assam &bull; Digitally Signed via e-Pramaan
                </div>
              </div>
            </div>

          </div>

          {/* Action Bar (Print / Download) */}
          <div className="mt-8 pt-4 border-t border-stone-200 flex justify-end gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-300 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Certificate</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-[#2d1b11] hover:bg-amber-900 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
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
export default CitizenHealthPortal;
