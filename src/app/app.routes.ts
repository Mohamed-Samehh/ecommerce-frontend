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
import { ProfileComponent } from './pages/profile/profile';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { Explore } from './pages/explore/explore';

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
    path: 'admin/orders',
    component: AdminOrdersComponent,
    title: 'Admin Dashboard'
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
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    title: 'My Profile'
  },
  {
    path: 'admin',
    component: Admin,
    children: [
      { path: 'categories', component: CategoryAdmin }
      // add admin routes
    ]
  },
  { path: '**', component: NotFound } // must be at end: match any wrong path and redirect to 404 page
];
