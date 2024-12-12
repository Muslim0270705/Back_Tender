import express from "express";
import CheckService from "../services/CheckService";
import ExecutorController from "./executorController";

const router = express.Router();

router.post(
  "/create",
  CheckService.isExecutorToken,
  ExecutorController.createOfferController
);
router.get("/list", ExecutorController.getAllTenderController);
router.get(
  "/history",
  CheckService.isExecutorToken,
  ExecutorController.offerList
);
router.get(
  "/favourite/list",
  CheckService.isExecutorToken,
  ExecutorController.favouritesListController
);
router.get(
  "/my-offers",
  CheckService.isExecutorToken,
  ExecutorController.myOfferListController
);
router.get(
  "/offer",
  CheckService.isExecutorToken,
  ExecutorController.offerByIdController
);
/**
 * @swagger
 * /executor/tender/{id}:
 *   get:
 *     summary: "Получить тендер по ID"
 *     tags: [Tender]
 *     description: "Получить информацию о тендере по указанному ID. Для выполнения требуется действительный токен."
 *     security:
 *       - bearerAuth: []  # Требуется токен Bearer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID тендера"
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Тендер успешно найден"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     full_name:
 *                       type: string
 *                       description: "Полное имя создателя тендера"
 *                     company_name:
 *                       type: string
 *                       description: "Название компании"
 *                     id:
 *                       type: integer
 *                       description: "ID тендера"
 *                     id_user:
 *                       type: integer
 *                       description: "ID пользователя, создавшего тендер"
 *                     project_name:
 *                       type: string
 *                       description: "Название проекта"
 *                     is_product:
 *                       type: boolean
 *                       description: "Является ли тендер продуктом"
 *                     is_service:
 *                       type: boolean
 *                       description: "Является ли тендер услугой"
 *                     description:
 *                       type: string
 *                       description: "Описание тендера"
 *                     deadlines:
 *                       type: string
 *                       description: "Сроки выполнения тендера"
 *                     total_sum:
 *                       type: string
 *                       description: "Общая сумма тендера"
 *                     created_date:
 *                       type: string
 *                       format: date-time
 *                       description: "Дата создания тендера"
 *                     updated_date:
 *                       type: string
 *                       format: date-time
 *                       description: "Дата последнего обновления тендера"
 *                     active:
 *                       type: boolean
 *                       description: "Активен ли тендер"
 *                     is_deleted:
 *                       type: boolean
 *                       description: "Удален ли тендер"
 *                     file_name:
 *                       type: string
 *                       description: "Ссылки на прикрепленные файлы"
 *                     is_favorites:
 *                       type: boolean
 *                       description: "Добавлен ли тендер в избранное"
 *                     has_winner:
 *                       type: boolean
 *                       description: "Есть ли победитель по этому тендеру"
 *                 message:
 *                   type: string
 *                   description: "Сообщение о результате выполнения"
 *                 error:
 *                   type: boolean
 *                   description: "Флаг ошибки"
 *               example:
 *                 data:
 *                   full_name: "some name"
 *                   company_name: "some company"
 *                   id: 1
 *                   id_user: 1
 *                   project_name: "some project_name"
 *                   is_product: true
 *                   is_service: false
 *                   description: "some text"
 *                   deadlines: "9 month"
 *                   total_sum: "50000"
 *                   created_date: "2024-11-18T12:40:20.517Z"
 *                   updated_date: "2024-11-18T12:40:20.517Z"
 *                   active: false
 *                   is_deleted: false
 *                   file_name: "some_file"
 *                   is_favorites: false
 *                   has_winner: false
 *                 message: "Успешно!"
 *                 error: false
 *       400:
 *         description: "Некорректный запрос, неверный формат данных"
 *       401:
 *         description: "Нет доступа, неавторизованный доступ, недействительный или отсутствующий токен"
 *       404:
 *         description: "Тендер с указанным ID не найден"
 *       500:
 *         description: "Ошибка на сервере"
 */
