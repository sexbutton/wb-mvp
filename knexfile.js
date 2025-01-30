// knexfile.js
import dotenv from "dotenv";
dotenv.config();

export default {
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "youruser",
    password: process.env.DB_PASS || "yourpassword",
    database: process.env.DB_NAME || "wb_mvp_db",
    port: Number(process.env.DB_PORT) || 5432,
  },
  migrations: {
    directory: "./migrations", // Указываем директорию скомпилированных миграций
    tableName: "knex_migrations",
  },
};
