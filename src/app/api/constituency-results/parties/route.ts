import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Parliament from '@/models/Parliament';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const parliament = searchParams.get('parliament');
    
    if (!parliament) {
      return NextResponse.json(
        { error: 'Parliament number is required' },
        { status: 400 }
      );
    }
    
    // Get unique parties for the parliament
    const uniqueParties = await Parliament.aggregate([
      { $match: { parliament: parseInt(parliament) } },
      { $group: { _id: '$party', color: { $first: '$color' } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Generate dynamic colors if not present
    const colorPalette = [
      '#BCFBE2', '#F2B5FB', '#FED7AA', '#A7F3D0', '#FDE68A',
      '#FECACA', '#BFDBFE', '#C7D2FE', '#DDD6FE', '#F3E8FF',
      '#FED7AA', '#FDE68A', '#FEF3C7', '#FEF9C3', '#F0FDF4'
    ];
    
    const partiesWithColors = uniqueParties.map((party, index) => ({
      name: party._id,
      color: party.color || colorPalette[index % colorPalette.length]
    }));
    
    return NextResponse.json(partiesWithColors);
  } catch (error) {
    console.error('Error fetching unique parties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unique parties' },
      { status: 500 }
    );
  }
}
