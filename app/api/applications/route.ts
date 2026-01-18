import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/applications - Get user's applications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {
      OR: [
        { seekerId: session.user.id },
        { job: { employerId: session.user.id } }
      ]
    }

    if (status) {
      where.status = status
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
      },
      skip,
      take: limit
    })

    const total = await prisma.application.count({ where })

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

// POST /api/applications - Apply for a job
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { jobId, message } = data

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Check if job exists and is available
    const job = await prisma.job.findUnique({
      where: { id: jobId, status: 'AVAILABLE' }
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found or not available' },
        { status: 404 }
      )
    }

    // Check if user already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId,
        seekerId: session.user.id
      }
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this job' },
        { status: 400 }
      )
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId,
        seekerId: session.user.id,
        message,
        status: 'PENDING'
      },
      include: {
        job: {
          include: {
            employer: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        seeker: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Send notification to employer
    await prisma.notification.create({
      data: {
        userId: job.employerId,
        title: 'New Job Application',
        message: `${session.user.name} applied for your job: "${job.title}"`,
        type: 'APPLICATION',
        link: `/jobs/${jobId}`
      }
    })

    return NextResponse.json(application, { status: 201 })

  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { error: 'Failed to apply for job' },
      { status: 500 }
    )
  }
}