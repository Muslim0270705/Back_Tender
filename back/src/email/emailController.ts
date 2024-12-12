import { Request, Response } from "express";
import { isValidEmail, generateCode } from "../utils/helpers";
import { sendError, sendSuccess } from "../utils/send";
import validate from "../utils/validate";
import EmailService from "./emailService";
import EmailSchema from "./emailSchema";

class EmailController {
  async verificationEmail(req: Request, res: Response) {
    try {
      const isValid = validate(req.body, EmailSchema.verificationSchema);
      if (!isValid) return sendError(res, req.t("inValidFormat"));

      const { email } = req.body;
      const emailString = String(email).toLocaleLowerCase();

      const isEmailValidated = isValidEmail(emailString);
      if (!isEmailValidated) return sendError(res, req.t("noValidEmail"));

      const emailUsed = await EmailService.isEmailUsed(email);
      if (emailUsed) return sendError(res, req.t("emailUsed"));

      const isExistEmailCode = await EmailService.existCodeEmail(emailString);
      if (isExistEmailCode) return sendError(res, req.t("isExistEmailCode"));

      const code = generateCode();
      if (!code) return sendError(res, req.t("errorGenerateCode"));

      const codeStr = String(code);

      const emailConfirm = await EmailService.emailConfirmCode(
        emailString,
        codeStr
      );

      if (emailConfirm) {
        const idStatus =
          typeof emailConfirm === "object"
            ? emailConfirm?.status
              ? emailConfirm.status
              : null
            : null;
        await EmailService.insertEmailService(emailString, idStatus, codeStr);
        return sendSuccess(res, req.t("codeConfirmSuccess"));
      }
      return sendError(res, req.t("errorSendEmail"));
    } catch (error) {
      console.log("error verificationEmail: ", error.message);
      return sendError(res, req.t("error"));
    }
  }
}

export default new EmailController();
