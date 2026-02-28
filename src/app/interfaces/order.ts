import { Book } from './book';

export interface OrderItem {
  bookId: string | Book;
  bookName?: string;
  imageUrl?: string;
  quantity: number;
  priceAtPurchase?: number;
  subtotal?: number;
}

export interface ShippingAddress {
  country: string;
  city: string;
  street: string;
  postalCode: string;
}

export interface PopulatedUser {
  id?: string;
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Order {
  _id?: string;
  userId: string | PopulatedUser;
  orderNumber?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'success' | 'paid';
  paymentMethod: 'COD' | 'Online';
  totalAmount: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
