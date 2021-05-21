import { Book } from "./book.model";

export interface BooksList {
  books: Book[],
  total: number;
}
