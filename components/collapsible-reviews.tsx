import { GET_PRODUCT_REVIEWS, type GetProductReviewsQuery } from '@/graphql/queries';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLazyQuery } from '@apollo/client/react';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';

interface CollapsibleReviewsProps {
  upcCode: string;
}

export function CollapsibleReviews({ upcCode }: CollapsibleReviewsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';
  const [loadReviews, { loading, error, data, called }] = useLazyQuery<GetProductReviewsQuery>(
    GET_PRODUCT_REVIEWS
  );

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // Load data when opening for the first time
    if (newIsOpen && !called) {
      loadReviews({ variables: { upc: upcCode } });
    }
  };

  const reviewSummary = data?.productByUpc?.reviewSummary;

  const getSentimentColor = (sentiment?: string | null) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return '#34C759';
      case 'negative':
        return '#FF3B30';
      case 'mixed':
        return '#FF9500';
      default:
        return '#8E8E93';
    }
  };

  const getSentimentIcon = (sentiment?: string | null) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'hand.thumbsup.fill';
      case 'negative':
        return 'hand.thumbsdown.fill';
      case 'mixed':
        return 'hand.raised.fill';
      default:
        return 'questionmark.circle';
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={styles.heading}
        onPress={handleToggle}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />
        <IconSymbol name="star.fill" size={20} color="#FF9500" />
        <ThemedText type="defaultSemiBold" style={styles.title}>User Reviews</ThemedText>
      </TouchableOpacity>

      {isOpen && (
        <ThemedView style={styles.content}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <ThemedText style={styles.loadingText}>Loading reviews...</ThemedText>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color="#FF3B30" />
              <ThemedText style={styles.errorText}>Failed to load reviews</ThemedText>
              <ThemedText style={styles.errorDetail}>{error.message}</ThemedText>
            </View>
          )}

          {!loading && !error && !reviewSummary && (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No review data available</ThemedText>
            </View>
          )}

          {reviewSummary && (
            <View style={styles.dataContainer}>
              {/* Sentiment Overview */}
              <View style={styles.sentimentCard}>
                <View style={styles.sentimentHeader}>
                  <IconSymbol 
                    name={getSentimentIcon(reviewSummary.sentiment)} 
                    size={28} 
                    color={getSentimentColor(reviewSummary.sentiment)} 
                  />
                  <View style={styles.sentimentInfo}>
                    <ThemedText style={[styles.sentimentLabel, { color: getSentimentColor(reviewSummary.sentiment) }]}>
                      {reviewSummary.sentiment?.toUpperCase() || 'UNKNOWN'}
                    </ThemedText>
                    {reviewSummary.sentimentScore !== null && (
                      <View style={styles.scoreContainer}>
                        <View style={styles.scoreBar}>
                          <View
                            style={[
                              styles.scoreBarFill,
                              {
                                width: `${(reviewSummary.sentimentScore || 0) * 100}%`,
                                backgroundColor: getSentimentColor(reviewSummary.sentiment),
                              },
                            ]}
                          />
                        </View>
                        <ThemedText style={styles.scoreText}>
                          {((reviewSummary.sentimentScore || 0) * 100).toFixed(0)}%
                        </ThemedText>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Summary */}
              {reviewSummary.summary && (
                <View style={styles.section}>
                  <ThemedText style={styles.summaryText}>{reviewSummary.summary}</ThemedText>
                </View>
              )}

              {/* Pros */}
              {reviewSummary.pros && reviewSummary.pros.length > 0 && (
                <View style={styles.section}>
                  <ThemedText style={styles.sectionTitle}>Pros</ThemedText>
                  <View style={styles.listContainer}>
                    {reviewSummary.pros.map((pro, index) => (
                      pro && (
                        <View key={index} style={styles.listItem}>
                          <IconSymbol name="checkmark.circle.fill" size={14} color="#34C759" />
                          <ThemedText style={styles.listItemText}>{pro}</ThemedText>
                        </View>
                      )
                    ))}
                  </View>
                </View>
              )}

              {/* Cons */}
              {reviewSummary.cons && reviewSummary.cons.length > 0 && (
                <View style={styles.section}>
                  <ThemedText style={styles.sectionTitle}>Cons</ThemedText>
                  <View style={styles.listContainer}>
                    {reviewSummary.cons.map((con, index) => (
                      con && (
                        <View key={index} style={styles.listItem}>
                          <IconSymbol name="xmark.circle.fill" size={14} color="#FF3B30" />
                          <ThemedText style={styles.listItemText}>{con}</ThemedText>
                        </View>
                      )
                    ))}
                  </View>
                </View>
              )}

              {/* Key Themes */}
              {reviewSummary.keyThemes && reviewSummary.keyThemes.length > 0 && (
                <View style={styles.section}>
                  <ThemedText style={styles.sectionTitle}>Key Themes</ThemedText>
                  <View style={styles.themesContainer}>
                    {reviewSummary.keyThemes.map((theme, index) => (
                      theme && (
                        <View key={index} style={styles.themeChip}>
                          <ThemedText style={styles.themeText}>{theme}</ThemedText>
                        </View>
                      )
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(142, 142, 147, 0.2)',
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.7,
  },
  errorContainer: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
  errorDetail: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
  emptyContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
  },
  dataContainer: {
    gap: 12,
  },
  sentimentCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  sentimentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sentimentInfo: {
    flex: 1,
  },
  sentimentLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(142, 142, 147, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  listContainer: {
    gap: 6,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  listItemText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  themesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  themeChip: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  themeText: {
    fontSize: 11,
    fontWeight: '500',
  },
});

