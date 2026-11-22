import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Plane, 
  CheckCircle2, 
  Satellite, 
  Download, 
  Layers, 
  ArrowUpRight, 
  Waves,
  Search,
  Filter
} from 'lucide-react';
import { CropParcelRecord, DistrictSummary } from '../types/cropYield';
import { kgHaToQuintalsPerBigha } from '../services/cropYieldEngine';

interface ExecutiveDashboardProps {
  parcels: CropParcelRecord[];
  districtSummaries: DistrictSummary[];
  selectedDistrict: string;
  onSelectParcel: (parcel: CropParcelRecord) => void;
  onNavigateToTab: (tab: any) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  parcels,
  districtSummaries,
  selectedDistrict,
  onSelectParcel,
  onNavigateToTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCrop, setFilterCrop] = useState<string>('ALL');

  // Filter district summaries based on selected district
  const filteredSummaries = selectedDistrict === 'ALL'
    ? districtSummaries
    : districtSummaries.filter(d => d.district.toLowerCase() === selectedDistrict.toLowerCase());

  // Aggregate telemetry
  const totalMonitoredHectares = filteredSummaries.reduce((acc, d) => acc + d.monitoredHectares, 0);
  const totalProductionTonnes = filteredSummaries.reduce((acc, d) => acc + d.estimatedProductionTonnes, 0);
  const avgYieldKgHa = totalMonitoredHectares > 0 
    ? Math.round(filteredSummaries.reduce((acc, d) => acc + (d.averageYieldKgHa * d.monitoredHectares), 0) / totalMonitoredHectares)
    : 0;
  const avgYieldQuintalsBigha = kgHaToQuintalsPerBigha(avgYieldKgHa);

  const totalCceCompleted = filteredSummaries.reduce((acc, d) => acc + d.cceCompletedCount, 0);
  const totalCceTarget = filteredSummaries.reduce((acc, d) => acc + d.cceTargetCount, 0);
  const cceProgressPercent = Math.round((totalCceCompleted / (totalCceTarget || 1)) * 100);

  // Filtered parcels table
  const filteredParcels = parcels.filter(p => {
    const matchesDistrict = selectedDistrict === 'ALL' || p.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchesCrop = filterCrop === 'ALL' || p.cropType === filterCrop;
    const matchesSearch = 
      p.dagNumber.includes(searchQuery) || 
      p.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.farmerId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesCrop && matchesSearch;
  });

  const floodAffectedParcels = parcels.filter(p => p.floodInundated);

  const exportSummaryCsv = () => {
    const headers = ['District', 'Monitored Hectares', 'Monitored Bighas', 'Est. Production (MT)', 'Avg Yield (kg/ha)', 'Normal Benchmark (kg/ha)', 'Yield Anomaly %', 'CCE Completed', 'CCE Target'];
    const rows = districtSummaries.map(d => [
      d.district,
      d.monitoredHectares,
      d.monitoredBighas,
      d.estimatedProductionTonnes,
      d.averageYieldKgHa,
      d.normalBenchmarkYieldKgHa,
      d.yieldAnomalyPercent,
      d.cceCompletedCount,
      d.cceTargetCount
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Assam_Crop_Yield_Summary_NESFIC_D12.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Flood Impact & Severe Anomaly Alert Banner */}
      {floodAffectedParcels.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-950 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 rounded-lg border border-amber-300 text-amber-800">
              <Waves className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                Brahmaputra Flood Inundation &amp; Crop Stress Advisory Active
                <span className="text-[10px] bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded-full border border-red-300">Sentinel-1 SAR Verified</span>
              </h4>
              <p className="text-xs text-amber-900 mt-0.5">
                Barpeta (Baghbar Char) exhibits heavy waterlogging (SAR Backscatter &le; -17.5 dB). Estimated yield deficit of 10.2% detected. Crop Insurance (PMFBY) pre-assessment initiated.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('satellite-gis')}
            className="text-xs bg-amber-800 hover:bg-amber-900 text-white px-3 py-1.5 rounded-lg border border-amber-700 transition-colors whitespace-nowrap flex items-center gap-1.5 font-semibold shadow-xs"
          >
            <span>View SAR Flood Mask</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Monitored Acreage */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Monitored Acreage</span>
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-700">
              <Satellite className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-blue-950">
              {(totalMonitoredHectares / 1000).toFixed(1)}k
            </span>
            <span className="text-xs font-medium text-slate-500">Hectares</span>
          </div>
          <p className="text-xs text-emerald-700 mt-2 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% SAR Cloud-Free Coverage</span>
          </p>
        </div>

        {/* Projected Production */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Projected Production</span>
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-700">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-blue-950">
              {(totalProductionTonnes / 100000).toFixed(2)}
            </span>
            <span className="text-xs font-medium text-slate-500">Lakh Metric Tonnes</span>
          </div>
          <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
            <span className="font-medium text-blue-900">FCI &amp; AFCSCL Procurement Target: 94% Met</span>
          </p>
        </div>

        {/* Average Projected Yield */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">State Average Yield</span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-blue-950">{avgYieldKgHa}</span>
            <span className="text-xs font-medium text-slate-500">kg/ha ({avgYieldQuintalsBigha} Q/Bigha)</span>
          </div>
          <p className="text-xs text-emerald-700 mt-2 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+3.4% above 5-Year Normal</span>
          </p>
        </div>

        {/* Ground Truth CCE Validation */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Field CCE Ground-Truth</span>
            <div className="p-1.5 bg-teal-50 rounded-lg text-teal-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-blue-950">{totalCceCompleted} / {totalCceTarget}</span>
            <span className="text-xs font-medium text-slate-500">Cuts Done</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, cceProgressPercent)}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* District Intelligence Leaderboard */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <span>Assam District Remote Sensing &amp; Yield Leaderboard</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-source yield forecasting across Brahmaputra and Barak agro-climatic zones
            </p>
          </div>
          <button
            onClick={exportSummaryCsv}
            className="flex items-center space-x-1.5 bg-[#0c2340] hover:bg-blue-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export District CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">Monitored Area</th>
                <th className="px-4 py-3">Est. Production</th>
                <th className="px-4 py-3">Avg. Yield</th>
                <th className="px-4 py-3">Yield Anomaly</th>
                <th className="px-4 py-3">SAR Coverage</th>
                <th className="px-4 py-3">Drone Density</th>
                <th className="px-4 py-3">CCE Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSummaries.map((summary) => (
                <tr key={summary.district} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-blue-950 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>{summary.district}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-slate-900">{summary.monitoredHectares.toLocaleString()} Ha</span>
                    <span className="block text-[10px] text-slate-500">({summary.monitoredBighas.toLocaleString()} Bighas)</span>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-semibold text-blue-900">
                    {summary.estimatedProductionTonnes.toLocaleString()} MT
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    {summary.averageYieldKgHa} kg/ha
                    <span className="block text-[10px] text-slate-500 font-normal">
                      {kgHaToQuintalsPerBigha(summary.averageYieldKgHa)} Q/Bigha
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {summary.yieldAnomalyPercent >= 0 ? (
                      <span className="inline-flex items-center text-emerald-700 font-bold gap-0.5">
                        <TrendingUp className="w-3 h-3" />
                        +{summary.yieldAnomalyPercent}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-red-600 font-bold gap-0.5">
                        <TrendingDown className="w-3 h-3" />
                        {summary.yieldAnomalyPercent}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[11px] font-mono font-semibold border border-blue-200">
                      {summary.sarPenetrationCoveragePercent}%
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-medium text-slate-700">
                    {summary.droneCoveragePercent}%
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-800">{summary.cceCompletedCount}/{summary.cceTargetCount}</span>
                      <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full" 
                          style={{ width: `${Math.round((summary.cceCompletedCount / summary.cceTargetCount) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pilot Agricultural Parcels Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
              <Plane className="w-4 h-4 text-blue-700" />
              <span>Satellite &amp; Drone Ground-Truthing Field Parcels</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live Dag-level remote sensing predictions with Sentinel-2 NDVI, Sentinel-1 SAR, and CCE validation
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Dag, Farmer, Village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 w-48 sm:w-60"
              />
            </div>

            {/* Crop Filter */}
            <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filterCrop}
                onChange={(e) => setFilterCrop(e.target.value)}
                className="bg-transparent text-slate-800 text-xs focus:outline-none cursor-pointer pr-1 font-medium"
              >
                <option value="ALL">All Crops</option>
                <option value="SALI_PADDY">Sali Paddy</option>
                <option value="BORO_PADDY">Boro Paddy</option>
                <option value="MUSTARD">Mustard</option>
                <option value="JUTE">Jute</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Dag &amp; Patta</th>
                <th className="px-4 py-3">Farmer &amp; Location</th>
                <th className="px-4 py-3">Crop &amp; Variety</th>
                <th className="px-4 py-3">Assam BKL Area</th>
                <th className="px-4 py-3">NDVI / SAR dB</th>
                <th className="px-4 py-3">Est. Yield (kg/ha)</th>
                <th className="px-4 py-3">Yield Grade</th>
                <th className="px-4 py-3">CCE Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredParcels.map((parcel) => (
                <tr key={parcel.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-blue-950">Dag #{parcel.dagNumber}</div>
                    <div className="text-[10px] text-slate-500 font-mono">Patta: {parcel.pattaNumber}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900">{parcel.farmerName}</div>
                    <div className="text-[10px] text-slate-500">{parcel.village}, {parcel.circle}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-blue-900">
                      {parcel.cropType.replace('_', ' ')}
                    </span>
                    <span className="block text-[10px] text-slate-500">{parcel.cropVariety}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono font-medium text-slate-900">{parcel.areaBigha}B - {parcel.areaKatha}K - {parcel.areaLesa}L</span>
                    <span className="block text-[10px] text-slate-500 font-mono">({parcel.areaHectares} Ha)</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-mono font-semibold text-blue-900">NDVI: {parcel.spectralIndices.ndvi}</div>
                    <div className="text-[10px] text-slate-500 font-mono">SAR: {parcel.spectralIndices.sarBackscatterVvDb} dB</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-slate-900 font-mono">{parcel.estimatedYieldKgHa} kg/ha</div>
                    <div className="text-[10px] text-slate-500 font-mono">{parcel.estimatedYieldQuintalBigha} Q/Bigha</div>
                  </td>
                  <td className="px-4 py-3.5">
                    {parcel.yieldGrade === 'EXCELLENT' && (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                        Excellent
                      </span>
                    )}
                    {parcel.yieldGrade === 'NORMAL' && (
                      <span className="bg-blue-50 text-blue-800 border border-blue-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                        Normal
                      </span>
                    )}
                    {parcel.yieldGrade === 'BELOW_AVERAGE' && (
                      <span className="bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-semibold">
                        Below Avg
                      </span>
                    )}
                    {parcel.yieldGrade === 'STRESSED_CRITICAL' && (
                      <span className="bg-red-50 text-red-700 border border-red-300 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">
                        Inundated / Stressed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                      parcel.cceStatus === 'COMPLETED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : parcel.cceStatus === 'SCHEDULED'
                        ? 'bg-amber-50 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-600 border border-slate-300'
                    }`}>
                      {parcel.cceStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => onSelectParcel(parcel)}
                      className="text-xs bg-[#0c2340] hover:bg-blue-900 text-white px-2.5 py-1 rounded font-semibold transition-colors shadow-xs"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
