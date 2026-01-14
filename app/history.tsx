import { useRouter } from "expo-router";
import React from "react";
import { Button, FlatList, Text, View } from "react-native";

export default function HistoryScreen() {
    const router = useRouter();
    const dummyData = [
        { ean: "7045952001235"},
        { ean: "8005125392049"},
        { ean: "7072611003155"},
    ];

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: "black" }}>
            <Text style={{ color: "white", fontSize: 20, marginBottom: 16}}>Scan historikk</Text>
            <FlatList 
                data={dummyData}
                keyExtractor={(item) => item.ean}
                renderItem={({ item}) => (
                    <Button title={item.ean} onPress={() => router.push(`/details/${item.ean}`)} />
                )}
            />
        </View>
    )
}