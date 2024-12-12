import { Pool, PoolClient  } from "pg";
import Config from "./config";

const pool = new Pool({
  host: Config.DBSERVER,
  port: Number(Config.DBPORT),
  database: Config.DBNAME,
  user: Config.DBUSER,
  password: Config.DBPASS,
  max: Number(Config.DBPG_MAX_CONNECTIONS),
  idleTimeoutMillis: Number(Config.DBPG_IDLETIMEOUTMILLLIS),
  connectionTimeoutMillis: Number(Config.DBPG_CONNECTIONTIMEOUTMILLES),
});

export const db = pool;

async function connectionCheck() {
  try {
    return pool
      .query("select 1 as answer;", [])
      .then((res) => {
        console.log(
          "Connected to PG=>",
          res.rows[0] && res.rows[0].answer == 1
        );
      })
      .catch((err) => {
        console.error("Error executing query: ", err.stack);
        throw new Error(err);
      });
  } catch (err) {
    return { rows: [], rowCount: 0, error: err.message };
  }
}

async function query(text: string, params: any[]) {
  try {
    if (Config.NODE_ENV === "development") {
      console.log("PG query: ", { text, params });
    }
    const { rows, rowCount, command } = await pool.query(text, params);
    return { rows, rowCount, error: false, command };
  } catch (err) {
    console.log("PG ERROR=>", err);
    console.log("PG query: ", { text, params });
    return { rows: [], rowCount: 0, error: err.message };
  }
}

async function transaction(operations: (client: PoolClient) => Promise<any>) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Начинаем транзакцию
    const result = await operations(client); // Выполняем переданные операции
    await client.query('COMMIT'); // Подтверждаем транзакцию
    return result;
  } catch (error) {
    await client.query('ROLLBACK'); // Откатываем транзакцию в случае ошибки
    throw error; // Пробрасываем ошибку дальше
  } finally {
    client.release(); // Освобождаем клиент
  }
}

export { connectionCheck, transaction };
export default { query };
