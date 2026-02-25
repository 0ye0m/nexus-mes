import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';


// PUT update assembly
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const updateData: Record<string, unknown> = {};
    if (data.vehicleModel) updateData.vehicleModel = data.vehicleModel;
    if (data.batteryType) updateData.batteryType = data.batteryType;
    if (data.motorSpec) updateData.motorSpec = data.motorSpec;
    if (data.controllerModel) updateData.controllerModel = data.controllerModel;
    if (data.status) {
      updateData.status = data.status;
      if (data.status === 'completed') {
        updateData.completionDate = new Date();
      }
    }
    if (data.assembledBy) updateData.assembledBy = data.assembledBy;

    const assembly = await db.assembly.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Assembly updated successfully',
      assembly,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update assembly' },
      { status: 500 }
    );
  }
}

// DELETE assembly
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.assembly.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Assembly deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete assembly' },
      { status: 500 }
    );
  }
}
