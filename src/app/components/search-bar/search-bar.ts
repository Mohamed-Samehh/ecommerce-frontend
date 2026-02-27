import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import {FormControl,FormsModule,ReactiveFormsModule, Validators} from '@angular/forms';
import { Category } from '../../interfaces/categories';
import { Author } from '../../interfaces/author';
import { Category as CategoryService } from '../../services/category/category';
import { AuthorService } from '../../services/author/author-service';
import { BookService } from '../../services/book/book-service';
@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar implements OnInit{
  //signals
  protected readonly categories = signal<Category[]>([]);
  protected readonly authors = signal<Author[]>([]);
  protected readonly query= output<string|undefined>();

  //services
  categoryServiceApi = inject(CategoryService);
  authorServiceApi = inject(AuthorService);
  bookServiceApi = inject(BookService);

  //user input handle
  protected selectedCategory = signal<string>('Categories');
  protected searchQuery = new FormControl('',[Validators.maxLength(200),Validators.minLength(1)]);
  protected readonly maxLength = 200;
  protected readonly placeHolder = 'Search for your favorite book';
  error: string | null = null;

  //update selected categoy
  protected displayCategoryName = computed(() => {
    const id = this.selectedCategory();
    if (id === 'Categories') return 'Categories';
    return this.categories().find(c => c._id === id)?.name || 'Categories';
  });

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllAuthors();

  }

  protected onSubmit(){
    if(this.searchQuery.valid && this.searchQuery.value){
      const query = this.searchQuery.value;
      const selectedCategory = this.selectedCategory() !== 'Categories'? this.selectedCategory() : undefined ;
      this.emitQuery(query,selectedCategory);
    }
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

  onCategorySelect(categoryId : string){
    this.selectedCategory.set(categoryId);
  }

  emitQuery(query:string,selectedCategory?:string){
    let finalQuery:string|undefined;
    const authorId = this.authors().find(author=>author.name === query )?._id;
    if(authorId){
      finalQuery=`authorId=${authorId}`;
    }else{
      finalQuery = `name=${query}`;
    }
    if(selectedCategory){
      finalQuery += `&categories=${selectedCategory}`;
    }
    this.query.emit(finalQuery);
  }

}