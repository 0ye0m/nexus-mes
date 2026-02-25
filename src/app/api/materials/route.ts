import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';


// GET all materials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let where: any = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { supplier: { contains: search, mode: 'insensitive' } },
      ];
    }

    const materials = await db.material.findMany({
      where,
      orderBy: { lastUpdated: 'desc' },
    });

    return NextResponse.json({ materials });
  } catch (error) {
    console.error('Get materials error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

// POST create new material
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, sku, category, quantity, unit, minStock, unitCost, supplier, supplierContact } = data;

    if (!name || !sku || !supplier) {
      return NextResponse.json(
        { success: false, message: 'Name, SKU, and supplier are required' },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingMaterial = await db.material.findUnique({
      where: { sku },
    });

    if (existingMaterial) {
      return NextResponse.json(
        { success: false, message: 'SKU already exists' },
        { status: 400 }
      );
    }

    const material = await db.material.create({
      data: {
        name,
        sku,
        category: category || 'electronics',
        quantity: parseInt(quantity) || 0,
        unit: unit || 'units',
        minStock: parseInt(minStock) || 0,
        unitCost: parseFloat(unitCost) || 0,
        supplier,
        supplierContact: supplierContact || '',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Material created successfully',
      material,
    });
  } catch (error) {
    console.error('Create material error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create material' },
      { status: 500 }
    );
  }
}
