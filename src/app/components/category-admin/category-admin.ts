import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import Swal from 'sweetalert2';
import { Category as CategoryService } from '../../services/category/category';
import { Category } from '../../interfaces/categories';

@Component({
  selector: 'app-category-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-admin.html',
  styleUrl: './category-admin.css'
})
export class CategoryAdmin implements OnInit {
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchControl = new FormControl('');

  ngOnInit() {
    this.loadCategories();
    this.setupSearch();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe(response => {
      this.categories = response.data;
      this.filteredCategories = response.data;
      this.cdr.markForCheck(); // tell angular to check for changes since we updated data async
    });
  }

  setupSearch() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(searchText => {
        if (!searchText) {
          this.filteredCategories = this.categories;
        } else {
          this.filteredCategories = this.categories.filter(cat =>
            cat.name.toLowerCase().includes(searchText.toLowerCase())
          );
        }
        this.cdr.detectChanges();
      });
  }

  async addCategory() {
    const { value: name } = await Swal.fire({
      title: 'Add New Category',
      input: 'text',
      inputLabel: 'Category Name',
      inputPlaceholder: 'Enter category name',
      showCancelButton: true,
      confirmButtonText: 'Save',
      confirmButtonColor: '#26150F',
      inputValidator: (value) => {
        if (!value) return 'Please enter a category name!';
        return null;
      }
    });

    if (name) {
      this.categoryService.createCategory(name).subscribe({
        next: (response) => {
          this.categories.push(response.data);
          this.filteredCategories = this.categories;
          Swal.fire('Success!', 'Category added successfully', 'success');
        },
        error: (err) => {
          Swal.fire('Error!', err.error.message, 'error');
        }
      });
    }
  }

  async editCategory(category: Category) {
    const { value: name } = await Swal.fire({
      title: 'Edit Category',
      input: 'text',
      inputValue: category.name,
      inputLabel: 'Category Name',
      showCancelButton: true,
      confirmButtonText: 'Update',
      confirmButtonColor: '#26150F',
      inputValidator: (value) => {
        if (!value) return 'Please enter a category name!';
        return null;
      }
    });

    if (name && name !== category.name) {
      this.categoryService.updateCategory(category._id, name).subscribe({
        next: (response) => {
          category.name = response.data.name;
          Swal.fire('Updated!', 'Category updated successfully', 'success');
        },
        error: (err) => {
          Swal.fire('Error!', err.error.message, 'error');
        }
      });
    }
  }

  async deleteCategory(category: Category) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete "${category.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#dc3545',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      this.categoryService.removeCategory(category._id).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c._id !== category._id);
          this.filteredCategories = this.filteredCategories.filter(c => c._id !== category._id);
          Swal.fire('Deleted!', 'Category has been deleted', 'success');
        },
        error: (err) => {
          Swal.fire('Error!', err.error.message, 'error');
        }
      });
    }
  }
}