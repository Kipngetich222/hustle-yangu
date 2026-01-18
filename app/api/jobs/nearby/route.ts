import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/jobs/nearby - Get jobs near location
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const lat = parseFloat(searchParams.get('lat')!)
    const lng = parseFloat(searchParams.get('lng')!)
    const radius = parseFloat(searchParams.get('radius') || '50') // in km
    
    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    // Convert radius from km to degrees (approximate)
    const radiusInDegrees = radius / 111

    // Get jobs within the radius
    const jobs = await prisma.job.findMany({
      where: {
        status: 'AVAILABLE',
        location: {
          latitude: {
            gte: lat - radiusInDegrees,
            lte: lat + radiusInDegrees
          },
          longitude: {
            gte: lng - radiusInDegrees,
            lte: lng + radiusInDegrees
          }
        }
      },
      include: {
        employer: {
          select: {
            id: true,
            name: true
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
      }
    })

    // Calculate distance for each job
    const jobsWithDistance = jobs.map(job => {
      const distance = calculateDistance(
        lat, lng,
        job.location!.latitude, job.location!.longitude
      )
      return {
        ...job,
        distance
      }
    })

    // Sort by distance
    jobsWithDistance.sort((a, b) => a.distance - b.distance)

    return NextResponse.json(jobsWithDistance)

  } catch (error) {
    console.error('Error fetching nearby jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch nearby jobs' },
      { status: 500 }
    )
  }
}

// Haversine formula to calculate distance
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI/180)
}