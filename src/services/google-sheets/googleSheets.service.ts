import { google } from "googleapis";
import { JWT } from "google-auth-library";

export class GoogleSheetsService {
  private sheets;

  constructor(private credentials: any) {
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    this.sheets = google.sheets({ version: "v4", auth });
  }

  async updateSheet(spreadsheetId: string, sheetName: string, data: any[][]) {
    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: data },
    });
  }
}
