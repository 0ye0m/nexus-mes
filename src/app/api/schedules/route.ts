import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';


// GET all schedules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    const schedules = await db.productionSchedule.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Parse assignedMachines from JSON string
    const parsedSchedules = schedules.map(schedule => ({
      ...schedule,
      assignedMachines: JSON.parse(schedule.assignedMachines),
    }));

    return NextResponse.json({ schedules: parsedSchedules });
  } catch (error) {
    console.error('Get schedules error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}

// POST create new schedule
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      vehicleModel,
      scheduleType,
      targetQuantity,
      completedQuantity,
      startDate,
      endDate,
      assignedMachines,
      assignedLabor,
      status,
    } = data;

    if (!vehicleModel || !startDate || !targetQuantity) {
      return NextResponse.json(
        { success: false, message: 'Vehicle model, start date, and target quantity are required' },
        { status: 400 }
      );
    }

    const schedule = await db.productionSchedule.create({
      data: {
        vehicleModel,
        scheduleType: scheduleType || 'daily',
        targetQuantity: parseInt(targetQuantity) || 0,
        completedQuantity: parseInt(completedQuantity) || 0,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        assignedMachines: JSON.stringify(assignedMachines || []),
        assignedLabor: parseInt(assignedLabor) || 0,
        status: status || 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Schedule created successfully',
      schedule: {
        ...schedule,
        assignedMachines: JSON.parse(schedule.assignedMachines),
      },
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create schedule' },
      { status: 500 }
    );
  }
}
