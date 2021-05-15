import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Book, PostBook } from './book.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books: Book[] = [];
  private $books = new Subject<Book[]>();
  private apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {

  }

  getBooks(): void {
    this.httpClient.get<Book[]>(`${this.apiUrl}/books`).subscribe(
      (books) => {
        this.books = books;
        this.updateBooksSubject();
      }
    );
  }

  getBook(id: string): Observable<Book> {
    return this.httpClient.get<Book>(`${this.apiUrl}/books/${id}`);
  }

  addBook(book: Omit<PostBook, 'id'>): void {
    const data = new FormData();
    data.append('title', book.title);
    data.append('author', book.author);
    data.append('totalPages', String(book.totalPages));
    data.append('image', book.image);

    this.httpClient.post<Book>(`${this.apiUrl}/books`, data)
      .subscribe(
        (book) => {
          this.books.push(book);
          this.updateBooksSubject();
          this.router.navigateByUrl('/');
        }
      );
  }

  updateBook(book: PostBook): void {
    const bookId = book.id;

    const updateBook = { ...book };
    delete updateBook.id

    this.httpClient.put(`${this.apiUrl}/books/${bookId}`, updateBook).subscribe(
      () => {
        const index = this.books.findIndex(book => book.id === bookId);

        this.books[index] = {
          id: book.id,
          title: book.title,
          author: book.author,
          totalPages: book.totalPages,
          imageUrl: this.books[index].imageUrl
        };

        this.updateBooksSubject();
        this.router.navigateByUrl('/');
      }
    );
  }

  deleteBook(id: string): void {
    this.httpClient.delete(`${this.apiUrl}/books/${id}`).subscribe(
      () => {
        this.books = this.books.filter(book => book.id !== id);
        this.updateBooksSubject();
      }
    )
  }

  getBooksObservable(): Observable<Book[]> {
    return this.$books.asObservable();
  }

  private updateBooksSubject() {
    this.$books.next([...this.books]);
  }
}
