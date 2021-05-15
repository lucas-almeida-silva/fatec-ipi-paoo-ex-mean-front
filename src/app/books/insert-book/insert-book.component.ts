import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { PostBook } from '../book.model';
import { BookService } from '../book.service';
import { imageMimeTypeValidator } from 'src/app/utils/validators/imageMimeType.validator';

@Component({
  selector: 'app-insert-book',
  templateUrl: './insert-book.component.html',
  styleUrls: ['./insert-book.component.css']
})
export class InsertBookComponent implements OnInit {
  book: PostBook;
  imagePreview: string;
  bookForm: FormGroup;
  isLoading = false;

  constructor(
    private bookService: BookService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.bookForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', [Validators.required, Validators.minLength(3)]],
      totalPages: ['', [Validators.required, Validators.min(1)]],
      image: [null, Validators.required, [imageMimeTypeValidator]]
    });

    this.activatedRoute.paramMap.subscribe(params => {
      if(params.has('id')) {
        this.isLoading = true;

        const bookId = params.get('id');

        this.bookService.getBook(bookId).subscribe(
          (book) => {
            this.isLoading = false;
            this.book = {
              id: book.id,
              title: book.title,
              author: book.author,
              totalPages: book.totalPages
            };

            this.bookForm.setValue({
              title: this.book.title,
              author: this.book.author,
              totalPages: this.book.totalPages,
              image: null
            });
          },
          () => {
            this.isLoading = false;
          }
        );
      }
    });
  }

  handleSubmit() {
    if(this.bookForm.invalid) return;

    const book = this.bookForm.value as PostBook;

    if(this.book) {
      this.bookService.updateBook({id: this.book.id, ...book});
    }
    else {
      this.bookService.addBook(book);
    }
  }

  handleSelectImage(event: Event) {
    const image = (event.target as HTMLInputElement).files[0];

    this.bookForm.patchValue({'image': image});
    this.bookForm.get('image').updateValueAndValidity();

    const fileReader = new FileReader();

    fileReader.onload = () => {
      this.bookForm.get('image').valid
        ? this.imagePreview = fileReader.result as string
        : this.imagePreview = null;
    };

    fileReader.readAsDataURL(image);
  }
}
