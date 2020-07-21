import { fixtures } from './shipments.fixtures';
import { getShipmentsFromEstimates } from './shipments';
import moment from 'moment';

test('the delivery date is always the greatest', () => {
  const shipments = getShipmentsFromEstimates(
    [
      {
        parcels: [
          fixtures.PARCEL_APPLE_F_V_COMP,
          fixtures.PARCEL_ORANGE_F_V_COMP,
        ],
        supplierId: fixtures.FV_COMPANY,
      },
    ],
    [fixtures.ORANGE_PURCHASE, fixtures.APPLE_PURCHASE]
  );

  expect(shipments.length).toBeGreaterThan(0);
  expect(
    moment(shipments[0].deliveryDate).isSame(moment().add(3, 'days'), 'day')
  );
});
