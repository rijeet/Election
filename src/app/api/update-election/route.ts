import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Election from '@/models/Election';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { parliamentNumber, ...updateData } = body;
    
    if (!parliamentNumber) {
      return NextResponse.json(
        { error: 'Parliament number is required' },
        { status: 400 }
      );
    }
    
    const updatedElection = await Election.findOneAndUpdate(
      { parliamentNumber },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedElection) {
      return NextResponse.json(
        { error: 'Election not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Election updated successfully',
      election: updatedElection
    });
  } catch (error) {
    console.error('Error updating election:', error);
    return NextResponse.json(
      { error: 'Failed to update election' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { parliamentNumber, ...updateData } = body;
    
    if (!parliamentNumber) {
      return NextResponse.json(
        { error: 'Parliament number is required' },
        { status: 400 }
      );
    }
    
    const updatedElection = await Election.findOneAndUpdate(
      { parliamentNumber },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedElection) {
      return NextResponse.json(
        { error: 'Election not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Election updated successfully',
      election: updatedElection
    });
  } catch (error) {
    console.error('Error updating election:', error);
    return NextResponse.json(
      { error: 'Failed to update election' },
      { status: 500 }
    );
  }
}
