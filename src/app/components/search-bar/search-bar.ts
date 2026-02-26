import { Component, inject, OnInit, signal } from '@angular/core';
import {FormControl,FormsModule,ReactiveFormsModule, Validators} from '@angular/forms';
import { Category } from '../../interfaces/categories';
import { SearchService } from '../../services/search/search-service';
@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar implements OnInit{
  protected readonly categories = signal<Category[]>([]);
  serviceApi = inject(SearchService);
  protected selectedCategory = signal<string|undefined>(undefined);
  protected searchQuery = new FormControl('',[Validators.maxLength(200),Validators.minLength(1)]);
  protected readonly maxLength = 200;
  protected readonly placeHolder = 'Search for your favorite book';
  error: string | null = null;
  ngOnInit(): void {
    this.getAllCategories();
  }
  protected onSubmit(){
    if(this.searchQuery.valid){
      const bookName = this.searchQuery.value;
      const selectedCategory = this.selectedCategory;
      getAllBooks(bookName,selectedCategory);
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
  getAllBooks(bookName:string,selectedCategory:string){
    const query = `?name=${bookName}`;
    if(selectedCategory){
      query+=`category[]`
    }
  }
}