import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order/order-service';

interface AdminOrder {
    _id: string;
    userId: {
        firstName: string;
        lastName: string;
        email: string;
    };
    totalAmount: number;
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentStatus: 'paid' | 'pending';
    createdAt: string;
}

@Component({
    selector: 'app-admin-orders',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-orders.html',
    styleUrl: './admin-orders.css'
})
export class AdminOrdersComponent implements OnInit {
    private orderService = inject(OrderService);

    orders: AdminOrder[] = [];
    filteredOrders: AdminOrder[] = [];
    searchTerm: string = '';
    statusFilter: string = 'all';
    isLoading = false;

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(): void {
        this.isLoading = true;
        this.orderService.getAllOrders().subscribe({
            next: (response) => {
                this.orders = response.data;
                this.filteredOrders = [...this.orders];
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load admin orders:', err);
                this.isLoading = false;
            }
        });
    }

    applyFilters(): void {
        this.filteredOrders = this.orders.filter(order => {
            const customerName = `${order.userId.firstName} ${order.userId.lastName}`;
            const matchesSearch = customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                order._id.includes(this.searchTerm);
            const matchesStatus = this.statusFilter === 'all' || order.status === this.statusFilter;
            return matchesSearch && matchesStatus;
        });
    }

    updateStatus(order: AdminOrder, newStatus: any): void {
        const previousStatus = order.status;
        order.status = newStatus; // Optimistic update

        this.orderService.updateOrderStatus(order._id, newStatus).subscribe({
            next: (res) => {
                console.log('Status updated successfully');
            },
            error: (err) => {
                console.error('Failed to update status:', err);
                order.status = previousStatus; // Rollback
                alert('Update failed: ' + (err.error?.message || 'Unauthorized or Invalid Transition'));
            }
        });
    }
}
