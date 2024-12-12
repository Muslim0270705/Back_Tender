import { Schema } from "../utils/types";

const loginSchema: Schema = {
  type: "object",
  properties: {
    login: { type: ["string", "number"], required: true, minLength: 1 },
    password: { type: "string", required: true, minLength: 1 },
    // recaptchaToken: { type: "string", required: true},
  },
};

const forgotPasswordSchema: Schema = {
  type: "object",
  properties: {
    last_name: { type: "string", required: true },
    email: { type: "string", required: true },
  },
};

const confirmPasswordSchema: Schema = {
  type: "object",
  properties: {
    password: { type: "string", required: true },
    confirmPassword: { type: "string", required: true },
  },
};

const changeEmailSchema: Schema = {
  type: "object",
  properties: {
    email: { type: "string", minLength: 4, maxLength: 100, required: true },
    code: { type: "string", minLength: 1, required: true },
  },
};

const changeNumberSchema: Schema = {
  type: "object",
  properties: {
    phone: { type: "string", minLength: 12, maxLength: 12, required: true },
  },
};

const changePasswordSchema: Schema = {
  type: "object",
  properties: {
    password: { type: "string", minLength: 6, required: true },
    confirm_password: { type: "string", minLength: 6, required: true },
  },
};

export default {
  loginSchema,
  forgotPasswordSchema,
  confirmPasswordSchema,
  changeEmailSchema,
  changeNumberSchema,
  changePasswordSchema,
};
