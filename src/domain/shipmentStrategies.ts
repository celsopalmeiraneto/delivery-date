import { ParcelEstimate, ShipmentStrategy, PurchaseOrderItem } from '../types';

const INVALID_PARCEL: ParcelEstimate = Object.freeze({
  amountAvailable: -1,
  daysToDeliver: Number.MAX_SAFE_INTEGER,
  productId: '',
  supplierId: '',
});

const filterDeliveredItems = (
  items: PurchaseOrderItem[]
): PurchaseOrderItem[] => items.filter((item) => item.amount > 0);

export const fasterDeliveryParcelsStrategy: ShipmentStrategy = (
  estimates,
  items
) => {
  const pickedParcels: ParcelEstimate[] = [];

  items.forEach((item) => {
    let pickedParcel = INVALID_PARCEL;
    const invalidDeliveryTimes: number[] = [];

    estimates.forEach((estimate) => {
      const parcel = estimate.parcels.find(
        (parcel) =>
          parcel.productId === item.productId &&
          parcel.amountAvailable >= item.amount
      );

      if (parcel && pickedParcel.daysToDeliver === parcel.daysToDeliver) {
        invalidDeliveryTimes.push(parcel.daysToDeliver);
        pickedParcel = INVALID_PARCEL;
      }

      if (
        parcel &&
        pickedParcel.daysToDeliver > parcel.daysToDeliver &&
        !invalidDeliveryTimes.includes(parcel.daysToDeliver)
      ) {
        pickedParcel = parcel;
      }
    });

    if (pickedParcel !== INVALID_PARCEL) {
      pickedParcels.push(pickedParcel);
    }
  });

  return pickedParcels;
};

export const atLeastTwoProductsStrategy: ShipmentStrategy = (
  estimates,
  items,
  shipments
) => {
  const itemsForDelivery = filterDeliveredItems(items);

  const estimatesLargerThanOneItem = estimates.filter((estimate) => {
    const itemsCount: number = estimate.parcels.reduce((acc, v) => {
      const deliverables: number = itemsForDelivery.filter(
        (it) => it.productId === v.productId && v.amountAvailable >= it.amount
      ).length;

      const delivered: number = shipments.reduce((acc, shipment) => {
        if (shipment.supplierId === v.supplierId) {
          acc += shipment.items.length;
        }
        return acc;
      }, 0);

      acc += deliverables + delivered;
      return acc;
    }, 0);

    return itemsCount > 1;
  });

  const parcels: ParcelEstimate[] = estimatesLargerThanOneItem.flatMap(
    (estimate) => estimate.parcels
  );

  return parcels.filter((parcel) => {
    return itemsForDelivery.find(
      (item) =>
        item.productId === parcel.productId &&
        item.amount <= parcel.amountAvailable
    );
  });
};

export const allInventoryOfSupplierStrategy: ShipmentStrategy = (
  estimates,
  items
) => {
  const itemsForDelivery = filterDeliveredItems(items);
  const availableParcels = estimates
    .flatMap((estimate) => estimate.parcels)
    .filter((parcel) => parcel.amountAvailable > 0)
    .sort((parcelA, parcelB) => {
      if (parcelA.amountAvailable > parcelB.amountAvailable) return 1;

      if (parcelA.amountAvailable < parcelB.amountAvailable) return -1;

      return 0;
    });

  const pickedParcels: ParcelEstimate[] = [];

  availableParcels.forEach((parcel) => {
    const item = itemsForDelivery.find(
      (item) => item.productId === parcel.productId
    );

    if (!item) return;

    const amountAlreadyPicked: number = pickedParcels.reduce((acc, picked) => {
      if (picked.productId === parcel.productId) {
        acc += picked.amountAvailable;
      }

      return acc;
    }, 0);

    if (amountAlreadyPicked >= item.amount) return;

    pickedParcels.push(parcel);
  });

  return pickedParcels;
};
