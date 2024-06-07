const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @route GET /moviesdate
 * @group Movies - Операции с фильмами
 * @param {string} date.query.required - Дата для получения фильмов и их сеансов в формате 'YYYY-MM-DD'
 * @returns {Array.<Movie>} 200 - Список фильмов и их сеансов на указанную дату
 * @returns {Error}  default - Ошибка при получении фильмов и сеансов
 */
router.get('/moviesdate', async (req, res) => {
  const { date } = req.query;

  try {
    // Запрос к базе данных для получения фильмов и их сеансов на указанную дату
    const result = await pool.query(`
      SELECT
        movies.id AS movie_id,
        movies.title,
        movies.synopsis,
        movies.duration,
        movies.origin,
        movies.poster,
        sessions.id AS session_id,
        sessions.time,
        halls.name AS hall,
        halls.price_regular,
        halls.price_vip
      FROM
        movies
      JOIN
        sessions ON movies.id = sessions.movie_id
      JOIN
        halls ON sessions.hall_id = halls.id
      WHERE
        sessions.date = $1
        AND sessions.status = 'open'
    `, [date]);

    const moviesMap = new Map();

    // Группируем данные сеансов по фильмам
    result.rows.forEach(row => {
      const { movie_id, title, synopsis, duration, origin, poster, session_id, hall, time, price_regular, price_vip } = row;
      if (!moviesMap.has(movie_id)) {
        moviesMap.set(movie_id, {
          id: movie_id,
          title,
          synopsis,
          duration,
          origin,
          poster,
          sessions: []
        });
      }
      moviesMap.get(movie_id).sessions.push({ session_id, hall, time, price_regular, price_vip });
    });

    const movies = Array.from(moviesMap.values());
    res.json(movies);
  } catch (err) {
    console.error('Ошибка при получении фильмов и сеансов:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * @route GET /movies
 * @group Movies - Операции с фильмами
 * @returns {Array.<Movie>} 200 - Список фильмов
 * @returns {Error}  default - Ошибка при получении фильмов
 */
router.get('/movies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении фильмов:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

/**
 * @route POST /movies
 * @group Movies - Операции с фильмами
 * @param {Movie.model} movie.body.required - Новый фильм для добавления
 * @returns {Movie.model} 201 - Добавленный фильм
 * @returns {Error}  default - Ошибка при добавлении фильма
 */
router.post('/movies', async (req, res) => {
  const { title, duration, origin, poster, synopsis } = req.body;

  try {
    // Вставка нового фильма в базу данных
    const result = await pool.query(
      'INSERT INTO movies (title, duration, origin, poster, synopsis) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, duration, origin, poster, synopsis]
    );

    const newMovie = result.rows[0];
    res.status(201).json(newMovie);
  } catch (err) {
    console.error('Ошибка при добавлении фильма:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;
