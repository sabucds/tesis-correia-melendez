import type { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { IMathModel, MathModel } from './mathModel.model';
import { solve } from '../../utils/modelFunctions/solve';
import {
  getDecisionMatrix,
  getSolutionByRobustnessCriteria,
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
      const decisionMatrix = getDecisionMatrix(
        mathModel?.data,
        solutionsMap,
        mathModel.intervals ?? 1
      );
      const finalSolution = getSolutionByRobustnessCriteria(
        decisionMatrix,
        solutionsMap
      );

      return MathModel.create({
        ...mathModel,
        solutions: solutionsMap,
        averageExecutionTime: Date.now() - start,
        lingoModels: modelsForLingo,
        finalSolution,
        dataConventions,
      });
    }
  );
}
