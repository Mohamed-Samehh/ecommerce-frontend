import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order/order-service';

interface CheckoutItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
    templateUrl: './checkout.html',
    styleUrl: './checkout.css'
})
export class CheckoutComponent implements OnInit {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private orderService = inject(OrderService);

    checkoutForm!: FormGroup;
    currentStep = 1;
    isSubmitting = false;

    // Mock Data for UI/UX demonstration (Will be replaced by CartService later)
    cartItems: CheckoutItem[] = [
        {
            id: '67bd349479ca4041d0800b41', // Using real ID format for testing if available
            name: 'I, Robot',
            price: 15.99,
            quantity: 1,
            image: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388358434i/18383.jpg'
        }
    ];

    subtotal = 15.99;
    shipping = 5.00;
    tax = 1.28;
    total = 22.27;

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.checkoutForm = this.fb.group({
            shipping: this.fb.group({
                fullName: ['', [Validators.required, Validators.minLength(3)]],
                email: ['', [Validators.required, Validators.email]],
                phone: ['', [Validators.required]],
                address: ['', [Validators.required]],
                city: ['', [Validators.required]],
                country: ['Egypt', [Validators.required]],
                zipCode: ['', [Validators.required]]
            }),
            payment: this.fb.group({
                method: ['COD'],
                cardName: [''],
                cardNumber: [''],
                expiry: [''],
                cvv: ['']
            })
        });
    }

    placeOrder(): void {
        const shipping = this.checkoutForm.get('shipping')?.value;
        const payment = this.checkoutForm.get('payment')?.value;

        const orderData = {
            items: this.cartItems.map(item => ({
                bookId: item.id,
                quantity: item.quantity
            })),
            shippingAddress: {
                country: shipping.country,
                city: shipping.city,
                street: shipping.address,
                postalCode: shipping.zipCode
            },
            paymentMethod: payment.method === 'COD' ? 'COD' : 'Online'
        };

        this.isSubmitting = true;
        this.orderService.createOrder(orderData).subscribe({
            next: (response) => {
                this.isSubmitting = false;
                console.log('Order Successfully Placed:', response);
                const orderId = response.data?._id || response.data?.id;
                this.router.navigate(['/order-confirmation', orderId]);
            },
            error: (err) => {
                this.isSubmitting = false;
                console.error('Order Placement Failed:', err);
                alert('Failed to place order: ' + (err.error?.message || 'Unknown error'));
            }
        });
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if ((control as any).controls) {
                this.markFormGroupTouched(control as FormGroup);
            }
        });
    }
}
