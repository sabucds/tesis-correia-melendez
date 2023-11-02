/* eslint-disable no-plusplus */
import { MathModelSolution } from '../../components/mathModel/mathModel.model';
import { IModelData } from '../../components/mathModel/modelData/modelData.schema';

function evaluateSolutionInObjectiveFunction(
  data: IModelData,
  solution: MathModelSolution,
  natureStateIndex: number
) {
  let objectiveFunctionSolutionValue = 0;
  // evaluate the solution in the objective function using the nature state index in the cases of uncertainty
  // assignationClientLocationCost;
  // selectionLocationCost;
  // shippingFactoryLocationProductCost;

  data.assignationClientLocationCost.forEach(
    ({ client, location, cost, uncertainty }) => {
      let cost_ = cost[0];
      if (uncertainty) cost_ = cost[natureStateIndex];
      objectiveFunctionSolutionValue +=
        (solution[`x_${client}_${location}`] ?? 0) * cost_;
    }
  );
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
export function getDecisionMatrix(
  initialData: IModelData,
  solutions: MathModelSolution[],
  intervals: number
) {
  const decisionMatrix = [];
  // initalize array with index of the nature states
  const natureStatesLength = [];
  for (let i = 0; i <= intervals; i++) {
    natureStatesLength.push(i);
  }
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

  // generate decision matrix where each row is a solution and each column is a nature state
  solutions.forEach((solution) => {
    const solutionRow = [];
    natureStatesLength.forEach((natureStateIndex) => {
      const solutionValue = evaluateSolutionInObjectiveFunction(
        changedModelData,
        solution,
        natureStateIndex
      );

      solutionRow.push(solutionValue);
    });
    decisionMatrix.push(solutionRow);
  });

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
  console.log(robustnessBinaryMatrix);

  return solutions[solutionWithBetterRobustness.solutionIndex];
}
