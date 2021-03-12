import { Component, EventEmitter, Output } from '@angular/core';
import { Book } from '../book.model';

@Component({
  selector: 'app-insert-book',
  templateUrl: './insert-book.component.html',
  styleUrls: ['./insert-book.component.css']
})
export class InsertBookComponent {
  @Output() bookAdded = new EventEmitter();
  book: Book = {} as Book;

  handleAddBook() {
    this.bookAdded.emit(this.book);
    this.book = { } as Book;
  }
}
