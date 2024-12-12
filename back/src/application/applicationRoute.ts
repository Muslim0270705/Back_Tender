import express from "express";
import ApplicationController from "./applicationController";
import CheckService from "../services/CheckService";

const router = express.Router();

/*  @swagger
 * tags:
 *   - name:  Application
 *     description: Application API
 */

/**
 * @swagger
 * /application/create:
 *   post:
 *     summary: "Создание заявки с загрузкой файлов"
 *     tags: [Tender]
 *     description: "Создает новую заявку для пользователя и позволяет загружать файлы. Для выполнения требуется действительный токен."
 *     security:
 *       - bearerAuth: []  # Требуется токен Bearer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               projectName:
 *                 type: string
 *                 description: "Название проекта"
 *               isProduct:
 *                 type: boolean
 *                 description: "Является ли заявка продуктом"
 *               isService:
 *                 type: boolean
 *                 default: false
 *                 description: "Является ли заявка услугой"
 *               description:
 *                 type: string
 *                 description: "Описание заявки"
 *               deadlines:
 *                 type: string
 *                 description: "Сроки выполнения заявки"
 *               totalSum:
 *                 type: number
 *                 description: "Общая сумма заявки"
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "Файлы, прикрепленные к заявке"
 *             required:
 *               - projectName
 *               - description
 *               - totalSum
 *               - deadlines
 *     responses:
 *       200:
 *         description: "Заявка успешно создана"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: boolean
 *                   description: "Статус выполнения запроса"
 *                 message:
 *                   type: string
 *                   description: "Сообщение о результате выполнения"
 *                 error:
 *                   type: boolean
 *                   description: "Флаг ошибки"
 *               example:
 *                 data: true
 *                 message: "Заявка успешно создана"
 *                 error: false
 *       400:
 *         description: "Некорректный запрос, неверный формат данных"
 *       401:
 *         description: "Нет доступа, неавторизованный доступ, недействительный или отсутствующий токен"
 *       403:
 *         description: "Пользователь не имеет прав для создания заявки"
 *       415:
 *         description: "Неверный формат файла (если загружены файлы)"
 *       413:
 *         description: "Размер загруженного файла слишком велик"
 *       500:
 *         description: "Ошибка на сервере"
 *       422:
 *         description: "Ошибка валидации, неверный формат данных"
 */
router.post(
  "/create",
  CheckService.isCustomerToken,
  ApplicationController.createController
);
/**
 * @swagger
 * /application/user:
 *   get:
 *     summary: "Получение заявок пользователя"
 *     tags: [Tender]
 *     description: "Возвращает все заявки, принадлежащие пользователю. Для выполнения требуется действительный токен."
 *     security:
 *       - bearerAuth: []  # Требуется токен Bearer
 *     responses:
 *       200:
 *         description: "Заявки пользователя успешно получены"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: "ID заявки"
 *                       projectName:
 *                         type: string
 *                         description: "Название проекта"
 *                       isProduct:
 *                         type: boolean
 *                         description: "Является ли заявка продуктом"
 *                       isService:
 *                         type: boolean
 *                         description: "Является ли заявка услугой"
 *                       description:
 *                         type: string
 *                         description: "Описание заявки"
 *                       deadlines:
 *                         type: string
 *                         description: "Сроки выполнения заявки"
 *                       totalSum:
 *                         type: number
 *                         description: "Общая сумма заявки"
 *                       status:
 *                         type: string
 *                         description: "Статус заявки"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: "Дата создания заявки"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: "Дата последнего обновления заявки"
 *                 message:
 *                   type: string
 *                   description: "Сообщение о результате выполнения"
 *                 error:
 *                   type: boolean
 *                   description: "Флаг ошибки"
 *               example:
 *                 data:
 *                   - id: 1
 *                     projectName: "Разработка сайта"
 *                     isProduct: true
 *                     isService: false
 *                     description: "Создание веб-сайта для клиента"
 *                     deadlines: "2024-12-31"
 *                     totalSum: 50000
 *                     status: "В процессе"
 *                     createdAt: "2024-11-01T12:00:00Z"
 *                     updatedAt: "2024-11-01T12:00:00Z"
 *                 message: "Заявки успешно получены"
 *                 error: false
 *       401:
 *         description: "Нет доступа, неавторизованный доступ, недействительный или отсутствующий токен"
 *       404:
 *         description: "Пользователь не найден или не имеет заявок"
 *       500:
 *         description: "Ошибка на сервере"
 */
