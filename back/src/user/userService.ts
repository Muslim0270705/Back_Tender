import { md5 } from "../utils/utils";
import db from "../utils/db";
import { ILogin } from "./types";

async function userLogin(login: ILogin, password: string) {
  try {
    const cryptoPass = md5(password);
    const { rows, rowCount } = await db.query(
      `SELECT * FROM fn_auth($1, $2);`,
      [login, cryptoPass]
    );

    if (rowCount && rowCount > 0) {
      const { id_user, bin, surname, name, patronymic, roles } = rows[0];
      return {
        id: id_user,
        role: roles,
        bin,
        surname,
        name,
        patronymic,
      };
    }
    return false;
  } catch (err) {
    console.log("error userLogin: ", err.message);
    return false;
  }
}

async function updateUserData(
  userId: number,
  companyName?: string,
  bin?: string,
  surname?: string,
  name?: string,
  patronymic?: string | null,
  email?: string,
  phone?: string
) {
  try {
    const { error, rows } = await db.query(
      `UPDATE "user"
       SET company_name = COALESCE(NULLIF($2, ''), company_name),
           bin = COALESCE(NULLIF($3, ''), bin),
           surname = COALESCE(NULLIF($4, ''), surname),
           "name" = COALESCE(NULLIF($5, ''), "name"),
           patronymic = COALESCE(NULLIF($6, ''), patronymic),
           email = COALESCE(NULLIF($7, ''), email),
           phone = COALESCE(NULLIF($8, ''), phone),
           active = true,
           updated_date = now()
       WHERE id_user = $1
       RETURNING *;`,
      [userId, companyName, bin, surname, name, patronymic, email, phone]
    );

    return error ? false : rows[0];
  } catch (error) {
    console.log("error updateUserData: ", error.message);
    return false;
  }
}

async function getEmailById(idUser: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT u.email FROM "user" u WHERE id_user = $1`,
      [idUser]
    );
    if (error) {
      console.log("Error querying database for get Email: ", error.message);
      return false;
    }
    return rows[0].email;
  } catch (error) {
    console.log("error getEmailById: ", error.message);
    return false;
  }
}

async function getPasswordById(idUser: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT password FROM "user" WHERE id_user = $1;`,
      [idUser]
    );
    return error ? false : rows[0];
  } catch (error) {
    console.log("error getPasswordById: ", error.message);
    return false;
  }
}

async function updateUser(id_user: number) {
  try {
    const { error, rows } = await db.query(
      `UPDATE "user" SET active_email = true WHERE id_user = $1 RETURNING id_user;`,
      [id_user]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error updateUser: ", error.message);
    return false;
  }
}

async function getRoleById(idUser: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT u.id_role 
       FROM "user" u 
       WHERE u.id_user=$1;`,
      [idUser]
    );
    return error ? false : rows[0].id_role;
  } catch (error) {
    console.log("error quering getRoleById: ", error.message);
    return false;
  }
}

async function getUserById(id_user: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT u.company_name, u.bin, 
              TRIM(u.surname || ' ' || u.name || ' ' || COALESCE(u.patronymic, '')) AS full_name,
              u.email, u.phone
       FROM "user" u 
       WHERE u.id_user = $1;`,
      [id_user]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error getUserById: ", error.message);
    return false;
  }
}

async function deleteUser(id_user: number) {
  try {
    const { rows } = await db.query(
      `UPDATE "user" 
       SET deleted = true,
       	   active = false
       WHERE "user".id_user = $1
       RETURNING id_user;`,
      [id_user]
    );
    return rows[0];
  } catch (error) {
    console.error("Error deleting user: ", error.message);
    return false;
  }
}

async function getPhoneByUserId(id_user: number) {
  try {
    const { rows } = await db.query(
      `SELECT phone FROM "user" WHERE "user".id_user = $1;`,
      [id_user]
    );
    return rows[0].phone;
  } catch (error) {
    console.error("Error getPhoneByUserId: ", error.message);
    return false;
  }
}

async function getPhoneExist(phone: string) {
  try {
    const { rows } = await db.query(
      `SELECT EXISTS(SELECT 1 FROM "user" WHERE "user".phone = $1);`,
      [phone]
    );
    return rows[0]?.exists;
  } catch (error) {
    console.error("Error getPhoneByUserId: ", error.message);
    return false;
  }
}

const UserService = {
  userLogin,
  getEmailById,
  getPasswordById,
  getRoleById,
  updateUser,
  getUserById,
  updateUserData,
  deleteUser,
  getPhoneByUserId,
  getPhoneExist
};

export default UserService;
