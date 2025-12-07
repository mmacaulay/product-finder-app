# Product Finder

A React Native mobile app for scanning product barcodes and getting instant information including AI-powered review summaries and safety analysis.

## Features

- **Firebase Authentication** - Secure email/password authentication
- **Barcode Scanning** - Scan UPC, EAN, QR codes and more using your device camera
- **Product Lookup** - Fetch product details from a GraphQL API with authenticated requests
- **AI Review Summaries** - Get aggregated review insights with sentiment analysis, pros/cons, and key themes
- **Safety Analysis** - View risk levels, allergens, certifications, harmful ingredients, and recalls
- **Search History** - Track previously scanned products

## Screenshots

| Find Products | Product Details | Safety Info |
|--------------|-----------------|-------------|
| Scan screen  | Product view    | Safety view |

## Tech Stack

- **Framework**: [Expo](https://expo.dev) (React Native)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- **Data Fetching**: [Apollo Client](https://www.apollographql.com/docs/react/) with GraphQL
- **Type Generation**: [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)

## Getting Started

### Prerequisites

- Node.js 18+
- iOS Simulator, Android Emulator, or physical device with [Expo Go](https://expo.dev/go)
- GraphQL API running (default: `http://localhost:8000/graphql/`)

### Installation

```bash
# Install dependencies
npm install

# Generate GraphQL types (requires API running)
npm run codegen

# Start the development server
npx expo start
```

### Running the App

After starting the dev server, you can:

- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Scan the QR code with Expo Go on your device

## Scripts

| Command | Description |
|---------|-------------|
| `npx expo start` | Start Expo dev server |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in web browser |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |
| `npm run codegen` | Generate GraphQL types |
| `npm run codegen:watch` | Generate types in watch mode |

## Environment Variables

Create a `.env` file in the root directory (use `.env.example` as a template):

| Variable | Default | Description |
|----------|---------|-------------|
| `EXPO_PUBLIC_API_URL` | `http://localhost:8000/graphql/` | GraphQL API endpoint |
| `EXPO_PUBLIC_API_TIMEOUT_MS` | `30000` | API request timeout |
| `EXPO_PUBLIC_FIREBASE_API_KEY` | - | Firebase API key (required) |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | - | Firebase auth domain (required) |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | - | Firebase project ID (required) |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | - | Firebase storage bucket |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | - | Firebase messaging sender ID |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | - | Firebase app ID (required) |

## GraphQL Code Generation

This project uses GraphQL Code Generator for full type safety. The schema is fetched from your running API:

```bash
# One-time generation
npm run codegen

# Watch mode during development
npm run codegen:watch
```

Generated types are output to `graphql/__generated__/graphql.ts`. Import typed document nodes from `graphql/queries.ts`:

```typescript
import { useQuery } from '@apollo/client';
import { GET_PRODUCT, type GetProductQuery } from '@/graphql/queries';

const { data } = useQuery<GetProductQuery>(GET_PRODUCT, {
  variables: { upc: '012345678901' }
});
```

## License

Private
