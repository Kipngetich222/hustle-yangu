// types/jobs.ts
export interface Job {
  id: string;
  title: string;
  description: string;
  employerId: string;
  category: string;
  jobType: JobType;
  status: JobStatus;
  payAmount?: number;
  payType?: PayType;
  startTime?: string;
  endTime?: string;
  location?: Location;
  applications?: Application[];
  employer?: User;
  createdAt: string;
  updatedAt: string;
}

export type JobType = 'CASUAL' | 'LONG_TERM' | 'ONE_TIME';
export type JobStatus = 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'UNAVAILABLE';
export type PayType = 'HOURLY' | 'FIXED' | 'NEGOTIABLE';

export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface Application {
  id: string;
  jobId: string;
  seekerId: string;
  status: ApplicationStatus;
  message?: string;
  createdAt: string;
  job?: Job;
  seeker?: User;
}

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export interface JobCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  jobCount: number;
  averagePay: number;
}

export interface JobFilter {
  category?: string;
  jobType?: JobType;
  payType?: PayType;
  minPay?: number;
  maxPay?: number;
  location?: string;
  radius?: number;
  sortBy?: 'date' | 'pay' | 'distance' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  status?: JobStatus;
  employerId?: string;
  seekerId?: string;
  timeRange?: 'today' | 'week' | 'month' | 'year';
}

export interface JobStats {
  totalJobs: number;
  availableJobs: number;
  completedJobs: number;
  averagePay: number;
  popularCategories: Array<{
    category: string;
    count: number;
    averagePay: number;
  }>;
  jobsByType: Record<JobType, number>;
  jobsByStatus: Record<JobStatus, number>;
}

export interface NearbyJob extends Job {
  distance: number;
  travelTime?: number;
  bearing?: number;
}

export interface JobMatch {
  job: Job;
  matchScore: number;
  reasons: string[];
}

export interface JobApplicationStats {
  totalApplications: number;
  accepted: number;
  rejected: number;
  pending: number;
  withdrawn: number;
  averageResponseTime: number;
  conversionRate: number;
}

export interface JobReview {
  id: string;
  jobId: string;
  userId: string;
  rating: number;
  comment: string;
  type: 'EMPLOYER' | 'SEEKER';
  createdAt: string;
  user?: User;
  job?: Job;
}

export interface JobAlert {
  id: string;
  userId: string;
  name: string;
  filters: JobFilter;
  isActive: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  lastSent?: string;
  createdAt: string;
}

export interface JobBookmark {
  id: string;
  userId: string;
  jobId: string;
  notes?: string;
  createdAt: string;
  job?: Job;
}

export interface JobShare {
  id: string;
  jobId: string;
  userId: string;
  platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'email' | 'copy';
  sharedAt: string;
}

export interface JobAnalytics {
  views: number;
  applications: number;
  shares: number;
  bookmarks: number;
  conversionRate: number;
  averageTimeToFill?: number;
  popularTimes: Array<{
    hour: number;
    day: string;
    views: number;
  }>;
  demographics?: {
    ageGroups: Record<string, number>;
    genders: Record<string, number>;
    locations: Array<{
      city: string;
      count: number;
    }>;
  };
}

export interface BulkJobOperation {
  ids: string[];
  operation: 'delete' | 'archive' | 'change_status' | 'duplicate';
  data?: any;
}

export interface JobTemplate {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  jobType: JobType;
  payAmount?: number;
  payType?: PayType;
  location?: Location;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobExport {
  jobs: Job[];
  format: 'csv' | 'json' | 'pdf';
  includeApplications: boolean;
  includeAnalytics: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface JobImportResult {
  imported: number;
  skipped: number;
  errors: Array<{
    row: number;
    error: string;
    data: any;
  }>;
  duplicates: number;
}

// Enums
export enum JobCategoryEnum {
  DELIVERY = 'Delivery',
  CLEANING = 'Cleaning',
  GARDENING = 'Gardening',
  MOVING = 'Moving',
  TUTORING = 'Tutoring',
  REPAIR = 'Repair',
  CONSTRUCTION = 'Construction',
  EVENT_STAFF = 'Event Staff',
  PET_CARE = 'Pet Care',
  OTHER = 'Other'
}

export enum JobPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum JobVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted'
}

// Constants
export const JOB_CATEGORIES = [
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
];

export const JOB_TYPES = [
  { value: 'CASUAL', label: 'Casual (One-time or short-term)' },
  { value: 'LONG_TERM', label: 'Long Term' },
  { value: 'ONE_TIME', label: 'One Time Gig' }
];

export const PAY_TYPES = [
  { value: 'HOURLY', label: 'Hourly' },
  { value: 'FIXED', label: 'Fixed Price' },
  { value: 'NEGOTIABLE', label: 'Negotiable' }
];

export const JOB_STATUSES = [
  { value: 'AVAILABLE', label: 'Available', color: 'green' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'yellow' },
  { value: 'COMPLETED', label: 'Completed', color: 'blue' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
  { value: 'UNAVAILABLE', label: 'Unavailable', color: 'gray' }
];

export const APPLICATION_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'yellow' },
  { value: 'ACCEPTED', label: 'Accepted', color: 'green' },
  { value: 'REJECTED', label: 'Rejected', color: 'red' },
  { value: 'WITHDRAWN', label: 'Withdrawn', color: 'gray' }
];