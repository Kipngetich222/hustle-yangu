import JobList from '@/components/JobList'
import JobFilters from '@/components/JobFilters'
import MapView from '@/components/MapView'
import { Suspense } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import FeaturedJobs from '@/components/FeaturedJobs'
import StatsOverview from '@/components/StatsOverview'
import QuickActions from '@/components/QuickActions'

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Next Hustle Today
          </h1>
          <p className="text-xl mb-6 opacity-90">
            Connect with local employers for casual jobs, gigs, and short-term opportunities
          </p>
          <div className="flex gap-4">
            <button className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
              Find Jobs Near Me
            </button>
            <button className="btn-secondary border border-white text-white hover:bg-white/10">
              Post a Job
            </button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <StatsOverview />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Filters and Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <QuickActions />
          <div className="card p-4">
            <h2 className="text-2xl font-bold mb-4">Available Jobs Nearby</h2>
            <JobFilters />
            <Suspense fallback={<LoadingSpinner />}>
              <JobList />
            </Suspense>
          </div>
        </div>

        {/* Right Column - Map and Featured Jobs */}
        <div className="space-y-6">
          <div className="card p-4">
            <h3 className="text-xl font-bold mb-4">Jobs on Map</h3>
            <MapView />
          </div>
          <FeaturedJobs />
        </div>
      </div>
    </div>
  )
}