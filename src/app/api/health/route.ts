import { NextResponse } from 'next/server';
import { prisma } from '@orbitusdev/database';

export const dynamic = 'force-dynamic';

/**
 * Health check endpoint with database connectivity test
 * @route GET /api/health
 */
export async function GET(): Promise<NextResponse> {
  try {
    // Test database connection with a simple query
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