router.get(
  "/:id",
  CheckService.isNotEmpToken,
  ExecutorController.getTenderByIdController
);
router.post(
  "/favourite",
  CheckService.isExecutorToken,
  ExecutorController.makeToFavouriteController
);
router.post(
  "/favourite/canceled",
  CheckService.isExecutorToken,
  ExecutorController.deleteToFavouriteController
);
/**
 * @swagger
 * /executor/notifications:
 *   post:
 *     summary: "Получить уведомления пользователя"
 *     tags: [Notifications]
 *     description: "Получает список уведомлений для пользователя. Для выполнения требуется действительный токен."
 *     security:
 *       - bearerAuth: []  # Требуется токен Bearer
 *     responses:
 *       200:
 *         description: "Уведомления успешно получены"
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
 *                       id_notification:
 *                         type: integer
 *                         description: "ID уведомления"
 *                       id_user:
 *                         type: integer
 *                         description: "ID пользователя, которому отправлено уведомление"
 *                       title:
 *                         type: string
 *                         description: "Заголовок уведомления"
 *                       message:
 *                         type: string
 *                         description: "Сообщение уведомления"
 *                       is_read:
 *                         type: boolean
 *                         description: "Прочитано ли уведомление"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: "Дата и время создания уведомления"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         description: "Дата и время последнего обновления уведомления"
 *                 message:
 *                   type: string
 *                   description: "Сообщение о результате выполнения запроса"
 *                 error:
 *                   type: boolean
 *                   description: "Флаг ошибки"
 *               example:
 *                 data:
 *                   - id_notification: 12
 *                     id_user: 10
 *                     title: "Новая заявка"
 *                     message: "По вашему тендеру пришла новая заявка, ознакомьтесь."
 *                     is_read: true
 *                     created_at: "2024-11-18T12:56:24.463Z"
 *                     updated_at: "2024-11-18T12:58:30.625Z"
 *                 message: "Успешно!"
 *                 error: false
 *       400:
 *         description: "Некорректный запрос, неверный формат данных"
 *       401:
 *         description: "Нет доступа, неавторизованный доступ, недействительный или отсутствующий токен"
 *       404:
 *         description: "Уведомления для пользователя не найдены"
 *       500:
 *         description: "Ошибка на сервере"
 */
router.post(
  "/notifications",
  CheckService.isNotEmpToken,
  ExecutorController.getUserNotificationsController
);
/**
 * @swagger
 * /executor/read/{id}:
 *   patch:
 *     summary: "Пометить уведомление как прочитанное"
 *     tags: [Notifications]
 *     description: "Помечает уведомление как прочитанное для пользователя. Для выполнения требуется действительный токен."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID уведомления"
 *         schema:
 *           type: integer
 *     security:
 *       - bearerAuth: []  # Требуется токен Bearer
 *     responses:
 *       200:
 *         description: "Уведомление успешно помечено как прочитанное"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Сообщение о результате выполнения запроса"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_notification:
 *                       type: integer
 *                       description: "ID уведомления"
 *                     id_user:
 *                       type: integer
 *                       description: "ID пользователя"
 *                     title:
 *                       type: string
 *                       description: "Заголовок уведомления"
 *                     message:
 *                       type: string
 *                       description: "Сообщение уведомления"
 *                     is_read:
 *                       type: boolean
 *                       description: "Прочитано ли уведомление"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: "Дата и время создания уведомления"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       description: "Дата и время последнего обновления уведомления"
 *               example:
 *                 message: "Уведомление помечено как прочитанное"
 *                 data:
 *                   id_notification: 12
 *                   id_user: 10
 *                   title: "Новая заявка"
 *                   message: "По вашему тендеру пришла новая заявка, ознакомьтесь."
 *                   is_read: true
 *                   created_at: "2024-11-18T12:56:24.463Z"
 *                   updated_at: "2024-11-18T12:58:30.625Z"
 *       400:
 *         description: "Некорректный запрос, неверный формат данных"
 *       401:
 *         description: "Нет доступа, неавторизованный доступ, недействительный или отсутствующий токен"
 *       404:
 *         description: "Уведомление не найдено"
 *       500:
 *         description: "Ошибка на сервере"
 */
router.patch(
  "/read/:id",
  CheckService.isNotEmpToken,
  ExecutorController.markAsRead
);


export default router;
