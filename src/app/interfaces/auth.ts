export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  roles: string[];
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface OtpRequest {
  email: string;
  otp: string;
}

export interface OtpSentResponse {
  message: string;
}

export interface AuthResponse {
  accessToken: string;
  // Regiser but not in login
  user?: User;
  message?: string;
}
