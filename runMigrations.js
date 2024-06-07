require('dotenv').config();
const nodePgMigrate = require('node-pg-migrate');

/**
 * Выполняет миграцию базы данных.
 * @param {string} direction - Направление миграции ("up" или "down").
 * @param {string} file - Имя файла миграции.
 */
const migrate = async (direction, file) => {
  try {
    await nodePgMigrate.default({
      direction,
      migrationsTable: 'pgmigrations',
      dir: 'migrations',
      migrationFile: file,
      databaseUrl: process.env.DATABASE_URL,
    });
    console.log(`Migration ${direction} completed for ${file}`);
  } catch (error) {
    console.error(`Migration ${direction} failed for ${file}`, error);
  }
};

/**
 * Запускает все необходимые миграции базы данных.
 */
const runMigrations = async () => {
  await migrate('up', '1717738472803_create-tables.js');
  await migrate('up', '1717738479853_populate-tables.js');
};

runMigrations();
