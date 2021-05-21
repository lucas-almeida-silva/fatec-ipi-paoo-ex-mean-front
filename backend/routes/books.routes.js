const { Router } = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const Book = require('../models/Book');
const uploadConfig = require('../config/upload');

const booksRouter = Router();
const upload = multer(uploadConfig.multer);

booksRouter.get('/', (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  let query = Book.find();

  if(page && limit) {
    query = query.skip((page - 1) * limit).limit(limit);
  }

  query.then(books => {
    Book.countDocuments().then(total => {
      res.json({
        books,
        total
      });
    })
  });
});

booksRouter.get('/:id', (req, res) => {
  const id = req.params.id;

  Book.findById(id).then(book => {
    if(book) {
      res.json(book);
    }
    else {
      res.status(404).json({
        error: 'Book not found'
      });
    }
  });
});

booksRouter.post('/', upload.single('image'), (req, res) => {
  const { title, author, totalPages } = req.body;
  const image = req.file.filename;

  const book = new Book({
    title,
    author,
    totalPages,
    image
  });

  book.save().then(createdBook => {
    res.status(201).send({ id: createdBook._id });
  });
});

booksRouter.put('/:id', upload.single('image'), (req, res) => {
  const { id } = req.params
  const { title, author, totalPages } = req.body;
  const image = req.file;

  const book = {
    title,
    author,
    totalPages
  };

  if(image) {
    book.image = image.filename;

    Book.findById(id).then(book => {
      if(book?.image) {
        const filePath = path.join(uploadConfig.imagesFolder, book.image);

        fs.stat(filePath, (err, stats) => {
          if(!err) {
            fs.unlinkSync(filePath);
          }
        });
      }
    });
  }

  Book.findByIdAndUpdate({_id: id}, { $set: book }).then(() => {
    res.status(200).send();
  });
});

booksRouter.delete('/:id', (req, res) => {
  const id = req.params.id;

  Book.findById(id).then(book => {
    if(book?.image) {
      const filePath = path.join(uploadConfig.imagesFolder, book.image);

      fs.stat(filePath, (err, stats) => {
        if(!err) {
          fs.unlinkSync(filePath);
        }
      });
    }
  });

  Book.findByIdAndDelete(id).then(() => {
    res.status(204).send();
  });
});

module.exports = booksRouter;
