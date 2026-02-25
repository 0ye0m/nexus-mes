import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';


// GET all inspections
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const result = searchParams.get('result');

    let where: any = {};

    if (result && result !== 'all') {
      where.result = result;
    }

    const inspections = await db.inspection.findMany({
      where,
      orderBy: { inspectionDate: 'desc' },
    });

    return NextResponse.json({ inspections });
  } catch (error) {
    console.error('Get inspections error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch inspections' },
      { status: 500 }
    );
  }
}

// POST create new inspection
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      vehicleId,
      vehicleModel,
      inspectionType,
      result,
      defectDescription,
      inspector,
    } = data;

    if (!vehicleId || !inspector) {
      return NextResponse.json(
        { success: false, message: 'Vehicle ID and inspector are required' },
        { status: 400 }
      );
    }

    if (result === 'fail' && !defectDescription) {
      return NextResponse.json(
        { success: false, message: 'Defect description is required for failed inspections' },
        { status: 400 }
      );
    }

    const inspection = await db.inspection.create({
      data: {
        vehicleId,
        vehicleModel: vehicleModel || 'EV-Compact',
        inspectionType: inspectionType || 'visual',
        result: result || 'pass',
        defectDescription: result === 'fail' ? defectDescription : null,
        inspector,
        approved: result === 'pass',
      },
    });

    return NextResponse.json({
      success: true,
      message: result === 'pass' ? 'Inspection passed - Auto approved' : 'Inspection recorded - Requires review',
      inspection,
    });
  } catch (error) {
    console.error('Create inspection error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create inspection' },
      { status: 500 }
    );
  }
}
