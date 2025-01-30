import axios, { AxiosError } from "axios";
import { TariffResponse, Warehouse, TariffData } from "./tariff.interface";
import dotenv from "dotenv";
dotenv.config();

export class WBService {
  private readonly WB_API_URL = process.env.URL_WB || "";
  private readonly WB_API_KEY = process.env.TOKEN_WB;

  async getTariffs(): Promise<TariffData> {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await axios.get(this.WB_API_URL, {
        headers: {
          Authorization: `${this.WB_API_KEY}`,
        },
        params: {
          date: today,
        },
      });

      const result: TariffData = response.data.response.data;
      return result;
    } catch (error) {
      const err = error as AxiosError;
      throw new Error(`Не удалось получить тарифы коробов: ${err.message}`);
    }
  }
}
