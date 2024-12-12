export type ILogin = string | number;

export interface IRole {
  role_name: string;
  id_role: number;
}

export interface IRequestBodyLogin {
  login: ILogin;
  password: string;
  recaptchaToken: string;
}

export interface IRequestBodyResetPass {
  password: string;
  confirmPassword: string;
}

export interface IUser {
  id: number;
  role: IRole[];
  bin: string;
  surname: string;
  name: string;
  patronymic: string;
}

export interface ITokenData {
  id: number;
  r: IRole[];
  s: string;
  n: string;
  b: string;
  idUd?: number;
  exp: number;
}
