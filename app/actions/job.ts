// app/actions/job.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function applyForJob(jobId: string, userId: string, message?: string) {
  try {
    // Check if job is still available
    const job = await prisma.job.findUnique({
      where: { id: jobId, status: 'AVAILABLE' }
    });
    
    if (!job) {
      throw new Error('Job is no longer available');
    }
    
    // Check for existing application
    const existing = await prisma.application.findFirst({
      where: { jobId, seekerId: userId }
    });
    
    if (existing) {
      throw new Error('You have already applied for this job');
    }
    
    // Create application
    const application = await prisma.application.create({
      data: {
        jobId,
        seekerId: userId,
        message,
        status: 'PENDING'
      }
    });
    
    // Send notification to employer
    await createNotification({
      userId: job.employerId,
      title: 'New Job Application',
      message: `Someone applied for your job: ${job.title}`,
      type: 'APPLICATION',
      link: `/jobs/${jobId}/applications`
    });
    
    revalidatePath(`/jobs/${jobId}`);
    return { success: true, application };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function acceptApplication(applicationId: string) {
  try {
    const application = await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'ACCEPTED' },
      include: { job: true }
    });
    
    // Update job status
    await prisma.job.update({
      where: { id: application.jobId },
      data: { status: 'UNAVAILABLE' }
    });
    
    // Create calendar event for job seeker
    await prisma.calendarEvent.create({
      data: {
        userId: application.seekerId,
        jobId: application.jobId,
        title: application.job.title,
        startTime: application.job.startTime || new Date(),
        endTime: application.job.endTime || new Date(),
        status: 'SCHEDULED'
      }
    });
    
    // Notify job seeker
    await createNotification({
      userId: application.seekerId,
      title: 'Application Accepted!',
      message: `Your application for "${application.job.title}" has been accepted`,
      type: 'APPLICATION_ACCEPTED',
      link: `/calendar`
    });
    
    revalidatePath(`/jobs/${application.jobId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}