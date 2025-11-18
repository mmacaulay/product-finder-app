import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';

interface ProductBasicInfoProps {
  product: {
    upcCode: string;
    brand?: string | null;
    name: string;
  };
}

export function ProductBasicInfo({ product }: ProductBasicInfoProps) {
  return (
    <ThemedView style={styles.container}>
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

