// types/api.ts
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  [key: string]: any;
}

export interface JobQueryParams extends QueryParams {
  category?: string;
  jobType?: string;
  payType?: string;
  minPay?: number;
  maxPay?: number;
  location?: string;
  radius?: number;
  status?: string;
  employerId?: string;
  seekerId?: string;
  timeRange?: 'today' | 'week' | 'month' | 'year';
}

export interface MessageQueryParams extends QueryParams {
  userId?: string;
  conversationId?: string;
  unreadOnly?: boolean;
}

export interface NotificationQueryParams extends QueryParams {
  type?: string;
  unreadOnly?: boolean;
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
  publicId?: string;
}

export interface SearchResponse {
  jobs: any[];
  users: any[];
  posts: any[];
  total: number;
}

export interface NearbyJobsParams {
  latitude: number;
  longitude: number;
  radius?: number;
  limit?: number;
}

export interface StatsResponse {
  totalJobs: number;
  activeUsers: number;
  completedJobs: number;
  totalEarnings: number;
  averageRating: number;
  topCategories: Array<{ name: string; count: number }>;
  recentActivity: any[];
}

export interface AuthResponse {
  user: User;
  token?: string;
  session: {
    expires: string;
    maxAge: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface BulkOperationResponse {
  success: number;
  failed: number;
  errors: Array<{
    id: string;
    error: string;
  }>;
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf';
  fields: string[];
  startDate?: string;
  endDate?: string;
}

export interface ImportResult {
  imported: number;
  skipped: number;
  errors: Array<{
    row: number;
    error: string;
    data: any;
  }>;
}

// Socket.io types
export interface SocketEvent {
  type: string;
  payload: any;
  timestamp: string;
  userId?: string;
}

export interface MessageEvent {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface TypingEvent {
  userId: string;
  receiverId: string;
  isTyping: boolean;
}

export interface NotificationEvent {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface JobUpdateEvent {
  jobId: string;
  type: 'created' | 'updated' | 'deleted' | 'status_changed';
  data: any;
  timestamp: string;
}

export interface ApplicationUpdateEvent {
  applicationId: string;
  jobId: string;
  type: 'created' | 'updated' | 'deleted' | 'status_changed';
  data: any;
  timestamp: string;
}

// Request/Response types for specific endpoints
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'SEEKER' | 'EMPLOYER' | 'ADMIN';
}

export interface JobCreateRequest {
  title: string;
  description: string;
  category: string;
  jobType: 'CASUAL' | 'LONG_TERM' | 'ONE_TIME';
  payAmount?: number;
  payType?: 'HOURLY' | 'FIXED' | 'NEGOTIABLE';
  startTime?: string;
  endTime?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
  };
}

export interface JobUpdateRequest extends Partial<JobCreateRequest> {
  status?: 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'UNAVAILABLE';
}

export interface ApplicationCreateRequest {
  jobId: string;
  message?: string;
}

export interface ApplicationUpdateRequest {
  status: 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
}

export interface ProfileUpdateRequest {
  bio?: string;
  skills?: string[];
  experience?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
  };
}

export interface PortfolioCreateRequest {
  title: string;
  description: string;
  mediaUrls: string[];
  category: string;
}

export interface PostCreateRequest {
  title: string;
  content: string;
  mediaUrls?: string[];
  category: string;
}

export interface CommentCreateRequest {
  postId: string;
  content: string;
}

export interface LikeRequest {
  postId: string;
}

export interface CalendarEventCreateRequest {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  jobId?: string;
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface SettingsUpdateRequest {
  notifications?: {
    email: boolean;
    push: boolean;
    jobAlerts: boolean;
    messages: boolean;
    promotions: boolean;
  };
  privacy?: {
    profileVisibility: 'PUBLIC' | 'REGISTERED' | 'PRIVATE';
    showOnlineStatus: boolean;
    allowMessages: 'EVERYONE' | 'CONNECTIONS' | 'NO_ONE';
  };
  location?: {
    enabled: boolean;
    radius: number;
  };
  appearance?: {
    theme: 'light' | 'dark' | 'system';
    primaryColor: string;
  };
}