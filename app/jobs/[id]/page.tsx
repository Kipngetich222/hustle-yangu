import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import JobDetails from '@/components/JobDetails'
import ApplicationList from '@/components/ApplicationList'
import MapView from '@/components/MapView'
import { Calendar, MapPin, Clock, DollarSign, Users } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default async function JobPage({
  params
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return notFound()
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
        }
      }
    }
  })

  if (!job) {
    return notFound()
  }

  const isOwner = job.employerId === session.user.id
  const hasApplied = job.applications.some(app => app.seeker.id === session.user.id)

  return (
    <div className="space-y-8">
      {/* Job Header */}
      <div className="card p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600 mt-2">Posted by {job.employer.name}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              job.status === 'AVAILABLE' 
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {job.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              job.jobType === 'CASUAL'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {job.jobType.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Job Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{job.location?.city || 'Remote'}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-5 w-5 mr-2" />
            <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-5 w-5 mr-2" />
            <span className="font-semibold">
              ${job.payAmount} {job.payType === 'HOURLY' ? '/hr' : ''}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-5 w-5 mr-2" />
            <span>{job.applications.length} applicants</span>
          </div>
        </div>

        {job.startTime && (
          <div className="flex items-center text-gray-600 mt-4">
            <Calendar className="h-5 w-5 mr-2" />
            <span>
              {new Date(job.startTime).toLocaleDateString()} • 
              {new Date(job.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Job Details and Applications */}
        <div className="lg:col-span-2 space-y-6">
          <JobDetails job={job} />
          
          {isOwner && (
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">Applications ({job.applications.length})</h3>
              <ApplicationList applications={job.applications} jobId={job.id} />
            </div>
          )}
        </div>

        {/* Right Column - Map and Employer Info */}
        <div className="space-y-6">
          {/* Map */}
          <div className="card p-4">
            <h3 className="text-xl font-bold mb-4">Location</h3>
            <MapView jobs={[job]} />
          </div>

          {/* Employer Info */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">About the Employer</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold">
                  {job.employer.name.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="font-bold">{job.employer.name}</h4>
                {job.employer.profile?.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{job.employer.profile.rating.toFixed(1)}</span>
                    <span className="text-gray-600 text-sm">
                      ({job.employer.profile.reviewCount} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              {job.employer.profile?.bio || 'No bio provided'}
            </p>
            <button className="w-full btn-primary">
              Message Employer
            </button>
          </div>

          {/* Action Buttons */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {!isOwner && !hasApplied && job.status === 'AVAILABLE' && (
                <button className="w-full btn-primary">
                  Apply Now
                </button>
              )}
              {!isOwner && hasApplied && (
                <button className="w-full btn-secondary" disabled>
                  Application Submitted
                </button>
              )}
              <button className="w-full btn-secondary">
                Save Job
              </button>
              <button className="w-full btn-secondary">
                Share Job
              </button>
              {isOwner && (
                <>
                  <button className="w-full btn-secondary">
                    Edit Job
                  </button>
                  <button className="w-full btn-secondary text-red-600 hover:bg-red-50">
                    Delete Job
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}