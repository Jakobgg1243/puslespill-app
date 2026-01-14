import { useRouter } from "expo-router";
import React from "react";
import { Button, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
    const router = useRouter();
    const dummyData = [
        { ean: "628136602518"},
        { ean: "8005125392049"},
        { ean: "7072611003155"},
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <View style={{ flex: 1, padding: 16, backgroundColor: "black" }}>
                <Text style={{ color: "white", fontSize: 20, marginBottom: 16}}>Scan historikk</Text>
                <FlatList 
                    data={dummyData}
                    keyExtractor={(item) => item.ean}
                    renderItem={({ item}) => (
                        <Button title={item.ean} onPress={() => router.navigate(`/details/${item.ean}`)} />
                    )}
                />
            </View>
        </SafeAreaView>    )
}