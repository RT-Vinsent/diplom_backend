const bcrypt = require('bcryptjs');

/**
 * Функция для генерации сеансов в таблице sessions.
 *
 * @param {object} pgm - Объект миграции Postgres
 * @param {number} movieId - ID фильма
 * @param {number} hallId - ID зала
 * @param {string[]} times - Массив времени сеансов
 * @param {Date} baseDate - Начальная дата
 * @param {number} days - Количество дней, на которые нужно создать сеансы
 * @param {number} timeZoneOffset - Сдвиг часового пояса относительно UTC
 * @param {string} [status='open'] - Статус сеанса
 */
function generateSessions(pgm, movieId, hallId, times, baseDate, days, timeZoneOffset, status = 'open') {
  for (let j = 0; j < days; j++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + j); // Увеличиваем дату на j дней
    const formattedDate = dateToTimezone(date, timeZoneOffset);

    times.forEach(time => {
      // Вставляем запись о сеансе в таблицу sessions
      pgm.sql(`INSERT INTO sessions (movie_id, hall_id, time, date, status) VALUES (${movieId}, ${hallId}, '${time}', '${formattedDate}', '${status}')`);
    });
  }
}

/**
 * Функция для преобразования даты в указанную временную зону.
 *
 * @param {Date} dateValue - Исходная дата
 * @param {number} [zone=0] - Сдвиг часового пояса относительно UTC
 * @returns {string} - Форматированная дата в формате YYYY-MM-DD
 */
function dateToTimezone(dateValue, zone = 0) {
  const newDate = new Date(dateValue);
  const dateTimezone = new Date(newDate.setHours(newDate.getHours() + zone)); // Применяем сдвиг часового пояса
  const year = dateTimezone.getUTCFullYear();
  const month = String(dateTimezone.getUTCMonth() + 1).padStart(2, '0'); // Месяц начинается с 0, поэтому добавляем 1
  const day = String(dateTimezone.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Миграция вверх: создание записей в таблицах и генерация сеансов.
 *
 * @param {object} pgm - Объект миграции Postgres
 */
exports.up = async (pgm) => {
  const seatsStatusTemplate = [
    ["disabled", "disabled", "disabled", "disabled", "disabled", "standart", "standart", "disabled", "disabled", "disabled", "disabled", "disabled"],
    ["disabled", "disabled", "disabled", "disabled", "standart", "standart", "standart", "standart", "disabled", "disabled", "disabled", "disabled"],
    ["disabled", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "disabled", "disabled", "disabled"],
    ["standart", "standart", "standart", "standart", "standart", "vip", "vip", "standart", "standart", "disabled", "disabled", "disabled"],
    ["standart", "standart", "standart", "standart", "vip", "vip", "vip", "vip", "standart", "disabled", "disabled", "disabled"],
    ["standart", "standart", "standart", "standart", "vip", "vip", "vip", "vip", "standart", "disabled", "disabled", "disabled"],
    ["standart", "standart", "standart", "standart", "vip", "vip", "vip", "vip", "standart", "disabled", "disabled", "disabled"],
    ["standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart", "standart"]
  ];

  const baseDate = new Date();
  const times1 = ['08:00:00', '13:00:00', '18:00:00'];
  const times2 = ['09:40:00', '14:40:00', '19:40:00'];
  const times3 = ['11:10:00', '16:10:00', '21:10:00'];
  const days = 10;
  const timeZoneOffset = 5; // GMT+5

  // Вставка данных в таблицу movies
  pgm.sql(`
    INSERT INTO movies (title, synopsis, duration, origin, poster) VALUES
    ('Звёздные войны XXIII: Атака клонированных клонов', 'Две сотни лет назад малороссийские хутора разоряла шайка нехристей-ляхов во главе с могущественным колдуном.', '90', 'США', 'i/poster1.jpg'),
    ('Альфа', '20 тысяч лет назад Земля была холодным и неуютным местом, в котором смерть подстерегала человека на каждом шагу.', '80', 'Франция', 'i/poster2.jpg'),
    ('Хищник', 'Самые опасные хищники Вселенной, прибыв из глубин космоса, высаживаются на улицах маленького городка, чтобы начать свою кровавую охоту.', '100', 'Канада, США', 'i/poster3.jpg');
  `);

  // Вставка данных в таблицу halls
  pgm.sql(`
    INSERT INTO halls (name, seats, price_regular, price_vip) VALUES
    ('Зал 1', '${JSON.stringify(seatsStatusTemplate)}', 300.00, 500.00),
    ('Зал 2', '${JSON.stringify(seatsStatusTemplate)}', 350.00, 600.00);
  `);

  // Генерация сеансов для фильмов и залов
  generateSessions(pgm, 1, 1, times1, baseDate, days, timeZoneOffset);
  generateSessions(pgm, 2, 1, times2, baseDate, days, timeZoneOffset);
  generateSessions(pgm, 3, 1, times3, baseDate, days, timeZoneOffset);
  generateSessions(pgm, 1, 2, times3, baseDate, days, timeZoneOffset);
  generateSessions(pgm, 2, 2, times2, baseDate, days, timeZoneOffset);
  generateSessions(pgm, 3, 2, times1, baseDate, days, timeZoneOffset);



  // Вставка данных в таблицу admins
  const email = 'roman@roman.com'; // Замените на нужный email
  const password = 'roman'; // Замените на нужный пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  pgm.sql(`
    INSERT INTO admins (email, password)
    VALUES ('${email}', '${hashedPassword}')
  `);
};

/**
 * Миграция вниз: удаление записей из таблиц.
 *
 * @param {object} pgm - Объект миграции Postgres
 */
exports.down = async (pgm) => {
  const baseDate = new Date();
  const dates = [];
  const timeZoneOffset = 5; // GMT+5

  for (let i = 0; i < 10; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    const formattedDate = dateToTimezone(date, timeZoneOffset);
    dates.push(`'${formattedDate}'`);
  }

  // Удаление сеансов
  await pgm.sql(`DELETE FROM sessions WHERE date IN (${dates.join(', ')});`);

  // Удаление данных из таблиц halls и movies
  await pgm.sql(`DELETE FROM halls WHERE name IN ('Зал 1', 'Зал 2');`);
  await pgm.sql(`DELETE FROM movies WHERE title IN ('Звёздные войны XXIII: Атака клонированных клонов', 'Альфа', 'Хищник');`);

  // Удаление данных из таблицы администраторов
  await pgm.sql(`DELETE FROM admins WHERE email = 'roman@roman.com';`);
};
