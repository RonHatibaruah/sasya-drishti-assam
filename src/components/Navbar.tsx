import React from 'react';
import { 
  Sprout, 
  Satellite, 
  Plane, 
  FileCheck2, 
  Sliders, 
  BookOpen, 
  Building2, 
  Calendar,
  CloudSun
} from 'lucide-react';
import { CropSeason } from '../types/cropYield';

export type ActiveTab = 'dashboard' | 'satellite-gis' | 'drone-cce' | 'farmer-portal' | 'admin-console';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  selectedSeason: CropSeason;
  setSelectedSeason: (season: CropSeason) => void;
  totalParcels: number;
  totalHectares: number;
  onOpenTutorial: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedDistrict,
  setSelectedDistrict,
  selectedSeason,
  setSelectedSeason,
  totalParcels,
  totalHectares,
  onOpenTutorial
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Top Government Banner */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-300 flex flex-wrap justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-slate-200">Government of Assam</span>
          <span className="text-slate-500">•</span>
          <span>Dept of Science &amp; Technology — ASSAC</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400 font-semibold">NESFIC-D-12 Official Prototype</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-1.5 text-slate-400">
            <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sentinel-1 SAR Radar 100% Cloud-Penetrating</span>
          </div>
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[11px] font-mono">
            {totalHectares.toLocaleString()} Ha Monitored ({totalParcels} Pilot Plots)
          </span>
          <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded text-[11px] font-semibold">
            ASSAC &amp; Agri Dept Live Sync
          </span>
        </div>
      </div>

      {/* Main App Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-900/40">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  SasyaDrishti <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-normal">শস্য দৃষ্টি</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Crop Yield &amp; Production Estimation Platform Using Satellite/UAV &amp; Field Data
              </p>
            </div>
          </div>

          {/* Navigation Controls, Filters & Guide */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Guide Button */}
            <a
              href="#tutorial"
              onClick={(e) => {
                e.preventDefault();
                onOpenTutorial();
              }}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all ring-1 ring-emerald-400/30"
              title="Learn system architecture, satellite-UAV fusion, and operational workflow"
              aria-label="Open Interactive Tutorial & System Guide"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Architecture Guide</span>
            </a>

            {/* Season Selector */}
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value as CropSeason)}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
                aria-label="Select Agricultural Crop Season"
                title="Select Agricultural Crop Season"
              >
                <option value="KHARIF_2026" className="bg-slate-900">Kharif 2026 (Sali Paddy)</option>
                <option value="RABI_2025_26" className="bg-slate-900">Rabi 2025-26 (Mustard / Boro)</option>
                <option value="SUMMER_2026" className="bg-slate-900">Summer 2026 (Ahu / Jute)</option>
              </select>
            </div>

            {/* District Filter */}
            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
                aria-label="Filter by Assam District"
                title="Select Assam District"
              >
                <option value="ALL" className="bg-slate-900">All Assam Districts</option>
                <option value="Kamrup Metro" className="bg-slate-900">Kamrup Metro</option>
                <option value="Nagaon" className="bg-slate-900">Nagaon</option>
                <option value="Barpeta" className="bg-slate-900">Barpeta</option>
                <option value="Golaghat" className="bg-slate-900">Golaghat</option>
                <option value="Darrang" className="bg-slate-900">Darrang</option>
                <option value="Cachar" className="bg-slate-900">Cachar (Barak Valley)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <nav className="flex space-x-1 mt-4 overflow-x-auto pb-1" aria-label="Portal Navigation Tabs">
          <a
            href="#dashboard"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('dashboard');
              window.history.pushState(null, '', '#dashboard');
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Executive Dashboard</span>
          </a>

          <a
            href="#satellite-gis"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('satellite-gis');
              window.history.pushState(null, '', '#satellite-gis');
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'satellite-gis'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Satellite className="w-4 h-4" />
            <span>Satellite &amp; Drone WebGIS</span>
          </a>

          <a
            href="#drone-cce"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('drone-cce');
              window.history.pushState(null, '', '#drone-cce');
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'drone-cce'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Drone Operations &amp; CCE</span>
          </a>

          <a
            href="#farmer-portal"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('farmer-portal');
              window.history.pushState(null, '', '#farmer-portal');
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'farmer-portal'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Farmer Advisory &amp; Certificate</span>
          </a>

          <a
            href="#admin-console"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('admin-console');
              window.history.pushState(null, '', '#admin-console');
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'admin-console'
                ? 'bg-slate-700 text-emerald-300 border border-emerald-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Admin Command Center</span>
          </a>
        </nav>
      </div>
    </header>
  );
};
