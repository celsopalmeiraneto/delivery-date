import { jsonArray } from '../loadCsv';
import { InputError } from '../InputError';
import { ParcelEstimate, SupplierProduct } from '../types';

export class Supplier {
  id: string;
  products: {
    [productId: string]: SupplierProduct;
  };

  constructor(id: string) {
    this.id = id;
    this.products = {};
  }

  getEstimateForProducts(
    productsIds: string[],
    region: string
  ): ParcelEstimate[] {
    return productsIds
      .map<ParcelEstimate>((productId) => {
        const product: SupplierProduct | undefined = this.products[productId];

        return {
          productId,
          amountAvailable: product ? product.inventory : -1,
          daysToDeliver: product ? product.timings[region] : -1,
          supplierId: this.id,
        };
      })
      .filter(
        (estimate) => estimate.amountAvailable > 0 && estimate.daysToDeliver > 0
      );
  }
}

export class SupplierMapper {
  static async getSupplier(id: string): Promise<Supplier> {
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
