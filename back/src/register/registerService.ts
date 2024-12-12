import { IBin } from "../utils/types";
import db from "../utils/db";
import { md5 } from "../utils/utils";

async function isBinExist(bin: IBin) {
  try {
    const { rows } = await db.query(
      `SELECT EXISTS(SELECT 1 FROM "user" WHERE "user".bin=$1 AND "user".check_cod=true);`,
      [bin]
    );
    if (rows.length > 0) {
      const { exists } = rows[0];
      return exists;
    }
    return false;
  } catch (err) {
    console.log("error isPinExist: ", err.message);
    return false;
  }
}

async function isEmailExist(email: string, id_role: number) {
  try {
    const { rows } = await db.query(
      `SELECT EXISTS(SELECT 1 FROM "user" u
                     JOIN user_role ur USING(id_user)
                     WHERE u.email = $1 AND u.active = true AND ur.id_role = $2);`,
      [email, id_role]
    );
    if (rows.length > 0) {
      const { exists } = rows[0];
      return exists;
    }
    return false;
  } catch (err) {
    console.log("error isEmailExist: ", err.message);
    return false;
  }
}

async function insertUser(
  company_name: string,
  bin: IBin,
  surname: string,
  name: string,
  patronymic: string,
  email: string,
  phone: string,
  idRole: number
) {
  try {
    const id_role = idRole === 2 ? 2 : 3;

    // Check if a user with the same email and phone exists
    const { rows: existingUser } = await db.query(
      `SELECT id_user FROM "user" WHERE email = $1 AND phone = $2`,
      [email, phone]
    );

    if (existingUser.length > 0) {
      // If user exists, add the new role to `user_role`
      const userId = existingUser[0].id_user;
      const { rows: existingRole } = await db.query(
        `SELECT * FROM user_role WHERE id_user = $1 AND id_role = $2`,
        [userId, id_role]
      );

      if (existingRole.length === 0) {
        // If role does not exist, insert it
        await db.query(
          `INSERT INTO user_role (id_user, id_role) VALUES ($1, $2)`,
          [userId, id_role]
        );
      }
      return { id_user: userId };
    } else {
      // If user does not exist, insert the new user and role
      const { rows, error } = await db.query(
        `WITH inserted_user AS (
          INSERT INTO "user" 
            (company_name, bin, surname, name, patronymic, email, phone, created_date, active, deleted) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, false, false) 
          RETURNING id_user
        )
        INSERT INTO user_role (id_user, id_role)
        VALUES ((SELECT id_user FROM inserted_user), $8)
        RETURNING id_user;`,
        [company_name, bin, surname, name, patronymic, email, phone, id_role]
      );

      return error ? false : rows[0];
    }
  } catch (error) {
    console.log("error insertUser: ", error.message);
    return false;
  }
}


async function insertPassword(id_user: number, password: string) {
  try {
    const hashPassword = md5(password);
    const { error, rows } = await db.query(
      `UPDATE "user" SET password = $2
       WHERE "user".id_user = $1
       RETURNING id_user;`,
      [id_user, hashPassword]
    );
    return error ? false : rows[0].id_user;
  } catch (error) {
    console.log("error insertPassword: ", error.message);
    return false;
  }
}

async function isPhoneExist(phone: string) {
  try {
    const { rows } = await db.query(
      `SELECT EXISTS(
        SELECT 1 FROM "user"
        WHERE "user".phone LIKE $1);`,
      [`%${phone}`]
    );
    if (rows.length > 0) {
      const { exists } = rows[0];
      return exists;
    }
    return false;
  } catch (error) {
    console.log("error isPhoneExist: ", error);
    return false;
  }
}

function formatPhoneNumber(phoneNumber: string) {
  // Удаление пробелов и тире из номера телефона
  const cleanedPhoneNumber = phoneNumber.replace(/[^\d]/g, "");

  // Если номер начинается с '+996', обрезаем этот префикс
  if (cleanedPhoneNumber.startsWith("996")) {
    return cleanedPhoneNumber.slice(4);
  }

  // Если номер начинается с '0', обрезаем этот ноль
  if (cleanedPhoneNumber.startsWith("0")) {
    return cleanedPhoneNumber.slice(1);
  }

  // В противном случае, возвращаем исходный номер
  return cleanedPhoneNumber;
}

const RegisterService = {
  isBinExist,
  isEmailExist,
  insertUser,
  isPhoneExist,
  formatPhoneNumber,
  insertPassword,
};

export default RegisterService;
