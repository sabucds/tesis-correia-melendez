// These methods modify the model, adding restrictions and variables to solve the uncertainty problem and throw more results

import {
  Model,
  ModelMathEquations,
  ModelResult,
  ModelVariables,
  UncertaintyVariable,
} from '../models';

interface Method1Props {
  model: Model;
  xVariablesWithUncertainty: UncertaintyVariable;
  modelMathEquations: ModelMathEquations;
}

/**
 * This is the first method to solve the uncertainty problem
 * it adds a new variable and 4 constraints for each x variable with uncertainty
 * @param model the model to be modified
 * @param xVariablesWithUncertainty the x variables with uncertainty and their cost [lower, upper]
 * @param modelMathEquations the model math equations to add the new constraints for Lingo
 */
export function method1({
  model,
  xVariablesWithUncertainty,
  modelMathEquations,
}: Method1Props): Model {
  const changedModel = model;

  Object.keys(xVariablesWithUncertainty).forEach((xVariableKey) => {
    const { cost, client, location } = xVariablesWithUncertainty[xVariableKey];

    const wVariableName = `w_${client}_${location}`; // w_cn_dn
    const cVariableName = `c_${client}_${location}`; // c_cn_dn
    // change objective function
    modelMathEquations.objectiveFunction =
      modelMathEquations.objectiveFunction.replace(
        `${cost[0]}*${xVariableKey}`,
        wVariableName
      ); // Ccd*Xcd => Wcd substitution

    // add all the new constraints (4 constraints for each x variable + w_cn_dn constraint)
    // 1- declare w_cn_dn variables
    changedModel.constraints[wVariableName] = {
      min: 0, // w_cn_dn is not integer but it is always positive
    };

    // 2- declare Ccd as a variable for the new constraints
    changedModel.constraints[cVariableName] = {
      // c_cn_dn has a value between the min and max cost and its not integer
      min: cost[0], // min cost
      max: cost[1], // max cost
    };

    // 3- add the constraints related to w_cn_dn, c_cn_dn and the x_cn_dn variables

    // 3.1-  add constraint Wcd >= C(l)cd * Xcd in the form of C(l)cd * Xcd - Wcd <= 0
    changedModel.constraints[`lower_${wVariableName}_${xVariableKey}`] = {
      // lower_w_cn_dn_x_cn_dn
      max: 0,
    };
    modelMathEquations.constraints[`lower_${wVariableName}_${xVariableKey}`] = {
      leftSide: wVariableName,
      inequalitySign: '>=',
      rightSide: `${cost[0]}*${xVariableKey}`,
    };

    // 3.2 add constraint Wcd <= C(u)cd * Xcd in the form of C(u)cd * Xcd - Wcd => 0
    changedModel.constraints[`upper_${wVariableName}_${xVariableKey}`] = {
      min: 0,
    };
    modelMathEquations.constraints[`upper_${wVariableName}_${xVariableKey}`] = {
      leftSide: wVariableName,
      inequalitySign: '<=',
      rightSide: `${cost[1]}*${xVariableKey}`,
    };

    // 3.3 add constraint C(l)cd - C(l)cd * Xcd <= Ccd - Wcd in the form of  C(l)cd <= Ccd - Wcd + C(l)cd * Xcd
    changedModel.constraints[
      `lower_${wVariableName}_${cVariableName}_${xVariableKey}`
    ] = {
      min: cost[0],
    };
    modelMathEquations.constraints[
      `lower_${wVariableName}_${cVariableName}_${xVariableKey}`
    ] = {
      leftSide: `${cost[0]} - ${cost[0]}*${xVariableKey}`,
      inequalitySign: '<=',
      rightSide: `${cVariableName} - ${wVariableName}`,
    };

    // 3.4 add constraint C(u)cd - C(u)cd * Xcd >= Ccd - Wcd in the form of  C(u)cd >= Ccd - Wcd + C(u)cd * Xcd
    changedModel.constraints[
      `upper_${wVariableName}_${cVariableName}_${xVariableKey}`
    ] = {
      max: cost[1],
    };
    modelMathEquations.constraints[
      `upper_${wVariableName}_${cVariableName}_${xVariableKey}`
    ] = {
      leftSide: `${cost[1]} - ${cost[1]}*${xVariableKey}`,
      inequalitySign: '>=',
      rightSide: `${cVariableName} - ${wVariableName}`,
    };

    // 4- add constraints to variables that are involved and change x variables for the objective function
    // 4.1- add Wcd variable
    changedModel.variables[wVariableName] = {
      cost: -1, // to put it in objective function
      [`lower_${wVariableName}_${xVariableKey}`]: -1,
      [`upper_${wVariableName}_${xVariableKey}`]: -1,
      [`lower_${wVariableName}_${cVariableName}_${xVariableKey}`]: -1,
      [`upper_${wVariableName}_${cVariableName}_${xVariableKey}`]: -1,
      [wVariableName]: 1,
    };
    // 4.2- add Ccd variable
    changedModel.variables[cVariableName] = {
      // this one does not enter in the objective function
      [`lower_${wVariableName}_${cVariableName}_${xVariableKey}`]: 1,
      [`upper_${wVariableName}_${cVariableName}_${xVariableKey}`]: 1,
      [cVariableName]: 1,
    };
    // 4.3- change x variable
    changedModel.variables[xVariableKey] = {
      ...changedModel.variables[xVariableKey], // keep the old constraints
      [`lower_${wVariableName}_${xVariableKey}`]: cost[0],
      [`upper_${wVariableName}_${xVariableKey}`]: cost[1],
      [`lower_${wVariableName}_${cVariableName}_${xVariableKey}`]: cost[0],
      [`upper_${wVariableName}_${cVariableName}_${xVariableKey}`]: cost[1],
    };

    // remove the x from the objective function
    delete changedModel.variables[xVariableKey].cost;

    // 5- add the new variables to the variablesNature
    modelMathEquations.variablesNature += `@FREE(${wVariableName}); @BND(${cost[0]}, ${cVariableName}, ${cost[1]}); `;
  });

  return changedModel;
}

