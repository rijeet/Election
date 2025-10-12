import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Election from '@/models/Election';
import InfoCandidate from '@/models/InfoCandidate';

export async function GET(request: NextRequest) {
  try {
    // Simple token validation (in production, use proper JWT validation)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    // Fetch statistics
    const [elections, candidates] = await Promise.all([
      Election.find({}),
      InfoCandidate.find({})
    ]);

    const stats = {
      elections: {
        total: elections.length,
        active: elections.filter(e => new Date(e.electionDate) > new Date()).length,
        completed: elections.filter(e => new Date(e.electionDate) <= new Date()).length
      },
      candidates: {
        total: candidates.length,
        verified: candidates.filter(c => c.controversial && c.controversial.length > 0).length,
        pending: candidates.filter(c => !c.controversial || c.controversial.length === 0).length
      },
      constituencies: {
        total: 300, // Fixed number for Bangladesh
        with_results: elections.reduce((acc, e) => acc + (e.candidates?.length || 0), 0),
        without_results: 300 - elections.reduce((acc, e) => acc + (e.candidates?.length || 0), 0)
      },
      system: {
        total_users: candidates.length,
        admin_logins: 1,
        last_backup: new Date().toISOString()
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Admin dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
