import { Knex } from "knex";
import { TariffData, Warehouse } from "../../services/wb/tariff.interface"; // Подключаем интерфейсы

export class WBTariffRepository {
  private knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getSortedTariffs() {
    return this.knex("wb_tariffs")
      .select(
        "warehouse_name",
        "box_delivery_and_storage_expr",
        "box_delivery_base",
        "box_delivery_liter",
        "box_storage_base",
        "box_storage_liter",
        "dt_next_box",
        "dt_till_max",
      )
      .orderBy("box_delivery_and_storage_expr", "asc"); // сортировка по коэффициенту
  }

  /**
   * Функция для сохранения тарифов в базу данных с обновлением данных за текущий день
   * @param tariffs Данные тарифов
   */
  async saveTariffs(tariffs: TariffData): Promise<void> {
    const { dtNextBox, dtTillMax, warehouseList } = tariffs;

    const cleanedDtNextBox = dtNextBox.trim() === "" ? null : dtNextBox;
    const cleanedDtTillMax = dtTillMax.trim() === "" ? null : dtTillMax;

    // Преобразуем список складов в формат для вставки
    const dataToInsert = warehouseList.map((warehouse: Warehouse) => ({
      warehouse_name: warehouse.warehouseName,
      box_delivery_and_storage_expr: parseFloat(warehouse.boxDeliveryAndStorageExpr),
      box_delivery_base: parseFloat(warehouse.boxDeliveryBase),
      box_delivery_liter: parseFloat(warehouse.boxDeliveryLiter),
      box_storage_base: warehouse.boxStorageBase === "-" ? null : parseFloat(warehouse.boxStorageBase), // если "-" заменяем на null
      box_storage_liter: warehouse.boxStorageLiter === "-" ? null : parseFloat(warehouse.boxStorageLiter), // если "-" заменяем на null
      dt_next_box: cleanedDtNextBox, // Используем очищенные даты
      dt_till_max: cleanedDtTillMax, // Используем очищенные даты
    }));

    try {
      // Проверяем наличие записи с таким же dt_till_max
      const existingRecords = await this.knex("wb_tariffs").where("dt_till_max", cleanedDtTillMax).select("id", "warehouse_name");

      if (existingRecords.length > 0) {
        // Если запись найдена, то обновляем только необходимые данные
        for (const record of existingRecords) {
          const updatedData = dataToInsert.find((item) => item.warehouse_name === record.warehouse_name);

          if (updatedData) {
            await this.knex("wb_tariffs").where("id", record.id).update(updatedData); // Обновляем запись
          }
        }
      } else {
        // Если записи нет, то вставляем новые данные
        await this.knex("wb_tariffs")
          .insert(dataToInsert)
          .onConflict(["warehouse_name", "dt_next_box", "dt_till_max"]) // Указываем уникальные поля
          .merge(); // Обновляем данные, если они уже есть

        console.log("Тарифы успешно сохранены.");
      }
    } catch (error) {
      throw new Error("Не удалось сохранить тарифы: " + error);
    }
  }
}
