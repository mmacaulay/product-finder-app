import { GET_PRODUCT, type GetProductQuery } from '@/app/queries';
import { BarcodeData, useBarcode } from '@/contexts/BarcodeContext';
import { useQuery } from '@apollo/client/react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CollapsibleReviews } from './collapsible-reviews';
import { CollapsibleSafety } from './collapsible-safety';
import { ProductBasicInfo } from './product-basic-info';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';

export function ProductInfo({ barcodeData }: { barcodeData: BarcodeData }) {
    const { setBarcodeData } = useBarcode();
    const { loading, error, data } = useQuery<GetProductQuery>(GET_PRODUCT, {
        variables: { upc: barcodeData.data },
    });

    const handleBack = () => {
        setBarcodeData(null);
    };

    if (loading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator testID="loading" size="large" color="#007AFF" />
                <ThemedText style={styles.loadingText}>Loading product...</ThemedText>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView style={styles.resultContainer}>
                <Text style={styles.errorText}>Error: {error.message}</Text>
            </ThemedView>
        );
    }

    const product = data?.productByUpc;

    if (!product) {
        return (
            <ThemedView style={styles.resultContainer}>
                <ThemedText type="subtitle">No product found</ThemedText>
                <ThemedText style={styles.barcodeType}>UPC: {barcodeData.data}</ThemedText>
            </ThemedView>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={handleBack}
                    activeOpacity={0.7}
                >
                    <IconSymbol 
                        name={Platform.OS === 'ios' ? 'chevron.left' : 'arrow.left'}
                        size={24} 
                        color="#007AFF" 
                    />
                    <ThemedText style={styles.backButtonText}>
                        {Platform.OS === 'ios' ? 'Find Products' : ''}
                    </ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle} numberOfLines={1}>
                    {product.name}
                </ThemedText>
                <View style={styles.headerSpacer} />
            </View>

            {/* Content */}
            <ScrollView 
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <ProductBasicInfo product={product} />
                <CollapsibleReviews upcCode={product.upcCode} />
                <CollapsibleSafety upcCode={product.upcCode} />
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(142, 142, 147, 0.2)',
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      minWidth: Platform.OS === 'ios' ? 120 : 48,
    },
    backButtonText: {
      fontSize: 17,
      color: '#007AFF',
      marginLeft: 4,
    },
    headerTitle: {
      flex: 1,
      fontSize: 17,
      fontWeight: '600',
      textAlign: 'center',
      paddingHorizontal: 8,
    },
    headerSpacer: {
      width: Platform.OS === 'ios' ? 120 : 48,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 16,
      padding: 20,
    },
    loadingText: {
      fontSize: 16,
      opacity: 0.7,
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
    scrollContainer: {
      flex: 1,
    },
  });
  