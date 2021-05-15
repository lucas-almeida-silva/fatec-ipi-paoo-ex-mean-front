const { Router } = require('express');
const multer = require('multer');
const Book = require('../models/Book');
const uploadConfig = require('../config/upload');

const booksRouter = Router();

const upload = multer(uploadConfig.multer);

booksRouter.get('/', (req, res) => {
  Book.find().then(books => {
    res.json(books);
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

booksRouter.put('/:id', (req, res) => {
  const { id } = req.params
  const { title, author, totalPages } = req.body;

  const book = {
    title,
    author,
    totalPages
  };

  Book.updateOne({_id: id}, book).then(() => {
    res.status(200).send();
  });
});

booksRouter.delete('/:id', (req, res) => {
  const id = req.params.id;

  Book.deleteOne({_id: id}).then(() => {
    res.status(204).send();
  });
});

module.exports = booksRouter;
