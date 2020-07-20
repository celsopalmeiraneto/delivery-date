import { SupplierProduct, ParcelEstimate } from '.';

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
