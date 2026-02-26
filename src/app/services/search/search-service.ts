import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Category } from '../../interfaces/categories';
import { ApiResponse } from '../../interfaces/api-response';
import { Book } from '../../interfaces/book';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getAllCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`);
  }
  getAllBooks(query:string):Observable<ApiResponse<Book[]>>{
    return this.http.get<ApiResponse<Book[]>>(`${this.apiUrl}/books${query}`);
  }
}
