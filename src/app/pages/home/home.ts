import { Component, inject, OnInit, signal } from '@angular/core';
import { BookService } from '../../services/book/book-service';
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  message = signal<string>('');
  error: string | null = null;
  serviceApi = inject(BookService);
  //constructor(private serviceApi: ServiceApi) {}

  ngOnInit() {
    this.testUrl();
  }

  testUrl() {
    this.error = null;

    this.serviceApi.testLocalhost().subscribe({
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
