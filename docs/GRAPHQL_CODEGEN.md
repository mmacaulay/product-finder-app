# GraphQL Code Generation Setup

This project uses [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) to automatically generate TypeScript types from the GraphQL API schema.

## Quick Start

### Local Development

1. Make sure your GraphQL API is running at `http://127.0.0.1:8000/`
2. Run code generation:
   ```bash
   npm run codegen
   ```

### Watch Mode

For automatic regeneration during development:
```bash
npm run codegen:watch
```

## Configuration

The configuration is in `codegen.ts` at the project root.

### Current Setup

- **Schema Source**: `http://127.0.0.1:8000/graphql/` (local dev server)
- **Documents**: All `.ts` and `.tsx` files in `graphql/` and `components/`
- **Output**: `graphql/__generated__/graphql.ts`
- **Additional Output**: `graphql/__generated__/schema.graphql` (for reference)

### Plugins Used

1. **typescript** - Generates TypeScript types from the GraphQL schema
2. **typescript-operations** - Generates TypeScript types for your GraphQL operations
3. **typed-document-node** - Generates typed DocumentNode for better type inference with Apollo Client
4. **schema-ast** - Generates a readable `.graphql` schema file

## CI/CD Integration

### Option 1: Use Remote Endpoint

Update `codegen.ts` to use an environment variable:

```typescript
schema: process.env.GRAPHQL_ENDPOINT || 'http://127.0.0.1:8000/graphql/'
```

Then in your CI pipeline:

```bash
GRAPHQL_ENDPOINT=https://your-api.com/graphql/ npm run codegen
```

### Option 2: Schema Introspection File

Download the schema during CI:

```bash
# Using introspection query
curl -X POST \
  -H "Content-Type: application/json" \
  --data '{"query": "query IntrospectionQuery { __schema { queryType { name } mutationType { name } subscriptionType { name } types { ...FullType } directives { name description locations args { ...InputValue } } } } fragment FullType on __Type { kind name description fields(includeDeprecated: true) { name description args { ...InputValue } type { ...TypeRef } isDeprecated deprecationReason } inputFields { ...InputValue } interfaces { ...TypeRef } enumValues(includeDeprecated: true) { name description isDeprecated deprecationReason } possibleTypes { ...TypeRef } } fragment InputValue on __InputValue { name description type { ...TypeRef } defaultValue } fragment TypeRef on __Type { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name } } } } } } } }"}' \
  https://your-api.com/graphql/ > schema.json
```

Or using the GraphQL CLI:

```bash
npx graphql-cli get-schema --endpoint https://your-api.com/graphql/ --output schema.json
```

Then update `codegen.ts`:

```typescript
schema: './schema.json'
```

### Option 3: GitHub Actions Example

See `.github/workflows/codegen-example.yml.disabled` for a complete example workflow.

## Generated Files

### `graphql/__generated__/graphql.ts`

Contains:
- All GraphQL schema types (e.g., `ProductType`, `Query`, etc.)
- Operation types for your queries/mutations (e.g., `GetProductQuery`, `GetProductQueryVariables`)
- Typed document nodes (e.g., `GetProductDocument`)

### `graphql/__generated__/schema.graphql`

A readable GraphQL schema file for reference. This is useful for:
- Understanding the API structure
- Documentation
- IDE autocomplete in `.graphql` files

## Usage in Code

### Before Code Generation

```typescript
import { gql } from '@apollo/client';

const GET_PRODUCT = gql`
  query GetProduct($upc: String!) {
    productByUpc(upc: $upc) {
      upcCode
      brand
      name
    }
  }
`;

// Manual type definition
interface ProductData {
  productByUpc: {
    upcCode: string;
    brand: string | null;
    name: string;
  } | null;
}

const { data } = useQuery<ProductData>(GET_PRODUCT, {
  variables: { upc: '123' }
});
```

### After Code Generation

```typescript
import { GET_PRODUCT } from '@/graphql/queries'; // Exports GetProductDocument
import type { GetProductQuery } from '@/graphql/__generated__/graphql';

// Types are automatically generated and imported
const { data } = useQuery<GetProductQuery>(GET_PRODUCT, {
  variables: { upc: '123' }
});

// data is fully typed with autocomplete!
// data.productByUpc.upcCode - all properties are typed
```

## Benefits

1. **Type Safety**: Full TypeScript type safety for all GraphQL operations
2. **Autocomplete**: IDE autocomplete for all fields
3. **Error Detection**: Catch errors at compile-time instead of runtime
4. **Refactoring**: Rename fields in your API and immediately see what breaks
5. **Documentation**: Generated types serve as documentation
6. **Sync**: Keep frontend and backend in sync automatically

## Troubleshooting

### Schema Endpoint Issues

If you get errors about the endpoint:

1. Make sure your API server is running
2. Check the URL (Django requires trailing slash: `/graphql/`)
3. Verify CORS is configured if needed
4. Check authentication headers if your API requires them

### Generated Files Not Found

Make sure to run `npm run codegen` after:
- Cloning the repository
- Adding new GraphQL queries
- When the API schema changes

### Type Errors

If you get type errors after regeneration:

1. The API schema may have changed
2. Update your queries to match the new schema
3. Run `npm run codegen` again

## Best Practices

1. **Commit Generated Files**: Commit `graphql/__generated__/` to version control so team members don't need to run codegen immediately
2. **Run Before Build**: Add codegen as a prebuild step in your deployment pipeline
3. **Watch Mode**: Use `npm run codegen:watch` during active development
4. **Regular Updates**: Regenerate types regularly when the API changes
5. **CI Checks**: Add a CI step to verify generated files are up-to-date

## Related Documentation

- [GraphQL Code Generator Docs](https://the-guild.dev/graphql/codegen/docs/getting-started)
- [Apollo Client TypeScript Docs](https://www.apollographql.com/docs/react/development-testing/static-typing/)
- [TypedDocumentNode](https://github.com/dotansimha/graphql-typed-document-node)