interface Method2Props {
  model: Model;
  xVariablesWithUncertainty: UncertaintyVariable;
  modelMathEquations: ModelMathEquations;
}

/**
 * Similar to method 1 but only use 2 of the 4 constraints that are used in method 1
 * @param model: the model to be changed
 * @param xVariablesWithUncertainty: the x variables that have uncertainty
 * @param modelMathEquations: the math equations of the model for Lingo
 * @returns the changed model
 */
export function method2({
  model,
  xVariablesWithUncertainty,
  modelMathEquations,
}: Method2Props): Model {
  const changedModel = model;

  Object.keys(xVariablesWithUncertainty).forEach((xVariableKey) => {
    const { cost, client, location } = xVariablesWithUncertainty[xVariableKey];

    const wVariableName = `w_${client}_${location}`; // w_cn_dn
    const cVariableName = `c_${client}_${location}`; // c_cn_dn
    // change objective function
    modelMathEquations.objectiveFunction =
      modelMathEquations.objectiveFunction.replace(
        `${cost[0]}*${xVariableKey}`,
        wVariableName
      ); // Ccd*Xcd => Wcd substitution

    // add all the new constraints (4 constraints for each x variable + w_cn_dn constraint)
    // 1- declare w_cn_dn variables
    changedModel.constraints[wVariableName] = {
      min: 0, // w_cn_dn is not integer but it is always positive
    };

    // 2- declare Ccd as a variable for the new constraints
    changedModel.constraints[cVariableName] = {
      // c_cn_dn has a value between the min and max cost and its not integer
      min: cost[0], // min cost
      max: cost[1], // max cost
    };

    // 3- add the constraints related to w_cn_dn, c_cn_dn and the x_cn_dn variables

    // 3.1-  add constraint Wcd >= C(l)cd * Xcd in the form of C(l)cd * Xcd - Wcd <= 0
    changedModel.constraints[`lower_${wVariableName}_${xVariableKey}`] = {
      // lower_w_cn_dn_x_cn_dn
      max: 0,
    };
    modelMathEquations.constraints[`lower_${wVariableName}_${xVariableKey}`] = {
      leftSide: wVariableName,
      inequalitySign: '>=',
      rightSide: `${cost[0]}*${xVariableKey}`,
    };

    // 3.2 add constraint C(u)cd - C(u)cd * Xcd >= Ccd - Wcd in the form of  C(u)cd >= Ccd - Wcd + C(u)cd * Xcd
    changedModel.constraints[
      `upper_${wVariableName}_${cVariableName}_${xVariableKey}`
    ] = {
      max: cost[1],
    };
    modelMathEquations.constraints[
      `upper_${wVariableName}_${cVariableName}_${xVariableKey}`
    ] = {
      leftSide: `${cost[1]} - ${cost[1]}*${xVariableKey}`,
      inequalitySign: '>=',
      rightSide: `${cVariableName} - ${wVariableName}`,
    };

    // 4- add constraints to variables that are involved and change x variables for the objective function
    // 4.1- add Wcd variable
    changedModel.variables[wVariableName] = {
      cost: -1, // to put it in objective function
      [`lower_${wVariableName}_${xVariableKey}`]: -1,
      [`upper_${wVariableName}_${cVariableName}_${xVariableKey}`]: -1,
      [wVariableName]: 1,
    };
    // 4.2- add Ccd variable
    changedModel.variables[cVariableName] = {
      // this one does not enter in the objective function
      [`upper_${wVariableName}_${cVariableName}_${xVariableKey}`]: 1,
      [cVariableName]: 1,
    };
    // 4.3- change x variable
    changedModel.variables[xVariableKey] = {
      ...changedModel.variables[xVariableKey], // keep the old constraints
      [`lower_${wVariableName}_${xVariableKey}`]: cost[0],
      [`upper_${wVariableName}_${cVariableName}_${xVariableKey}`]: cost[1],
    };

    // remove the x from the objective function
    delete changedModel.variables[xVariableKey].cost;

    modelMathEquations.variablesNature += `@FREE(${wVariableName}); @BND(${cost[0]}, ${cVariableName}, ${cost[1]}); `;
  });

  return changedModel;
}

