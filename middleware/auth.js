const jwt = require('jsonwebtoken');

/**
 * Middleware для проверки авторизации.
 * Проверяет наличие и валидность JWT в заголовке авторизации.
 *
 * @param {Object} req - Объект запроса Express
 * @param {Object} res - Объект ответа Express
 * @param {Function} next - Функция продолжения обработки запроса
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Проверяем, существует ли заголовок авторизации
  if (!authHeader) {
    return res.status(401).send('Требуется авторизация');
  }

  // Извлекаем токен из заголовка авторизации
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send('Требуется авторизация');
  }

  // Проверяем валидность токена
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Неверный токен');
    }
    // Сохраняем декодированные данные токена в запрос для последующего использования
    req.user = decoded;
    // Продолжаем выполнение следующего middleware или обработчика запроса
    next();
  });
};

module.exports = authMiddleware;
