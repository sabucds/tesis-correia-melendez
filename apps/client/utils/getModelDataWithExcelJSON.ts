import { ModelInitialData } from '../models';

export function getModelDataWithExcelJSON(excelJSON: Array<any>) {
  const data: ModelInitialData = {
    totalBudget: null,
    factories: [],
    products: [],
    clients: [],
    locations: [],
    assignationClientLocationCost: [],
    selectionLocationCost: [],
    shippingFactoryLocationProductCost: [],
    totalClientDemand: [],
    productClientDemand: [],
    locationCapacity: [],
    factoryProductCapacity: [],
  };
  // get primary data (clients, factories, locations, products)
  excelJSON.forEach((row, i) => {
    if (i === 0) return; // skip first row because it's the header
    Object.keys(row).forEach((key) => {
      if (key === '__EMPTY')
        data.factories.push({
          name: row[key],
          id: `f${data.factories.length + 1}`,
        });
      if (key === '__EMPTY_1')
        data.clients.push({
          name: row[key],
          id: `c${data.clients.length + 1}`,
        });
      if (key === '__EMPTY_2')
        data.locations.push({
          name: row[key],
          id: `d${data.locations.length + 1}`,
        });
      if (key === '__EMPTY_3')
        data.products.push({
          name: row[key],
          id: `p${data.products.length + 1}`,
        });
    });
  });

  // get secondary data (costs, demands, capacities)
  excelJSON.forEach((row, i) => {
    if (i === 0) return; // skip first row because it's the header
    Object.keys(row).forEach((key) => {
      if (['__EMPTY_5'].includes(key)) {
        data.assignationClientLocationCost.push({
          client: data.clients.find(
            (client) =>
              client.name.toLowerCase().replaceAll(' ', '') ===
              row.__EMPTY_5.toLowerCase().replaceAll(' ', '')
          ).id,
          location: data.locations.find(
            (location) =>
              location.name.toLowerCase().replaceAll(' ', '') ===
              row.__EMPTY_6.toLowerCase().replaceAll(' ', '')
          ).id,
          cost: [row.__EMPTY_7, row?.__EMPTY_8 ?? 0],
          uncertainty: !!row?.__EMPTY_8,
        });
      }
      if (['__EMPTY_10'].includes(key)) {
        data.selectionLocationCost.push({
          location: data.locations.find(
            (location) =>
              location.name.toLowerCase().replaceAll(' ', '') ===
              row.__EMPTY_10.toLowerCase().replaceAll(' ', '')
          ).id,
          cost: row?.__EMPTY_11,
        });
      }
      if (['__EMPTY_13'].includes(key)) {
        data.shippingFactoryLocationProductCost.push({
          factory: data.factories.find(
            (factory) =>
              factory.name.toLowerCase().replaceAll(' ', '') ===
              row.__EMPTY_14.toLowerCase().replaceAll(' ', '')
          ).id,
          location: data.locations.find(
            (location) =>
              location.name.toLowerCase().replaceAll(' ', '') ===
              row.__EMPTY_15.toLowerCase().replaceAll(' ', '')
          ).id,
          product: data.products.find(
            (product) =>
              product.name.toLowerCase().replaceAll(' ', '') ===
              row.__EMPTY_13.toLowerCase().replaceAll(' ', '')
          ).id,
          cost: row.__EMPTY_16,
        });
      }
      if (['__EMPTY_18'].includes(key)) {
        const clientId = data.clients.find(
          (client) =>
            client.name.toLowerCase().replaceAll(' ', '') ===
            row.__EMPTY_19.toLowerCase().replaceAll(' ', '')
        ).id;
        data.productClientDemand.push({
          product: data.products.find(
            (product) =>
              product.name.toLowerCase().replaceAll(' ', '') ===
              row.__EMPTY_18.toLowerCase().replaceAll(' ', '')
          ).id,
          client: clientId,
          demand: row.__EMPTY_20,
        });

        const clientDemandIndex = data.totalClientDemand.findIndex(
          (client) => client.client === clientId
        );
        if (clientDemandIndex > -1)
          data.totalClientDemand[clientDemandIndex].totalDemand +=
            row.__EMPTY_20;
        else
          data.totalClientDemand.push({
            client: clientId,
            totalDemand: row.__EMPTY_20,
          });
      }
      if (['__EMPTY_22'].includes(key)) {
        data.locationCapacity.push({
          location: data.locations.find(
            (location) =>
              location.name.toLowerCase().replaceAll(' ', '') ===
              row.__EMPTY_22.toLowerCase().replaceAll(' ', '')
          ).id,
          capacity: row.__EMPTY_23,
        });
      }
      if (['__EMPTY_25'].includes(key)) {
        data.factoryProductCapacity.push({
          factory: data.factories.find(
            (factory) =>
              factory.name.toLowerCase().replaceAll(' ', '') ===
              row.__EMPTY_25.toLowerCase().replaceAll(' ', '')
          ).id,
          product: data.products.find(
            (product) =>
              product.name.toLowerCase().replaceAll(' ', '') ===
              row.__EMPTY_26.toLowerCase().replaceAll(' ', '')
          ).id,
          capacity: row.__EMPTY_27,
        });
      }
      if (['__EMPTY_29'].includes(key)) {
        data.totalBudget = row?.__EMPTY_29 ?? 0;
      }
    });
  });

  return data;
}
