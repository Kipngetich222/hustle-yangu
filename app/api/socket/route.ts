import { NextRequest } from 'next/server';
import { initSocket } from '@/lib/socket';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // This route is for Socket.io initialization
  return new Response('Socket.io route', { status: 200 });
}

export async function POST(request: NextRequest) {
  // This route is for Socket.io initialization
  return new Response('Socket.io route', { status: 200 });
}