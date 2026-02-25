import { User, Material, ProductionSchedule, BatteryPowertrainAssembly, QualityInspection, ProductionCost, PerformanceMetric } from '@/lib/types';

// Users Data
export const mockUsers: User[] = [
  {
    id: 'usr-001',
    name: 'John Mitchell',
    email: 'john.mitchell@evmanufacturing.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: 'usr-002',
    name: 'Sarah Chen',
    email: 'sarah.chen@evmanufacturing.com',
    role: 'production_manager',
    status: 'active',
    createdAt: '2024-02-20'
  },
  {
    id: 'usr-003',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@evmanufacturing.com',
    role: 'quality_inspector',
    status: 'active',
    createdAt: '2024-03-10'
  },
  {
    id: 'usr-004',
    name: 'Emily Watson',
    email: 'emily.watson@evmanufacturing.com',
    role: 'production_manager',
    status: 'active',
    createdAt: '2024-03-15'
  },
  {
    id: 'usr-005',
    name: 'David Kim',
    email: 'david.kim@evmanufacturing.com',
    role: 'quality_inspector',
    status: 'inactive',
    createdAt: '2024-04-01'
  },
  {
    id: 'usr-006',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@evmanufacturing.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-04-10'
  },
  {
    id: 'usr-007',
    name: 'James Wilson',
    email: 'james.wilson@evmanufacturing.com',
    role: 'quality_inspector',
    status: 'active',
    createdAt: '2024-05-05'
  }
];

// Inventory Data
export const mockMaterials: Material[] = [
  {
    id: 'mat-001',
    name: 'Li-ion Battery Pack 60kWh',
    sku: 'BAT-LI-60K',
    category: 'battery',
    quantity: 245,
    unit: 'units',
    minStock: 100,
    unitCost: 8500,
    supplier: 'LG Energy Solution',
    supplierContact: 'procurement@lgensol.com',
    lastUpdated: '2024-12-18'
  },
  {
    id: 'mat-002',
    name: 'Li-ion Battery Pack 80kWh',
    sku: 'BAT-LI-80K',
    category: 'battery',
    quantity: 85,
    unit: 'units',
    minStock: 80,
    unitCost: 12000,
    supplier: 'CATL',
    supplierContact: 'supply@catl.com',
    lastUpdated: '2024-12-17'
  },
  {
    id: 'mat-003',
    name: 'Electric Motor 150kW',
    sku: 'MOT-150KW',
    category: 'motor',
    quantity: 320,
    unit: 'units',
    minStock: 150,
    unitCost: 4200,
    supplier: 'Bosch',
    supplierContact: 'automotive@bosch.com',
    lastUpdated: '2024-12-18'
  },
  {
    id: 'mat-004',
    name: 'Electric Motor 200kW',
    sku: 'MOT-200KW',
    category: 'motor',
    quantity: 45,
    unit: 'units',
    minStock: 50,
    unitCost: 5800,
    supplier: 'Nidec',
    supplierContact: 'sales@nidec.com',
    lastUpdated: '2024-12-16'
  },
  {
    id: 'mat-005',
    name: 'Motor Controller Unit',
    sku: 'CTRL-MCU-01',
    category: 'controller',
    quantity: 410,
    unit: 'units',
    minStock: 200,
    unitCost: 1850,
    supplier: 'BorgWarner',
    supplierContact: 'powertrain@borgwarner.com',
    lastUpdated: '2024-12-18'
  },
  {
    id: 'mat-006',
    name: 'Vehicle Chassis Frame',
    sku: 'CHS-FRAME-01',
    category: 'chassis',
    quantity: 180,
    unit: 'units',
    minStock: 100,
    unitCost: 3200,
    supplier: 'Magna International',
    supplierContact: 'structures@magna.com',
    lastUpdated: '2024-12-17'
  },
  {
    id: 'mat-007',
    name: 'All-Season Tires 19"',
    sku: 'TIRE-19-AS',
    category: 'tires',
    quantity: 720,
    unit: 'units',
    minStock: 400,
    unitCost: 180,
    supplier: 'Michelin',
    supplierContact: 'fleet@michelin.com',
    lastUpdated: '2024-12-18'
  },
  {
    id: 'mat-008',
    name: 'Premium Leather Seats',
    sku: 'INT-SEAT-PL',
    category: 'interior',
    quantity: 95,
    unit: 'sets',
    minStock: 80,
    unitCost: 2400,
    supplier: 'Adient',
    supplierContact: 'seating@adient.com',
    lastUpdated: '2024-12-15'
  },
  {
    id: 'mat-009',
    name: 'Infotainment Display 15"',
    sku: 'ELEC-INF-15',
    category: 'electronics',
    quantity: 280,
    unit: 'units',
    minStock: 120,
    unitCost: 950,
    supplier: 'Panasonic Automotive',
    supplierContact: 'infotainment@panasonic.com',
    lastUpdated: '2024-12-18'
  },
  {
    id: 'mat-010',
    name: 'Battery Management System',
    sku: 'ELEC-BMS-01',
    category: 'electronics',
    quantity: 38,
    unit: 'units',
    minStock: 100,
    unitCost: 1200,
    supplier: 'NXP Semiconductors',
    supplierContact: 'auto@nxp.com',
    lastUpdated: '2024-12-17'
  },
  {
    id: 'mat-011',
    name: 'Li-ion Battery Pack 40kWh',
    sku: 'BAT-LI-40K',
    category: 'battery',
    quantity: 190,
    unit: 'units',
    minStock: 80,
    unitCost: 5500,
    supplier: 'Panasonic',
    supplierContact: 'ev@panasonic.com',
    lastUpdated: '2024-12-18'
  },
  {
    id: 'mat-012',
    name: 'Electric Motor 100kW',
    sku: 'MOT-100KW',
    category: 'motor',
    quantity: 275,
    unit: 'units',
    minStock: 120,
    unitCost: 3100,
    supplier: 'Bosch',
    supplierContact: 'automotive@bosch.com',
    lastUpdated: '2024-12-17'
  }
];

