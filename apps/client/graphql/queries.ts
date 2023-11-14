import { gql } from '@apollo/client';
import { UserFragment } from './fragments';

export const CURRENT_USER = gql`
  query CURRENT_USER {
    currentUser {
      user {
        ...UserFragment
      }
    }
  }
  ${UserFragment}
`;

export const GET_MATH_MODEL = gql`
  query Query(
    $filter: FilterFindOneMathModelInput
    $sort: SortFindOneMathModelInput
    $skip: Int
  ) {
    mathModel(filter: $filter, skip: $skip, sort: $sort) {
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
