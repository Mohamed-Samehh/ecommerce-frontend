import { Component, computed,  input, output, signal } from '@angular/core';
import {FormControl,FormsModule,ReactiveFormsModule, Validators} from '@angular/forms';
import { Category } from '../../interfaces/categories';
import { Author } from '../../interfaces/author';

@Component({
  selector: 'app-search-bar',
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBar {
  //signals
  categories = input<Category[]>([]);
  authors = input<Author[]>([]);
  protected readonly query= output<string|undefined>();

  //user input handle
  protected selectedCategory = signal<string>('Categories');
  protected searchQuery = new FormControl('',[Validators.maxLength(200)]);
  protected readonly maxLength = 200;
  protected readonly placeHolder = 'Search for your favorite book';
  error: string | null = null;

  //update selected categoy
  protected displayCategoryName = computed(() => {
    const id = this.selectedCategory();
    if (id === 'Categories') return 'Categories';
    return this.categories().find(c => c._id === id)?.name || 'Categories';
  });

  protected onSubmit(){
    if(this.searchQuery.valid){
      const query = this.searchQuery.value ? this.searchQuery.value.trim() : undefined;
      const selectedCategory = this.selectedCategory() !== 'Categories'? this.selectedCategory() : undefined ;
      this.emitQuery(query,selectedCategory);
    }
  }

  onCategorySelect(categoryId : string){
    this.selectedCategory.set(categoryId);
  }

  emitQuery(query?:string,selectedCategory?:string){
    let finalQuery:string|undefined;
    const authorId = this.authors().find(author=>author.name === query )?._id;
    if(authorId){
      finalQuery=`authorId=${authorId}`;
    }else if(query){
      finalQuery = `name=${query}`;
    }
    if(selectedCategory){
      finalQuery += `&categories=${selectedCategory}`;
    }
    this.query.emit(finalQuery);
  }

}