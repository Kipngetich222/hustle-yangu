import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/jobs - Get all jobs with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    
    // Extract filter parameters
    const category = searchParams.get('category')
    const jobType = searchParams.get('jobType')
    const minPay = searchParams.get('minPay')
    const maxPay = searchParams.get('maxPay')
    const location = searchParams.get('location')
    const radius = searchParams.get('radius') || '50'
    const sortBy = searchParams.get('sortBy') || 'newest'
    const timeRange = searchParams.get('timeRange')
    const status = searchParams.get('status') || 'AVAILABLE'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      status: status as any
    }

    if (category && category !== 'All Categories') {
      where.category = category
    }

    if (jobType && jobType !== 'All Types') {
      where.jobType = jobType as any
    }

    if (minPay) {
      where.payAmount = { gte: parseInt(minPay) }
    }

    if (maxPay) {
      where.payAmount = { ...where.payAmount, lte: parseInt(maxPay) }
    }

    // Time range filter
    if (timeRange && timeRange !== 'All time') {
      const now = new Date()
      let startDate = new Date()
      
      switch (timeRange) {
        case 'Today':
          startDate.setHours(0, 0, 0, 0)
          break
        case 'This week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'This month':
          startDate.setMonth(now.getMonth() - 1)
          break
      }
      
      where.createdAt = { gte: startDate }
    }

    // Location-based filtering (simplified)
    if (location) {
      where.location = {
        OR: [
          { city: { contains: location, mode: 'insensitive' } },
          { state: { contains: location, mode: 'insensitive' } },
          { address: { contains: location, mode: 'insensitive' } }
        ]
      }
    }

    // Build orderBy clause
    let orderBy: any = {}
    switch (sortBy) {
      case 'newest':
        orderBy.createdAt = 'desc'
        break
      case 'oldest':
        orderBy.createdAt = 'asc'
        break
      case 'pay_high':
        orderBy.payAmount = 'desc'
        break
      case 'pay_low':
        orderBy.payAmount = 'asc'
        break
      case 'distance':
        // This would require geospatial query
        orderBy.createdAt = 'desc'
        break
    }

    // Get jobs with pagination
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
            id: true,
            status: true
          }
        }
      },
      orderBy,
      skip,
      take: limit
    })

    // Get total count for pagination
    const total = await prisma.job.count({ where })

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

// POST /api/jobs - Create a new job
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'jobType']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Create job
    const job = await prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        jobType: data.jobType,
        payAmount: data.payAmount ? parseFloat(data.payAmount) : null,
        payType: data.payType,
        startTime: data.startTime ? new Date(data.startTime) : null,
        endTime: data.endTime ? new Date(data.endTime) : null,
        status: 'AVAILABLE',
        employerId: session.user.id,
        location: data.location ? {
          create: {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
            address: data.location.address,
            city: data.location.city,
            state: data.location.state,
            country: data.location.country
          }
        } : undefined
      },
      include: {
        employer: {
          select: {
            name: true
          }
        },
        location: true
      }
    })

    return NextResponse.json(job, { status: 201 })

  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}