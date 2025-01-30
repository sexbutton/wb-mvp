import { Knex } from "knex";

export class GoogleSheetsRepository {
  private knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async getActiveSpreadsheets(): Promise<{ spreadsheet_id: string; sheet_name: string }[]> {
    return this.knex("google_sheets").select("spreadsheet_id", "sheet_name").where("active", true);
  }

  async addSpreadsheet(spreadsheetId: string, sheetName = "stocks_coefs"): Promise<number> {
    const [id] = await this.knex("google_sheets").insert({ spreadsheet_id: spreadsheetId, sheet_name: sheetName }).returning("id");
    return id;
  }

  async updateSpreadsheet(id: number, data: Partial<{ spreadsheet_id: string; sheet_name: string; active: boolean }>): Promise<void> {
    await this.knex("google_sheets")
      .where({ id })
      .update({ ...data, updated_at: this.knex.fn.now() });
  }

  async deleteSpreadsheet(id: number): Promise<void> {
    await this.knex("google_sheets").where({ id }).del();
  }
}
