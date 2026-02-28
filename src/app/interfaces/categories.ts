export interface Category {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface CategoryResponse {
  status: string;
  data: Category[];
}

export interface SingleCategoryResponse {
  status: string;
  data: Category;  // Single object
}

export interface DeleteResponse {
  status: string;
  message: string;
}