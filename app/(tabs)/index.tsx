import { useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { getNetworkStateAsync } from "expo-network";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const processingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleBarCodeScanned = useCallback(
    async ({ data }: { data: string }) => {
      setLoading(true);

      if (/^\d{12}$/.test(data)) {
        data = "0" + data;
      } else if (!/^\d{13}$/.test(data)) {
        Alert.alert("Ugyldig strekkode", "Fant ikke en gyldig EAN-13 kode");
        return;      
      }

      if (processingRef.current) return;
      processingRef.current = true;
      console.log("Scanned EAN-13:", data);

      try {
        const networkState = await getNetworkStateAsync();
        if (!networkState.isConnected || !networkState.isInternetReachable) {
          throw new Error("Ingen internettforbindelse");
        }

        const response = await fetch("https://puslespill-api.onrender.com/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ean: data }),
        });

        let result: any = {};
        try {
          const text = await response.text();
          if (text) {
            result = JSON.parse(text);
          }
        } catch (e) {
          result = { status: "not_found" };
        }

        if (result.status === "success") {
          Alert.alert("Suksess", `Lagt til: ${result.title} || "Puslespill`);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (result.status === "already_exists") {
          Alert.alert("Info", "Allerede registrert");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } else {
          Alert.alert("Lagt til", "Registrert (kun strekkode)");
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        router.navigate(`/details/${data}`);
      } catch (error: any) {
        Alert.alert("Feil", error.message || "Noe gikk galt");
      } finally {
        processingRef.current = false;
        setLoading(false);
      }
      }, 
      []
  ); 
    
  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text>Laster kameratillatelse...</Text>
      </View>
    );
  }
    
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Ingen tilgang til kameraet</Text>;
        <Button title="Gi tilgang" onPress={requestPermission} />
      </View>
    );
  }

  if (!isFocused) {
    return null;
  }
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={styles.container}>
        <Text style={styles.instruction}>
          Sikt mot strekkoden på puslespillet
        </Text>

        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "upc_a"],
          }}
          onBarcodeScanned={
            processingRef.current ? undefined : handleBarCodeScanned
          }
        />

        <View style={styles.overlay} />
        {loading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Laster...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" },
    camera: { flex: 1, width: "100%" },
    overlay: {
      position: "absolute",
      width: 250,
      height: 100,
      borderWidth: 2,
      borderColor: "white",
      borderRadius: 10,
      backgroundColor: "transparent",
    },
    instruction: { color: "white", fontSize: 18, marginBottom: 20 },
    centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black"},
    errorText: { color: "#ff6b6b", fontSize: 18, marginBottom: 20},
    successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
    },
    successText: {
      color: "white",
      fontSize: 24,
      marginBottom: 32,
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
    },
    loadingText: {
      color: "white",
      fontSize: 24,
      fontWeight: "bold",
    }
  });

// uvicorn puslespill:app --host 0.0.0.0 --port 8000 --reload --log-level debug
// npx expo start -c 