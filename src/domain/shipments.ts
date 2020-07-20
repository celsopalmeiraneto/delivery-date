import {
  ShipmentStrategy,
  PurchaseOrderShipment,
  ParcelEstimate,
  SupplierEstimate,
  PurchaseOrderItem,
  Shipment,
} from '../types';
import moment from 'moment';

const INVALID_PARCEL: ParcelEstimate = Object.freeze({
  amountAvailable: -1,
  daysToDeliver: Number.MAX_SAFE_INTEGER,
  productId: '',
  supplierId: '',
});

const singleSupplierStrategy = (
  estimates: SupplierEstimate[],
  items: PurchaseOrderItem[]
): PurchaseOrderShipment['shipments'] => {
  const estimate = estimates[0];

  const maxDaysToDeliver: number = Math.max(
    ...estimate.parcels.map((p) => p.daysToDeliver)
  );

  return [
    {
      deliveryDate: moment().add(maxDaysToDeliver, 'days').toDate(),
      supplierId: estimate.supplierId,
      items: estimate.parcels.map((parcel) => ({
        amount:
          items.find((i) => i.productId === parcel.productId)?.amount || 0,
        productId: parcel.productId,
      })),
    },
  ];
};

const fasterDeliveryParcelsStrategy: ShipmentStrategy = (estimates, items) => {
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

const leastShipmentsStrategy: ShipmentStrategy = (estimates, items) => {
  return [];
};

const addParcelToShipment = (
  shipment: Shipment,
  parcel: ParcelEstimate,
  item: PurchaseOrderItem
): number => {
  const shipmentItem = shipment.items.find(
    (item) => item.productId === parcel.productId
  );

  const amountToAdd =
    item.amount <= parcel.amountAvailable
      ? item.amount
      : parcel.amountAvailable;

  if (shipmentItem) {
    shipmentItem.amount += amountToAdd;
  } else {
    shipment.items.push({
      amount: amountToAdd,
      productId: item.productId,
    });
  }

  return amountToAdd;
};

const addToShipmentsAndSubtractFromItems = (
  parcels: ParcelEstimate[],
  shipments: Shipment[],
  items: PurchaseOrderItem[]
) => {
  parcels.forEach((parcel) => {
    let shipment = shipments.find(
      (shipment) => shipment.supplierId === parcel.supplierId
    );

    const item = items.find((item) => item.productId === parcel.productId);

    if (!item) return;

    if (!shipment) {
      shipment = {
        deliveryDate: moment().add(parcel.daysToDeliver, 'days').toDate(),
        items: [],
        supplierId: parcel.supplierId,
      };
      shipments.push(shipment);
    }

    const addedAmount = addParcelToShipment(shipment, parcel, item);
    item.amount -= addedAmount;
    parcel.amountAvailable -= addedAmount;
  });
};

export const getShipmentsFromEstimates = (
  estimates: SupplierEstimate[],
  items: PurchaseOrderItem[]
): Shipment[] => {
  if (estimates.length === 1) {
    return singleSupplierStrategy(estimates, items);
  }

  const shipments: Shipment[] = [];

  const parcels = fasterDeliveryParcelsStrategy(estimates, items);
  addToShipmentsAndSubtractFromItems(parcels, shipments, items);

  return shipments;
};
