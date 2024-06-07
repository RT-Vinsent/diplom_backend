const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const router = express.Router();

/**
 * @route POST /register
 * @desc Регистрация администратора
 * @access Public
 */
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);
    // Вставляем нового администратора в базу данных
    await pool.query('INSERT INTO admins (email, password) VALUES ($1, $2)', [email, hashedPassword]);
    res.status(201).send('Администратор успешно зарегистрирован');
  } catch (err) {
    console.error('Ошибка при регистрации администратора:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

/**
 * @route POST /login
 * @desc Авторизация администратора
 * @access Public
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Получаем администратора по email
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).send('Неверные учетные данные');
    }

    const admin = result.rows[0];
    // Сравниваем введенный пароль с хэшированным паролем в базе данных
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).send('Неверные учетные данные');
    }

    // Создаем JWT токен
    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Ошибка при входе в систему:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

/**
 * @route POST /refresh-token
 * @desc Обновление токена
 * @access Public
 */
router.post('/refresh-token', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).send('Токен не предоставлен');
  }

  try {
    // Проверяем и декодируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Создаем новый JWT токен
    const newToken = jwt.sign({ adminId: decoded.adminId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: newToken });
  } catch (err) {
    console.error('Ошибка при обновлении токена:', err.message);
    res.status(401).send('Неверный или истекший токен');
  }
});

module.exports = router;
