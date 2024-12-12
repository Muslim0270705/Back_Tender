import { Schema } from "../utils/types";

const registerSchema: Schema = {
  type: "object",
  properties: {
    company_name: { type: "string", required: true },
    bin: {
      type: "string",
      required: true,
    },
    surname: { type: "string", minLength: 1, maxLength: 100, required: true },
    name: { type: "string", minLength: 1, maxLength: 100, required: true },
    patronymic: { type: ["string", "null"] },
    email: { type: "string", minLength: 4, maxLength: 100, required: true },
    phone: { type: "string", minLength: 1, required: true },
    id_role: { type: "number", required: true },
  },
};

const emailVerificationSchema: Schema = {
  type: "object",
  properties: {
    id_user: { type: "number", required: true },
    code: { type: "number", required: true },
  },
};

export default { registerSchema, emailVerificationSchema };
