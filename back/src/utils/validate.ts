import { Schema, Validator } from "jsonschema";

const validate = <T>(data: T, schema: Schema): boolean => {
  return new Validator().validate(data, schema).valid;
};

export default validate;
