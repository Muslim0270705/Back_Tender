import express from "express";
import adminController from "./adminController";
import CheckService from "../services/CheckService";

const router = express.Router();
router.get("/list", CheckService.isAdminToken, adminController.getUser);
router.post(
  "/confirm",
  CheckService.isAdminToken,
  adminController.confirmUserController
);
router.post(
  "/delete",
  CheckService.isAdminToken,
  adminController.deleteUserController
);

export default router;
