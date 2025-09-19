import { BarcodeProvider } from "@/contexts/BarcodeContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
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
  );
}
