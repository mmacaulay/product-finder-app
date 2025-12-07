import { useLocalSearchParams } from 'expo-router';
import { HistoryProductDetailScreen } from '@/components/history-product-detail-screen';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProductScreen() {
  const { upc } = useLocalSearchParams<{ upc: string }>();
  const insets = useSafeAreaInsets();

  if (!upc) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText>No product UPC provided</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <HistoryProductDetailScreen upc={upc} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
