require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./error-handler');
const { NODE_ENV } = require('./config');

const notes = require('./notes/notes-router');
const folders = require('./folders/folders-router');

const app = express();

app.use(morgan(NODE_ENV === 'production' ? 'tiny' : 'common'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/notes', notes);
app.use('/folders', folders);

app.use(errorHandler);

module.exports = app;
