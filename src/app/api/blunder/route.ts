import { NextRequest, NextResponse } from 'next/server';
import { getBlunderData } from '@/lib/getBlunderData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parliamentParam = searchParams.get('parliament');
    const parliamentNumber = Number(parliamentParam || '9');
    if (Number.isNaN(parliamentNumber)) {
      return NextResponse.json({ error: 'Invalid parliament number' }, { status: 400 });
    }

    const data = await getBlunderData(parliamentNumber);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Blunder API error:', error);
    return NextResponse.json({ error: 'Failed to fetch blunder data' }, { status: 500 });
  }
}



