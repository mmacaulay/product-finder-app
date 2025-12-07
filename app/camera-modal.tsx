import { AppColors } from '@/constants/theme';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CameraModal() {
  const [permission, requestPermission] = useCameraPermissions();
  const hasScannedRef = useRef(false);

  // Reset scan flag when component mounts/unmounts
  useEffect(() => {
    hasScannedRef.current = false;
    return () => {
      hasScannedRef.current = false;
    };
  }, []);

  const handleBarcodeScanned = (barcode: BarcodeScanningResult) => {
    // Prevent multiple scans from firing
    if (hasScannedRef.current) return;

    hasScannedRef.current = true;

    // Dismiss the modal and navigate after a brief delay to ensure clean navigation state
    router.dismiss();

    setTimeout(() => {
      router.push(`/(tabs)/(find)/product?upc=${barcode.data}`);
    }, 100);
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.dismiss()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code128", "code39", "code93", "codabar"],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.dismiss()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.black,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 64,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.white,
  },
  cancelButton: {
    backgroundColor: AppColors.overlay.light,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.white,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 20,
    color: AppColors.white,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
});
