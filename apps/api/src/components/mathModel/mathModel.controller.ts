import { schemaComposer } from 'graphql-compose';
import { getBasicMutations, getBasicQueries } from '../../utils/resolver';
import { MathModelTC } from './mathModel.model';
import { CreateOneMathModelInput, MathModelType } from './mathModel.dto';
import * as mathModelService from './mathModel.service';

interface CreateMathModelMutationArgs {
  data: any;
}

const createMathModel = schemaComposer.createResolver<
  any,
  CreateMathModelMutationArgs
>({
  name: 'createMathModel',
  kind: 'mutation',
  type: MathModelType,
  description: 'Create one user',
  args: {
    data: CreateOneMathModelInput,
  },
  async resolve({ args }) {
    const _mathModel = await mathModelService.create(args.data);
    return _mathModel;
  },
});

const mathModelQueries = {
  ...getBasicQueries(MathModelTC),
};

const mathModelMutations = {
  ...getBasicMutations(MathModelTC),
  createMathModel,
};

export { mathModelQueries, mathModelMutations };
