# SasyaDrishti (শস্য দৃষ্টি)
### AI-Powered Crop Yield & Production Estimation Platform Using Satellite/UAV & Field Data

[![NESFIC 2026](https://img.shields.io/badge/NESFIC_2026-Govt_Track_--_NESFIC--D--12-0284c7?style=for-the-badge)](https://startup.assam.gov.in/nesfic26/problem-statements/nesfic-d-12)
[![Government of Assam](https://img.shields.io/badge/Government_of_Assam-Dept_of_Science_%26_Technology-064e3b?style=for-the-badge)](https://assac.assam.gov.in/)
[![Sponsoring Body](https://img.shields.io/badge/Nodal_Agency-ASSAC_Assam_State_Space_Application_Centre-0d9488?style=for-the-badge)](https://assac.assam.gov.in/)
[![Live Demo](https://img.shields.io/badge/Live_Prototype-sasya--drishti.pages.dev-10b981?style=for-the-badge&logo=cloudflarepages)](https://sasya-drishti.pages.dev/)
[![React 18](https://img.shields.io/badge/Frontend-React_18_%7C_TypeScript_%7C_Tailwind-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Leaflet GIS](https://img.shields.io/badge/Geospatial-Leaflet_1.9_%7C_Sentinel_1%2F2-199900?style=for-the-badge&logo=leaflet)](https://leafletjs.com/)

> 🌐 **Official Interactive Prototype:** **[https://sasya-drishti.pages.dev/](https://sasya-drishti.pages.dev/)**  
> Problem Statement Reference: **[NESFIC-D-12 (Assam Startup Portal)](https://startup.assam.gov.in/nesfic26/problem-statements/nesfic-d-12)**  
> Explore the multi-district yield leaderboard, Sentinel-1/2 satellite & drone WebGIS viewer, mobile CCE ground-truthing portal, farmer digital harvest certificate generator, and the **Super Admin Operations Command Console (`#admin-console`)**.

---

## 🏛️ Executive Summary

**SasyaDrishti (শস্য দৃষ্টি)** is an end-to-end, multi-source agricultural remote sensing and crop yield prediction platform developed for the **Assam State Space Application Centre (ASSAC), Department of Science & Technology, Government of Assam** in partnership with the **Directorate of Agriculture, Assam** under **NESFIC-D-12**.

### The Core Problem in Assam
Estimating crop acreage, vigour, and production across Assam has historically faced four critical bottlenecks:
1. **Persistent Monsoon Cloud Cover:** Optical satellites (Sentinel-2, Landsat) suffer from 70%–85% cloud obscuration during the critical Kharif Sali paddy vegetative and reproductive stages (June to October).
2. **Smallholder Land Fragmentation:** Over 85% of Assam's farmers are smallholders with average plot sizes under 0.5 hectare (3–4 Bighas), creating mixed-pixel spectral noise in coarse satellite data.
3. **Severe Flood Inundation:** Annual Brahmaputra and Barak river floods cause localized crop submergence, complicating damage assessments and post-flood salvage yield predictions.
4. **Manual CCE Latency:** Traditional manual Crop Cutting Experiments (CCE) take 3–4 months to compile, delaying Food Corporation of India (FCI) / AFCSCL Minimum Support Price (MSP) procurement logistics and Pradhan Mantri Fasal Bima Yojana (PMFBY) insurance claim settlements.

### How SasyaDrishti Solves This
SasyaDrishti establishes an automated **4-Tier Data Fusion Architecture**:
- **Tier 1 (All-Weather Radar):** Sentinel-1 C-band Synthetic Aperture Radar (SAR) dual-polarization (VV/VH) radar backscatter penetrates heavy monsoon clouds, tracking standing biomass and floodwater submergence without interruption.
- **Tier 2 (Multispectral Optical):** Sentinel-2 (10m) multi-temporal optical imagery computes Normalized Difference Vegetation Index (NDVI), Enhanced Vegetation Index (EVI), and Leaf Area Index (LAI) during cloud-free acquisition windows.
- **Tier 3 (Centimeter UAV Drone Scans):** Sub-5cm multispectral and RGB drone flights over pilot agricultural clusters extract Canopy Height Models (CHM) and micro-level crop stress.
- **Tier 4 (Field CCE Ground-Truthing):** Mobile digital logging of 5m × 5m quadrant harvest cuts with grain moisture correction dynamically calibrates AI model weights.

---

## 💻 Recommended GitHub Repository Names

| Preference | Repository Name | Rationale & Positioning |
| :--- | :--- | :--- |
| **Option 1 (Recommended)** | `sasya-drishti` or `sasya-drishti-assam` | *শস্য দৃষ্টি: AI-Powered Satellite, UAV & Field Data Crop Yield Estimation for Assam (NESFIC-D-12)*. Culturally authentic, memorable, and aligned with official Assam platforms like Dharitree & Bhudakshya. |
| **Option 2** | `crop-yield-assam-nesfic-d12` | Directly incorporates the government problem statement ID and title for clear evaluation traceability. |
| **Option 3** | `agri-sat-assam` | Emphasizes space applications and remote sensing pedigree under ASSAC / Dept of Science & Technology. |
| **Option 4** | `kheti-lens-assam` | Highlights precision drone imaging and field-level inspection. |
| **Option 5** | `assam-crop-sentinel` | Focuses on all-weather radar surveillance and food security. |

---

## 🎯 5 Core Operational Portals

### 1. Executive Analytics & District Yield Dashboard (`#dashboard`)
- **State-wide Telemetry:** Monitored acreage, estimated production in Lakh Metric Tonnes, and average yield in kg/ha and Quintals per Assam Bigha.
- **Brahmaputra Flood Advisory:** Real-time SAR radar detection of waterlogged and submerged plots along riverine char areas (e.g. Baghbar Char, Barpeta).
- **District Leaderboard:** Live ranking of Kamrup Metro, Nagaon, Barpeta, Golaghat, Darrang, and Cachar with exportable CSV summaries.

### 2. Multi-Sensor Satellite & Drone WebGIS Viewer (`#satellite-gis`)
- **Interactive Layer Switcher:**
  - *Crop Yield Heatmap:* Parcel-level color coding (Emerald = Excellent >2.8 t/ha, Sky = Normal, Amber = Below Avg, Red = Inundated).
  - *Sentinel-2 Optical NDVI:* Visualizes vegetation vigour and canopy greenness.
  - *Sentinel-1 SAR Radar:* Cloud-penetrating C-band backscatter highlighting flood submergence ($\le -16.5\text{ dB}$).
  - *UAV Drone Orthomosaic:* Centimeter-level pilot drone imagery.
- **Parcel Inspector:** Displays Cadastral Dag/Patta, Pattadar name, Assam BKL area, NDVI, SAR dB, and predicted harvest yield.

### 3. Drone Operations & Field CCE Ground-Truthing Portal (`#drone-cce`)
- **Digital Crop Cutting Experiment (CCE) Logging:** Form for Agricultural Development Officers (ADOs) and Krishi Sahayaks to enter 5m × 5m quadrant fresh weights, dry weights, and grain moisture % with automated yield calibration:
  $$\text{Yield (kg/ha)} = \frac{\text{Dry Grain Weight (kg)}}{25} \times 10,000 \times \frac{100 - \text{Moisture \%}}{100 - 14}$$
- **UAV Flight Dispatcher:** Schedule drone flights, select sensor payloads (MicaSense 5-Band Multispectral vs. 4K RGB), and monitor battery telemetry.

### 4. Farmer Advisory & Digital Yield Certificate Portal (`#farmer-portal`)
- **Farmer Self-Service:** Search by Dag Number, Patta Number, or PM-KISAN / Farmer ID.
- **Official Digital Certificate:** Issues an authentic, verifiable certificate with cryptographic SHA-256 verification token, MSP procurement quota for FCI / AFCSCL, PMFBY crop insurance benchmark assessment, and printable PDF format.

### 5. Super Admin Command Console (`#admin-console`)
- **AI/ML Model Hyperparameter Tuning:** Sliders to calibrate NDVI health thresholds, SAR floodwater dB cutoffs, and regression ensemble weights (XGBoost, Random Forest, Bi-LSTM, WOFOST biophysical assimilation).
- **Sensor Ingestion Telemetry:** Live heartbeat monitoring for Copernicus Sentinel-1/2, ISRO Bhuvan/VEDAS, IMD weather feeds, and UAV tile processing.
- **Role-Based Access Control (RBAC):** Provision credentials for ASSAC Remote Sensing Scientists, DAOs, ADOs, and Drone Pilots.
- **MSP Targets & CCE Quotas:** Configure minimum statutory CCE sample density per revenue circle.
- **Cryptographic Audit Ledger:** Immutable SHA-256 hashed audit trail of all model calibrations and yield overrides.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Application:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **WebGIS Engine:** Leaflet 1.9.4, GeoJSON vector renderers, Esri World Imagery satellite basemaps
- **Geospatial & Conversion Units:** Assam Statutory Land Unit Engine ($1\text{ Bigha} = 5\text{ Katha} = 100\text{ Lesa} \approx 1337.8\text{ m}^2 = 0.13378\text{ Ha}$)
- **Machine Learning Architecture:**
  - Hybrid Regressor: XGBoost (40%) + Random Forest (30%) + 1D-CNN / Bi-LSTM Time-Series (20%)
  - Biophysical Growth: WOFOST / DSSAT temperature and radiation assimilation (10%)
- **Edge Deployment:** Cloudflare Pages with zero-cold-start performance, SPA hash-based deep linking, and automated build pipelines

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Local Development
```bash
# 1. Clone repository
git clone https://github.com/RonHatibaruah/sasya-drishti.git
cd sasya-drishti

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
```
Production assets will compile cleanly to the `dist/` directory.

---

## ☁️ Deployment

Pre-configured for instant deployment on **Cloudflare Pages**:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Build Output Directory:** `dist`
- **Node.js Compatibility Flag:** `nodejs_compat`

---

## 📜 Authors & Acknowledgments

- **Lead Solutions Architect & Innovator:** Ron Hatibaruah
- **Challenge:** North East Seva First Innovation Challenge (NESFIC 2026) — Problem Statement NESFIC-D-12
- **Nodal Departments:** Assam State Space Application Centre (ASSAC), Department of Science & Technology, Government of Assam; Directorate of Agriculture, Assam.
