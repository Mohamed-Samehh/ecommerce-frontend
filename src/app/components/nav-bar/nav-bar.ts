import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})

export class NavBar implements OnInit {
  public authService = inject(AuthService);

  cartService = inject(CartService);

  ngOnInit(){
    this.cartService.loadCartCount().subscribe(); // when app is on => fetch count of your cart count
  }

  logout(): void {
    this.authService.logout();
  }
}
