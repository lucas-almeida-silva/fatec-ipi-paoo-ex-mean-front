const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const Book = require('./models/Book');
const { mongoDb } = require('./config/database.js');

mongoose.connect(
  `mongodb+srv://${mongoDb.user}:${mongoDb.password}@${mongoDb.cluster}.mongodb.net/${mongoDb.database}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('Connection to MongoDB successful'))
.catch((ex) => console.log('Connection to MongoDB failed: ' + ex));

const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/books', (req, res) => {
  Book.find().then(books => {
    res.json(books);
  });
});

app.post('/api/books', (req, res) => {
  const { title, author, totalPages } = req.body;

  const book = new Book({
    title,
    author,
    totalPages
  });

  book.save().then(createdBook => {
    res.status(201).send({ id: createdBook._id });
  });
});

app.delete('/api/books/:id', (req, res) => {
  const id = req.params.id;

  Book.deleteOne({_id: id}).then(() => {
    res.status(204).send();
  });
});

module.exports = app;
