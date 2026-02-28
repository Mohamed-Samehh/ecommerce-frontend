import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  AdminUserDeleteResponse,
  AdminUserMutationResponse,
  CreateAdminUserRequest,
  GetAdminUsersResponse,
  UpdateAdminUserRequest
} from '../../interfaces/admin-user';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  getUsers(page = 1, limit = 100, search = '', role = '') {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    if (role.trim()) {
      params = params.set('role', role.trim());
    }

    return this.http.get<GetAdminUsersResponse>(this.baseUrl, { params });
  }

  createUser(payload: CreateAdminUserRequest) {
    return this.http.post<AdminUserMutationResponse>(this.baseUrl, payload);
  }

  updateUser(userId: string, payload: UpdateAdminUserRequest) {
    return this.http.put<AdminUserMutationResponse>(`${this.baseUrl}/${userId}`, payload);
  }

  deleteUser(userId: string) {
    return this.http.delete<AdminUserDeleteResponse>(`${this.baseUrl}/${userId}`);
  }
}
