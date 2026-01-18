'use client'

import { useState, useEffect } from 'react'
import { Filter, MapPin, Calendar, DollarSign } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Slider } from '@/components/ui/Slider'

const categories = [
  'All Categories',
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

const jobTypes = ['All Types', 'CASUAL', 'LONG_TERM', 'ONE_TIME']
const payTypes = ['Any', 'HOURLY', 'FIXED', 'NEGOTIABLE']
const timeRanges = ['All time', 'Today', 'This week', 'This month']

export default function JobFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'All Categories',
    jobType: searchParams.get('jobType') || 'All Types',
    payType: searchParams.get('payType') || 'Any',
    timeRange: searchParams.get('timeRange') || 'All time',
    location: searchParams.get('location') || '',
    minPay: parseInt(searchParams.get('minPay') || '0'),
    maxPay: parseInt(searchParams.get('maxPay') || '1000'),
    radius: parseInt(searchParams.get('radius') || '50'),
    sortBy: searchParams.get('sortBy') || 'newest',
  })

  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'All Categories' && value !== 'All Types' && value !== 'Any') {
        params.set(key, value.toString())
      }
    })
    router.push(`?${params.toString()}`, { scroll: false })
  }, [filters, router])

  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold">Filter Jobs</h3>
        </div>
        <button
          onClick={() => setFilters({
            category: 'All Categories',
            jobType: 'All Types',
            payType: 'Any',
            timeRange: 'All time',
            location: '',
            minPay: 0,
            maxPay: 1000,
            radius: 50,
            sortBy: 'newest',
          })}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            className="input-field"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Job Type Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Job Type</label>
          <select
            className="input-field"
            value={filters.jobType}
            onChange={(e) => setFilters({...filters, jobType: e.target.value})}
          >
            {jobTypes.map((type) => (
              <option key={type} value={type}>{type.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Time Range Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Time Range</label>
          <select
            className="input-field"
            value={filters.timeRange}
            onChange={(e) => setFilters({...filters, timeRange: e.target.value})}
          >
            {timeRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        {/* Pay Type Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Pay Type</label>
          <select
            className="input-field"
            value={filters.payType}
            onChange={(e) => setFilters({...filters, payType: e.target.value})}
          >
            {payTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pay Range Slider */}
      <div>
        <label className="block text-sm font-medium mb-4">
          Pay Range: ${filters.minPay} - ${filters.maxPay}
        </label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min="0"
            max="5000"
            value={filters.minPay}
            onChange={(e) => setFilters({...filters, minPay: parseInt(e.target.value)})}
            className="input-field w-24"
          />
          <span className="text-gray-500">to</span>
          <input
            type="number"
            min="0"
            max="5000"
            value={filters.maxPay}
            onChange={(e) => setFilters({...filters, maxPay: parseInt(e.target.value)})}
            className="input-field w-24"
          />
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="City, State, or ZIP"
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Radius Slider */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Search Radius: {filters.radius} km
        </label>
        <Slider
          min={1}
          max={200}
          step={1}
          value={[filters.radius]}
          onValueChange={([value]) => setFilters({...filters, radius: value})}
          className="w-full"
        />
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium mb-2">Sort By</label>
        <select
          className="input-field"
          value={filters.sortBy}
          onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="pay_high">Highest Pay First</option>
          <option value="pay_low">Lowest Pay First</option>
          <option value="distance">Nearest First</option>
        </select>
      </div>
    </div>
  )
}