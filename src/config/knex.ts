// knexfile.ts
import { Knex } from "knex";

const config: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "youruser",
    password: process.env.DB_PASS || "yourpassword",
    database: process.env.DB_NAME || "wb_mvp_db",
    port: Number(process.env.DB_PORT) || 5432,
  },
  migrations: {
    directory: "../db/migrations",
    tableName: "knex_migrations",
  },
};

export default config;
