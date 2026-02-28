import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { SingleCategoryResponse, DeleteResponse, CategoryResponse } from '../../interfaces/categories';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Category {
  private apiUrl = environment.apiUrl + '/categories';

  private http = inject(HttpClient);
  // get all cat.
  getAllCategories():Observable<CategoryResponse> { // ret from backend {status: 'success', data: category}
    return this.http.get<CategoryResponse>(this.apiUrl);
  }
  createCategory(categoryName:string):Observable<SingleCategoryResponse> {
    return this.http.post<SingleCategoryResponse>(this.apiUrl, { name: categoryName });
  }
  updateCategory(id:string, categoryName: string):Observable<SingleCategoryResponse>  { // id is objID which is string
    return this.http.patch<SingleCategoryResponse>(`${this.apiUrl}/${id}`, { name: categoryName });
  }
  removeCategory(id:string):Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }

}

// in admin category needs all categories
// call categoryService.getAll()
// service ret data in obserbable type

// shown in table

// SERVICE
// Service take req from component
// send req to backend /categories
// wait for response (observabale)
// return data to comp

// use httpclient to send req to backend (tool to make request)(get, post, put, delete)

// to use httpclient & service need to import or inj them

// What happens:

// Request sent to backend
// Backend returns JSON
// TypeScript checks: "Does this JSON match CategoryResponse?"
// If yes continues
// else shows error