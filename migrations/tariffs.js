export const up = async (knex) => {
  return knex.schema.createTable("wb_tariffs", (table) => {
    table.increments("id").primary();
    table.string("warehouse_name");
    table.float("box_delivery_and_storage_expr");
    table.float("box_delivery_base");
    table.float("box_delivery_liter");
    table.float("box_storage_base");
    table.float("box_storage_liter");
    table.date("dt_next_box");
    table.date("dt_till_max");

    table.unique(["warehouse_name", "dt_next_box", "dt_till_max"]);
  });
};

export const down = async (knex) => {
  return knex.schema.dropTable("wb_tariffs");
};
