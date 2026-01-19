// app/profile/[id]/page.tsx
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User, Mail, Calendar, Star, MapPin, Briefcase, Award } from 'lucide-react';
import PortfolioGrid from '@/components/PortfolioGrid';
import { formatDistanceToNow } from 'date-fns';

export default async function PublicProfilePage({
  params
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions);
  const isOwnProfile = session?.user?.id === params.id;

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      profile: {
        include: {
          portfolio: {
            orderBy: { createdAt: 'desc' }
          }
        }
      },
      location: true
    }
  });

  if (!user || !user.profile) {
    return notFound();
  }

  const completedJobs = await prisma.application.count({
    where: {
      seekerId: user.id,
      status: 'ACCEPTED'
    }
  });

  const reviews = await prisma.application.findMany({
    where: {
      OR: [
        { seekerId: user.id, status: 'ACCEPTED' },
        { job: { employerId: user.id } }
      ]
    },
    include: {
      job: {
        select: { title: true }
      }
    },
    take: 5
  });

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="card p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-20 w-20 text-white" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {user.name}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold text-lg">
                    {user.profile.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-600">
                    ({user.profile.reviewCount} reviews)
                  </span>
                </div>
              </div>
              {!isOwnProfile && (
                <div className="flex gap-3">
                  <button className="btn-primary">
                    Message
                  </button>
                  <button className="btn-secondary">
                    Hire Now
                  </button>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-5 w-5" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
              </div>
              {user.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{user.location.city}, {user.location.state}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="h-5 w-5" />
                <span>{completedJobs} jobs completed</span>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">About</h3>
              <p className="text-gray-700 leading-relaxed">
                {user.profile.bio || 'No bio provided'}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {completedJobs}
                </div>
                <div className="text-sm text-gray-600">Jobs Done</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((completedJobs / Math.max(completedJobs + 5, 1)) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {user.profile.skills.length}
                </div>
                <div className="text-sm text-gray-600">Skills</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {user.profile.rating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Skills */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="h-6 w-6" />
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-3">
              {user.profile.skills.length > 0 ? (
                user.profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills listed</p>
              )}
            </div>
          </div>

          {/* Portfolio */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-6">Portfolio</h2>
            <PortfolioGrid portfolio={user.profile.portfolio} />
          </div>

          {/* Experience */}
          {user.profile.experience.length > 0 && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">Experience</h2>
              <div className="space-y-4">
                {user.profile.experience.map((exp, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <p className="text-gray-700">{exp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Reviews */}
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4">Recent Reviews</h3>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={index} className="pb-4 border-b last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">5.0</span>
                      <span className="text-sm text-gray-600">• {formatDistanceToNow(new Date(), { addSuffix: true })}</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      "Great work on {review.job.title}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No reviews yet</p>
            )}
          </div>

          {/* Availability */}
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4">Availability</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>This Week</span>
                <span className="text-green-600 font-semibold">Available</span>
              </div>
              <div className="flex justify-between">
                <span>Next Week</span>
                <span className="text-green-600 font-semibold">Available</span>
              </div>
              <div className="flex justify-between">
                <span>Weekends</span>
                <span className="text-green-600 font-semibold">Available</span>
              </div>
            </div>
          </div>

          {/* Location */}
          {user.location && (
            <div className="card p-6">
              <h3 className="text-lg font-bold mb-4">Service Area</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{user.location.address}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Willing to travel up to 20km
                </div>
              </div>
            </div>
          )}

          {/* Quick Contact */}
          {!isOwnProfile && (
            <div className="card p-6">
              <h3 className="text-lg font-bold mb-4">Contact {user.name}</h3>
              <div className="space-y-3">
                <button className="w-full btn-primary">
                  Send Message
                </button>
                <button className="w-full btn-secondary">
                  Request Quote
                </button>
                <button className="w-full btn-secondary">
                  Share Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}