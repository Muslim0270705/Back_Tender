import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/send";
import AdminService from "./adminService";

class AdminController {
  async getUser(req: Request, res: Response) {
    try {
      const idUser = Number(req.user?.id);
      if (!idUser)
        return sendError(res, req.t("register.userNotAuthenticated"));
      const data = await AdminService.getAllUser();
      return data
        ? sendSuccess(res, req.t("success"), data)
        : sendError(res, req.t("error"));
    } catch (error) {
      console.log("error getUser: ", error.message);
      return false;
    }
  }

  async confirmUserController(req: Request, res: Response) {
    try {
      const {id_user} = req.body;
      const idUser = Number(req.user?.id);
      if (!idUser)
        return sendError(res, req.t("register.userNotAuthenticated"));
      const data = await AdminService.confirmUser(id_user);
      return data
        ? sendSuccess(res, req.t("success"), data)
        : sendError(res, req.t("error"));
    } catch (error) {
      console.log("error confirmUserController: ", error.message);
      return false;
    }
  }

  async deleteUserController(req: Request, res: Response) {
    try {
      const {id_user} = req.body;
      const idUser = Number(req.user?.id);
      if (!idUser)
        return sendError(res, req.t("register.userNotAuthenticated"));
      const data = await AdminService.deleteUser(id_user);
      return data
        ? sendSuccess(res, req.t("success"), data)
        : sendError(res, req.t("error"));
    } catch (error) {
      console.log("error deleteUserController: ", error.message);
      return false;
    }
  }
}

export default new AdminController();
