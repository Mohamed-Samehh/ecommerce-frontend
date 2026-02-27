import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../../interfaces/api-response';
import { Author } from '../../interfaces/author';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  apiUrl = `${environment.apiUrl}/authors`;
  private http = inject(HttpClient);
  getAllAuthors(query?:string):Observable<ApiResponse<Author[]>>{
    return this.http.get<ApiResponse<Author[]>>(`${this.apiUrl}?${query ?? ''}`);
  }
  getAuthorById(id:string):Observable<ApiResponse<Author>>{
    return this.http.get<ApiResponse<Author>>(`${this.apiUrl}/${id}`);
  }
  createAuthor(author:Author):Observable<ApiResponse<Author>>{
    return this.http.post<ApiResponse<Author>>(this.apiUrl,author);
  }
  updateAuthor(id:string,author:Partial<Author>):Observable<ApiResponse<Author>>{
    return this.http.patch<ApiResponse<Author>>(`${this.apiUrl}/${id}`,author);
  }
  replaceAuthor(id:string,author:Author):Observable<ApiResponse<Author>>{
    return this.http.put<ApiResponse<Author>>(`${this.apiUrl}/${id}`,author);
  }
  deleteAuthor(id:string):Observable<ApiResponse<Author>>{
    return this.http.delete<ApiResponse<Author>>(`${this.apiUrl}/${id}`);
  }
}
