const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
});

bookSchema.set('toJSON', {
  transform: function (doc, obj) {
    obj.id = obj._id;

    delete obj._id;
    delete obj.__v;

    obj.imageUrl = obj.image
      ? `${process.env.API_URL}/images/${obj.image}`
      : null;

    delete obj.image;
  }
});

module.exports = mongoose.model('Book', bookSchema);
