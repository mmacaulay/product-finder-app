import { API_TIMEOUT_MS, API_URL } from "@/constants/env";
import { BarcodeProvider } from "@/contexts/BarcodeContext";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { Stack } from "expo-router";

export default function RootLayout() {

  const timeoutFetch: typeof fetch = (input, init) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    return fetch(input, { ...(init ?? {}), signal: controller.signal })
      .finally(() => clearTimeout(timeoutId));
  };

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri: API_URL, fetch: timeoutFetch }),
  });

  return (
    <ApolloProvider client={client}>
      <BarcodeProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="camera-modal"
            options={{
              headerTitle: 'Scan Barcode',
              presentation: 'modal'
            }}
          />
        </Stack>
      </BarcodeProvider>
    </ApolloProvider>
  );
}
