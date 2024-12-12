import express from "express";
import RegisterController from "./registerController";

const router = express.Router();

router.post("/user", RegisterController.register);
router.post("/verification", RegisterController.verification);
router.post("/password", RegisterController.insertPasswordController);

export default router;
