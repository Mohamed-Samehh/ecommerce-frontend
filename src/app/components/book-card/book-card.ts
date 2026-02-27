import { Component, input } from '@angular/core';
import { Book } from '../../interfaces/book';
import { StaticStarRating } from '../static-star-rating/static-star-rating';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-book-card',
  imports: [StaticStarRating,JsonPipe],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css'
})
export class BookCard {
  book = input<Book>();

}
