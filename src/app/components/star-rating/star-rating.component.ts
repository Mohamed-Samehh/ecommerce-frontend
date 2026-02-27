import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent {
    @Input() rating = 0;
    @Input() readonly = false;
    @Output() ratingChange = new EventEmitter<number>();

    stars: number[] = [1, 2, 3, 4, 5];
    hoveredRating = 0;

    rate(val: number): void {
      if (!this.readonly) {
        this.rating = val;
        this.ratingChange.emit(this.rating);
      }
    }

    onHover(val: number): void {
      if (!this.readonly) {
        this.hoveredRating = val;
      }
    }

    onLeave(): void {
      if (!this.readonly) {
        this.hoveredRating = 0;
      }
    }
}
