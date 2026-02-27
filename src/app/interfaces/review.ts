import { Book } from './book';
import { PopulatedUser } from './order';

export interface ReviewUser {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Review {
  _id?: string;
  userId: string | ReviewUser | PopulatedUser;
  bookId: string | Book;
  rating: number;
  comment?: string;
  createdAt?: string;
}