router.get(
  "/user",
  CheckService.isCustomerToken,
  ApplicationController.getApplicationByUser
);
/**
 * @swagger
 * /application/id:
 *   get:
 *     summary: "Получение заявки по ID"
 *     tags: [Tender]
 *     description: "Возвращает заявку по указанному ID. Если заявка имеет победителя, то возвращает информацию о победителе. Для выполнения требуется действительный токен."
 *     security:
 *       - bearerAuth: []  # Требуется токен Bearer
 *     parameters:
 *       - name: id
 *         in: query
 *         required: true
 *         description: "ID заявки"
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Заявка и информация о победителе (если существует)"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       has_winner:
 *                         type: boolean
 *                         description: "Есть ли победитель"
 *                       creator_fio:
 *                         type: string
 *                         description: "ФИО создателя заявки"
 *                       creator_company_name:
 *                         type: string
 *                         description: "Название компании создателя"
 *                       description:
 *                         type: string
 *                         description: "Описание заявки"
 *                       application_deadlines:
 *                         type: string
 *                         description: "Сроки выполнения заявки"
 *                       application_total_sum:
 *                         type: string
 *                         description: "Общая сумма заявки"
 *                       winner_fio:
 *                         type: string
 *                         description: "ФИО победителя"
 *                       winner_company_name:
 *                         type: string
 *                         description: "Название компании победителя"
 *                       winner_email:
 *                         type: string
 *                         description: "Email победителя"
 *                       winner_phone:
 *                         type: string
 *                         description: "Телефон победителя"
 *                       winner_total_sum:
 *                         type: string
 *                         description: "Общая сумма победителя"
 *                       winner_deadlines:
 *                         type: string
 *                         description: "Сроки выполнения победителя"
 *                       winner_conditions:
 *                         type: string
 *                         description: "Условия победителя"
 *                 message:
 *                   type: string
 *                   description: "Сообщение о результате выполнения"
 *                 error:
 *                   type: boolean
 *                   description: "Флаг ошибки"
 *               example:
 *                 data:
 *                   - has_winner: true
 *                     creator_fio: "Алмазбек уулу Жыргалбек"
 *                     creator_company_name: "megakom"
 *                     description: "qweqwe"
 *                     application_deadlines: "qwewe"
 *                     application_total_sum: "123"
 *                     winner_fio: "Алмазбек уулу1 Жыргалбек1"
 *                     winner_company_name: "megakom1"
 *                     winner_email: "jyrgalbekalmazbekov1@gmail.com"
 *                     winner_phone: "996222740087"
 *                     winner_total_sum: "50000"
 *                     winner_deadlines: "123123"
 *                     winner_conditions: "dfbhdbf"
 *                 message: "Успешно!"
 *                 error: false
 *       400:
 *         description: "Некорректный запрос"
 *       401:
 *         description: "Нет доступа, неавторизованный доступ, недействительный или отсутствующий токен"
 *       404:
 *         description: "Заявка с таким ID не найдена"
 *       500:
 *         description: "Ошибка на сервере"
 */
router.get(
  "/id",
  CheckService.isCustomerToken,
  ApplicationController.getApplicationByIdController
);
router.put(
  "/update",
  CheckService.isCustomerToken,
  ApplicationController.updateApplication
);
/**
 * @swagger
 * /application/delete:
 *   post:
 *     summary: "Удаление заявки"
 *     tags: [Tender]
 *     description: "Удаляет заявку по указанному ID. Для выполнения требуется действительный токен."
 *     security:
 *       - bearerAuth: []  # Требуется токен Bearer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: "ID заявки, которую нужно удалить"
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: "Заявка успешно удалена"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: "Статус выполнения запроса"
 *                 message:
 *                   type: string
 *                   description: "Сообщение о результате выполнения"
 *                 error:
 *                   type: boolean
 *                   description: "Флаг ошибки"
 *               example:
 *                 data: true
 *                 message: "Успешно удалено"
 *                 error: false
 *       400:
 *         description: "Некорректный запрос"
 *       401:
 *         description: "Нет доступа, неавторизованный доступ, недействительный или отсутствующий токен"
 *       404:
 *         description: "Заявка с таким ID не найдена"
 *       500:
 *         description: "Ошибка на сервере"
 */
