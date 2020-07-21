import {
  fasterDeliveryParcelsStrategy,
  atLeastTwoProductsStrategy,
  allInventoryOfSupplierStrategy,
} from './shipmentStrategies';
import { ParcelEstimate } from '../types';
import { fixtures } from './shipments.fixtures';

test('similar delivery should do nothing', () => {
  const parcels = fasterDeliveryParcelsStrategy(
    [
      {
        parcels: [fixtures.PARCEL_APPLE_F_V_COMP],
        supplierId: fixtures.FV_COMPANY,
      },
      {
        parcels: [fixtures.PARCEL_APPLE_F_COMP],
        supplierId: fixtures.F_COMPANY,
      },
    ],
    [fixtures.APPLE_PURCHASE],
    []
  );

  expect(parcels).toHaveLength(0);
});

test('the quickest supplier should be chosen', () => {
  const parcels = fasterDeliveryParcelsStrategy(
    [
      {
        parcels: [fixtures.PARCEL_ORANGE_F_V_COMP],
        supplierId: fixtures.FV_COMPANY,
      },
      {
        parcels: [fixtures.PARCEL_ORANGE_F_COMP],
        supplierId: fixtures.F_COMPANY,
      },
    ],
    [fixtures.ORANGE_PURCHASE],
    []
  );

  expect(parcels).toHaveLength(1);
  expect(parcels[0]).toMatchObject<ParcelEstimate>(
    fixtures.PARCEL_ORANGE_F_V_COMP
  );
});

test('try to use same supplier if possible', () => {
  const parcels = atLeastTwoProductsStrategy(
    [
      {
        parcels: [fixtures.PARCEL_ORANGE_F_V_COMP],
        supplierId: fixtures.FV_COMPANY,
      },
      {
        parcels: [
          fixtures.PARCEL_ORANGE_F_COMP,
          fixtures.PARCEL_STRAWBERRY_F_COMP,
        ],
        supplierId: fixtures.F_COMPANY,
      },
    ],
    [fixtures.ORANGE_PURCHASE, fixtures.STRAWBERRY_PURCHASE],
    []
  );

  expect(parcels).toHaveLength(2);
  parcels.map((p) => {
    expect(p.supplierId).toEqual(fixtures.F_COMPANY);
  });
});

test('exhaust supply of suppliers', () => {
  const parcels = allInventoryOfSupplierStrategy(
    [
      {
        parcels: [fixtures.PARCEL_ORANGE_F_V_COMP],
        supplierId: fixtures.FV_COMPANY,
      },
      {
        parcels: [fixtures.PARCEL_ORANGE_F_COMP],
        supplierId: fixtures.F_COMPANY,
      },
    ],
    [fixtures.ORANGE_LARGE_PURCHASE],
    []
  );

  expect(parcels).toHaveLength(2);
  expect(parcels[0].supplierId).toEqual(fixtures.FV_COMPANY);
});
