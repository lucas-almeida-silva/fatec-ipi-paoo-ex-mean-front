import { Component } from '@angular/core';
import { Book } from './books/book.model';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  books: Book[] = [];

  handleAddBook(book: Omit<Book, 'id'>) {
    this.books.push({ id: uuid(), ...book });
  }
}
