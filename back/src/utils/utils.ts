import crypto from "crypto";

function md5(value: string) {
  return crypto.createHash("md5").update(value).digest("hex");
}

export { md5 };
