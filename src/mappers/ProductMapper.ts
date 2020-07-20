import { jsonArray } from '../loadCsv';
import { InputError } from '../InputError';
import { Product } from '../types';

export class ProductMapper {
  static async getProduct(id: string): Promise<Product> {
    const rawData: any[] = (await jsonArray).filter(
      (i) => i.product_name === id
    );

    if (!rawData || rawData.length === 0) {
      throw new InputError(`There is not product with id ${id}.`);
    }

    const product: Product = {
      id,
      supplierIds: [],
      inventory: {},
      totalInventory: 0,
    };

    rawData.forEach((rawLine) => {
      if (!product.inventory[rawLine.supplier]) {
        product.inventory[rawLine.supplier] = 0;
        product.supplierIds.push(rawLine.supplier);
      }

      product.inventory[rawLine.supplier] += rawLine.in_stock;
      product.totalInventory += rawLine.in_stock;
    });

    return product;
  }
}
