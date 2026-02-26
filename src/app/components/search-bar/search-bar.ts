import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import {FormControl,FormsModule,ReactiveFormsModule, Validators} from '@angular/forms';
import { Category } from '../../interfaces/categories';
import { SearchService } from '../../services/search/search-service';
import {Book} from '../../interfaces/book';
@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar implements OnInit{
  protected readonly categories = signal<Category[]>([]);
  protected readonly books= output<Book[]>();
  serviceApi = inject(SearchService);
  protected selectedCategory = signal<string>('Categories');
  protected searchQuery = new FormControl('',[Validators.maxLength(200),Validators.minLength(1)]);
  protected readonly maxLength = 200;
  protected readonly placeHolder = 'Search for your favorite book';
  error: string | null = null;
  protected displayCategoryName = computed(() => {
    const id = this.selectedCategory();
    if (id === 'Categories') return 'Categories';
    return this.categories().find(c => c._id === id)?.name || 'Categories';
  });
  ngOnInit(): void {
    this.getAllCategories();
  }
  protected onSubmit(){
    console.log(this.searchQuery.value);
    if(this.searchQuery.valid && this.searchQuery.value){
      const bookName = this.searchQuery.value;
      const selectedCategory:string|undefined = this.selectedCategory() !== 'Categories'? this.selectedCategory() : undefined ;
      this.getAllBooks(bookName,selectedCategory);
    }
  }
  getAllCategories(){
    this.error = null;

    this.serviceApi.getAllCategories().subscribe({
      next: (data) => {
        this.categories.set(data.data);
        console.log(this.categories());
      },
      error: (err) => {
        this.error = 'Failed to load products';
        console.error(err);
      }
    });
  }
  onCategorySelect(categoryId : string){
    this.selectedCategory.set(categoryId);

  }
  getAllBooks(bookName:string,selectedCategory:string|undefined){
    let query = `?name=${bookName}`;
    query+='&';
    if(selectedCategory){
      query += `categories=${selectedCategory}`;
    }
    console.log(query);
    this.serviceApi.getAllBooks(query).subscribe({
      next: (data) => {
        this.books.emit(data.data);

      },
      error: (err) => {
        this.error = 'Failed to load products';
        console.error(err);
      }
    });
  }
}