import { useContext } from 'react';
import { UserContext } from '../context';
import { User } from '../models';

interface IUserContext {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export function useUser() {
  const { user, setUser } = useContext(UserContext) as unknown as IUserContext;
  return [user, setUser] as const;
}
