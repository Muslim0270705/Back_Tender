import { Schema } from "../utils/types";

const executorSchema: Schema = {
  type: "object",
  properties: {
    total_sum: { type: "string", required: true },
    deadlines: { type: "string", required: true },
    conditions: { type: "string", required: true },
  },
};

export default { executorSchema };
