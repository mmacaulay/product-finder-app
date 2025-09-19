import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useBarcode } from '@/contexts/BarcodeContext';

export default function FindScreen() {
  const { barcodeData } = useBarcode();

  const handleScan = () => {
    router.push('/camera-modal');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Find Products</ThemedText>
        <ThemedText type="default" style={styles.bodyText}>Tap scan and then hold the camera over the product&apos;s barcode.</ThemedText>
        
        {barcodeData && (
          <ThemedView style={styles.resultContainer}>
            <ThemedText type="subtitle">Scanned Barcode:</ThemedText>
            <ThemedText style={styles.barcodeData}>{barcodeData.data}</ThemedText>
            <ThemedText style={styles.barcodeType}>Type: {barcodeData.type}</ThemedText>
          </ThemedView>
        )}
        
        <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
          <IconSymbol name="camera.fill" size={24} color="#fff" />
          <ThemedText style={styles.scanButtonText}>Scan</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bodyText: {
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  barcodeData: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
  },
  barcodeType: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});
