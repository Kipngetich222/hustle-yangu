// actions/application.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getApplications(userId: string, status?: string) {
  try {
    const where: any = {
      OR: [
        { seekerId: userId },
        { job: { employerId: userId } }
      ]
    };

    if (status) {
      where.status = status;
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          include: {
            employer: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            location: true
          }
        },
        seeker: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: {
              select: {
                bio: true,
                skills: true,
                rating: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
}

export async function updateApplicationStatus(applicationId: string, status: string, userId: string) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true }
    });

    if (!application) {
      throw new Error('Application not found');
    }

    // Check authorization
    const isEmployer = application.job.employerId === userId;
    const isSeeker = application.seekerId === userId;

    if (!isEmployer && !isSeeker) {
      throw new Error('Not authorized to update this application');
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
      include: {
        job: true,
        seeker: true
      }
    });

    revalidatePath(`/jobs/${application.jobId}`);
    revalidatePath('/applications');

    return updatedApplication;
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
}