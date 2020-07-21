import { ProductMapper } from '../mappers/ProductMapper';
import { InputError } from '../InputError';
import { SupplierMapper } from '../mappers/SupplierMapper';
import {
  PurchaseOrderItem,
  PurchaseOrderShipment,
  SupplierEstimate,
} from '../types';
import { getShipmentsFromEstimates } from './shipments';
import moment from 'moment';
import { Product } from '../types/Product';

const groupItemsByProduct = (
  items: PurchaseOrderItem[]
): PurchaseOrderItem[] => {
  return items.reduce<PurchaseOrderItem[]>((acc, item) => {
    const itemIndex = acc.findIndex(
      (itemInAcc) => itemInAcc.productId === item.productId
    );

    if (itemIndex >= 0) {
      acc[itemIndex].amount += item.amount;
    } else {
      acc.push({ ...item });
    }

    return acc;
  }, []);
};

const getProductsOfOrderAndCheckInventory = async (
  items: PurchaseOrderItem[]
) => {
  return await Promise.all(
    items.map(async (item) => {
      const product = await new ProductMapper().getById(item.productId);

      if (product.totalInventory < item.amount) {
        throw new InputError(
          `There not enough inventory of product ${item.productId}`
        );
      }

      return product;
    })
  );
};

const groupProductsBySupplier = (
  products: Product[]
): {
  [supplierId: string]: Product[];
} => {
  return products.reduce<{
    [supplierId: string]: Product[];
  }>((acc, product) => {
    product.supplierIds.forEach((supplierId) => {
      if (!acc[supplierId]) {
        acc[supplierId] = [];
      }

      acc[supplierId].push(product);
    });
    return acc;
  }, {});
};

const getEstimates = async (
  productsBySupplier: any,
  deliveryRegion: string
): Promise<SupplierEstimate[]> => {
  return Promise.all(
    Object.entries(productsBySupplier).map(async ([supplierId, products]) => {
      const supplier = await new SupplierMapper().getById(supplierId);

      return {
        supplierId,
        parcels: supplier.getEstimateForProducts(
          (products as Product[]).map((p) => p.id),
          deliveryRegion
        ),
      };
    })
  );
};

export const createPurchaseOrder = async (
  deliveryRegion: string,
  items: PurchaseOrderItem[]
): Promise<PurchaseOrderShipment> => {
  const shipmentInfo: PurchaseOrderShipment = {
    deliveryDate: new Date(),
    shipments: [],
  };

  const itemsGroupedByProduct: PurchaseOrderItem[] = groupItemsByProduct(items);

  const products: Product[] = await getProductsOfOrderAndCheckInventory(
    itemsGroupedByProduct
  );

  const productsBySupplier = groupProductsBySupplier(products);

  const estimates = await getEstimates(productsBySupplier, deliveryRegion);

  shipmentInfo.shipments = getShipmentsFromEstimates(
    estimates,
    itemsGroupedByProduct
  );

  shipmentInfo.deliveryDate = moment
    .max(shipmentInfo.shipments.map((s) => moment(s.deliveryDate)))
    .toDate();

  return shipmentInfo;
};
