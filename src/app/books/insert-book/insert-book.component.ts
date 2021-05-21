import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { SaveBook } from '../models/saveBook.model';
import { BookService } from '../book.service';
import { imageMimeTypeValidator } from 'src/app/utils/validators/imageMimeType.validator';

@Component({
  selector: 'app-insert-book',
  templateUrl: './insert-book.component.html',
  styleUrls: ['./insert-book.component.css']
})
export class InsertBookComponent implements OnInit {
  book: SaveBook;
  imagePreview: string;
  bookForm: FormGroup;
  isLoading = false;

  constructor(
    private bookService: BookService,
    private router: Router,
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

            this.imagePreview = book.imageUrl;
            this.bookForm.get('image').clearValidators();
          },
          () => {
            this.isLoading = false;
          }
        );
      }
    });
  }

  handleSubmit() {
    this.bookForm.markAllAsTouched();

    if(this.bookForm.invalid) return;

    const book = this.bookForm.value as SaveBook;

    this.isLoading = true;

    if(this.book) {
      this.bookService.updateBook({id: this.book.id, ...book}).subscribe(
        () => {
          this.isLoading = false;
          this.router.navigateByUrl('/');
        },
        () => {
          this.isLoading = false;
        }
      );
    }
    else {
      this.bookService.addBook(book).subscribe(
        () => {
          this.isLoading = false;
          this.router.navigateByUrl('/');
        },
        () => {
          this.isLoading = false;
        }
      );
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
