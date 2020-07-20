export type ParcelEstimate = {
  productId: string;
  daysToDeliver: number;
  amountAvailable: number;
  supplierId: string;
};

export type PurchaseOrderItem = {
  productId: string;
  amount: number;
};

export type PurchaseOrderShipment = {
  deliveryDate: Date;
  shipments: Shipment[];
};

export type Shipment = {
  supplierId: string;
  deliveryDate: Date;
  items: PurchaseOrderItem[];
};

export type SupplierEstimate = {
  supplierId: string;
  parcels: ParcelEstimate[];
};

export type SupplierProduct = {
  timings: {
    [regionId: string]: number;
  };
  inventory: number;
};

export interface ShipmentStrategy {
  (
    estimates: SupplierEstimate[],
    items: PurchaseOrderItem[],
    shipments: Shipment[]
  ): ParcelEstimate[];
}
