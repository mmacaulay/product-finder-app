import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="camera-modal" 
        options={{ 
          presentation: 'modal',
          headerTitle: 'Scan Barcode',
          headerBackTitle: 'Back'
        }} 
      />
    </Stack>
  );
}
