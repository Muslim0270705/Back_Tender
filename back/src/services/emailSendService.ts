import axios from "axios";
import Config from "../utils/config";

const URL = Config.EMAIL_SERVICE_URL;

interface IEmailRequestBody {
  email: string;
  type: string;
  redirect?: boolean;
  message: string;
  content?: string | null;
}

export interface IEmailSendResponse {
  status?: number | undefined;
}

export async function emailSendService({
  email,
  type,
  redirect = false,
  message,
  content = null,
}: IEmailRequestBody): Promise<IEmailSendResponse | boolean> {
  try {
    const { data, status } = await axios.post(URL, {
      email,
      type,
      redirect,
      message,
      content,
    });
    if (status === 200 || status === 201) {
      return data?.status ? data : true;
    } else return false;
  } catch (error) {
    console.log("error emailSendService: ", error.message);
    return false;
  }
}
