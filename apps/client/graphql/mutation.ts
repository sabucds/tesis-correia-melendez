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

export const CREATE_MATH_MODEL = gql`
  mutation CreateMathModel($data: CreateOneMathModelInput!) {
    createMathModel(data: $data) {
      _id
      active
      averageExecutionTime
      createdAt
      data {
        _id
        assignationClientLocationCost {
          _id
          client
          cost
          location
          uncertainty
        }
        clients {
          _id
          id
          name
        }
        factories {
          _id
          id
          name
        }
        factoryProductCapacity {
          _id
          capacity
          factory
          product
        }
        locationCapacity {
          _id
          capacity
          location
        }
        locations {
          _id
          id
          name
        }
        productClientDemand {
          _id
          client
          demand
          product
        }
        products {
          _id
          id
          name
        }
        selectionLocationCost {
          _id
          cost
          location
        }
        shippingFactoryLocationProductCost {
          _id
          cost
          factory
          location
          product
        }
        totalBudget
        totalClientDemand {
          _id
          client
          totalDemand
        }
      }
      finalSolution
      intervals
      lingoModels {
        _id
        model
        modelNumber
      }
      method
      name
      solutions
      updatedAt
      user
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($data: ResetPasswordInput) {
    resetPassword(data: $data) {
      success
      err
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($data: ChangePasswordInput) {
    changePassword(data: $data) {
      success
      err
    }
  }
`;

export const UPDATE_MATH_MODEL = gql`
  mutation UpdateMathModel(
    $record: UpdateOneMathModelInput!
    $filter: FilterUpdateOneMathModelInput
  ) {
    updateMathModel(record: $record, filter: $filter) {
      record {
        name
        user
        active
        _id
      }
      recordId
    }
  }
`;
