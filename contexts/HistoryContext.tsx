import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const HISTORY_STORAGE_KEY = '@product_history';
const MAX_HISTORY_ITEMS = 50;

export interface HistoryItem {
  upc: string;
  timestamp: number;
  product: {
    name: string;
    brand: string | null;
    upcCode: string;
    imageUrl?: string | null;
  } | null; // null means "product not found"
}

interface HistoryContextType {
  history: HistoryItem[];
  loading: boolean;
  addToHistory: (item: Omit<HistoryItem, 'timestamp'>) => Promise<void>;
  clearHistory: () => Promise<void>;
  removeFromHistory: (upc: string) => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load history from AsyncStorage on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveHistory = async (newHistory: HistoryItem[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Failed to save history:', error);
      throw error;
    }
  };

  const addToHistory = async (item: Omit<HistoryItem, 'timestamp'>) => {
    // Check if this UPC already exists
    const existingIndex = history.findIndex((h) => h.upc === item.upc);

    let newHistory: HistoryItem[];

    if (existingIndex !== -1) {
      // Move to top (update timestamp)
      const updatedItem: HistoryItem = {
        ...item,
        timestamp: Date.now(),
      };
      newHistory = [
        updatedItem,
        ...history.filter((h) => h.upc !== item.upc),
      ];
    } else {
      // Add new item to top
      const newItem: HistoryItem = {
        ...item,
        timestamp: Date.now(),
      };
      newHistory = [newItem, ...history];

      // Enforce limit
      if (newHistory.length > MAX_HISTORY_ITEMS) {
        newHistory = newHistory.slice(0, MAX_HISTORY_ITEMS);
      }
    }

    await saveHistory(newHistory);
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
      throw error;
    }
  };

  const removeFromHistory = async (upc: string) => {
    const newHistory = history.filter((item) => item.upc !== upc);
    await saveHistory(newHistory);
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        loading,
        addToHistory,
        clearHistory,
        removeFromHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
