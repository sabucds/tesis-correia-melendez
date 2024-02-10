/* eslint-disable no-plusplus */
import { MathModelSolution } from '../../components/mathModel/mathModel.model';
import { IModelData } from '../../components/mathModel/modelData/modelData.schema';

function evaluateSolutionInObjectiveFunction(
  data: IModelData,
  solution: MathModelSolution,
  natureState: number[]
) {
  const uncertaintyVariables = [];
  let objectiveFunctionSolutionValue = 0;
  // evaluate the solution in the objective function using the nature state index in the cases of uncertainty
  // assignationClientLocationCost;
  // selectionLocationCost;
  // shippingFactoryLocationProductCost;

  data.assignationClientLocationCost.forEach(
    ({ client, location, cost, uncertainty }) => {
      if (!uncertainty) {
        const cost_ = cost[0];
        objectiveFunctionSolutionValue +=
          (solution[`x_${client}_${location}`] ?? 0) * cost_;
      } else {
        uncertaintyVariables.push(`x_${client}_${location}`);
      }
    }
  );

  uncertaintyVariables.forEach((variable, index) => {
    console.log(
      'var: ',
      variable,
      'Valor: ',
      natureState[index],
      (solution[variable] ?? 0) === 0 ? 'No se escogió' : 'Se escogió'
    );

    objectiveFunctionSolutionValue +=
      (solution[variable] ?? 0) * natureState[index];
  });

  data.selectionLocationCost.forEach(({ location, cost }) => {
    objectiveFunctionSolutionValue += (solution[`y_${location}`] ?? 0) * cost;
  });
  data.shippingFactoryLocationProductCost.forEach(
    ({ factory, location, product, cost }) => {
      objectiveFunctionSolutionValue +=
        (solution[`z_${product}_${factory}_${location}`] ?? 0) * cost;
    }
  );
  return Number.parseFloat(objectiveFunctionSolutionValue.toFixed(2));
}

function esMatriz(variable) {
  // Verifica si la variable es un array y si todos sus elementos son arrays
  return Array.isArray(variable) && variable.every(Array.isArray);
}

function convertirAMatriz(arrayNormal) {
  if (
    Array.isArray(arrayNormal) &&
    arrayNormal.every((elem) => typeof elem === 'number')
  ) {
    // Verifica que la variable sea un array de números
    const matriz = [...arrayNormal.map((elem) => [elem])];

    return matriz;
  }
  return arrayNormal;
}
function cartesian(...args: number[][]) {
  const result = args.reduce((a, b) =>
    a.reduce((r, v) => r.concat(b.map((w) => [].concat(v, w))), [])
  ) as unknown as number[][];
  return result;
}

export function getDecisionMatrix(
  initialData: IModelData,
  solutions: MathModelSolution[],
  intervals: number
) {
  const decisionMatrix = [];
  // to get the nature states, we need to discretized the uncertainty ranges in the initial data
  // to do that, we need to get the min and max values of each uncertainty and divide them into n ranges
  // if intervals is 5, the matrix will have 5 columns
  // and each solution of the solutionMap will be an alternative (n solutions = n alternatives or rows)

  const changedModelData = initialData;

  // discretize assignationClientLocationCost for each uncertainty
  changedModelData.assignationClientLocationCost.forEach(
    ({ cost, uncertainty }, ii) => {
      if (cost?.length > 1 && uncertainty) {
        const min = Math.min(...cost);
        const max = Math.max(...cost);
        const range = (max - min) / intervals;

        const ranges = [];
        for (let i = 0; i <= intervals; i++) {
          ranges.push(Number.parseFloat((min + i * range).toFixed(2)));
        }
        changedModelData.assignationClientLocationCost[ii].cost = ranges;
      }
    }
  );

  // get all the possible nature states (combination of all the uncertainty ranges)
  let natureStates = cartesian(
    ...changedModelData.assignationClientLocationCost
      .filter((c) => c.uncertainty)
      .map(({ cost }) => cost)
  );

  if (!esMatriz(natureStates)) {
    natureStates = convertirAMatriz(natureStates);
  }

  // generate decision matrix where each row is a solution and each column is a nature state
  solutions.forEach((solution, i) => {
    const solutionRow = [];
    console.log('SOLUCIÓN: ', i);
    natureStates.forEach((natureState, ii) => {
      console.log('EDO DE LA NATURALEZA: ', ii);
      const solutionValue = evaluateSolutionInObjectiveFunction(
        changedModelData,
        solution,
        natureState
      );

      solutionRow.push(solutionValue);
    });
    decisionMatrix.push(solutionRow);
  });
  console.log('MATRIZ DE DECISION', decisionMatrix);

  return decisionMatrix;
}

