// import express from 'express';
// import WebSocket, { WebSocketServer } from 'ws';
// import crypto from 'crypto';
// import db from "../utils/db";
// import http from 'http';

// const app = express();
// const server = http.createServer(app); // создаем HTTP сервер для Express

// // Константы для шифрования
// const ENCRYPTION_KEY = '12345678901234567890123456789012'; // 32 байта для AES-256
// const IV_LENGTH = 16; // Длина инициализационного вектора для AES

// // Создаем сервер WebSocket с использованием HTTP сервера
// const wss = new WebSocketServer({ server });

// wss.on('connection', (ws) => {
//   const senderId = 1; // Установите senderId из вашей логики
//   const receiverId = 2; // Установите receiverId из вашей логики

//   // Отправка истории сообщений при подключении
//   getChatMessages(senderId, receiverId).then((messages) => {
//     ws.send(JSON.stringify({ type: 'history', messages }));
//   });

//   // Обработка сообщений от клиента
//   ws.on('message', async (message) => {
//     try {
//       const data = JSON.parse(message.toString());
//       const { senderId, receiverId, content } = data;

//       console.log('Получено сообщение:', data);

//       // Шифрование сообщения
//       const encryptedMessage = encryptMessage(content);

//       // Сохранение зашифрованного сообщения в базе данных
//       await db.query(
//         `INSERT INTO chat_messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)`,
//         [senderId, receiverId, encryptedMessage]
//       );

//       // Отправка зашифрованного сообщения другим пользователям
//       wss.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//           // Отправляем только зашифрованное сообщение
//           client.send(JSON.stringify({ senderId, receiverId, content: encryptedMessage }));
//         }
//       });
//     } catch (error) {
//       console.error('Ошибка при обработке сообщения:', error.message);
//     }
//   });

//   // Приветственное сообщение при подключении
//   ws.send(JSON.stringify({ message: 'Подключение установлено' }));
// });

// // Функция для шифрования сообщения
// function encryptMessage(message: string): string {
//   const iv = crypto.randomBytes(IV_LENGTH); // Генерация инициализационного вектора
//   const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
//   let encrypted = cipher.update(message, 'utf8', 'hex');
//   encrypted += cipher.final('hex');
//   return `${iv.toString('hex')}:${encrypted}`;
// }

// // Функция для дешифрования сообщения
// function decryptMessage(encryptedMessage: string): string {
//   const [ivHex, encrypted] = encryptedMessage.split(':');
//   const iv = Buffer.from(ivHex, 'hex');
//   const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
//   let decrypted = decipher.update(encrypted, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
//   return decrypted;
// }

// // Функция для получения чатов между двумя пользователями
// async function getChatMessages(senderId: number, receiverId: number) {
//   const { rows } = await db.query(
//     `SELECT * FROM chat_messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) ORDER BY created_at`,
//     [senderId, receiverId]
//   );

//   // Дешифровка содержимого сообщений перед отправкой
//   return rows.map((row) => ({
//     ...row,
//     content: decryptMessage(row.content)
//   }));
// }

// // Запускаем сервер на порту 5001
// server.listen(5001, () => {
//   console.log('Server is running on port 5001');
// });
