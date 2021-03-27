import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { v4 as uuid } from 'uuid';

import { Book } from '../book.model';
import { BookService } from '../book.service';

@Component({
  selector: 'app-insert-book',
  templateUrl: './insert-book.component.html',
  styleUrls: ['./insert-book.component.css']
})
export class InsertBookComponent {
  @ViewChild('registerBookForm') registerBookForm: NgForm;

  constructor(private bookService: BookService) {

  }

  handleSubmit() {
    if(this.registerBookForm.invalid) return;

    const book = this.registerBookForm.value as Book;

    this.bookService.addBook(book);

    this.registerBookForm.resetForm();
  }
}
