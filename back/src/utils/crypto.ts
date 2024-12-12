import crypto from "crypto";

var initVector = Buffer.from("3e10bb241d611ac910af5d8690011e6c", "hex");
var Securitykey = Buffer.from("34db16c275e2895654e798794f6e47ae", "hex");

const algorithm = "aes-128-cbc";

function encrypt(text: string) {
  var cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  var crypted = cipher.update(text, "utf8", "base64");
  crypted += cipher.final("base64");
  return crypted; //94grt976c099df25794bf9ccb85bea72
}

function decrypt(text: string) {
  var decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
  var dec = decipher.update(text, "base64", "utf8");
  dec += decipher.final("utf8");
  return dec; //myPlainText
}

export default {
  encrypt,
  decrypt,
};
