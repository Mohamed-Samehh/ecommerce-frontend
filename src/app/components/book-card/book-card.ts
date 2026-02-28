import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Book } from '../../interfaces/book';
import { StaticStarRating } from '../static-star-rating/static-star-rating';

@Component({
  selector: 'app-book-card',

  imports: [StaticStarRating,RouterModule],

  templateUrl: './book-card.html',
  styleUrl: './book-card.css'
})
export class BookCard {
  book = input<Book>();

  addToCart(event:Event){
    event.stopPropagation();
    event.preventDefault();
    if(this.book() && typeof this.book()?.id === 'string'){
      // this.cartService.addToCart({id:this.book()!.id ,count: 1})
    }
    console.log('Added to cart:', this.book()?.id);
  }
}
