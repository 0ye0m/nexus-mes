import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';


// PUT update schedule
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const updateData: Record<string, unknown> = {};
    if (data.vehicleModel) updateData.vehicleModel = data.vehicleModel;
    if (data.scheduleType) updateData.scheduleType = data.scheduleType;
    if (data.targetQuantity !== undefined) updateData.targetQuantity = parseInt(data.targetQuantity);
    if (data.completedQuantity !== undefined) updateData.completedQuantity = parseInt(data.completedQuantity);
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    if (data.assignedMachines) updateData.assignedMachines = JSON.stringify(data.assignedMachines);
    if (data.assignedLabor !== undefined) updateData.assignedLabor = parseInt(data.assignedLabor);
    if (data.status) updateData.status = data.status;

    const schedule = await db.productionSchedule.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Schedule updated successfully',
      schedule: {
        ...schedule,
        assignedMachines: JSON.parse(schedule.assignedMachines),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update schedule' },
      { status: 500 }
    );
  }
}

// DELETE schedule
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.productionSchedule.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Schedule deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete schedule' },
      { status: 500 }
    );
  }
}
