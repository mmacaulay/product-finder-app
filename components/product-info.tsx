import { GET_PRODUCT } from '@/app/queries';
import { BarcodeData } from '@/contexts/BarcodeContext';
import { ProductData, useProduct } from '@/contexts/ProductContext';
import { useQuery } from '@apollo/client/react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export function ProductInfo({ barcodeData }: { barcodeData: BarcodeData }) {
    const { setProductData } = useProduct();
    const { loading, error, data } = useQuery<ProductData>(GET_PRODUCT, {
        variables: { upc: barcodeData.data },
    });

    if (loading) return <ActivityIndicator testID="loading" size="large" color="#0000ff" />;
    if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;

    const product = data?.productByUpc;

    if (!product) {
        return (
            <ThemedView style={styles.resultContainer}>
                <ThemedText type="subtitle">No product found</ThemedText>
                <ThemedText style={styles.barcodeType}>UPC: {barcodeData.data}</ThemedText>
            </ThemedView>
        );
    }

    console.log('data from apollo:', data);
    return (
        <ThemedView style={styles.resultContainer}>
            <ThemedText type="subtitle">Scanned UPC:</ThemedText>
            <ThemedText style={styles.barcodeType}>{barcodeData.data}</ThemedText>
            <ThemedText style={styles.barcodeType}>Type: {barcodeData.type}</ThemedText>

            <ThemedText type="subtitle">Product Data:</ThemedText>
            <ThemedText style={styles.barcodeType}>UPC: {product.upcCode}</ThemedText>
            <ThemedText style={styles.barcodeType}>Brand: {product.brand || 'N/A'}</ThemedText>
            <ThemedText style={styles.barcodeType}>Name: {product.name}</ThemedText>
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
    errorText: {
      color: 'red',
      fontSize: 14,
      textAlign: 'center',
    },
  });
  