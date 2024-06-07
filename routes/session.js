const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

/**
 * Маршрут для получения данных о сеансе.
 *
 * @name get/session
 * @function
 * @memberof module:routers/session
 * @param {string} sessionId.query.required - Идентификатор сеанса
 * @returns {Object} 200 - Данные о сеансе
 * @returns {Error}  default - Ошибка при получении данных о сеансе
 */
router.get('/session', async (req, res) => {
  const { sessionId } = req.query;

  try {
    // Запрос к базе данных для получения данных о сеансе
    const result = await pool.query(`
      SELECT
        movies.id AS movie_id,
        movies.title,
        movies.synopsis,
        movies.duration,
        movies.origin,
        movies.poster,
        halls.name AS hall,
        sessions.time,
        sessions.date,
        halls.seats,
        halls.price_regular,
        halls.price_vip
      FROM
        sessions
      JOIN
        movies ON sessions.movie_id = movies.id
      JOIN
        halls ON sessions.hall_id = halls.id
      WHERE
        sessions.id = $1
    `, [sessionId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = result.rows[0];
    const seats = session.seats; // Данные уже являются JSON

    // Запрос к базе данных для получения данных о проданных билетах
    const soldTicketsResult = await pool.query(`
      SELECT seat_row, seat_column, status
      FROM sold_tickets
      WHERE session_id = $1
    `, [sessionId]);

    const soldTickets = soldTicketsResult.rows;

    // Обновление состояния мест на основе проданных билетов
    // soldTickets.forEach(ticket => {
    //   seats[ticket.seat_row][ticket.seat_column] = 'taken';
    // });

    res.json({
      movie: {
        id: session.movie_id,
        title: session.title,
        synopsis: session.synopsis,
        duration: session.duration,
        origin: session.origin,
        poster: session.poster,
      },
      hall: session.hall,
      time: session.time,
      date: session.date,
      seats,
      prices: {
        standart: session.price_regular,
        vip: session.price_vip
      },
      soldTickets
    });
  } catch (err) {
    console.error('Ошибка при получении данных о сеансе:', err.message);
    res.status(500).send('Server Error');
  }
});

/**
 * Маршрут для получения списка сеансов.
 *
 * @name get/sessions
 * @function
 * @memberof module:routers/session
 * @returns {Array.<Object>} 200 - Список сеансов
 * @returns {Error}  default - Ошибка при получении сеансов
 */
router.get('/sessions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sessions');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении сеансов:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

/**
 * Маршрут для получения списка сеансов по дате.
 *
 * @name get/sessions/by-date
 * @function
 * @memberof module:routers/session
 * @param {string} date.query.required - Дата для получения сеансов
 * @returns {Array.<Object>} 200 - Список сеансов на указанную дату
 * @returns {Error}  default - Ошибка при получении сеансов
 */
router.get('/sessions/by-date', async (req, res) => {
  const { date } = req.query;

  try {
    const result = await pool.query(`
      SELECT
        sessions.id,
        sessions.hall_id,
        sessions.movie_id,
        sessions.time,
        sessions.date,
        movies.title,
        movies.duration,
        movies.poster
      FROM
        sessions
      JOIN
        movies ON sessions.movie_id = movies.id
      WHERE
        sessions.date = $1
    `, [date]);

    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении сеансов по дате:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

/**
 * Маршрут для обновления сеансов.
 *
 * @name put/sessions
 * @function
 * @memberof module:routers/session
 * @param {Array.<Object>} sessions.body.required - Список сеансов для обновления
 * @returns {void}
 */
router.put('/sessions', authMiddleware, async (req, res) => {
  const sessions = req.body;
  try {
    for (const session of sessions) {
      await pool.query(
        'UPDATE sessions SET time = $1 WHERE id = $2',
        [session.time, session.id]
      );
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('Ошибка при обновлении сеансов:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

/**
 * Маршрут для добавления новых сеансов.
 *
 * @name post/sessions
 * @function
 * @memberof module:routers/session
 * @param {Array.<Object>} sessions.body.required - Список новых сеансов для добавления
 * @returns {void}
 */
router.post('/sessions', authMiddleware, async (req, res) => {
  const sessions = req.body;
  try {
    for (const session of sessions) {
      await pool.query(
        'INSERT INTO sessions (hall_id, movie_id, time, date, status) VALUES ($1, $2, $3, $4, $5)',
        [session.hall_id, session.movie_id, session.time, session.date, 'closed']
      );
    }
    res.sendStatus(201);
  } catch (err) {
    console.error('Ошибка при добавлении сеансов:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

/**
 * Маршрут для удаления сеанса по ID.
 *
 * @name delete/sessions/:id
 * @function
 * @memberof module:routers/session
 * @param {string} id.params.required - Идентификатор сеанса для удаления
 * @returns {void}
 */
router.delete('/sessions/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM sessions WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('Ошибка при удалении сеанса:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

/**
 * Маршрут для обновления статуса всех сеансов на "open".
 *
 * @name post/sessions/open
 * @function
 * @memberof module:routers/session
 * @returns {void}
 */
router.post('/sessions/open', authMiddleware, async (req, res) => {
  try {
    await pool.query(`UPDATE sessions SET status = 'open' WHERE status = 'closed'`);
    res.sendStatus(200);
  } catch (err) {
    console.error('Ошибка при обновлении статуса сеансов:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;
