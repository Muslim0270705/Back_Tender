import { NextFunction, Response, Request } from "express";
import { sendError } from "../utils/send";
import Config from "../utils/config";
import JWT from "../utils/jwt";
import COOKIE from "../utils/cookie";

const returnMessage = (res: Response, message: string) =>
  sendError(res, message, false, 401);

const isAdminToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await checkToken(req, res, next, [1]);
};

const isCustomerToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await checkToken(req, res, next, [1, 2]);
};

const isExecutorToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await checkToken(req, res, next, [1, 3]);
};

const isNotEmpToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return await checkToken(req, res, next, [1, 2, 3]);
};

const checkIntersection = async (
  array1: number[],
  array2: number[]
): Promise<boolean> => {
  const set1 = new Set(array1);
  for (let element of array2) {
    // Если хотя бы один элемент второго массива содержится в первом массиве, возвращаем true
    if (set1.has(element)) return true;
  }
  // Если ни один элемент второго массива не содержится в первом массиве, возвращаем false
  return false;
};

const checkToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
  roles: number[]
) => {
  try {
    const tokenFromCookie = req.cookies[Config.COOKIE_ACCESS];
    const token =
      req.headers["authorization"] ||
      (tokenFromCookie ? `Bearer ${tokenFromCookie}` : "");

    if (Config.NODE_ENV === "development") {
      console.log("token: ", token);
    }

    (req as any).token = token;
    if (token) {
      const decodedData = JWT.getTokenData(token);
      if (!decodedData) return returnMessage(res, req.t("token.invalid"));

      const currentTimestamp = Date.now();
      if (Config.NODE_ENV === "development") {
        console.log({ ...decodedData });
        console.log(new Date(decodedData.exp));
        console.log(new Date(currentTimestamp));
        console.log(decodedData.exp > currentTimestamp);
      }
      const checkData = await COOKIE.CHECK_PERM(req);
      if (
        checkData &&
        token &&
        decodedData &&
        decodedData.exp > currentTimestamp
      ) {
        const decodedRoles = decodedData.r.map((roleObj) => roleObj.id_role);
        const checkRole = await checkIntersection(decodedRoles, roles);
        if (!!checkRole) {
          req.user = decodedData;
          return next();
        }
        return returnMessage(res, req.t("token.permission"));
      } else {
        return returnMessage(res, req.t("token.invalid"));
      }
    } else {
      return returnMessage(res, req.t("token.notFound"));
    }
  } catch (err) {
    console.log("CheckUser error catch =>", err);
    return returnMessage(res, req.t("token.expired"));
  }
};

const CheckService = {
  isAdminToken,
  isCustomerToken,
  isExecutorToken,
  isNotEmpToken,
};

export default CheckService;
