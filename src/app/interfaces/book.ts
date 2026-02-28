import { Author } from './author';
import { Category } from './categories';

export interface Book {
  _id: string;
  id?: string;
  name: string;
  coverImage: string;
  coverImagePublicId: string;
  price: number;
  stock: number;
  description: string;
  author: string | Author;
  authorId?: string | Author;
  categories: (string | Category)[];
  averageRating: number;
  reviewCount: number;
  status: 'available' | 'out of stock' | string;
  isDeleted:boolean;
}