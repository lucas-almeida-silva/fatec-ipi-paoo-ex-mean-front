const multer = require('multer');
const slugify = require('slugify');
const path = require('path');

const MIME_TYPE_EXTENSION = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/bmp': 'bmp'
};

const imagesFolder = path.resolve(__dirname, '..', 'images');

module.exports = {
  imagesFolder,
  multer: {
    storage: multer.diskStorage({
      destination: (req, file, callback) => {
        const fileExtension = MIME_TYPE_EXTENSION[file.mimetype];

        const fileExtensionError = fileExtension
          ? null
          : new Error('Invalid file');

        callback(fileExtensionError, imagesFolder);
      },
      filename: (req, file, callback) => {
        const splittedFileName = file.originalname.split('.');
        const fileNameWithoutExtension = splittedFileName.slice(0, -1).join('');
        const fileName = slugify(fileNameWithoutExtension, {
          lower: true,
          strict: true,
        })

        const fileExtesion = MIME_TYPE_EXTENSION[file.mimetype];
        const finalFileName = `${Date.now()}-${fileName}-.${fileExtesion}`;

        callback(null, finalFileName);
      }
    })
  }
}
