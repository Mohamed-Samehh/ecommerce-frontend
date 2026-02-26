import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { Order } from '../../interfaces/order';
import { environment } from '../../../environments/environment';

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

  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderData, { headers: this.getHeaders() });
  }

  getMyOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/my`, { headers: this.getHeaders() });
  }

  getAllOrders(): Observable<any> {
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() });
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${orderId}/status`, { status }, { headers: this.getHeaders() });
  }

  updatePaymentStatus(orderId: string, paymentStatus: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${orderId}/payment`, { paymentStatus }, { headers: this.getHeaders() });
  }
}