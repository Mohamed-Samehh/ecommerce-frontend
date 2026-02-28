import { Component,computed, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-pagenation',
  imports: [],
  templateUrl: './pagenation.html',
  styleUrl: './pagenation.css'
})
export class Pagenation {
  totalNumberOfBooks = input<number>(0);
  pageSize = input<number>(10);
  emittedCurrentPage = output<number>();
  currentPage = signal<number>(1);
  numberOfPages = computed(() => {
    const numberOfPages = Math.ceil(this.totalNumberOfBooks()/this.pageSize()) || 1;
    return numberOfPages;
  });
  hollowArray = computed(() => {
    return new Array(this.numberOfPages());
  });
  nextPage(){
    const oldValue = this.currentPage();
    const numberOfPages = this.numberOfPages();
    if(oldValue < numberOfPages){
      this.currentPage.set(oldValue+1);
      this.emittedCurrentPage.emit(this.currentPage());
    }
  }
  prevPage(){
    const oldValue = this.currentPage();
    if(oldValue > 1){
      this.currentPage.set(oldValue-1);
      this.emittedCurrentPage.emit(this.currentPage());
    }
  }
  pageChange(page:number){
    this.currentPage.set(page);
    this.emittedCurrentPage.emit(this.currentPage());
  }

}
