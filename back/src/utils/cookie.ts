import { Request, Response } from "express";
import { v4 } from "uuid";

import db from "../utils/db";
import { IRole } from "../user/types";
import { md5 } from "../utils/utils";
import Config from "./config";

const uuidv4 = v4;
const COOKIE_MOBILE = Config.COOKIE_MOBILE;

//id
async function Generate() {
  const cookieId = uuidv4();
  return cookieId;
}

//{rowCount} false
async function Delete(req: Request, _res: Response): Promise<boolean | object> {
  const cookieId = md5(String(req.headers["authorization"]));
  const { command, rowCount } = await db.query(
    `UPDATE "Session" SET offline=true
          WHERE offline=false AND login IN
          (SELECT login FROM "Session" 
          WHERE cookie = $1);`,
    [cookieId]
  );
  if (command == "UPDATE") return { rowCount };
  else return false;
}

//{staff, id} false
async function GetUser(req: Request) {
  const token = req.headers["authorization"];
  if (token) {
    const { rowCount, rows } = await db.query(
      'SELECT * FROM "fn_Session_Get_User"($1);',
      [md5(token)]
    );
    if (rowCount) return { ...rows[0] };
    else false;
    console.log(rowCount);
    console.log(rows[0]);
  }
  return false;
}

//true false
async function Check(req: Request): Promise<boolean> {
  let user = await GetUser(req);
  req.user = user;
  if (user) return true;
  else return false;
}

async function Login(
  req: Request,
  _res: Response,
  login: string,
  id: number,
  role: IRole[],
  token: string
) {
  const jsonRole = JSON.stringify(role);
  // if cookies does not exist then save generated cookieId to res.cookies then insert into session
  const isMobile = String(req.cookies[COOKIE_MOBILE]) == "true" ? true : false;
  const cookieIdToken = token ? token : await Generate();

  const cookieId = md5(cookieIdToken);

  const xForwardedFor = req.headers["x-forwarded-for"];
  let ip: string;

  if (Array.isArray(xForwardedFor)) {
    ip = (xForwardedFor[0] ?? req.ip) as string;
  } else if (typeof xForwardedFor === "string") {
    const forwardedIps = xForwardedFor.split(",");
    ip = (forwardedIps.length > 0 ? forwardedIps[0].trim() : req.ip) as string;
  } else {
    ip = req.ip as string;
  }

  const { rows } = await db.query(
    'SELECT  EXISTS( SELECT 1 FROM "Session" WHERE login = $1);',
    [login]
  );

  if (rows[0].exists) {
    const { rowCount: updated } = await db.query(
      `UPDATE "Session"
        SET offline=false,
            last_action=current_timestamp,
            cookie=$2,
            id_user=$3,
            is_mobile=$4,
            role=$5
       WHERE login=$1`,
      [login, cookieId, id, isMobile, jsonRole]
    );

    if (updated) await LoginLog(login, id, role, isMobile, ip);
    return cookieIdToken;
  } else {
    const { rowCount: inserted } = await db.query(
      `INSERT INTO "Session" (cookie, login, id_user, role, last_action, is_mobile)
            VALUES ($1, $2, $3, $4, current_timestamp, $5)`,
      [cookieId, String(login), id, jsonRole, isMobile]
    );
    if (inserted) await LoginLog(login, id, role, isMobile, ip);
    return cookieIdToken;
  }
}

async function LoginLog(
  login: string,
  id: number,
  role: IRole[],
  isMobile: boolean,
  ip: string
) {
  const jsonRole = JSON.stringify(role);
  const { rowCount } = await db.query(
    `INSERT INTO "Session_log" (login, id_user, role, log_time, is_mobile, ip)
          VALUES ($1, $2, $3, current_timestamp, $4, $5)`,
    [login, id, jsonRole, isMobile, ip]
  );
  if (rowCount) return true;
  else return false;
}

const COOKIE = {
  LOGIN: Login,
  LOGOUT: Delete,
  CHECK_PERM: Check,
};

export default COOKIE;
