import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of} from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { CartCountResponse, CartResponse } from '../../interfaces/cart';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})

export class CartService { // talk to backend api
  private apiUrl = environment.apiUrl + '/cart';

  private http = inject(HttpClient);

  cartCount = signal<number>(0); // like glob var to store count of items in cart (use in navbar,cart page)

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.apiUrl).pipe(
      catchError(() => {
        // console.warn('Cart fetch failed (401). Forcing empty cart.');
        const emptyCartFallback: CartResponse = {
          status: 'error',
          data: {
            _id: '',
            user: '',
            items: [] // tell html to stop spinning
          }
        };

        return of(emptyCartFallback);
      })
    );
  }

  addToCart(bookId:string, quantity:number):Observable<CartResponse> {
    return this.http.post<CartResponse>(this.apiUrl, { bookId, quantity }) // the auth is handled by interceptors
      .pipe(tap(()=> this.loadCartCount().subscribe())); // force side work to run now (when add book the glob var changes & any listener update display)
  }

  removeFromCart(bookId:string) {
    return this.http.delete<CartResponse>(`${this.apiUrl}/${bookId}`) // the auth is handled by interceptors
      .pipe(tap(()=> this.loadCartCount().subscribe()));
  }

  updateCartItem(bookId:string, quantity:number) {
    return this.http.patch<CartResponse>(`${this.apiUrl}/${bookId}`, { quantity }) // the auth is handled by interceptors
      .pipe(tap(()=> this.loadCartCount().subscribe()));
  }

  loadCartCount() { // get no of books from server(db) & load the signal
    return this.http.get<CartCountResponse>(`${this.apiUrl}/count`)
      .pipe( // open pipline to make sth before data reach screen, decide to use what
        tap( // access response, but can't modify in server's res just make side task using it
          (res) => this.cartCount.set(res.data.count) // modify glob var with count of books types not quantity (dec. req to show totalquant. in badge)
        ),
        catchError(() => {
          // console.warn('Cart count failed (probably not logged in). Setting count to 0.');
          this.cartCount.set(0);

          return of({ status: 'error', data: { items: [],count: 0 } } as CartCountResponse); // safe fake response
        })
      );
  }
}
