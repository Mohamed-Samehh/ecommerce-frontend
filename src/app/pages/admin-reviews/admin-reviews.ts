import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review/review-service';
import { Book } from '../../interfaces/book';
import { Review, ReviewUser } from '../../interfaces/review';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';

@Component({
    selector: 'app-admin-reviews',
    standalone: true,
    imports: [CommonModule, FormsModule, StarRatingComponent],
    templateUrl: './admin-reviews.html',
    styleUrl: './admin-reviews.css'
})
export class AdminReviewsComponent implements OnInit {
    private reviewService = inject(ReviewService);

    reviews = signal<Review[]>([]);
    filteredReviews = signal<Review[]>([]);
    searchTerm = signal<string>('');
    ratingFilter = signal<number>(0);
    isLoading = signal<boolean>(false);

    ngOnInit(): void {
        this.loadReviews();
    }

    loadReviews(): void {
        this.isLoading.set(true);
        this.reviewService.getAllReviews().subscribe({
            next: (response) => {
                const reviewsData = response.data;
                const flattened = Array.isArray(reviewsData) ? reviewsData : (reviewsData as any).data || [];
                this.reviews.set(flattened);
                this.applyFilters();
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to load admin reviews:', err);
                this.isLoading.set(false);
            }
        });
    }

    applyFilters(): void {
        const search = this.searchTerm().toLowerCase();
        const rating = this.ratingFilter();

        const filtered = this.reviews().filter(review => {
            const userName = this.getUserName(review).toLowerCase();
            const bookName = this.getBookName(review).toLowerCase();
            const comment = (review.comment || '').toLowerCase();

            const matchesSearch = userName.includes(search) ||
                bookName.includes(search) ||
                comment.includes(search);
            const matchesRating = rating === 0 || review.rating === rating;

            return matchesSearch && matchesRating;
        });

        this.filteredReviews.set(filtered);
    }

    // Helper for template access if needed, but signals are better
    updateSearch(term: string): void {
        this.searchTerm.set(term);
        this.applyFilters();
    }

    updateRating(rating: any): void {
        this.ratingFilter.set(Number(rating));
        this.applyFilters();
    }

    getUserName(review: Review): string {
        if (review.userId && typeof review.userId === 'object') {
            const user = review.userId as ReviewUser;
            return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
        }
        return 'User';
    }

    getBookName(review: Review): string {
        if (review.bookId && typeof review.bookId === 'object') {
            const book = review.bookId as Book;
            return book.name || (book as any).title || 'Unknown Book';
        }
        return 'Unknown Book';
    }

    deleteReview(id: string): void {
        if (confirm('Are you sure you want to delete this review?')) {
            this.reviewService.deleteReview(id).subscribe({
                next: () => {
                    this.reviews.update(prev => prev.filter(r => r._id !== id));
                    this.applyFilters();
                },
                error: (err) => {
                    console.error('Failed to delete review:', err);
                    alert('Failed to delete review.');
                }
            });
        }
    }
}
