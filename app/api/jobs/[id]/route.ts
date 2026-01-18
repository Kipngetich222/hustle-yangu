import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/jobs/[id] - Get specific job
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: {
              select: {
                bio: true,
                rating: true,
                reviewCount: true
              }
            }
          }
        },
        location: true,
        applications: {
          include: {
            seeker: {
              select: {
                id: true,
                name: true,
                profile: {
                  select: {
                    bio: true,
                    skills: true,
                    rating: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    return NextResponse.json(job)

  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    )
  }
}

// PUT /api/jobs/[id] - Update job
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user owns the job
    const existingJob = await prisma.job.findUnique({
      where: { id: params.id }
    })

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (existingJob.employerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to update this job' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    const job = await prisma.job.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        jobType: data.jobType,
        payAmount: data.payAmount ? parseFloat(data.payAmount) : null,
        payType: data.payType,
        startTime: data.startTime ? new Date(data.startTime) : null,
        endTime: data.endTime ? new Date(data.endTime) : null,
        status: data.status,
        location: data.location ? {
          upsert: {
            create: {
              latitude: data.location.latitude,
              longitude: data.location.longitude,
              address: data.location.address,
              city: data.location.city,
              state: data.location.state,
              country: data.location.country
            },
            update: {
              latitude: data.location.latitude,
              longitude: data.location.longitude,
              address: data.location.address,
              city: data.location.city,
              state: data.location.state,
              country: data.location.country
            }
          }
        } : undefined
      },
      include: {
        employer: {
          select: { name: true }
        },
        location: true
      }
    })

    return NextResponse.json(job)

  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    )
  }
}

// DELETE /api/jobs/[id] - Delete job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user owns the job
    const existingJob = await prisma.job.findUnique({
      where: { id: params.id }
    })

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (existingJob.employerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this job' },
        { status: 403 }
      )
    }

    await prisma.job.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Job deleted successfully' })

  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}