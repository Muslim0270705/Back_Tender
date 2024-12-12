import { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/send";
import validate from "../utils/validate";
import applicationSchema from "./applicationSchema";
import ApplicationService from "./applicationService";
import { UploadedFile } from "express-fileupload";
import FileService from "../services/FileService";
import Config from "../utils/config";

const { FILE_PATH } = Config;

class ApplicationController {
  async createController(req: Request, res: Response) {
    try {
      const isValid = validate(req.body, applicationSchema.applicationSchema);
      if (!isValid) return sendError(res, req.t("inValidFormat"));

      let {
        projectName,
        isProduct,
        isService,
        description,
        deadlines,
        totalSum,
      } = req.body;

      isProduct = isProduct ?? false;
      isService = isService ?? false;

      if (!(isProduct || isService)) {
        isProduct = true;
      } else if (isProduct && isService) {
        isService = false;
      }

      const idUser = Number(req.user?.id);
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }

      const fileData: string[] = [];

      if (req.files && Array.isArray(req.files.file)) {
        const uploadedFiles = req.files.file as UploadedFile[];

        for (const uploadedFile of uploadedFiles) {
          const fileSaveResult = await FileService.saveFile({
            path: FILE_PATH,
            fileName: `${projectName}-${uploadedFile.name}`,
            sampleFile: uploadedFile,
            type: "file",
          });

          if (fileSaveResult.error) {
            return sendError(res, req.t("Ошибка при загрузке файла"));
          }

          fileData.push(fileSaveResult.dbFileName);
        }
      } else if (req.files && req.files.file) {
        const uploadedFile = req.files.file as UploadedFile;

        const fileSaveResult = await FileService.saveFile({
          path: FILE_PATH,
          fileName: `${projectName}-${uploadedFile.name}`,
          sampleFile: uploadedFile,
          type: "file",
        });

        if (fileSaveResult.error) {
          return sendError(res, req.t("Ошибка при загрузке файла"));
        }

        fileData.push(fileSaveResult.dbFileName);
      }

      const data = await ApplicationService.create(
        idUser,
        projectName,
        isProduct,
        isService,
        description,
        deadlines,
        totalSum,
        fileData
      );

      return data
        ? sendSuccess(res, req.t("Заявка успешно создана"))
        : sendError(res, req.t("error"));
    } catch (error) {
      console.log("error createController", error.message);
      return sendError(res, req.t("serverError"));
    }
  }

  async getApplicationByUser(req: Request, res: Response) {
    try {
      const idUser = Number(req.user?.id);
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }

      const data = await ApplicationService.findByIdUser(idUser);
      return data
        ? sendSuccess(res, req.t("success"), data)
        : sendError(res, req.t("error"));
    } catch (error) {
      console.log("error getApplicationByUser: ", error.message);
      return false;
    }
  }

  async getApplicationByIdController(req: Request, res: Response) {
    try {
      const { id } = req.query;
      const idUser = Number(req.user?.id);
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }
      const idApplication = Number(id);
      let data;
      const isWinnerExist = await ApplicationService.existWinner(idApplication);
      if (isWinnerExist) {
        data = await ApplicationService.getWinnerByIdApplication(idApplication);
      } else {
        data = await ApplicationService.getApplicationById(idApplication);
      }
      if (!data || (Array.isArray(data) && data.length === 0)) {
        return sendError(res, req.t("Заявка с таким id не найдена!"));
      }
      return data
        ? sendSuccess(res, req.t("success"), data)
        : sendError(res, req.t("error"));
    } catch (error) {
      console.log("error getApplicationByIdController: ", error.message);
      return false;
    }
  }
  
  async updateApplication(req: Request, res: Response) {
    try {
      const {
        id,
        projectName,
        isProduct,
        isService,
        description,
        deadlines,
        totalSum,
      } = req.body;
  
      const applicationId = Number(id);
      const idUser = Number(req.user?.id);
  
      // Логирование данных, чтобы убедиться, что все передается корректно
      console.log('Request body:', req.body);
      console.log('Files:', req.files);
  
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }
  
      // Получаем текущие данные заявки
      const currentApplicationDataArray = await ApplicationService.getApplicationById(applicationId);
      if (!currentApplicationDataArray || currentApplicationDataArray.length === 0) {
        return sendError(res, req.t("По данному id тендер не найден"));
      }
  
      // Получаем текущие файлы, связанные с заявкой
      const currentFiles = currentApplicationDataArray[0].files || [];
  
      const fileData: string[] = [];
  
      // Проверка наличия новых файлов в запросе
      if (req.files) {
        // Если файлы переданы как массив
        if (Array.isArray(req.files.file)) {
          const uploadedFiles = req.files.file as UploadedFile[];
  
          // Удаляем старые файлы, если нужно
          for (const file of currentFiles) {
            console.log(`Removing old file: ${file}`);
            // await FileService.deleteFile(file); // Удаляем файл
          }
  
          // Обрабатываем новые файлы
          for (const uploadedFile of uploadedFiles) {
            console.log(`Saving new file: ${uploadedFile.name}`);
  
            const fileSaveResult = await FileService.saveFile({
              path: FILE_PATH,
              fileName: `${projectName}-${uploadedFile.name}`,
              sampleFile: uploadedFile,
              type: "file",
            });
  
            if (fileSaveResult.error) {
              return sendError(res, req.t("Ошибка при загрузке файла"));
            }
  
            fileData.push(fileSaveResult.dbFileName);
          }
        } else if (req.files.file) {
          // Если передан один файл
          const uploadedFile = req.files.file as UploadedFile;
  
          console.log(`Saving new file: ${uploadedFile.name}`);
  
          const fileSaveResult = await FileService.saveFile({
            path: FILE_PATH,
            fileName: `${projectName}-${uploadedFile.name}`,
            sampleFile: uploadedFile,
            type: "file",
          });
  
          if (fileSaveResult.error) {
            return sendError(res, req.t("Ошибка при загрузке файла"));
          }
  
          fileData.push(fileSaveResult.dbFileName);
        }
      }
  
      // Логирование данных перед выполнением обновления в базе данных
      console.log('Updating application with data:', {
        applicationId,
        projectName,
        isProduct,
        isService,
        description,
        deadlines,
        totalSum,
        fileData,
      });
  
      // Обновляем данные заявки, включая файлы
      const data = await ApplicationService.updateApplicationData(
        applicationId,
        projectName,
        isProduct,
        isService,
        description,
        deadlines,
        totalSum,
        fileData
      );
  
      return data
        ? sendSuccess(res, req.t("success"), data)
        : sendError(res, req.t("error"));
    } catch (error) {
      console.log("error updateApplicationController: ", error.message);
      return sendError(res, req.t("error.unexpected"));
    }
  }
  


  async deleteApplicationController(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const idApplication = Number(id);
      const idUser = Number(req.user?.id);
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }
      const deletedApplication = await ApplicationService.deleteApplication(
        idApplication
      );
      if (!deletedApplication) {
        return sendError(res, req.t("error"));
      }
      return sendSuccess(res, req.t("Успешно удалено"), deletedApplication);
    } catch (error) {
      console.error("Error in deleteApplicationController: ", error.message);
      return false;
    }
  }

  async offerListController(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const idApplication = Number(id);
      const idUser = Number(req.user?.id);

      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }

      const countOffer = await ApplicationService.offerCount(idApplication);
      if (!countOffer)
        return sendError(res, req.t("По данному id тендер не найден!"));

      const data = await ApplicationService.offerList(idApplication);

      if (!data) {
        return sendError(res, req.t("error"));
      }

      const responseData = [{ countOffer }, ...data];

      return sendSuccess(res, req.t("Успешно"), responseData);
    } catch (error) {
      console.error("Error in offerListController: ", error.message);
      return false;
    }
  }

  async getOfferByIdController(req: Request, res: Response) {
    try {
      const { id_offer } = req.params;
      const idOffer = Number(id_offer);
      const idUser = Number(req.user?.id);

      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }

      const data = await ApplicationService.getOfferById(idOffer);

      if (!data) {
        return sendError(res, req.t("error"));
      }

      return sendSuccess(res, req.t("Успешно"), data);
    } catch (error) {
      console.error("Error in getOfferByIdController: ", error.message);
      return false;
    }
  }

  async makeToWinnerController(req: Request, res: Response) {
    try {
      const { id_offer, id } = req.body;
      const idOffer = Number(id_offer);
      const idApplication = Number(id);
      const idUser = Number(req.user?.id);

      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }

      const updatedOffer = await ApplicationService.makeToWinner(idOffer);

      if (!updatedOffer) {
        return sendError(res, req.t("По данному id предложение не найдено"));
      }

      const data = await ApplicationService.updateApplicationWinner(
        idApplication
      );

      if (!data) {
        return sendError(res, req.t("По данному id заявка не найдена"));
      }

      return sendSuccess(res, req.t("Успешно"), updatedOffer);
    } catch (error) {
      console.error("Error in makeToWinnerController: ", error.message);
      return sendError(res, req.t("error.unexpected"));
    }
  }

  async rejectedOfferController(req: Request, res: Response) {
    try {
      const { id_offer } = req.body;
      const idOffer = Number(id_offer);
      const idUser = Number(req.user?.id);
      if (!idUser) {
        return sendError(res, req.t("register.userNotAuthenticated"));
      }
      const deletedApplication = await ApplicationService.rejectedOffer(
        idOffer
      );
      if (!deletedApplication) {
        return sendError(res, req.t("error"));
      }
      return sendSuccess(
        res,
        req.t("Предложение успешно отклонено"),
        deletedApplication
      );
    } catch (error) {
      console.error("Error in rejectedOfferController: ", error.message);
      return false;
    }
  }
}

export default new ApplicationController();
