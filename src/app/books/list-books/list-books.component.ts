import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Book } from '../models/book.model';
import { BookService } from '../book.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-list-books',
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.css']
})
export class ListBooksComponent implements OnInit, OnDestroy {
  private booksSubscription: Subscription;
  books: Book[] = [];
  totalBooks: number;
  page = 1;
  pageLimit = 10;
  isLoading: boolean;

  constructor(private bookService: BookService, private router: Router) {

  }

  ngOnInit(): void {
    this.isLoading = true;

    this.bookService.getBooks(this.page, this.pageLimit);

    this.booksSubscription = this.bookService.getBooksObservable().subscribe(
      ({ books, total }) => {
        this.isLoading = false;
        this.books = books;
        this.totalBooks = total;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.booksSubscription.unsubscribe();
  }

  handleRemoveBook(id: string) {
    this.isLoading = true;
    this.bookService.deleteBook(id).subscribe(
      () => {
        this.isLoading = false;
        this.bookService.getBooks(this.page, this.pageLimit);
      },
      () => {
        this.isLoading = false;
      }
    );
    this.router.navigateByUrl('/');
  }

  handleChangePage(paginationData: PageEvent) {
    this.page = paginationData.pageIndex + 1;
    this.pageLimit = paginationData.pageSize;

    this.bookService.getBooks(this.page, this.pageLimit);
  }
}
