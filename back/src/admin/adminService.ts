import db from "../utils/db";

async function getAllUser() {
  try {
    const { error, rows } = await db.query(
      `SELECT *
                FROM public."user"
                WHERE active_email = true
                AND id_user != 39
                ORDER BY 
                id_user DESC;`,
      []
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error getAllUser: ", error.message);
    return false;
  }
}

async function confirmUser(id_user: number) {
  try {
    const { error, rows } = await db.query(
      `UPDATE "user" SET active = true WHERE id_user = $1 RETURNING *`,
      [id_user]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error confirmUser: ", error.message);
    return false;
  }
}

async function deleteUser(id_user: number) {
  try {
    const { error, rows } = await db.query(
      `UPDATE "user" SET active = false WHERE id_user = $1 RETURNING *`,
      [id_user]
    );
    return error ? false : rows;
  } catch (error) {
    console.log("error deleteUser: ", error.message);
    return false;
  }
}

const AdminService = {
  getAllUser,
  confirmUser,
  deleteUser,
};

export default AdminService;
