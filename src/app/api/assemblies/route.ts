import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';


// GET all assemblies
export async function GET() {
  try {
    const assemblies = await db.assembly.findMany({
      orderBy: { assemblyStartDate: 'desc' },
    });

    return NextResponse.json({ assemblies });
  } catch (error) {
    console.error('Get assemblies error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch assemblies' },
      { status: 500 }
    );
  }
}

// POST create new assembly
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      vehicleId,
      vehicleModel,
      batteryType,
      motorSpec,
      controllerModel,
      status,
      assembledBy,
    } = data;

    if (!vehicleId || !vehicleModel) {
      return NextResponse.json(
        { success: false, message: 'Vehicle ID and model are required' },
        { status: 400 }
      );
    }

    // Check if vehicleId already exists
    const existingAssembly = await db.assembly.findUnique({
      where: { vehicleId },
    });

    if (existingAssembly) {
      return NextResponse.json(
        { success: false, message: 'Vehicle ID already exists' },
        { status: 400 }
      );
    }

    const assembly = await db.assembly.create({
      data: {
        vehicleId,
        vehicleModel,
        batteryType: batteryType || 'Li-ion 40kWh',
        motorSpec: motorSpec || '100kW',
        controllerModel: controllerModel || 'BorgWarner MCU-100',
        status: status || 'in_assembly',
        assembledBy: assembledBy || 'Tech Team A',
        completionDate: status === 'completed' ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Assembly created successfully',
      assembly,
    });
  } catch (error) {
    console.error('Create assembly error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create assembly' },
      { status: 500 }
    );
  }
}