// Production Schedules
export const mockProductionSchedules: ProductionSchedule[] = [
  {
    id: 'sch-001',
    vehicleModel: 'EV-Compact',
    scheduleType: 'daily',
    targetQuantity: 45,
    completedQuantity: 42,
    startDate: '2024-12-18',
    endDate: '2024-12-18',
    assignedMachines: ['Assembly Line A', 'Assembly Line B'],
    assignedLabor: 28,
    status: 'in_progress',
    createdAt: '2024-12-17'
  },
  {
    id: 'sch-002',
    vehicleModel: 'EV-Sedan',
    scheduleType: 'daily',
    targetQuantity: 35,
    completedQuantity: 35,
    startDate: '2024-12-17',
    endDate: '2024-12-17',
    assignedMachines: ['Assembly Line C'],
    assignedLabor: 22,
    status: 'completed',
    createdAt: '2024-12-16'
  },
  {
    id: 'sch-003',
    vehicleModel: 'EV-SUV',
    scheduleType: 'weekly',
    targetQuantity: 180,
    completedQuantity: 125,
    startDate: '2024-12-16',
    endDate: '2024-12-22',
    assignedMachines: ['Assembly Line D', 'Assembly Line E'],
    assignedLabor: 45,
    status: 'in_progress',
    createdAt: '2024-12-14'
  },
  {
    id: 'sch-004',
    vehicleModel: 'EV-Premium',
    scheduleType: 'monthly',
    targetQuantity: 80,
    completedQuantity: 0,
    startDate: '2024-12-23',
    endDate: '2024-12-31',
    assignedMachines: ['Assembly Line F'],
    assignedLabor: 18,
    status: 'pending',
    createdAt: '2024-12-15'
  },
  {
    id: 'sch-005',
    vehicleModel: 'EV-Compact',
    scheduleType: 'daily',
    targetQuantity: 50,
    completedQuantity: 50,
    startDate: '2024-12-16',
    endDate: '2024-12-16',
    assignedMachines: ['Assembly Line A'],
    assignedLabor: 30,
    status: 'completed',
    createdAt: '2024-12-15'
  },
  {
    id: 'sch-006',
    vehicleModel: 'EV-Sedan',
    scheduleType: 'weekly',
    targetQuantity: 200,
    completedQuantity: 178,
    startDate: '2024-12-09',
    endDate: '2024-12-15',
    assignedMachines: ['Assembly Line C', 'Assembly Line D'],
    assignedLabor: 52,
    status: 'completed',
    createdAt: '2024-12-07'
  }
];

