import { Request, Response } from "express";
// import { verifyRecaptcha } from "../services/verifyRecaptcha";
import { sendError, sendSuccess } from "../utils/send";
import validate from "../utils/validate";
import Config from "../utils/config";
import TokenService from "../utils/jwt";
import COOKIE from "../utils/cookie";
import { IRequestBodyLogin, IUser, IRole } from "./types";
import UserService from "./userService";
import UserSchema from "./userSchema";

class UserController {
  async login(req: Request, res: Response) {
    try {
      const isValid = validate(req.body, UserSchema.loginSchema);
      if (!isValid) return sendError(res, req.t("inValidFormat"));

      const { password, login } = req.body as IRequestBodyLogin;

      const user: IUser | false = await UserService.userLogin(login, password);

      if (user && user.role) {
        const exp =
          Date.now() + parseInt(Config.JWT_EXPIRE_HOURS) * 60 * 60 * 1000;

        const role = Array.isArray(user.role) ? user.role : [user.role];

        const token = TokenService.generateAccessToken({
          id: user.id,
          r: role,
          s: user.surname,
          n: user.name,
          p: user.patronymic,
          exp,
        });
        if (!token) return sendError(res, req.t("token.generateError"));

        const tokenBearer: string = "Bearer " + token;

        const logged = await COOKIE.LOGIN(
          req,
          res,
          String(login),
          user.id,
          role,
          tokenBearer
        );

        if (user && logged) {
          return sendSuccess(res, req.t("success"), {
            authState: {
              id: user.id,
              s: user.surname,
              n: user.name,
              p: user.patronymic,
              r: role,
            },
            token,
            tokenType: "Bearer",
          });
        }
      }
      return sendError(res, req.t("unauth"), false, 401);
    } catch (error) {
      console.log("error login: ", error.message);
      return sendError(res, req.t("error"), false, 400);
    }
  }

  async check(req: Request, res: Response) {
    try {
      const token: string | undefined = req.headers["authorization"];
      if (!token) return sendError(res, req.t("noToken"), false, 401);

      const userData = TokenService.getTokenData(token);
      if (!userData) sendError(res, req.t("error"));

      const rawToken = token.split(" ")[1];
      // const checkData = await COOKIE.CHECK_PERM(req);

      if (userData && userData.exp > new Date().getTime()) {
        const roles: string[] = userData.r.map(
          (roleObj: IRole) => roleObj.role_name
        );
        return sendSuccess(res, req.t("success"), {
          authState: {
            id: userData.id,
            s: userData.s,
            n: userData.n,
            b: userData.b,
            r: roles,
            idUd: userData.idUd,
            exp: userData.exp,
          },
          token: rawToken,
          tokenType: "Bearer",
          expiresIn: (userData.exp - Date.now()) / 60000, //minutes
        });
      }
      return sendError(res, req.t("error"), false, 401);
    } catch (error) {
      console.log("error check: ", error.message);
      return sendError(res, req.t("error"));
    }
  }

  async logout(req: Request, res: Response) {
    const deleteLogout = await COOKIE.LOGOUT(req, res);
    if (deleteLogout) return sendSuccess(res, req.t("success"));
    return sendError(res, req.t("error"));
  }

  async getUserByIdController(req: Request, res: Response) {
    try {
      const idUser = Number(req.user?.id);
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }
      const data = await UserService.getUserById(idUser);
      if (!data || (Array.isArray(data) && data.length === 0)) {
        return sendError(res, req.t("Пользователь с таким id не найден!"));
      }
      return sendSuccess(res, req.t("success"), data[0]);
    } catch (error) {
      console.log("error getUserByIdController: ", error.message);
      return false;
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { companyName, bin, surname, name, patronymic, email, phone } =
        req.body;
      const idUser = Number(req.user?.id);
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }

      const currentUserDataArray = await UserService.getUserById(idUser);
      if (!currentUserDataArray || currentUserDataArray.length === 0) {
        return sendError(res, req.t("error.userNotFound"));
      }
      const data = await UserService.updateUserData(
        idUser,
        companyName,
        bin,
        surname,
        name,
        patronymic,
        email,
        phone
      );

      return data
        ? sendSuccess(res, req.t("success"), data)
        : sendError(res, req.t("error"));
    } catch (error) {
      console.log("error updateUserController: ", error.message);
      return sendError(res, req.t("error.unexpected"));
    }
  }

  async deleteUserController(req: Request, res: Response) {
    try {
      const idUser = Number(req.user?.id);
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }

      const deletedUser = await UserService.deleteUser(idUser);

      if (!deletedUser) {
        return sendError(res, req.t("error"));
      }

      return sendSuccess(res, req.t("Успешно удалено"), deletedUser);
    } catch (error) {
      console.error("Error in deleteUserController: ", error.message);
      return sendError(res, req.t("error.unexpected"));
    }
  }
}

export default new UserController();
