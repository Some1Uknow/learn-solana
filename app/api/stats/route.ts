import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { platformStats } from '@/lib/db/schema/platformStats';
import { desc } from 'drizzle-orm';

export const revalidate = 600; // Cache for 10 minutes

export async function GET() {
  try {
    // Get the latest stats entry
    const stats = await db
      .select()
      .from(platformStats)
      .orderBy(desc(platformStats.id))
      .limit(1);

    if (!stats.length) {
      // Return default values if no stats exist yet
      return NextResponse.json({
        totalUsers: 0,
        totalTutorialMinutes: 0,
        totalGamePlayers: 0,
        totalRustChallengesAttempted: 0,
        rustChallengeParticipants: 0,
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(stats[0]);
  } catch (error) {
    console.error('[stats] Error fetching platform stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
