import { NextResponse } from 'next/server';
import { db } from '@/lib/db';


// GET performance metrics
export async function GET() {
  try {
    const metrics = await db.performanceMetric.findMany({
      orderBy: { date: 'desc' },
      take: 30,
    });

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('Get metrics error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
