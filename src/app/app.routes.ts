import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { NotFound } from './pages/not-found/not-found';
import { Admin } from './pages/admin/admin';
import { CategoryAdmin } from './components/category-admin/category-admin';
import { OrderHistory } from './pages/order-history/order-history';
import { CheckoutComponent } from './pages/checkout/checkout';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders';
import { Explore } from './pages/explore/explore';
import { BookDetails } from './pages/book-details/book-details';
import { AdminReviewsComponent } from './pages/admin-reviews/admin-reviews';

export const routes: Routes = [
  {
    path: '',
    component: Explore,
    title: 'Home'
  },
  {
    path: 'book/:id',
    component: BookDetails,
    title: 'Book Details'
  },
  {
    path: 'login',
    component: Login,
    title: 'Sign In'
  },
  {
    path: 'register',
    component: Register,
    title: 'Create Account'
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    title: 'Checkout'
  },
  {
    path: 'order-confirmation/:id',
    component: OrderConfirmationComponent,
    title: 'Order Confirmation'
  },
  {
    path: 'order-history',
    component: OrderHistory,
    title: 'Order History'
  },
  {
    path: 'admin',
    component: Admin,
    children: [
      { path: 'categories', component: CategoryAdmin },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'reviews', component: AdminReviewsComponent },
      { path: '', redirectTo: 'orders', pathMatch: 'full' }
    ]
  },
  { path: '**', component: NotFound } // must be at end: match any wrong path and redirect to 404 page
];
