import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  getAllBooks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/books`);
  }

  getBookById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/books/${id}`);
  }
}
