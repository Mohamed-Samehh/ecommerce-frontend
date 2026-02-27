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
    @Input() value = 0;
    @Input() readonly = false;
    @Output() valueChange = new EventEmitter<number>();

    stars: number[] = [1, 2, 3, 4, 5];
    hoveredRating = 0;

    rate(val: number): void {
      if (!this.readonly) {
        this.value = val;
        this.valueChange.emit(this.value);
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