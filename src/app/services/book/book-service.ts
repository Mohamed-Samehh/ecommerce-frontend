import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../../interfaces/api-response';
import { Book } from '../../interfaces/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  apiUrl = `${environment.apiUrl}/books`;
  private http = inject(HttpClient);
  getAllBooks(query?:string,page = 1,limit=10):Observable<ApiResponse<Book[]>>{
    console.log('Fetching books with query:', query, 'page:', page, 'limit:', limit);
    return this.http.get<ApiResponse<Book[]>>(`${this.apiUrl}?page=${page}&limit=${limit}&${query ?? ''}`);
  }
  getBookById(id:string):Observable<ApiResponse<Book>>{
    return this.http.get<ApiResponse<Book>>(`${this.apiUrl}/${id}`);
  }
  createBook(body:FormData):Observable<ApiResponse<Book>>{
    return this.http.post<ApiResponse<Book>>(this.apiUrl,body);
  }
  updateBook(id:string,body:FormData):Observable<ApiResponse<Book>>{
    return this.http.patch<ApiResponse<Book>>(`${this.apiUrl}/${id}`,body);
  }
  replaceBook(id:string,body:FormData):Observable<ApiResponse<Book>>{
    return this.http.put<ApiResponse<Book>>(`${this.apiUrl}/${id}`,body);
  }
  deleteBook(id:string):Observable<ApiResponse<Book>>{
    return this.http.delete<ApiResponse<Book>>(`${this.apiUrl}/${id}`);
  }
}