export function getSolutionByRobustnessCriteria(
  decisionMatrix: Array<Array<number>>,
  solutions: MathModelSolution[]
) {
  const robustnessIndex = 0.5;
  // get the lower and upper bounds of each column
  const lowerBounds = [];
  const upperBounds = [];
  decisionMatrix.forEach((row) => {
    row.forEach((value, index) => {
      if (lowerBounds[index] === undefined || value < lowerBounds[index]) {
        lowerBounds[index] = value;
      }
      if (upperBounds[index] === undefined || value > upperBounds[index]) {
        upperBounds[index] = value;
      }
    });
  });
  // get the robustness of each solution
  const robustnessBinaryMatrix = [];
  const solutionWithBetterRobustness = { solutionIndex: 0, robustness: 0 };
  decisionMatrix.forEach((row, index) => {
    const robustnessValues = [];
    row.forEach((value, i) => {
      const robustnessValue_ =
        (value - lowerBounds[i]) / (upperBounds[i] - lowerBounds[i]);
      if (robustnessValue_ < robustnessIndex) robustnessValues.push(1);
    });
    if (robustnessValues.length > solutionWithBetterRobustness.robustness) {
      solutionWithBetterRobustness.solutionIndex = index;
      solutionWithBetterRobustness.robustness = robustnessValues.length;
    }
    robustnessBinaryMatrix.push(robustnessValues);
  });
  console.log(
    'cantidad de 1 por cada alternativa: ',
    robustnessBinaryMatrix.map((row) => row.length),
    solutionWithBetterRobustness
  );

  return solutions[solutionWithBetterRobustness.solutionIndex];
}

export function getSolutionByLaplaceCriteria(
  decisionMatrix: Array<Array<number>>,
  solutions: MathModelSolution[]
) {
  const averagesMatrix = [];
  const bestAverage = { solutionIndex: 0, average: 0 };
  decisionMatrix.forEach((row, index) => {
    const averageValue = row.reduce((a, b) => a + b, 0) / row.length;

    if (averageValue < bestAverage.average || bestAverage.average === 0) {
      bestAverage.solutionIndex = index;
      bestAverage.average = averageValue;
    }
    averagesMatrix.push([averageValue]);
  });
  console.log('Criterio de Laplace:', averagesMatrix, bestAverage);

  return solutions[bestAverage.solutionIndex];
}

export function getSolutionBySavageCriteria(
  decisionMatrix: Array<Array<number>>,
  solutions: MathModelSolution[]
) {
  // get the lower bounds of each column
  const lowerBounds = [];
  decisionMatrix.forEach((row) => {
    row.forEach((value, index) => {
      if (lowerBounds[index] === undefined || value < lowerBounds[index]) {
        lowerBounds[index] = value;
      }
    });
  });
  // get the maximum regret of each solution
  const solutionWithBetterRegret = { solutionIndex: 0, regret: 0 };
  decisionMatrix.forEach((row, index) => {
    const regretsValues = [];
    row.forEach((value, i) => {
      const regretValue = value - lowerBounds[i];
      regretsValues.push(regretValue);
    });
    // get the maximum number in the regretsValues array
    const maxRegret = Math.max(...regretsValues);

    // if the maximum regret is 0, then the solution is the best
    // if the maximum regret is lower than the current maximum regret, then the solution is the best
    if (
      solutionWithBetterRegret.regret === 0 ||
      maxRegret < solutionWithBetterRegret.regret
    ) {
      solutionWithBetterRegret.solutionIndex = index;
      solutionWithBetterRegret.regret = maxRegret;
    }
  });
  console.log('Criterio de Savage:', solutionWithBetterRegret);

  return solutions[solutionWithBetterRegret.solutionIndex];
}
