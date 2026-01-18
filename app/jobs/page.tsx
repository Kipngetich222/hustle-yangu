import JobList from '@/components/JobList'
import JobFilters from '@/components/JobFilters'
import MapView from '@/components/MapView'
import { Suspense } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { getJobs } from '@/actions/job'
import { SearchParams } from '@/types'

export default async function JobsPage({
  searchParams
}: {
  searchParams?: SearchParams
}) {
  const jobs = await getJobs(searchParams)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Next Hustle
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse casual jobs, gigs, and short-term opportunities in your area. 
          Apply instantly and start earning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filters and Job List */}
        <div className="lg:col-span-2 space-y-6">
          <JobFilters />
          <Suspense fallback={<LoadingSpinner />}>
            <JobList searchParams={searchParams} />
          </Suspense>
        </div>

        {/* Map View */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="card p-4">
              <h3 className="text-xl font-bold mb-4">Jobs on Map</h3>
              <MapView jobs={jobs} />
            </div>
            
            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-sm text-gray-600">Jobs Today</div>
              </div>
              <div className="card p-4 text-center">
                <div className="text-2xl font-bold text-green-600">156</div>
                <div className="text-sm text-gray-600">Total Jobs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}