router.post(
  "/delete",
  CheckService.isCustomerToken,
  ApplicationController.deleteApplicationController
);
/**
 * @swagger
 * /application/list/{id}:
 *   get:
 *     summary: "Получение списка предложений для тендера по ID"
 *     tags: [Tender]
 *     description: "Получает список предложений для указанного тендера (по ID). Для выполнения требуется действительный токен."
 *     security:
 *       - bearerAuth: []  # Требуется токен Bearer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID заявки (тендера), для которого нужно получить список предложений."
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Успешно получен список предложений"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       countOffer:
 *                         type: string
 *                         description: "Количество предложений для тендера"
 *                       company_name:
 *                         type: string
 *                         description: "Название компании, сделавшей предложение"
 *                       id_offer:
 *                         type: integer
 *                         description: "ID предложения"
 *                       id_user:
 *                         type: integer
 *                         description: "ID пользователя, который сделал предложение"
 *                       id_application:
 *                         type: integer
 *                         description: "ID тендера, к которому относится предложение"
 *                       total_sum:
 *                         type: string
 *                         description: "Общая сумма предложения"
 *                       deadlines:
 *                         type: string
 *                         description: "Сроки выполнения предложения"
 *                       conditions:
 *                         type: string
 *                         description: "Условия предложения"
 *                       is_winner:
 *                         type: boolean
 *                         description: "Флаг, указывающий, является ли предложение победившим"
 *                       created_date:
 *                         type: string
 *                         format: date-time
 *                         description: "Дата создания предложения"
 *                       updated_date:
 *                         type: string
 *                         format: date-time
 *                         description: "Дата последнего обновления предложения"
 *                       active:
 *                         type: boolean
 *                         description: "Флаг, показывающий, активно ли предложение"
 *                 message:
 *                   type: string
 *                   description: "Сообщение о результате выполнения"
 *                 error:
 *                   type: boolean
 *                   description: "Флаг ошибки"
 *               example:
 *                 data: 
 *                   - countOffer: "1"
 *                   - company_name: "megakom"
 *                     id_offer: 18
 *                     id_user: 11
 *                     id_application: 14
 *                     total_sum: "50000"
 *                     deadlines: "123123"
 *                     conditions: "dfbhdbf"
 *                     is_winner: false
 *                     created_date: "2024-11-19T09:41:50.360Z"
 *                     updated_date: "2024-11-19T09:41:50.360Z"
 *                     active: true
 *                 message: "Успешно"
 *                 error: false
 *       400:
 *         description: "Некорректный запрос"
 *       401:
 *         description: "Нет доступа, неавторизованный доступ, недействительный или отсутствующий токен"
 *       404:
 *         description: "Заявка с таким ID не найдена"
 *       500:
 *         description: "Ошибка на сервере"
 */
router.get(
  "/list/:id",
  CheckService.isCustomerToken,
  ApplicationController.offerListController
);
/**
 * @swagger
 * /application/offer/{id_offer}:
 *   get:
 *     summary: "Получение предложения по ID"
 *     tags: [Tender]
 *     description: "Получает информацию о предложении по ID. Для выполнения требуется действительный токен."
 *     security:
 *       - bearerAuth: []  # Требуется токен Bearer
 *     parameters:
 *       - in: path
 *         name: id_offer
 *         required: true
 *         description: "ID предложения, для которого нужно получить детали."
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Успешно получены данные о предложении"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       company_name:
 *                         type: string
 *                         description: "Название компании, сделавшей предложение"
 *                       bin:
 *                         type: string
 *                         description: "БИН компании"
 *                       id_offer:
 *                         type: integer
 *                         description: "ID предложения"
 *                       id_user:
 *                         type: integer
 *                         description: "ID пользователя, сделавшего предложение"
 *                       id_application:
 *                         type: integer
 *                         description: "ID тендера, к которому относится предложение"
 *                       total_sum:
 *                         type: string
 *                         description: "Общая сумма предложения"
 *                       deadlines:
 *                         type: string
 *                         description: "Сроки выполнения предложения"
 *                       conditions:
 *                         type: string
 *                         description: "Условия предложения"
 *                       is_winner:
 *                         type: boolean
 *                         description: "Флаг, указывающий, является ли это предложение победившим"
 *                       created_date:
 *                         type: string
 *                         format: date-time
 *                         description: "Дата создания предложения"
 *                       updated_date:
 *                         type: string
 *                         format: date-time
 *                         description: "Дата последнего обновления предложения"
 *                       active:
 *                         type: boolean
 *                         description: "Флаг, показывающий, активно ли предложение"
 *                 message:
 *                   type: string
 *                   description: "Сообщение о результате выполнения"
 *                 error:
 *                   type: boolean
 *                   description: "Флаг ошибки"
 *               example:
 *                 data:
 *                   - company_name: "megakom"
 *                     bin: "123456789123"
 *                     id_offer: 18
 *                     id_user: 11
 *                     id_application: 14
 *                     total_sum: "50000"
 *                     deadlines: "123123"
 *                     conditions: "dfbhdbf"
 *                     is_winner: true
 *                     created_date: "2024-11-19T09:41:50.360Z"
 *                     updated_date: "2024-11-19T09:43:04.998Z"
 *                     active: true
 *                 message: "Успешно"
 *                 error: false
 *       400:
 *         description: "Некорректный запрос"
 *       401:
 *         description: "Нет доступа, неавторизованный доступ, недействительный или отсутствующий токен"
 *       404:
 *         description: "Предложение с таким ID не найдено"
 *       500:
 *         description: "Ошибка на сервере"
 */
