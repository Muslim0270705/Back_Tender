import db from "../utils/db";

async function create(
  id_user: number,
  project_name: string,
  is_product: string | boolean,
  is_service: string | boolean,
  description: string,
  deadlines: string,
  total_sum: string,
  files?: string[]
) {
  try {
    const isProductBoolean =
      typeof is_product === "string"
        ? is_product.toLowerCase() === "true"
        : is_product;
    const isServiceBoolean =
      typeof is_service === "string"
        ? is_service.toLowerCase() === "true"
        : is_service;

    const filePaths = files || null;

    const { error, rows } = await db.query(
      `INSERT INTO application(id_user, project_name, is_product, is_service, description, deadlines, total_sum, file_name)
       VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [
        id_user,
        project_name,
        isProductBoolean,
        isServiceBoolean,
        description,
        deadlines,
        total_sum,
        filePaths,
      ]
    );

    return error ? false : rows;
  } catch (error) {
    console.log("error create: ", error.message);
    return false;
  }
}

async function existsProductName(
  idUser: number,
  projectName: string
): Promise<boolean> {
  const { rows } = await db.query(
    `SELECT 1 FROM application WHERE id_user = $1 AND project_name = $2 AND active = true AND is_deleted = false LIMIT 1;`,
    [idUser, projectName]
  );
  return rows.length > 0;
}

async function findByIdUser(id_user: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT * FROM application a WHERE a.id_user = $1 AND a.active = true AND is_deleted = false;`,
      [id_user]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error findByIdUser: ", error.message);
    return false;
  }
}

async function getApplicationById(id: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT a.id,
                  a.id_user,
                TRIM(u.surname || ' ' || u.name || ' ' || COALESCE(u.patronymic, '')) AS full_name,
                u.company_name,
                a.description ,
                a.deadlines,
                a.total_sum 
        FROM application a 
        JOIN "user" u ON u.id_user = a.id_user 
        WHERE a.id = $1 AND a.active = true AND a.is_deleted = false
        LIMIT 1;
  `,
      [id]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error getUserById: ", error.message);
    return false;
  }
}

async function updateApplicationData(
  applicationId: number,
  projectName?: string,
  isProduct?: boolean,
  isService?: boolean,
  description?: string,
  deadlines?: string,
  totalSum?: string,
  fileNames?: string[]
) {
  try {
    const filePaths =
      fileNames && fileNames.length > 0 ? fileNames.join(",") : null;
    const { error, rows } = await db.query(
      `UPDATE public.application
         SET project_name = COALESCE(NULLIF($2, ''), project_name),
             is_product = COALESCE($3, is_product),
             is_service = COALESCE($4, is_service),
             description = COALESCE(NULLIF($5, ''), description),
             deadlines = COALESCE(NULLIF($6, ''), deadlines),
             total_sum = COALESCE(NULLIF($7, ''), total_sum),
             file_name = COALESCE(NULLIF($8, ''), file_name),
             updated_date = timezone('Asia/Bishkek', now())
         WHERE id = $1
         RETURNING *;`,
      [
        applicationId,
        projectName,
        isProduct,
        isService,
        description,
        deadlines,
        totalSum,
        filePaths,
      ]
    );

    return error ? false : rows[0];
  } catch (error) {
    console.log("error updateApplicationData: ", error.message);
    return false;
  }
}

async function deleteApplication(id: number) {
  try {
    const { rows } = await db.query(
      `UPDATE application a 
       SET is_deleted = true,
           active = false
       WHERE a.id = $1
       RETURNING id;`,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Error deleteApplication: ", error.message);
    return false;
  }
}

async function offerList(id_application: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT u.company_name, o.* FROM offer o join "user" u USing(id_user) WHERE o.id_application = $1 AND o.active = true AND o.is_winner = false;`,
      [id_application]
    );
    return error ? false : rows;
  } catch (error) {
    console.error("Error offerList: ", error.message);
    return false;
  }
}

async function offerCount(id_application: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT count(*) FROM offer o 
       WHERE id_application = $1
       AND o.active = true 
       AND o.is_winner = false;`,
      [id_application]
    );
    return error ? false : rows[0].count;
  } catch (error) {
    console.error("Error offerCount: ", error.message);
    return false;
  }
}

async function getOfferById(id_offer: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT u.company_name, u.bin, o.* FROM offer o JOIN "user" u USING(id_user) WHERE o.id_offer = $1 AND o.active = true;`,
      [id_offer]
    );
    return error ? false : rows;
  } catch (error) {
    console.error("Error getOfferById: ", error.message);
    return false;
  }
}

