import { InMemoryCache, InMemoryCacheConfig } from '@apollo/client';

/**
 * Apollo Client cache configuration optimized for product data
 *
 * Key optimizations:
 * 1. Normalizes products by UPC code (our primary query key) for efficient lookups
 * 2. Merges nested fields (reviewSummary, safetyAnalysis) to preserve data
 * 3. Reduces network requests by leveraging cached data
 */
export const cacheConfig: InMemoryCacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        // Cache product queries by UPC code
        productByUpc: {
          // Use UPC as part of the cache key to distinguish different product queries
          keyArgs: ['upc'],
          // Merge incoming data with existing cached data
          merge(existing, incoming) {
            return incoming;
          },
        },
        productById: {
          // Use ID as part of the cache key
          keyArgs: ['id'],
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
    ProductType: {
      // Use UPC code as the cache identifier (since we query by UPC)
      keyFields: ['upcCode'],
      fields: {
        // Merge review summary data instead of overwriting
        reviewSummary: {
          merge(existing, incoming) {
            // Always prefer incoming data if it exists
            return incoming || existing;
          },
        },
        // Merge safety analysis data instead of overwriting
        safetyAnalysis: {
          merge(existing, incoming) {
            // Always prefer incoming data if it exists
            return incoming || existing;
          },
        },
      },
    },
  },
};

/**
 * Create and configure the Apollo InMemoryCache
 */
export function createApolloCache(): InMemoryCache {
  return new InMemoryCache(cacheConfig);
}
