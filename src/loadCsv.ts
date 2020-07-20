import csv from 'csvtojson';

const csvFilePath: string = './mocks/db.csv';

export const jsonArray: Promise<any[]> = (async () => {
  return csv({
    quote: "'",
  }).fromFile(csvFilePath);
})();
