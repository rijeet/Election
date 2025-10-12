import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PartyAlliance from '@/models/PartyAlliance';

// GET - Fetch single party alliance by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const alliance = await PartyAlliance.findById(id).lean();
    
    if (!alliance) {
      return NextResponse.json(
        { success: false, error: 'Party alliance not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: alliance
    });
  } catch (error) {
    console.error('Error fetching party alliance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch party alliance' },
      { status: 500 }
    );
  }
}

// PUT - Update party alliance
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    
    const alliance = await PartyAlliance.findByIdAndUpdate(
      id,
      { ...body, updated_at: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!alliance) {
      return NextResponse.json(
        { success: false, error: 'Party alliance not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: alliance,
      message: 'Party alliance updated successfully'
    });
  } catch (error) {
    console.error('Error updating party alliance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update party alliance' },
      { status: 500 }
    );
  }
}

// DELETE - Delete party alliance
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    const alliance = await PartyAlliance.findByIdAndDelete(id);
    
    if (!alliance) {
      return NextResponse.json(
        { success: false, error: 'Party alliance not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Party alliance deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting party alliance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete party alliance' },
      { status: 500 }
    );
  }
}
