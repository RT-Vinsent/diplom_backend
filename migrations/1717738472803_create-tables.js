/**
 * Функция миграции для создания таблиц в базе данных.
 *
 * @param {object} pgm - Объект миграции Postgres
 */
 exports.up = (pgm) => {
  // Создание таблицы фильмов
  pgm.createTable('movies', {
    id: 'id', // Автоматически создается поле id как первичный ключ
    title: { type: 'varchar(255)', notNull: true }, // Название фильма, обязательное поле
    synopsis: { type: 'text', notNull: true }, // Описание фильма, обязательное поле
    duration: { type: 'varchar(50)', notNull: true }, // Длительность фильма, обязательное поле
    origin: { type: 'varchar(50)', notNull: true }, // Страна происхождения, обязательное поле
    poster: { type: 'varchar(255)', notNull: true }, // Постер фильма, обязательное поле
  });

  // Создание таблицы залов
  pgm.createTable('halls', {
    id: 'id', // Автоматически создается поле id как первичный ключ
    name: { type: 'varchar(50)', notNull: true }, // Название зала, обязательное поле
    seats: { type: 'jsonb', notNull: true }, // Массив мест в зале в формате JSON, обязательное поле
    price_regular: { type: 'numeric(10, 2)', notNull: true }, // Цена за обычные места, обязательное поле
    price_vip: { type: 'numeric(10, 2)', notNull: true }, // Цена за VIP-места, обязательное поле
  });

  // Создание таблицы сеансов
  pgm.createTable('sessions', {
    id: 'id', // Автоматически создается поле id как первичный ключ
    movie_id: {
      type: 'integer',
      references: 'movies',
      onDelete: 'cascade', // При удалении фильма удаляются все связанные сеансы
    },
    hall_id: {
      type: 'integer',
      references: 'halls',
      onDelete: 'cascade', // При удалении зала удаляются все связанные сеансы
    },
    time: { type: 'time', notNull: true }, // Время сеанса, обязательное поле
    date: { type: 'text', notNull: true }, // Дата сеанса, обязательное поле
    status: { type: 'varchar(50)', notNull: true, default: 'close' }, // Статус сеанса, обязательное поле
  });

  // Создание таблицы проданных билетов
  pgm.createTable('sold_tickets', {
    id: 'id', // Автоматически создается поле id как первичный ключ
    session_id: {
      type: 'integer',
      references: 'sessions',
      onDelete: 'cascade', // При удалении сеанса удаляются все связанные билеты
    },
    seat_row: { type: 'integer', notNull: true }, // Ряд места, обязательное поле
    seat_column: { type: 'integer', notNull: true }, // Номер места, обязательное поле
    status: { type: 'varchar(255)', notNull: true }, // Статус билета, обязательное поле
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }, // Дата и время создания билета
  });

  // Добавление уникального ограничения для таблицы проданных билетов
  // То есть, в пределах одного сеанса не может быть двух билетов на одно и то же место.
  pgm.addConstraint('sold_tickets', 'unique_seat_per_session', {
    unique: ['session_id', 'seat_row', 'seat_column'],
  });

  // Создание таблицы администраторов
  pgm.createTable('admins', {
    id: 'id', // Автоматически создается поле id как первичный ключ
    email: { type: 'varchar(255)', notNull: true, unique: true }, // Электронная почта администратора, обязательное и уникальное поле
    password: { type: 'varchar(255)', notNull: true }, // Пароль администратора, обязательное поле
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }, // Дата и время создания учетной записи
  });
};

/**
 * Функция миграции для удаления таблиц из базы данных.
 *
 * @param {object} pgm - Объект миграции Postgres
 */
exports.down = (pgm) => {
  pgm.dropTable('sold_tickets'); // Удаление таблицы проданных билетов
  pgm.dropTable('sessions'); // Удаление таблицы сеансов
  pgm.dropTable('halls'); // Удаление таблицы залов
  pgm.dropTable('movies'); // Удаление таблицы фильмов
  pgm.dropTable('admins'); // Удаление таблицы администраторов
};
