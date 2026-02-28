import { Component, input, output } from '@angular/core';
import { Category } from '../../interfaces/categories';

@Component({
  selector: 'app-filter',
  imports: [],
  templateUrl: './filter.html',
  styleUrl: './filter.css'
})
export class Filter {
  // Input with modern Angular signal syntax
  categories = input.required<Category[]>();

  // Output for filter changes
  filterChange = output<string[]>();

  // Internal state to track selected categories
  private selectedIds = new Set<string>();

  // Getter for selected categories
  selectedCategories = () => Array.from(this.selectedIds);

  // Check if a category is selected
  isSelected = (categoryId: string) => this.selectedIds.has(categoryId);

  // Toggle category selection
  toggleCategory(categoryId: string) {
    if (this.selectedIds.has(categoryId)) {
      this.selectedIds.delete(categoryId);
    } else {
      this.selectedIds.add(categoryId);
    }
    this.filterChange.emit(this.selectedCategories());
  }

  // Clear all selections
  clearAll() {
    this.selectedIds.clear();
    this.filterChange.emit([]);
  }
}
