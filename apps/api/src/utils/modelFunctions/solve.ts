import solver from 'javascript-lp-solver/src/solver';
import { ModelInitialData, ModelMathEquations, ModelResult } from '../models';
import { constructPModel } from './generatePModel';
import generateMathModelString from './generateMathModelString';
import { method1, method2, method3 } from './uncertaintySolvingMethods';
import generateQModel from './generateQModel';
import { externalSolve } from './lpSolve/externalSolve';

export async function solve(data: ModelInitialData, method: 1 | 2 | 3 = 3) {
  const solutionsMap: ModelResult[] = [];
  // this object is made with the purpose of constructing the math equations for the model and paste them in Lingo app to compare results
  const modelMathEquations: ModelMathEquations = {
    constraints: {},
    objectiveFunction: 'MIN = 0 ', // minimizing the cost
    variablesNature: '',
  };

  let { model, dataConventions, xVariablesWithUncertainty } = constructPModel({
    variables: data,
    modelMathEquations,
  });

  let results: ModelResult = solver.Solve({
    ...model,
    options: {
      timeout: 10000,
    },
  });

  if (!results?.feasible)
    throw new Error('El problema ingresado no tiene solución');

  const modelsForLingo = [
    { modelNumber: 0, model: generateMathModelString(modelMathEquations) },
  ];

  // method1 and 2 only execute once so we don't need to loop over them
  if (method === 1 || method === 2)
    model = (method === 1 ? method1 : method2)({
      model,
      xVariablesWithUncertainty,
      modelMathEquations,
    });

  const solveAsync = () => {
    solutionsMap.push(results);

    // method 3 relays on the W constraints of the model so we have to use it instead of generateQModel
    // and run it in every iteration
    model = (method === 3 ? method3 : generateQModel)({
      previousModel: model,
      previousModelResult: results,
      modelMathEquations,
      resultNumber: solutionsMap.length - 1,
      xVariablesWithUncertainty,
    });

    modelsForLingo.push({
      model: generateMathModelString(modelMathEquations),
      modelNumber: solutionsMap.length,
    });

    return externalSolve({
      ...model,
    }).then((res) => {
      results = res;

      if (results.feasible === true && results.result > 0) return solveAsync();

      return {
        solutionsMap: [...solutionsMap, ...(results.feasible ? [results] : [])],
        modelsForLingo,
        dataConventions,
      };
    });
  };

  return solveAsync();
}
