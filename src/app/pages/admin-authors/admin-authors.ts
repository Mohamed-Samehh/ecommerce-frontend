import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthorService } from '../../services/author/author-service';
import { Author } from '../../interfaces/author';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-authors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-authors.html',
  styleUrl: './admin-authors.css',
})
export class AdminAuthors implements OnInit {
  private authorService = inject(AuthorService);

  authors: Author[] = [];
  filteredAuthors: Author[] = [];
  isLoading = false;
  searchTerm = '';

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.isLoading = true;
    this.authorService.getAllAuthors().subscribe({
      next: (res) => {
        this.authors = res.data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load authors:', err);
        this.isLoading = false;
        Swal.fire('Error', 'Failed to load authors', 'error');
      }
    });
  }

  applyFilters(): void {
    if (!this.searchTerm) {
      this.filteredAuthors = [...this.authors];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredAuthors = this.authors.filter(a =>
        a.name.toLowerCase().includes(term) ||
        a.bio.toLowerCase().includes(term)
      );
    }
  }

  async openAddModal() {
    const { value: formValues } = await Swal.fire({
      title: 'Add New Author',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Name">' +
        '<textarea id="swal-input2" class="swal2-textarea" placeholder="Biography"></textarea>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#2d1a12',
      preConfirm: () => {
        const name = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const bio = (document.getElementById('swal-input2') as HTMLTextAreaElement).value;
        if (!name || !bio) {
          Swal.showValidationMessage('Please enter both name and bio');
          return false;
        }
        return { name, bio };
      }
    });

    if (formValues) {
      this.createAuthor(formValues);
    }
  }

  createAuthor(author: any): void {
    this.authorService.createAuthor(author).subscribe({
      next: () => {
        Swal.fire('Success', 'Author added successfully', 'success');
        this.loadAuthors();
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Failed to add author', 'error');
      }
    });
  }

  async openEditModal(author: Author) {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Author',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Name" value="${author.name}">` +
        `<textarea id="swal-input2" class="swal2-textarea" placeholder="Biography">${author.bio}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#2d1a12',
      preConfirm: () => {
        const name = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const bio = (document.getElementById('swal-input2') as HTMLTextAreaElement).value;
        if (!name || !bio) {
          Swal.showValidationMessage('Please enter both name and bio');
          return false;
        }
        return { name, bio };
      }
    });

    if (formValues) {
      this.updateAuthor(author._id, formValues);
    }
  }

  updateAuthor(id: string, author: any): void {
    this.authorService.updateAuthor(id, author).subscribe({
      next: () => {
        Swal.fire('Success', 'Author updated successfully', 'success');
        this.loadAuthors();
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Failed to update author', 'error');
      }
    });
  }

  confirmDelete(author: Author): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${author.name}. This will also mark their books as deleted!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteAuthor(author._id);
      }
    });
  }

  deleteAuthor(id: string): void {
    this.authorService.deleteAuthor(id).subscribe({
      next: () => {
        Swal.fire('Deleted!', 'Author has been deleted.', 'success');
        this.loadAuthors();
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Failed to delete author', 'error');
      }
    });
  }
}
