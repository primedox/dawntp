const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // Отдаем статические файлы (html, css, js)

// Пример маршрута для отправки заказа
app.post('/submit-order', (req, res) => {
    const { nickname, phone, otlaga, telegram } = req.body;
    // Здесь должна быть логика сохранения заказа в базу данных и отправки уведомления администратору
    console.log('Получен заказ:', nickname, phone, otlaga, telegram);

    // Отправляем подтверждение клиенту
    res.json({ message: 'Заказ успешно получен!' });
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});