const express = require('express');
const router = express.Router();
const pool = require('../db');

/**
 * @route GET /halls
 * @desc Получение списка залов
 * @access Public
 */
router.get('/halls', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM halls');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении залов:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

/**
 * @route DELETE /halls/:id
 * @desc Удаление зала
 * @access Public
 */
router.delete('/halls/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM halls WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error('Ошибка при удалении зала:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

/**
 * @route POST /halls
 * @desc Создание зала
 * @access Public
 */
router.post('/halls', async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query('INSERT INTO halls (name, seats, price_regular, price_vip) VALUES ($1, $2, $3, $4)', [name, '[]', 300, 500]);
    res.sendStatus(201);
  } catch (err) {
    console.error('Ошибка при создании зала:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

/**
 * @route GET /halls/:id
 * @desc Получение конфигурации зала по ID
 * @access Public
 */
router.get('/halls/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT seats FROM halls WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Зал не найден');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при получении конфигурации зала:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

/**
 * @route POST /halls/:id/config
 * @desc Сохранение конфигурации зала по ID
 * @access Public
 */
router.post('/halls/:id/config', async (req, res) => {
  const { id } = req.params;
  const { seats } = req.body;
  try {
    await pool.query('UPDATE halls SET seats = $1 WHERE id = $2', [seats, id]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Ошибка при сохранении конфигурации зала:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

/**
 * @route POST /halls/:id/prices
 * @desc Обновление цен зала
 * @access Public
 */
router.post('/halls/:id/prices', async (req, res) => {
  const { id } = req.params;
  const { regularPrice, vipPrice } = req.body;
  try {
    await pool.query('UPDATE halls SET price_regular = $1, price_vip = $2 WHERE id = $3', [regularPrice, vipPrice, id]);
    res.sendStatus(200);
  } catch (err) {
    console.error('Ошибка при обновлении цен зала:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router;
