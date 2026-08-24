/**
 * AgriSentinel AI - System Constants & Design Enums
 */

export const USER_ROLES = {
  FARMER: 'farmer',
  EXPERT: 'expert',
  OFFICER: 'officer',
  ADMIN: 'admin',
};

export const CROPS = [
  { id: 'wheat', name: 'Wheat', hindi: 'गेहूं', icon: '🌾' },
  { id: 'rice', name: 'Rice (Paddy)', hindi: 'धान / चावल', icon: '🌱' },
  { id: 'tomato', name: 'Tomato', hindi: 'टमाटर', icon: '🍅' },
  { id: 'potato', name: 'Potato', hindi: 'आलू', icon: '🥔' },
  { id: 'maize', name: 'Maize (Corn)', hindi: 'मक्का', icon: '🌽' },
];

export const SEVERITY_LEVELS = {
  HEALTHY: { label: 'Healthy', color: 'emerald', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  MILD: { label: 'Mild', color: 'blue', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  MODERATE: { label: 'Moderate', color: 'amber', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  SEVERE: { label: 'Severe', color: 'orange', bg: 'bg-agri-orange/10', text: 'text-agri-orange', border: 'border-agri-orange/30' },
  CRITICAL: { label: 'Critical', color: 'rose', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
};

export const RISK_LEVELS = {
  LOW: { label: 'Low Risk', min: 0, max: 25, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  MODERATE: { label: 'Moderate Risk', min: 26, max: 50, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  HIGH: { label: 'High Risk', min: 51, max: 75, color: 'text-agri-orange', bg: 'bg-agri-orange/10', border: 'border-agri-orange/30' },
  CRITICAL: { label: 'Critical Outbreak Risk', min: 76, max: 100, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
};

export const SCAN_STAGES = [
  { step: 1, label: 'Initializing AI Pipeline...', desc: 'Allocating compute and neural tensors' },
  { step: 2, label: 'Checking Image Quality (QC)...', desc: 'Analyzing blur, illumination, and focus' },
  { step: 3, label: 'Identifying Crop Species...', desc: 'Classifying botanical morphology' },
  { step: 4, label: 'Detecting Crop Pathogens...', desc: 'Extracting leaf lesion signatures via CNN' },
  { step: 5, label: 'Scanning for Pest Infestations...', desc: 'Bounding box inference via YOLO' },
  { step: 6, label: 'Estimating Area Severity...', desc: 'Generating leaf damage segmentation mask' },
  { step: 7, label: 'Retrieving Microclimate Data...', desc: 'Fetching temperature, humidity, and rainfall' },
  { step: 8, label: 'Running C++ Spatial Risk Engine...', desc: 'Computing Haversine outbreak proximity' },
  { step: 9, label: 'Generating Verified Recommendations...', desc: 'Synthesizing agronomic protocol' },
];
