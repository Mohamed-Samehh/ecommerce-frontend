import { Component, input, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Book } from '../../interfaces/book';
import { StaticStarRating } from '../static-star-rating/static-star-rating';
import { CartService } from '../../services/cart/cart';

@Component({
  selector: 'app-book-card',
  imports: [StaticStarRating, RouterModule],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css'
})
export class BookCard {
  book = input<Book>();
  private cartService = inject(CartService);

  addToCart(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    const bookId = this.book()?._id;

    if (bookId) {
      this.cartService.addToCart(bookId, 1).subscribe({
        next: () => {
          console.log(`Book ${bookId} added to cart successfully.`);
        },
        error: (err) => {
          console.error('Error adding to cart:', err);
        }
      });
    }
  }
}