import { create } from 'zustand';

type ActiveModule = 'dashboard' | 'users' | 'inventory' | 'production' | 'battery' | 'quality' | 'costs' | 'reports';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
}

interface Material {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  unitCost: number;
  supplier: string;
  supplierContact: string | null;
  lastUpdated: string;
}

interface ProductionSchedule {
  id: string;
  vehicleModel: string;
  scheduleType: string;
  targetQuantity: number;
  completedQuantity: number;
  startDate: string;
  endDate: string | null;
  assignedMachines: string[];
  assignedLabor: number;
  status: string;
  createdAt: string;
}

interface Assembly {
  id: string;
  vehicleId: string;
  vehicleModel: string;
  batteryType: string;
  motorSpec: string;
  controllerModel: string;
  status: string;
  assemblyStartDate: string;
  completionDate: string | null;
  assembledBy: string;
}

interface Inspection {
  id: string;
  vehicleId: string;
  vehicleModel: string;
  inspectionType: string;
  result: string;
  defectDescription: string | null;
  inspector: string;
  inspectionDate: string;
  approved: boolean;
}

interface ProductionCost {
  id: string;
  vehicleId: string;
  vehicleModel: string;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  calculatedAt: string;
}

interface PerformanceMetric {
  id: string;
  date: string;
  efficiency: number;
  productivity: number;
  qualityRate: number;
  vehiclesProduced: number;
  defectCount: number;
}

interface DashboardData {
  summary: {
    totalVehiclesProduced: number;
    pendingOrders: number;
    lowStockAlerts: number;
    defectRate: number;
    totalProductionCost: number;
    avgCostPerVehicle: number;
    activeProductionLines: number;
  };
  activities: Array<{
    id: string;
    action: string;
    details: string;
    type: string;
    createdAt: string;
  }>;
  productionTrend: PerformanceMetric[];
  modelDistribution: Array<{ name: string; value: number }>;
  statusDistribution: Array<{ name: string; value: number }>;
  costBreakdown: { material: number; labor: number; overhead: number };
}

interface AppState {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
  
  // Data
  users: User[];
  materials: Material[];
  schedules: ProductionSchedule[];
  assemblies: Assembly[];
  inspections: Inspection[];
  costs: ProductionCost[];
  metrics: PerformanceMetric[];
  dashboard: DashboardData | null;
  
  // Loading states
  loading: {
    users: boolean;
    materials: boolean;
    schedules: boolean;
    assemblies: boolean;
    inspections: boolean;
    costs: boolean;
    dashboard: boolean;
  };
  
  // Filters
  inventoryFilter: string;
  productionFilter: string;
  qualityFilter: string;
  searchQuery: string;
  
  // Actions
  fetchUsers: () => Promise<void>;
  fetchMaterials: (category?: string, search?: string) => Promise<void>;
  fetchSchedules: (status?: string) => Promise<void>;
  fetchAssemblies: () => Promise<void>;
  fetchInspections: (result?: string) => Promise<void>;
  fetchCosts: () => Promise<void>;
  fetchMetrics: () => Promise<void>;
  fetchDashboard: () => Promise<void>;
  
  setInventoryFilter: (filter: string) => void;
  setProductionFilter: (filter: string) => void;
  setQualityFilter: (filter: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeModule: 'dashboard',
  setActiveModule: (module) => set({ activeModule: module }),
  
  users: [],
  materials: [],
  schedules: [],
  assemblies: [],
  inspections: [],
  costs: [],
  metrics: [],
  dashboard: null,
  
  loading: {
    users: false,
    materials: false,
    schedules: false,
    assemblies: false,
    inspections: false,
    costs: false,
    dashboard: false,
  },
  
  inventoryFilter: 'all',
  productionFilter: 'all',
  qualityFilter: 'all',
  searchQuery: '',
  
  fetchUsers: async () => {
    set({ loading: { ...get().loading, users: true } });
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      set({ users: data.users || [], loading: { ...get().loading, users: false } });
    } catch {
      set({ loading: { ...get().loading, users: false } });
    }
  },
  
  fetchMaterials: async (category?, search?) => {
    set({ loading: { ...get().loading, materials: true } });
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      const res = await fetch(`/api/materials?${params}`);
      const data = await res.json();
      set({ materials: data.materials || [], loading: { ...get().loading, materials: false } });
    } catch {
      set({ loading: { ...get().loading, materials: false } });
    }
  },
  
  fetchSchedules: async (status?) => {
    set({ loading: { ...get().loading, schedules: true } });
    try {
      const params = new URLSearchParams();
      if (status && status !== 'all') params.append('status', status);
      const res = await fetch(`/api/schedules?${params}`);
      const data = await res.json();
      set({ schedules: data.schedules || [], loading: { ...get().loading, schedules: false } });
    } catch {
      set({ loading: { ...get().loading, schedules: false } });
    }
  },
  
  fetchAssemblies: async () => {
    set({ loading: { ...get().loading, assemblies: true } });
    try {
      const res = await fetch('/api/assemblies');
      const data = await res.json();
      set({ assemblies: data.assemblies || [], loading: { ...get().loading, assemblies: false } });
    } catch {
      set({ loading: { ...get().loading, assemblies: false } });
    }
  },
  
  fetchInspections: async (result?) => {
    set({ loading: { ...get().loading, inspections: true } });
    try {
      const params = new URLSearchParams();
      if (result && result !== 'all') params.append('result', result);
      const res = await fetch(`/api/inspections?${params}`);
      const data = await res.json();
      set({ inspections: data.inspections || [], loading: { ...get().loading, inspections: false } });
    } catch {
      set({ loading: { ...get().loading, inspections: false } });
    }
  },
  
  fetchCosts: async () => {
    set({ loading: { ...get().loading, costs: true } });
    try {
      const res = await fetch('/api/costs');
      const data = await res.json();
      set({ costs: data.costs || [], loading: { ...get().loading, costs: false } });
    } catch {
      set({ loading: { ...get().loading, costs: false } });
    }
  },
  
  fetchMetrics: async () => {
    try {
      const res = await fetch('/api/metrics');
      const data = await res.json();
      set({ metrics: data.metrics || [] });
    } catch {}
  },
  
  fetchDashboard: async () => {
    set({ loading: { ...get().loading, dashboard: true } });
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      set({ dashboard: data, loading: { ...get().loading, dashboard: false } });
    } catch {
      set({ loading: { ...get().loading, dashboard: false } });
    }
  },
  
  setInventoryFilter: (filter) => set({ inventoryFilter: filter }),
  setProductionFilter: (filter) => set({ productionFilter: filter }),
  setQualityFilter: (filter) => set({ qualityFilter: filter }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
