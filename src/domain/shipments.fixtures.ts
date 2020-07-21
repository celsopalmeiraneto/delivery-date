import { PurchaseOrderItem, ParcelEstimate } from '../types';

const FV_COMPANY: string = 'Fruit and Veggies Company';
const F_COMPANY: string = 'Just Fruits Company';

const ORANGE_PURCHASE: PurchaseOrderItem = {
  amount: 5,
  productId: 'Oranges',
};

const ORANGE_LARGE_PURCHASE: PurchaseOrderItem = {
  amount: 15,
  productId: 'Oranges',
};

const APPLE_PURCHASE: PurchaseOrderItem = {
  amount: 5,
  productId: 'Apples',
};

const STRAWBERRY_PURCHASE: PurchaseOrderItem = {
  amount: 1,
  productId: 'Strawberries',
};

const PARCEL_ORANGE_F_V_COMP: ParcelEstimate = {
  amountAvailable: 10,
  daysToDeliver: 2,
  productId: 'Oranges',
  supplierId: FV_COMPANY,
};

const PARCEL_STRAWBERRY_F_COMP: ParcelEstimate = {
  amountAvailable: 10,
  daysToDeliver: 5,
  productId: 'Strawberries',
  supplierId: F_COMPANY,
};

const PARCEL_ORANGE_F_COMP: ParcelEstimate = {
  amountAvailable: 19,
  daysToDeliver: 5,
  productId: 'Oranges',
  supplierId: F_COMPANY,
};

const PARCEL_APPLE_F_V_COMP: ParcelEstimate = {
  amountAvailable: 10,
  daysToDeliver: 3,
  productId: 'Apples',
  supplierId: FV_COMPANY,
};

const PARCEL_APPLE_F_COMP: ParcelEstimate = {
  amountAvailable: 10,
  daysToDeliver: 3,
  productId: 'Apples',
  supplierId: F_COMPANY,
};

export const fixtures = {
  FV_COMPANY,
  F_COMPANY,
  ORANGE_PURCHASE,
  APPLE_PURCHASE,
  STRAWBERRY_PURCHASE,
  PARCEL_ORANGE_F_V_COMP,
  PARCEL_ORANGE_F_COMP,
  PARCEL_APPLE_F_V_COMP,
  PARCEL_APPLE_F_COMP,
  PARCEL_STRAWBERRY_F_COMP,
  ORANGE_LARGE_PURCHASE,
};
