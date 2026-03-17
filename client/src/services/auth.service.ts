import { axiosInstance } from "@/lib/axios";

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
  convertGuestAccount?: boolean;
}

export interface SignupResponse {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "staff" | "user";
  verified: boolean;
  profilePic?: string;
  message: string;
}

export interface CheckEmailResponse {
  exists: boolean;
  isGuest: boolean;
  hasPassword: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "staff" | "user";
  verified: boolean;
  profilePic?: string;
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export interface CheckResponse {
  id: string;
  email: string;
  role: string;
  verified: boolean;
}

// Ravindu
export interface UpdateProfilePayload {
  username?: string;
  password?: string;
}

export interface UpdateProfileResponse {
  _id: string;
  username: string;
  email: string;
  role: string;
}

export const signup = (data: SignupPayload) => {
  return axiosInstance.post<SignupResponse>("/auth/signup", data);
};

export const login = (data: LoginPayload) => {
  return axiosInstance.post<LoginResponse>("/auth/login", data);
};

export const logout = () => {
  return axiosInstance.post<LogoutResponse>("/auth/logout");
};

export const check = () => {
  return axiosInstance.get<CheckResponse>("/auth/check");
};

export const checkEmail = (email: string) => {
  return axiosInstance.post<CheckEmailResponse>("/auth/check-email", { email });
};

// Ravindu
export const updateProfile = (data: UpdateProfilePayload) => {
  // We use axiosInstance so it automatically sends cookies/credentials
  return axiosInstance.put<UpdateProfileResponse>("/profile", data);
};
