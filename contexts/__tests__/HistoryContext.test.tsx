import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { HistoryProvider, useHistory, HistoryItem } from '../HistoryContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_STORAGE_KEY = '@product_history';

describe('HistoryContext', () => {
  const mockStorage: Record<string, string> = {};

  beforeEach(() => {
    // Clear storage
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);

    // Create stateful mocks that track storage
    (AsyncStorage.getItem as jest.Mock) = jest.fn((key: string) =>
      Promise.resolve(mockStorage[key] || null)
    );
    (AsyncStorage.setItem as jest.Mock) = jest.fn((key: string, value: string) => {
      mockStorage[key] = value;
      return Promise.resolve();
    });
    (AsyncStorage.removeItem as jest.Mock) = jest.fn((key: string) => {
      delete mockStorage[key];
      return Promise.resolve();
    });
  });

  describe('Provider initialization', () => {
    it('provides history context to children', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HistoryProvider>{children}</HistoryProvider>
      );

      const { result } = renderHook(() => useHistory(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).toBeDefined();
      expect(result.current.history).toEqual([]);
    });

    it('throws error when useHistory is used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useHistory());
      }).toThrow('useHistory must be used within a HistoryProvider');

      consoleSpy.mockRestore();
    });

    it('loads history from AsyncStorage on mount', async () => {
      const mockHistory: HistoryItem[] = [
        {
          upc: '123456789012',
          timestamp: Date.now(),
          product: {
            name: 'Test Product',
            brand: 'Test Brand',
            upcCode: '123456789012',
            imageUrl: 'https://example.com/image.jpg',
          },
        },
      ];

      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(mockHistory));

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HistoryProvider>{children}</HistoryProvider>
      );

      const { result } = renderHook(() => useHistory(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.history).toEqual(mockHistory);
    });
  });

  describe('addToHistory', () => {
    it('adds new item to history', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HistoryProvider>{children}</HistoryProvider>
      );

      const { result } = renderHook(() => useHistory(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newItem = {
        upc: '123456789012',
        product: {
          name: 'Test Product',
          brand: 'Test Brand',
          upcCode: '123456789012',
          imageUrl: 'https://example.com/image.jpg',
        },
      };

      await act(async () => {
        await result.current.addToHistory(newItem);
      });

      await waitFor(() => {
        expect(result.current.history).toHaveLength(1);
        expect(result.current.history[0].upc).toBe(newItem.upc);
        expect(result.current.history[0].product).toEqual(newItem.product);
        expect(result.current.history[0].timestamp).toBeDefined();
      });
    });

    it('adds product not found item to history', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HistoryProvider>{children}</HistoryProvider>
      );

      const { result } = renderHook(() => useHistory(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newItem = {
        upc: '999999999999',
        product: null,
      };

      await act(async () => {
        await result.current.addToHistory(newItem);
      });

      await waitFor(() => {
        expect(result.current.history).toHaveLength(1);
        expect(result.current.history[0].upc).toBe(newItem.upc);
        expect(result.current.history[0].product).toBeNull();
      });
    });

    it('moves existing item to top when scanned again', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HistoryProvider>{children}</HistoryProvider>
      );

      const { result } = renderHook(() => useHistory(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const item1 = {
        upc: '111111111111',
        product: { name: 'Product 1', brand: null, upcCode: '111111111111' },
      };

      const item2 = {
        upc: '222222222222',
        product: { name: 'Product 2', brand: null, upcCode: '222222222222' },
      };

      await act(async () => {
        await result.current.addToHistory(item1);
      });

      await act(async () => {
        await result.current.addToHistory(item2);
      });

      await waitFor(() => {
        expect(result.current.history).toHaveLength(2);
        expect(result.current.history[0].upc).toBe(item2.upc);
      });

      // Re-scan item1 - should move to top
      await act(async () => {
        await result.current.addToHistory(item1);
      });

      await waitFor(() => {
        expect(result.current.history).toHaveLength(2);
        expect(result.current.history[0].upc).toBe(item1.upc);
      });
    });

    it('enforces 50 item limit', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HistoryProvider>{children}</HistoryProvider>
      );

      const { result } = renderHook(() => useHistory(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Add 51 items
      for (let i = 0; i < 51; i++) {
        await act(async () => {
          await result.current.addToHistory({
            upc: `${i}`.padStart(12, '0'),
            product: { name: `Product ${i}`, brand: null, upcCode: `${i}`.padStart(12, '0') },
          });
        });
      }

      await waitFor(() => {
        expect(result.current.history).toHaveLength(50);
        expect(result.current.history[0].upc).toBe('000000000050');
        expect(result.current.history[49].upc).toBe('000000000001');
      });
    });

    it('persists history to AsyncStorage', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HistoryProvider>{children}</HistoryProvider>
      );

      const { result } = renderHook(() => useHistory(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const newItem = {
        upc: '123456789012',
        product: { name: 'Test Product', brand: null, upcCode: '123456789012' },
      };

      await act(async () => {
        await result.current.addToHistory(newItem);
      });

      await waitFor(async () => {
        const stored = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        expect(stored).toBeTruthy();
        const parsed = JSON.parse(stored!);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].upc).toBe(newItem.upc);
      });
    });
  });

  describe('removeFromHistory', () => {
    it('removes item from history', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HistoryProvider>{children}</HistoryProvider>
      );

      const { result } = renderHook(() => useHistory(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const item1 = {
        upc: '111111111111',
        product: { name: 'Product 1', brand: null, upcCode: '111111111111' },
      };

      const item2 = {
        upc: '222222222222',
        product: { name: 'Product 2', brand: null, upcCode: '222222222222' },
      };

      await act(async () => {
        await result.current.addToHistory(item1);
      });

      await act(async () => {
        await result.current.addToHistory(item2);
      });

      await waitFor(() => {
        expect(result.current.history).toHaveLength(2);
      });

      await act(async () => {
        await result.current.removeFromHistory(item1.upc);
      });

      await waitFor(() => {
        expect(result.current.history).toHaveLength(1);
        expect(result.current.history[0].upc).toBe(item2.upc);
      });
    });
  });

  describe('clearHistory', () => {
    it('clears all history', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <HistoryProvider>{children}</HistoryProvider>
      );

      const { result } = renderHook(() => useHistory(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.addToHistory({
          upc: '111111111111',
          product: { name: 'Product 1', brand: null, upcCode: '111111111111' },
        });
      });

      await act(async () => {
        await result.current.addToHistory({
          upc: '222222222222',
          product: { name: 'Product 2', brand: null, upcCode: '222222222222' },
        });
      });

      await waitFor(() => {
        expect(result.current.history).toHaveLength(2);
      });

      await act(async () => {
        await result.current.clearHistory();
      });

      await waitFor(() => {
        expect(result.current.history).toHaveLength(0);
      });

      await waitFor(async () => {
        const stored = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
        expect(stored).toBeNull();
      });
    });
  });
});
