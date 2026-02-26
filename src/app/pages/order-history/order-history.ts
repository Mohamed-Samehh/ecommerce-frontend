import { Component, OnInit, inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderService } from '../../services/order/order-service';
import { Book } from '../../interfaces/book';
import { Order, OrderItem } from '../../interfaces/order';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistory implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  orders: Order[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('token');

    if (!token) {
      this.error = 'You are not logged in. Please log in to view your orders.';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.orderService.getMyOrders().subscribe({
      next: (response: { data?: (Omit<Order, 'items'> & { items: any[] })[] }) => {
        const fetchedOrders: Order[] = (response.data || []).map((order) => ({
          ...order,
          items: (order.items || []).map((item: any) => {
            let imageUrl = '';
            let bookIdStr = '';

            const bookRef = item.bookId;
            if (typeof bookRef === 'string') {
              bookIdStr = bookRef;
            } else if (bookRef && typeof bookRef === 'object') {
              const book = bookRef as Book;
              imageUrl = book.coverImage || '';
              bookIdStr = (book as any)._id || book.id || '';
            }

            return {
              bookId: bookIdStr,
              bookName: item.bookName || '',
              imageUrl,
              quantity: item.quantity ?? 1,
              priceAtPurchase: item.priceAtPurchase ?? 0,
              subtotal: item.subtotal ?? ((item.priceAtPurchase ?? 0) * (item.quantity ?? 1))
            } as OrderItem;
          })
        }));

        this.orders = fetchedOrders;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: unknown) => {
        // Prefer structured handling for HTTP errors
        if (err instanceof HttpErrorResponse && err.status === 401) {
          this.error = 'Your session has expired or you are unauthorized. Please log in again.';
        } else {
          this.error = 'Could not load your orders. Please try again later.';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goToBookDetails(bookId: string | { _id?: string; id?: string } | undefined, review = false): void {
    let id: string | null = null;

    if (typeof bookId === 'string') {
      id = bookId;
    } else if (bookId) {
      id = bookId._id || bookId.id || null;
    }

    if (!id) return;

    const navExtras = review ? { fragment: 'reviews-section' } : {};
    this.router.navigate(['/book', id], navExtras);
  }

  devLogin(): void {
    if (isPlatformBrowser(this.platformId)) {
      const devToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OWY1Y2Q2MTk0MDg0N2JmNTMwNDA3NSIsImVtYWlsIjoiYWxhYWFiZGFsbGFoMzMzNkBnbWFpbC5jb20iLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTc3MjA1MTY3MSwiZXhwIjoxNzczMzQ3NjcxfQ.052DCthUveRKWn2aTuXYaaEYM31-BCCWmFjofDDfwws';
      localStorage.setItem('token', devToken);
      this.fetchOrders();
    }
  }
}