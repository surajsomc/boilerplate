import { API_CONFIG, ENDPOINTS } from '../config/api';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  interests?: string;
  skills?: string;
  experience?: string;
  education?: string;
  social?: string;
  projects?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface ProfileResponse {
  profile: Profile;
  message?: string;
}

export interface SearchResponse {
  profiles: Profile[];
  total: number;
  limit: number;
  offset: number;
}

export interface UploadResponse {
  filename: string;
  url: string;
  message?: string;
}

class ProfileAPI {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.token = null;
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
  }

  // Get headers with authentication
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic request method with error handling
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Authentication Methods
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const result = await this.makeRequest<AuthResponse>(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });

    if (result.token) {
      this.setToken(result.token);
    }

    return result;
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const result = await this.makeRequest<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (result.token) {
      this.setToken(result.token);
    }

    return result;
  }

  async getCurrentUser(): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>(ENDPOINTS.AUTH.ME);
  }

  // Profile Methods
  async createProfile(profileData: Partial<Profile>): Promise<ProfileResponse> {
    return this.makeRequest<ProfileResponse>(ENDPOINTS.PROFILE.CREATE, {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  }

  async getProfile(): Promise<ProfileResponse> {
    return this.makeRequest<ProfileResponse>(ENDPOINTS.PROFILE.GET_ME);
  }

  async updateProfile(profileData: Partial<Profile>): Promise<ProfileResponse> {
    return this.makeRequest<ProfileResponse>(ENDPOINTS.PROFILE.UPDATE_ME, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async searchProfiles(
    query: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<SearchResponse> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      offset: offset.toString(),
    });

    return this.makeRequest<SearchResponse>(`${ENDPOINTS.PROFILE.SEARCH}?${params}`);
  }

  // Upload Methods
  async uploadProfilePicture(imageUri: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile-picture.jpg',
    } as any);

    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const url = `${this.baseURL}${ENDPOINTS.UPLOAD.PROFILE_PICTURE}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Upload failed');
    }
  }

  // Utility Methods
  clearToken() {
    this.token = null;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Create a singleton instance
const api = new ProfileAPI();
export default api; 