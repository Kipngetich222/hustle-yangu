'use client'

import { MapPin, Clock, DollarSign, Users, Calendar } from 'lucide-react'
import { Job } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/hooks/useAuth'
import { applyForJob } from '@/actions/job'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

interface JobCardProps {
  job: Job & {
    employer: {
      name: string
    }
    location?: {
      city: string
      state: string
    }
    applications: Array<{ id: string }>
  }
}

export default function JobCard({ job }: JobCardProps) {
  const { user } = useAuth()
  const [isApplying, setIsApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  const handleApply = async () => {
    if (!user) {
      // Redirect to login
      return
    }

    setIsApplying(true)
    try {
      await applyForJob(job.id, user.id)
      setHasApplied(true)
    } catch (error) {
      console.error('Failed to apply:', error)
    } finally {
      setIsApplying(false)
    }
  }

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'CASUAL':
        return 'bg-green-100 text-green-800'
      case 'LONG_TERM':
        return 'bg-blue-100 text-blue-800'
      case 'ONE_TIME':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'UNAVAILABLE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
          <p className="text-gray-600 mt-1">{job.employer.name}</p>
        </div>
        <div className="flex gap-2">
          <Badge className={getJobTypeColor(job.jobType)}>
            {job.jobType.replace('_', ' ')}
          </Badge>
          <Badge className={getStatusColor(job.status)}>
            {job.status}
          </Badge>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
            {job.payAmount} {job.payType === 'HOURLY' ? '/hr' : ''}
          </span>
        </div>
        <div className="flex items-center text-gray-600">
          <Users className="h-5 w-5 mr-2" />
          <span>{job.applications.length} applicants</span>
        </div>
      </div>

      {job.startTime && (
        <div className="flex items-center text-gray-600 mb-6">
          <Calendar className="h-5 w-5 mr-2" />
          <span>
            {new Date(job.startTime).toLocaleDateString()} • 
            {new Date(job.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              // Navigate to job details
              window.location.href = `/jobs/${job.id}`
            }}
          >
            View Details
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Open chat with employer
            }}
          >
            Message
          </Button>
        </div>
        
        <Button
          onClick={handleApply}
          disabled={isApplying || hasApplied || job.status !== 'AVAILABLE'}
          className="btn-primary"
        >
          {isApplying ? 'Applying...' : 
           hasApplied ? 'Applied' : 
           job.status !== 'AVAILABLE' ? 'Unavailable' : 'Apply Now'}
        </Button>
      </div>
    </div>
  )
}