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
import { AdminBooks } from './pages/admin-books/admin-books';
import { AdminAuthors } from './pages/admin-authors/admin-authors';
import { AdminUsers } from './pages/admin-users/admin-users';
import { ProfileComponent } from './pages/profile/profile';
import { AdminProfileComponent } from './pages/admin-profile/admin-profile';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { guestGuard } from './guards/guest.guard';
import { userGuard } from './guards/user.guard';
import { Explore } from './pages/explore/explore';
import { BookDetails } from './pages/book-details/book-details';
import { AdminReviewsComponent } from './pages/admin-reviews/admin-reviews';
import { Cart } from './pages/cart/cart';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'explore',
    pathMatch: 'full'
  },
  {
    path: 'explore',
    component: Explore,
    title: 'Explore'
  },
  {
    path: 'book/:id',
    component: BookDetails,
    title: 'Book Details'
  },
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard],
    title: 'Sign In'
  },
  {
    path: 'register',
    component: Register,
    canActivate: [guestGuard],
    title: 'Create Account'
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard, userGuard],
    title: 'Checkout'
  },
  {
    path: 'order-confirmation/:id',
    component: OrderConfirmationComponent,
    canActivate: [authGuard, userGuard],
    title: 'Order Confirmation'
  },
  {
    path: 'order-history',
    component: OrderHistory,
    canActivate: [authGuard, userGuard],
    title: 'Order History'
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard, userGuard],
    title: 'My Profile'
  },
  {
    path: 'cart',
    component: Cart,
    canActivate: [authGuard, userGuard],
    title: 'Cart'
  },
  {
    path: 'admin',
    component: Admin,
    canActivate: [adminGuard],
    title: 'Admin Dashboard',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'books' },
      { path: 'users', component: AdminUsers, title: 'Manage Users' },
      { path: 'orders', component: AdminOrdersComponent, title: 'Manage Orders' },
      { path: 'books', component: AdminBooks, title: 'Manage Books' },
      { path: 'authors', component: AdminAuthors, title: 'Manage Authors' },
      { path: 'categories', component: CategoryAdmin, title: 'Manage Categories' },
      { path: 'reviews', component: AdminReviewsComponent, title: 'Manage Reviews' },
      { path: 'profile', component: AdminProfileComponent, title: 'Admin Profile' }
    ]
  },
  { path: '**', component: NotFound } // must be at end: match any wrong path and redirect to 404 page
];
