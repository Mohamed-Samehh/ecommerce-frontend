import { Routes } from '@angular/router';
import {NotFound} from './pages/not-found/not-found';
import { Admin } from './pages/admin/admin';
import { CategoryAdmin } from './components/category-admin/category-admin';
import { OrderHistory } from './pages/order-history/order-history';
import { CheckoutComponent } from './pages/checkout/checkout';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders';

export const routes: Routes = [
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
    path: 'admin',
    component: Admin,
    children: [
      { path: 'categories', component: CategoryAdmin }
      // add  admin routes
    ]
  },

  {path: '**', component: NotFound} //must be at end:  match any wrong path and redirect to 404 page

];
