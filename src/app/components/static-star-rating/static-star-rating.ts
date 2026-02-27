import { Component, input } from '@angular/core';

@Component({
  selector: 'app-static-star-rating',
  imports: [],
  templateUrl: './static-star-rating.html',
  styleUrl: './static-star-rating.css',
})
export class StaticStarRating {
  protected readonly hollowArray = [1, 2, 3, 4, 5];
  numberOfStars = input<number>(0);
}
