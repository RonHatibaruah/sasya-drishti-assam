import React from 'react';
import { 
  X, 
  Sprout, 
  Satellite, 
  Plane, 
  FileCheck2
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-stone-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-[#2d1b11] px-6 py-4 flex justify-between items-center border-b border-amber-900/60 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-800 text-white border border-amber-600">
              <Sprout className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  Dag #{parcel.dagNumber} &bull; Patta {parcel.pattaNumber}
                </h3>
                <span className="text-[11px] font-mono bg-amber-950 text-amber-200 border border-amber-700 px-2 py-0.5 rounded font-bold">
                  {parcel.cropType.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-amber-200/90 font-medium">
                {parcel.village}, Circle: {parcel.circle}, {parcel.district} &bull; Assam
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Farmer & Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-500 text-[10px] uppercase tracking-wider block font-bold mb-1">
                Pattadar / Farmer Particulars
              </span>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Name:</span>
                  <span className="font-bold text-stone-900">{parcel.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Farmer ID:</span>
                  <span className="font-mono font-bold text-amber-900">{parcel.farmerId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Contact:</span>
                  <span className="font-mono text-stone-700">{parcel.contactPhone}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-stone-500 text-[10px] uppercase tracking-wider block font-bold mb-1">
                Land Parcel Dimensions
              </span>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Assam BKL Area:</span>
                  <span className="font-mono font-bold text-amber-900">
                    {parcel.areaBigha}B - {parcel.areaKatha}K - {parcel.areaLesa}L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Metric Equivalent:</span>
                  <span className="font-mono text-stone-800 font-semibold">{parcel.areaHectares} Hectares</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Variety Sown:</span>
                  <span className="text-stone-900 font-bold">{parcel.cropVariety}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Spectral Telemetry */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
            <span className="text-stone-600 text-[10px] uppercase tracking-wider block font-bold flex items-center gap-1.5">
              <Satellite className="w-3.5 h-3.5 text-amber-800" />
              <span>Multi-Sensor Remote Sensing Observations</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-2xs">
                <span className="text-[10px] text-stone-500 font-medium block">Sentinel-2 NDVI</span>
                <span className="font-mono font-bold text-emerald-700 text-sm block mt-0.5">
                  {parcel.spectralIndices.ndvi}
                </span>
                <span className="text-[9px] text-stone-500 font-medium">Optical Vigour</span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-2xs">
                <span className="text-[10px] text-stone-500 font-medium block">Sentinel-1 SAR VV</span>
                <span className="font-mono font-bold text-amber-900 text-sm block mt-0.5">
                  {parcel.spectralIndices.sarBackscatterVvDb} dB
                </span>
                <span className="text-[9px] text-stone-500 font-medium">Radar Backscatter</span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-2xs">
                <span className="text-[10px] text-stone-500 font-medium block">Leaf Area Index (LAI)</span>
                <span className="font-mono font-bold text-amber-700 text-sm block mt-0.5">
                  {parcel.spectralIndices.lai} m²/m²
                </span>
                <span className="text-[9px] text-stone-500 font-medium">Canopy Density</span>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-stone-200 shadow-2xs">
                <span className="text-[10px] text-stone-500 font-medium block">UAV Drone Flight</span>
                <span className="font-mono font-bold text-purple-700 text-sm block mt-0.5">
                  {parcel.uavSurveyed ? `${parcel.uavResolutionCm} cm` : 'None'}
                </span>
                <span className="text-[9px] text-stone-500 font-medium">{parcel.uavSurveyed ? 'Surveyed' : 'Scheduled'}</span>
              </div>
            </div>
          </div>

          {/* Harvest & Yield Projection Box */}
          <div className="bg-amber-50/70 border-2 border-amber-800 rounded-xl p-4 text-center shadow-2xs">
            <span className="text-xs text-amber-950 uppercase tracking-wider block font-bold">
              Estimated Crop Yield &amp; Total Production
            </span>
            <div className="text-3xl font-black text-stone-900 font-mono mt-1">
              {parcel.estimatedYieldKgHa} <span className="text-sm font-normal text-stone-600">kg/hectare</span>
            </div>
            <div className="text-xs font-mono font-bold text-amber-900 mt-1">
              &asymp; {parcel.estimatedYieldQuintalBigha} Quintals per Bigha &bull; Projected Production: {parcel.estimatedProductionTonnes} MT
            </div>
            <span className="text-[11px] text-stone-600 block mt-1">
              Estimated Harvest Date: <b>{parcel.expectedHarvestDate}</b> &bull; Growth Stage: <b>{parcel.stage}</b>
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 px-6 py-3.5 border-t border-stone-200 flex flex-wrap justify-between items-center gap-3">
          <div className="text-stone-600 text-xs">
            CCE Verification: <b className="text-stone-900 font-mono">{parcel.cceStatus}</b>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onClose();
                if (onDispatchDrone) onDispatchDrone(parcel);
              }}
              className="bg-white hover:bg-stone-200 text-stone-800 px-3 py-1.5 rounded-lg text-xs font-semibold border border-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plane className="w-3.5 h-3.5 text-amber-800" />
              <span>Dispatch Drone</span>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onOpenCertificate) onOpenCertificate(parcel);
              }}
              className="bg-[#2d1b11] hover:bg-amber-900 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>View &amp; Print Certificate</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
export default RecordDetailModal;
