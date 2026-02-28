import { Component, inject, OnInit, signal } from '@angular/core';
import { BookService } from '../../services/book/book-service';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { Footer } from '../../components/footer/footer';
@Component({
  selector: 'app-home',
  imports: [NavBar,Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home  {
  message = signal<string>('');
  error: string | null = null;

}
