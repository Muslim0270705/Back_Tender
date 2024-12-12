import axios from "axios";
import Config from "../utils/config";

const DEFAULT_KEY_CAPTCHA = Config.DEFAULT_KEY_CAPTCHA;

interface VerifyRecaptchaParams {
  secretKey?: string;
  responseToken: string;
  remoteIp?: string;
}

export const verifyRecaptcha = async ({
  secretKey = DEFAULT_KEY_CAPTCHA,
  responseToken,
  remoteIp,
}: VerifyRecaptchaParams): Promise<boolean> => {
  try {
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${responseToken}&remoteip=${remoteIp}`;
    const { data } = await axios.post(url);
    return data?.success ?? false;
  } catch (error) {
    console.error("error verifyRecaptcha", error.message);
    return false;
  }
};
