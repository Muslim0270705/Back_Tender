import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/send";
import validate from "../utils/validate";
import ExecutorService from "./executorService";
import executorSchema from "./executorSchema";

class ExecutorController {
  async createOfferController(req: Request, res: Response) {
    try {
      const isValid = validate(req.body, executorSchema.executorSchema);
      if (!isValid) return sendError(res, req.t("inValidFormat"));

      const { id_application, total_sum, deadlines, conditions } = req.body;
      const idUser = Number(req.user?.id);

      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }

      const isWinnerExist = await ExecutorService.isWinnerExist(id_application);
      if (isWinnerExist)
        return sendError(
          res,
          req.t("По данному тендеру уже выбран исполнитель!")
        );

      const isExistOffer = await ExecutorService.isOfferExists(
        idUser,
        id_application
      );
      if (isExistOffer) {
        return sendError(
          res,
          req.t("Вы уже отправили предложение для этого тендера!")
        );
      }

      const data = await ExecutorService.createOffer(
        idUser,
        id_application,
        total_sum,
        deadlines,
        conditions
      );

      // Ответ пользователю
      return data
        ? sendSuccess(res, req.t("Ваша предложение успешно создано!"), data)
        : sendError(res, req.t("error"));
    } catch (error) {
      console.log("error createOfferController: ", error.message);
      return sendError(res, req.t("error"));
    }
  }

  async getAllTenderController(req: Request, res: Response) {
    try {
      const data = await ExecutorService.getAllTender();
      return data
        ? sendSuccess(res, req.t("success"), data)
        : sendError(res, req.t("error"));
    } catch (error) {
      console.log("error getAllTenderController: ", error.message);
      return false;
    }
  }

  async getTenderByIdController(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const idUser = Number(req.user?.id);
      const idApplication = Number(id);
      let data;
      // const dataOffer = await ExecutorService.getOfferByIdUserAndApp(idUser, idApplication);

      const isExist = await ExecutorService.existOffer(idUser, idApplication);
      if (!isExist) {
        data = await ExecutorService.getTenderById(idUser, idApplication);
      } else {
        data = await ExecutorService.getTender(idUser, idApplication);
      }
      return data
        ? sendSuccess(res, req.t("success"), data)
        : sendError(res, req.t("error"));
    } catch (error) {
      console.log("error getTenderByIdController: ", error.message);
      return false;
    }
  }

  async makeToFavouriteController(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const idApplication = Number(id);
      const idUser = Number(req.user?.id);
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }
      const data = await ExecutorService.makeToFavourite(idUser, idApplication);
      return data
        ? sendSuccess(res, req.t("success"), data[0])
        : sendError(res, req.t("Уже добавлено в избранное"));
    } catch (error) {
      console.log("error makeToFavouriteController: ", error.message);
      return false;
    }
  }

  async deleteToFavouriteController(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const idApplication = Number(id);
      const idUser = Number(req.user?.id);
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }
      const data = await ExecutorService.deleteToFavourite(
        idUser,
        idApplication
      );
      return data
        ? sendSuccess(res, req.t("success"), data[0])
        : sendError(res, req.t("error"));
    } catch (error) {
      console.log("error makeToFavouriteController: ", error.message);
      return false;
    }
  }

  async favouritesListController(req: Request, res: Response) {
    try {
      const idUser = Number(req.user?.id);
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }
      const data = await ExecutorService.favouritesList(idUser);
      return data
        ? sendSuccess(res, req.t("success"), data)
        : sendError(res, req.t("error"));
    } catch (error) {
      console.log("error favouritesListController: ", error.message);
      return false;
    }
  }

  async getUserNotificationsController(req: Request, res: Response) {
    try {
      const idUser = Number(req.user?.id);
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }
      const notifications = await ExecutorService.getUserNotifications(idUser);
      return notifications
        ? sendSuccess(res, req.t("success"), notifications)
        : sendError(res, req.t("error"));
    } catch (error) {
      console.error("Error in getUserNotificationsController: ", error.message);
      return res
        .status(500)
        .json({ message: "Ошибка при получении уведомлений" });
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const notificationId = Number(req.params.id);
      const idUser = Number(req.user?.id);
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }
      const updatedNotification = await ExecutorService.markAsRead(
        notificationId
      );
      return updatedNotification
        ? res.status(200).json({
            message: "Уведомление помечено как прочитанное",
            data: updatedNotification,
          })
        : res.status(404).json({ message: "Уведомление не найдено" });
    } catch (error) {
      console.error("Error in markAsRead: ", error.message);
      return res
        .status(500)
        .json({ message: "Ошибка при обновлении уведомления" });
    }
  }

  async offerList(req: Request, res: Response) {
    try {
      const idUser = Number(req.user?.id);
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }
      const data = await ExecutorService.getAllOfferByIdUser(idUser);
      console.log(data);

      return data
        ? sendSuccess(res, req.t("success"), data)
        : sendError(res, req.t("error"));
    } catch (error) {
      console.log("error offerList: ", error.message);
      return false;
    }
  }

  async myOfferListController(req: Request, res: Response) {
    try {
      const idUser = Number(req.user?.id);
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }
      const data = await ExecutorService.myOfferList(idUser);
      return data
        ? sendSuccess(res, req.t("success"), data)
        : sendError(res, req.t("error"));
    } catch (error) {
      console.log("error favouritesListController: ", error.message);
      return false;
    }
  }

  async offerByIdController(req: Request, res: Response) {
    try {
      const { id_offer } = req.query;
      const idOffer = Number(id_offer);
      const idUser = Number(req.user?.id);
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }
      let data;
      const isWinnerExist = await ExecutorService.existWinner(idOffer);
      if (!isWinnerExist) {
        data = await ExecutorService.offerNotWinnerById(idOffer, idUser);
      } else {
        data = await ExecutorService.offerById(idOffer, idUser);
      }
      return data
        ? sendSuccess(res, req.t("success"), data)
        : sendError(res, req.t("error"));
    } catch (error) {
      console.log("error favouritesListController: ", error.message);
      return false;
    }
  }
}

export default new ExecutorController();
