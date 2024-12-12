import ApplicationService from "../application/applicationService";
import db from "../utils/db";

async function createOffer(
  id_user: number,
  id_application: number,
  total_sum: string,
  deadlines: string,
  conditions: string
) {
  try {
    const { error, rows } = await db.query(
      `INSERT INTO offer(id_user, id_application, total_sum, deadlines, conditions)
       VALUES($1, $2, $3, $4, $5)
       RETURNING *;`,
      [id_user, id_application, total_sum, deadlines, conditions]
    );
    if (error || !rows.length) {
      return false;
    }

    const idApplication = id_application;
    const receiverId = await ApplicationService.getIdUserByApplication(
      idApplication
    );
    const notificationTitle = "Новая заявка";
    const notificationMessage =
      "По вашему тендеру пришла новая заявка, ознакомьтесь.";
    if (receiverId)
      await ApplicationService.createNotification(
        receiverId[0].id_user,
        notificationTitle,
        notificationMessage
      );

    return rows;
  } catch (error) {
    console.log("error createOffer: ", error.message);
    return false;
  }
}

async function getAllTender() {
  try {
    const { error, rows } = await db.query(
      `SELECT * FROM application a WHERE a.active = true AND a.is_deleted = false ORDER BY created_date DESC;`,
      []
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error getAllTender: ", error.message);
    return false;
  }
}

async function getTenderById(id_user: number, id: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT 
        TRIM(u.surname || ' ' || u.name || ' ' || COALESCE(u.patronymic, '')) AS full_name,
        u.company_name,
        a.id,
        a.id_user,
        a.project_name,
        a.is_product,
        a.is_service,
        a.description,
        a.deadlines,
        a.total_sum,
        a.created_date,
        a.updated_date,
        a.active,
        a.is_deleted,
        a.file_name,
        COALESCE(
          (SELECT 1 FROM favourites f WHERE f.id_user = $1 AND f.id_application = a.id LIMIT 1),
          NULL
        ) IS NOT NULL AS is_favorites,
        a.has_winner
      FROM application a
      JOIN "user" u USING(id_user)
      WHERE a.id = $2`,
      [id_user, id]
    );

    return error
      ? false
      : {
          ...rows[0],
          file_name: `http://195.49.215.146/uploads/file-${rows[0].file_name}`,
        };
    // return error ? false : rows;
  } catch (error) {
    console.log("error getTenderById: ", error.message);
    return false;
  }
}

async function makeToFavourite(id_user: number, id: number) {
  try {
    const { error, rows } = await db.query(
      `INSERT INTO public.favourites (id_user, id_application)
       VALUES ($1, $2)
       RETURNING id_user;`,
      [id_user, id]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error makeToFavourite: ", error.message);
    return false;
  }
}

async function deleteToFavourite(id_user: number, id: number) {
  try {
    const { error, rows } = await db.query(
      `DELETE FROM public.favourites
       WHERE id_user = $1 AND id_application = $2
       RETURNING id_user;`,
      [id_user, id]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error deleteToFavourite: ", error.message);
    return false;
  }
}

async function favouritesList(id_user: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT * FROM favourites f JOIN application a ON a.id = f.id_application WHERE f.id_user = $1 ORDER BY f.id DESC`,
      [id_user]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error favouritesList: ", error.message);
    return false;
  }
}

async function getUserNotifications(id_user: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT *
       FROM notifications 
       WHERE id_user = $1 ORDER BY created_at DESC`,
      [id_user]
    );
    return error ? false : rows;
  } catch (error) {
    console.error("Error fetching user notifications: ", error.message);
    return false;
  }
}

async function markAsRead(id_notification: number) {
  try {
    const { rows } = await db.query(
      `UPDATE notifications
       SET is_read = true, updated_at = CURRENT_TIMESTAMP
       WHERE id_notification = $1 RETURNING *`,
      [id_notification]
    );
    return rows[0];
  } catch (error) {
    console.error("Error marking notification as read: ", error.message);
    throw error;
  }
}

async function isOfferExists(id_user: number, id_application: number) {
  try {
    const { rows } = await db.query(
      `SELECT EXISTS(SELECT 1 FROM offer WHERE id_user = $1 AND id_application = $2 AND active = true LIMIT 1)`,
      [id_user, id_application]
    );
    return rows[0].exists;
  } catch (error) {
    console.log("error isOfferExists: ", error.message);
    return false;
  }
}

async function isWinnerExist(id_application: number) {
  try {
    const { rows } = await db.query(
      `SELECT EXISTS(SELECT 1 FROM application a WHERE id = $1 AND active = true AND has_winner = true LIMIT 1)`,
      [id_application]
    );
    return rows[0].exists;
  } catch (error) {
    console.log("error isWinnerExist: ", error.message);
    return false;
  }
}

