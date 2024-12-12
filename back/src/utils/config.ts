import dotenv from "dotenv";
dotenv.config();

const PORT = Number(process.env.PORT) || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

//jwt
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "";
const JWT_EXPIRE_HOURS = process.env.JWT_EXPIRE_HOURS || "30h";

//database
const DBUSER = process.env.DBUSER || "postgres";
const DBPASS = process.env.DBPASS || "postgres";
const DBSERVER = process.env.DBSERVER || "localhost";
const DBPORT = process.env.DBPORT || 5432;
const DBNAME = process.env.DBNAME || "postgres";
const DBNAME2 = process.env.DBNAME2 || "postgres";
const DBPG_MAX_CONNECTIONS = process.env.DBPG_MAX_CONNECTIONS || 20;
const DBPG_IDLETIMEOUTMILLLIS = process.env.DBPG_IDLETIMEOUTMILLLIS || 30000;
const DBPG_CONNECTIONTIMEOUTMILLES =
  process.env.DBPG_CONNECTIONTIMEOUTMILLES || 2000;

//role_admin
const ID_ADMIN_ROLE = Number(process.env.ID_ADMIN_ROLE) || 19;

//cors
const ALLOW_HOST = process.env.ALLOW_HOST || `http://localhost:${PORT}`;
const ALLOW_HOST_LIST: string[] = (
  process.env.ALLOW_HOST_LIST
    ? JSON.parse(process.env.ALLOW_HOST_LIST)
    : [ALLOW_HOST]
) as string[];

//cookie
const COOKIE_MOBILE = process.env.COOKIE_MOBILE || "isMobile";
const COOKIE_ACCESS = process.env.COOKIE_ACCESS || "access_token";

//tunduk
const CHECK_TUNDUK = process.env.CHECK_TUNDUK || "true";
const SECURITY_SERVER_URL =
  process.env.SECURITY_SERVER_URL || "http://localhost:5000";
const SECURITY_SERVER_URL_CHILDREN =
  process.env.SECURITY_SERVER_URL_CHILDREN || "http://localhost:5000";
const SECURITY_TUNDUK_HEADER = process.env.SECURITY_TUNDUK_HEADER || "header";
const SECURITY_TUNDUk_VALUE_PASSPORT =
  process.env.SECURITY_TUNDUk_VALUE_PASSPORT || "value";
const SECURITY_TUNDUk_VALUE = process.env.SECURITY_TUNDUk_VALUE || "value";

//email service
const EMAIL_SERVICE_URL =
  process.env.EMAIL_SERVICE_URL || "http://localhost:5000";
const EMAIL_TYPE_CONFIRM = process.env.EMAIL_TYPE_CONFIRM || "TYPE_CONFIRM";
const EMAIL_TYPE_RECOVER = process.env.EMAIL_TYPE_RECOVER || "TYPE_RECOVER";
const EMAIL_JWT_EXPIRE_HOURSE = process.env.EMAIL_JWT_EXPIRE_HOURSE || "1000h";
const EMAIL_TYPE_PASSWORD = process.env.EMAIL_TYPE_PASSWORD || "TYPE";
const URL_FORGOT_PASSWORD =
  process.env.URL_FORGOT_PASSWORD || "http://localhost:5000";

// street service
const STREET_SERVICE_URL =
  process.env.STREET_SERVICE_URL || "http://localhost:5000";
const STREET_TOKEN = process.env.STREET_TOKEN || "token";
const STREET_FULL_PATH =
  process.env.STREET_FULL_PATH || "http://localhost:5000";

//address service
const ADDRESS_SERVICE_URL =
  process.env.ADDRESS_SERVICE_URL || "http://localhost:5000";
const SECURITY_ADDRESS_HEADER = process.env.SECURITY_ADDRESS_HEADER || "header";
const SECURITY_ADDRESS_VALUE = process.env.SECURITY_ADDRESS_VALUE || "value";

//recapthca
const DEFAULT_KEY_CAPTCHA = process.env.DEFAULT_KEY_CAPTCHA || "KEY_CAPTCHA";

//attestat
const SCHOOL_TOKEN = process.env.SCHOOL_TOKEN || "token";

const REGISTER_AGE = process.env.REGISTER_AGE || 18;

//file
const FILE_PATH = process.env.FILE_PATH || "";
const FILE_BENEFICIARY_PATH = process.env.FILE_BENEFICIARY_PATH || "";
const FILE_BENEFICIARY_URL = process.env.FILE_BENEFICIARY_URL || "";
const FILE_KDD_PATH = process.env.FILE_KDD_PATH || "";
const FILE_KDD_URL = process.env.FILE_KDD_URL || "";
const FILE_RELATION_PATH = process.env.FILE_RELATION_PATH || "";
const FILE_RELATION_URL = process.env.FILE_RELATION_URL || "";

//eni
const ENI_SERVICE = process.env.ENI_SERVICE || "";
const ENI_SERVICE_TOKEN = process.env.ENI_SERVICE_TOKEN || "";

//mugalim
const MUGALIM_SERVICE_URL =
  process.env.MUGALIM_SERVICE_URL || "http://localhost:5000";
const MUGALIM_SERVICE_HEADER = process.env.MUGALIM_SERVICE_HEADER || "header";
const MUGALIM_SERVICE_VALUE = process.env.MUGALIM_SERVICE_VALUE || "value";

//swagger
const SWAGGER_URL = process.env.SWAGGER_URL || "";

const Config = {
  PORT,
  NODE_ENV,
  JWT_ACCESS_SECRET,
  JWT_EXPIRE_HOURS,
  DBUSER,
  DBPASS,
  DBSERVER,
  DBPORT,
  DBNAME,
  DBNAME2,
  DBPG_MAX_CONNECTIONS,
  DBPG_IDLETIMEOUTMILLLIS,
  DBPG_CONNECTIONTIMEOUTMILLES,
  ALLOW_HOST_LIST,
  COOKIE_MOBILE,
  COOKIE_ACCESS,
  CHECK_TUNDUK,
  SECURITY_SERVER_URL,
  SECURITY_SERVER_URL_CHILDREN,
  SECURITY_TUNDUK_HEADER,
  SECURITY_TUNDUk_VALUE,
  EMAIL_SERVICE_URL,
  EMAIL_TYPE_CONFIRM,
  EMAIL_TYPE_RECOVER,
  EMAIL_JWT_EXPIRE_HOURSE,
  ADDRESS_SERVICE_URL,
  SECURITY_ADDRESS_HEADER,
  SECURITY_TUNDUk_VALUE_PASSPORT,
  SECURITY_ADDRESS_VALUE,
  URL_FORGOT_PASSWORD,
  DEFAULT_KEY_CAPTCHA,
  SCHOOL_TOKEN,
  REGISTER_AGE,
  ID_ADMIN_ROLE,
  STREET_SERVICE_URL,
  STREET_TOKEN,
  STREET_FULL_PATH,
  FILE_BENEFICIARY_PATH,
  FILE_BENEFICIARY_URL,
  EMAIL_TYPE_PASSWORD,
  FILE_KDD_PATH,
  FILE_KDD_URL,
  FILE_RELATION_PATH,
  FILE_RELATION_URL,
  ENI_SERVICE,
  ENI_SERVICE_TOKEN,
  FILE_PATH,
  MUGALIM_SERVICE_URL,
  MUGALIM_SERVICE_HEADER,
  MUGALIM_SERVICE_VALUE,
  SWAGGER_URL,
};

export default Config;
