import { Component, inject, signal, OnInit } from '@angular/core';
import { SearchBar } from '../../components/search-bar/search-bar';
import { BookService } from '../../services/book/book-service';
import { Book } from '../../interfaces/book';
import { BookCard } from '../../components/book-card/book-card';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-explore',
  imports: [SearchBar,BookCard,NavBar,Footer],
  templateUrl: './explore.html',
  styleUrl: './explore.css'
})
export class Explore implements OnInit {
  query: string | undefined;
  books = signal<Book[]>([]);
  bookServiceApi = inject(BookService);
  ngOnInit(): void {
    this.getAllBooks();
  }
  handleQuery(query?: string) {
    this.query = query;
    this.getAllBooks(query);

  }
  getAllBooks(query?: string) {

    this.bookServiceApi.getAllBooks(query).subscribe({
      next: (data) => {
        this.books.set(data.data);
        console.log(this.books());
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
