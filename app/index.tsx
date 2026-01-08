import { Text, View, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState, useEffect, useRef} from "react";

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const processingRef = useRef(false);
  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (processingRef.current) return;
    processingRef.current = true;

    setScanned(true);
    console.log("Scanned data:", data);

    try {
      const response = await fetch("https://puslespill-api.onrender.com/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ean: data }),
      });

      const result = await response.json();

      if (result.status === "success") {
        alert(`Lagt til: ${result.title}`);
      } else if (result.status === "already_exists") {
        alert("Allerede registrert");
      } else {
        alert("Lagt til (bare barcode)");
      }

    } catch (error) {
      alert("Nettverksfeil | sjekk serveren");
    } finally {
      processingRef.current = false;
    }
  };

  if (!permission) return <Text>Requesting camera permission...</Text>;
  if (!permission.granted) return <Text>No access to camera</Text>;

  return (
    <View
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!scanned && (
        <CameraView
          style={{ width: 300, height: 300 }}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: [
              "ean13"
            ]
          }}
          onBarcodeScanned={(scanned || processingRef.current) ? undefined : handleBarCodeScanned}
        />
      )}
      {scanned && <Button title="Scan again" onPress={() => setScanned(false)} />}
    </View>
  );
}

// uvicorn puslespill:app --host 0.0.0.0 --port 8000 --reload --log-level debug
// npx expo start -c 