'use client'

import { MapPin, Clock, DollarSign, Users, Calendar } from 'lucide-react'
import { Job } from '@prisma/client'
import { formatDistanceToNow } from 'date-fns'

interface JobDetailsProps {
  job: Job & {
    employer: {
      name: string
    }
    location?: {
      city: string
      state: string
      address: string
    }
    applications: Array<{ id: string }>
  }
}

export default function JobDetails({ job }: JobDetailsProps) {
  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-4">Job Details</h2>
      
      <div className="prose max-w-none">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {job.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Must have relevant experience</li>
              <li>Reliable and punctual</li>
              <li>Own transportation required</li>
              <li>Good communication skills</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">What You'll Do</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Complete assigned tasks efficiently</li>
              <li>Follow safety guidelines</li>
              <li>Report progress to employer</li>
              <li>Maintain clean work area</li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Schedule</h3>
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="h-5 w-5" />
            <span>
              {job.startTime ? (
                <>
                  {new Date(job.startTime).toLocaleDateString()} • 
                  {new Date(job.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {job.endTime && (
                    <> to {new Date(job.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
                  )}
                </>
              ) : 'Flexible'}
            </span>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold">Pay Type</div>
              <div className="text-gray-600">{job.payType}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold">Job Type</div>
              <div className="text-gray-600">{job.jobType.replace('_', ' ')}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold">Category</div>
              <div className="text-gray-600">{job.category}</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold">Status</div>
              <div className={`font-semibold ${
                job.status === 'AVAILABLE' ? 'text-green-600' : 'text-red-600'
              }`}>
                {job.status}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}