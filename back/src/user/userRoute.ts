import express from "express";
import UserController from "./userController";
import CheckService from "../services/CheckService";

const router = express.Router();

/*  @swagger
 * tags:
 *   - name: User
 *     description: User API
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: "Авторизация"
 *     tags: [User]
 *     description: "Authenticate user and generate token"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - login
 *               - password
 *     responses:
 *       200:
 *         description: "Login successful, returns user data and token"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     authState:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: "User ID"
 *                         s:
 *                           type: string
 *                           description: "User's surname"
 *                         n:
 *                           type: string
 *                           description: "User's first name"
 *                         p:
 *                           type: string
 *                           description: "User's patronymic"
 *                         r:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id_role:
 *                                 type: integer
 *                               role_name:
 *                                 type: string
 *                           description: "User roles"
 *                         exp:
 *                           type: integer
 *                           description: "Expiration time of the token (Unix timestamp)"
 *                     token:
 *                       type: string
 *                       description: "Authentication token"
 *                     tokenType:
 *                       type: string
 *                       description: "Token type"
 *                     expiresIn:
 *                       type: integer
 *                       description: "Token expiration time in milliseconds"
 *                 message:
 *                   type: string
 *                   description: "Response message"
 *                 error:
 *                   type: boolean
 *                   description: "Error status"
 *               example:
 *                 data:
 *                   authState:
 *                     id: 1
 *                     s: "surname"
 *                     n: "name"
 *                     p: "patronimic"
 *                     r:
 *                       - id_role: 2
 *                         role_name: "CUSTOMER"
 *                   token: "string"
 *                   tokenType: "Bearer"
 *                 message: "Успешно!"
 *                 error: false
 *       400:
 *         description: "Bad request, invalid credentials"
 *       500:
 *         description: "Server error"
 */
router.post("/login", UserController.login);
router.post("/check", UserController.check);
/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: "Выход из системы"
 *     tags: [User]
 *     description: "logout."
 *     responses:
 *       200:
 *         description: "return data"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: "status"
 *                 message:
 *                   type: string
 *                   description: "Response message"
 *                 error:
 *                   type: boolean
 *                   description: "Error status"
 *             example:
 *               data: true
 *               message: "Успешно!"
 *               error: false
 *       401:
 *         description: "Unauthorized, invalid token"
 *       500:
 *         description: "Server error"
 */
router.post("/logout", UserController.logout);
router.get(
  "/find-by-id",
  CheckService.isNotEmpToken,
  UserController.getUserByIdController
);
router.put("/update", CheckService.isNotEmpToken, UserController.updateUser);
router.post(
  "/delete",
  CheckService.isNotEmpToken,
  UserController.deleteUserController
);

export default router;
