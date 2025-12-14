import type {
  ActivityStreak,
  ApiError,
  DashboardRecent,
  MoodSummary,
  MoodTrend,
  PaginatedResponse,
  TagFrequency,
  WordCountTrend,
} from "@/types/api";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileData,
  User,
} from "@/types/auth";
import type {
  CreateEntryData,
  Entry,
  EntryFilters,
  UpdateEntryData,
} from "@/types/entry";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

class ApiClientError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.errors = errors;
  }
}

class ApiClient {
  readonly baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>).Authorization =
        `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          message: response.statusText || "An error occurred",
          status: response.status,
        };
      }
      throw new ApiClientError(
        errorData.message,
        response.status,
        errorData.errors
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }
    // console.log(await response.json())

    return response.json();
  }

  // Auth endpoints
  async register(data: RegisterCredentials): Promise<AuthResponse> {
    return await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginCredentials): Promise<AuthResponse> {
    return await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    return await this.request<void>("/auth/logout", {
      method: "POST",
    });
  }

  async getProfile(): Promise<User> {
    return await this.request<User>("/auth/profile");
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    return await this.request<User>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Entries endpoints
  async getEntries(filters?: EntryFilters): Promise<PaginatedResponse<Entry>> {
    const params = new URLSearchParams();
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            for (const v of value) {
              params.append(key, v);
            }
          } else {
            params.append(key, String(value));
          }
        }
      }
    }
    const query = params.toString();
    return await this.request<PaginatedResponse<Entry>>(
      `/entries${query ? `?${query}` : ""}`
    );
  }

  async getEntry(id: string): Promise<Entry> {
    return await this.request<Entry>(`/entries/${id}`);
  }

  async createEntry(data: CreateEntryData): Promise<Entry> {
    return await this.request<Entry>("/entries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateEntry(id: string, data: UpdateEntryData): Promise<Entry> {
    return await this.request<Entry>(`/entries/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteEntry(id: string): Promise<void> {
    return await this.request<void>(`/entries/${id}`, {
      method: "DELETE",
    });
  }

  async totalEntries(): Promise<{ total: number }> {
    return await this.request<{ total: number }>("/entries/total");
  }

  // Dashboard endpoints
  async getDashboardRecent(limit?: number): Promise<DashboardRecent> {
    const params = limit ? `?limit=${limit}` : "";
    return await this.request<DashboardRecent>(`/dashboard/recent${params}`);
  }

  async getMoodSummary(limit?: number): Promise<MoodSummary[]> {
    const params = limit ? `?limit=${limit}` : "";
    return await this.request<MoodSummary[]>(
      `/dashboard/mood-summary${params}`
    );
  }

  // Analytics endpoints
  async getMoodTrend(days?: number): Promise<MoodTrend[]> {
    const params = days ? `?days=${days}` : "";
    return await this.request<MoodTrend[]>(`/analytics/mood-trend${params}`);
  }

  async getWordCountTrend(days?: number): Promise<WordCountTrend[]> {
    const params = days ? `?days=${days}` : "";
    return await this.request<WordCountTrend[]>(
      `/analytics/word-count${params}`
    );
  }

  async getTagFrequency(days?: number): Promise<TagFrequency[]> {
    const params = days ? `?days=${days}` : "";
    return await this.request<TagFrequency[]>(
      `/analytics/tag-frequency${params}`
    );
  }

  async getActivityStreak(): Promise<ActivityStreak> {
    return await this.request<ActivityStreak>("/analytics/activity-streak");
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export { ApiClientError };
