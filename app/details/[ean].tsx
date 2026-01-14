import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";

export default function DetailsScreen() {
  const router = useRouter();
  const { ean } = useLocalSearchParams<{ ean: string }>();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
      <Text style={{ color: "white", fontSize: 24 }}>EAN: {ean}</Text>
      <Text style={{ color: "white", fontSize: 18, marginTop: 10 }}>Produktdetaljer kommer her...</Text>
      <Button title="Tilbake" onPress={() => router.back()} color="#2196F3" />
    </View>
  );
}
