import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cart } from './pages/cart/cart';
import { CategoryAdmin } from './components/category-admin/category-admin';
import { Home } from './pages/home/home';
import { TestWrapper } from './test-wrapper/test-wrapper';
import { Footer } from './components/footer/footer';
import { NotFound } from './pages/not-found/not-found';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cart, CategoryAdmin, Home, Footer, NotFound,TestWrapper],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ecommerce-frontend');

}
