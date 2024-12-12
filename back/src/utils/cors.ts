import { CorsOptions, CorsOptionsDelegate, CorsRequest } from "cors";
import Config from "./config";

const corsOptionsDelegate: CorsOptionsDelegate = function (
  req: CorsRequest,
  callback
) {
  let corsOptions: CorsOptions;
  if (Config.ALLOW_HOST_LIST.indexOf(req.headers["origin"] || "") !== -1) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

export default corsOptionsDelegate;
