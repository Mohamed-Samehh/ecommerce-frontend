import { Component, inject, OnInit, signal } from '@angular/core';
import { Book } from '../../interfaces/book';
import { Category } from '../../interfaces/categories';
import { Author } from '../../interfaces/author';
import { BookService } from '../../services/book/book-service';
import { Category as CategoryService} from '../../services/category/category';
import { AuthorService } from '../../services/author/author-service';
import { SearchBar } from '../../components/search-bar/search-bar';
import { MinMaxSlider } from '../../components/min-max-slider/min-max-slider';
import { Filter } from '../../components/filter/filter';
import { Pagenation } from '../../components/pagenation/pagenation';
import Swal from 'sweetalert2';
import { BookForm } from '../../components/book-form/book-form';

@Component({
  selector: 'app-admin-books',
  imports: [SearchBar,MinMaxSlider,Filter,Pagenation,BookForm],
  templateUrl: './admin-books.html',
  styleUrl: './admin-books.css'
})
export class AdminBooks implements OnInit {
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

  formMode = signal<'add' | 'edit' | null>(null);
  selectedBookId = signal<string | null>(null);

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
  deleteBook(id:string){
    Swal.fire({
      title: 'Are you sure?',
      text: 'this item will be deleted permanently',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookServiceApi.deleteBook(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your file has been deleted.',
              icon: 'success'
            });
          },
          error: (err) => {
            Swal.fire('Error!', err.error.message, 'error');
          }
        });

      }
    });
  }
  addBook(formData: FormData|null){
    this.formMode.set(null);
    if (!formData) {
      return;
    }
    this.bookServiceApi.createBook(formData).subscribe({
      next: (data) => {
        const newBook = data.data;
        this.books.update(arr => [...arr, newBook]);
        console.log('Book added successfully:', newBook);
        Swal.fire('Success!', 'Book added successfully', 'success');
      },
      error: (err) => {
        Swal.fire('Error!', err.message, 'error');
        console.error('Error adding book:', err);
      }
    });
  }
  updateBook(formData: FormData|null){
    const bookId = this.selectedBookId();
    if (!bookId) {
      Swal.fire('Error!', 'No book selected for update', 'error');
      return;
    }
    if (!formData) {
      return;
    }
    this.formMode.set(null);
    this.bookServiceApi.replaceBook(bookId, formData).subscribe({
      next: (data) => {
        const updatedBook = data.data;
        this.books.update(arr => arr.map(book => book._id === bookId ? updatedBook : book));
        console.log('Book updated successfully:', updatedBook);
        Swal.fire('Success!', 'Book updated successfully', 'success');
      }
      ,error: (err) => {
        Swal.fire('Error!', err.message, 'error');
        console.error('Error updating book:', err);
      }
    });
  }
}
