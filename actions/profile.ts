// actions/profile.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProfile(userId: string) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            createdAt: true,
            role: true
          }
        },
        portfolio: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
}

export async function updateProfile(userId: string, data: {
  bio?: string;
  skills?: string[];
  experience?: string[];
}) {
  try {
    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId }
    });

    let profile;
    if (existingProfile) {
      profile = await prisma.profile.update({
        where: { userId },
        data
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          userId,
          ...data
        }
      });
    }

    revalidatePath('/profile');
    revalidatePath(`/profile/${userId}`);
    
    return profile;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

export async function updateUserLocation(userId: string, data: {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
  locationEnabled: boolean;
}) {
  try {
    const { locationEnabled, ...locationData } = data;

    // Store location preferences
    await prisma.user.update({
      where: { id: userId },
      data: {
        location: locationEnabled ? {
          upsert: {
            create: locationData,
            update: locationData
          }
        } : { delete: true }
      }
    });

    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
}