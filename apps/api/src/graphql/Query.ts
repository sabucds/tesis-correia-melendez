import { mathModelQueries } from '../components/mathModel/mathModel.controller';
import { authQueries } from '../components/auth/auth.controller';
import { userQueries } from '../components/user/user.controller';

const Query = {
  ...authQueries,
  ...userQueries,
  ...mathModelQueries,
};

export default Query;
