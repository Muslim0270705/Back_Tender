import { NextFunction, Request, Response } from "express";
import { sendError } from "./send";

// Перехватчик ошибок
const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log("errorHandler", "=>", {
    url: req.url,
    error,
    tFunctionAvailable: typeof req.t === 'function'
  });
  return sendError(res, error?.message);
};

export default errorHandler;
