import type { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { IMathModel, MathModel } from './mathModel.model';
import { solve } from '../../utils/modelFunctions/solve';
import {
  getDecisionMatrix,
  getSolutionByLaplaceCriteria,
  getSolutionByRobustnessCriteria,
  getSolutionBySavageCriteria,
} from '../../utils/modelFunctions/decisionCriteria';

export async function findOne(
  filter?: FilterQuery<IMathModel>,
  projection?: ProjectionType<IMathModel> | null,
  options?: QueryOptions<IMathModel> | null
) {
  return MathModel.findOne(filter, projection, options).exec();
}

export async function find(
  filter?: FilterQuery<IMathModel>,
  projection?: ProjectionType<IMathModel> | null,
  options?: QueryOptions<IMathModel> | null
) {
  return MathModel.find(filter, projection, options).exec();
}

export async function create(mathModel: IMathModel) {
  const start = Date.now();
  return solve(mathModel?.data, mathModel?.method).then(
    ({ solutionsMap, modelsForLingo, dataConventions }) => {
      let finalSolution = solutionsMap[0];
      let laplaceSolution = solutionsMap[0];
      let savageSolution = solutionsMap[0];

      if (solutionsMap.length > 1) {
        const decisionMatrix = getDecisionMatrix(
          mathModel?.data,
          solutionsMap,
          mathModel.intervals ?? 2
        );
        finalSolution = getSolutionByRobustnessCriteria(
          decisionMatrix,
          solutionsMap
        );
        laplaceSolution = getSolutionByLaplaceCriteria(
          decisionMatrix,
          solutionsMap
        );
        savageSolution = getSolutionBySavageCriteria(
          decisionMatrix,
          solutionsMap
        );
      }

      return MathModel.create({
        ...mathModel,
        solutions: solutionsMap,
        averageExecutionTime: Date.now() - start,
        lingoModels: modelsForLingo,
        finalSolution,
        dataConventions,
        laplaceSolution,
        savageSolution,
      });
    }
  );
}
