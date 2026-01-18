'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, DollarSign, Briefcase } from 'lucide-react'
import { createJob } from '@/actions/job'
import { Button } from '@/components/ui/Button'
import MapView from '@/components/MapView'

const categories = [
  'Delivery',
  'Cleaning',
  'Gardening',
  'Moving',
  'Tutoring',
  'Repair',
  'Construction',
  'Event Staff',
  'Pet Care',
  'Other'
]

const jobTypes = [
  { value: 'CASUAL', label: 'Casual (One-time or short-term)' },
  { value: 'LONG_TERM', label: 'Long Term' },
  { value: 'ONE_TIME', label: 'One Time Gig' }
]

const payTypes = [
  { value: 'HOURLY', label: 'Hourly' },
  { value: 'FIXED', label: 'Fixed Price' },
  { value: 'NEGOTIABLE', label: 'Negotiable' }
]

export default function NewJobPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    address: '',
    city: '',
    state: '',
    country: ''
  })

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    jobType: 'CASUAL',
    payAmount: '',
    payType: 'HOURLY',
    startTime: '',
    endTime: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const jobData = {
        ...formData,
        location: location.address ? location : null
      }
      
      const result = await createJob(jobData)
      if (result.success) {
        router.push(`/jobs/${result.job.id}`)
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error('Error creating job:', error)
      alert('Failed to create job')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setLocation({
      ...location,
      latitude: lat,
      longitude: lng,
      address
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Post a New Job
        </h1>
        <p className="text-gray-600">
          Fill in the details below to post your job opportunity. Be specific to attract the right candidates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Basic Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., House Cleaning, Delivery Driver, Tutor"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the job responsibilities, requirements, and any important details..."
                rows={4}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="input-field"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Job Type *
                </label>
                <select
                  required
                  value={formData.jobType}
                  onChange={(e) => setFormData({...formData, jobType: e.target.value})}
                  className="input-field"
                >
                  {jobTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Address
              </label>
              <input
                type="text"
                value={location.address}
                onChange={(e) => setLocation({...location, address: e.target.value})}
                placeholder="Enter job location or leave blank for remote jobs"
                className="input-field"
              />
            </div>

            {location.address && (
              <div className="h-64 rounded-lg overflow-hidden">
                <MapView />
              </div>
            )}
          </div>
        </div>

        {/* Schedule & Pay */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule & Pay
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Pay Type
                </label>
                <select
                  value={formData.payType}
                  onChange={(e) => setFormData({...formData, payType: e.target.value})}
                  className="input-field"
                >
                  {payTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Pay Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.payAmount}
                    onChange={(e) => setFormData({...formData, payAmount: e.target.value})}
                    placeholder="Enter amount"
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Posting...' : 'Post Job'}
          </Button>
        </div>
      </form>
    </div>
  )
}