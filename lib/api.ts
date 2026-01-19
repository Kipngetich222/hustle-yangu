// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface ApiError extends Error {
  status?: number;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error: ApiError = new Error(`API Error: ${response.statusText}`);
        error.status = response.status;
        
        try {
          const errorData = await response.json();
          error.message = errorData.error || error.message;
        } catch {
          // If response is not JSON, keep the default message
        }
        
        throw error;
      }

      // Handle empty responses
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ user: any; token?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }) {
    return this.request<{ user: any; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Jobs
  async getJobs(filters?: any) {
    const query = new URLSearchParams(filters || {}).toString();
    return this.request<any[]>(`/jobs${query ? `?${query}` : ''}`);
  }

  async getJob(id: string) {
    return this.request<any>(`/jobs/${id}`);
  }

  async createJob(data: any) {
    return this.request<any>('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJob(id: string, data: any) {
    return this.request<any>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJob(id: string) {
    return this.request(`/jobs/${id}`, { method: 'DELETE' });
  }

  // Applications
  async getApplications() {
    return this.request<any[]>('/applications');
  }

  async applyForJob(jobId: string, message?: string) {
    return this.request<any>('/applications', {
      method: 'POST',
      body: JSON.stringify({ jobId, message }),
    });
  }

  async updateApplicationStatus(id: string, status: string) {
    return this.request<any>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Messages
  async getConversations() {
    return this.request<any[]>('/messages');
  }

  async getConversation(userId: string) {
    return this.request<any>(`/messages/${userId}`);
  }

  async sendMessage(receiverId: string, content: string) {
    return this.request<any>('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId, content }),
    });
  }

  // Profile
  async getProfile() {
    return this.request<any>('/profile');
  }

  async updateProfile(data: any) {
    return this.request<any>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUserProfile(userId: string) {
    return this.request<any>(`/profile/${userId}`);
  }

  // Portfolio
  async getPortfolio() {
    return this.request<any[]>('/portfolio');
  }

  async createPortfolioItem(data: any) {
    return this.request<any>('/portfolio', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePortfolioItem(id: string, data: any) {
    return this.request<any>(`/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePortfolioItem(id: string) {
    return this.request(`/portfolio/${id}`, { method: 'DELETE' });
  }

  // Calendar
  async getCalendarEvents() {
    return this.request<any[]>('/calendar');
  }

  async createCalendarEvent(data: any) {
    return this.request<any>('/calendar', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCalendarEvent(id: string, data: any) {
    return this.request<any>(`/calendar/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCalendarEvent(id: string) {
    return this.request(`/calendar/${id}`, { method: 'DELETE' });
  }

  // Posts
  async getPosts(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request<any[]>(`/posts${query}`);
  }

  async createPost(data: any) {
    return this.request<any>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async likePost(postId: string) {
    return this.request(`/posts/${postId}/like`, { method: 'POST' });
  }

  // Upload
  async uploadFile(file: File, type: 'image' | 'document' | 'video') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request<{ url: string; filename: string }>('/upload', {
      method: 'POST',
      headers: {},
      body: formData,
    });
  }

  // Notifications
  async getNotifications() {
    return this.request<any[]>('/notifications');
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/notifications/${id}/read`, { method: 'PUT' });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', { method: 'PUT' });
  }

  // Search
  async searchJobs(query: string, filters?: any) {
    const params = new URLSearchParams({ q: query, ...filters });
    return this.request<any[]>(`/search/jobs?${params}`);
  }

  async searchUsers(query: string) {
    return this.request<any[]>(`/search/users?q=${query}`);
  }

  // Nearby Jobs
  async getNearbyJobs(lat: number, lng: number, radius: number = 10) {
    return this.request<any[]>(`/jobs/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
  }

  // Statistics
  async getDashboardStats() {
    return this.request<any>('/stats/dashboard');
  }

  async getUserStats(userId: string) {
    return this.request<any>(`/stats/user/${userId}`);
  }
}

export const api = new ApiClient();