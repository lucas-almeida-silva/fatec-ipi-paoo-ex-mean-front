const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const books = [
  {
    id: uuid(),
    title: 'Código limpo: habilidades práticas do Agile Software',
    author: 'Robert C. Martin',
    totalPages: 422
  },
  {
    id: uuid(),
    title: 'Domain-Driven Design: atacando as complexidades no coração do software',
    author: 'Evans Eric',
    totalPages: 563
  },
  {
    id: uuid(),
    title: 'Padrões de Projetos: Soluções Reutilizáveis de Software Orientados a Objetos',
    author: 'Erick Gamma, Richard Helm, Ralph Johnson e John Vlissides',
    totalPages: 368
  }
];

app.get('/api/books', (req, res) => {
  return res.json(books);
});

app.post('/api/books', (req, res) => {
  const { name, title, author, totalPages } = req.body;

  const book = { id: uuid(), name, title, author, totalPages };

  books.push(book);

  return res.status(201).send(book);
});

module.exports = app;
