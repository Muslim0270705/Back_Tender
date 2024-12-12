import { Response } from "express";

const send = (
  res: Response,
  data: boolean | object,
  message: string,
  error: boolean,
  statusCode: number
) => {
  return res.status(statusCode).json({ data, message, error });
};

const sendError = (
  res: Response,
  message: string,
  data: boolean | object = false,
  statusCode: number = 400
) => {
  return send(res, data, message, true, statusCode);
};

const sendSuccess = (
  res: Response,
  message: string,
  data: boolean | object = true,
  statusCode: number = 200
) => {
  return send(res, data, message, false, statusCode);
};

export { send, sendError, sendSuccess };
