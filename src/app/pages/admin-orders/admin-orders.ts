import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order/order-service';
import { Order, PopulatedUser } from '../../interfaces/order';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css'
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm = '';
  statusFilter = 'all';
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
      let customerName = 'Guest';
      const userId = order.userId;

      if (userId && typeof userId === 'object') {
        const populatedUser = userId as PopulatedUser;
        customerName = `${populatedUser.firstName} ${populatedUser.lastName}`;
      }

      const matchesSearch = customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                (order._id && order._id.includes(this.searchTerm));
      const matchesStatus = this.statusFilter === 'all' || order.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  updateStatus(order: Order, newStatus: any): void {
    const previousStatus = order.status;
    order.status = newStatus; // Optimistic update

    if (!order._id) return;

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
