const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');  // Для отправки email
const app = express();
const port = process.env.PORT || 3000;

// Настройки почты
const transporter = nodemailer.createTransport({
  service: 'gmail', // или другой сервис
  auth: {
    user: 'ваша_почта@gmail.com',
    pass: 'ваш_пароль'
  }
});

// Middleware
app.use(bodyParser.json());
app.use(express.static('.'));  // Отдаем статические файлы из текущей директории

// Инициализация базы данных
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error("Ошибка при подключении к базе данных:", err.message);
    } else {
        console.log('Подключено к SQLite базе данных.');
        // Создаем таблицы, если их нет
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nickname TEXT NOT NULL
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nickname TEXT NOT NULL,
            phone TEXT NOT NULL,
            otlaga TEXT NOT NULL,
            telegram TEXT NOT NULL
        )`);
    }
});

// Маршрут для авторизации (создание пользователя)
app.post('/login', (req, res) => {
  const { nickname } = req.body;

  db.run(`INSERT INTO users (nickname) VALUES (?)`, [nickname], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // Получаем ID последнего вставленного элемента
    console.log(`Добавлена запись с ID: ${this.lastID}`);
    res.json({ message: 'Пользователь создан', userId: this.lastID });
  });
});

// Маршрут для отправки заказа и email
app.post('/submit-order', (req, res) => {
    const { nickname, phone, otlaga, telegram } = req.body;

    // Сохраняем заказ в базе данных
    db.run(`INSERT INTO orders (nickname, phone, otlaga, telegram) VALUES (?, ?, ?, ?)`,
        [nickname, phone, otlaga, telegram],
        function(err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ message: 'Ошибка при сохранении заказа' });
            }

            // Отправляем email
            const mailOptions = {
                from: 'amudrilov78@gmail.com',
                to: 'amudrilov78@gmail.com',  // Замените на почту администратора
                subject: 'Новый заказ',
                text: `Никнейм: ${nickname}\nТелефон: ${phone}\nОтлега: ${otlaga}\nTelegram: ${telegram}`
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            res.json({ message: 'Заказ успешно получен!' });
        });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
