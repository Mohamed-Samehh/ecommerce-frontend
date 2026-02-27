import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Footer } from '../../components/footer/footer';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { Book } from '../../interfaces/book';
import { BookService } from '../../services/book/book-service';
import { OrderService } from '../../services/order/order-service';
import { ReviewFormComponent } from '../../components/review-form/review-form.component';
import { ReviewsListComponent } from '../../components/reviews-list/reviews-list.component';
import { Author } from '../../interfaces/author';
import { Category } from '../../interfaces/categories';
import { Order, OrderItem } from '../../interfaces/order';

type AuthorLike = Author | string | null | undefined;
type CategoryLike = Category | string;

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavBar,
    Footer,
    ReviewsListComponent,
    ReviewFormComponent
  ],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css'
})
export class BookDetails implements OnInit {
  @ViewChild('reviewsList') reviewsList!: ReviewsListComponent;

  private readonly route = inject(ActivatedRoute);
  private readonly bookService = inject(BookService);
  private readonly orderService = inject(OrderService);

  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly book = signal<Book | null>(null);
  readonly canReview = signal<boolean>(false);
  readonly isCheckingEligibility = signal<boolean>(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading.set(false);
      this.error.set('Missing book id.');
      return;
    }
    this.loadData(id);
  }

  loadData(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.bookService.getBookById(id).subscribe({
      next: (res) => {
        const bookData = res.data;
        // Normalize author nested data if needed
        if (!bookData.author && bookData.authorId) {
          bookData.author = bookData.authorId;
        }

        this.book.set(bookData);
        this.isLoading.set(false);
        this.checkUserEligibility(id);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.error.set(err?.error?.message || 'Failed to load book details.');
      }
    });
  }

  onReviewAdded(): void {
    const b = this.book();
    if (b) {
      const bookId = b.id || b._id;
      this.loadData(bookId);
      if (this.reviewsList) {
        this.reviewsList.loadReviews();
      }
    }
  }

  private checkUserEligibility(bookId: string): void {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      this.canReview.set(false);
      return;
    }

    this.isCheckingEligibility.set(true);
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        const orders = (res.data || []) as Order[];
        const hasDeliveredOrder = orders.some((order: Order) =>
          order.status === 'delivered' &&
          order.items.some((item: OrderItem) => {
            const bookData = item.bookId;
            const id = (bookData && typeof bookData === 'object' && '_id' in bookData)
              ? (bookData as Book)._id
              : (bookData as string);
            return id === bookId;
          })
        );
        this.canReview.set(hasDeliveredOrder);
        this.isCheckingEligibility.set(false);
      },
      error: () => {
        this.canReview.set(false);
        this.isCheckingEligibility.set(false);
      }
    });
  }

  authorName(author: AuthorLike): string {
    if (!author) return 'Unknown';
    if (typeof author === 'string') return author;
    return author.name || 'Unknown';
  }

  authorBio(author: AuthorLike): string | null {
    if (!author || typeof author === 'string') return null;
    return author.bio || null;
  }

  categoryNames(categories: CategoryLike[] | undefined | null): string[] {
    if (!categories) return [];
    return categories.map((c) => (typeof c === 'string' ? c : (c.name || 'Category'))).filter(Boolean);
  }
}