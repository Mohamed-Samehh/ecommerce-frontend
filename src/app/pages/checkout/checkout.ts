import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, FormArray } from '@angular/forms';
import { timeout, finalize } from 'rxjs/operators';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order/order-service';
import { CartService } from '../../services/cart/cart';
import { CartItem } from '../../interfaces/cart';
import { Order } from '../../interfaces/order';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { Footer } from '../../components/footer/footer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NavBar, Footer, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private cartService = inject(CartService);

  checkoutForm!: FormGroup;
  isSubmitting = false;
  isLoadingCart = signal(true);

  cartItems = signal<CartItem[]>([]);
  subtotal = signal(0);
  shipping = signal(0);
  tax = signal(0);
  total = signal(0);

  ngOnInit(): void {
    this.initForm();
    this.loadCart();
  }

  private loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (res) => {
        const items = res.data?.items ?? [];
        this.cartItems.set(items);
        this.computeTotals(items);
        this.isLoadingCart.set(false);
      },
      error: () => {
        this.isLoadingCart.set(false);
      }
    });
  }

  private computeTotals(items: CartItem[]): void {
    const sub = items.reduce((acc, item) => acc + (item.book.price * item.quantity), 0);
    const sh = sub >= 100 ? 0 : 10;
    const tx = parseFloat((sub * 0.08).toFixed(2));
    this.subtotal.set(sub);
    this.shipping.set(sh);
    this.tax.set(tx);
    this.total.set(parseFloat((sub + sh + tx).toFixed(2)));
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
        method: ['COD']
      })
    });
  }

  placeOrder(): void {
    if (this.isSubmitting) return;

    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in all required fields before placing your order.',
        icon: 'warning',
        confirmButtonColor: '#2d1a12'
      });
      return;
    }

    if (this.cartItems().length === 0) {
      Swal.fire({
        title: 'Empty Cart',
        text: 'Your cart is empty. Add some books before checking out.',
        icon: 'info',
        confirmButtonColor: '#2d1a12'
      });
      return;
    }

    const shippingVal = this.checkoutForm.get('shipping')?.value;
    const paymentVal = this.checkoutForm.get('payment')?.value;

    const orderData: Partial<Order> = {
      items: this.cartItems().map(item => ({
        bookId: item.book.id || item.book._id,
        quantity: item.quantity
      })),
      shippingAddress: {
        country: shippingVal.country,
        city: shippingVal.city,
        street: shippingVal.address,
        postalCode: shippingVal.zipCode
      },
      paymentMethod: (paymentVal.method === 'COD' ? 'COD' : 'Online') as 'COD' | 'Online'
    };

    Swal.fire({
      title: 'Confirm Order',
      html: `Are you sure you want to place this order?<br><strong>Total: ${this.total().toFixed(2)}</strong>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Place Order',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2d1a12'
    }).then(result => {
      if (result.isConfirmed) {
        this.submitOrder(orderData, paymentVal);
      }
    });
  }

  private submitOrder(orderData: Partial<Order>, paymentVal: { method: 'COD' | 'Online' }): void {
    this.isSubmitting = true;
    this.orderService.createOrder(orderData)
      .pipe(
        timeout(10000),
        finalize(() => { this.isSubmitting = false; })
      )
      .subscribe({
        next: (response: import('../../interfaces/api-response').ApiResponse<Order>) => {
          this.cartService.loadCartCount().subscribe();
          const orderId = response.data?._id;

          if (orderId) {
            if (paymentVal.method === 'Online') {
              Swal.fire({
                title: 'Processing Payment',
                text: 'Please wait while we secure your transaction...',
                allowOutsideClick: false,
                didOpen: () => {
                  Swal.showLoading();
                },
                timer: 2000,
                timerProgressBar: true,
                confirmButtonColor: '#2d1a12'
              }).then(() => {
                this.router.navigate(['/order-confirmation', orderId]);
              });
            } else {
              this.router.navigate(['/order-confirmation', orderId]);
            }
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          const backendErrors = err?.error?.errors;
          const msg = Array.isArray(backendErrors)
            ? backendErrors.join('<br>')
            : (err?.error?.message || err?.message || 'Could not place order. Please try again.');

          Swal.fire({
            title: 'Order Failed',
            html: msg,
            icon: 'error',
            confirmButtonColor: '#d33'
          });
        }
      });
  }

  private markFormGroupTouched(control: AbstractControl): void {
    control.markAsTouched();

    if (control instanceof FormGroup || control instanceof FormArray) {
      Object.values(control.controls).forEach(child => this.markFormGroupTouched(child));
    }
  }
}