router.get(
  "/offer/:id_offer",
  CheckService.isCustomerToken,
  ApplicationController.getOfferByIdController
);
/**
 * @swagger
 * /application/winner:
 *   post:
 *     summary: "Объявить победителя"
 *     tags: [Tender]
 *     description: "Устанавливает предложение как победителя и обновляет заявку. Для выполнения требуется действительный токен."
 *     security:
 *       - bearerAuth: []  # Требуется токен Bearer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_offer:
 *                 type: integer
 *                 description: "ID предложения, которое нужно сделать победителем"
 *               id:
 *                 type: integer
 *                 description: "ID заявки, к которой относится предложение"
 *             required:
 *               - id_offer
 *               - id
 *     responses:
 *       200:
 *         description: "Предложение успешно сделано победителем и заявка обновлена"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_offer:
 *                         type: integer
 *                         description: "ID предложения"
 *                       id_user:
 *                         type: integer
 *                         description: "ID пользователя, сделавшего предложение"
 *                       id_application:
 *                         type: integer
 *                         description: "ID заявки, к которой относится предложение"
 *                       total_sum:
 *                         type: string
 *                         description: "Общая сумма предложения"
 *                       deadlines:
 *                         type: string
 *                         description: "Сроки выполнения предложения"
 *                       conditions:
 *                         type: string
 *                         description: "Условия предложения"
 *                       is_winner:
 *                         type: boolean
 *                         description: "Флаг, указывающий, является ли предложение победившим"
 *                       created_date:
 *                         type: string
 *                         format: date-time
 *                         description: "Дата создания предложения"
 *                       updated_date:
 *                         type: string
 *                         format: date-time
 *                         description: "Дата последнего обновления предложения"
 *                       active:
 *                         type: boolean
 *                         description: "Флаг, показывающий, активно ли предложение"
 *                 message:
 *                   type: string
 *                   description: "Сообщение о результате выполнения"
 *                 error:
 *                   type: boolean
 *                   description: "Флаг ошибки"
 *               example:
 *                 data:
 *                   - id_offer: 18
 *                     id_user: 11
 *                     id_application: 14
 *                     total_sum: "50000"
 *                     deadlines: "123123"
 *                     conditions: "dfbhdbf"
 *                     is_winner: true
 *                     created_date: "2024-11-19T09:41:50.360Z"
 *                     updated_date: "2024-11-19T09:50:23.037Z"
 *                     active: true
 *                 message: "Успешно"
 *                 error: false
 *       400:
 *         description: "Некорректный запрос"
 *       401:
 *         description: "Нет доступа, неавторизованный доступ, недействительный или отсутствующий токен"
 *       404:
 *         description: "Предложение или заявка не найдены"
 *       500:
 *         description: "Ошибка на сервере"
 */
router.post(
  "/winner",
  CheckService.isCustomerToken,
  ApplicationController.makeToWinnerController
);
/**
 * @swagger
 * /application/rejected:
 *   post:
 *     summary: "Отклонить предложение"
 *     tags: [Tender]
 *     description: "Отклоняет предложение по указанному ID. Для выполнения требуется действительный токен."
 *     security:
 *       - bearerAuth: []  # Требуется токен Bearer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_offer:
 *                 type: integer
 *                 description: "ID предложения, которое необходимо отклонить"
 *             required:
 *               - id_offer
 *     responses:
 *       200:
 *         description: "Предложение успешно отклонено"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_offer:
 *                         type: integer
 *                         description: "ID отклоненного предложения"
 *                 message:
 *                   type: string
 *                   description: "Сообщение о результате выполнения"
 *                 error:
 *                   type: boolean
 *                   description: "Флаг ошибки"
 *               example:
 *                 data:
 *                   - id_offer: 1
 *                 message: "Предложение успешно отклонено"
 *                 error: false
 *       400:
 *         description: "Некорректный запрос, неверный формат данных"
 *       401:
 *         description: "Нет доступа, неавторизованный доступ, недействительный или отсутствующий токен"
 *       404:
 *         description: "Предложение с указанным ID не найдено"
 *       500:
 *         description: "Ошибка на сервере"
 */
router.post(
  "/rejected",
  CheckService.isCustomerToken,
  ApplicationController.rejectedOfferController
);

export default router;
