import { CommonModule } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-min-max-slider',
  imports: [CommonModule,FormsModule],
  templateUrl: './min-max-slider.html',
  styleUrl: './min-max-slider.css'
})
export class MinMaxSlider {
  protected  minPrice = signal(1);
  protected  maxPrice = signal(100);
  protected readonly minLimit = 1;
  protected readonly maxLimit = 100;
  range = output<number[]>();
  validateRange() {
    if (this.minPrice() > this.maxPrice()) {
      const temp = this.minPrice();
      this.minPrice.set(this.maxPrice());
      this.maxPrice.set(temp);
    }
    this.range.emit([this.minPrice(), this.maxPrice()]);
  }
}
