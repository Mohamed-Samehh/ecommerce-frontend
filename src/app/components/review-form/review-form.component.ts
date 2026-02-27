import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review/review-service';
import { OrderService } from '../../services/order/order-service';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { AuthService } from '../../services/auth/auth';
import { Order, OrderItem } from '../../interfaces/order'; // English comment: Using your existing interfaces
import { Book } from '../../interfaces/book';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css'
})
export class ReviewFormComponent implements OnInit {
  @Input() bookId!: string;
  @Output() reviewAdded = new EventEmitter<void>();

  private readonly reviewService = inject(ReviewService);
  private readonly orderService = inject(OrderService);
  private readonly authService = inject(AuthService);

  rating = 0;
  comment = '';
  isPurchased = false;
  hasAlreadyReviewed = false;
  isSubmitting = false;
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.initializeComponent();
  }

  async initializeComponent(): Promise<void> {
    this.isLoading = true;

    const token = this.authService.token();
    if (!token) {
      this.isPurchased = false;
      this.isLoading = false;
      return;
    }

    try {
      await this.checkPurchaseStatus();
    } catch {
      this.error = 'Error during review form initialization';
    } finally {
      this.isLoading = false;
    }
  }

  checkPurchaseStatus(): Promise<void> {
    return new Promise((resolve) => {
      this.orderService.getMyOrders().subscribe({
        next: (response) => {
          const orders = (response.data || []) as Order[];

          this.isPurchased = orders.some((order: Order) =>
            order.status === 'delivered' &&
            order.items.some((item: OrderItem) => {
              const bookData = item.bookId;
              const itemId = (bookData && typeof bookData === 'object' && '_id' in bookData)
                ? (bookData as Book)._id
                : (bookData as string);

              return itemId === this.bookId;
            })
          );
          resolve();
        },
        error: () => {
          this.isPurchased = false;
          resolve();
        }
      });
    });
  }

  submitReview(): void {
    if (this.rating === 0) {
      this.error = 'Please select a rating.';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    this.reviewService.addReview({
      bookId: this.bookId,
      rating: this.rating,
      comment: this.comment
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.rating = 0;
        this.comment = '';
        this.hasAlreadyReviewed = true;
        this.reviewAdded.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = err.error?.message || 'Failed to submit review.';
      }
    });
  }
}