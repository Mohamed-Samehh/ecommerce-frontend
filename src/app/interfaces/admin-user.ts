export interface AdminUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface GetAdminUsersResponse {
  data: AdminUser[];
  pagination: UsersPagination;
}

export interface CreateAdminUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  password: string;
  isAdmin: boolean;
}

export interface UpdateAdminUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  password?: string;
  isAdmin?: boolean;
}

export interface AdminUserMutationResponse {
  message: string;
  data: AdminUser;
}

export interface AdminUserDeleteResponse {
  message: string;
}
