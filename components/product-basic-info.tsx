import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
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

  const handleImageError = (error: any) => {
    console.log('Image load error:', error);
    console.log('Image URL:', product.imageUrl);
    console.log('Error details:', JSON.stringify(error.nativeEvent, null, 2));
    
    setImageLoading(false);
    setImageError(error.nativeEvent?.error || 'Unknown error');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Product Image */}
      {product.imageUrl && (
        <View style={styles.imageContainer}>
          {imageLoading && !imageError && (
            <View style={styles.imageLoadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <ThemedText style={styles.imageLoadingText}>Loading image...</ThemedText>
            </View>
          )}
          {imageError && (
            <View style={styles.imageErrorContainer}>
              <IconSymbol name="exclamationmark.triangle" size={48} color="#FF3B30" />
              <ThemedText style={styles.imageErrorText}>Failed to load image</ThemedText>
              <ThemedText style={styles.imageUrlText} selectable>{product.imageUrl}</ThemedText>
              <ThemedText style={styles.imageErrorDetails} selectable>Error: {imageError}</ThemedText>
            </View>
          )}
          {!imageError && (
            <Image
              source={{ uri: product.imageUrl }}
              style={[styles.productImage, imageLoading && styles.hiddenImage]}
              resizeMode="contain"
              onLoadStart={() => {
                console.log('Image load started:', product.imageUrl);
                setImageLoading(true);
              }}
              onLoadEnd={() => {
                console.log('Image loaded successfully:', product.imageUrl);
                setImageLoading(false);
              }}
              onError={handleImageError}
            />
          )}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.iconRow}>
          <IconSymbol name="barcode.viewfinder" size={24} color="#007AFF" />
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
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
    minHeight: 300,
  },
  productImage: {
    width: '100%',
    height: 400,
    maxHeight: 500,
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
    gap: 8,
    padding: 16,
  },
  imageErrorText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '600',
  },
  imageUrlText: {
    fontSize: 10,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 4,
  },
  imageErrorDetails: {
    fontSize: 11,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
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

