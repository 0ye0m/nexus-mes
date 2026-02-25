import { NextResponse } from 'next/server';
import { db, ensureDatabaseSeeded } from '@/lib/db';

// GET dashboard statistics
export async function GET() {
  try {
    // Ensure database is seeded
    await ensureDatabaseSeeded();

    // Get total vehicles produced (sum of completed quantities)
    const schedules = await db.productionSchedule.findMany();
    const totalVehiclesProduced = schedules.reduce((sum, s) => sum + s.completedQuantity, 0);

    // Get pending orders
    const pendingOrders = await db.productionSchedule.count({
      where: { status: 'pending' },
    });

    // Get low stock alerts
    const materials = await db.material.findMany();
    const lowStockAlerts = materials.filter(m => m.quantity < m.minStock).length;

    // Get defect rate
    const inspections = await db.inspection.findMany();
    const failedInspections = inspections.filter(i => i.result === 'fail').length;
    const defectRate = inspections.length > 0 
      ? ((failedInspections / inspections.length) * 100).toFixed(1)
      : '0';

    // Get total production cost
    const costs = await db.productionCost.findMany();
    const totalProductionCost = costs.reduce((sum, c) => sum + c.totalCost, 0);
    const avgCostPerVehicle = costs.length > 0 
      ? totalProductionCost / costs.length
      : 0;

    // Get active production lines
    const activeProductionLines = await db.productionSchedule.count({
      where: { status: 'in_progress' },
    });

    // Get recent activities
    const activities = await db.activity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    // Get production trend (last 7 days)
    const last7Days = await db.performanceMetric.findMany({
      take: 7,
      orderBy: { date: 'asc' },
    });

    // Get vehicle model distribution
    const modelDistribution = await db.productionSchedule.groupBy({
      by: ['vehicleModel'],
      _sum: {
        completedQuantity: true,
      },
    });

    // Get status distribution
    const statusDistribution = await db.productionSchedule.groupBy({
      by: ['status'],
      _count: true,
    });

    // Get cost breakdown
    const costBreakdown = await db.productionCost.aggregate({
      _sum: {
        materialCost: true,
        laborCost: true,
        overheadCost: true,
      },
    });

    return NextResponse.json({
      summary: {
        totalVehiclesProduced,
        pendingOrders,
        lowStockAlerts,
        defectRate: parseFloat(defectRate as string),
        totalProductionCost,
        avgCostPerVehicle,
        activeProductionLines,
      },
      activities,
      productionTrend: last7Days,
      modelDistribution: modelDistribution.map(m => ({
        name: m.vehicleModel,
        value: m._sum.completedQuantity || 0,
      })),
      statusDistribution: statusDistribution.map(s => ({
        name: s.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        value: s._count,
      })),
      costBreakdown: {
        material: costBreakdown._sum.materialCost || 0,
        labor: costBreakdown._sum.laborCost || 0,
        overhead: costBreakdown._sum.overheadCost || 0,
      },
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
