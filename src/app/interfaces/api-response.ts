export interface ApiResponse<T>{
  status:string;
  data:T;
  message?:string
  totalBooks?: number;
  currentPage?: number;
  pageSize?: number;
}