import jwt, { JwtPayload } from "jsonwebtoken";
import { ITokenData } from "../user/types";
import crypto from "./crypto";
import Config from "./config";

const generateAccessToken = (data: object): string => {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign(
    { data: crypto.encrypt(JSON.stringify(data)) },
    Config.JWT_ACCESS_SECRET,
    {
      expiresIn: Config.JWT_EXPIRE_HOURS,
    }
  );
};

const getTokenData = (token: string): ITokenData | false => {
  try {
    const rawToken = token.split(" ");
    if (rawToken[0] != "Bearer") {
      return false;
    }
    const decodedData = jwt.verify(
      rawToken[1],
      Config.JWT_ACCESS_SECRET
    ) as JwtPayload;

    if (!decodedData || !decodedData.data) {
      return false;
    }

    const result: ITokenData = JSON.parse(crypto.decrypt(decodedData.data));

    return { ...result };
  } catch (error) {
    console.log("error getTokenData: ", error.message);
    return false;
  }
};

const generateLinkToken = (
  data: object,
  expires = Config.EMAIL_JWT_EXPIRE_HOURSE
) => {
  // expires after half and hour (1800 seconds = 30 minutes)
  return jwt.sign({ data }, Config.JWT_ACCESS_SECRET, {
    expiresIn: expires,
  });
};

const getTokenDataLink = (token: string) => {
  try {
    const decodedData = jwt.verify(
      token,
      Config.JWT_ACCESS_SECRET
    ) as JwtPayload;
    if (!decodedData || typeof decodedData !== "object" || !decodedData.data) {
      return false;
    }
    const result = decodedData.data;
    return { ...result };
  } catch (error) {
    console.log("error getTokenDataLink: ", error.message);
    return false;
  }
};

const TokenService = {
  generateAccessToken,
  getTokenData,
  generateLinkToken,
  getTokenDataLink,
};

export default TokenService;
