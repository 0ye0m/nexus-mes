// User Types
export type UserRole = 'admin' | 'production_manager' | 'quality_inspector';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: string;
}

// Inventory Types
export type MaterialCategory = 'battery' | 'motor' | 'controller' | 'chassis' | 'tires' | 'interior' | 'electronics';

export interface Material {
  id: string;
  name: string;
  sku: string;
  category: MaterialCategory;
  quantity: number;
  unit: string;
  minStock: number;
  unitCost: number;
  supplier: string;
  supplierContact: string;
  lastUpdated: string;
}

// Production Types
export type ScheduleType = 'daily' | 'weekly' | 'monthly';
export type ProductionStatus = 'pending' | 'in_progress' | 'completed';

export interface ProductionSchedule {
  id: string;
  vehicleModel: string;
  scheduleType: ScheduleType;
  targetQuantity: number;
  completedQuantity: number;
  startDate: string;
  endDate: string;
  assignedMachines: string[];
  assignedLabor: number;
  status: ProductionStatus;
  createdAt: string;
}

// Battery & Powertrain Types
export type BatteryType = 'Li-ion 40kWh' | 'Li-ion 60kWh' | 'Li-ion 80kWh';
export type MotorSpec = '100kW' | '150kW' | '200kW';
export type AssemblyStatus = 'in_assembly' | 'testing' | 'completed';

export interface BatteryPowertrainAssembly {
  id: string;
  vehicleId: string;
  vehicleModel: string;
  batteryType: BatteryType;
  motorSpec: MotorSpec;
  controllerModel: string;
  status: AssemblyStatus;
  assemblyStartDate: string;
  completionDate?: string;
  assembledBy: string;
}

// Quality Control Types
export type InspectionType = 'visual' | 'electrical' | 'performance' | 'safety';
export type InspectionResult = 'pass' | 'fail';

export interface QualityInspection {
  id: string;
  vehicleId: string;
  vehicleModel: string;
  inspectionType: InspectionType;
  result: InspectionResult;
  defectDescription?: string;
  inspector: string;
  inspectionDate: string;
  approved: boolean;
}

// Cost & Performance Types
export interface ProductionCost {
  id: string;
  vehicleModel: string;
  vehicleId: string;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  calculatedAt: string;
}

export interface PerformanceMetric {
  id: string;
  date: string;
  efficiency: number;
  productivity: number;
  qualityRate: number;
  vehiclesProduced: number;
  defectCount: number;
}

// Report Types
export type ReportType = 'production' | 'inventory' | 'quality' | 'cost';

export interface ReportFilter {
  type: ReportType;
  startDate: string;
  endDate: string;
}

// Vehicle Models
export const VEHICLE_MODELS = ['EV-Compact', 'EV-Sedan', 'EV-SUV', 'EV-Premium'] as const;
export type VehicleModel = typeof VEHICLE_MODELS[number];

// Navigation
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  roles: UserRole[];
}
