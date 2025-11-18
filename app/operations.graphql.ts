import { gql } from '@apollo/client';

// Basic product info query
export const GET_PRODUCT_QUERY = gql`
  query GetProduct($upc: String!) {
    productByUpc(upc: $upc) {
      id
      upcCode
      brand
      name
      imageUrl
    }
  }
`;

// Product reviews query for on-demand loading
export const GET_PRODUCT_REVIEWS_QUERY = gql`
  query GetProductReviews($upc: String!) {
    productByUpc(upc: $upc) {
      id
      upcCode
      reviewSummary {
        summary
        sentiment
        sentimentScore
        pros
        cons
        keyThemes
        confidence
        cached
        generatedAt
        provider
      }
    }
  }
`;

// Product safety query for on-demand loading
export const GET_PRODUCT_SAFETY_QUERY = gql`
  query GetProductSafety($upc: String!) {
    productByUpc(upc: $upc) {
      id
      upcCode
      safetyAnalysis {
        summary
        riskLevel
        allergens
        certifications
        harmfulIngredients
        recalls
        recommendations
        confidence
        cached
        generatedAt
        provider
      }
    }
  }
`;

