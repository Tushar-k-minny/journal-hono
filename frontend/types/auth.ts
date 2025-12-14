export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateProfileData {
  displayName?: string;
  avatarUrl?: string | null;
}
