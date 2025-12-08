import { HistoryItem as HistoryItemType } from '@/contexts/HistoryContext';
import { AppColors } from '@/constants/theme';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { useRouter } from 'expo-router';
import { useState } from 'react';

interface HistoryItemProps {
  item: HistoryItemType;
}

export function HistoryItem({ item }: HistoryItemProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    // Show date for older items
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const productNotFound = item.product === null;

  const handlePress = () => {
    router.push({
      pathname: '/(tabs)/(history)/detail',
      params: { upc: item.upc }
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={handlePress}
    >
        <ThemedView style={styles.content}>
        {/* Product Image or Icon */}
        <View style={styles.imageContainer}>
          {item.product?.imageUrl && !imageError ? (
            <Image
              source={{ uri: item.product.imageUrl }}
              style={styles.productImage}
              contentFit="cover"
              cachePolicy="memory-disk"
              onError={(error) => {
                setImageError(true);
                // Log error for debugging (can be replaced with analytics later)
                console.error('[HistoryItem] Image load failed:', {
                  url: item.product?.imageUrl,
                  error: error.error,
                  upc: item.upc,
                });
              }}
            />
          ) : (
            <View style={[styles.iconPlaceholder, productNotFound && styles.iconPlaceholderError]}>
              <IconSymbol
                name={productNotFound ? 'exclamationmark.circle' : 'photo'}
                size={24}
                color={productNotFound ? AppColors.error : AppColors.primary}
              />
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <ThemedText style={styles.productName} numberOfLines={1}>
            {item.product?.name || 'Product not found'}
          </ThemedText>

          {item.product?.brand && (
            <ThemedText style={styles.brand} numberOfLines={1}>
              {item.product.brand}
            </ThemedText>
          )}

          <ThemedText style={styles.upc} numberOfLines={1}>
            UPC: {item.upc}
          </ThemedText>
        </View>

        {/* Timestamp and Arrow */}
        <View style={styles.rightContainer}>
          <ThemedText style={styles.timestamp}>
            {formatTimeAgo(item.timestamp)}
          </ThemedText>
          <IconSymbol
            name="chevron.right"
            size={20}
            color={AppColors.primary}
            style={styles.chevron}
          />
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  iconPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholderError: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  infoContainer: {
    flex: 1,
    gap: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  brand: {
    fontSize: 14,
    opacity: 0.7,
  },
  upc: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  rightContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.5,
  },
  chevron: {
    opacity: 0.3,
  },
});
