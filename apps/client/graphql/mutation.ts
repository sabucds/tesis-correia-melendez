import { gql } from '@apollo/client';
import { UserFragment } from './fragments';

export const SIGN_IN = gql`
  mutation SIGN_IN($data: SignInInput!) {
    signIn(data: $data) {
      user {
        ...UserFragment
      }
    }
  }
  ${UserFragment}
`;

export const SIGN_UP = gql`
  mutation SIGN_UP($data: SignUpInput!) {
    signUp(data: $data) {
      user {
        ...UserFragment
      }
    }
  }
  ${UserFragment}
`;

export const SIGN_OUT = gql`
  mutation SignOut {
    signOut {
      success
    }
  }
`;
