// types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profile?: Profile;
  location?: Location;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'SEEKER' | 'EMPLOYER' | 'ADMIN';

export interface Profile {
  id: string;
  userId: string;
  bio?: string;
  skills: string[];
  experience: string[];
  rating: number;
  reviewCount: number;
  portfolio?: PortfolioItem[];
  user?: User;
}

export interface PortfolioItem {
  id: string;
  profileId: string;
  title: string;
  description: string;
  mediaUrls: string[];
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface UserStats {
  totalJobs: number;
  completedJobs: number;
  totalEarnings: number;
  averageRating: number;
  responseRate: number;
  completionRate: number;
  activeDays: number;
  streak: number;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    jobAlerts: boolean;
    messages: boolean;
    promotions: boolean;
  };
  privacy: {
    profileVisibility: 'PUBLIC' | 'REGISTERED' | 'PRIVATE';
    showOnlineStatus: boolean;
    allowMessages: 'EVERYONE' | 'CONNECTIONS' | 'NO_ONE';
  };
  location: {
    enabled: boolean;
    radius: number;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    primaryColor: string;
  };
}

export interface UserVerification {
  emailVerified: boolean;
  phoneVerified: boolean;
  idVerified: boolean;
  addressVerified: boolean;
  verifiedAt?: string;
  verificationLevel: 'basic' | 'verified' | 'premium';
}

export interface UserSession {
  id: string;
  userId: string;
  device: string;
  browser: string;
  ip: string;
  location?: string;
  lastActive: string;
  createdAt: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export type NotificationType = 
  | 'APPLICATION' 
  | 'MESSAGE' 
  | 'JOB_UPDATE' 
  | 'SYSTEM' 
  | 'PAYMENT' 
  | 'REVIEW' 
  | 'ALERT';

export interface UserConnection {
  id: string;
  userId: string;
  connectedUserId: string;
  type: 'FOLLOW' | 'BLOCK' | 'FAVORITE';
  createdAt: string;
  connectedUser?: User;
}

export interface UserActivity {
  id: string;
  userId: string;
  type: ActivityType;
  description: string;
  metadata?: any;
  createdAt: string;
}

export type ActivityType = 
  | 'JOB_APPLIED' 
  | 'JOB_POSTED' 
  | 'PROFILE_VIEWED' 
  | 'MESSAGE_SENT' 
  | 'REVIEW_GIVEN' 
  | 'SETTINGS_CHANGED' 
  | 'LOGIN' 
  | 'LOGOUT';

export interface UserSearchHistory {
  id: string;
  userId: string;
  query: string;
  filters?: any;
  results: number;
  createdAt: string;
}

export interface UserBookmark {
  id: string;
  userId: string;
  jobId: string;
  folder?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  job?: any;
}

export interface UserReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: ReportReason;
  description: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
  actionTaken?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReportReason = 
  | 'SPAM' 
  | 'INAPPROPRIATE' 
  | 'SCAM' 
  | 'HARASSMENT' 
  | 'FAKE_PROFILE' 
  | 'OTHER';

export interface UserAnalytics {
  profileViews: number;
  jobViews: number;
  applicationRate: number;
  responseRate: number;
  completionRate: number;
  averageResponseTime: number;
  peakHours: Array<{
    hour: number;
    activity: number;
  }>;
  popularSkills: Array<{
    skill: string;
    views: number;
  }>;
}

// Enums
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned'
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

export enum PrivacyLevel {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS_ONLY = 'friends_only',
  CONNECTIONS_ONLY = 'connections_only'
}

// Constants
export const USER_ROLES = [
  { value: 'SEEKER', label: 'Job Seeker', description: 'Looking for work opportunities' },
  { value: 'EMPLOYER', label: 'Employer', description: 'Hiring for jobs' },
  { value: 'ADMIN', label: 'Administrator', description: 'Platform management' }
];

export const SKILL_CATEGORIES = [
  'Technical',
  'Creative',
  'Professional',
  'Manual Labor',
  'Customer Service',
  'Management',
  'Education',
  'Healthcare',
  'Hospitality',
  'Transportation',
  'Other'
];

export const EXPERIENCE_LEVELS = [
  { value: 'ENTRY', label: 'Entry Level (0-2 years)' },
  { value: 'INTERMEDIATE', label: 'Intermediate (2-5 years)' },
  { value: 'EXPERIENCED', label: 'Experienced (5-10 years)' },
  { value: 'EXPERT', label: 'Expert (10+ years)' }
];

export const AVAILABILITY_OPTIONS = [
  { value: 'FULL_TIME', label: 'Full Time', icon: 'calendar' },
  { value: 'PART_TIME', label: 'Part Time', icon: 'clock' },
  { value: 'WEEKENDS', label: 'Weekends Only', icon: 'sun' },
  { value: 'EVENINGS', label: 'Evenings Only', icon: 'moon' },
  { value: 'FLEXIBLE', label: 'Flexible', icon: 'refresh-cw' },
  { value: 'ON_CALL', label: 'On Call', icon: 'phone' }
];

export const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash', icon: 'dollar-sign' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: 'credit-card' },
  { value: 'PAYPAL', label: 'PayPal', icon: 'paypal' },
  { value: 'VENMO', label: 'Venmo', icon: 'smartphone' },
  { value: 'CASHAPP', label: 'Cash App', icon: 'dollar-sign' },
  { value: 'CRYPTO', label: 'Cryptocurrency', icon: 'bitcoin' }
];

// Helper functions
export function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getUserStatusColor(status: UserStatus): string {
  switch (status) {
    case UserStatus.ACTIVE:
      return 'text-green-600 bg-green-100';
    case UserStatus.INACTIVE:
      return 'text-yellow-600 bg-yellow-100';
    case UserStatus.SUSPENDED:
      return 'text-orange-600 bg-orange-100';
    case UserStatus.BANNED:
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'SEEKER':
      return 'Job Seeker';
    case 'EMPLOYER':
      return 'Employer';
    case 'ADMIN':
      return 'Administrator';
    default:
      return role;
  }
}

export function calculateUserRating(profile: Profile): {
  rating: number;
  stars: number[];
  percentage: number;
} {
  const rating = profile.rating || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(1); // Full star
    } else if (i === fullStars && hasHalfStar) {
      stars.push(0.5); // Half star
    } else {
      stars.push(0); // Empty star
    }
  }
  
  const percentage = (rating / 5) * 100;
  
  return {
    rating,
    stars,
    percentage
  };
}