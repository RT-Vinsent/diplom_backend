const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

/**
 * Маршрут для обновления мест в зале.
 *
 * @name post/update-seats
 * @function
 * @memberof module:routers/session
 * @param {string} sessionId - Идентификатор сеанса
 * @param {Array<string>} selectedSeats - Массив выбранных мест
 * @returns {void}
 */
router.post('/update-seats', async (req, res) => {
  const { sessionId, selectedSeats } = req.body;

  try {
    // Запрос к базе данных для обновления мест
    for (const seat of selectedSeats) {
      const [row, column] = seat.split('-').map(Number);

      // Проверка, существует ли уже запись для данного места
      const checkResult = await pool.query(`
        SELECT * FROM sold_tickets
        WHERE session_id = $1 AND seat_row = $2 AND seat_column = $3
      `, [sessionId, row, column]);

      if (checkResult.rows.length > 0) {
        // Обновляем статус, если запись уже существует
        await pool.query(`
          UPDATE sold_tickets
          SET status = 'taken'
          WHERE session_id = $1 AND seat_row = $2 AND seat_column = $3
        `, [sessionId, row, column]);
      } else {
        // Вставляем новую запись, если она не существует
        await pool.query(`
          INSERT INTO sold_tickets (session_id, seat_row, seat_column, status)
          VALUES ($1, $2, $3, 'taken')
        `, [sessionId, row, column]);
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(`Ошибка при обновлении мест для сеанса ${sessionId}:`, err.message);
    res.status(500).send('Ошибка сервера');
  }
});

/**
 * Маршрут для получения данных о проданных билетах.
 *
 * @name get/sold-tickets
 * @function
 * @memberof module:routers/session
 * @param {string} sessionId - Идентификатор сеанса
 * @returns {Array.<Object>} - Массив проданных билетов
 */
// router.get('/sold-tickets', async (req, res) => {
//   const { sessionId } = req.query;

//   try {
//     const result = await pool.query(`
//       SELECT seat_row, seat_column
//       FROM sold_tickets
//       WHERE session_id = $1
//     `, [sessionId]);

//     res.json(result.rows);
//   } catch (err) {
//     console.error('Ошибка при получении данных о проданных билетах:', err.message);
//     res.status(500).send('Server Error');
//   }
// });

module.exports = router;
