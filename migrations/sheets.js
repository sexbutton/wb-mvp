export const up = async (knex) => {
  await knex.schema.createTable("google_sheets", (table) => {
    table.increments("id").primary();
    table.text("spreadsheet_id").notNullable();
    table.text("sheet_name").defaultTo("stocks_coefs");
    table.boolean("active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // Вставка данных в таблицу google_sheets
  await knex("google_sheets").insert([
    {
      spreadsheet_id: "1hMAGi983ybwnAiwGKI7XPWohdCSzJ76seHtqQW8kqig",
      sheet_name: "stocks_coefs",
      active: true,
    },
    {
      spreadsheet_id: "1sOP9RoG4tEmI1mqRvhtsQ_N4cF_SuvFaEP-Cr_20ZhI",
      sheet_name: "stocks_coefs",
      active: true,
    },
    {
      spreadsheet_id: "1J3dTLTyQkNJOQwXxErkptRcEsRE5dGUhUa2A-I9fs9c",
      sheet_name: "stocks_coefs",
      active: true,
    },
  ]);
};

export const down = async (knex) => {
  await knex.schema.dropTable("google_sheets");
};
