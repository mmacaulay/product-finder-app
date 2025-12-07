import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { HistoryItem } from '@/components/history-item';
import { useHistory } from '@/contexts/HistoryContext';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppColors } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const { history, loading } = useHistory();
  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <ThemedText style={styles.loadingText}>Loading history...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (history.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.centerContainer}>
          <IconSymbol name="clock" size={64} color={AppColors.primary} style={styles.emptyIcon} />
          <ThemedText type="title" style={styles.emptyTitle}>No History Yet</ThemedText>
          <ThemedText type="subtitle" style={styles.emptySubtitle}>
            Scan a product to start building your history
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Search History</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          {history.length} {history.length === 1 ? 'item' : 'items'}
        </ThemedText>
      </ThemedView>

      <FlatList
        data={history}
        keyExtractor={(item) => `${item.upc}-${item.timestamp}`}
        renderItem={({ item }) => <HistoryItem item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  centerContainer: {
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
  emptyIcon: {
    opacity: 0.3,
    marginBottom: 8,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
});
