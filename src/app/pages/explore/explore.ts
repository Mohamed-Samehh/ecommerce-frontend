import { Component, inject, signal, OnInit } from '@angular/core';
import { SearchBar } from '../../components/search-bar/search-bar';
import { BookService } from '../../services/book/book-service';
import { Book } from '../../interfaces/book';
import { BookCard } from '../../components/book-card/book-card';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { Footer } from '../../components/footer/footer';
import { Pagenation } from '../../components/pagenation/pagenation';
import { RouterLink } from '@angular/router';
import { MinMaxSlider } from '../../components/min-max-slider/min-max-slider';
import { Author } from '../../interfaces/author';
import { Category } from '../../interfaces/categories';
import { AuthorService } from '../../services/author/author-service';
import { Category as CategoryService } from '../../services/category/category';
import { Filter } from '../../components/filter/filter';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-explore',
  imports: [SearchBar,BookCard,NavBar,Footer,Pagenation,MinMaxSlider,RouterLink,Filter,FormsModule],
  templateUrl: './explore.html',
  styleUrl: './explore.css'
})
export class Explore implements OnInit {

  protected readonly books = signal<Book[]>([]);
  protected readonly categories = signal<Category[]>([]);
  protected readonly authors = signal<Author[]>([]);
  selectedLabel = 'Sort By';

  protected readonly sortOptions = [
    { value: 'price',   label: 'Price: Low to High' },
    { value: '-price',  label: 'Price: High to Low' },
    { value: 'rating',  label: 'Rating: Low to High' },
    { value: '-rating', label: 'Rating: High to Low' },
    { value: 'name',    label: 'Name: A to Z' },
    { value: '-name',   label: 'Name: Z to A' },
    { value: 'stock',   label: 'Stock: Low to High' },
    { value: '-stock',  label: 'Stock: High to Low' },
    { value: 'newest',  label: 'Newest First' },
    { value: 'oldest',  label: 'Oldest First' }
  ];

  protected priceQuery = signal<string>('');
  protected categoryQuery = signal<string>('');
  protected searchQuery = signal<string>('');
  protected query = signal<string>('');

  bookServiceApi = inject(BookService);
  categoryServiceApi = inject(CategoryService);
  authorServiceApi = inject(AuthorService);

  totalNumberOfBooks = signal<number>(0);
  protected readonly pageSize = 10;
  error: string | null = null;
  ngOnInit(): void {
    this.getAllBooks();
    this.getAllCategories();
    this.getAllAuthors();
  }

  getAllBooks(query?: string,page = 1) {

    this.bookServiceApi.getAllBooks(query,page,this.pageSize).subscribe({
      next: (data) => {
        this.books.set(data.data);
        this.totalNumberOfBooks.set(data.totalBooks ??0);
      },
      error: (err) => {
        this.books.set([]);
      }
    });
  }
  getAllCategories(){
    this.error = null;

    this.categoryServiceApi.getAllCategories().subscribe({
      next: (data) => {
        this.categories.set(data.data);

      },
      error: (err) => {
        this.error = 'Failed to load categories';

      }
    });
  }

  getAllAuthors(){
    this.error = null;

    this.authorServiceApi.getAllAuthors().subscribe({
      next: (data) => {
        this.authors.set(data.data);

      },
      error: (err) => {
        this.error = 'Failed to load authors';

      }
    });
  }
  handlePageChange(page: number) {
    this.getAllBooks(this.query(), page);

  }
  handleFilterCategories(categories: string[]) {
    if(categories && categories.length > 0){
      this.categoryQuery.set(categories.map(categoryId => `categories=${categoryId}`).join('&'));
    } else {
      this.categoryQuery.set('');
    }

  }
  handlePriceChange(range:number[]){
    const [minPrice, maxPrice] = range;

    if(minPrice !== undefined && maxPrice !== undefined){
      this.priceQuery.set(`minPrice=${minPrice}&maxPrice=${maxPrice}`);
    } else {
      this.priceQuery.set('');
    }
  }
  selectedSort = '';

  onSortChange(value: string) {
    this.selectedLabel = this.sortOptions.find(o => o.value === value)?.label || 'Sort By';
    if(this.selectedLabel !== 'Sort By'){
      this.searchQuery.set(`sort=${value}`);
    } else {
      this.searchQuery.set('');
    }
  }
  handleQuery(query?: string) {
    console.log('Handling query:', query);
    const pricePart = this.priceQuery() ? `${this.priceQuery()}&` : '';
    const categoryPart = this.categoryQuery() ? `${this.categoryQuery()}&` : '';
    const searchPart = query ? `${query}&` : '';
    const sortPart = this.searchQuery() ? `${this.searchQuery()}&` : '';
    const finalQuery = `${searchPart}${pricePart}${categoryPart}${sortPart}`.slice(0, -1);
    console.log('Final query:', finalQuery, 'Price part:', pricePart, 'Category part:', categoryPart, 'Search part:', searchPart);
    this.query.set(finalQuery);
    this.getAllBooks(this.query());

  }

}
