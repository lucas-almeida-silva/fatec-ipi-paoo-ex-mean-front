import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Book } from '../book.model';
import { BookService } from '../book.service';

@Component({
  selector: 'app-insert-book',
  templateUrl: './insert-book.component.html',
  styleUrls: ['./insert-book.component.css']
})
export class InsertBookComponent {
  @ViewChild('registerBookForm') registerBookForm: NgForm;

  constructor(private bookService: BookService, private router: Router) {

  }

  handleSubmit() {
    if(this.registerBookForm.invalid) return;

    const book = this.registerBookForm.value as Book;

    this.bookService.addBook(book);

    this.router.navigateByUrl('/');
  }
}
