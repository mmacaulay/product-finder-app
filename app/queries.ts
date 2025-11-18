import { gql } from '@apollo/client';

export const GET_PRODUCT = gql`
  query GetProduct($upc: String!) {
    productByUpc(upc: $upc) {
      upcCode
      brand
      name
      id
    }
  }
`;