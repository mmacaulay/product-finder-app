import { GET_PRODUCT_SAFETY, type GetProductSafetyQuery } from '@/graphql/queries';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLazyQuery } from '@apollo/client/react';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';

interface CollapsibleSafetyProps {
  upcCode: string;
}

export function CollapsibleSafety({ upcCode }: CollapsibleSafetyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';
  const [loadSafety, { loading, error, data, called }] = useLazyQuery<GetProductSafetyQuery>(
    GET_PRODUCT_SAFETY
  );

  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // Load data when opening for the first time
    if (newIsOpen && !called) {
      loadSafety({ variables: { upc: upcCode } });
    }
  };

  const safetyAnalysis = data?.productByUpc?.safetyAnalysis;

  const getRiskColor = (riskLevel?: string | null) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return '#34C759';
      case 'medium':
        return '#FF9500';
      case 'high':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const getRiskIcon = (riskLevel?: string | null) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return 'checkmark.shield.fill';
      case 'medium':
        return 'exclamationmark.shield.fill';
      case 'high':
        return 'xmark.shield.fill';
      default:
        return 'shield.fill';
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
        <IconSymbol name="shield.fill" size={20} color="#007AFF" />
        <ThemedText type="defaultSemiBold" style={styles.title}>Safety Information</ThemedText>
      </TouchableOpacity>

      {isOpen && (
        <ThemedView style={styles.content}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <ThemedText style={styles.loadingText}>Analyzing safety...</ThemedText>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color="#FF3B30" />
              <ThemedText style={styles.errorText}>Failed to load safety info</ThemedText>
              <ThemedText style={styles.errorDetail}>{error.message}</ThemedText>
            </View>
          )}

          {!loading && !error && !safetyAnalysis && (
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No safety data available</ThemedText>
            </View>
          )}

          {safetyAnalysis && (
            <View style={styles.dataContainer}>
              {/* Risk Level Overview */}
              <View style={[styles.riskCard, { borderColor: getRiskColor(safetyAnalysis.riskLevel) }]}>
                <View style={styles.riskHeader}>
                  <IconSymbol 
                    name={getRiskIcon(safetyAnalysis.riskLevel)} 
                    size={32} 
                    color={getRiskColor(safetyAnalysis.riskLevel)} 
                  />
                  <View style={styles.riskInfo}>
                    <ThemedText style={styles.riskLabel}>Risk Level</ThemedText>
                    <ThemedText style={[styles.riskValue, { color: getRiskColor(safetyAnalysis.riskLevel) }]}>
                      {safetyAnalysis.riskLevel?.toUpperCase() || 'UNKNOWN'}
                    </ThemedText>
                  </View>
                </View>
              </View>

              {/* Summary */}
              {safetyAnalysis.summary && (
                <View style={styles.section}>
                  <ThemedText style={styles.summaryText}>{safetyAnalysis.summary}</ThemedText>
                </View>
              )}

              {/* Allergens */}
              {safetyAnalysis.allergens && safetyAnalysis.allergens.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.iconRow}>
                    <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#FF9500" />
                    <ThemedText style={styles.sectionTitle}>Allergens</ThemedText>
                  </View>
                  <View style={styles.tagContainer}>
                    {safetyAnalysis.allergens.map((allergen, index) => (
                      allergen && (
                        <View key={index} style={styles.allergenTag}>
                          <ThemedText style={styles.allergenText}>{allergen}</ThemedText>
                        </View>
                      )
                    ))}
                  </View>
                </View>
              )}

              {/* Certifications */}
              {safetyAnalysis.certifications && safetyAnalysis.certifications.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.iconRow}>
                    <IconSymbol name="checkmark.seal.fill" size={16} color="#34C759" />
                    <ThemedText style={styles.sectionTitle}>Certifications</ThemedText>
                  </View>
                  <View style={styles.certificationsList}>
                    {safetyAnalysis.certifications.map((cert, index) => (
                      cert && (
                        <View key={index} style={styles.certificationItem}>
                          <IconSymbol name="checkmark.circle.fill" size={14} color="#34C759" />
                          <ThemedText style={styles.certificationText}>{cert}</ThemedText>
                        </View>
                      )
                    ))}
                  </View>
                </View>
              )}

              {/* Harmful Ingredients */}
              {safetyAnalysis.harmfulIngredients && safetyAnalysis.harmfulIngredients.length > 0 && (
                <View style={styles.section}>
                  <ThemedText style={styles.sectionTitle}>Harmful Ingredients</ThemedText>
                  <View style={styles.listContainer}>
                    {safetyAnalysis.harmfulIngredients.map((ingredient, index) => {
                      if (!ingredient) return null;
                      
                      const displayText = typeof ingredient === 'string' 
                        ? ingredient 
                        : ingredient.name || JSON.stringify(ingredient);
                      
                      return (
                        <View key={index} style={styles.listItem}>
                          <IconSymbol name="exclamationmark.circle.fill" size={14} color="#FF3B30" />
                          <ThemedText style={styles.listItemText}>{displayText}</ThemedText>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Recalls */}
              {safetyAnalysis.recalls && safetyAnalysis.recalls.length > 0 && (
                <View style={styles.section}>
                  <ThemedText style={styles.sectionTitle}>Recalls & Safety Issues</ThemedText>
                  <View style={styles.listContainer}>
                    {safetyAnalysis.recalls.map((recall, index) => {
                      if (!recall) return null;
                      
                      const displayText = typeof recall === 'string' 
                        ? recall 
                        : recall.description || JSON.stringify(recall);
                      
                      return (
                        <View key={index} style={styles.recallItem}>
                          <IconSymbol name="exclamationmark.triangle.fill" size={14} color="#FF3B30" />
                          <ThemedText style={styles.recallText}>{displayText}</ThemedText>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Recommendations */}
              {safetyAnalysis.recommendations && (
                <View style={styles.section}>
                  <ThemedText style={styles.sectionTitle}>Recommendations</ThemedText>
                  <ThemedText style={styles.recommendationsText}>
                    {safetyAnalysis.recommendations}
                  </ThemedText>
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
  riskCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  riskInfo: {
    flex: 1,
  },
  riskLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  riskValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  section: {
    gap: 8,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergenTag: {
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderColor: 'rgba(255, 149, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  allergenText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF9500',
  },
  certificationsList: {
    gap: 6,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  certificationText: {
    fontSize: 13,
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
  recallItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  recallText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#FF3B30',
  },
  recommendationsText: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
  },
});