interface Method3Props {
  previousModel: Model;
  previousModelResult: ModelResult;
  modelMathEquations: ModelMathEquations;
  resultNumber: number;
  xVariablesWithUncertainty: UncertaintyVariable;
}

/**
 * Unlike methods 1 and 2, method 3 has to execute in every iteration because it changes the W constraint
 * Sot it is more similar to the Q model function and receives the same parameters
 * @param previousModel: the previous model
 * @param previousModelResult: the result of the previous model
 * @param modelMathEquations: the math equations of the model for Lingo
 * @param resultNumber: the number of the result (0 for P, 1 for Q(1), 2 for Q(2), etc)
 * @param xVariablesWithUncertainty: the x variables that have uncertainty
 * @returns the changed model (adding a new W constraint in each iteration)
 */
export function method3({
  previousModel,
  previousModelResult,
  modelMathEquations,
  resultNumber,
  xVariablesWithUncertainty,
}: Method3Props): Model {
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
    const { cost } = xVariablesWithUncertainty[xVariableKey];

    const xcdk = previousModelResult[xVariableKey] ?? 0; // 1 or 0

    // the x variables in the objective function doesn't change and will always be Ccd(l)*Xcd
    wMaxValue -= (previousModelResult[xVariableKey] ?? 0) * cost[0];

    // W constraint in the form W - Ccd(l)*Xcd*Xcd(k) - Ccd(u)*Xcd(k) + Ccd(u)*Xcd*Xcd(k) <= the rest of the objective function result of the previous model
    // Xcd(k) is the result of the previous Xcd in the previous model

    // 4.3- change x variable
    previousModel.variables[xVariableKey] = {
      ...previousModel.variables[xVariableKey], // keep the old constraints
      [`w${resultNumber}_constraint`]: cost[1] * xcdk - xcdk * cost[0], //  - Ccd(l)*Xcd*Xcd(k)  + Ccd(u)*Xcd*Xcd(k)
    };
    // add + Ccd(l)*Xcd*Xcd(k) - Ccd(u)*Xcd*Xcd(k) to the right side of the W constraint (because we are passing it to the other side, signs change)
    modelMathEquations.constraints[`w${resultNumber}_constraint`] = {
      ...modelMathEquations.constraints[`w${resultNumber}_constraint`],
      rightSide: `${
        modelMathEquations.constraints[`w${resultNumber}_constraint`].rightSide
      } + ${xVariableKey}*${xcdk * cost[0] - cost[1] * xcdk}`,
    };

    // since - Ccd(u)*Xcd(k) is a number and doesn't have any variables, we pass it to the other side of the W constraint
    // so we have to add it to the max value of W
    wMaxValue += cost[1] * xcdk; // - Ccd(u)*Xcd(k)
  });

  // add the max value of W to the right side of the W constraint
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

  if (isTheFirstResult) modelMathEquations.variablesNature += `@FREE(w); `; // w is not integer, is a float

  const changedModel: Model = {
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
        ...previousModel.variables.w, // keep the old constraints
        [`w${resultNumber}_constraint`]: 1, // add new constraint for W
        cost: 1, // to put W in the objective function in the form of W - (the other variables)
      },
    },
  };

  return changedModel;
}
