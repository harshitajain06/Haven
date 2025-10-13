import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="notifications" />
      <Stack.Screen name="messages" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="create-post" />
      <Stack.Screen name="adult-zone" />
      <Stack.Screen name="thank-you" />
      <Stack.Screen name="case-progress" />
    </Stack>
  );
}

