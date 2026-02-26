import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../services/review/review-service';
import { OrderService } from '../../services/order/order-service';
import { Book } from '../../interfaces/book';
import { StarRatingComponent } from '../star-rating/star-rating.component';

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

    private reviewService = inject(ReviewService);
    private orderService = inject(OrderService);

    rating: number = 0;
    comment: string = '';
    isPurchased: boolean = false;
    hasAlreadyReviewed: boolean = false;
    isSubmitting: boolean = false;
    isLoading: boolean = true;
    error: string | null = null;

    ngOnInit(): void {
        this.initializeComponent();
    }

    async initializeComponent(): Promise<void> {
        this.isLoading = true;
        try {
            await this.checkPurchaseStatus();
        } catch (err) {
            console.error('Error during review form initialization', err);
        } finally {
            this.isLoading = false;
        }
    }

    checkPurchaseStatus(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.orderService.getMyOrders().subscribe({
                next: (response) => {
                    const orders = response.data || [];
                    this.isPurchased = orders.some((order: any) =>
                        order.status === 'delivered' &&
                        order.items.some((item: any) => {
                            const itemId = item.bookId?._id || item.bookId?.id || item.bookId;
                            return itemId === this.bookId;
                        })
                    );
                    resolve();
                },
                error: (err) => {
                    console.error('Failed to check purchase status', err);
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
