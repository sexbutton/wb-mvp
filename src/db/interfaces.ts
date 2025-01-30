// src/db/interfaces.ts
export interface DbConfig {
  client: string;
  connection: {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
  };
}
