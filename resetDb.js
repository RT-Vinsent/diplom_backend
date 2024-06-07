const pool = require('./db');

/**
 * Асинхронная функция для сброса базы данных.
 * Удаляет таблицы `sessions`, `movies`, `halls`, `admins` и `sold_tickets`, а также записи из таблицы `pgmigrations`.
 * 
 * @async
 * @function resetDatabase
 * @returns {Promise<void>}
 */
async function resetDatabase() {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS sold_tickets;
      DROP TABLE IF EXISTS sessions;
      DROP TABLE IF EXISTS movies;
      DROP TABLE IF EXISTS halls;
      DROP TABLE IF EXISTS admins;
      DELETE FROM pgmigrations;
    `);
    console.log('Database reset successful');
  } catch (err) {
    console.error('Error resetting database:', err);
  } finally {
    // Закрываем соединение с базой данных
    await pool.end();
  }
}

// Вызов функции для сброса базы данных
resetDatabase();
