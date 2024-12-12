import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/send";
import validate from "../utils/validate";
import RegisterSchema from "./registerSchema";
import RegisterService from "./registerService";
import { generateCode, isValidEmail } from "../utils/helpers";
import EmailService from "../email/emailService";
import UserService from "../user/userService";
import TokenService from "../utils/jwt";
import Config from "../utils/config";
import COOKIE from "../utils/cookie";

class RegisterController {
  async register(req: Request, res: Response) {
    try {

      const isValid = validate(req.body, RegisterSchema.registerSchema);
      if (!isValid) return sendError(res, req.t("inValidFormat"));

      const {
        company_name,
        bin,
        surname,
        name,
        patronymic,
        email: emailString,
        phone,
        id_role
      } = req.body;

      const email = String(emailString).toLocaleLowerCase();
      const isEmailValidated = isValidEmail(email);
      if (!isEmailValidated) return sendError(res, req.t("noValidEmail"));

      const isEmailExist = await RegisterService.isEmailExist(email, id_role);
      if (isEmailExist) return sendError(res, req.t("register.emailExist"));

      // const isExistEmailCode = await EmailService.existCodeEmail(emailString);
      // if (isExistEmailCode) return sendError(res, req.t("isExistEmailCode"));

      const idRole = id_role === 3 ? 3 : 2;

      
      const insertUser = await RegisterService.insertUser(
        company_name,
        bin,
        surname,
        name,
        patronymic || "",
        email,
        phone,
        idRole
      );

      if (insertUser) {
        const code = generateCode();
        if (!code) return sendError(res, req.t("errorGenerateCode"));

        const codeStr = String(code);

        const emailConfirm = await EmailService.emailConfirmCode(
          email,
          codeStr
        );

        if (emailConfirm) {
          const idStatus =
            typeof emailConfirm === "object" && emailConfirm?.status
              ? emailConfirm.status
              : null;

          await EmailService.insertEmailService(email, idStatus, codeStr);
          return sendSuccess(res, req.t("success"), insertUser);
        }

        return sendError(res, req.t("errorSendEmail"));
      }

      if (insertUser === false) {
        return sendError(res, req.t("register.dbInsertChallengerError"));
      }

      return sendError(res, req.t("register.unknownError"));
    } catch (error) {
      console.log("register: ", error.message);
      return sendError(res, req.t("register.tryError"));
    }
  }

  async verification(req: Request, res: Response) {
    try {
      const isValid = validate(
        req.body,
        RegisterSchema.emailVerificationSchema
      );

      if (!isValid) return sendError(res, req.t("inValidFormat"));

      const { id_user, code } = req.body;

      const emailUser = await UserService.getEmailById(id_user);
      if (!emailUser) return sendError(res, req.t("email не найден"));

      const emailStr = String(emailUser);
      const emailVerification = await EmailService.getCodeByEmail(
        emailStr,
        code
      );
      if (!emailVerification)
        return sendError(res, req.t("register.errorCheckEmailCode"));

      const idVerification = emailVerification[0]?.id_email_verification;

      if (!idVerification)
        return sendError(res, req.t("register.errorCheckEmailCode"));

      if (idVerification > 0) {
        await EmailService.updateEmailVerificationById(idVerification);
        await UserService.updateUser(id_user);
        return sendSuccess(res, req.t("success"), id_user);
      }
      return sendError(res, req.t("register.unknownError"));
    } catch (error) {
      console.log("register: ", error.message);
      return sendError(res, req.t("register.tryError"));
    }
  }

  async insertPasswordController(req: Request, res: Response) {
    try {
      const { id_user, password, confirmPassword } = req.body;
      if (!password || password.length < 6)
        return sendError(res, req.t("register.errorPassLength"));
      if (password !== confirmPassword)
        return sendError(res, req.t("register.errorPassword"));
      const data = await RegisterService.insertPassword(id_user, password);
      const login  = await UserService.getPhoneByUserId(data)
      console.log(login);
      

      const user = await UserService.userLogin(login, password);

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
              exp,
            },
            token,
            tokenType: "Bearer",
            expiresIn: parseInt(Config.JWT_EXPIRE_HOURS) * 60,
          });
        }
      }
      return sendError(res, req.t("unauth"), false, 401);
    } catch (error) {
      console.log("error insertPasswordController: ", error.message);
      return false;
    }
  }
}

export default new RegisterController();
