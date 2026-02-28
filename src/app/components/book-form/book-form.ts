import { Component, inject, output } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-form',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css'
})
export class BookForm {
  formBuilder = inject(FormBuilder);
  selectedFile: File | null = null;
  bookForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
    stock: ['', [Validators.required, Validators.min(0)]],
    categories: ['', Validators.required],
    authorid: ['', Validators.required],
    description: ['']
  });
  formData = output<FormData>();

  onSubmit() {
    if (this.bookForm.valid) {
      const tempFormData = new FormData();
      const formValues = this.bookForm.value;
      tempFormData.append('name', formValues.name??'');
      tempFormData.append('price', formValues.price??'0');
      tempFormData.append('stock', formValues.stock??'0');
      tempFormData.append('categories', formValues.categories?? '');
      tempFormData.append('authorid', formValues.authorid ?? '');
      tempFormData.append('description', formValues.description ?? '');

      if (this.selectedFile) {
        tempFormData.append('image', this.selectedFile);
      }
      this.formData.emit(tempFormData);
    } else {
      console.log('Form is invalid');
    }
  }
  onCancel() {
    console.log('Form cancelled');
    // Here you would typically navigate back to the previous page or reset the form
  }
  onFileChange(event: Event) {

  }
}
