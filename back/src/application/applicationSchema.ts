import { Schema } from "../utils/types";

const applicationSchema: Schema = {
  type: "object",
  properties: {
    projectName: { type: "string", required: true },
    isProduct: { type: ["string", "boolean"] },
    isService: { type: ["string", "boolean"] },
    description: { type: "string" },
    deadlines: { type: "string", required: true },
    totalSum: { type: "string" },
    file: { type: "string" },
  },
};

export default { applicationSchema };
