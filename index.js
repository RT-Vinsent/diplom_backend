const express = require('express');
const cors = require('cors');
const moviesRouter = require('./routes/movies');
const sessionRouter = require('./routes/session');
const seatsRouter = require('./routes/seats');
const authRouter = require('./routes/auth');
const hallsRouter = require('./routes/halls');
const authMiddleware = require('./middleware/auth');

const app = express();

/**
 * @fileoverview Основной файл приложения, который настраивает и запускает сервер Express.
 */

/**
 * Middleware для обработки JSON и CORS.
 */
app.use(cors());
app.use(express.json());

/**
 * Использование маршрутов.
 */
app.use('/api', moviesRouter);
app.use('/api', sessionRouter);
app.use('/api', seatsRouter);
app.use('/api/auth', authRouter);
app.use('/api', authMiddleware, hallsRouter);

/**
 * Запуск сервера на указанном порту.
 * @const {number} PORT - Порт, на котором будет запущен сервер.
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
