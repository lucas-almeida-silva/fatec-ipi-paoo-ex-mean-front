import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

import { Book } from './models/book.model';
import { SaveBook } from './models/saveBook.model';
import { BooksList } from './models/booksList.model';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books: Book[] = [];
  private $books = new Subject<BooksList>();
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {

  }

  getBooks(page: number, limit: number): void {
    const params = new HttpParams({
      fromObject: {
        page: String(page),
        limit: String(limit)
      }
    });

    this.httpClient.get<BooksList>(`${this.apiUrl}/books`, { params })
    .subscribe(
      ({ books, total }) => {
        this.books = books;
        this.$books.next({
          books: [...this.books],
          total
        });
      }
    );
  }

  getBook(id: string): Observable<Book> {
    return this.httpClient.get<Book>(`${this.apiUrl}/books/${id}`);
  }

  addBook(book: Omit<SaveBook, 'id'>) {
    const data = new FormData();

    data.append('title', book.title);
    data.append('author', book.author);
    data.append('totalPages', String(book.totalPages));
    data.append('image', book.image);

    return this.httpClient.post<Book>(`${this.apiUrl}/books`, data)
  }

  updateBook(book: SaveBook) {
    const bookId = book.id;

    let bookData;

    if(book.image) {
      bookData = new FormData();

      bookData.append('title', book.title);
      bookData.append('author', book.author);
      bookData.append('totalPages', String(book.totalPages));
      bookData.append('image', book.image);
    } else {
      bookData = {
        title: book.title,
        author: book.author,
        totalPages: book.totalPages
      };
    }

    return this.httpClient.put(`${this.apiUrl}/books/${bookId}`, bookData);
  }

  deleteBook(id: string) {
    return this.httpClient.delete(`${this.apiUrl}/books/${id}`);
  }

  getBooksObservable(): Observable<BooksList> {
    return this.$books.asObservable();
  }
}
