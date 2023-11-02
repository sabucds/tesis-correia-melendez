import type { FilterQuery, ProjectionType, QueryOptions } from 'mongoose';
import { IMathModel, MathModel } from './mathModel.model';
import { solve } from '../../utils/modelFunctions/solve';

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
  return solve(mathModel?.data, mathModel?.method ?? 1).then(
    ({ solutionsMap, modelsForLingo, dataConventions }) =>
      MathModel.create({
        ...mathModel,
        solutions: solutionsMap,
        averageExecutionTime: Date.now() - start,
        lingoModels: modelsForLingo,
      })
  );
}
