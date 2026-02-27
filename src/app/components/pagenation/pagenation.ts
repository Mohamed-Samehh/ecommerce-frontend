import { Component,computed, input } from '@angular/core';

@Component({
  selector: 'app-pagenation',
  imports: [],
  templateUrl: './pagenation.html',
  styleUrl: './pagenation.css'
})
export class Pagenation {
  totalNumberOfBooks = input<number>(0);
  currentPage = input<number>(1);
  pageSize = input<number>(10);
  numberOfPages = computed(() => {
    const numberOfPages
    return 0;
  });
}
