import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cart } from "./pages/cart/cart";
import { CategoryAdmin } from "./components/category-admin/category-admin";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Cart, CategoryAdmin],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ecommerce-frontend');

}
