import { CropParcelRecord, ModelCalibrationConfig, YieldGrade, CropType } from '../types/cropYield';

// Assam Land Measurement Constants
// 1 Bigha = 5 Katha = 100 Lesa = 14,400 sq.ft ≈ 1,337.8 sq.m = 0.13378 Hectares
export const ASSAM_BKL = {
  SQM_PER_BIGHAS: 1337.8,
  KATHA_PER_BIGHA: 5,
  LESA_PER_KATHA: 20,
  LESA_PER_BIGHA: 100,
  HECTARES_PER_BIGHA: 0.133780377,
  BIGHAS_PER_HECTARE: 7.474938
};

export const DEFAULT_MODEL_CONFIG: ModelCalibrationConfig = {
  ndviHealthyThreshold: 0.65,
  ndviStressedThreshold: 0.35,
  sarFloodInundationDb: -16.5,
  sarBiomassCoefficient: 1.42,
  mlWeights: {
    xgboost: 0.40,
    randomForest: 0.30,
    biLstm: 0.20,
    wofostAssimilation: 0.10
  },
  opticalCloudMaskTolerancePercent: 25,
  minCcePerCircle: 8
};

/**
 * Converts Assam statutory units (Bigha, Katha, Lesa) to metric Hectares
 */
export function bklToHectares(bigha: number, katha: number, lesa: number): number {
  const totalBigha = bigha + (katha / ASSAM_BKL.KATHA_PER_BIGHA) + (lesa / ASSAM_BKL.LESA_PER_BIGHA);
  return totalBigha * ASSAM_BKL.HECTARES_PER_BIGHA;
}

/**
 * Converts Yield in kg/ha to Assam Quintals per Bigha
 * 1 Quintal = 100 kg. 1 Hectare ≈ 7.475 Bigha
 */
export function kgHaToQuintalsPerBigha(kgHa: number): number {
  const quintalsHa = kgHa / 100;
  return Number((quintalsHa / ASSAM_BKL.BIGHAS_PER_HECTARE).toFixed(2));
}

/**
 * Calculates Crop Cutting Experiment (CCE) Yield standardized to 14% moisture
 * Quadrant is standard 5m x 5m = 25 m²
 */
export function calculateCceYield(dryGrainWeightKg: number, moisturePercent: number): number {
  // Moisture correction factor to standard 14% storage equilibrium
  const moistureCorrection = (100 - moisturePercent) / (100 - 14);
  const adjustedWeightKg = dryGrainWeightKg * moistureCorrection;
  // Scale up from 25 m² to 10,000 m² (1 Hectare) -> multiply by 400
  return Math.round(adjustedWeightKg * 400);
}

/**
 * Re-evaluates parcel yield grade based on active ML calibration config
 */
export function evaluateYieldGrade(
  ndvi: number,
  sarDb: number,
  isFloodInundated: boolean,
  estimatedKgHa: number,
  cropType: CropType,
  config: ModelCalibrationConfig
): YieldGrade {
  if (isFloodInundated || sarDb <= config.sarFloodInundationDb || ndvi < config.ndviStressedThreshold) {
    return 'STRESSED_CRITICAL';
  }

  // Crop-specific standard benchmarks in Assam (kg/ha)
  const benchmarks: Record<CropType, number> = {
    SALI_PADDY: 2500,
    BORO_PADDY: 3400,
    AHU_PADDY: 1800,
    MUSTARD: 1200,
    JUTE: 2200,
    MAIZE: 3200
  };

  const benchmark = benchmarks[cropType] || 2500;
  const ratio = estimatedKgHa / benchmark;

  if (ndvi >= config.ndviHealthyThreshold && ratio >= 1.15) {
    return 'EXCELLENT';
  } else if (ratio >= 0.85) {
    return 'NORMAL';
  } else {
    return 'BELOW_AVERAGE';
  }
}

/**
 * Simulates AI Multi-Model Yield Re-Prediction based on calibrated ML weights
 */
export function recalculateParcelYield(
  record: CropParcelRecord,
  config: ModelCalibrationConfig
): CropParcelRecord {
  const { spectralIndices, cropType, areaHectares } = record;
  
  // Base physical potential based on crop
  const baseYields: Record<CropType, number> = {
    SALI_PADDY: 2600,
    BORO_PADDY: 3500,
    AHU_PADDY: 1900,
    MUSTARD: 1250,
    JUTE: 2300,
    MAIZE: 3300
  };
  const base = baseYields[cropType] || 2500;

  // 1. Optical Spectral Component (NDVI + LAI)
  const opticalFactor = Math.min(1.4, Math.max(0.4, (spectralIndices.ndvi * 1.3) + (spectralIndices.lai * 0.1)));
  
  // 2. SAR Cloud-Penetrating Biomass Component
  // SAR VH backscatter correlates strongly with fresh canopy biomass in flooded rice paddies
  const sarFactor = Math.min(1.35, Math.max(0.5, (1 + (spectralIndices.sarBackscatterVhDb + 18) * 0.05) * config.sarBiomassCoefficient * 0.7));

  // 3. Drone High-Res Adjustment (if available, boosts precision)
  const droneBonus = record.uavSurveyed ? 1.05 : 1.0;

  // 4. Flood Inundation Penalty
  const floodPenalty = (record.floodInundated || spectralIndices.sarBackscatterVvDb <= config.sarFloodInundationDb) ? 0.35 : 1.0;

  // Weighted Multi-Model Prediction
  const predictedKgHa = Math.round(
    base * 
    (opticalFactor * (config.mlWeights.xgboost + config.mlWeights.randomForest) + 
     sarFactor * config.mlWeights.biLstm + 
     config.mlWeights.wofostAssimilation) * 
    droneBonus * 
    floodPenalty
  );

  const estimatedQuintalBigha = kgHaToQuintalsPerBigha(predictedKgHa);
  const estimatedProductionTonnes = Number(((predictedKgHa * areaHectares) / 1000).toFixed(2));
  const yieldGrade = evaluateYieldGrade(
    spectralIndices.ndvi,
    spectralIndices.sarBackscatterVvDb,
    record.floodInundated,
    predictedKgHa,
    cropType,
    config
  );

  return {
    ...record,
    estimatedYieldKgHa: predictedKgHa,
    estimatedYieldQuintalBigha: estimatedQuintalBigha,
    estimatedProductionTonnes: estimatedProductionTonnes,
    yieldGrade
  };
}

/**
 * Generates an official, verifiable cryptographic token (SHA-256 simulation) for Farmer Certificates
 */
export function generateCertificateToken(record: CropParcelRecord): string {
  const rawString = `${record.dagNumber}|${record.pattaNumber}|${record.farmerId}|${record.estimatedYieldKgHa}|${record.season}|ASSAC_GOVT_OF_ASSAM`;
  let hash = 0;
  for (let i = 0; i < rawString.length; i++) {
    const char = rawString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `AS-SASYA-2026-${record.circle.substring(0, 3).toUpperCase()}-${hex.toUpperCase()}`;
}
