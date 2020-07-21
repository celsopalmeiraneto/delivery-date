import { jsonArray } from '../loadCsv';
import { InputError } from '../InputError';
import { Product } from '../types/Product';
import { Mapper } from '../types';

export class ProductMapper implements Mapper<Product> {
  async getById(id: string) {
    const rawData: any[] = (await jsonArray).filter(
      (i) => i.product_name === id
    );

    if (!rawData || rawData.length === 0) {
      throw new InputError(`There is not product with id ${id}.`);
    }

    const product: Product = new Product(id);

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
