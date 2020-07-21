import { jsonArray } from '../loadCsv';
import { InputError } from '../InputError';
import { Supplier } from '../types/Supplier';
import { Mapper } from '../types';

export class SupplierMapper implements Mapper<Supplier> {
  async getById(id: string) {
    const rawData: any[] = (await jsonArray).filter((i) => i.supplier === id);

    if (!rawData) throw new InputError(`There is no supplier with id ${id}.`);

    const supplier: Supplier = new Supplier(id);

    rawData.forEach((rawLine) => {
      supplier.products[rawLine.product_name] = {
        timings: JSON.parse(rawLine.delivery_times),
        inventory: Number.parseInt(rawLine.in_stock),
      };
    });

    return supplier;
  }
}
