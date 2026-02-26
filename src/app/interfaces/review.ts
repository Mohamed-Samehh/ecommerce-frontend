export interface ReviewUser {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface Review {
  _id?: string;
  userId: string | ReviewUser;
  bookId: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
}