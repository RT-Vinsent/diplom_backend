const { Pool } = require('pg');
require('dotenv').config();

/**
 * Настройки подключения к базе данных PostgreSQL.
 */
// const pool = new Pool({
//   user: 'cinema',
//   host: 'localhost',
//   database: 'cinema',
//   password: 'root',
//   port: 5432,
// });

/**
 * Настройки подключения к базе данных PostgreSQL.
 * Использует переменную окружения DATABASE_URL для подключения.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;
