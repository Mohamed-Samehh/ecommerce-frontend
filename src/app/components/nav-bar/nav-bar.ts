import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart/cart';
@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar implements OnInit {
  cartService = inject(CartService);

  ngOnInit(){
    this.cartService.loadCartCount().subscribe(); // when app is on => fetch count of your cart count
  }
}
