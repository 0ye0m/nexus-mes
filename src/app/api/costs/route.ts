import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';


// GET all production costs
export async function GET() {
  try {
    const costs = await db.productionCost.findMany({
      orderBy: { calculatedAt: 'desc' },
    });

    return NextResponse.json({ costs });
  } catch (error) {
    console.error('Get costs error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch costs' },
      { status: 500 }
    );
  }
}

// POST create new production cost
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      vehicleId,
      vehicleModel,
      materialCost,
      laborCost,
      overheadCost,
    } = data;

    if (!vehicleId) {
      return NextResponse.json(
        { success: false, message: 'Vehicle ID is required' },
        { status: 400 }
      );
    }

    const matCost = parseFloat(materialCost) || 0;
    const labCost = parseFloat(laborCost) || 0;
    const ovCost = parseFloat(overheadCost) || 0;
    const totalCost = matCost + labCost + ovCost;

    const cost = await db.productionCost.create({
      data: {
        vehicleId,
        vehicleModel: vehicleModel || 'EV-Compact',
        materialCost: matCost,
        laborCost: labCost,
        overheadCost: ovCost,
        totalCost,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Production cost recorded successfully',
      cost,
    });
  } catch (error) {
    console.error('Create cost error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create cost' },
      { status: 500 }
    );
  }
}
