import React, { useState, useMemo, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { CadastralMapViewer } from './components/CadastralMapViewer';
import { FieldVerificationPortal } from './components/FieldVerificationPortal';
import { DroneTechShowcase } from './components/DroneTechShowcase';
import { CitizenHealthPortal } from './components/CitizenHealthPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { RecordDetailModal } from './components/RecordDetailModal';
import { TutorialModal } from './components/TutorialModal';
import { 
  initialCropParcels, 
  initialDroneMissions, 
  initialCceRecords, 
  initialDistrictSummaries 
} from './data/mockAssamCropData';
import { 
  CropParcelRecord, 
  DroneMission, 
  CropCuttingExperiment, 
  DistrictSummary, 
  ModelCalibrationConfig, 
  CropSeason 
} from './types/cropYield';
import { DEFAULT_MODEL_CONFIG, recalculateParcelYield } from './services/cropYieldEngine';

export function App() {
  const [parcels, setParcels] = useState<CropParcelRecord[]>(initialCropParcels);
  const [missions, setMissions] = useState<DroneMission[]>(initialDroneMissions);
  const [cceRecords, setCceRecords] = useState<CropCuttingExperiment[]>(initialCceRecords);
  const [districtSummaries, setDistrictSummaries] = useState<DistrictSummary[]>(initialDistrictSummaries);
  const [modelConfig, setModelConfig] = useState<ModelCalibrationConfig>(DEFAULT_MODEL_CONFIG);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [selectedSeason, setSelectedSeason] = useState<CropSeason>('KHARIF_2026');
  const [inspectingParcel, setInspectingParcel] = useState<CropParcelRecord | null>(null);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);

  // Synchronize URL hash with activeTab for SEO and deep-linking
  useEffect(() => {
    const syncTabFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'dashboard') setActiveTab('dashboard');
      else if (hash === 'satellite-gis' || hash === 'gis-map') setActiveTab('satellite-gis');
      else if (hash === 'drone-cce' || hash === 'field-verification') setActiveTab('drone-cce');
      else if (hash === 'drone-tech' || hash === 'uav') setActiveTab('drone-tech');
      else if (hash === 'farmer-portal' || hash === 'citizen-portal') setActiveTab('farmer-portal');
      else if (hash === 'admin-console' || hash === 'admin') setActiveTab('admin-console');
      else if (hash === 'tutorial') setIsTutorialOpen(true);
    };

    syncTabFromHash();
    window.addEventListener('hashchange', syncTabFromHash);
    return () => window.removeEventListener('hashchange', syncTabFromHash);
  }, []);

  const handleTabSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (window.location.hash !== `#${tab}`) {
      window.history.pushState(null, '', `#${tab}`);
    }
  };

  // Recalculate all parcels yields when model configuration is modified in Admin
  const handleRecalculateAllParcels = () => {
    setParcels(prev => prev.map(p => recalculateParcelYield(p, modelConfig)));
  };

  // Dispatch a new Drone Survey Mission over a parcel
  const handleDispatchDroneFromParcel = (parcel: CropParcelRecord) => {
    const newMission: DroneMission = {
      id: `DRONE-AS-2026-${String(missions.length + 1).padStart(2, '0')}`,
      title: `${parcel.village} (${parcel.circle}) High-Res Drone Orthomosaic`,
      pilotName: 'ASSAC UAV Cell / Drone Pilot',
      agency: 'Directorate of Agriculture, Assam',
      district: parcel.district,
      circle: parcel.circle,
      village: parcel.village,
      targetAreaBighas: Math.max(50, parcel.areaBigha * 10),
      flightAltitudeMeters: 90,
      sensorType: 'MULTISPECTRAL_5BAND',
      batteryLevel: 100,
      status: 'SCHEDULED',
      scheduledDate: new Date().toISOString().split('T')[0],
      cloudCoverAvoidancePercent: 100
    };

    setMissions(prev => [newMission, ...prev]);
    setParcels(prev => prev.map(p => p.id === parcel.id ? { ...p, uavSurveyed: true, uavResolutionCm: 3.5 } : p));
    alert(`Drone Mission ${newMission.id} scheduled for Dag #${parcel.dagNumber} in ${parcel.village}!`);
    handleTabSelect('drone-cce');
  };

  // Open certificate view for a specific parcel
  const handleOpenCertificate = (parcel: CropParcelRecord) => {
    setInspectingParcel(parcel);
    handleTabSelect('farmer-portal');
  };

  // Add new drone mission
  const handleAddMission = (newMission: DroneMission) => {
    setMissions(prev => [newMission, ...prev]);
  };

  // Add new CCE record & update corresponding parcel
  const handleAddCceRecord = (newCce: CropCuttingExperiment) => {
    setCceRecords(prev => [newCce, ...prev]);
    setParcels(prev => prev.map(p => {
      if (p.id === newCce.parcelId) {
        const variance = Math.abs(Math.round(((newCce.calculatedYieldKgHa - p.estimatedYieldKgHa) / newCce.calculatedYieldKgHa) * 100));
        return {
          ...p,
          cceStatus: 'COMPLETED',
          cceActualYieldKgHa: newCce.calculatedYieldKgHa,
          cceVariancePercent: variance
        };
      }
      return p;
    }));
  };

  // Total monitored hectares
  const totalHectares = useMemo(() => {
    return districtSummaries.reduce((acc, d) => acc + d.monitoredHectares, 0);
  }, [districtSummaries]);

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-stone-900 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabSelect}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
        totalParcels={parcels.length}
        totalHectares={totalHectares}
        onOpenTutorial={() => setIsTutorialOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            parcels={parcels}
            districtSummaries={districtSummaries}
            selectedDistrict={selectedDistrict}
            onSelectParcel={(parcel) => setInspectingParcel(parcel)}
            onNavigateToTab={handleTabSelect}
          />
        )}

        {activeTab === 'satellite-gis' && (
          <CadastralMapViewer
            parcels={parcels}
            onSelectParcel={(parcel) => setInspectingParcel(parcel)}
            selectedParcelId={inspectingParcel?.id}
            onDispatchDrone={handleDispatchDroneFromParcel}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {activeTab === 'drone-cce' && (
          <FieldVerificationPortal
            missions={missions}
            cceRecords={cceRecords}
            parcels={parcels}
            onAddMission={handleAddMission}
            onAddCceRecord={handleAddCceRecord}
          />
        )}

        {activeTab === 'drone-tech' && (
          <DroneTechShowcase />
        )}

        {activeTab === 'farmer-portal' && (
          <CitizenHealthPortal
            parcels={parcels}
            initialSelectedParcel={inspectingParcel}
          />
        )}

        {activeTab === 'admin-console' && (
          <AdminDashboard
            parcels={parcels}
            modelConfig={modelConfig}
            onUpdateModelConfig={setModelConfig}
            onRecalculateAllParcels={handleRecalculateAllParcels}
          />
        )}

      </main>

      {/* Inspect Parcel Detail Modal */}
      {inspectingParcel && activeTab !== 'farmer-portal' && (
        <RecordDetailModal
          parcel={inspectingParcel}
          onClose={() => setInspectingParcel(null)}
          onDispatchDrone={handleDispatchDroneFromParcel}
          onOpenCertificate={handleOpenCertificate}
        />
      )}

      {/* Tutorial & System Guide Modal */}
      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onNavigateTab={(tab) => {
          setIsTutorialOpen(false);
          handleTabSelect(tab);
        }}
      />

      {/* Footer */}
      <footer className="bg-[#2d1b11] border-t border-amber-900/60 py-6 text-xs text-amber-200/80 mt-12 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-white">SasyaDrishti (শস্য দৃষ্টি)</span>
            <span className="text-amber-500/60">&bull;</span>
            <span className="text-amber-200">NESFIC-D-12 Official Prototype</span>
          </div>
          <div className="text-center md:text-right text-amber-200/80">
            Assam State Space Application Centre (ASSAC) &bull; Department of Science &amp; Technology, Government of Assam
          </div>
        </div>
      </footer>

    </div>
  );
}
export default App;
