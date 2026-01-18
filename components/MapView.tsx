'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Navigation, ZoomIn, ZoomOut } from 'lucide-react'
import { Job } from '@prisma/client'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
)

interface MapViewProps {
  jobs?: Array<Job & {
    location?: {
      latitude: number
      longitude: number
      address: string
    }
  }>
  userLocation?: {
    latitude: number
    longitude: number
  }
}

export default function MapView({ jobs = [], userLocation }: MapViewProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0])
  const [zoom, setZoom] = useState(13)
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setMapCenter([latitude, longitude])
        },
        () => {
          // Default to a major city if geolocation fails
          setMapCenter([40.7128, -74.0060]) // New York
        }
      )
    } else if (userLocation) {
      setMapCenter([userLocation.latitude, userLocation.longitude])
    }
  }, [userLocation])

  const handleMarkerClick = (jobId: string, lat: number, lng: number) => {
    setSelectedJob(jobId)
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lng], 15)
    }
  }

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() + 1)
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() - 1)
    }
  }

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 15)
        }
      })
    }
  }

  // If no jobs with locations, show empty state
  const jobsWithLocations = jobs.filter(job => job.location)

  return (
    <div className="relative h-[500px] rounded-lg overflow-hidden">
      {jobsWithLocations.length > 0 ? (
        <>
          <MapContainer
            center={mapCenter}
            zoom={zoom}
            className="h-full w-full rounded-lg"
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* User location circle */}
            {userLocation && (
              <Circle
                center={[userLocation.latitude, userLocation.longitude]}
                radius={1000} // 1km radius
                pathOptions={{ fillColor: 'blue', color: 'blue', fillOpacity: 0.1 }}
              />
            )}
            
            {/* Job markers */}
            {jobsWithLocations.map((job) => (
              <Marker
                key={job.id}
                position={[
                  job.location!.latitude,
                  job.location!.longitude
                ]}
                eventHandlers={{
                  click: () => handleMarkerClick(
                    job.id,
                    job.location!.latitude,
                    job.location!.longitude
                  )
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-bold">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.category}</p>
                    <p className="text-sm font-semibold mt-2">
                      ${job.payAmount} {job.payType === 'HOURLY' ? '/hr' : ''}
                    </p>
                    <a
                      href={`/jobs/${job.id}`}
                      className="text-blue-600 text-sm hover:underline mt-2 inline-block"
                    >
                      View Details
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <button
              onClick={handleLocateMe}
              className="bg-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              title="Locate me"
            >
              <Navigation className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={handleZoomIn}
              className="bg-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              title="Zoom in"
            >
              <ZoomIn className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={handleZoomOut}
              className="bg-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              title="Zoom out"
            >
              <ZoomOut className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Available Jobs</span>
            </div>
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center bg-gray-100">
          <MapPin className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600">No jobs with location data available</p>
          <p className="text-sm text-gray-500 mt-2">
            Try adjusting your filters or search area
          </p>
        </div>
      )}
    </div>
  )
}