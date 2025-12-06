import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { AppColors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HistoryScreen() {
  const { user, logOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logOut();
              router.replace('/(auth)/login');
            } catch {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Search History</ThemedText>
        <ThemedText type="subtitle">View your previous searches and results</ThemedText>

        {user && (
          <ThemedView style={styles.userInfo}>
            <IconSymbol name="person.circle.fill" size={48} color={AppColors.primary} />
            <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
          </ThemedView>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <IconSymbol name="arrow.right.square.fill" size={20} color={AppColors.white} />
          <ThemedText style={styles.logoutButtonText}>Sign Out</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  userInfo: {
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.error,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  logoutButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
