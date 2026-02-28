import { Component, Input, Output, EventEmitter, inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review/review-service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule, StarRatingComponent],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css'
})
export class ReviewFormComponent implements OnChanges {
  @Input() bookId!: string;
  @Input() hasAlreadyReviewed = false;
  @Input() initialRating = 0;
  @Input() initialComment = '';
  @Output() reviewAdded = new EventEmitter<void>();

  private readonly reviewService = inject(ReviewService);

  rating = 0;
  comment = '';
  isPurchased = true;
  isSubmitting = false;
  isLoading = false;
  error: string | null = null;

  ngOnChanges(): void {
    if (this.hasAlreadyReviewed) {
      this.rating = this.initialRating;
      this.comment = this.initialComment;
    }
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