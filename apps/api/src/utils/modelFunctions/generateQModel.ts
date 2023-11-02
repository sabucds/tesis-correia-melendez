import {
  Model,
  ModelMathEquations,
  ModelResult,
  ModelVariables,
  UncertaintyVariable,
} from '../models';

interface GenerateQModelProps {
  previousModel: Model;
  previousModelResult: ModelResult;
  modelMathEquations: ModelMathEquations;
  resultNumber: number;
  xVariablesWithUncertainty: UncertaintyVariable;
}

/**
 * This method modifies the previous model (whether is P or Q),
 * adding the W constraint and variable and changing the objective function to maximize cost
 * The purpose of W is to avoid the previous solution so the library will find a new solution that
 * would be less than the previous one and will be worse than the previous one
 * @param previousModel: The P or previous Q model previously solved
 * @param previousModelResult: The result of the previous model (the initial P or the previous Q model)
 * @param modelMathEquations: The math equations of the previous model (for Lingo)
 * @param resultNumber: The number of the result (result of P model will be number 0, Q(1) model number 1 and so on)
 * @returns The Q model with the W constraint and variable and the objective function changed to maximize cost
 */
export default function generateQModel({
  previousModel,
  previousModelResult,
  modelMathEquations,
  resultNumber,
  xVariablesWithUncertainty,
}: GenerateQModelProps): Model {
  const isTheFirstResult = resultNumber === 0;
  const modelVariablesKeys = Object.keys(previousModel.variables);

  const xVariablesWithUncertaintyKeys = Object.keys(xVariablesWithUncertainty);

  // if resultNumber is 0, it means that the previous model was P, so the max value of W will be the result of P
  // if resultNumber is 1 or more, it means that the previous model was Q, so the max value of W will be the difference between the previous model result and the previous W
  // because when the model is Q, the objective function is W - .... and its result involve the previous W
  let wMaxValue = isTheFirstResult
    ? previousModelResult.result
    : previousModelResult.w - previousModelResult.result;

  modelMathEquations.constraints[`w${resultNumber}_constraint`] = {
    leftSide: 'w',
    inequalitySign: '<=',
    rightSide: '0',
  };

  // substract the the values of X variables with uncertainty from the max value of W
  xVariablesWithUncertaintyKeys.forEach((xVariableKey) => {
    const { client, location, cost } = xVariablesWithUncertainty[xVariableKey];

    if (isTheFirstResult) {
      wMaxValue -= (previousModelResult[xVariableKey] ?? 0) * cost[0];
    } else {
      wMaxValue -= previousModelResult[`w_${client}_${location}`] ?? 0;
    }

    previousModel.variables[`c_${client}_${location}`] = {
      ...previousModel.variables[`c_${client}_${location}`],
      [`w${resultNumber}_constraint`]:
        (previousModelResult[xVariableKey] ?? 0) * -1,
    };

    modelMathEquations.constraints[`w${resultNumber}_constraint`] = {
      ...modelMathEquations.constraints[`w${resultNumber}_constraint`],
      rightSide: `${
        modelMathEquations.constraints[`w${resultNumber}_constraint`].rightSide
      } + c_${client}_${location}*${previousModelResult[xVariableKey] ?? 0}`,
    };
  });

  modelMathEquations.constraints[`w${resultNumber}_constraint`] = {
    ...modelMathEquations.constraints[`w${resultNumber}_constraint`],
    rightSide: `${
      modelMathEquations.constraints[`w${resultNumber}_constraint`].rightSide
    } + ${wMaxValue}`,
  };

  // change all the existing variables to negative cost (because the objective function is now to maximize cost)
  if (isTheFirstResult) {
    modelVariablesKeys.forEach((variableKey) => {
      const variableCost = previousModel.variables[variableKey].cost; // if the previous model was P, the cost is positive, if it was Q, the cost is negative and it has to stay negative
      previousModel.variables[variableKey] = {
        ...previousModel.variables[variableKey],
        cost: variableCost > 0 ? variableCost * -1 : variableCost,
      };
    });
    modelMathEquations.objectiveFunction = modelMathEquations.objectiveFunction
      .replaceAll('+', '-')
      .replace('MIN = ', 'MAX = w - '); // change min to max and add w to the objective function
  }

  modelMathEquations.variablesNature += `@FREE(w); `; // w is not integer

  const qModel: Model = {
    ...previousModel,
    opType: 'max',
    constraints: {
      ...previousModel.constraints,
      // add the W constraint and the constraint that W <= previous model result without W
      // w: { min: 0 }, // W is not integer but it is always positive
      [`w${resultNumber}_constraint`]: { max: wMaxValue }, // W <= previous model result without W
    },
    variables: {
      ...previousModel.variables,
      w: {
        ...previousModel.variables.w, // keep the previous W constraints
        // if w already exists, it is overwritten
        [`w${resultNumber}_constraint`]: 1, // add new constraint for W
        // w: 1, //
        cost: 1, // to put W in the objective function in the form of W - (the other variables)
      },
    },
  };

  return qModel;
}
