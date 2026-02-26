import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { Order } from '../../interfaces/order';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = `${environment.apiUrl}/order`;

  private getHeaders(): HttpHeaders {
    let token = '';
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  createOrder(orderData: Partial<Order>): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(this.apiUrl, orderData, { headers: this.getHeaders() });
  }

  getMyOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(`${this.apiUrl}/my`, { headers: this.getHeaders() });
  }

  getAllOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(this.apiUrl, { headers: this.getHeaders() });
  }

  updateOrderStatus(orderId: string, status: string): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.apiUrl}/${orderId}/status`, { status }, { headers: this.getHeaders() });
  }

  updatePaymentStatus(orderId: string, paymentStatus: string): Observable<ApiResponse<Order>> {
    return this.http.patch<ApiResponse<Order>>(`${this.apiUrl}/${orderId}/payment`, { paymentStatus }, { headers: this.getHeaders() });
  }
}