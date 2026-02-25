import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';


// PUT update material
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const updateData: Record<string, unknown> = {};
    if (data.name) updateData.name = data.name;
    if (data.category) updateData.category = data.category;
    if (data.quantity !== undefined) updateData.quantity = parseInt(data.quantity);
    if (data.unit) updateData.unit = data.unit;
    if (data.minStock !== undefined) updateData.minStock = parseInt(data.minStock);
    if (data.unitCost !== undefined) updateData.unitCost = parseFloat(data.unitCost);
    if (data.supplier) updateData.supplier = data.supplier;
    if (data.supplierContact) updateData.supplierContact = data.supplierContact;
    updateData.lastUpdated = new Date();

    const material = await db.material.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Material updated successfully',
      material,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update material' },
      { status: 500 }
    );
  }
}

// DELETE material
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.material.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Material deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete material' },
      { status: 500 }
    );
  }
}
