import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/explore/explore').then(m => m.Explore),
    title: 'Home'
  },
  {
    path: 'book/:id',
    loadComponent: () => import('./pages/book-details/book-details').then(m => m.BookDetails),
    title: 'Book Details'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    title: 'Sign In'
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.Register),
    title: 'Create Account'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout').then(m => m.CheckoutComponent),
    title: 'Checkout'
  },
  {
    path: 'order-confirmation/:id',
    loadComponent: () => import('./pages/order-confirmation/order-confirmation').then(m => m.OrderConfirmationComponent),
    title: 'Order Confirmation'
  },
  {
    path: 'order-history',
    loadComponent: () => import('./pages/order-history/order-history').then(m => m.OrderHistory),
    title: 'Order History'
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then(m => m.Cart),
    title: 'Cart'
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then(m => m.Admin),
    children: [
      {
        path: 'categories',
        loadComponent: () => import('./components/category-admin/category-admin').then(m => m.CategoryAdmin)
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/admin-orders/admin-orders').then(m => m.AdminOrdersComponent)
      },
      {
        path: 'reviews',
        loadComponent: () => import('./pages/admin-reviews/admin-reviews').then(m => m.AdminReviewsComponent)
      },
      {
        path: 'authors',
        loadComponent: () => import('./pages/admin-authors/admin-authors').then(m => m.AdminAuthors)
      },
      { path: '', redirectTo: 'orders', pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound)
  }
];
