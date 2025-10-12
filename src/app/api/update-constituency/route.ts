import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Constituency from '@/models/Constituency';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { constituencyId, ...updateData } = body;
    
    if (!constituencyId) {
      return NextResponse.json(
        { error: 'Constituency ID is required' },
        { status: 400 }
      );
    }
    
    const updatedConstituency = await Constituency.findOneAndUpdate(
      { constituencyId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedConstituency) {
      return NextResponse.json(
        { error: 'Constituency not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Constituency updated successfully',
      constituency: updatedConstituency
    });
  } catch (error) {
    console.error('Error updating constituency:', error);
    return NextResponse.json(
      { error: 'Failed to update constituency' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { constituencyId, ...updateData } = body;
    
    if (!constituencyId) {
      return NextResponse.json(
        { error: 'Constituency ID is required' },
        { status: 400 }
      );
    }
    
    const updatedConstituency = await Constituency.findOneAndUpdate(
      { constituencyId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedConstituency) {
      return NextResponse.json(
        { error: 'Constituency not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Constituency updated successfully',
      constituency: updatedConstituency
    });
  } catch (error) {
    console.error('Error updating constituency:', error);
    return NextResponse.json(
      { error: 'Failed to update constituency' },
      { status: 500 }
    );
  }
}
