require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const limiter = require('./middlewares/limiter');
const config = require('./config');
const { HTTP_STATUS } = require('./constants');

const router = require('./routes/index');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const corsHandler = require('./middlewares/corsHandler');

const { PORT = 3000 } = process.env;

const app = express();

app.use(limiter);

app.use(helmet());

app.use(cookieParser());

mongoose.connect(config.mongoURL, {
  useNewUrlParser: true,
});

app.use(corsHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'https://movies-service.nomoredomainsrocks.ru',
    exposedHeaders: ['set-cookie'],
    credentials: true,
  }),
);

app.use(requestLogger); // подключаем логгер запросов

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use((err, req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  const { statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    message: statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
