export interface Book {
  _id: string;
  name: string;
  coverImage: string;
  coverImagePublicId: string;
  price: number;
  stock: number;
  description: string;
  author: string;
  categories: string[];
  averageRating: number;
  reviewCount: number;
  status: 'available' | 'out of stock' | string;
}