export interface User {
  id: string
  email: string
  name: string
  role: 'SEEKER' | 'EMPLOYER' | 'ADMIN'
  profile?: Profile
  createdAt: Date
}

export interface Profile {
  id: string
  userId: string
  bio?: string
  skills: string[]
  experience: string[]
  rating: number
  reviewCount: number
}

export interface Job {
  id: string
  title: string
  description: string
  employerId: string
  category: string
  jobType: 'CASUAL' | 'LONG_TERM' | 'ONE_TIME'
  status: 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'UNAVAILABLE'
  payAmount?: number
  payType?: 'HOURLY' | 'FIXED' | 'NEGOTIABLE'
  startTime?: Date
  endTime?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Application {
  id: string
  jobId: string
  seekerId: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
  message?: string
  createdAt: Date
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  createdAt: Date
}

export interface CalendarEvent {
  id: string
  userId: string
  jobId?: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
}

export interface Post {
  id: string
  userId: string
  title: string
  content: string
  mediaUrls: string[]
  category: string
  likes: number
  comments: number
  isPromoted: boolean
  createdAt: Date
}

export interface SearchParams {
  category?: string
  jobType?: string
  payType?: string
  minPay?: string
  maxPay?: string
  location?: string
  radius?: string
  sortBy?: string
  timeRange?: string
  status?: string
  page?: string
  limit?: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'APPLICATION' | 'MESSAGE' | 'JOB_UPDATE' | 'SYSTEM'
  link?: string
  isRead: boolean
  createdAt: Date
}