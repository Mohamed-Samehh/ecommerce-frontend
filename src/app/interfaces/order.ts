import { Book } from './book';

export interface OrderItem {
  bookId: string | Book;
  bookName: string;
  imageUrl?: string;
  quantity: number;
  priceAtPurchase: number;
  subtotal: number;
}

export interface ShippingAddress {
  country: string;
  city: string;
  street: string;
  postalCode: string;
}

export interface Order {
  _id?: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  status: 'processing' | 'out for delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'success';
  paymentMethod: 'COD' | 'Online';
  totalAmount: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
