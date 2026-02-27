import { Component } from '@angular/core';
import { SearchBar } from '../components/search-bar/search-bar';
import { Admin } from "../pages/admin/admin";
import { NavBar } from "../components/nav-bar/nav-bar";
import { Footer } from "../components/footer/footer";
import { CategoryAdmin } from "../components/category-admin/category-admin";
import { RouterModule } from "@angular/router";
import { Explore } from '../pages/explore/explore';
import { BookCard } from '../components/book-card/book-card';

@Component({
  selector: 'app-test-wrapper',
  imports: [SearchBar, Admin, NavBar, Footer, CategoryAdmin, RouterModule,Explore,BookCard],
  templateUrl: './test-wrapper.html',
  styleUrl: './test-wrapper.css'
})
export class TestWrapper {

}
