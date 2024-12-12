import { Schema } from "../utils/types";

const verificationSchema: Schema = {
  type: "object",
  properties: {
    email: { type: "string", required: true, minLength: 4, maxLength: 40 },
  },
};

const EmailSchema = { verificationSchema };

export default EmailSchema;
