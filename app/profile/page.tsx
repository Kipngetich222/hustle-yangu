'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Star, Edit } from 'lucide-react'
import { getProfile, updateProfile } from '@/actions/profile'
import { Button } from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Profile {
  bio: string
  skills: string[]
  experience: string[]
  rating: number
  reviewCount: number
  user: {
    name: string
    email: string
    createdAt: Date
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    bio: '',
    skills: [] as string[],
    experience: [] as string[]
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const data = await getProfile()
      setProfile(data)
      setFormData({
        bio: data.bio || '',
        skills: data.skills || [],
        experience: data.experience || []
      })
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      await updateProfile(formData)
      setIsEditing(false)
      loadProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const addSkill = () => {
    const newSkill = prompt('Enter new skill:')
    if (newSkill) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill]
      })
    }
  }

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    })
  }

  const addExperience = () => {
    const newExp = prompt('Enter new experience:')
    if (newExp) {
      setFormData({
        ...formData,
        experience: [...formData.experience, newExp]
      })
    }
  }

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index)
    })
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h2>
        <Button onClick={() => window.location.reload()}>
          Reload Profile
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-16 w-16 text-white" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.user.name}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">{profile.rating.toFixed(1)}</span>
                  <span className="text-gray-600">
                    ({profile.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-5 w-5" />
                <span>{profile.user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>Member since {new Date(profile.user.createdAt).getFullYear()}</span>
              </div>
            </div>

            {/* Bio */}
            {isEditing ? (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={3}
                  className="input-field"
                  placeholder="Tell others about yourself..."
                />
              </div>
            ) : (
              <p className="text-gray-700 mb-6">
                {profile.bio || 'No bio provided'}
              </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-sm text-gray-600">Jobs Done</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">156</div>
                <div className="text-sm text-gray-600">Connections</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">4.8</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Skills */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Skills & Expertise</h2>
              {isEditing && (
                <Button onClick={addSkill} variant="outline" size="sm">
                  Add Skill
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills added yet</p>
                )}
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Experience</h2>
              {isEditing && (
                <Button onClick={addExperience} variant="outline" size="sm">
                  Add Experience
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <span>{exp}</span>
                    <button
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {profile.experience.length > 0 ? (
                  profile.experience.map((exp, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      {exp}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No experience added yet</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Verification Status */}
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4">Verification Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Email Verified</span>
                <span className="text-green-600 font-semibold">✓</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Phone Verified</span>
                <span className="text-yellow-600 font-semibold">Pending</span>
              </div>
              <div className="flex justify-between items-center">
                <span>ID Verified</span>
                <span className="text-gray-600">Not started</span>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4">Availability</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>This Week</span>
                <span className="text-green-600 font-semibold">Available</span>
              </div>
              <div className="flex justify-between">
                <span>Next Week</span>
                <span className="text-yellow-600 font-semibold">Limited</span>
              </div>
              <div className="flex justify-between">
                <span>Weekends</span>
                <span className="text-green-600 font-semibold">Available</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full">View Portfolio</Button>
              <Button variant="outline" className="w-full">
                Share Profile
              </Button>
              <Button variant="outline" className="w-full">
                Download Resume
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button for Editing */}
      {isEditing && (
        <div className="sticky bottom-6 bg-white border rounded-lg p-4 shadow-lg">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}