// Battery & Powertrain Assemblies
export const mockAssemblies: BatteryPowertrainAssembly[] = [
  {
    id: 'asm-001',
    vehicleId: 'VEH-2024-001',
    vehicleModel: 'EV-Compact',
    batteryType: 'Li-ion 40kWh',
    motorSpec: '100kW',
    controllerModel: 'BorgWarner MCU-100',
    status: 'completed',
    assemblyStartDate: '2024-12-16',
    completionDate: '2024-12-17',
    assembledBy: 'Tech Team A'
  },
  {
    id: 'asm-002',
    vehicleId: 'VEH-2024-002',
    vehicleModel: 'EV-Sedan',
    batteryType: 'Li-ion 60kWh',
    motorSpec: '150kW',
    controllerModel: 'BorgWarner MCU-150',
    status: 'testing',
    assemblyStartDate: '2024-12-17',
    assembledBy: 'Tech Team B'
  },
  {
    id: 'asm-003',
    vehicleId: 'VEH-2024-003',
    vehicleModel: 'EV-SUV',
    batteryType: 'Li-ion 80kWh',
    motorSpec: '200kW',
    controllerModel: 'BorgWarner MCU-200',
    status: 'in_assembly',
    assemblyStartDate: '2024-12-18',
    assembledBy: 'Tech Team A'
  },
  {
    id: 'asm-004',
    vehicleId: 'VEH-2024-004',
    vehicleModel: 'EV-Premium',
    batteryType: 'Li-ion 80kWh',
    motorSpec: '200kW',
    controllerModel: 'BorgWarner MCU-200P',
    status: 'in_assembly',
    assemblyStartDate: '2024-12-18',
    assembledBy: 'Tech Team C'
  },
  {
    id: 'asm-005',
    vehicleId: 'VEH-2024-005',
    vehicleModel: 'EV-Compact',
    batteryType: 'Li-ion 40kWh',
    motorSpec: '100kW',
    controllerModel: 'BorgWarner MCU-100',
    status: 'completed',
    assemblyStartDate: '2024-12-15',
    completionDate: '2024-12-16',
    assembledBy: 'Tech Team B'
  },
  {
    id: 'asm-006',
    vehicleId: 'VEH-2024-006',
    vehicleModel: 'EV-Sedan',
    batteryType: 'Li-ion 60kWh',
    motorSpec: '150kW',
    controllerModel: 'BorgWarner MCU-150',
    status: 'testing',
    assemblyStartDate: '2024-12-17',
    assembledBy: 'Tech Team A'
  },
  {
    id: 'asm-007',
    vehicleId: 'VEH-2024-007',
    vehicleModel: 'EV-SUV',
    batteryType: 'Li-ion 80kWh',
    motorSpec: '200kW',
    controllerModel: 'BorgWarner MCU-200',
    status: 'completed',
    assemblyStartDate: '2024-12-14',
    completionDate: '2024-12-16',
    assembledBy: 'Tech Team C'
  }
];

