import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink,Router } from '@angular/router';
import { CartService } from '../../services/cart/cart';
import { CartData , CartItem} from '../../interfaces/cart';
import Swal from 'sweetalert2';
import { debounceTime, Subject } from 'rxjs';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { Footer } from '../../components/footer/footer';
@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink,NavBar,Footer],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  cartService = inject(CartService);
  router = inject(Router);
  cart: CartData | null = null; // start cart with null
  loading = true; // to wait until data is fetched from db

  private quantityDebouncer = new Subject<{ item: CartItem, newQuantity: number }>();

  ngOnInit(): void {
    this.loadCart();

    // waiting room
    this.quantityDebouncer.pipe(debounceTime(500)) // wait 500 ms
      .subscribe(({item, newQuantity})=>{

        console.log('Item object content:', item.book);

        const bookId = item.book.id as string; // to ensure the id will exist and in string format
        this.cartService.updateCartItem(bookId, newQuantity).subscribe({

          error: (err) => {
            console.log('Error in updating quantity', err);
            Swal.fire({
              title: 'Error!',
              text: 'Couldn\'t update quantity',
              icon: 'error'
            });
            this.loadCart();
          }
        });

      }
      );
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cart = res.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        console.log('Error in loading cart');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get itemTotal(): number {
    if (!this.cart) return 0;
    return this.cart.items.reduce((sum, item) =>
      sum + (item.book.price * item.quantity), 0);
  }

  get shipping(): number {
    return this.itemTotal > 1000 ? 50 : 100;
  }

  get total(): number {
    return this.itemTotal + this.shipping;
  }

  changeQuantity(item: CartItem, change: number) {
    const newQuantity:number = item.quantity + change;

    if (newQuantity < 1 || newQuantity > item.book.stock) return;
    item.quantity = newQuantity; // update UI

    this.quantityDebouncer.next({ item, newQuantity }); // send to waiting room
  }

  removeItem(item: CartItem) {
    Swal.fire({
      title: 'Remove Item?',
      text: `Remove "${item.book.name}" from cart?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        const bookId = item.book.id as string; // to ensure the id will exist and in string format (mismatch btw angular and backend)

        this.cartService.removeFromCart(bookId).subscribe({
          next: () => {
            this.loadCart();
            Swal.fire({
              title: 'Removed!',
              text: 'Item removed from cart',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          },
          error: () => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to remove item',
              icon: 'error'
            });
          }
        });
      }
    });
  }

  proceedToCheckout() {
    if (!this.cart || this.cart.items.length === 0) {
      Swal.fire({
        title: 'Empty Cart',
        text: 'Add items to cart before checkout',
        icon: 'info'
      });
      return;
    }
    this.router.navigate(['/checkout']);  }
}