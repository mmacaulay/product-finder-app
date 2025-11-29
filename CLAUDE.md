# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npx expo start              # Start Expo dev server
npm run ios                 # Run on iOS simulator
npm run android             # Run on Android emulator

# Testing
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm test -- path/to/file    # Run specific test file

# Linting & Types
npm run lint                # Run ESLint

# GraphQL
npm run codegen             # Generate types from GraphQL schema (requires API running at localhost:8000)
npm run codegen:watch       # Watch mode for codegen
```

## Architecture

This is an Expo React Native app for scanning product barcodes and displaying product information via a GraphQL API.

### Routing (Expo Router - file-based)
- `app/_layout.tsx` - Root layout with Apollo client setup and context providers
- `app/(tabs)/` - Tab navigation (Find, History)
- `app/camera-modal.tsx` - Modal for barcode scanning

### Data Flow
1. **BarcodeContext** (`contexts/BarcodeContext.tsx`) - Stores scanned barcode data
2. **ProductContext** (`contexts/ProductContext.tsx`) - Stores fetched product data (uses generated GraphQL types)
3. Components fetch product data via Apollo `useQuery` with generated typed document nodes

### GraphQL
- Queries defined in `app/operations.graphql.ts` using `gql` tag
- Generated types in `app/__generated__/graphql.ts` (auto-generated, do not edit)
- Re-exported as typed document nodes from `app/queries.ts`
- Config in `codegen.ts` - schema fetched from `http://127.0.0.1:8000/graphql/`

### Key Components
- `components/product-info.tsx` - Main product display with collapsible sections
- `components/product-basic-info.tsx` - Product image and basic details
- `components/collapsible-reviews.tsx` - Lazy-loaded review summary
- `components/collapsible-safety.tsx` - Lazy-loaded safety analysis

### Environment
- API URL configured via `EXPO_PUBLIC_API_URL` env var (defaults to localhost:8000)
- Configuration in `constants/env.ts`
