import { emailSendService } from "../services/emailSendService";
import Config from "../utils/config";
import db from "../utils/db";

async function emailConfirmCode(email: string, code: string) {
  try {
    const type = Config.EMAIL_TYPE_CONFIRM;
    const message = `<div>
                        <p>Здравствуйте! Чтобы подтвердить свой адрес электронной почты, введите этот код: ${code}</p>
                        <p>Данное сообщение было сгенерированно в системе.<br />
                            Ответ на это письмо не требуется.</p>
                    </div>`;
    return await emailSendService({ email, type, message });
  } catch (error) {
    console.log("error emailConfirmCode: ", error.message);
    return false;
  }
}

async function insertEmailService(
  email: string,
  idStatus: number | null,
  code: string
) {
  try {
    const { error, rows } = await db.query(
      `INSERT INTO email_verification (email, id_status, code) 
        VALUES ($1, $2, $3)
        RETURNING email, id_status, create_date;`,
      [email, idStatus, code]
    );
    return error ? false : rows[0];
  } catch (error) {
    console.log("error insertEmailService: ", error.message);
    return false;
  }
}

async function existCodeEmail(email: string, minutes: number = 5) {
  try {
    const { rows } = await db.query(
      `SELECT EXISTS(SELECT 1 FROM email_verification es 
          WHERE es.email = $1 AND es.active = TRUE
            AND es.create_date >= CURRENT_TIMESTAMP - INTERVAL '1 minutes' * $2);`,
      [email, minutes]
    );
    if (rows.length > 0) {
      const { exists } = rows[0];
      return exists;
    }
    return false;
  } catch (error) {
    console.log("error existCodeEmail: ", error.message);
    return false;
  }
}

async function insertRecoverPassword(email: string) {
  try {
    const { error, rows } = await db.query(
      `INSERT INTO recover_password_email (email, create_date) VALUES($1, CURRENT_TIMESTAMP)
        RETURNING id_recover_password_email;`,
      [email]
    );
    return error ? false : rows[0];
  } catch (error) {
    console.log("error insertRecoverPassword: ", error.message);
    return false;
  }
}

async function updatedRecoverPassStatus(
  id: number,
  statusId: number | null = null
) {
  try {
    const { error, rows } = await db.query(
      `UPDATE recover_password_email SET id_status = $2
        WHERE id_recover_password_email = $1
        RETURNING id_recover_password_email;`,
      [id, statusId]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error updatedRecoverPassStatus", error.message);
    return false;
  }
}

async function existLinkRecoverEmail(email: string, minutes: number = 5) {
  try {
    const { rows } = await db.query(
      `SELECT EXISTS(SELECT 1 FROM recover_password_email rpe
        WHERE rpe.email = $1 AND rpe.active = TRUE
          AND rpe.create_date >= CURRENT_TIMESTAMP - INTERVAL '1 minutes' * $2);`,
      [email, minutes]
    );
    if (rows.length > 0) {
      const { exists } = rows[0];
      return exists;
    }
    return false;
  } catch (error) {
    console.log("error existLinkRecoverEmail: ", error.message);
    return false;
  }
}

async function updateRecoverActive(id: number) {
  try {
    const { error, rows } = await db.query(
      `UPDATE recover_password_email SET active = FALSE, update_date = CURRENT_TIMESTAMP
        WHERE id_recover_password_email = $1
        RETURNING id_recover_password_email;`,
      [id]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error updateRecoverActive: ", error.message);
    return false;
  }
}

async function existRecoverEmailById(id: number, email: string) {
  try {
    const { rows } = await db.query(
      `SELECT EXISTS(SELECT 1 FROM recover_password_email rpe
        WHERE rpe.id_recover_password_email = $1 AND rpe.email = $2 AND rpe.active = TRUE);`,
      [id, email]
    );
    if (rows.length > 0) {
      const { exists } = rows[0];
      return exists;
    }
    return false;
  } catch (error) {
    console.log("error existRecoverEmailById: ", error.message);
    return false;
  }
}

async function getCodeByEmail(
  email: string,
  code: string,
  minutes: number = 20
) {
  try {
    const { error, rows } = await db.query(
      `SELECT es.id_email_verification, es.email, es.code 
        FROM email_verification es 
        WHERE es.email = $1 
          AND es.active = TRUE 
          AND es.code = $2
          AND es.create_date >= CURRENT_TIMESTAMP - INTERVAL '1 minutes' * $3
          LIMIT 1;`,
      [email, code, minutes]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error getCodeByEmail: ", error.message);
    return false;
  }
}

async function updateEmailVerificationById(id: number) {
  try {
    const { error, rows } = await db.query(
      `UPDATE email_verification SET active = FALSE, update_date = CURRENT_TIMESTAMP 
        WHERE id_email_verification = $1 RETURNING id_email_verification;`,
      [id]
    );
    return error ? false : rows[0];
  } catch (error) {
    console.log("error updateEmailVerificationById: ", error.message);
    return false;
  }
}

async function isEmailUsed(email: string) {
  try {
    const { error, rows } = await db.query(
      'SELECT EXISTS(SELECT 1 FROM "user" WHERE email = $1);',
      [email]
    );
    if (error) {
      console.log("Error querying database for email check: ", error.message);
      return false;
    }
    if (rows.length > 0) {
      const { exists } = rows[0];
      return exists;
    }
  } catch (error) {
    console.log("error IsEmailExists: ", error.message);
    return false;
  }
}

const EmailService = {
  emailConfirmCode,
  insertEmailService,
  existCodeEmail,
  getCodeByEmail,
  updateEmailVerificationById,
  existLinkRecoverEmail,
  insertRecoverPassword,
  updatedRecoverPassStatus,
  existRecoverEmailById,
  updateRecoverActive,
  isEmailUsed,
};

export default EmailService;
