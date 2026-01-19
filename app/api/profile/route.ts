// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            createdAt: true,
            role: true,
            location: true
          }
        },
        portfolio: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!profile) {
      // Create profile if it doesn't exist
      const newProfile = await prisma.profile.create({
        data: {
          userId: session.user.id,
          skills: [],
          experience: [],
          rating: 0,
          reviewCount: 0
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              createdAt: true,
              role: true,
              location: true
            }
          },
          portfolio: true
        }
      });
      return NextResponse.json(newProfile);
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { bio, skills, experience } = data;

    // Update or create profile
    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: {
        bio,
        skills,
        experience
      },
      create: {
        userId: session.user.id,
        bio,
        skills: skills || [],
        experience: experience || [],
        rating: 0,
        reviewCount: 0
      }
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}