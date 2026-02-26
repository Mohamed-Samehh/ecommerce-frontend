import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
    selector: 'app-order-confirmation',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './order-confirmation.html',
    styleUrl: './order-confirmation.css'
})
export class OrderConfirmationComponent implements OnInit {
    private route = inject(ActivatedRoute);

    orderId: string = '';
    orderDate: Date = new Date();
    deliveryDate: Date = new Date();

    ngOnInit(): void {
        this.orderId = this.route.snapshot.paramMap.get('id') || 'ORD-999999';
        // Estimate delivery (3 days from now)
        this.deliveryDate.setDate(this.orderDate.getDate() + 3);
    }
}
