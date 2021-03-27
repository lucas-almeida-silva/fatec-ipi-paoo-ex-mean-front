import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Book } from '../book.model';
import { BookService } from '../book.service';

@Component({
  selector: 'app-list-books',
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.css']
})
export class ListBooksComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  private booksSubscription: Subscription;

  constructor(private bookService: BookService) {

  }

  ngOnInit(): void {
    this.bookService.getBooks();

    this.booksSubscription = this.bookService.getBooksObservable().subscribe(
      (books: Book[]) => {
        this.books = books;
      }
    )
  }

  ngOnDestroy(): void {
    this.booksSubscription.unsubscribe();
  }
}
