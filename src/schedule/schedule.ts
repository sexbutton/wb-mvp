// src/schedule/schedule.ts
import cron from "node-cron";
import { WBService } from "../services/wb/wb.service.js";
import { WBTariffRepository } from "../db/repository/wb_tariff.repository.js";
import { GoogleSheetsRepository } from "../db/repository/google-sheets.repository.js";
import knex from "../db/db.js";
import { DataExportService } from "../services/data-export/data-export.service.js";
import { GoogleSheetsService } from "../services/google-sheets/googleSheets.service.js";
import dotenv from "dotenv";
dotenv.config();

// Инстанцируем сервисы
const wbService = new WBService();
const wbTariffRepository = new WBTariffRepository(knex);
const googleSheetsRepository = new GoogleSheetsRepository(knex);

const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
};
const googleSheetsService = new GoogleSheetsService(credentials);
const dataExportService = new DataExportService(googleSheetsRepository, wbTariffRepository, googleSheetsService);

async function updateTariffs() {
  console.log("Получение и сохранение тарифов...");
  try {
    const tariffs = await wbService.getTariffs();
    await wbTariffRepository.saveTariffs(tariffs);
    console.log("Тарифы успешно обновлены.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ошибка при обновлении тарифов:", error.message);
    } else {
      console.error("Неизвестная ошибка:", error);
    }
  }
}

async function exportDataToGoogleSheets() {
  console.log("Выгрузка данных в Google Sheets...");
  await dataExportService.exportData();
  console.log("Выгрузка завершена.");
}

// Для тестирования
(async () => {
  await updateTariffs(); // Выполнить сразу
  setTimeout(async () => {
    await exportDataToGoogleSheets();
  }, 10000);
})();

cron.schedule("0 * * * *", async () => {
  console.log("Получение и сохранение тарифов...");
  await updateTariffs(); // Выполняется каждый час
});

cron.schedule("0 * * * *", async () => {
  console.log("Выгрузка данных в Google Sheets...");
  await exportDataToGoogleSheets(); // Выполняется каждый час
});
