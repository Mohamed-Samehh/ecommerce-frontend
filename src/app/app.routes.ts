import { Routes } from '@angular/router';
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
    }
];
