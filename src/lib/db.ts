import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Auto-seed database if no users exist
let isSeeding = false

export async function ensureDatabaseSeeded() {
  if (isSeeding) return
  
  try {
    const userCount = await db.user.count()
    if (userCount === 0) {
      isSeeding = true
      console.log('🌱 Auto-seeding database...')
      await seedDatabase()
      console.log('✅ Database seeded successfully')
    }
  } catch (error) {
    console.error('Database seed check error:', error)
  }
}

async function seedDatabase() {
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  // Create Users
  await db.user.createMany({
    data: [
      { email: 'john.mitchell@evmanufacturing.com', name: 'John Mitchell', password: hashedPassword, role: 'admin', status: 'active' },
      { email: 'sarah.chen@evmanufacturing.com', name: 'Sarah Chen', password: hashedPassword, role: 'production_manager', status: 'active' },
      { email: 'michael.rodriguez@evmanufacturing.com', name: 'Michael Rodriguez', password: hashedPassword, role: 'quality_inspector', status: 'active' },
      { email: 'emily.watson@evmanufacturing.com', name: 'Emily Watson', password: hashedPassword, role: 'production_manager', status: 'active' },
      { email: 'david.kim@evmanufacturing.com', name: 'David Kim', password: hashedPassword, role: 'quality_inspector', status: 'inactive' },
      { email: 'lisa.thompson@evmanufacturing.com', name: 'Lisa Thompson', password: hashedPassword, role: 'admin', status: 'active' },
      { email: 'james.wilson@evmanufacturing.com', name: 'James Wilson', password: hashedPassword, role: 'quality_inspector', status: 'active' },
    ],

  })

  // Create Materials
  await db.material.createMany({
    data: [
      { name: 'Li-ion Battery Pack 60kWh', sku: 'BAT-LI-60K', category: 'battery', quantity: 245, unit: 'units', minStock: 100, unitCost: 8500, supplier: 'LG Energy Solution', supplierContact: 'procurement@lgensol.com' },
      { name: 'Li-ion Battery Pack 80kWh', sku: 'BAT-LI-80K', category: 'battery', quantity: 85, unit: 'units', minStock: 80, unitCost: 12000, supplier: 'CATL', supplierContact: 'supply@catl.com' },
      { name: 'Li-ion Battery Pack 40kWh', sku: 'BAT-LI-40K', category: 'battery', quantity: 190, unit: 'units', minStock: 80, unitCost: 5500, supplier: 'Panasonic', supplierContact: 'ev@panasonic.com' },
      { name: 'Electric Motor 150kW', sku: 'MOT-150KW', category: 'motor', quantity: 320, unit: 'units', minStock: 150, unitCost: 4200, supplier: 'Bosch', supplierContact: 'automotive@bosch.com' },
      { name: 'Electric Motor 200kW', sku: 'MOT-200KW', category: 'motor', quantity: 45, unit: 'units', minStock: 50, unitCost: 5800, supplier: 'Nidec', supplierContact: 'sales@nidec.com' },
      { name: 'Electric Motor 100kW', sku: 'MOT-100KW', category: 'motor', quantity: 275, unit: 'units', minStock: 120, unitCost: 3100, supplier: 'Bosch', supplierContact: 'automotive@bosch.com' },
      { name: 'Motor Controller Unit', sku: 'CTRL-MCU-01', category: 'controller', quantity: 410, unit: 'units', minStock: 200, unitCost: 1850, supplier: 'BorgWarner', supplierContact: 'powertrain@borgwarner.com' },
      { name: 'Vehicle Chassis Frame', sku: 'CHS-FRAME-01', category: 'chassis', quantity: 180, unit: 'units', minStock: 100, unitCost: 3200, supplier: 'Magna International', supplierContact: 'structures@magna.com' },
      { name: 'All-Season Tires 19"', sku: 'TIRE-19-AS', category: 'tires', quantity: 720, unit: 'units', minStock: 400, unitCost: 180, supplier: 'Michelin', supplierContact: 'fleet@michelin.com' },
      { name: 'Premium Leather Seats', sku: 'INT-SEAT-PL', category: 'interior', quantity: 95, unit: 'sets', minStock: 80, unitCost: 2400, supplier: 'Adient', supplierContact: 'seating@adient.com' },
      { name: 'Infotainment Display 15"', sku: 'ELEC-INF-15', category: 'electronics', quantity: 280, unit: 'units', minStock: 120, unitCost: 950, supplier: 'Panasonic Automotive', supplierContact: 'infotainment@panasonic.com' },
      { name: 'Battery Management System', sku: 'ELEC-BMS-01', category: 'electronics', quantity: 38, unit: 'units', minStock: 100, unitCost: 1200, supplier: 'NXP Semiconductors', supplierContact: 'auto@nxp.com' },
    ],

  })

  // Create Production Schedules
  await db.productionSchedule.createMany({
    data: [
      { vehicleModel: 'EV-Compact', scheduleType: 'daily', targetQuantity: 45, completedQuantity: 42, startDate: new Date('2024-12-18'), endDate: new Date('2024-12-18'), assignedMachines: JSON.stringify(['Assembly Line A', 'Assembly Line B']), assignedLabor: 28, status: 'in_progress' },
      { vehicleModel: 'EV-Sedan', scheduleType: 'daily', targetQuantity: 35, completedQuantity: 35, startDate: new Date('2024-12-17'), endDate: new Date('2024-12-17'), assignedMachines: JSON.stringify(['Assembly Line C']), assignedLabor: 22, status: 'completed' },
      { vehicleModel: 'EV-SUV', scheduleType: 'weekly', targetQuantity: 180, completedQuantity: 125, startDate: new Date('2024-12-16'), endDate: new Date('2024-12-22'), assignedMachines: JSON.stringify(['Assembly Line D', 'Assembly Line E']), assignedLabor: 45, status: 'in_progress' },
      { vehicleModel: 'EV-Premium', scheduleType: 'monthly', targetQuantity: 80, completedQuantity: 0, startDate: new Date('2024-12-23'), endDate: new Date('2024-12-31'), assignedMachines: JSON.stringify(['Assembly Line F']), assignedLabor: 18, status: 'pending' },
      { vehicleModel: 'EV-Compact', scheduleType: 'daily', targetQuantity: 50, completedQuantity: 50, startDate: new Date('2024-12-16'), endDate: new Date('2024-12-16'), assignedMachines: JSON.stringify(['Assembly Line A']), assignedLabor: 30, status: 'completed' },
      { vehicleModel: 'EV-Sedan', scheduleType: 'weekly', targetQuantity: 200, completedQuantity: 178, startDate: new Date('2024-12-09'), endDate: new Date('2024-12-15'), assignedMachines: JSON.stringify(['Assembly Line C', 'Assembly Line D']), assignedLabor: 52, status: 'completed' },
    ],

  })

  // Create Assemblies
  await db.assembly.createMany({
    data: [
      { vehicleId: 'VEH-2024-001', vehicleModel: 'EV-Compact', batteryType: 'Li-ion 40kWh', motorSpec: '100kW', controllerModel: 'BorgWarner MCU-100', status: 'completed', assemblyStartDate: new Date('2024-12-16'), completionDate: new Date('2024-12-17'), assembledBy: 'Tech Team A' },
      { vehicleId: 'VEH-2024-002', vehicleModel: 'EV-Sedan', batteryType: 'Li-ion 60kWh', motorSpec: '150kW', controllerModel: 'BorgWarner MCU-150', status: 'testing', assemblyStartDate: new Date('2024-12-17'), assembledBy: 'Tech Team B' },
      { vehicleId: 'VEH-2024-003', vehicleModel: 'EV-SUV', batteryType: 'Li-ion 80kWh', motorSpec: '200kW', controllerModel: 'BorgWarner MCU-200', status: 'in_assembly', assemblyStartDate: new Date('2024-12-18'), assembledBy: 'Tech Team A' },
      { vehicleId: 'VEH-2024-004', vehicleModel: 'EV-Premium', batteryType: 'Li-ion 80kWh', motorSpec: '200kW', controllerModel: 'BorgWarner MCU-200P', status: 'in_assembly', assemblyStartDate: new Date('2024-12-18'), assembledBy: 'Tech Team C' },
      { vehicleId: 'VEH-2024-005', vehicleModel: 'EV-Compact', batteryType: 'Li-ion 40kWh', motorSpec: '100kW', controllerModel: 'BorgWarner MCU-100', status: 'completed', assemblyStartDate: new Date('2024-12-15'), completionDate: new Date('2024-12-16'), assembledBy: 'Tech Team B' },
      { vehicleId: 'VEH-2024-006', vehicleModel: 'EV-Sedan', batteryType: 'Li-ion 60kWh', motorSpec: '150kW', controllerModel: 'BorgWarner MCU-150', status: 'testing', assemblyStartDate: new Date('2024-12-17'), assembledBy: 'Tech Team A' },
      { vehicleId: 'VEH-2024-007', vehicleModel: 'EV-SUV', batteryType: 'Li-ion 80kWh', motorSpec: '200kW', controllerModel: 'BorgWarner MCU-200', status: 'completed', assemblyStartDate: new Date('2024-12-14'), completionDate: new Date('2024-12-16'), assembledBy: 'Tech Team C' },
    ],

  })

  // Create Inspections
  await db.inspection.createMany({
    data: [
      { vehicleId: 'VEH-2024-001', vehicleModel: 'EV-Compact', inspectionType: 'visual', result: 'pass', inspector: 'Michael Rodriguez', inspectionDate: new Date('2024-12-17'), approved: true },
      { vehicleId: 'VEH-2024-002', vehicleModel: 'EV-Sedan', inspectionType: 'electrical', result: 'fail', defectDescription: 'Battery management system communication error detected during initialization sequence', inspector: 'James Wilson', inspectionDate: new Date('2024-12-18'), approved: false },
      { vehicleId: 'VEH-2024-005', vehicleModel: 'EV-Compact', inspectionType: 'performance', result: 'pass', inspector: 'Michael Rodriguez', inspectionDate: new Date('2024-12-16'), approved: true },
      { vehicleId: 'VEH-2024-007', vehicleModel: 'EV-SUV', inspectionType: 'safety', result: 'pass', inspector: 'James Wilson', inspectionDate: new Date('2024-12-16'), approved: true },
      { vehicleId: 'VEH-2024-003', vehicleModel: 'EV-SUV', inspectionType: 'visual', result: 'fail', defectDescription: 'Paint defect on driver side door panel - minor scratch marks', inspector: 'Michael Rodriguez', inspectionDate: new Date('2024-12-17'), approved: false },
      { vehicleId: 'VEH-2024-008', vehicleModel: 'EV-Sedan', inspectionType: 'electrical', result: 'pass', inspector: 'James Wilson', inspectionDate: new Date('2024-12-18'), approved: true },
      { vehicleId: 'VEH-2024-009', vehicleModel: 'EV-Premium', inspectionType: 'performance', result: 'pass', inspector: 'Michael Rodriguez', inspectionDate: new Date('2024-12-17'), approved: true },
      { vehicleId: 'VEH-2024-010', vehicleModel: 'EV-Compact', inspectionType: 'safety', result: 'fail', defectDescription: 'Airbag warning light malfunction in dashboard display', inspector: 'James Wilson', inspectionDate: new Date('2024-12-18'), approved: false },
    ],

  })

  // Create Production Costs
  await db.productionCost.createMany({
    data: [
      { vehicleId: 'VEH-2024-001', vehicleModel: 'EV-Compact', materialCost: 15800, laborCost: 3200, overheadCost: 2100, totalCost: 21100, calculatedAt: new Date('2024-12-17') },
      { vehicleId: 'VEH-2024-002', vehicleModel: 'EV-Sedan', materialCost: 22400, laborCost: 4100, overheadCost: 2800, totalCost: 29300, calculatedAt: new Date('2024-12-17') },
      { vehicleId: 'VEH-2024-003', vehicleModel: 'EV-SUV', materialCost: 28600, laborCost: 5200, overheadCost: 3500, totalCost: 37300, calculatedAt: new Date('2024-12-18') },
      { vehicleId: 'VEH-2024-004', vehicleModel: 'EV-Premium', materialCost: 35200, laborCost: 6800, overheadCost: 4500, totalCost: 46500, calculatedAt: new Date('2024-12-18') },
      { vehicleId: 'VEH-2024-005', vehicleModel: 'EV-Compact', materialCost: 15600, laborCost: 3100, overheadCost: 2050, totalCost: 20750, calculatedAt: new Date('2024-12-16') },
    ],

  })

  // Create Performance Metrics
  await db.performanceMetric.createMany({
    data: [
      { date: new Date('2024-12-12'), efficiency: 92.5, productivity: 87.3, qualityRate: 97.8, vehiclesProduced: 145, defectCount: 3 },
      { date: new Date('2024-12-13'), efficiency: 88.2, productivity: 85.1, qualityRate: 96.2, vehiclesProduced: 138, defectCount: 5 },
      { date: new Date('2024-12-14'), efficiency: 94.1, productivity: 89.5, qualityRate: 98.1, vehiclesProduced: 152, defectCount: 3 },
      { date: new Date('2024-12-15'), efficiency: 91.8, productivity: 86.7, qualityRate: 97.5, vehiclesProduced: 148, defectCount: 4 },
      { date: new Date('2024-12-16'), efficiency: 93.2, productivity: 88.9, qualityRate: 98.4, vehiclesProduced: 155, defectCount: 2 },
      { date: new Date('2024-12-17'), efficiency: 89.6, productivity: 84.2, qualityRate: 96.8, vehiclesProduced: 142, defectCount: 4 },
      { date: new Date('2024-12-18'), efficiency: 95.3, productivity: 91.2, qualityRate: 98.6, vehiclesProduced: 158, defectCount: 2 },
    ],

  })

  // Create Activities
  await db.activity.createMany({
    data: [
      { action: 'Production completed', details: 'EV-Compact batch #1247 finished', type: 'success' },
      { action: 'Quality inspection', details: 'VEH-2024-002 failed electrical test', type: 'warning' },
      { action: 'Inventory alert', details: 'Battery Management System below minimum stock', type: 'error' },
      { action: 'New schedule created', details: 'Weekly production for EV-SUV started', type: 'info' },
      { action: 'Assembly completed', details: 'VEH-2024-007 powertrain assembly done', type: 'success' },
      { action: 'Cost calculated', details: 'EV-Premium cost analysis updated', type: 'info' },
    ],

  })
}