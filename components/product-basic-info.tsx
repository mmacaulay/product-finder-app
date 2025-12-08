import { AppColors } from '@/constants/theme';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';

interface ProductBasicInfoProps {
  product: {
    upcCode: string;
    brand?: string | null;
    name: string;
    imageUrl?: string | null;
  };
}

export function ProductBasicInfo({ product }: ProductBasicInfoProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageError = (error: { error?: string }) => {
    setImageLoading(false);
    setImageError('failed');
    // Log error for debugging (can be replaced with analytics later)
    console.error('[ProductBasicInfo] Image load failed:', {
      url: product.imageUrl,
      error: error.error,
      upc: product.upcCode,
    });
  };

  return (
    <ThemedView style={styles.container}>
      {/* Product Image */}
      {product.imageUrl && (
        <View style={styles.imageContainer}>
          {imageLoading && !imageError && (
            <View style={styles.imageLoadingContainer}>
              <ActivityIndicator size="large" color={AppColors.primary} />
              <ThemedText style={styles.imageLoadingText}>Loading image...</ThemedText>
            </View>
          )}
          {imageError && (
            <View style={styles.imageErrorContainer}>
              <IconSymbol name="photo.badge.exclamationmark" size={64} color={AppColors.primary} style={styles.errorIcon} />
              <ThemedText style={styles.imageErrorText}>Image Unavailable</ThemedText>
            </View>
          )}
          {!imageError && (
            <Image
              source={{ uri: product.imageUrl }}
              style={[styles.productImage, imageLoading && styles.hiddenImage]}
              contentFit="contain"
              cachePolicy="memory-disk"
              onLoadStart={() => {
                setImageLoading(true);
              }}
              onLoad={() => {
                setImageLoading(false);
              }}
              onError={handleImageError}
            />
          )}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.iconRow}>
          <IconSymbol name="barcode.viewfinder" size={24} color={AppColors.primary} />
          <ThemedText type="subtitle" style={styles.sectionTitle}>Product Information</ThemedText>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Name:</ThemedText>
            <ThemedText style={styles.value}>{product.name}</ThemedText>
          </View>

          {product.brand && (
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Brand:</ThemedText>
              <ThemedText style={styles.value}>{product.brand}</ThemedText>
            </View>
          )}

          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>UPC:</ThemedText>
            <ThemedText style={styles.value}>{product.upcCode}</ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(142, 142, 147, 0.2)',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    minHeight: 300,
  },
  productImage: {
    width: '100%',
    height: 400,
    maxHeight: 500,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hiddenImage: {
    opacity: 0,
  },
  imageLoadingContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  imageLoadingText: {
    fontSize: 14,
    opacity: 0.7,
  },
  imageErrorContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
  },
  errorIcon: {
    opacity: 0.4,
  },
  imageErrorText: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.6,
  },
  section: {
    marginBottom: 8,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
  },
  infoCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 122, 255, 0.1)',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    width: 80,
    opacity: 0.7,
  },
  value: {
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
});

