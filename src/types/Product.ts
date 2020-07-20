export class Product {
  id: string;
  supplierIds: string[];
  inventory: {
    [supplierId: string]: number;
  };
  totalInventory: number;

  constructor(id: string) {
    this.id = id;
    this.supplierIds = [];
    this.inventory = {};
    this.totalInventory = 0;
  }
}
