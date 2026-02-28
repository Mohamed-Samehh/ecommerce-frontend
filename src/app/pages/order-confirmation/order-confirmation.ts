import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { OrderService } from '../../services/order/order-service';
import { Order } from '../../interfaces/order';
import { Book } from '../../interfaces/book';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { Footer } from '../../components/footer/footer';

@Component({
    selector: 'app-order-confirmation',
    standalone: true,
    imports: [CommonModule, RouterModule, NavBar, Footer],
    templateUrl: './order-confirmation.html',
    styleUrl: './order-confirmation.css'
})
export class OrderConfirmationComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private orderService = inject(OrderService);

    readonly order = signal<Order | null>(null);
    readonly isLoading = signal<boolean>(true);
    readonly error = signal<string | null>(null);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.error.set('Order ID not found.');
            this.isLoading.set(false);
            return;
        }
        this.loadOrder(id);
    }

    private loadOrder(id: string): void {
        this.isLoading.set(true);
        this.orderService.getOrderById(id).subscribe({
            next: (res) => {
                this.order.set(res.data);
                this.isLoading.set(false);
            },
            error: (err) => {
                this.error.set(err.error?.message || 'Failed to load order details.');
                this.isLoading.set(false);
            }
        });
    }

    public asBook(bookId: any): Book | null {
        return bookId && typeof bookId === 'object' && 'name' in bookId ? (bookId as Book) : null;
    }

    goToExplore(): void {
        this.router.navigate(['/']);
    }
}
