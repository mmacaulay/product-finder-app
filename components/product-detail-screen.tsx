import { GET_PRODUCT, type GetProductQuery } from '@/graphql/queries';
import { useHistory } from '@/contexts/HistoryContext';
import { AppColors } from '@/constants/theme';
import { useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CollapsibleReviews } from './collapsible-reviews';
import { CollapsibleSafety } from './collapsible-safety';
import { ProductBasicInfo } from './product-basic-info';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { router } from 'expo-router';

interface ProductDetailScreenProps {
  upc: string;
}

export function ProductDetailScreen({ upc }: ProductDetailScreenProps) {
    const { addToHistory } = useHistory();
    const { loading, error, data } = useQuery<GetProductQuery>(GET_PRODUCT, {
        variables: { upc },
    });

    // Add to history when we get a successful response (whether product found or not)
    useEffect(() => {
        if (data !== undefined && !loading && !error) {
            const product = data.productByUpc;
            addToHistory({
                upc,
                product: product ? {
                    name: product.name,
                    brand: product.brand,
                    upcCode: product.upcCode,
                    imageUrl: product.imageUrl,
                } : null,
            });
        }
    }, [data, loading, error, upc, addToHistory]);

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator testID="loading" size="large" color={AppColors.primary} />
                <ThemedText style={styles.loadingText}>Loading product...</ThemedText>
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView style={styles.errorContainer}>
                <IconSymbol name="exclamationmark.triangle.fill" size={48} color={AppColors.error} />
                <ThemedText style={styles.errorText}>Failed to load product</ThemedText>
                <ThemedText style={styles.errorMessage}>{error.message}</ThemedText>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    const product = data?.productByUpc;

    if (!product) {
        return (
            <ThemedView style={styles.errorContainer}>
                <IconSymbol name="exclamationmark.circle.fill" size={48} color={AppColors.primary} />
                <ThemedText type="subtitle">No product found</ThemedText>
                <ThemedText style={styles.barcodeType}>UPC: {upc}</ThemedText>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerBackButton}
                    onPress={handleBack}
                    activeOpacity={0.7}
                >
                    <IconSymbol
                        name={Platform.OS === 'ios' ? 'chevron.left' : 'arrow.left'}
                        size={24}
                        color={AppColors.primary}
                    />
                    <ThemedText style={styles.headerBackButtonText}>
                        {Platform.OS === 'ios' ? 'Back' : ''}
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
                contentContainerStyle={styles.scrollContent}
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
    headerBackButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      minWidth: Platform.OS === 'ios' ? 80 : 48,
    },
    headerBackButtonText: {
      fontSize: 17,
      color: AppColors.primary,
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
      width: Platform.OS === 'ios' ? 80 : 48,
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
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
      padding: 20,
    },
    errorText: {
      fontSize: 18,
      fontWeight: '600',
      color: AppColors.error,
      textAlign: 'center',
    },
    errorMessage: {
      fontSize: 14,
      opacity: 0.7,
      textAlign: 'center',
    },
    backButton: {
      backgroundColor: AppColors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 16,
    },
    backButtonText: {
      color: AppColors.white,
      fontSize: 16,
      fontWeight: '600',
    },
    scrollContainer: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 120,
    },
  });
