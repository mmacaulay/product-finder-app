import { API_TIMEOUT_MS, API_URL } from "@/constants/env";
import { AuthProvider } from "@/contexts/AuthContext";
import { HistoryProvider } from "@/contexts/HistoryContext";
import { ApolloClient, HttpLink, ApolloLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { Stack } from "expo-router";
import { auth } from "@/config/firebase";
import { createApolloCache } from "@/config/apollo-cache";

export default function RootLayout() {

  const timeoutFetch: typeof fetch = (input, init) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
    return fetch(input, { ...(init ?? {}), signal: controller.signal })
      .finally(() => clearTimeout(timeoutId));
  };

  // Auth link to add Firebase ID token to requests
  const authLink = setContext(async (_, { headers }) => {
    const user = auth.currentUser;
    let token = null;

    if (user) {
      try {
        token = await user.getIdToken();
      } catch (error) {
        console.error('Error getting ID token:', error);
      }
    }

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const httpLink = new HttpLink({
    uri: API_URL,
    fetch: timeoutFetch
  });

  const client = new ApolloClient({
    cache: createApolloCache(),
    link: ApolloLink.from([authLink, httpLink]),
  });

  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <HistoryProvider>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="camera-modal"
              options={{
                headerTitle: 'Scan Barcode',
                presentation: 'modal'
              }}
            />
          </Stack>
        </HistoryProvider>
      </ApolloProvider>
    </AuthProvider>
  );
}
