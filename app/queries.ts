import { gql } from '@apollo/client';

export const GET_PRODUCT = gql`
  query GetProduct($barcode: String!) {
    product(barcode: $barcode) {
      barcode
      brand
      name
      description
    }
  }
`;