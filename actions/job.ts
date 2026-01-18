'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SearchParams } from '@/types'
import { revalidatePath } from 'next/cache'

export async function getJobs(searchParams?: SearchParams) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }

  const where: any = {
    status: 'AVAILABLE'
  }

  if (searchParams?.category && searchParams.category !== 'All Categories') {
    where.category = searchParams.category
  }

  if (searchParams?.jobType && searchParams.jobType !== 'All Types') {
    where.jobType = searchParams.jobType as any
  }

  const jobs = await prisma.job.findMany({
    where,
    include: {
      employer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      location: true,
      applications: {
        select: {
          id: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 20
  })

  return jobs
}

export async function createJob(data: any) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }

  const job = await prisma.job.create({
    data: {
      ...data,
      employerId: session.user.id,
      status: 'AVAILABLE'
    },
    include: {
      employer: {
        select: {
          name: true
        }
      }
    }
  })

  revalidatePath('/jobs')
  return { success: true, job }
}

export async function applyForJob(jobId: string, userId: string, message?: string) {
  try {
    const application = await prisma.application.create({
      data: {
        jobId,
        seekerId: userId,
        message,
        status: 'PENDING'
      }
    })

    // Send notification
    await prisma.notification.create({
      data: {
        userId: (await prisma.job.findUnique({ where: { id: jobId } }))!.employerId,
        title: 'New Application',
        message: 'Someone applied for your job',
        type: 'APPLICATION',
        link: `/jobs/${jobId}`
      }
    })

    revalidatePath(`/jobs/${jobId}`)
    return { success: true, application }
  } catch (error) {
    return { success: false, error: error.message }
  }
}