// Quality Inspections
export const mockInspections: QualityInspection[] = [
  {
    id: 'qci-001',
    vehicleId: 'VEH-2024-001',
    vehicleModel: 'EV-Compact',
    inspectionType: 'visual',
    result: 'pass',
    inspector: 'Michael Rodriguez',
    inspectionDate: '2024-12-17',
    approved: true
  },
  {
    id: 'qci-002',
    vehicleId: 'VEH-2024-002',
    vehicleModel: 'EV-Sedan',
    inspectionType: 'electrical',
    result: 'fail',
    defectDescription: 'Battery management system communication error detected during initialization sequence',
    inspector: 'James Wilson',
    inspectionDate: '2024-12-18',
    approved: false
  },
  {
    id: 'qci-003',
    vehicleId: 'VEH-2024-005',
    vehicleModel: 'EV-Compact',
    inspectionType: 'performance',
    result: 'pass',
    inspector: 'Michael Rodriguez',
    inspectionDate: '2024-12-16',
    approved: true
  },
  {
    id: 'qci-004',
    vehicleId: 'VEH-2024-007',
    vehicleModel: 'EV-SUV',
    inspectionType: 'safety',
    result: 'pass',
    inspector: 'James Wilson',
    inspectionDate: '2024-12-16',
    approved: true
  },
  {
    id: 'qci-005',
    vehicleId: 'VEH-2024-003',
    vehicleModel: 'EV-SUV',
    inspectionType: 'visual',
    result: 'fail',
    defectDescription: 'Paint defect on driver side door panel - minor scratch marks',
    inspector: 'Michael Rodriguez',
    inspectionDate: '2024-12-17',
    approved: false
  },
  {
    id: 'qci-006',
    vehicleId: 'VEH-2024-008',
    vehicleModel: 'EV-Sedan',
    inspectionType: 'electrical',
    result: 'pass',
    inspector: 'James Wilson',
    inspectionDate: '2024-12-18',
    approved: true
  },
  {
    id: 'qci-007',
    vehicleId: 'VEH-2024-009',
    vehicleModel: 'EV-Premium',
    inspectionType: 'performance',
    result: 'pass',
    inspector: 'Michael Rodriguez',
    inspectionDate: '2024-12-17',
    approved: true
  },
  {
    id: 'qci-008',
    vehicleId: 'VEH-2024-010',
    vehicleModel: 'EV-Compact',
    inspectionType: 'safety',
    result: 'fail',
    defectDescription: 'Airbag warning light malfunction in dashboard display',
    inspector: 'James Wilson',
    inspectionDate: '2024-12-18',
    approved: false
  }
];

// Production Costs
export const mockProductionCosts: ProductionCost[] = [
  {
    id: 'cost-001',
    vehicleModel: 'EV-Compact',
    vehicleId: 'VEH-2024-001',
    materialCost: 15800,
    laborCost: 3200,
    overheadCost: 2100,
    totalCost: 21100,
    calculatedAt: '2024-12-17'
  },
  {
    id: 'cost-002',
    vehicleModel: 'EV-Sedan',
    vehicleId: 'VEH-2024-002',
    materialCost: 22400,
    laborCost: 4100,
    overheadCost: 2800,
    totalCost: 29300,
    calculatedAt: '2024-12-17'
  },
  {
    id: 'cost-003',
    vehicleModel: 'EV-SUV',
    vehicleId: 'VEH-2024-003',
    materialCost: 28600,
    laborCost: 5200,
    overheadCost: 3500,
    totalCost: 37300,
    calculatedAt: '2024-12-18'
  },
  {
    id: 'cost-004',
    vehicleModel: 'EV-Premium',
    vehicleId: 'VEH-2024-004',
    materialCost: 35200,
    laborCost: 6800,
    overheadCost: 4500,
    totalCost: 46500,
    calculatedAt: '2024-12-18'
  },
  {
    id: 'cost-005',
    vehicleModel: 'EV-Compact',
    vehicleId: 'VEH-2024-005',
    materialCost: 15600,
    laborCost: 3100,
    overheadCost: 2050,
    totalCost: 20750,
    calculatedAt: '2024-12-16'
  }
];

