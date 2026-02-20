import { Component, inject, OnInit, signal } from '@angular/core';
import { BookService } from '../../services/book/book-service';
import { NavBar } from '../../components/nav-bar/nav-bar';
@Component({
  selector: 'app-home',
  imports: [NavBar],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  message = signal<string>('');
  error: string | null = null;
  serviceApi = inject(BookService);

  ngOnInit() {
    this.testUrl();
  }

  testUrl() {
    this.error = null;

    this.serviceApi.getAllBooks().subscribe({
      next: (data) => {
        this.message.set(data);
      },
      error: (err) => {
        this.error = 'Failed to load products';
        console.error(err);
      }
    });
  }
}