async function getAllOfferByIdUser(id_user: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT * FROM offer o WHERE o.id_user = $1`,
      [id_user]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error getAllOfferByIdUser: ", error.message);
    return false;
  }
}

async function existOffer(id_user: number, id_application: number) {
  try {
    const { rows } = await db.query(
      `SELECT EXISTS(SELECT 1 FROM offer o WHERE id_user = $1 AND id_application = $2 AND active = true LIMIT 1);`,
      [id_user, id_application]
    );
    return rows[0].exists;
  } catch (error) {
    console.log("error existOffer: ", error.message);
    return false;
  }
}

async function getTender(id_user: number, id: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT 
        TRIM(u.surname || ' ' || u.name || ' ' || COALESCE(u.patronymic, '')) AS full_name,
        u.company_name,
        a.id,
        a.id_user,
        a.project_name,
        a.is_product,
        a.is_service,
        a.description,
        a.deadlines,
        a.total_sum,
        a.created_date,
        a.updated_date,
        false AS active,
        a.is_deleted,
        a.file_name,
        COALESCE(
          (SELECT 1 FROM favourites f WHERE f.id_user = $1 AND f.id_application = a.id LIMIT 1),
          NULL
        ) IS NOT NULL AS is_favorites,
        a.has_winner
      FROM application a
      JOIN "user" u USING(id_user)
      WHERE a.id = $2`,
      [id_user, id]
    );

    return error
      ? false
      : {
          ...rows[0],
          file_name: rows[0].file_name
            ? `http://195.49.215.146/uploads/file-${rows[0].file_name}`
            : null,
        };
  } catch (error) {
    console.log("error getTender: ", error.message);
    return false;
  }
}

async function myOfferList(id_user: number) {
  try {
    const { error, rows } = await db.query(
      `SELECT o.is_winner , o.id_offer, a.* FROM offer o 
        LEFT JOIN application a ON a.id = o.id_application 
        WHERE o.id_user = $1 AND o.active = true;`,
      [id_user]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error myOfferList: ", error.message);
    return false;
  }
}

async function offerNotWinnerById(id_offer: number, id_user: number) {
  try {
    const { error, rows } = await db.query(
      `       SELECT 
                  o.is_winner,
                  creator.surname || ' ' || creator."name" || ' ' || creator.patronymic AS creator_fio,
                  creator.company_name AS creator_company_name,
                  a.description,
                  a.deadlines AS application_deadlines,
                  a.total_sum AS application_total_sum
              FROM offer o
              JOIN "user" creator ON creator.id_user = o.id_user
              LEFT JOIN application a ON o.id_application = a.id
              WHERE o.id_offer = $1 and o.id_user = $2 AND o.active = true
              LIMIT 1;`,
      [id_offer, id_user]
    );
    return error ? false : rows[0];
  } catch (error) {
    console.error("Error offerNotWinnerById: ", error.message);
    return false;
  }
}

async function offerById(id_offer: number, id_user: number) {
  try {
    const { error, rows } = await db.query(
      `        SELECT 
                  o.is_winner,
                  creator.surname || ' ' || creator."name" || ' ' || creator.patronymic AS creator_fio,
                  creator.company_name AS creator_company_name,
                  a.description,
                  a.deadlines AS application_deadlines,
                  a.total_sum AS application_total_sum,
                  customer.email AS customer_email,
                  customer.phone AS customer_phone
              FROM offer o
              JOIN "user" creator ON creator.id_user = o.id_user
              LEFT JOIN application a ON o.id_application = a.id
              left join "user" customer on customer.id_user = a.id_user 
              WHERE o.id_offer = $1 and o.id_user = $2 AND o.active = true
              LIMIT 1;`,
      [id_offer, id_user]
    );
    return error ? false : rows[0];
  } catch (error) {
    console.error("Error offerById: ", error.message);
    return false;
  }
}

async function existWinner(id_offer: number) {
  try {
    const { rows } = await db.query(
      `SELECT EXISTS(SELECT 1 FROM offer o WHERE o.id_offer = $1 AND o.active = true AND o.is_winner = true LIMIT 1);`,
      [id_offer]
    );
    return rows[0].exists;
  } catch (error) {
    console.log("error existWinner: ", error.message);
    return false;
  }
}

async function getOfferByIdUserAndApp(id_user: number, id_application: number) {
  try {
    const { rows } = await db.query(
      `SELECT id_offer FROM offer o WHERE o.id_user = $1 and o.id_application = $2 AND o.active = true LIMIT 1;`,
      [id_user, id_application]
    );
    return rows[0];
  } catch (error) {
    console.log("error getOfferByIdUserAndApp: ", error.message);
    return false;
  }
}

const ExecutorService = {
  createOffer,
  getAllTender,
  getTenderById,
  makeToFavourite,
  deleteToFavourite,
  favouritesList,
  getUserNotifications,
  markAsRead,
  isOfferExists,
  isWinnerExist,
  getAllOfferByIdUser,
  existOffer,
  getTender,
  myOfferList,
  offerNotWinnerById,
  offerById,
  existWinner,
  getOfferByIdUserAndApp,
  
};
export default ExecutorService;
