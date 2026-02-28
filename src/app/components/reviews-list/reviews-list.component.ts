import { Component, Input, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../services/review/review-service';
import { Review, ReviewUser } from '../../interfaces/review';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-reviews-list',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  templateUrl: './reviews-list.component.html',
  styleUrl: './reviews-list.component.css'
})
export class ReviewsListComponent implements OnInit, OnChanges {
  private _bookId: string | undefined;

  @Input() set bookId(value: string | undefined) {
    this._bookId = value;
    if (value) {
      this.loadReviews();
    }
  }

  get bookId(): string | undefined {
    return this._bookId;
  }

  private readonly reviewService = inject(ReviewService);

  reviews: Review[] = [];
  isLoading = false;
  error: string | null = null;
  currentUserId: string | null = null;

  ngOnInit(): void {
    // English comment: Initialize current user info for delete permissions
    this.setCurrentUserId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookId']) {
      // If the setter didn't trigger loadReviews (which it should), this is our backup
      if (changes['bookId'].currentValue && !this.isLoading && this.reviews.length === 0) {
        this.loadReviews();
      }
    }
  }

  loadReviews(): void {
    if (!this.bookId) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.reviewService.getBookReviews(this.bookId).subscribe({
      next: (response) => {
        this.reviews = response.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load reviews:', err);
        this.error = err?.error?.message || 'Failed to load reviews';
        this.isLoading = false;
        this.reviews = [];
      }
    });
  }

  private setCurrentUserId(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          this.currentUserId = payload.id || payload._id;
        } catch {
          this.currentUserId = null;
        }
      }
    }
  }

  getUserName(review: Review): string {
    if (review.userId && typeof review.userId === 'object') {
      const user = review.userId as ReviewUser;
      return `${user.firstName} ${user.lastName}`;
    }
    return 'Anonymous User';
  }

  canDelete(review: Review): boolean {
    if (!this.currentUserId) return false;
    const reviewOwnerId = typeof review.userId === 'object'
      ? (review.userId as ReviewUser)._id
      : review.userId;
    return reviewOwnerId === this.currentUserId;
  }

  deleteReview(id: string): void {
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviewService.deleteReview(id).subscribe({
        next: () => this.loadReviews(),
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }
}
