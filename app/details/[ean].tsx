import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailsScreen() {
    const router = useRouter();
    const { ean } = useLocalSearchParams<{ ean: string }>();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!ean) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`https://puslespill-api.onrender.com/product/${ean}`);
                const data = await res.json();

                if (data.status === "success") {
                    setProduct(data.product);
                    console.log("Received product:", data.product.ean);
                } else {
                    console.log("Product not in database:", ean)
                    setProduct(null);
                }
            } catch (err) {
                console.log(err)
                setProduct(null);
            } finally {
                setLoading(false)
            }
    };

    fetchProduct();
    }, [ean]);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
                <Text style={{ color: "white", fontSize: 18 }}>Laster...</Text>
            </SafeAreaView>
        );
    }

    if (!product) {
        return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
            <Text style={{ color: "white", fontSize: 18 }}>Produkt ikke funnet</Text>
            <Button title="Tilbake" onPress={() => router.back()} />
        </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <ScrollView contentContainerStyle={{ alignItems: "center", padding: 16}}>
                <View style={{ flex: 1, alignItems: "center", padding: 16 }}>
                    <Text style={{ color: "white", fontSize: 24 }}>{product.title}</Text>
                    <Text style={{ color: "white", fontSize: 18, marginTop: 8 }}>EAN: {product.ean}</Text>
                    <Text style={{ color: "white", fontSize: 16, marginTop: 4 }}>Merke: {product.brand}</Text>
                    <Text style={{ color: "white", fontSize: 16, marginTop: 4 }}>Produsent: {product.manufacturer}</Text>
                    <Text style={{ color: "white", fontSize: 14, marginTop: 8 }}>{product.description}</Text>

                    {product.images && product.images.map((img: string, idx: number) => (
                        <Image key={idx} source={{ uri: img }} style={{ width: 200, height: 200, marginTop: 8 }} />
                    ))}

                    <Button title="Tilbake" onPress={() => router.back()} color="#2196F3" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
