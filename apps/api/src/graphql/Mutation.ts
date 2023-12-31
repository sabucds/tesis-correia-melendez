import { mathModelMutations } from '../components/mathModel/mathModel.controller';
import { authMutations } from '../components/auth/auth.controller';
import { s3Mutations } from '../components/s3/s3.controller';
import { userMutations } from '../components/user/user.controller';

const Mutation = {
  ...authMutations,
  ...s3Mutations,
  ...userMutations,
  ...mathModelMutations,
};

export default Mutation;
