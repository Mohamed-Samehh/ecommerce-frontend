import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../services/review/review-service';
import { Review, ReviewUser } from '../../interfaces/review';
import { Book } from '../../interfaces/book';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
    selector: 'app-reviews-list',
    standalone: true,
    imports: [CommonModule, StarRatingComponent],
    templateUrl: './reviews-list.component.html',
    styleUrl: './reviews-list.component.css'
})
export class ReviewsListComponent implements OnInit {
    @Input() bookId!: string;

    private reviewService = inject(ReviewService);

    reviews: Review[] = [];
    isLoading = true;
    error: string | null = null;
    currentUserId: string | null = null;
    userRoles: string[] = [];

    ngOnInit(): void {
        this.loadReviews();
        this.setCurrentUserId();
    }

    setCurrentUserId(): void {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                this.currentUserId = payload.id;
                this.userRoles = payload.roles || [];
            } catch (e) {
                console.error('Error decoding token', e);
            }
        }
    }

    loadReviews(): void {
        this.isLoading = true;
        this.reviewService.getBookReviews(this.bookId).subscribe({
            next: (response: any) => {
                // Backend returns { status: 'success', data: [...] }
                this.reviews = response.data || [];
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load reviews', err);
                this.error = 'Could not load reviews.';
                this.isLoading = false;
            }
        });
    }

    canDelete(review: Review): boolean {
        if (!this.currentUserId) return false;
        if (this.userRoles.includes('admin')) return true;
        const userId = typeof review.userId === 'string' ? review.userId : (review.userId as ReviewUser)._id;
        return userId === this.currentUserId;
    }

    deleteReview(reviewId: string): void {
        if (confirm('Are you sure you want to delete this review?')) {
            this.reviewService.deleteReview(reviewId).subscribe({
                next: () => {
                    this.reviews = this.reviews.filter(r => r._id !== reviewId);
                },
                error: (err) => {
                    console.error('Failed to delete review', err);
                    alert('Failed to delete review.');
                }
            });
        }
    }

    getUserName(review: Review): string {
        if (typeof review.userId === 'object') {
            return `${(review.userId as ReviewUser).firstName} ${(review.userId as ReviewUser).lastName}`;
        }
        return 'User';
    }
}
