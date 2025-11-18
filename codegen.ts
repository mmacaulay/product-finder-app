import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // Schema source - using introspection from local dev server
  schema: 'http://127.0.0.1:8000/graphql/',
  
  // Documents - where your GraphQL queries, mutations, and fragments are located
  documents: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  
  // Generate TypeScript types and operations
  generates: {
    // Main generated file with types and typed document nodes
    './app/__generated__/graphql.ts': {
      plugins: [
        'typescript',                    // Generate TypeScript types from schema
        'typescript-operations',         // Generate TypeScript types for operations
        'typed-document-node',           // Generate typed DocumentNode for better type inference
      ],
      config: {
        // Configuration options for better type safety
        avoidOptionals: false,
        maybeValue: 'T | null',
        skipTypename: false,
        useTypeImports: true,
      },
    },
    
    // Optional: Generate schema as a separate introspection file for reference
    './app/__generated__/schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
  
  // Codegen behavior options
  config: {
    // Use ESM imports
    useIndexSignature: true,
  },
  
  // Hook to run before/after generation
  hooks: {
    afterAllFileWrite: ['npx eslint --fix'],
  },
};

export default config;

