export interface User {
  id: string;
  email?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  phone?: string;
  avatar_url?: string;
  is_active?: boolean;
  is_demo?: boolean;
  created_at?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in?: number;
  user?: User;
}

export interface Parcel {
  id: string;
  parcel_id?: string;
  ulpin_2d?: string;
  state_code?: string;
  city_code?: string;
  ward_code?: string;
  area?: number;
  area_sqm?: number;
  address?: string;
  land_use?: string;
  status?: string;
  geometry_geojson?: any;
}

export interface Building {
  id: string;
  building_id?: string;
  parcel_id?: string;
  building_number?: string;
  name?: string;
  height?: number;
  height_m?: number;
  floor_count?: number;
  total_floors?: number;
  building_type?: string;
  usage_type?: string;
  construction_year?: number;
  status?: string;
  model_url?: string;
}

export interface Floor {
  id: string;
  building_id: string;
  floor_number: number;
  floor_label?: string;
  floor_level?: number;
  height?: number;
  area?: number;
  unit_count?: number;
  units?: PropertyUnit[];
}

export interface PropertyUnit {
  id: string;
  unit_id?: string;
  floor_id?: string;
  building_id?: string;
  unit_number: string;
  property_type?: string;
  usage_type?: string;
  area?: number;
  area_sqm?: number;
  status?: string;
  ulpin_3d?: string;
}

export interface ULPIN {
  id?: string;
  ulpin_code: string;
  state_code?: string;
  city_code?: string;
  ward_code?: string;
  parcel_id?: string;
  building_id?: string;
  floor_id?: string;
  unit_id?: string;
  owner_id?: string;
  registration_status?: string;
  validation_status?: string;
  is_active?: boolean;
  parcel?: Parcel;
  building?: Building;
  floor?: Floor;
  unit?: PropertyUnit;
  owner?: Owner;
}

export interface ULPINSearchResult {
  ulpin_code: string;
  property_type?: string;
  parcel_id?: string;
  building_id?: string;
  floor_number?: number;
  unit_number?: string;
  area?: any;
  registration_status?: string;
  validation_status?: string;
  owner_name?: string;
  address?: string;
  coordinates?: any;
  match_type?: string;
  match_score?: number;
}

export interface Owner {
  id: string;
  full_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  owner_type?: string;
  aadhaar_hash?: string;
  property_id?: string;
  share_percentage?: number;
}

export interface ValidationRecord {
  id: string;
  ulpin_id?: string;
  property_id?: string;
  validation_type: string;
  official_value?: string;
  detected_value?: string;
  difference?: string;
  difference_percentage?: number;
  status: string;
  notes?: string;
  remarks?: string;
  created_at?: string;
  timestamp?: string;
}

export interface RegistryHistory {
  id: string;
  ulpin_id?: string;
  property_id?: string;
  action?: string;
  transaction_type?: string;
  description?: string;
  old_value?: string;
  new_value?: string;
  document_url?: string;
  document_ref?: string;
  status?: string;
  created_at?: string;
  date?: string;
  performed_by_name?: string;
}

export interface ChangeDetection {
  id: string;
  ulpin_id?: string;
  parcel_id?: string;
  building_id?: string;
  change_type: string;
  description?: string;
  detected_at?: string;
  detection_date?: string;
  confidence?: number;
  status: string;
  before_image_url?: string;
  after_image_url?: string;
}

export interface FlaggedProperty {
  id: string;
  ulpin_id?: string;
  ulpin?: string;
  ulpin_code?: string;
  flag_type?: string;
  issue_type?: string;
  severity?: string;
  description?: string;
  resolved?: boolean;
  status?: string;
  created_at?: string;
  reported_date?: string;
}

export interface DashboardStats {
  total_ulpins?: number;
  registered?: number;
  unregistered?: number;
  flagged?: number;
  pending_validation?: number;
  new_construction?: number;
  ownership_changes?: number;
  total_parcels?: number;
  total_buildings?: number;
  total_units?: number;
  totalParcels?: number;
  totalBuildings?: number;
  totalUnits?: number;
  verifiedULPINs?: number;
  pendingValidations?: number;
  anomaliesDetected?: number;
}

export interface Notification {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  notification_type?: string;
  type?: string;
  category?: string;
  reference_id?: string;
  is_read: boolean;
  created_at?: string;
  timestamp?: string;
}

export interface Dataset {
  id: string;
  name: string;
  dataset_type?: string;
  type?: string;
  description?: string;
  file_path?: string;
  file_size?: number;
  size_bytes?: number;
  file_count?: number;
  format?: string;
  status: string;
  metadata_json?: any;
  created_at?: string;
  upload_date?: string;
}

export interface ProcessingJob {
  id: string;
  dataset_id: string;
  job_type: string;
  status: string;
  progress: number;
  current_stage?: string;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  result_path?: string;
}

export interface GISLayer {
  id: string;
  name: string;
  layer_type?: string;
  type?: string;
  format?: string;
  file_path?: string;
  url?: string;
  is_active?: boolean;
  visible?: boolean;
  opacity?: number;
  properties_json?: any;
}

export interface PointCloud {
  id: string;
  name: string;
  point_count?: number;
  format?: string;
  file_path?: string;
  url?: string;
  bounds?: any;
  classification_available?: boolean;
  intensity_available?: boolean;
  trajectory_available?: boolean;
}
