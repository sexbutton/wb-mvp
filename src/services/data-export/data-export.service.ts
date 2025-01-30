import { GoogleSheetsRepository } from "../../db/repository/google-sheets.repository";
import { WBTariffRepository } from "../../db/repository/wb_tariff.repository";
import { GoogleSheetsService } from "../google-sheets/googleSheets.service";

export class DataExportService {
  constructor(
    private googleSheetsRepo: GoogleSheetsRepository,
    private wbTariffRepo: WBTariffRepository,
    private googleSheetsService: GoogleSheetsService,
  ) {}

  async exportData() {
    const sheets = await this.googleSheetsRepo.getActiveSpreadsheets();
    const tariffs = await this.wbTariffRepo.getSortedTariffs();

    const formattedData = [
      [
        "Склад",
        "Доставка + Хранение",
        "Доставка (База)",
        "Доставка (Литр)",
        "Хранение (База)",
        "Хранение (Литр)",
        "Дата начала следующего тарифа",
        "Дата окончания последнего установленного тарифа",
      ],
      ...tariffs.map((t) => [
        t.warehouse_name,
        t.box_delivery_and_storage_expr,
        t.box_delivery_base,
        t.box_delivery_liter,
        t.box_storage_base,
        t.box_storage_liter,
        t.dt_next_box,
        t.dt_till_max,
      ]),
    ];

    for (const { spreadsheet_id, sheet_name } of sheets) {
      await this.googleSheetsService.updateSheet(spreadsheet_id, sheet_name, formattedData);
    }
  }
}
