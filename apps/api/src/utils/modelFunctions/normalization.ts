/**
 * *DEPRECATED: DOES NOT MAKE A DIFFERENCE
 */

import { ModelInitialData, ModelResult } from '../models';

export function calculateMaxNumber(data: ModelInitialData) {
  let minNumber = Number.MAX_SAFE_INTEGER;
  let maxNumber = data.totalBudget ?? 0;

  for (const assignation of data.assignationClientLocationCost) {
    const [min, max] = assignation.cost;
    maxNumber = Math.max(maxNumber, max);
    minNumber = Math.min(minNumber, min);
  }

  for (const selection of data.selectionLocationCost) {
    const { cost } = selection;
    maxNumber = Math.max(maxNumber, cost);
    minNumber = Math.min(minNumber, cost);
  }

  for (const shipping of data.shippingFactoryLocationProductCost) {
    const { cost } = shipping;
    maxNumber = Math.max(maxNumber, cost);
    minNumber = Math.min(minNumber, cost);
  }

  return { minNumber, maxNumber };
}

/**
 *
 * @param value
 * @param min
 * @param max
 * @returns
 */
function normalizeValue(value: number, min: number, max: number) {
  return (value - min) / (max - min);
}

function denormalizeValue(normalizedValue: number, min: number, max: number) {
  return normalizedValue * (max - min) + min;
}

export function normalizeModelCosts(
  initialData: ModelInitialData,
  minNumber: number,
  maxNumber: number
) {
  const changedData: ModelInitialData = { ...initialData };

  // const changedDataKeys = ['assignationClientLocationCost'];
  const changedDataKeys = Object.keys(changedData).filter((key) =>
    key.toLowerCase().includes('cost')
  );

  changedData.totalBudget = normalizeValue(
    changedData.totalBudget,
    minNumber,
    maxNumber
  );

  changedDataKeys.forEach((key) => {
    const arr = changedData[key as keyof ModelInitialData] as any[];
    arr.forEach((item, ii) => {
      if (Array.isArray(item.cost)) {
        const [min, max] = item.cost;
        changedData[key][ii].cost = [
          normalizeValue(min, minNumber, maxNumber),
          normalizeValue(max, minNumber, maxNumber),
        ];
      } else {
        const value = item.cost;
        const keyName = Object.keys(changedData[key][ii]).find(
          (k) => changedData[key][ii][k] === value
        );
        changedData[key][ii][keyName] = normalizeValue(
          value,
          minNumber,
          maxNumber
        );
      }
    });
  });

  return changedData;
}

export function denormalizeResults(
  results: ModelResult,
  minNumber: number,
  maxNumber: number
) {
  const changedResults: ModelResult = { ...results };
  // denormalize the affected results (c, w variables and the result of the objective function)
  const changedResultsKeys = Object.keys(changedResults).filter(
    (key) =>
      !key.includes('x') && // binary variables
      !key.includes('y') && // binary variables
      !key.includes('z') && // int variables
      typeof changedResults[key] === 'number'
  ); // not apply to the binary variables (1 or 0)

  changedResultsKeys.forEach((key) => {
    changedResults[key as keyof ModelResult] = denormalizeValue(
      changedResults[key as keyof ModelResult] as number,
      minNumber,
      maxNumber
    );
  });
  return changedResults;
}
