import { Stack } from 'expo-router';

export default function FindLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="product" />
    </Stack>
  );
}
