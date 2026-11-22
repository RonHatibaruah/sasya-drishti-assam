export type CropType = 
  | 'SALI_PADDY' 
  | 'BORO_PADDY' 
  | 'AHU_PADDY' 
  | 'MUSTARD' 
  | 'JUTE' 
  | 'MAIZE';

export type CropSeason = 'KHARIF_2026' | 'RABI_2025_26' | 'SUMMER_2026';

export type GrowthStage = 
  | 'SOWING' 
  | 'VEGETATIVE' 
  | 'REPRODUCTIVE' 
  | 'MATURITY' 
  | 'HARVESTED';

export type YieldGrade = 
  | 'EXCELLENT' 
  | 'NORMAL' 
  | 'BELOW_AVERAGE' 
  | 'STRESSED_CRITICAL';

export interface SpectralIndices {
  ndvi: number;        // Normalized Difference Vegetation Index (0.0 to 1.0)
  evi: number;         // Enhanced Vegetation Index
  ndwi: number;        // Normalized Difference Water Index (Moisture)
  sarBackscatterVvDb: number; // Sentinel-1 SAR C-band VV backscatter in dB (-25 to -5 dB)
  sarBackscatterVhDb: number; // Sentinel-1 SAR C-band VH backscatter in dB (-30 to -10 dB)
  lai: number;         // Leaf Area Index (m²/m²)
  opticalCloudCoverPercent: number; // Cloud obscuration % (0 = clear, 100 = overcast)
}

export interface CropParcelRecord {
  id: string;
  dagNumber: string;
  pattaNumber: string;
  village: string;
  circle: string;
  district: string;
  farmerName: string;
  farmerId: string; // e.g. PM-KISAN-AS-09281
  contactPhone: string;
  
  // Assam Statutory Units
  areaBigha: number;
  areaKatha: number;
  areaLesa: number;
  areaHectares: number; // Computed metric equivalent (1 Bigha = 0.13378 Ha)
  
  cropType: CropType;
  cropVariety: string; // e.g. 'Ranjit Sub-1', 'Mahsuri', 'M-27 Mustard'
  season: CropSeason;
  sowingDate: string;
  expectedHarvestDate: string;
  stage: GrowthStage;
  
  // Remote Sensing Telemetry
  spectralIndices: SpectralIndices;
  sarCloudPenetrated: boolean;
  uavSurveyed: boolean;
  uavResolutionCm?: number; // e.g. 3.5 cm/px
  floodInundated: boolean;
  
  // Yield & Production Predictions
  estimatedYieldKgHa: number;
  estimatedYieldQuintalBigha: number;
  estimatedProductionTonnes: number;
  yieldGrade: YieldGrade;
  confidenceScore: number; // 0 to 100%
  
  // Ground Truth Validation (Crop Cutting Experiment)
  cceStatus: 'PENDING' | 'SCHEDULED' | 'COMPLETED';
  cceActualYieldKgHa?: number;
  cceVariancePercent?: number;
  
  // Map Geometries
  coordinates: [number, number][]; // Polygon vertices [lat, lng]
}

export interface DroneMission {
  id: string;
  title: string;
  pilotName: string;
  agency: string;
  district: string;
  circle: string;
  village: string;
  targetAreaBighas: number;
  flightAltitudeMeters: number;
  sensorType: 'MULTISPECTRAL_5BAND' | 'RGB_4K' | 'THERMAL_MULTISPECTRAL';
  batteryLevel: number;
  status: 'SCHEDULED' | 'IN_FLIGHT' | 'PROCESSING' | 'COMPLETED';
  scheduledDate: string;
  orthomosaicUrl?: string;
  cloudCoverAvoidancePercent: number;
}

export interface CropCuttingExperiment {
  id: string;
  parcelId: string;
  dagNumber: string;
  village: string;
  circle: string;
  district: string;
  officerName: string;
  date: string;
  quadrantSizeMeters: string; // '5m x 5m' standard
  freshCutWeightKg: number;
  dryGrainWeightKg: number;
  grainMoisturePercent: number; // Optimal 14%
  calculatedYieldKgHa: number;
  geotagLat: number;
  geotagLng: number;
  photoUrl: string;
  status: 'VERIFIED' | 'FLAGGED_ANOMALY';
  mspProcurementForecastQuintals: number;
}

export interface DistrictSummary {
  district: string;
  monitoredHectares: number;
  monitoredBighas: number;
  estimatedProductionTonnes: number;
  averageYieldKgHa: number;
  normalBenchmarkYieldKgHa: number;
  yieldAnomalyPercent: number; // + or - % vs 5-year average
  cceCompletedCount: number;
  cceTargetCount: number;
  sarPenetrationCoveragePercent: number;
  droneCoveragePercent: number;
  primaryCrops: string[];
}

export interface ModelCalibrationConfig {
  ndviHealthyThreshold: number;      // default 0.65
  ndviStressedThreshold: number;     // default 0.35
  sarFloodInundationDb: number;      // default -16.5 dB
  sarBiomassCoefficient: number;     // default 1.42
  mlWeights: {
    xgboost: number;
    randomForest: number;
    biLstm: number;
    wofostAssimilation: number;
  };
  opticalCloudMaskTolerancePercent: number; // default 20%
  minCcePerCircle: number;                  // default 8 cuts
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  hash: string;
}
