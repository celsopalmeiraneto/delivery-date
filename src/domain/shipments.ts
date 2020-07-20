import {
  ParcelEstimate,
  SupplierEstimate,
  PurchaseOrderItem,
  Shipment,
  ShipmentStrategy,
} from '../types';
import moment from 'moment';
import {
  fasterDeliveryParcelsStrategy,
  atLeastTwoProductsStrategy,
  allInventoryOfSupplierStrategy,
} from './shipmentStrategies';

const SHIPMENT_STRATEGIES_ORDERED: ShipmentStrategy[] = [
  fasterDeliveryParcelsStrategy,
  atLeastTwoProductsStrategy,
  allInventoryOfSupplierStrategy,
];

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
  const shipments: Shipment[] = [];

  SHIPMENT_STRATEGIES_ORDERED.forEach((strategy) => {
    const chosenParcels = strategy(estimates, items, shipments);
    addToShipmentsAndSubtractFromItems(chosenParcels, shipments, items);
  });

  return shipments;
};
