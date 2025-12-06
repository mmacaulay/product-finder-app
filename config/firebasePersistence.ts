import * as SecureStore from 'expo-secure-store';
import { Persistence } from 'firebase/auth';

// Custom persistence adapter using Expo SecureStore
// This provides encrypted storage for auth tokens
export function getExpoSecureStorePersistence(): Persistence {
  return {
    async _get(key: string): Promise<string | null> {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (error) {
        console.error('SecureStore get error:', error);
        return null;
      }
    },
    async _remove(key: string): Promise<void> {
      try {
        await SecureStore.deleteItemAsync(key);
      } catch (error) {
        console.error('SecureStore remove error:', error);
      }
    },
    async _set(key: string, value: string): Promise<void> {
      try {
        await SecureStore.setItemAsync(key, value);
      } catch (error) {
        console.error('SecureStore set error:', error);
      }
    },
    async _isAvailable(): Promise<boolean> {
      return true;
    },
    type: 'LOCAL',
  };
}