// Performance Metrics
export const mockPerformanceMetrics: PerformanceMetric[] = [
  { id: 'pm-001', date: '2024-12-12', efficiency: 92.5, productivity: 87.3, qualityRate: 97.8, vehiclesProduced: 145, defectCount: 3 },
  { id: 'pm-002', date: '2024-12-13', efficiency: 88.2, productivity: 85.1, qualityRate: 96.2, vehiclesProduced: 138, defectCount: 5 },
  { id: 'pm-003', date: '2024-12-14', efficiency: 94.1, productivity: 89.5, qualityRate: 98.1, vehiclesProduced: 152, defectCount: 3 },
  { id: 'pm-004', date: '2024-12-15', efficiency: 91.8, productivity: 86.7, qualityRate: 97.5, vehiclesProduced: 148, defectCount: 4 },
  { id: 'pm-005', date: '2024-12-16', efficiency: 93.2, productivity: 88.9, qualityRate: 98.4, vehiclesProduced: 155, defectCount: 2 },
  { id: 'pm-006', date: '2024-12-17', efficiency: 89.6, productivity: 84.2, qualityRate: 96.8, vehiclesProduced: 142, defectCount: 4 },
  { id: 'pm-007', date: '2024-12-18', efficiency: 95.3, productivity: 91.2, qualityRate: 98.6, vehiclesProduced: 158, defectCount: 2 }
];

// Dashboard Summary Data
export const dashboardSummary = {
  totalVehiclesProduced: 1247,
  pendingOrders: 23,
  lowStockAlerts: 3,
  defectRate: 3.2,
  totalProductionCost: 28450000,
  avgCostPerVehicle: 22820,
  activeProductionLines: 4,
  totalWorkers: 156
};

// Production Trend for Charts
export const productionTrend = [
  { date: 'Dec 12', produced: 145, target: 150 },
  { date: 'Dec 13', produced: 138, target: 145 },
  { date: 'Dec 14', produced: 152, target: 150 },
  { date: 'Dec 15', produced: 148, target: 148 },
  { date: 'Dec 16', produced: 155, target: 152 },
  { date: 'Dec 17', produced: 142, target: 150 },
  { date: 'Dec 18', produced: 158, target: 155 }
];

// Vehicle Model Production Distribution
export const vehicleModelDistribution = [
  { name: 'EV-Compact', value: 420, fill: '#2563EB' },
  { name: 'EV-Sedan', value: 358, fill: '#16A34A' },
  { name: 'EV-SUV', value: 312, fill: '#D97706' },
  { name: 'EV-Premium', value: 157, fill: '#DC2626' }
];

// Production Status Distribution
export const productionStatusDistribution = [
  { name: 'Completed', value: 856, fill: '#16A34A' },
  { name: 'In Progress', value: 167, fill: '#2563EB' },
  { name: 'Pending', value: 80, fill: '#D97706' }
];

// Cost Breakdown by Category
export const costBreakdown = [
  { name: 'Material', value: 68, fill: '#2563EB' },
  { name: 'Labor', value: 18, fill: '#16A34A' },
  { name: 'Overhead', value: 14, fill: '#D97706' }
];

// Recent Activities
export const recentActivities = [
  { id: 1, action: 'Production completed', details: 'EV-Compact batch #1247 finished', time: '10 minutes ago', type: 'success' },
  { id: 2, action: 'Quality inspection', details: 'VEH-2024-002 failed electrical test', time: '25 minutes ago', type: 'warning' },
  { id: 3, action: 'Inventory alert', details: 'Battery Management System below minimum stock', time: '1 hour ago', type: 'error' },
  { id: 4, action: 'New schedule created', details: 'Weekly production for EV-SUV started', time: '2 hours ago', type: 'info' },
  { id: 5, action: 'Assembly completed', details: 'VEH-2024-007 powertrain assembly done', time: '3 hours ago', type: 'success' },
  { id: 6, action: 'Cost calculated', details: 'EV-Premium cost analysis updated', time: '4 hours ago', type: 'info' }
];

// Machine List
export const machineList = [
  'Assembly Line A',
  'Assembly Line B',
  'Assembly Line C',
  'Assembly Line D',
  'Assembly Line E',
  'Assembly Line F',
  'Paint Booth 1',
  'Paint Booth 2',
  'Testing Station 1',
  'Testing Station 2'
];

// Tech Teams
export const techTeams = ['Tech Team A', 'Tech Team B', 'Tech Team C', 'Tech Team D'];

// Vehicle Models
export const vehicleModels = ['EV-Compact', 'EV-Sedan', 'EV-SUV', 'EV-Premium'];
