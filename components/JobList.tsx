import JobCard from '@/components/JobCard'
import { getJobs } from '@/actions/job'
import { Suspense } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { SearchParams } from '@/types'

interface JobListProps {
  searchParams?: SearchParams
}

export default async function JobList({ searchParams }: JobListProps) {
  const jobs = await getJobs(searchParams)

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No jobs found
        </h3>
        <p className="text-gray-600">
          Try adjusting your filters or check back later for new opportunities
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {jobs.length} Job{jobs.length !== 1 ? 's' : ''} Available
        </h2>
        <div className="text-sm text-gray-600">
          Sorted by: <span className="font-semibold">Newest First</span>
        </div>
      </div>
      
      <Suspense fallback={<LoadingSpinner />}>
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </Suspense>
      
      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <nav className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50">
            Previous
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`px-3 py-2 rounded-lg border ${
                page === 1
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-3 py-2 rounded-lg border hover:bg-gray-50">
            Next
          </button>
        </nav>
      </div>
    </div>
  )
}