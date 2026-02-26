// import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { Cart } from "./pages/cart/cart";
// import { CategoryAdmin } from "./components/category-admin/category-admin";
// import { Home } from './pages/home/home';
// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet, Cart, CategoryAdmin,Home],
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
// export class App {
//   protected readonly title = signal('ecommerce-frontend');

// }
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// English comment: Import only common/static components like Navbar and Footer here

@Component({
  selector: 'app-root',
  standalone: true, 
  // English comment: Remove Cart, Home, and CategoryAdmin from here. Keep only RouterOutlet and global components.
  imports: [RouterOutlet], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ecommerce-frontend');
}