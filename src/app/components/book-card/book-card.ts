import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Book } from '../../interfaces/book';

@Component({
  selector: 'app-book-card',
  imports: [RouterModule],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css'
})
export class BookCard {
  book = input<Book>();
  

}
