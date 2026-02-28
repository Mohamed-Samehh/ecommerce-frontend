import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { guestGuard } from './guards/guest.guard';
import { userGuard } from './guards/user.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'explore',
    pathMatch: 'full'
  },
  {
    path: 'explore',
    loadComponent: () => import('./pages/explore/explore').then(m => m.Explore),
    title: 'Explore'
  },
  {
    path: 'book/:id',
    loadComponent: () => import('./pages/book-details/book-details').then(m => m.BookDetails),
    title: 'Book Details'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    canActivate: [guestGuard],
    title: 'Sign In'
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.Register),
    canActivate: [guestGuard],
    title: 'Create Account'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout').then(m => m.CheckoutComponent),
    canActivate: [authGuard, userGuard],
    title: 'Checkout'
  },
  {
    path: 'order-confirmation/:id',
    loadComponent: () => import('./pages/order-confirmation/order-confirmation').then(m => m.OrderConfirmationComponent),
    canActivate: [authGuard, userGuard],
    title: 'Order Confirmation'
  },
  {
    path: 'order-history',
    loadComponent: () => import('./pages/order-history/order-history').then(m => m.OrderHistory),
    canActivate: [authGuard, userGuard],
    title: 'Order History'
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent),
    canActivate: [authGuard, userGuard],
    title: 'My Profile'
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then(m => m.Cart),
    canActivate: [authGuard, userGuard],
    title: 'Cart'
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then(m => m.Admin),
    canActivate: [adminGuard],
    title: 'Admin Dashboard',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'books' },
      {
        path: 'users',
        loadComponent: () => import('./pages/admin-users/admin-users').then(m => m.AdminUsers),
        title: 'Manage Users'
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/admin-orders/admin-orders').then(m => m.AdminOrdersComponent),
        title: 'Manage Orders'
      },
      {
        path: 'books',
        loadComponent: () => import('./pages/admin-books/admin-books').then(m => m.AdminBooks),
        title: 'Manage Books'
      },
      {
        path: 'authors',
        loadComponent: () => import('./pages/admin-authors/admin-authors').then(m => m.AdminAuthors),
        title: 'Manage Authors'
      },
      {
        path: 'categories',
        loadComponent: () => import('./components/category-admin/category-admin').then(m => m.CategoryAdmin),
        title: 'Manage Categories'
      },
      {
        path: 'reviews',
        loadComponent: () => import('./pages/admin-reviews/admin-reviews').then(m => m.AdminReviewsComponent),
        title: 'Manage Reviews'
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/admin-profile/admin-profile').then(m => m.AdminProfileComponent),
        title: 'Admin Profile'
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound)
  }
];
