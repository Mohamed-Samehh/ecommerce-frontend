export interface Book {
  _id: string;
  name: string;
  coverImage: string;
  coverImagePublicId: string;
  price: number;
  stock: number;
  authorId: string;
  categories: string[];
  description: string;
  updatedAt: string | Date;
  averageRating: number;
  reviewCount: number;
}