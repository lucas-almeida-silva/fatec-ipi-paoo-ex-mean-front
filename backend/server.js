require('dotenv').config({ path: `${__dirname}/.env` });

const app = require('./app');

app.listen(process.env.SERVER_PORT || 3333, () => console.log('Server started'));
