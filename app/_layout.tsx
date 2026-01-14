import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack >
    <Stack.Screen name="index" options={{ title: "Skann strekkode" }} />
    <Stack.Screen name="history" options={{ title: "Scan historikk" }} />
    <Stack.Screen name="details/[ean]" options={{ title: "Produktdetaljer" }} />
  </Stack>;
}