async function makeToWinner(id_offer: number) {
  try {
    const { error, rows } = await db.query(
      `UPDATE public.offer
          SET is_winner = true,
              updated_date = now()
       WHERE id_offer = $1
       RETURNING *;`,
      [id_offer]
    );

    if (error || !rows.length) {
      return false;
    }

    const winnerId = rows[0].id_user;

    const notificationTitle = "Вы выиграли";
    const notificationMessage =
      "Поздравляем вас, вы выбраны победителем в тендере. Перейдите чтобы узнать больше.";
    await createNotification(winnerId, notificationTitle, notificationMessage);

    return rows;
  } catch (error) {
    console.error("Error makeToWinner: ", error.message);
    return false;
  }
}

async function createNotification(
  userId: number,
  title: string,
  message: string
) {
  try {
    const { rows } = await db.query(
      `INSERT INTO public.notifications (id_user, title, message)
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, title, message]
    );
    console.log("Notification created:", rows[0]);
  } catch (error) {
    console.error("Error creating notification: ", error.message);
  }
}

async function updateApplicationWinner(id: number) {
  try {
    const { error, rows } = await db.query(
      `UPDATE public.application
       SET has_winner = true,
           updated_date = now()
       WHERE id = $1
       RETURNING *;`,
      [id]
    );
    return error ? false : rows;
  } catch (error) {
    console.error("Error updateApplicationWinner: ", error.message);
    return false;
  }
}

async function rejectedOffer(id_offer: number) {
  try {
    const { error, rows } = await db.query(
      `UPDATE public.offer
       SET active = false,
           updated_date = now()
       WHERE id_offer = $1
       RETURNING *;`,
      [id_offer]
    );

    if (error || !rows.length) {
      return false;
    }

    const userId = rows[0].id_user;
    const notificationTitle = "Ваша заявка отклонена";
    const notificationMessage =
      "К сожалению, ваша заявка на тендер была отклонена. Спасибо за участие.";
    await createNotification(userId, notificationTitle, notificationMessage);

    return rows;
  } catch (error) {
    console.error("Error rejectedOffer: ", error.message);
    return false;
  }
}

async function getWinnerByIdApplication(id: number) {
  try {
    const { error, rows } = await db.query(
      `    SELECT 
                  a.has_winner,
                  creator.surname || ' ' || creator."name" || ' ' || creator.patronymic AS creator_fio,
                  creator.company_name AS creator_company_name,
                  a.description,
                  a.deadlines AS application_deadlines,
                  a.total_sum AS application_total_sum,
                  winner.surname || ' ' || winner."name" || ' ' || winner.patronymic AS winner_fio,
                  winner.company_name AS winner_company_name,
                  winner.email AS winner_email,
                  winner.phone AS winner_phone,
                  o.total_sum AS winner_total_sum,
                  o.deadlines AS winner_deadlines,
                  o.conditions AS winner_conditions
              FROM application a
              JOIN "user" creator ON creator.id_user = a.id_user
              LEFT JOIN offer o ON o.id_application = a.id
              LEFT JOIN "user" winner ON winner.id_user = o.id_user
              WHERE a.id = $1 AND a.active = true
              LIMIT 1;`,
      [id]
    );
    return error ? false : rows;
  } catch (error) {
    console.error("Error getWinnerByIdApplication: ", error.message);
    return false;
  }
}

async function existWinner(id_application: number) {
  try {
    const { rows } = await db.query(
      `SELECT EXISTS(SELECT 1 FROM application a WHERE a.id = $1 AND a.active = true AND a.has_winner = true LIMIT 1);`,
      [id_application]
    );
    return rows[0].exists;
  } catch (error) {
    console.log("error existWinner: ", error.message);
    return false;
  }
}

async function getIdUserByApplication(id_application: number) {
  try {
    const { rows } = await db.query(
      `SELECT id_user FROM application a WHERE a.id = $1 AND a.active = true LIMIT 1;`,
      [id_application]
    );
    return rows;
  } catch (error) {
    console.log("error getIdUserByApplication: ", error.message);
    return false;
  }
}

const ApplicationService = {
  create,
  existsProductName,
  findByIdUser,
  getApplicationById,
  updateApplicationData,
  deleteApplication,
  offerList,
  offerCount,
  getOfferById,
  makeToWinner,
  updateApplicationWinner,
  rejectedOffer,
  createNotification,
  getWinnerByIdApplication,
  existWinner,
  getIdUserByApplication,
};

export default ApplicationService;
