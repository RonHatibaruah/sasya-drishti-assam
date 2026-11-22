import React from 'react';
import { 
  X, 
  Sprout, 
  Satellite, 
  Plane, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  FileCheck2, 
  Layers, 
  Scale, 
  User, 
  TrendingUp,
  Waves
} from 'lucide-react';
import { CropParcelRecord } from '../types/cropYield';

interface RecordDetailModalProps {
  parcel: CropParcelRecord | null;
  onClose: () => void;
  onDispatchDrone?: (parcel: CropParcelRecord) => void;
  onOpenCertificate?: (parcel: CropParcelRecord) => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
  parcel,
  onClose,
  onDispatchDrone,
  onOpenCertificate
}) => {
  if (!parcel) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  Dag #{parcel.dagNumber} &bull; Patta {parcel.pattaNumber}
                </h3>
                <span className="text-[11px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                  {parcel.cropType.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {parcel.village}, Circle: {parcel.circle}, {parcel.district} &bull; Assam
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Farmer & Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div>
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-semibold mb-1">
                Pattadar / Farmer Particulars
              </span>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Name:</span>
                  <span className="font-semibold text-white">{parcel.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Farmer ID:</span>
                  <span className="font-mono text-cyan-300">{parcel.farmerId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact:</span>
                  <span className="font-mono text-slate-300">{parcel.contactPhone}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-semibold mb-1">
                Land Parcel Dimensions
              </span>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assam BKL Area:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {parcel.areaBigha}B - {parcel.areaKatha}K - {parcel.areaLesa}L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Metric Equivalent:</span>
                  <span className="font-mono text-slate-300">{parcel.areaHectares} Hectares</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Variety Sown:</span>
                  <span className="text-emerald-300 font-medium">{parcel.cropVariety}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Spectral Telemetry */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-3">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider block font-semibold flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multi-Sensor Remote Sensing Observations</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Sentinel-2 NDVI</span>
                <span className="font-mono font-bold text-emerald-400 text-sm block mt-0.5">
                  {parcel.spectralIndices.ndvi}
                </span>
                <span className="text-[9px] text-slate-500">Optical Vigour</span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Sentinel-1 SAR VV</span>
                <span className="font-mono font-bold text-cyan-300 text-sm block mt-0.5">
                  {parcel.spectralIndices.sarBackscatterVvDb} dB
                </span>
                <span className="text-[9px] text-slate-500">Radar Backscatter</span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Leaf Area Index (LAI)</span>
                <span className="font-mono font-bold text-amber-300 text-sm block mt-0.5">
                  {parcel.spectralIndices.lai} m²/m²
                </span>
                <span className="text-[9px] text-slate-500">Canopy Density</span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 block">UAV Drone Flight</span>
                <span className="font-mono font-bold text-purple-300 text-sm block mt-0.5">
                  {parcel.uavSurveyed ? `${parcel.uavResolutionCm} cm` : 'None'}
                </span>
                <span className="text-[9px] text-slate-500">{parcel.uavSurveyed ? 'Surveyed' : 'Scheduled'}</span>
              </div>
            </div>
          </div>

          {/* Harvest & Yield Projection Box */}
          <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-xl p-4 text-center">
            <span className="text-xs text-emerald-300 uppercase tracking-wider block font-semibold">
              Estimated Crop Yield &amp; Total Production
            </span>
            <div className="text-3xl font-black text-white font-mono mt-1">
              {parcel.estimatedYieldKgHa} <span className="text-sm font-normal text-slate-300">kg/hectare</span>
            </div>
            <div className="text-xs font-mono text-emerald-400 mt-1">
              &asymp; {parcel.estimatedYieldQuintalBigha} Quintals per Bigha &bull; Projected Production: {parcel.estimatedProductionTonnes} MT
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Estimated Harvest Date: <b>{parcel.expectedHarvestDate}</b> &bull; Growth Stage: <b>{parcel.stage}</b>
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex flex-wrap justify-between items-center gap-3">
          <div className="text-slate-400 text-xs">
            CCE Verification: <b className="text-slate-200 font-mono">{parcel.cceStatus}</b>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onClose();
                if (onDispatchDrone) onDispatchDrone(parcel);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Plane className="w-3.5 h-3.5 text-purple-400" />
              <span>Dispatch Drone</span>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onOpenCertificate) onOpenCertificate(parcel);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>View &amp; Print Certificate</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
