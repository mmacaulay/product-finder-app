import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppColors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, logOut } = useAuth();
  const insets = useSafeAreaInsets();

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
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Profile</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Manage your account settings
        </ThemedText>

        {user && (
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Account</ThemedText>
            <ThemedView style={styles.userInfo}>
              <IconSymbol name="person.circle.fill" size={64} color={AppColors.primary} />
              <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
            </ThemedView>
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
    paddingTop: 40,
    alignItems: 'center',
    gap: 16,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 8,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    opacity: 0.5,
    letterSpacing: 1,
    marginBottom: 12,
  },
  userInfo: {
    alignItems: 'center',
    gap: 8,
    padding: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.2)',
    width: '100%',
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppColors.error,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  logoutButtonText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
