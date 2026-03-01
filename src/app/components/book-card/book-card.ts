import { Component, input, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Book } from '../../interfaces/book';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { CartService } from '../../services/cart/cart';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-book-card',
  imports: [StarRatingComponent, RouterModule, DecimalPipe],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css'
})
export class BookCard {
  book = input<Book>();
  private cartService = inject(CartService);

  isAdding= signal<boolean>(false);
  addToCart(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if(this.isAdding()) return;
    const bookId = this.book()?._id;

    if (bookId) {
      this.isAdding.set(true);
      this.cartService.addToCart(bookId, 1).subscribe({
        next: () => {
          console.log(`Book ${bookId} added to cart successfully.`);
          this.isAdding.set(false);
        },
        error: (err) => {
          console.error('Error adding to cart:', err);
          this.isAdding.set(false);
        }
      });
    }
  }
}