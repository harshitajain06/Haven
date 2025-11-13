import { Stack } from 'expo-router';

export default function GamesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="memory" />
      <Stack.Screen name="puzzle" />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="coloring" />
      <Stack.Screen name="story" />
      <Stack.Screen name="mindfulness" />
      <Stack.Screen name="wordsearch" />
      <Stack.Screen name="math" />
    </Stack>
  );
}

