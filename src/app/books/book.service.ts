import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Book } from './book.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books: Book[] = [];
  private $books = new Subject<Book[]>();
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {

  }

  getBooks(): void {
    this.httpClient.get<Book[]>(`${this.apiUrl}/books`).subscribe(
      (books) => {
        this.books = books;
        this.$books.next([...this.books]);
      }
    );
  }

  addBook(book: Omit<Book, 'id'>): void {
    this.httpClient.post<Book>(`${this.apiUrl}/books`, book).subscribe(
      (createdBook) => {
        this.books.push(createdBook);
        this.$books.next([...this.books]);
      }
    );
  }

  getBooksObservable(): Observable<Book[]> {
    return this.$books.asObservable();
  }
}
