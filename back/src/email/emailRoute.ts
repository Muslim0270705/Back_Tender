import express from "express";
import EmailController from "./emailController";

const router = express.Router();

router.post("/verification", EmailController.verificationEmail);

export default router;
