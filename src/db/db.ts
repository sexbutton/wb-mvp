// src/db/db.ts
import knex from "knex";
import { DbConfig } from "./interfaces";
import dotenv from "dotenv";
dotenv.config();

const dbConfig: DbConfig = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "youruser",
    password: process.env.DB_PASS || "yourpassword",
    database: process.env.DB_NAME || "wb_mvp_db",
    port: Number(process.env.DB_PORT) || 5432,
  },
};

const db = knex(dbConfig);
export default db;
