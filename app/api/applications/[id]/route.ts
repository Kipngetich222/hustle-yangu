import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PUT /api/applications/[id] - Update application status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { status } = data

    if (!status || !['ACCEPTED', 'REJECTED', 'WITHDRAWN'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required' },
        { status: 400 }
      )
    }

    // Get application with job details
    const application = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        job: true,
        seeker: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Check authorization
    const isEmployer = application.job.employerId === session.user.id
    const isSeeker = application.seekerId === session.user.id
    
    if (!isEmployer && !isSeeker) {
      return NextResponse.json(
        { error: 'Not authorized to update this application' },
        { status: 403 }
      )
    }

    // If seeker is withdrawing, only allow if status is PENDING
    if (isSeeker && status === 'WITHDRAWN' && application.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Cannot withdraw application that is not pending' },
        { status: 400 }
      )
    }

    // If employer is accepting, mark job as unavailable and create calendar event
    if (isEmployer && status === 'ACCEPTED') {
      // Update job status
      await prisma.job.update({
        where: { id: application.jobId },
        data: { status: 'UNAVAILABLE' }
      })

      // Create calendar event for seeker
      await prisma.calendarEvent.create({
        data: {
          userId: application.seekerId,
          jobId: application.jobId,
          title: application.job.title,
          description: application.job.description,
          startTime: application.job.startTime || new Date(),
          endTime: application.job.endTime || new Date(),
          status: 'SCHEDULED'
        }
      })

      // Send notification to seeker
      await prisma.notification.create({
        data: {
          userId: application.seekerId,
          title: 'Application Accepted!',
          message: `Your application for "${application.job.title}" has been accepted`,
          type: 'APPLICATION_ACCEPTED',
          link: `/calendar`
        }
      })
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id: params.id },
      data: { status: status as any },
      include: {
        job: {
          include: {
            employer: {
              select: { name: true }
            }
          }
        },
        seeker: {
          select: { name: true }
        }
      }
    })

    return NextResponse.json(updatedApplication)

  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

// DELETE /api/applications/[id] - Delete application
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const application = await prisma.application.findUnique({
      where: { id: params.id }
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    // Only allow deletion by the applicant or job owner
    if (application.seekerId !== session.user.id && 
        application.job.employerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this application' },
        { status: 403 }
      )
    }

    await prisma.application.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Application deleted successfully' })

  } catch (error) {
    console.error('Error deleting application:', error)
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    )
  }
}