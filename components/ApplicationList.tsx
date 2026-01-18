'use client'

import { useState } from 'react'
import { User, Mail, Phone, Star, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Application {
  id: string
  message?: string
  status: string
  seeker: {
    id: string
    name: string
    email: string
    profile?: {
      bio: string
      skills: string[]
      rating: number
    }
  }
}

interface ApplicationListProps {
  applications: Application[]
  jobId: string
}

export default function ApplicationList({ applications, jobId }: ApplicationListProps) {
  const [selectedApp, setSelectedApp] = useState<string | null>(null)

  const handleAccept = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACCEPTED' })
      })
      
      if (response.ok) {
        alert('Application accepted successfully')
      }
    } catch (error) {
      console.error('Error accepting application:', error)
      alert('Failed to accept application')
    }
  }

  const handleReject = async (applicationId: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' })
      })
      
      if (response.ok) {
        alert('Application rejected')
      }
    } catch (error) {
      console.error('Error rejecting application:', error)
      alert('Failed to reject application')
    }
  }

  return (
    <div className="space-y-4">
      {applications.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No applications yet
        </p>
      ) : (
        applications.map((app) => (
          <div key={app.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-bold">{app.seeker.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {app.seeker.email}
                  </div>
                  {app.seeker.profile?.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{app.seeker.profile.rating.toFixed(1)}</span>
                      <span className="text-gray-600 text-sm">rating</span>
                    </div>
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {app.status}
              </span>
            </div>

            {app.message && (
              <div className="mb-4">
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  "{app.message}"
                </p>
              </div>
            )}

            {app.seeker.profile?.skills && app.seeker.profile.skills.length > 0 && (
              <div className="mb-4">
                <h5 className="font-semibold mb-2">Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {app.seeker.profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedApp(app.seeker.id)}
                >
                  View Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Open chat with seeker
                  }}
                >
                  Message
                </Button>
              </div>
              
              {app.status === 'PENDING' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleReject(app.id)}
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleAccept(app.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}