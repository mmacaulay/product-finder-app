export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/graphql';
export const API_TIMEOUT_MS = Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS ?? 30000);