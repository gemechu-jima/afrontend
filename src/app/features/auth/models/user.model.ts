export interface User {
  id: string;
  email: string;
  token?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}