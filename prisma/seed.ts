import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.activity.deleteMany();
  await prisma.performanceMetric.deleteMany();
  await prisma.productionCost.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.assembly.deleteMany();
  await prisma.productionSchedule.deleteMany();
  await prisma.material.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.mitchell@evmanufacturing.com',
        name: 'John Mitchell',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah.chen@evmanufacturing.com',
        name: 'Sarah Chen',
        password: hashedPassword,
        role: 'production_manager',
        status: 'active',
      },
    }),
    prisma.user.create({
      data: {
        email: 'michael.rodriguez@evmanufacturing.com',
        name: 'Michael Rodriguez',
        password: hashedPassword,
        role: 'quality_inspector',
        status: 'active',
      },
    }),
    prisma.user.create({
      data: {
        email: 'emily.watson@evmanufacturing.com',
        name: 'Emily Watson',
        password: hashedPassword,
        role: 'production_manager',
        status: 'active',
      },
    }),
    prisma.user.create({
      data: {
        email: 'david.kim@evmanufacturing.com',
        name: 'David Kim',
        password: hashedPassword,
        role: 'quality_inspector',
        status: 'inactive',
      },
    }),
    prisma.user.create({
      data: {
        email: 'lisa.thompson@evmanufacturing.com',
        name: 'Lisa Thompson',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      },
    }),
    prisma.user.create({
      data: {
        email: 'james.wilson@evmanufacturing.com',
        name: 'James Wilson',
        password: hashedPassword,
        role: 'quality_inspector',
        status: 'active',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create Materials
  const materials = await Promise.all([
    prisma.material.create({
      data: {
        name: 'Li-ion Battery Pack 60kWh',
        sku: 'BAT-LI-60K',
        category: 'battery',
        quantity: 245,
        unit: 'units',
        minStock: 100,
        unitCost: 8500,
        supplier: 'LG Energy Solution',
        supplierContact: 'procurement@lgensol.com',
      },
    }),
    prisma.material.create({
      data: {
        name: 'Li-ion Battery Pack 80kWh',
        sku: 'BAT-LI-80K',
        category: 'battery',
        quantity: 85,
        unit: 'units',
        minStock: 80,
        unitCost: 12000,
        supplier: 'CATL',
        supplierContact: 'supply@catl.com',
      },
    }),
    prisma.material.create({
      data: {
        name: 'Li-ion Battery Pack 40kWh',
        sku: 'BAT-LI-40K',
        category: 'battery',
        quantity: 190,
        unit: 'units',
        minStock: 80,
        unitCost: 5500,
        supplier: 'Panasonic',
        supplierContact: 'ev@panasonic.com',
      },
    }),
    prisma.material.create({
      data: {
        name: 'Electric Motor 150kW',
        sku: 'MOT-150KW',
        category: 'motor',
        quantity: 320,
        unit: 'units',
        minStock: 150,
        unitCost: 4200,
        supplier: 'Bosch',
        supplierContact: 'automotive@bosch.com',
      },
    }),
    prisma.material.create({
      data: {
        name: 'Electric Motor 200kW',
        sku: 'MOT-200KW',
        category: 'motor',
        quantity: 45,
        unit: 'units',
        minStock: 50,
        unitCost: 5800,
        supplier: 'Nidec',
        supplierContact: 'sales@nidec.com',
      },
    }),
    prisma.material.create({
      data: {
        name: 'Electric Motor 100kW',
        sku: 'MOT-100KW',
        category: 'motor',
        quantity: 275,
        unit: 'units',
        minStock: 120,
        unitCost: 3100,
        supplier: 'Bosch',
        supplierContact: 'automotive@bosch.com',
      },
    }),
    prisma.material.create({
      data: {
        name: 'Motor Controller Unit',
        sku: 'CTRL-MCU-01',
        category: 'controller',
        quantity: 410,
        unit: 'units',
        minStock: 200,
        unitCost: 1850,
        supplier: 'BorgWarner',
        supplierContact: 'powertrain@borgwarner.com',
      },
    }),
    prisma.material.create({
      data: {
        name: 'Vehicle Chassis Frame',
        sku: 'CHS-FRAME-01',
        category: 'chassis',
        quantity: 180,
        unit: 'units',
        minStock: 100,
        unitCost: 3200,
        supplier: 'Magna International',
        supplierContact: 'structures@magna.com',
      },
    }),
    prisma.material.create({
      data: {
        name: 'All-Season Tires 19"',
        sku: 'TIRE-19-AS',
        category: 'tires',
        quantity: 720,
        unit: 'units',
        minStock: 400,
        unitCost: 180,
        supplier: 'Michelin',
        supplierContact: 'fleet@michelin.com',
      },
    }),
    prisma.material.create({
      data: {
        name: 'Premium Leather Seats',
        sku: 'INT-SEAT-PL',
        category: 'interior',
        quantity: 95,
        unit: 'sets',
        minStock: 80,
        unitCost: 2400,
        supplier: 'Adient',
        supplierContact: 'seating@adient.com',
      },
    }),
    prisma.material.create({
      data: {
        name: 'Infotainment Display 15"',
        sku: 'ELEC-INF-15',
        category: 'electronics',
        quantity: 280,
        unit: 'units',
        minStock: 120,
        unitCost: 950,
        supplier: 'Panasonic Automotive',
        supplierContact: 'infotainment@panasonic.com',
      },
    }),
    prisma.material.create({
      data: {
        name: 'Battery Management System',
        sku: 'ELEC-BMS-01',
        category: 'electronics',
        quantity: 38,
        unit: 'units',
        minStock: 100,
        unitCost: 1200,
        supplier: 'NXP Semiconductors',
        supplierContact: 'auto@nxp.com',
      },
    }),
  ]);

  console.log(`✅ Created ${materials.length} materials`);

  // Create Production Schedules
  const schedules = await Promise.all([
    prisma.productionSchedule.create({
      data: {
        vehicleModel: 'EV-Compact',
        scheduleType: 'daily',
        targetQuantity: 45,
        completedQuantity: 42,
        startDate: new Date('2024-12-18'),
        endDate: new Date('2024-12-18'),
        assignedMachines: JSON.stringify(['Assembly Line A', 'Assembly Line B']),
        assignedLabor: 28,
        status: 'in_progress',
      },
    }),
    prisma.productionSchedule.create({
      data: {
        vehicleModel: 'EV-Sedan',
        scheduleType: 'daily',
        targetQuantity: 35,
        completedQuantity: 35,
        startDate: new Date('2024-12-17'),
        endDate: new Date('2024-12-17'),
        assignedMachines: JSON.stringify(['Assembly Line C']),
        assignedLabor: 22,
        status: 'completed',
      },
    }),
    prisma.productionSchedule.create({
      data: {
        vehicleModel: 'EV-SUV',
        scheduleType: 'weekly',
        targetQuantity: 180,
        completedQuantity: 125,
        startDate: new Date('2024-12-16'),
        endDate: new Date('2024-12-22'),
        assignedMachines: JSON.stringify(['Assembly Line D', 'Assembly Line E']),
        assignedLabor: 45,
        status: 'in_progress',
      },
    }),
    prisma.productionSchedule.create({
      data: {
        vehicleModel: 'EV-Premium',
        scheduleType: 'monthly',
        targetQuantity: 80,
        completedQuantity: 0,
        startDate: new Date('2024-12-23'),
        endDate: new Date('2024-12-31'),
        assignedMachines: JSON.stringify(['Assembly Line F']),
        assignedLabor: 18,
        status: 'pending',
      },
    }),
    prisma.productionSchedule.create({
      data: {
        vehicleModel: 'EV-Compact',
        scheduleType: 'daily',
        targetQuantity: 50,
        completedQuantity: 50,
        startDate: new Date('2024-12-16'),
        endDate: new Date('2024-12-16'),
        assignedMachines: JSON.stringify(['Assembly Line A']),
        assignedLabor: 30,
        status: 'completed',
      },
    }),
    prisma.productionSchedule.create({
      data: {
        vehicleModel: 'EV-Sedan',
        scheduleType: 'weekly',
        targetQuantity: 200,
        completedQuantity: 178,
        startDate: new Date('2024-12-09'),
        endDate: new Date('2024-12-15'),
        assignedMachines: JSON.stringify(['Assembly Line C', 'Assembly Line D']),
        assignedLabor: 52,
        status: 'completed',
      },
    }),
  ]);

  console.log(`✅ Created ${schedules.length} production schedules`);

  // Create Assemblies
  const assemblies = await Promise.all([
    prisma.assembly.create({
      data: {
        vehicleId: 'VEH-2024-001',
        vehicleModel: 'EV-Compact',
        batteryType: 'Li-ion 40kWh',
        motorSpec: '100kW',
        controllerModel: 'BorgWarner MCU-100',
        status: 'completed',
        assemblyStartDate: new Date('2024-12-16'),
        completionDate: new Date('2024-12-17'),
        assembledBy: 'Tech Team A',
      },
    }),
    prisma.assembly.create({
      data: {
        vehicleId: 'VEH-2024-002',
        vehicleModel: 'EV-Sedan',
        batteryType: 'Li-ion 60kWh',
        motorSpec: '150kW',
        controllerModel: 'BorgWarner MCU-150',
        status: 'testing',
        assemblyStartDate: new Date('2024-12-17'),
        assembledBy: 'Tech Team B',
      },
    }),
    prisma.assembly.create({
      data: {
        vehicleId: 'VEH-2024-003',
        vehicleModel: 'EV-SUV',
        batteryType: 'Li-ion 80kWh',
        motorSpec: '200kW',
        controllerModel: 'BorgWarner MCU-200',
        status: 'in_assembly',
        assemblyStartDate: new Date('2024-12-18'),
        assembledBy: 'Tech Team A',
      },
    }),
    prisma.assembly.create({
      data: {
        vehicleId: 'VEH-2024-004',
        vehicleModel: 'EV-Premium',
        batteryType: 'Li-ion 80kWh',
        motorSpec: '200kW',
        controllerModel: 'BorgWarner MCU-200P',
        status: 'in_assembly',
        assemblyStartDate: new Date('2024-12-18'),
        assembledBy: 'Tech Team C',
      },
    }),
    prisma.assembly.create({
      data: {
        vehicleId: 'VEH-2024-005',
        vehicleModel: 'EV-Compact',
        batteryType: 'Li-ion 40kWh',
        motorSpec: '100kW',
        controllerModel: 'BorgWarner MCU-100',
        status: 'completed',
        assemblyStartDate: new Date('2024-12-15'),
        completionDate: new Date('2024-12-16'),
        assembledBy: 'Tech Team B',
      },
    }),
    prisma.assembly.create({
      data: {
        vehicleId: 'VEH-2024-006',
        vehicleModel: 'EV-Sedan',
        batteryType: 'Li-ion 60kWh',
        motorSpec: '150kW',
        controllerModel: 'BorgWarner MCU-150',
        status: 'testing',
        assemblyStartDate: new Date('2024-12-17'),
        assembledBy: 'Tech Team A',
      },
    }),
    prisma.assembly.create({
      data: {
        vehicleId: 'VEH-2024-007',
        vehicleModel: 'EV-SUV',
        batteryType: 'Li-ion 80kWh',
        motorSpec: '200kW',
        controllerModel: 'BorgWarner MCU-200',
        status: 'completed',
        assemblyStartDate: new Date('2024-12-14'),
        completionDate: new Date('2024-12-16'),
        assembledBy: 'Tech Team C',
      },
    }),
  ]);

  console.log(`✅ Created ${assemblies.length} assemblies`);

  // Create Inspections
  const inspections = await Promise.all([
    prisma.inspection.create({
      data: {
        vehicleId: 'VEH-2024-001',
        vehicleModel: 'EV-Compact',
        inspectionType: 'visual',
        result: 'pass',
        inspector: 'Michael Rodriguez',
        inspectionDate: new Date('2024-12-17'),
        approved: true,
      },
    }),
    prisma.inspection.create({
      data: {
        vehicleId: 'VEH-2024-002',
        vehicleModel: 'EV-Sedan',
        inspectionType: 'electrical',
        result: 'fail',
        defectDescription: 'Battery management system communication error detected during initialization sequence',
        inspector: 'James Wilson',
        inspectionDate: new Date('2024-12-18'),
        approved: false,
      },
    }),
    prisma.inspection.create({
      data: {
        vehicleId: 'VEH-2024-005',
        vehicleModel: 'EV-Compact',
        inspectionType: 'performance',
        result: 'pass',
        inspector: 'Michael Rodriguez',
        inspectionDate: new Date('2024-12-16'),
        approved: true,
      },
    }),
    prisma.inspection.create({
      data: {
        vehicleId: 'VEH-2024-007',
        vehicleModel: 'EV-SUV',
        inspectionType: 'safety',
        result: 'pass',
        inspector: 'James Wilson',
        inspectionDate: new Date('2024-12-16'),
        approved: true,
      },
    }),
    prisma.inspection.create({
      data: {
        vehicleId: 'VEH-2024-003',
        vehicleModel: 'EV-SUV',
        inspectionType: 'visual',
        result: 'fail',
        defectDescription: 'Paint defect on driver side door panel - minor scratch marks',
        inspector: 'Michael Rodriguez',
        inspectionDate: new Date('2024-12-17'),
        approved: false,
      },
    }),
    prisma.inspection.create({
      data: {
        vehicleId: 'VEH-2024-008',
        vehicleModel: 'EV-Sedan',
        inspectionType: 'electrical',
        result: 'pass',
        inspector: 'James Wilson',
        inspectionDate: new Date('2024-12-18'),
        approved: true,
      },
    }),
    prisma.inspection.create({
      data: {
        vehicleId: 'VEH-2024-009',
        vehicleModel: 'EV-Premium',
        inspectionType: 'performance',
        result: 'pass',
        inspector: 'Michael Rodriguez',
        inspectionDate: new Date('2024-12-17'),
        approved: true,
      },
    }),
    prisma.inspection.create({
      data: {
        vehicleId: 'VEH-2024-010',
        vehicleModel: 'EV-Compact',
        inspectionType: 'safety',
        result: 'fail',
        defectDescription: 'Airbag warning light malfunction in dashboard display',
        inspector: 'James Wilson',
        inspectionDate: new Date('2024-12-18'),
        approved: false,
      },
    }),
  ]);

  console.log(`✅ Created ${inspections.length} inspections`);

  // Create Production Costs
  const costs = await Promise.all([
    prisma.productionCost.create({
      data: {
        vehicleId: 'VEH-2024-001',
        vehicleModel: 'EV-Compact',
        materialCost: 15800,
        laborCost: 3200,
        overheadCost: 2100,
        totalCost: 21100,
        calculatedAt: new Date('2024-12-17'),
      },
    }),
    prisma.productionCost.create({
      data: {
        vehicleId: 'VEH-2024-002',
        vehicleModel: 'EV-Sedan',
        materialCost: 22400,
        laborCost: 4100,
        overheadCost: 2800,
        totalCost: 29300,
        calculatedAt: new Date('2024-12-17'),
      },
    }),
    prisma.productionCost.create({
      data: {
        vehicleId: 'VEH-2024-003',
        vehicleModel: 'EV-SUV',
        materialCost: 28600,
        laborCost: 5200,
        overheadCost: 3500,
        totalCost: 37300,
        calculatedAt: new Date('2024-12-18'),
      },
    }),
    prisma.productionCost.create({
      data: {
        vehicleId: 'VEH-2024-004',
        vehicleModel: 'EV-Premium',
        materialCost: 35200,
        laborCost: 6800,
        overheadCost: 4500,
        totalCost: 46500,
        calculatedAt: new Date('2024-12-18'),
      },
    }),
    prisma.productionCost.create({
      data: {
        vehicleId: 'VEH-2024-005',
        vehicleModel: 'EV-Compact',
        materialCost: 15600,
        laborCost: 3100,
        overheadCost: 2050,
        totalCost: 20750,
        calculatedAt: new Date('2024-12-16'),
      },
    }),
  ]);

  console.log(`✅ Created ${costs.length} production costs`);

  // Create Performance Metrics
  const metrics = await Promise.all([
    prisma.performanceMetric.create({
      data: {
        date: new Date('2024-12-12'),
        efficiency: 92.5,
        productivity: 87.3,
        qualityRate: 97.8,
        vehiclesProduced: 145,
        defectCount: 3,
      },
    }),
    prisma.performanceMetric.create({
      data: {
        date: new Date('2024-12-13'),
        efficiency: 88.2,
        productivity: 85.1,
        qualityRate: 96.2,
        vehiclesProduced: 138,
        defectCount: 5,
      },
    }),
    prisma.performanceMetric.create({
      data: {
        date: new Date('2024-12-14'),
        efficiency: 94.1,
        productivity: 89.5,
        qualityRate: 98.1,
        vehiclesProduced: 152,
        defectCount: 3,
      },
    }),
    prisma.performanceMetric.create({
      data: {
        date: new Date('2024-12-15'),
        efficiency: 91.8,
        productivity: 86.7,
        qualityRate: 97.5,
        vehiclesProduced: 148,
        defectCount: 4,
      },
    }),
    prisma.performanceMetric.create({
      data: {
        date: new Date('2024-12-16'),
        efficiency: 93.2,
        productivity: 88.9,
        qualityRate: 98.4,
        vehiclesProduced: 155,
        defectCount: 2,
      },
    }),
    prisma.performanceMetric.create({
      data: {
        date: new Date('2024-12-17'),
        efficiency: 89.6,
        productivity: 84.2,
        qualityRate: 96.8,
        vehiclesProduced: 142,
        defectCount: 4,
      },
    }),
    prisma.performanceMetric.create({
      data: {
        date: new Date('2024-12-18'),
        efficiency: 95.3,
        productivity: 91.2,
        qualityRate: 98.6,
        vehiclesProduced: 158,
        defectCount: 2,
      },
    }),
  ]);

  console.log(`✅ Created ${metrics.length} performance metrics`);

  // Create Activities
  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        action: 'Production completed',
        details: 'EV-Compact batch #1247 finished',
        type: 'success',
      },
    }),
    prisma.activity.create({
      data: {
        action: 'Quality inspection',
        details: 'VEH-2024-002 failed electrical test',
        type: 'warning',
      },
    }),
    prisma.activity.create({
      data: {
        action: 'Inventory alert',
        details: 'Battery Management System below minimum stock',
        type: 'error',
      },
    }),
    prisma.activity.create({
      data: {
        action: 'New schedule created',
        details: 'Weekly production for EV-SUV started',
        type: 'info',
      },
    }),
    prisma.activity.create({
      data: {
        action: 'Assembly completed',
        details: 'VEH-2024-007 powertrain assembly done',
        type: 'success',
      },
    }),
    prisma.activity.create({
      data: {
        action: 'Cost calculated',
        details: 'EV-Premium cost analysis updated',
        type: 'info',
      },
    }),
  ]);

  console.log(`✅ Created ${activities.length} activities`);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
