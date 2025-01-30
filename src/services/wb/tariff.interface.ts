export interface Warehouse {
  boxDeliveryAndStorageExpr: string;
  boxDeliveryBase: string;
  boxDeliveryLiter: string;
  boxStorageBase: string;
  boxStorageLiter: string;
  warehouseName: string;
}

export interface TariffData {
  dtNextBox: string;
  dtTillMax: string;
  warehouseList: Warehouse[];
}

export interface TariffResponse {
  response: {
    data: TariffData;
  };
}
